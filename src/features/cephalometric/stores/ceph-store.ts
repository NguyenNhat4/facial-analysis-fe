import { create } from "zustand";
import { LandmarksData, LandmarksObject, MeasurementResult, Point } from "../types";
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

  // Ruler state
  rulerVisible: boolean;
  rulerStart: Point;
  rulerEnd: Point;
  pixelsPerMm: number;
  rulerLengthMm: number;

  // Actions
  setLoadedImageSrc: (src: string | null) => void;
  setShowLandmarkNames: (show: boolean) => void;
  setHoveredMeasurement: (measurement: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  setRulerVisible: (visible: boolean) => void;
  updateRulerPoint: (point: "start" | "end", x: number, y: number) => void;
  setRulerLengthMm: (length: number) => void;

  // Data actions
  setLandmarksData: (data: LandmarksData) => void;
  loadJsonData: (data: LandmarksData) => void;
  uploadAndDetect: (file: File) => Promise<void>;
  reset: () => void;
  updateLandmark: (symbol: string, x: number, y: number) => void;
  recalculateMeasurements: (gender?: string) => void;
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

  rulerVisible: false,
  rulerStart: { x: 50, y: 50 },
  rulerEnd: { x: 50, y: 150 },
  pixelsPerMm: 10,
  rulerLengthMm: 10,

  setLoadedImageSrc: (src) => set({ loadedImageSrc: src }),
  setShowLandmarkNames: (show) => set({ showLandmarkNames: show }),
  setHoveredMeasurement: (measurement) => set({ hoveredMeasurement: measurement }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setRulerVisible: (visible) => set({ rulerVisible: visible }),
  
  updateRulerPoint: (point, x, y) => {
    const state = get();
    const newStart = point === "start" ? { x, y } : state.rulerStart;
    const newEnd = point === "end" ? { x, y } : state.rulerEnd;
    
    // distance between start and end is considered as rulerLengthMm
    const dist = Math.hypot(newEnd.x - newStart.x, newEnd.y - newStart.y);
    // minimum distance to avoid division by zero
    const safeDist = Math.max(1, dist);
    const newPixelsPerMm = safeDist / state.rulerLengthMm;
    
    set({
      rulerStart: newStart,
      rulerEnd: newEnd,
      pixelsPerMm: newPixelsPerMm,
    });
    
    // Auto recalculate after updating scale
    get().recalculateMeasurements();
  },

  setRulerLengthMm: (length: number) => {
    if (length <= 0) return;
    const state = get();
    
    const dist = Math.hypot(state.rulerEnd.x - state.rulerStart.x, state.rulerEnd.y - state.rulerStart.y);
    const safeDist = Math.max(1, dist);
    const newPixelsPerMm = safeDist / length;

    set({ rulerLengthMm: length, pixelsPerMm: newPixelsPerMm });
    get().recalculateMeasurements();
  },

  setLandmarksData: (data) => {
    const obj = landmarksArrayToObject(data.landmarks);
    const sex = usePatientStore.getState().patientData?.sex as "male" | "female" || "male";
    const measurements = calculateAllMeasurements(obj, sex, get().pixelsPerMm);
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
    const measurements = calculateAllMeasurements(obj, sex, state.pixelsPerMm);
    set({ landmarksData: newData, landmarksObj: obj, measurements });
  },

  reset: () => {
    set({ hoveredMeasurement: null });
  },

  recalculateMeasurements: (gender?: string) => {
    const state = get();
    if (!state.landmarksObj) return;
    
    const sexStr = gender || usePatientStore.getState().patientData?.sex || "male";
    const sex = (sexStr as "male" | "female");
    const measurements = calculateAllMeasurements(state.landmarksObj, sex, state.pixelsPerMm);
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
