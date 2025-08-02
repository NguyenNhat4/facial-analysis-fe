import React from "react";
import { toothData } from "../../data/toothData";

interface ControlPanelProps {
  models: any[];
  isAnyLoading: boolean;
  upperJawOffset: number;
  lightingIntensity: number;
  showCrossSection: boolean;
  crossSectionAxis: "x" | "y" | "z";
  crossSectionPosition: number;
  loading: boolean;
  isProcessing: boolean;
  axesLoading: boolean;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLightingIntensity: (value: number) => void;
  setCrossSectionAxis: (axis: "x" | "y" | "z") => void;
  setCrossSectionPosition: (position: number) => void;
  resetAllSettings: () => void;
  handleCameraPreset: (preset: string) => void;
}

export default function ControlPanel({
  models,
  isAnyLoading,
  upperJawOffset,
  lightingIntensity,
  showCrossSection,
  crossSectionAxis,
  crossSectionPosition,
  loading,
  isProcessing,
  axesLoading,
  handleSliderChange,
  setLightingIntensity,
  setCrossSectionAxis,
  setCrossSectionPosition,
  resetAllSettings,
  handleCameraPreset,
}: ControlPanelProps) {
  if (models.length === 0 || isAnyLoading) return null;

  return (
    <div
      className="control-panel"
      style={{
        position: "absolute",
        top: "120px",
        right: 24,
        bottom: 24,
        width: "280px",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
        backdropFilter: "blur(12px)",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid rgba(203, 213, 225, 0.3)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        overflowY: "auto",
      }}
    >
      {/* Toolbar Header */}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#1e293b",
          textAlign: "center",
          marginBottom: "12px",
          paddingBottom: "12px",
          borderBottom: "2px solid rgba(203, 213, 225, 0.3)",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        Bảng Điều Khiển
      </div>

      {/* Upper Jaw Position Section */}
      <div
        style={{
          background: "rgba(59, 130, 246, 0.05)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Vị Trí Hàm Trên
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={upperJawOffset}
            onChange={handleSliderChange}
            disabled={
              models.length === 0 || loading || isProcessing || axesLoading
            }
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                (upperJawOffset / 30) * 100
              }%, #e2e8f0 ${(upperJawOffset / 30) * 100}%, #e2e8f0 100%)`,
              outline: "none",
              cursor:
                models.length === 0 || loading || isProcessing || axesLoading
                  ? "not-allowed"
                  : "pointer",
              opacity:
                models.length === 0 || loading || isProcessing || axesLoading
                  ? 0.6
                  : 1,
              appearance: "none",
              WebkitAppearance: "none",
            }}
          />
          <div
            style={{
              fontSize: "14px",
              color: "#475569",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              fontWeight: "700",
              background: "rgba(59, 130, 246, 0.1)",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            +{upperJawOffset.toFixed(1)}
          </div>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#64748b",
            textAlign: "center",
            fontStyle: "italic",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Điều chỉnh khoảng cách dọc giữa hàm trên và hàm dưới
        </div>
      </div>

      {/* Lighting Controls Section */}
      <div
        style={{
          background: "rgba(251, 191, 36, 0.05)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(251, 191, 36, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Điều Khiển Ánh Sáng
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={lightingIntensity}
            onChange={(e) => setLightingIntensity(parseFloat(e.target.value))}
            disabled={
              models.length === 0 || loading || isProcessing || axesLoading
            }
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                ((lightingIntensity - 0.1) / 1.9) * 100
              }%, #e2e8f0 ${
                ((lightingIntensity - 0.1) / 1.9) * 100
              }%, #e2e8f0 100%)`,
              outline: "none",
              cursor:
                models.length === 0 || loading || isProcessing || axesLoading
                  ? "not-allowed"
                  : "pointer",
              opacity:
                models.length === 0 || loading || isProcessing || axesLoading
                  ? 0.6
                  : 1,
              appearance: "none",
              WebkitAppearance: "none",
            }}
          />
          <div
            style={{
              fontSize: "14px",
              color: "#475569",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              fontWeight: "700",
              background: "rgba(251, 191, 36, 0.1)",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            {lightingIntensity.toFixed(1)}x
          </div>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#64748b",
            textAlign: "center",
            fontStyle: "italic",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Điều chỉnh cường độ ánh sáng tổng thể để có tầm nhìn tốt hơn
        </div>
      </div>

      {/* Cross Section Controls - Only show when active */}
      {showCrossSection && (
        <div
          style={{
            background: "rgba(34, 197, 94, 0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Mặt Cắt Ngang
          </div>
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Chọn Trục:
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["x", "y", "z"] as const).map((axis) => (
                <button
                  key={axis}
                  onClick={() => setCrossSectionAxis(axis)}
                  disabled={models.length === 0}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    border: "1px solid rgba(203, 213, 225, 0.8)",
                    background:
                      crossSectionAxis === axis
                        ? "#22c55e"
                        : "rgba(255, 255, 255, 0.95)",
                    color: crossSectionAxis === axis ? "white" : "#1e293b",
                    cursor: models.length === 0 ? "not-allowed" : "pointer",
                    opacity: models.length === 0 ? 0.6 : 1,
                    transition: "all 0.2s ease",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                  }}
                >
                  {axis.toUpperCase()} Trục
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={crossSectionPosition}
              onChange={(e) =>
                setCrossSectionPosition(parseFloat(e.target.value))
              }
              disabled={models.length === 0}
              style={{
                flex: 1,
                height: "8px",
                borderRadius: "4px",
                background: `linear-gradient(to right, #22c55e 0%, #22c55e 50%, #e2e8f0 50%, #e2e8f0 100%)`,
                outline: "none",
                cursor: models.length === 0 ? "not-allowed" : "pointer",
                opacity: models.length === 0 ? 0.6 : 1,
                appearance: "none",
                WebkitAppearance: "none",
              }}
            />
            <div
              style={{
                fontSize: "14px",
                color: "#475569",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                fontWeight: "700",
                background: "rgba(34, 197, 94, 0.1)",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                minWidth: "80px",
                textAlign: "center",
              }}
            >
              {crossSectionPosition}
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              textAlign: "center",
              fontStyle: "italic",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Định vị mặt phẳng cắt ngang dọc theo trục{" "}
            {crossSectionAxis.toUpperCase()}- trục
          </div>
        </div>
      )}

      {/* Model Information Section */}
      <div
        style={{
          background: "rgba(139, 92, 246, 0.05)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Thông Tin Mô Hình
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#64748b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Tổng Số Mô Hình:
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#1e293b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {models.length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#64748b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Tệp OBJ:
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#1e293b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {models.filter((m) => m.type === "obj").length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#64748b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Tệp STL:
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#1e293b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {models.filter((m) => m.type === "stl").length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#64748b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              Tổng Số Răng:
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#1e293b",
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              {toothData.length}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div
        style={{
          background: "rgba(239, 68, 68, 0.05)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Thao Tác Nhanh
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={resetAllSettings}
            disabled={models.length === 0}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: "600",
              cursor: models.length === 0 ? "not-allowed" : "pointer",
              opacity: models.length === 0 ? 0.6 : 1,
              transition: "all 0.2s ease",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Đặt Lại Tất Cả Cài Đặt
          </button>
          <button
            onClick={() => handleCameraPreset("front")}
            disabled={models.length === 0}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: "600",
              cursor: models.length === 0 ? "not-allowed" : "pointer",
              opacity: models.length === 0 ? 0.6 : 1,
              transition: "all 0.2s ease",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Đặt Lại Góc Nhìn Camera
          </button>
        </div>
      </div>
    </div>
  );
}
