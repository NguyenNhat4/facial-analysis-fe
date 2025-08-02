import React from "react";
import { Predictions } from "../types";

interface PredictionResultsProps {
  predictions: Predictions;
  loading: boolean;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  predictions,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner"></div>
        <span className="ml-2">Đang xử lý dự đoán...</span>
      </div>
    );
  }

  if (!predictions) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>
          Chưa có dự đoán nào. Hãy điền vào form và nhấp "Thực hiện dự đoán" để
          xem kết quả.
        </p>
      </div>
    );
  }

  const formatPredictionValue = (value: number, classes: number): string => {
    if (classes === 2) {
      return value === 0 ? "Không" : "Có";
    } else if (classes === 6) {
      const toothMap: Record<number, string> = {
        0: "Không cần nhổ răng",
        1: "Răng tiền hàm thứ nhất",
        2: "Răng tiền hàm thứ hai",
        3: "Răng hàm thứ nhất",
        4: "Răng hàm thứ hai",
        5: "Răng khác",
      };
      return toothMap[value] || `Loại ${value}`;
    }
    return value.toString();
  };

  const formatTargetName = (target: string): string => {
    const targetNames: Record<string, string> = {
      extraction: "Nhổ răng",
      which_tooth: "Răng nào cần nhổ",
      upper_arch_expand: "Nong hàm trên",
      lower_arch_expand: "Nong hàm dưới",
      upper_stripping: "Mài răng trên",
      lower_stripping: "Mài răng dưới",
      minivis_ht: "Mini-vis HT",
      minivis_hd: "Mini-vis HD",
    };
    return (
      targetNames[target] ||
      target.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 0.9) return "text-green-600";
    if (accuracy >= 0.8) return "text-blue-600";
    if (accuracy >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  if (predictions.type === "multi-output") {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Dự đoán đa mục tiêu</h3>
        {Object.entries(predictions.data.results).map(
          ([modelName, modelResults]) => (
            <div key={modelName} className="card">
              <h4 className="font-semibold text-lg mb-3 text-blue-600">
                Mô hình {modelName}
              </h4>
              {"error" in modelResults ? (
                <div className="alert alert-error">
                  <strong>Lỗi:</strong>{" "}
                  {(modelResults as { error: string }).error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(modelResults).map(([target, result]) => (
                    <div
                      key={target}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {formatTargetName(target)}:
                        </span>
                        <span className="font-semibold text-blue-600">
                          {formatPredictionValue(
                            result.prediction,
                            target === "which_tooth" ? 6 : 2
                          )}
                        </span>
                      </div>
                      {result.probability && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-600">
                            Độ tin cậy:
                          </div>
                          <div className="flex gap-2 text-sm">
                            {result.probability.map((prob, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 px-2 py-1 rounded"
                              >
                                Loại {idx}: {(prob * 100).toFixed(1)}%
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
  }

  if (predictions.type === "single-target") {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">
          Dự đoán cho {formatTargetName(predictions.target)}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(predictions.data.model_predictions).map(
            ([modelName, result]) => (
              <div key={modelName} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg text-blue-600">
                    {modelName}
                  </h4>
                  {result.accuracy && (
                    <div className="text-sm">
                      <div
                        className={`font-medium ${getAccuracyColor(
                          result.accuracy
                        )}`}
                      >
                        Độ chính xác: {(result.accuracy * 100).toFixed(1)}%
                      </div>
                      {result.f1_score && (
                        <div className="text-gray-600">
                          F1 Score: {(result.f1_score * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {result.error ? (
                  <div className="alert alert-error">
                    <strong>Lỗi:</strong> {result.error}
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <span className="font-medium">Dự đoán: </span>
                      <span className="font-semibold text-green-600 text-lg">
                        {formatPredictionValue(
                          result.prediction,
                          predictions.target === "which_tooth" ? 6 : 2
                        )}
                      </span>
                    </div>

                    {result.probability && (
                      <div>
                        <div className="font-medium mb-2">
                          Xác suất các lớp:
                        </div>
                        <div className="space-y-2">
                          {result.probability.map((prob, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <span className="text-sm font-medium w-16">
                                Loại {idx}:
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                <div
                                  className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                  style={{ width: `${prob * 100}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Summary Stats */}
        <div className="card">
          <h4 className="font-semibold text-lg mb-3">
            Tóm tắt hiệu suất mô hình
          </h4>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Mô hình</th>
                  <th>Dự đoán</th>
                  <th>Độ chính xác</th>
                  <th>F1 Score</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(predictions.data.model_predictions).map(
                  ([modelName, result]) => (
                    <tr key={modelName}>
                      <td className="font-medium">{modelName}</td>
                      <td>
                        {result.error ? (
                          <span className="text-red-600">Lỗi</span>
                        ) : (
                          <span className="font-semibold">
                            {formatPredictionValue(
                              result.prediction,
                              predictions.target === "which_tooth" ? 6 : 2
                            )}
                          </span>
                        )}
                      </td>
                      <td
                        className={
                          result.accuracy
                            ? getAccuracyColor(result.accuracy)
                            : "text-gray-400"
                        }
                      >
                        {result.accuracy
                          ? `${(result.accuracy * 100).toFixed(1)}%`
                          : "N/A"}
                      </td>
                      <td className="text-gray-600">
                        {result.f1_score
                          ? `${(result.f1_score * 100).toFixed(1)}%`
                          : "N/A"}
                      </td>
                      <td>
                        {result.error ? (
                          <span className="text-red-600">Thất bại</span>
                        ) : (
                          <span className="text-green-600">Thành công</span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PredictionResults;
