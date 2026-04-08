import { Landmark, LandmarksObject, MeasurementResult } from "../../features/cephalometric/types";
import { MEASUREMENTS_CONFIG, getClassification, getSignificance } from "./measurements-config";

/**
 * Convert landmarks array to object with symbol as key
 * @param landmarksArray - Array of landmarks from JSON
 * @returns - Object with symbol as key
 */
export function landmarksArrayToObject(landmarksArray: Landmark[]): LandmarksObject {
  const obj: LandmarksObject = {};
  landmarksArray.forEach(lm => {
    if (lm && lm.symbol && lm.value) {
      obj[lm.symbol] = lm.value;
    }
  });
  return obj;
}

/**
 * Calculate all measurements
 * @param landmarksObj - Landmarks object with symbol as key
 * @returns - Object containing all measurements
 */
export function calculateAllMeasurements(landmarksObj: LandmarksObject): Record<string, MeasurementResult> {
  const results: Record<string, MeasurementResult> = {};

  for (const [key, config] of Object.entries(MEASUREMENTS_CONFIG)) {
    try {
      // Check if all required landmarks are present
      const hasAllLandmarks = config.landmarks.every(symbol => landmarksObj[symbol] !== undefined);

      if (!hasAllLandmarks) {
        throw new Error(`Missing landmarks for ${key}`);
      }

      const value = config.calculate(landmarksObj, results);
      const classification = getClassification(value, config.normalMean, config.normalSD);
      const significance = getSignificance(value, config.normalMean, config.normalSD);

      results[key] = {
        name: config.name,
        value: value,
        mean: config.normalMean,
        sd: config.normalSD,
        unit: config.unit,
        classification: classification,
        significance: significance,
        interpretation: config.interpretation[classification as string] || config.interpretation.normal
      };
    } catch (error) {
      // console.warn(`Error calculating ${key}:`, error);
      results[key] = {
        name: config.name,
        value: 0,
        mean: config.normalMean,
        sd: config.normalSD,
        unit: config.unit,
        classification: 'error',
        significance: '',
        interpretation: 'Error calculating or missing landmarks'
      };
    }
  }

  return results;
}
