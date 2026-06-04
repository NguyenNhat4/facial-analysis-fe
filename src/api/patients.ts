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

export function getAbsoluteImageUrl(imageId?: number | string): string {
  if (!imageId) return "";
  return `${API_BASE}/images/${imageId}/file`;
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

// --- Images & Analysis ---

export interface PatientImagesResponse {
  xray?: ImageBackendResponse;
  frontal?: ImageBackendResponse;
  profile?: ImageBackendResponse;
}

export function usePatientImages(patientId: number | string | undefined) {
  return useQuery<PatientImagesResponse>({
    queryKey: [API_BASE, "patients", patientId, "images"],
    queryFn: async () => {
      const res = await apiRequest("GET", `${API_BASE}/patients/${patientId}/images`);
      return res.json();
    },
    enabled: !!patientId,
  });
}

export function usePatientAnalyses(patientId: number | string | undefined) {
  return useQuery<AnalysisBackendResponse[]>({
    queryKey: [API_BASE, "analysis", "patient", patientId],
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
      queryClient.invalidateQueries({ queryKey: [API_BASE, "patients", variables.patientId, "images"] });
    },
  });
}

export function useSaveAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { patient_id: number; image_id: number; landmarks?: any[]; confidence_score?: number }) => {
      const res = await apiRequest("POST", `${API_BASE}/analysis/save`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      const patientId = variables.patient_id;
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: [API_BASE, "analysis", "patient", patientId] });
        queryClient.invalidateQueries({ queryKey: [API_BASE, "patients", patientId, "images"] });
      }
    },
  });
}
