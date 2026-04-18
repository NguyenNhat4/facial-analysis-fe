import { Landmark } from "../types";
import { getCanonicalSymbol } from "../landmark-registry";

/**
 * Normalize landmark symbols from backend API format to frontend format.
 * 
 * Uses the centralized landmark registry to resolve aliases and standardize names.
 * This ensures consistency regardless of how the backend API names landmarks.
 * 
 * Example conversions:
 * - "li" -> "Li" (resolves via registry aliases)
 * - "Pg'" -> "Pog`" (resolves via registry aliases)
 * 
 * @param landmarks - Array of landmarks from API
 * @returns - Normalized landmarks array with canonical symbols
 */
export function normalizeLandmarkSymbols(landmarks: Landmark[]): Landmark[] {
  return landmarks.map(landmark => ({
    ...landmark,
    symbol: getCanonicalSymbol(landmark.symbol),
  }));
}
