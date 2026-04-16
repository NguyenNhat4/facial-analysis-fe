import demoData from "../data/cephalometric-demo.json";
import { LandmarksData } from "../types";

export const getMockPrediction = (): Promise<LandmarksData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoData as LandmarksData);
    }, 1000); // Simulate network delay
  });
};

export const predictLandmarks = async (file: File): Promise<LandmarksData> => {
  const formData = new FormData();
  formData.append("file", file);

  const apiUrl = import.meta.env.VITE_DENTAL_TREATMENT_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn(`API prediction failed with status ${response.status}, falling back to mock data.`);
      return await getMockPrediction();
    }

    const data = await response.json();
    return data as LandmarksData;
  } catch (error) {
    console.warn("API prediction failed or is unavailable, falling back to mock data.", error);
    return await getMockPrediction();
  }
};
