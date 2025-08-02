import React from "react";
import { Model } from "../types";

interface ModelInfoProps {
  models: Model[];
}

const ModelInfo: React.FC<ModelInfoProps> = ({ models }) => {
  if (!models || models.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Không có mô hình nào khả dụng. Hãy đảm bảo API server đang chạy.</p>
      </div>
    );
  }

  // Group models by target
  const modelsByTarget = models.reduce<Record<string, Model[]>>(
    (acc, model) => {
      if (!acc[model.target]) {
        acc[model.target] = [];
      }
      acc[model.target].push(model);
      return acc;
    },
    {}
  );

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

  const getAccuracyColor = (accuracy?: number): string => {
    if (!accuracy) return "text-gray-400";
    if (accuracy >= 0.9) return "text-green-600";
    if (accuracy >= 0.8) return "text-blue-600";
    if (accuracy >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyBadge = (accuracy?: number): string => {
    if (!accuracy) return "bg-gray-100 text-gray-800";
    if (accuracy >= 0.9) return "bg-green-100 text-green-800";
    if (accuracy >= 0.8) return "bg-blue-100 text-blue-800";
    if (accuracy >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPerformanceLabel = (accuracy?: number): string => {
    if (!accuracy) return "N/A";
    if (accuracy >= 0.9) return "Xuất sắc";
    if (accuracy >= 0.8) return "Tốt";
    if (accuracy >= 0.7) return "Khá";
    return "Kém";
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {Object.keys(modelsByTarget).length}
          </div>
          <div className="text-gray-600">Mục tiêu dự đoán</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">11</div>
          <div className="text-gray-600">Tổng số mô hình</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">
            {(
              (models.reduce((sum, model) => sum + (model.accuracy || 0), 0) /
                models.length) *
              100
            ).toFixed(1)}
            %
          </div>
          <div className="text-gray-600">Độ chính xác trung bình</div>
        </div>
      </div>

      {/* Models by Target */}
      {Object.entries(modelsByTarget).map(([target, targetModels]) => (
        <div key={target} className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {formatTargetName(target)}
            <span className="ml-2 text-sm text-gray-500">
              ({targetModels[0]?.classes} lớp)
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Mô hình</th>
                  <th>Độ chính xác</th>
                  <th>F1 Score</th>
                  <th>Hiệu suất</th>
                </tr>
              </thead>
              <tbody>
                {targetModels
                  .sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0))
                  .map((model) => (
                    <tr key={`${model.target}_${model.model_name}`}>
                      <td className="font-medium">{model.model_name}</td>
                      <td className={getAccuracyColor(model.accuracy)}>
                        {model.accuracy
                          ? `${(model.accuracy * 100).toFixed(2)}%`
                          : "N/A"}
                      </td>
                      <td className="text-gray-600">
                        {model.f1_score
                          ? `${(model.f1_score * 100).toFixed(2)}%`
                          : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyBadge(
                            model.accuracy
                          )}`}
                        >
                          {getPerformanceLabel(model.accuracy)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Best Model Highlight */}
          {targetModels.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium">
                  🏆 Mô hình tốt nhất:
                </span>
                <span className="font-semibold">
                  {
                    targetModels.reduce((best, current) =>
                      (current.accuracy || 0) > (best.accuracy || 0)
                        ? current
                        : best
                    ).model_name
                  }
                </span>
                <span className="text-blue-600">
                  (
                  {(
                    (targetModels.reduce((best, current) =>
                      (current.accuracy || 0) > (best.accuracy || 0)
                        ? current
                        : best
                    ).accuracy || 0) * 100
                  ).toFixed(2)}
                  % độ chính xác)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Model Performance Comparison */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">
          So sánh hiệu suất mô hình
        </h3>
        <div className="space-y-4">
          {[
            "CNN",
            "MLP",
            "Random Forest",
            "XGBoost",
            "SVM",
            "Decision Tree",
            "KNN",
            "Logistic Regression",
            "LightGBM",
            "CatBoost",
          ].map((modelType) => {
            const modelInstances = models.filter(
              (m) => m.model_name === modelType
            );
            if (modelInstances.length === 0) return null;

            const avgAccuracy =
              modelInstances.reduce((sum, m) => sum + (m.accuracy || 0), 0) /
              modelInstances.length;

            return (
              <div key={modelType} className="flex items-center gap-4">
                <div className="w-32 font-medium">{modelType}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-500 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${avgAccuracy * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                    {(avgAccuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 w-20">
                  {modelInstances.length} mục tiêu
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Information */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">
          Thông tin mục tiêu dự đoán
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(modelsByTarget).map(([target, targetModels]) => (
            <div key={target} className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-2">
                {formatTargetName(target)}
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Lớp: {targetModels[0]?.classes}</div>
                <div>Mô hình: {targetModels.length}</div>
                <div>
                  Độ chính xác tốt nhất:{" "}
                  {targetModels.length > 0
                    ? `${(
                        Math.max(...targetModels.map((m) => m.accuracy || 0)) *
                        100
                      ).toFixed(1)}%`
                    : "N/A"}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Mô tả:
                  </div>
                  <div className="text-xs">
                    {target === "extraction" &&
                      "Dự đoán có cần nhổ răng hay không"}
                    {target === "which_tooth" &&
                      "Xác định răng nào cần được nhổ"}
                    {target.includes("arch_expand") &&
                      "Dự đoán nhu cầu nong hàm"}
                    {target.includes("stripping") && "Dự đoán nhu cầu mài răng"}
                    {target.includes("minivis") &&
                      "Dự đoán điều trị bằng mini-screw/implant"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
