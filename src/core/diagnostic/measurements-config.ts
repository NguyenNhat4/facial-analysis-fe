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
    normal: {
      male: { mean: 84.33, sd: 4.42 },
      female: { mean: 83.93, sd: 3.75 }
    },
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
    normal: {
      male: { mean: 80.98, sd: 4.36 },
      female: { mean: 80.61, sd: 3.82 }
    },
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
    normal: {
      male: { mean: 3.34, sd: 2.22 },
      female: { mean: 3.32, sd: 2.28 }
    },
    unit: "°",
    interpretation: { high: "", normal: "", low: "" },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const A = landmarks.A;
      const B = landmarks.B;
      return calculateAngle(A, N, B);
    }
  },

  Z: {
    name: "Z",
    nameFull: "Z angle",
    type: "angle",
    landmarks: ["Pog`", "Li", "Po", "Or"],
    normal: {
      male: { mean: 74.06, sd: 6.73 },
      female: { mean: 76.62, sd: 5.56 }
    },
    unit: "°",
    interpretation: { high: "Môi dưới hoặc cằm nằm trước đường tham chiếu nhiều hơn.", normal: "Góc Z hài hòa.", low: "Môi dưới hoặc cằm lùi hơn so với chuẩn." },
    calculate: (landmarks: LandmarksObject) => {
      const Pog_soft = landmarks["Pog`"];
      const Li = landmarks.Li;
      const Po = landmarks.Po;
      const Or = landmarks.Or;
      return calculateAngleBetweenLines(Pog_soft, Li, Po, Or);
    }
  },

  "I-NA": {
    name: "I-NA",
    nameFull: "Upper incisor to NA (mm)",
    type: "distance",
    landmarks: ["I", "N", "A"],
    normal: {
      male: { mean: 5.07, sd: 2.26 },
      female: { mean: 4.93, sd: 2.31 }
    },
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
    normal: {
      male: { mean: 6.25, sd: 2.18 },
      female: { mean: 6.16, sd: 2.09 }
    },
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
    normal: {
      male: { mean: 96.79, sd: 6.86 },
      female: { mean: 95.09, sd: 6.96 }
    },
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

  FMIA: {
    name: "FMIA",
    nameFull: "Frankfort Mandibular Incisor Angle",
    type: "angle",
    landmarks: ["i", "LIA", "Po", "Or"],
    normal: {
      male: { mean: 58.05, sd: 7.69 },
      female: { mean: 58.82, sd: 7.35 }
    },
    unit: "°",
    interpretation: { high: "Răng cửa dưới ngả trong hơn so với mặt phẳng Frankfort.", normal: "Trục răng cửa dưới hài hòa với mặt phẳng Frankfort.", low: "Răng cửa dưới ngả ra trước hơn so với mặt phẳng Frankfort." },
    calculate: (landmarks: LandmarksObject) => {
      const i = landmarks.i;
      const LIA = landmarks.LIA;
      const Po = landmarks.Po;
      const Or = landmarks.Or;
      return calculateAngleBetweenLines(i, LIA, Po, Or);
    }
  },

  "N-Me": {
    name: "N-Me",
    nameFull: "N-Me (mm)",
    type: "distance",
    landmarks: ["N", "Me"],
    normal: {
      male: { mean: 115.10, sd: 7.30 },
      female: { mean: 112.15, sd: 6.38 }
    },
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
    normal: {
      male: { mean: 119.53, sd: 9.34 },
      female: { mean: 122.35, sd: 10.90 }
    },
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
    normal: {
      male: { mean: 1.77, sd: 2.37 },
      female: { mean: 1.37, sd: 2.08 }
    },
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
    normal: {
      male: { mean: 0.44, sd: 2.34 },
      female: { mean: -0.21, sd: 1.87 }
    },
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
    normal: {
      male: { mean: 161.28, sd: 6.03 },
      female: { mean: 162.85, sd: 5.49 }
    },
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
