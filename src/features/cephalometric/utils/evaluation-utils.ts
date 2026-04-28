import { MeasurementResult } from "../types";
import {
  CEPHALOMETRIC_EVALUATION_CONFIG,
  EvaluationStatus,
  IndexCategory,
} from "../data/evaluation-config";

const INDEX_KEY_ALIASES: Record<string, string> = {
  i_MP: "i/MP",
};

export interface EvaluationResult {
  indexName: string;
  category: IndexCategory;
  value: number;
  status: EvaluationStatus;
  message: string;
  unit: string;
}

function resolveEvaluationKey(measurementKey: string, measurementName: string): string | null {
  const keyCandidates = [
    measurementKey,
    INDEX_KEY_ALIASES[measurementKey],
    measurementName,
    INDEX_KEY_ALIASES[measurementName],
  ].filter((candidate): candidate is string => Boolean(candidate));

  return (
    keyCandidates.find((candidate) => CEPHALOMETRIC_EVALUATION_CONFIG[candidate] !== undefined) ??
    null
  );
}

export function evaluateCephIndex(indexName: string, value: number): EvaluationResult | null {
  const config = CEPHALOMETRIC_EVALUATION_CONFIG[indexName];

  if (!config) {
    return null;
  }

  let status: EvaluationStatus = "NORMAL";
  let message = config.evaluations.normal;

  if (value < config.min) {
    status = "LOW";
    message = config.evaluations.low;
  } else if (value > config.max) {
    status = "HIGH";
    message = config.evaluations.high;
  }

  return {
    indexName: config.name,
    category: config.category,
    value,
    status,
    message,
    unit: config.unit,
  };
}

export function evaluatePatientDataFromMeasurements(
  measurements: Record<string, MeasurementResult>
): EvaluationResult[] {
  const results: EvaluationResult[] = [];

  for (const [measurementKey, measurement] of Object.entries(measurements)) {
    if (measurement.classification === "error") {
      continue;
    }

    const evaluationKey = resolveEvaluationKey(measurementKey, measurement.name);
    if (!evaluationKey) {
      continue;
    }

    const evaluatedResult = evaluateCephIndex(evaluationKey, measurement.value);
    if (evaluatedResult) {
      results.push(evaluatedResult);
    }
  }

  return results;
}
