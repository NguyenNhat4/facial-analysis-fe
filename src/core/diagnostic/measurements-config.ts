import { calculateAngle, calculateAngleBetweenLines, calculateDistance, calculatePointToLineDistance, Point } from "../geometry/math-utils";
import { LandmarksObject, MeasurementConfig } from "../../features/cephalometric/types";

// Helper function to get classification
export function getClassification(value: number, mean: number, sd: number): "normal" | "moderate" | "severe" {
  const diff = Math.abs(value - mean);
  if (diff <= sd) return 'normal';
  if (diff <= 2 * sd) return 'moderate';
  return 'severe';
}

// Helper function to get significance stars
export function getSignificance(value: number, mean: number, sd: number): string {
  const diff = Math.abs(value - mean);
  if (diff <= sd) return '';
  if (diff <= 2 * sd) return '*';
  if (diff <= 3 * sd) return '**';
  return '***';
}

export const MEASUREMENTS_CONFIG: Record<string, MeasurementConfig> = {
  SNA: {
    name: "SNA",
    nameFull: "SNA",
    type: "angle",
    landmarks: ["S", "N", "A"],
    normalMean: 84.13, // (84.33 + 83.93) / 2
    normalSD: 4.085, // (4.42 + 3.75) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const S = landmarks.S;
      const N = landmarks.N;
      const A = landmarks.A;
      return calculateAngle(S, N, A);
    }
  },

  SNB: {
    name: "SNB",
    nameFull: "SNB",
    type: "angle",
    landmarks: ["S", "N", "B"],
    normalMean: 80.795, // (80.98 + 80.61) / 2
    normalSD: 4.09, // (4.36 + 3.82) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const S = landmarks.S;
      const N = landmarks.N;
      const B = landmarks.B;
      return calculateAngle(S, N, B);
    }
  },

  ANB: {
    name: "ANB",
    nameFull: "ANB",
    type: "angle",
    landmarks: ["N", "A", "B"],
    normalMean: 3.33, // (3.34 + 3.32) / 2
    normalSD: 2.25, // (2.22 + 2.28) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const A = landmarks.A;
      const B = landmarks.B;
      return calculateAngle(A, N, B);
    }
  },

  U1_NA_mm: {
    name: "U1 to NA(mm)",
    nameFull: "Upper incisor to NA (mm)",
    type: "distance",
    landmarks: ["I", "N", "A"],
    normalMean: 5.0, // (5.07 + 4.93) / 2
    normalSD: 2.285, // (2.26 + 2.31) / 2
    unit: "mm",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.I;
      const N = landmarks.N;
      const A = landmarks.A;
      return calculatePointToLineDistance(UIT, N, A) * 0.1;
    }
  },

  L1_NB_mm: {
    name: "L1 to NB(mm)",
    nameFull: "Lower incisor to NB (mm)",
    type: "distance",
    landmarks: ["i", "N", "B"],
    normalMean: 6.205, // (6.25 + 6.16) / 2
    normalSD: 2.135, // (2.18 + 2.09) / 2
    unit: "mm",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.i;
      const N = landmarks.N;
      const B = landmarks.B;
      return calculatePointToLineDistance(LIT, N, B) * 0.1;
    }
  },

  U1_NA_deg: {
    name: "U1 to NA(deg)",
    nameFull: "Upper incisor to NA (degrees)",
    type: "angle",
    landmarks: ["I", "UIA", "N", "A"],
    normalMean: 22, // No new data for angle in formular.md, kept original
    normalSD: 5.0, // No new data for angle in formular.md, kept original
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.I;
      const UIA = landmarks.UIA;
      const N = landmarks.N;
      const A = landmarks.A;
      return calculateAngleBetweenLines(UIT, UIA, N, A);
    }
  },

  L1_NB_deg: {
    name: "L1 to NB(deg)",
    nameFull: "Lower incisor to NB (degrees)",
    type: "angle",
    landmarks: ["i", "LIA", "N", "B"],
    normalMean: 25, // No new data for angle in formular.md, kept original
    normalSD: 5.0, // No new data for angle in formular.md, kept original
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.i;
      const LIA = landmarks.LIA;
      const N = landmarks.N;
      const B = landmarks.B;
      return calculateAngleBetweenLines(LIT, LIA, N, B);
    }
  },

  IMPA: {
    name: "IMPA",
    nameFull: "Incisor Mandibular Plane Angle",
    type: "angle",
    landmarks: ["i", "LIA", "go", "Me"],
    normalMean: 95.94, // (96.79 + 95.09) / 2
    normalSD: 6.91, // (6.86 + 6.96) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.i;
      const LIA = landmarks.LIA;
      const Go = landmarks.go;
      const Me = landmarks.Me;
      return calculateAngleBetweenLines(LIT, LIA, Go, Me);
    }
  }
};
