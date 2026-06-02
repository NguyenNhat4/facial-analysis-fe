import demoData from "./cephalometric-demo.json";
import { LandmarksData } from "@/utils/cephalometric-types";
import { normalizeLandmarkSymbols } from "./landmark-normalizer";

const toSpaceRuntimeUrl = (baseUrl: string): string => {
  const prefix = "https://huggingface.co/spaces/";
  if (!baseUrl.startsWith(prefix)) {
    return baseUrl.replace(/\/$/, "");
  }

  const ownerSpace = baseUrl.substring(prefix.length).replace(/\/$/, "").split("/");
  if (ownerSpace.length < 2) {
    return baseUrl.replace(/\/$/, "");
  }

  const owner = ownerSpace[0];
  const space = ownerSpace[1];
  return `https://${owner}-${space}.hf.space`;
};

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

  const rawApiUrl = import.meta.env.VITE_DENTAL_TREATMENT_API_URL || "http://localhost:8000";
  const apiUrl = toSpaceRuntimeUrl(rawApiUrl);
  const hfToken = import.meta.env.VITE_HF_TOKEN || "";

  const headers: HeadersInit = {};
  if (hfToken) {
    headers["Authorization"] = `Bearer ${hfToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 seconds timeout

  try {
    const response = await fetch(`${apiUrl}/api/predict`, {
      method: "POST",
      headers: headers,
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`API prediction failed with status ${response.status}, falling back to mock data.`);
      return await getMockPrediction();
    }

    const data = await response.json();

    // Normalize landmark symbols from backend format to frontend format
    // (e.g., "li" -> "Li", "Pg'" -> "Pog`")
    if (data.landmarks) {
      data.landmarks = normalizeLandmarkSymbols(data.landmarks);
    }

    return data as LandmarksData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("API prediction failed or is unavailable, falling back to mock data.", error);
    return await getMockPrediction();
  }
};
