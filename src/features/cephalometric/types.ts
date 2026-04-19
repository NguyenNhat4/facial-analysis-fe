export interface Point {
  x: number;
  y: number;
}

export interface Landmark {
  symbol: string;
  value: Point;
}

export interface LandmarksData {
  landmarks: Landmark[];
}

export interface LandmarksObject {
  [symbol: string]: Point;
}

export interface MeasurementConfig {
  name: string;
  nameFull: string;
  type: "angle" | "distance" | "ratio" | "calculated";
  landmarks: string[];
  normal: {
    male: { mean: number; sd: number; };
    female: { mean: number; sd: number; };
  };
  unit: string;
  interpretation: {
    high?: string;
    normal: string;
    low?: string;
    moderate?: string;
    severe?: string;
    [key: string]: string | undefined;
  };
  calculate: (landmarks: LandmarksObject, measurements?: Record<string, any>) => number;
}

export interface MeasurementResult {
  name: string;
  value: number;
  mean: number;
  sd: number;
  unit: string;
  classification: "normal" | "moderate" | "severe" | "error";
  significance: string;
  interpretation: string;
}
