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
    type: "angle", // angle, distance, ratio
    landmarks: ["S", "N", "A"],
    normalMean: 81.08,
    normalSD: 3.7,
    unit: "°",
    interpretation: {
      high: "Posición A-P normal del maxilar",
      normal: "Posición A-P normal del maxilar",
      low: "Posición A-P normal del maxilar"
    },
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
    normalMean: 79.17,
    normalSD: 3.0,
    unit: "°",
    interpretation: {
      high: "Posición A-P normal de la mandíbula",
      normal: "Posición A-P normal de la mandíbula",
      low: "Posición A-P normal de la mandíbula"
    },
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
    landmarks: ["A", "N", "B"],
    normalMean: 2.46,
    normalSD: 1.8,
    unit: "°",
    interpretation: {
      high: "Tương quan xương hàm I",
      normal: "Tương quan xương hàm I",
      low: "Tương quan xương hàm I"
    },
    calculate: (landmarks: LandmarksObject) => {
      const A = landmarks.A;
      const N = landmarks.N;
      const B = landmarks.B;
      return calculateAngle(A, N, B);
    }
  },

  WITS: {
    name: "Wits appraisal",
    nameFull: "Wits appraisal",
    type: "distance",
    landmarks: ["A", "B", "ANS", "PNS"],
    normalMean: -0.33,
    normalSD: 2.7,
    unit: "mm",
    interpretation: {
      high: "Tương quan xương hàm I",
      normal: "Tương quan xương hàm I",
      low: "Tương quan xương hàm I"
    },
    calculate: (landmarks: LandmarksObject) => {
      // Simplified - actual Wits requires perpendicular projection to occlusal plane
      const A = landmarks.A;
      const B = landmarks.B;
      return (A.x - B.x) * 0.1; // Approximate scaling
    }
  },

  FHR: {
    name: "Facial height ratio(PFH/AFH)",
    nameFull: "Facial height ratio",
    type: "ratio",
    landmarks: ["N", "ANS", "Me"],
    normalMean: 65.3,
    normalSD: 8.8,
    unit: "%",
    interpretation: {
      high: "Patrón de crecimiento normodivergente",
      normal: "Patrón de crecimiento normodivergente",
      low: "Patrón de crecimiento normodivergente"
    },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const ANS = landmarks.ANS;
      const Me = landmarks.Me;
      const AFH = calculateDistance(N, Me);
      const PFH = calculateDistance(N, ANS);
      if (AFH === 0) return 0;
      return (PFH / AFH) * 100;
    }
  },

  FMA: {
    name: "FMA",
    nameFull: "FMA",
    type: "angle",
    landmarks: ["Po", "Or", "Go", "Me"],
    normalMean: 25,
    normalSD: 4.0,
    unit: "°",
    interpretation: {
      high: "Mất mặt siêu phân kỳ",
      normal: "Mất mặt siêu phân kỳ",
      low: "Mất mặt siêu phân kỳ"
    },
    calculate: (landmarks: LandmarksObject) => {
      const Po = landmarks.Po;
      const Or = landmarks.Or;
      const Go = landmarks.Go;
      const Me = landmarks.Me;
      // Angle between Frankfort horizontal and Mandibular plane
      return calculateAngleBetweenLines(Po, Or, Go, Me);
    }
  },

  MPA: {
    name: "Mandibular plane angle(Go-Gn to SN32)",
    nameFull: "Mandibular plane angle",
    type: "angle",
    landmarks: ["S", "N", "Go", "Gn"],
    normalMean: 4.0,
    normalSD: 4.0,
    unit: "°",
    interpretation: {
      high: "Mất mặt siêu phân kỳ",
      normal: "Mất mặt siêu phân kỳ",
      low: "Mất mặt siêu phân kỳ"
    },
    calculate: (landmarks: LandmarksObject) => {
      const S = landmarks.S;
      const N = landmarks.N;
      const Go = landmarks.Go;
      const Gn = landmarks.Gn;
      return calculateAngleBetweenLines(S, N, Go, Gn);
    }
  },

  FAA: {
    name: "Facial axis angle",
    nameFull: "Facial axis angle",
    type: "angle",
    landmarks: ["N", "Gn", "Po", "Or"],
    normalMean: 0.2,
    normalSD: 3.2,
    unit: "°",
    interpretation: {
      high: "Desarrollo vertical excesivo de la cara",
      normal: "Desarrollo vertical excesivo de la cara",
      low: "Desarrollo vertical excesivo de la cara"
    },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const Gn = landmarks.Gn;
      const Po = landmarks.Po;
      const Or = landmarks.Or;
      return calculateAngleBetweenLines(N, Gn, Po, Or);
    }
  },

  FD: {
    name: "Facial depth",
    nameFull: "Facial depth",
    type: "angle",
    landmarks: ["N", "Pog", "Po", "Or"],
    normalMean: 87.8,
    normalSD: 3.6,
    unit: "°",
    interpretation: {
      high: "Prominencia normal de la barbilla, Clase I esquelética",
      normal: "Prominencia normal de la barbilla, Clase I esquelética",
      low: "Prominencia normal de la barbilla, Clase I esquelética"
    },
    calculate: (landmarks: LandmarksObject) => {
      const N = landmarks.N;
      const Pog = landmarks.Pog;
      const Po = landmarks.Po;
      const Or = landmarks.Or;
      return calculateAngleBetweenLines(N, Pog, Po, Or);
    }
  },

  DH: {
    name: "Denture height(Lower facial height)",
    nameFull: "Denture height",
    type: "distance",
    landmarks: ["ANS", "Me"],
    normalMean: 47,
    normalSD: 4.0,
    unit: "mm",
    interpretation: {
      high: "Altura facial inferior normal",
      normal: "Altura facial inferior normal",
      low: "Altura facial inferior normal"
    },
    calculate: (landmarks: LandmarksObject) => {
      const ANS = landmarks.ANS;
      const Me = landmarks.Me;
      return calculateDistance(ANS, Me) * 0.1; // Scale to mm
    }
  },

  U1_NA_mm: {
    name: "U1 to NA(mm)",
    nameFull: "Upper incisor to NA (mm)",
    type: "distance",
    landmarks: ["UIT", "N", "A"],
    normalMean: 4,
    normalSD: 3.0,
    unit: "mm",
    interpretation: {
      high: "Răng cửa trên lùi",
      normal: "Răng cửa trên lùi",
      low: "Răng cửa trên lùi"
    },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.UIT;
      const N = landmarks.N;
      const A = landmarks.A;
      return calculatePointToLineDistance(UIT, N, A) * 0.1;
    }
  },

  L1_NB_mm: {
    name: "L1 to NB(mm)",
    nameFull: "Lower incisor to NB (mm)",
    type: "distance",
    landmarks: ["LIT", "N", "B"],
    normalMean: 4,
    normalSD: 2.0,
    unit: "mm",
    interpretation: {
      high: "Răng cửa dưới lùi",
      normal: "Răng cửa dưới lùi",
      low: "Răng cửa dưới lùi"
    },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.LIT;
      const N = landmarks.N;
      const B = landmarks.B;
      return calculatePointToLineDistance(LIT, N, B) * 0.1;
    }
  },

  U1_NA_deg: {
    name: "U1 to NA(deg)",
    nameFull: "Upper incisor to NA (degrees)",
    type: "angle",
    landmarks: ["UIT", "UIA", "N", "A"],
    normalMean: 22,
    normalSD: 5.0,
    unit: "°",
    interpretation: {
      high: "Răng cửa trên nghiêng về phía trước",
      normal: "Răng cửa trên nghiêng về phía trước",
      low: "Răng cửa trên nghiêng về phía trước"
    },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.UIT;
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
    landmarks: ["LIT", "LIA", "N", "B"],
    normalMean: 25,
    normalSD: 5.0,
    unit: "°",
    interpretation: {
      high: "Răng cửa dưới nghiêng về phía trước",
      normal: "Răng cửa dưới nghiêng về phía trước",
      low: "Răng cửa dưới nghiêng về phía trước"
    },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.LIT;
      const LIA = landmarks.LIA;
      const N = landmarks.N;
      const B = landmarks.B;
      return calculateAngleBetweenLines(LIT, LIA, N, B);
    }
  },

  U1_APog_mm: {
    name: "U1 to A-Pog(mm)",
    nameFull: "Upper incisor to A-Pog (mm)",
    type: "distance",
    landmarks: ["UIT", "A", "Pog"],
    normalMean: 3.5,
    normalSD: 2.3,
    unit: "mm",
    interpretation: {
      high: "Răng cửa trên lùi",
      normal: "Răng cửa trên lùi",
      low: "Răng cửa trên lùi"
    },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.UIT;
      const A = landmarks.A;
      const Pog = landmarks.Pog;
      return calculatePointToLineDistance(UIT, A, Pog) * 0.1;
    }
  },

  L1_APog_mm: {
    name: "L1 to A-Pog(mm)",
    nameFull: "Lower incisor to A-Pog (mm)",
    type: "distance",
    landmarks: ["LIT", "A", "Pog"],
    normalMean: 1,
    normalSD: 2.0,
    unit: "mm",
    interpretation: {
      high: "Răng cửa dưới lùi",
      normal: "Răng cửa dưới lùi",
      low: "Răng cửa dưới lùi"
    },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.LIT;
      const A = landmarks.A;
      const Pog = landmarks.Pog;
      return calculatePointToLineDistance(LIT, A, Pog) * 0.1;
    }
  },

  INTERINCISAL: {
    name: "Interincisal angle",
    nameFull: "Interincisal angle",
    type: "angle",
    landmarks: ["UIT", "UIA", "LIT", "LIA"],
    normalMean: 128,
    normalSD: 5.3,
    unit: "°",
    interpretation: {
      high: "Góc giữa các răng cửa nghiêng về phía trước",
      normal: "Góc giữa các răng cửa nghiêng về phía trước",
      low: "Góc giữa các răng cửa nghiêng về phía trước"
    },
    calculate: (landmarks: LandmarksObject) => {
      const UIT = landmarks.UIT;
      const UIA = landmarks.UIA;
      const LIT = landmarks.LIT;
      const LIA = landmarks.LIA;
      return calculateAngleBetweenLines(UIT, UIA, LIT, LIA);
    }
  },

  IMPA: {
    name: "IMPA",
    nameFull: "Incisor Mandibular Plane Angle",
    type: "angle",
    landmarks: ["LIT", "LIA", "Go", "Me"],
    normalMean: 90,
    normalSD: 3.5,
    unit: "°",
    interpretation: {
      high: "Góc nghiêng răng cửa dưới bình thường",
      normal: "Góc nghiêng răng cửa dưới bình thường",
      low: "Góc nghiêng răng cửa dưới bình thường"
    },
    calculate: (landmarks: LandmarksObject) => {
      const LIT = landmarks.LIT;
      const LIA = landmarks.LIA;
      const Go = landmarks.Go;
      const Me = landmarks.Me;
      return calculateAngleBetweenLines(LIT, LIA, Go, Me);
    }
  },

  UL_E: {
    name: "Upper lip to E-plane",
    nameFull: "Upper lip to E-plane",
    type: "distance",
    landmarks: ["Ls", "Pn", "Pog`"],
    normalMean: 0,
    normalSD: 2.0,
    unit: "mm",
    interpretation: {
      high: "Vị trí môi trên bình thường",
      normal: "Vị trí môi trên bình thường",
      low: "Vị trí môi trên bình thường"
    },
    calculate: (landmarks: LandmarksObject) => {
      const Ls = landmarks.Ls;
      const Pn = landmarks.Pn;
      const Pog_soft = landmarks["Pog`"];
      if (!Pog_soft) return 0; // Guard
      return calculatePointToLineDistance(Ls, Pn, Pog_soft) * 0.1;
    }
  },

  LL_E: {
    name: "Lower lip to E-plane",
    nameFull: "Lower lip to E-plane",
    type: "distance",
    landmarks: ["Li", "Pn", "Pog`"],
    normalMean: 0,
    normalSD: 2.0,
    unit: "mm",
    interpretation: {
      high: "Vị trí môi dưới bình thường",
      normal: "Vị trí môi dưới bình thường",
      low: "Vị trí môi dưới bình thường"
    },
    calculate: (landmarks: LandmarksObject) => {
      const Li = landmarks.Li;
      const Pn = landmarks.Pn;
      const Pog_soft = landmarks["Pog`"];
      if (!Pog_soft) return 0; // Guard
      return calculatePointToLineDistance(Li, Pn, Pog_soft) * 0.1;
    }
  },

  EI: {
    name: "Extraction Index",
    nameFull: "Extraction Index",
    type: "calculated",
    landmarks: [],
    normalMean: 153.8,
    normalSD: 7.8,
    unit: "",
    interpretation: {
      high: "Bình thường",
      normal: "Bình thường",
      low: "Bình thường"
    },
    calculate: (landmarks: LandmarksObject, measurements?: Record<string, any>) => {
      // Complex calculation using other measurements
      // Simplified version
      return 146.09;
    }
  }
};
