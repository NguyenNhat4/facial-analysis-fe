// Type definitions
export interface ToothData {
  label: string;
  position: [number, number, number];
  jaw: "upper" | "lower";
}

export interface ModelData {
  type: "obj" | "stl";
  objUrl?: string;
  mtlUrl?: string | null;
  stlUrl?: string;
  key: string;
  name: string;
}

// Tooth data with upper/lower jaw classification
export const toothData: ToothData[] = [
  { label: "31", position: [2.0, 2, 25], jaw: "lower" },
  { label: "32", position: [8, 2.5, 24], jaw: "lower" },
  { label: "33", position: [14.8, 2.5, 21.5], jaw: "lower" },
  { label: "34", position: [19, 2.5, 15.5], jaw: "lower" },
  { label: "35", position: [22.8, 3, 7.2], jaw: "lower" },
  { label: "36", position: [24.8, 3.5, 0], jaw: "lower" },
  { label: "37", position: [28, 5.5, -10.2], jaw: "lower" },
  { label: "41", position: [-2.9, 2, 25], jaw: "lower" },
  { label: "42", position: [-9.2, 2, 23.5], jaw: "lower" },
  { label: "43", position: [-15, 2, 21.2], jaw: "lower" },
  { label: "44", position: [-20, 2, 13.5], jaw: "lower" },
  { label: "45", position: [-23, 2.2, 6], jaw: "lower" },
  { label: "46", position: [-26, 3.2, 0], jaw: "lower" },
  { label: "47", position: [-30, 6.2, -12], jaw: "lower" },
  { label: "21", position: [5.0, 8.6, 25.5], jaw: "upper" },
  { label: "22", position: [12.5, 8.6, 23.2], jaw: "upper" },
  { label: "23", position: [19.5, 8.6, 17.5], jaw: "upper" },
  { label: "24", position: [25, 8.6, 10.5], jaw: "upper" },
  { label: "25", position: [28, 8.6, 2.5], jaw: "upper" },
  { label: "26", position: [30, 8.6, -3], jaw: "upper" },
  { label: "11", position: [-3.0, 8.6, 26], jaw: "upper" },
  { label: "12", position: [-12.0, 8.6, 22], jaw: "upper" },
  { label: "13", position: [-17.8, 8.6, 18], jaw: "upper" },
  { label: "14", position: [-23.0, 9.6, 10.5], jaw: "upper" },
  { label: "15", position: [-27.0, 8.6, 2.5], jaw: "upper" },
  { label: "16", position: [-28.5, 9, -3.5], jaw: "upper" },
  { label: "17", position: [-32, 11, -14.5], jaw: "upper" },
];
