import { create } from "zustand";
import { LandmarksData, LandmarksObject, MeasurementResult } from "../types";
import { landmarksArrayToObject, calculateAllMeasurements } from "../../../core/diagnostic/calculations";
import { predictLandmarks } from "../services/ai-prediction";
import { usePatientStore } from "../../patient/stores/patient-store";

interface CephState {
  loadedImageSrc: string | null;
  landmarksData: LandmarksData | null;
  landmarksObj: LandmarksObject | null;
  measurements: Record<string, MeasurementResult>;
  loading: boolean;
  showLandmarkNames: boolean;
  hoveredMeasurement: string | null;
  error: string | null;

  // Actions
  setLoadedImageSrc: (src: string | null) => void;
  setShowLandmarkNames: (show: boolean) => void;
  setHoveredMeasurement: (measurement: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Data actions
  setLandmarksData: (data: LandmarksData) => void;
  loadJsonData: (data: LandmarksData) => void;
  uploadAndDetect: (file: File) => Promise<void>;
  reset: () => void;
  updateLandmark: (symbol: string, x: number, y: number) => void;
  recalculateMeasurements: (gender: string) => void;
}

export const useCephStore = create<CephState>((set, get) => ({
  loadedImageSrc: null,
  landmarksData: null,
  landmarksObj: null,
  measurements: {},
  loading: false,
  showLandmarkNames: false,
  hoveredMeasurement: null,
  error: null,

  setLoadedImageSrc: (src) => set({ loadedImageSrc: src }),
  setShowLandmarkNames: (show) => set({ showLandmarkNames: show }),
  setHoveredMeasurement: (measurement) => set({ hoveredMeasurement: measurement }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setLandmarksData: (data) => {
    const obj = landmarksArrayToObject(data.landmarks);
    const sex = usePatientStore.getState().patientData?.sex as "male" | "female" || "male";
    const measurements = calculateAllMeasurements(obj, sex);
    set({ landmarksData: data, landmarksObj: obj, measurements });
  },

  loadJsonData: (data) => {
    get().setLandmarksData(data);
  },

  uploadAndDetect: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const data = await predictLandmarks(file);

      // Update store
      get().setLandmarksData(data);
    } catch (err: any) {
      set({ error: err.message || "Failed to process image" });
    } finally {
      set({ loading: false });
    }
  },

  updateLandmark: (symbol: string, x: number, y: number) => {
    const state = get();
    if (!state.landmarksData) return;

    // Create a new data object with the updated landmark
    const newLandmarks = state.landmarksData.landmarks.map(lm =>
      lm.symbol === symbol ? { ...lm, value: { x, y } } : lm
    );

    const newData: LandmarksData = {
      ...state.landmarksData,
      landmarks: newLandmarks
    };

    const obj = landmarksArrayToObject(newData.landmarks);
    const sex = usePatientStore.getState().patientData?.sex as "male" | "female" || "male";
    const measurements = calculateAllMeasurements(obj, sex);
    set({ landmarksData: newData, landmarksObj: obj, measurements });
  },

  reset: () => {
    // Note: We don't revokeObjectURL here because we want to persist it,
    // or we should handle it carefully if we want to reset the session.
    // For now, reset just clears the hover state like the original code
    set({ hoveredMeasurement: null });
  },

  recalculateMeasurements: (gender: string) => {
    const state = get();
    if (!state.landmarksObj) return;
    
    const sex = (gender as "male" | "female") || "male";
    const measurements = calculateAllMeasurements(state.landmarksObj, sex);
    set({ measurements });
  }
}));

// Subscribe to patient gender changes
usePatientStore.subscribe((state, prevState) => {
  const newSex = state.patientData?.sex;
  const oldSex = prevState?.patientData?.sex;

  if (newSex && newSex !== oldSex) {
    useCephStore.getState().recalculateMeasurements(newSex);
  }
});
