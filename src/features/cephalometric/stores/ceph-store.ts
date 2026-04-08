import { create } from "zustand";
import { LandmarksData, LandmarksObject, MeasurementResult } from "../types";
import { landmarksArrayToObject, calculateAllMeasurements } from "../../../core/diagnostic/calculations";
import { predictLandmarks } from "../services/ai-prediction";

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
    const measurements = calculateAllMeasurements(obj);
    set({ landmarksData: data, landmarksObj: obj, measurements });
  },

  loadJsonData: (data) => {
    get().setLandmarksData(data);
  },

  uploadAndDetect: async (file: File) => {
    set({ loading: true, error: null });
    try {
      // Create object URL for the image
      const src = URL.createObjectURL(file);

      const data = await predictLandmarks(file);

      // Update store
      set({ loadedImageSrc: src });
      get().setLandmarksData(data);
    } catch (err: any) {
      set({ error: err.message || "Failed to process image" });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    // Note: We don't revokeObjectURL here because we want to persist it,
    // or we should handle it carefully if we want to reset the session.
    // For now, reset just clears the hover state like the original code
    set({ hoveredMeasurement: null });
  }
}));
