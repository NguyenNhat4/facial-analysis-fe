import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

export interface NoteBackendResponse {
  id: number;
  patient_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PatientBackendResponse {
  id: number;
  fullname: string;
  phone: string;
  consultation_date: string;
  created_at: string;
  updated_at: string;
  notes?: NoteBackendResponse[];
}

export interface CreatePatientRequest {
  fullname: string;
  phone: string;
  consultation_date: string;
  note?: string;
}

export interface ImageBackendResponse {
  id: number;
  patient_id: number;
  filename: string;
  file_path: string;
  image_type: string;
  upload_date: string;
}

export function getAbsoluteImageUrl(imageId?: number | string, cacheBuster?: string | number): string {
  if (!imageId) return "";
  const url = `${API_BASE}/images/${imageId}/file`;
  return cacheBuster ? `${url}?t=${new Date(cacheBuster).getTime() || cacheBuster}` : url;
}

export interface AnalysisBackendResponse {
  id: number;
  patient_id: number;
  image_id: number;
  landmarks: string; // JSON string
  confidence_score: number;
  analysis_date: string;
}

const API_BASE = "http://localhost:8000/api/v1";

// --- Patients ---

export function usePatients(skip = 0, limit = 100) {
  return useQuery<PatientBackendResponse[]>({
    queryKey: [API_BASE, "patients", `?skip=${skip}&limit=${limit}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `${API_BASE}/patients/?skip=${skip}&limit=${limit}`);
      return res.json();
    },
  });
}

export function usePatient(patientId: number | string | undefined) {
  return useQuery<PatientBackendResponse>({
    queryKey: [API_BASE, "patients", patientId],
    queryFn: async () => {
      const res = await apiRequest("GET", `${API_BASE}/patients/${patientId}`);
      return res.json();
    },
    enabled: !!patientId,
  });
}

export function useSearchPatients(query: string) {
  return useQuery<PatientBackendResponse[]>({
    queryKey: [API_BASE, "patients", "search", query],
    queryFn: async () => {
      const res = await apiRequest("GET", `${API_BASE}/patients/search?q=${encodeURIComponent(query)}`);
      return res.json();
    },
    enabled: !!query,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePatientRequest) => {
      const res = await apiRequest("POST", `${API_BASE}/patients/`, data);
      return res.json() as Promise<PatientBackendResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "patients"] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePatientRequest> }) => {
      const res = await apiRequest("PUT", `${API_BASE}/patients/${id}`, data);
      return res.json() as Promise<PatientBackendResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "patients"] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/patients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed to delete patient: ${res.statusText}`);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "patients"] });
    },
  });
}

// --- Images & Analysis ---

export interface PatientImagesResponse {
  xray?: ImageBackendResponse;
  frontal?: ImageBackendResponse;
  profile?: ImageBackendResponse;
}

export function usePatientImages(patientId: number | string | undefined) {
  return useQuery<PatientImagesResponse>({
    queryKey: [API_BASE, "patients", String(patientId), "images"],
    queryFn: async () => {
      const res = await apiRequest("GET", `${API_BASE}/patients/${patientId}/images`);
      return res.json();
    },
    enabled: !!patientId,
  });
}

export function usePatientAnalyses(patientId: number | string | undefined) {
  return useQuery<AnalysisBackendResponse[]>({
    queryKey: [API_BASE, "analysis", "patient", String(patientId)],
    queryFn: async () => {
      const res = await apiRequest("GET", `${API_BASE}/analysis/patient/${patientId}`);
      return res.json();
    },
    enabled: !!patientId,
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ patientId, file, imageType }: { patientId: number | string; file: File; imageType: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      const url = `${API_BASE}/images/upload?patient_id=${patientId}&image_type=${imageType}`;
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed to upload image: ${res.statusText}`);
      }
      return res.json() as Promise<ImageBackendResponse>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "patients", String(variables.patientId), "images"] });
    },
  });
}

export function useSaveAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { patient_id: number; image_id: number; landmarks?: any[]; confidence_score?: number; analysis_id?: number; status?: string }) => {
      if (data.analysis_id) {
        const res = await apiRequest("PUT", `${API_BASE}/analysis/${data.analysis_id}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", `${API_BASE}/analysis/save`, data);
        return res.json();
      }
    },
    onSuccess: (_, variables) => {
      const patientId = variables.patient_id;
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: [API_BASE, "analysis", "patient", String(patientId)] });
        queryClient.invalidateQueries({ queryKey: [API_BASE, "patients", String(patientId), "images"] });
      }
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId, patientId }: { imageId: number; patientId?: number | string }) => {
      const res = await fetch(`${API_BASE}/images/${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed to delete image: ${res.statusText}`);
      }
      return true;
    },
    onSuccess: (_, variables) => {
      if (variables.patientId) {
        queryClient.invalidateQueries({ queryKey: [API_BASE, "patients", variables.patientId, "images"] });
      }
    },
  });
}

export function useDeleteImageAnalyses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId, patientId }: { imageId: number; patientId?: number | string }) => {
      const res = await fetch(`${API_BASE}/analysis/image/${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed to delete analysis: ${res.statusText}`);
      }
      return true;
    },
    onSuccess: (_, variables) => {
      if (variables.patientId) {
        const queryKey = [API_BASE, "analysis", "patient", String(variables.patientId)];
        
        // Optimistically remove the analysis from the cache so it doesn't stay stale
        queryClient.setQueryData<AnalysisBackendResponse[]>(queryKey, (oldData) => {
          if (!oldData) return [];
          return oldData.filter((analysis) => analysis.image_id !== variables.imageId);
        });

        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
