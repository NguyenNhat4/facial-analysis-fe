import { useState, useEffect } from "react";
import DentalFeatureForm from "./components/DentalFeatureForm";
import PredictionResults from "./components/PredictionResults";
import ModelInfo from "./components/ModelInfo";
import { Model, Predictions, Features, PredictionType, TabName } from "./types";

function Treatment() {
  const [activeTab, setActiveTab] = useState<TabName>("predict");
  const [predictions, setPredictions] = useState<Predictions>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>([]);

  const API_BASE_URL = import.meta.env.VITE_DENTAL_TREATMENT_API_URL;

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      if (response.ok) {
        const data: Model[] = await response.json();
        setModels(data);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const handlePrediction = async (
    features: Features,
    predictionType: PredictionType,
    selectedTarget: string | null = null
  ): Promise<void> => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/`;
      const body = features;

      if (predictionType === "multi-output") {
        url += "predict-multi-output";
      } else if (predictionType === "single-target" && selectedTarget) {
        url += `predict_all_models/${selectedTarget}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (predictionType === "multi-output") {
          setPredictions({ type: predictionType, data });
        } else {
          setPredictions({
            type: predictionType,
            data,
            target: selectedTarget!,
          });
        }
      } else {
        console.error("Prediction failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Hệ thống dự đoán điều trị nha khoa AI
        </h1>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 flex">
            <button
              onClick={() => setActiveTab("predict")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "predict"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Thực hiện dự đoán
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "models"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Thông tin mô hình
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "predict" && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Thông số bệnh nhân
              </h2>
              <DentalFeatureForm
                onPredict={handlePrediction}
                loading={loading}
                models={models}
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Kết quả dự đoán</h2>
              <PredictionResults predictions={predictions} loading={loading} />
            </div>
          </div>
        )}

        {activeTab === "models" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Các mô hình có sẵn</h2>
            <ModelInfo models={models} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Treatment;
