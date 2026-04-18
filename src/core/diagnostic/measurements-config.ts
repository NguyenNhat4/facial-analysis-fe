import { calculateAngle, calculateAngleBetweenLines, calculateDistance, calculatePointToLineDistance, calculatePointToLineSignedDistance, Point } from "../geometry/math-utils";
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

  "I-NA": {
    name: "I-NA",
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

  "i-NB": {
    name: "i-NB",
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

  "i_MP": {
    name: "i/MP",
    nameFull: "Incisor Mandibular Plane Angle",
    type: "angle",
    landmarks: ["i", "Go", "Me"],
    normalMean: 95.94, // (96.79 + 95.09) / 2
    normalSD: 6.91, // (6.86 + 6.96) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.i;
      const LIA = landmarks.LIA;
      const Go = landmarks.Go;
      const Me = landmarks.Me;
      return calculateAngleBetweenLines(LIT, LIA, Go, Me);
    }
  },

  "N-Me": {
    name: "N-Me",
    nameFull: "N-Me (mm)",
    type: "distance",
    landmarks: ["N", "Me"],
    normalMean: 113.625, // (115.10 + 112.15) / 2
    normalSD: 6.84, // (7.30 + 6.38) / 2
    unit: "mm",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const Me = landmarks.Me;
      return calculateDistance(N, Me) * 0.1;
    }
  },

  "I/i": {
    name: "I/i",
    nameFull: "Interincisal Angle",
    type: "angle",
    landmarks: ["I", "UIA", "i", "LIA"],
    normalMean: 120.94, // (119.53 + 122.35) / 2
    normalSD: 10.12, // (9.34 + 10.90) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.I;
      const UIA = landmarks.UIA;
      const LIT = landmarks.i;
      const LIA = landmarks.LIA;
      return calculateAngleBetweenLines(UIT, UIA, LIT, LIA);
    }
  },

  "Li-E": {
    name: "Li-E",
    nameFull: "Lower Lip to E-line",
    type: "distance",
    landmarks: ["Li", "Pn", "Pog`"],
    normalMean: 1.57, // (1.77 + 1.37) / 2
    normalSD: 2.225, // (2.37 + 2.08) / 2
    unit: "mm",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const Li = landmarks.Li;
      const Pn = landmarks.Pn;
      const Pog_soft = landmarks["Pog`"];
      // Pn to Pog' is directed top to bottom.
      // Point in front (right) means negative cross product if using crossProduct = (Bx-Ax)(Py-Ay) - (By-Ay)(Px-Ax)
      // Actually, if x goes right and y goes down, crossProduct for P(right of AB) is negative.
      // Let's use negative of the signed distance so right = positive.
      return -calculatePointToLineSignedDistance(Li, Pn, Pog_soft) * 0.1;
    }
  },

  "Ls-E": {
    name: "Ls-E",
    nameFull: "Upper Lip to E-line",
    type: "distance",
    landmarks: ["Ls", "Pn", "Pog`"],
    normalMean: 0.115, // (0.44 + -0.21) / 2
    normalSD: 2.105, // (2.34 + 1.87) / 2
    unit: "mm",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const Ls = landmarks.Ls;
      const Pn = landmarks.Pn;
      const Pog_soft = landmarks["Pog`"];
      return -calculatePointToLineSignedDistance(Ls, Pn, Pog_soft) * 0.1;
    }
  },

  "N-Sn-Pg": {
    name: "N-Sn-Pg",
    nameFull: "Soft Tissue Facial Angle",
    type: "angle",
    landmarks: ["N", "Sn", "Pog`"],
    normalMean: 162.065, // (161.28 + 162.85) / 2
    normalSD: 5.76, // (6.03 + 5.49) / 2
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const Sn = landmarks.Sn;
      const Pog_soft = landmarks["Pog`"];
      return calculateAngle(N, Sn, Pog_soft);
    }
  }
};
