import { useState, ChangeEvent, FormEvent } from "react";
import {
  Model,
  Features,
  PredictionType,
  PatientTemplate,
} from "../types";
import { defaultFeatures } from "../data/default_features";
import { patientTemplates } from "../data/patient_templates";
import { fieldTabs } from "../data/field_tabs";
import { sampleFeatures } from "../data/sample_data";

interface DentalFeatureFormProps {
  onPredict: (
    features: Features,
    predictionType: PredictionType,
    selectedTarget?: string | null
  ) => void;
  loading: boolean;
  models: Model[];
}

const DentalFeatureForm: React.FC<DentalFeatureFormProps> = ({
  onPredict,
  loading,
  models,
}) => {
  // Define state variables
  const [features, setFeatures] = useState<Features>(defaultFeatures);

  const [predictionType, setPredictionType] =
    useState<PredictionType>("multi-output");
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<"guided" | "advanced">("guided");

  // Input change handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : parseFloat(value)
          : parseInt(value),
    }));
  };

  // Get unique targets from models
  const targets: string[] = [...new Set(models.map((model) => model.target))];

  // Apply template
  const applyTemplate = (template: PatientTemplate): void => {
    setFeatures(template.data);
    setShowTemplates(false);
  };

  // Form submission handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onPredict(features, predictionType, selectedTarget);
  };

  // Load sample data
  const loadSampleData = (): void => {
    setFeatures(sampleFeatures);
  };

  // Reset form to default values
  const resetForm = (): void => {
    setFeatures(defaultFeatures);
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              Chế độ nhập liệu
            </h3>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="guided"
                  checked={inputMode === "guided"}
                  onChange={(e) =>
                    setInputMode(e.target.value as "guided" | "advanced")
                  }
                  className="mr-2"
                />
                <span className="text-sm">🎯 Hướng dẫn từng bước</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  value="advanced"
                  checked={inputMode === "advanced"}
                  onChange={(e) =>
                    setInputMode(e.target.value as "guided" | "advanced")
                  }
                  className="mr-2"
                />
                <span className="text-sm">⚡ Nhập nhanh (chuyên gia)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              📋 Mẫu có sẵn
            </button>
            <button
              type="button"
              onClick={loadSampleData}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              📊 Dữ liệu mẫu
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              🔄 Đặt lại
            </button>
          </div>
        </div>

        {/* Templates Panel */}
        {showTemplates && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h4 className="font-medium text-blue-700 mb-3">
              Chọn mẫu bệnh nhân:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patientTemplates.map((template, index) => (
                <div
                  key={index}
                  className="border border-blue-200 rounded-lg p-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <h5 className="font-medium text-blue-800">{template.name}</h5>
                  <p className="text-sm text-blue-600">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prediction Type Selection */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-800">Loại dự đoán</h3>
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="predictionType"
              value="multi-output"
              checked={predictionType === "multi-output"}
              onChange={(e) =>
                setPredictionType(e.target.value as PredictionType)
              }
              className="mr-3 mt-1"
            />
            <div>
              <span className="font-medium">🎯 Dự đoán đa mục tiêu</span>
              <p className="text-sm text-gray-600">
                Dự đoán tất cả các phương pháp điều trị cùng lúc (khuyến nghị)
              </p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer p-3 border rounded-lg hover:bg-white transition-colors">
            <input
              type="radio"
              name="predictionType"
              value="single-target"
              checked={predictionType === "single-target"}
              onChange={(e) =>
                setPredictionType(e.target.value as PredictionType)
              }
              className="mr-3 mt-1"
            />
            <div>
              <span className="font-medium">🔍 Dự đoán mục tiêu đơn</span>
              <p className="text-sm text-gray-600">
                Chọn một phương pháp điều trị cụ thể để phân tích
              </p>
            </div>
          </label>
        </div>

        {predictionType === "single-target" && (
          <div className="mt-4 p-4 bg-white border rounded-lg">
            <label className="block font-medium mb-2">
              Chọn mục tiêu điều trị:
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="form-select w-full"
              required
            >
              <option value="">-- Chọn phương pháp điều trị --</option>
              {targets.map((target) => (
                <option key={target} value={target}>
                  {target === "extraction" && "🦷 Nhổ răng"}
                  {target === "which_tooth" && "🔍 Răng nào cần nhổ"}
                  {target === "upper_arch_expand" && "⬆️ Nong hàm trên"}
                  {target === "lower_arch_expand" && "⬇️ Nong hàm dưới"}
                  {target === "upper_stripping" && "✂️ Mài răng trên"}
                  {target === "lower_stripping" && "✂️ Mài răng dưới"}
                  {target === "minivis_ht" && "🔩 Mini-vis HT"}
                  {target === "minivis_hd" && "🔩 Mini-vis HD"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMode === "guided" ? (
          // Guided Step-by-Step Mode
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {fieldTabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === index
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{tab.icon}</span>
                      {tab.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Tab Content */}
            <div className="space-y-6">
              {fieldTabs[activeTab].sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="bg-white border rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-3">
                      {sectionIndex + 1}
                    </span>
                    {section.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.name} className="form-group">
                        <label htmlFor={field.name} className="form-label">
                          {field.label}
                          {field.help && (
                            <span className="block text-xs text-gray-500 mt-1">
                              💡 {field.help}
                            </span>
                          )}
                        </label>
                        {field.type === "select" ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={features[field.name]}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            {field.options!.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={features[field.name]}
                            onChange={handleInputChange}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            className="form-input"
                            placeholder={field.help ? `VD: ${field.help}` : ""}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
                className="btn btn-secondary px-6 py-2 disabled:opacity-50"
              >
                ← Quay lại
              </button>

              <span className="text-sm text-gray-500">
                Bước {activeTab + 1} / {fieldTabs.length}
              </span>

              {activeTab < fieldTabs.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(Math.min(fieldTabs.length - 1, activeTab + 1))
                  }
                  className="btn btn-primary px-6 py-2"
                >
                  Tiếp theo →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (predictionType === "single-target" && !selectedTarget)
                  }
                  className="btn btn-primary px-8 py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "🤖 Thực hiện dự đoán"
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          // Advanced All-in-One Mode
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚡ <strong>Chế độ chuyên gia:</strong> Tất cả các trường được
                hiển thị cùng lúc. Phù hợp cho người dùng có kinh nghiệm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {fieldTabs.map((tab) =>
                tab.sections.map((section, sectionIndex) => (
                  <div
                    key={`${tab.title}-${sectionIndex}`}
                    className="bg-white border rounded-lg p-4"
                  >
                    <h4 className="font-semibold mb-3 text-gray-800 text-sm flex items-center">
                      <span className="mr-2">{tab.icon}</span>
                      {section.title}
                    </h4>

                    <div className="space-y-3">
                      {section.fields.map((field) => (
                        <div key={field.name} className="form-group">
                          <label
                            htmlFor={field.name}
                            className="form-label text-xs"
                          >
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <select
                              id={field.name}
                              name={field.name}
                              value={features[field.name]}
                              onChange={handleInputChange}
                              className="form-select text-xs"
                            >
                              {field.options!.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              value={features[field.name]}
                              onChange={handleInputChange}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              className="form-input text-xs"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={
                  loading ||
                  (predictionType === "single-target" && !selectedTarget)
                }
                className="btn btn-primary px-8 py-3 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "🤖 Thực hiện dự đoán"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DentalFeatureForm;
