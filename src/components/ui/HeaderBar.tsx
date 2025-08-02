import React from "react";
import { getButtonStyle } from "../../styles/buttonStyles.js";

interface HeaderBarProps {
  isProcessing: boolean;
  loading: boolean;
  axesLoading: boolean;
  models: any[];
  showLabels: boolean;
  showSegments: boolean;
  showAxes: boolean;
  showCrossSection: boolean;
  wireframeMode: boolean;
  xrayMode: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  triggerFileUpload: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleLabels: () => void;
  handleToggleSegments: () => void;
  handleToggleAxes: () => void;
  handleCrossSection: () => void;
  handleWireframeToggle: () => void;
  handleXrayToggle: () => void;
  handleCameraPreset: (preset: string) => void;
}

export default function HeaderBar({
  isProcessing,
  loading,
  axesLoading,
  models,
  showLabels,
  showSegments,
  showAxes,
  showCrossSection,
  wireframeMode,
  xrayMode,
  fileInputRef,
  triggerFileUpload,
  handleFileUpload,
  handleToggleLabels,
  handleToggleSegments,
  handleToggleAxes,
  handleCrossSection,
  handleWireframeToggle,
  handleXrayToggle,
  handleCameraPreset,
}: HeaderBarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(203, 213, 225, 0.3)",
        padding: "16px 24px",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingRight: "20px",
          borderRight: "1px solid rgba(203, 213, 225, 0.4)",
        }}
      >
        <img
          src="../../assets/hiai-logo.png"
          alt="Logo"
          style={{
            height: "44px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }}
        />
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            letterSpacing: "-0.025em",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Môi Trường 3D
        </div>
      </div>

      {/* Main Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: 1,
        }}
      >
        {/* File Upload */}
        <button
          onClick={triggerFileUpload}
          disabled={loading || isProcessing || axesLoading}
          style={{
            ...getButtonStyle(false, loading || isProcessing || axesLoading),
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          Tải Lên Tệp
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".obj,.mtl,.stl"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {/* Toggle Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleToggleLabels}
            disabled={
              models.length === 0 ||
              (isProcessing && !showLabels) ||
              axesLoading
            }
            style={{
              ...getButtonStyle(
                showLabels,
                models.length === 0 ||
                  (isProcessing && !showLabels) ||
                  axesLoading
              ),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            {showLabels ? "Ẩn Nhãn" : "Hiện Nhãn"}
          </button>
          <button
            onClick={handleToggleSegments}
            disabled={
              models.length === 0 ||
              (isProcessing && !showSegments) ||
              axesLoading
            }
            style={{
              ...getButtonStyle(
                showSegments,
                models.length === 0 ||
                  (isProcessing && !showSegments) ||
                  axesLoading
              ),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            {showSegments ? "Ẩn Phân Đoạn" : "Hiện Phân Đoạn"}
          </button>
          <button
            onClick={handleToggleAxes}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                showAxes,
                models.length === 0 || isProcessing || axesLoading
              ),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            {showAxes ? "Ẩn Trục" : "Hiện Trục"}
          </button>
        </div>

        {/* 3D Controls Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "16px",
            borderLeft: "1px solid rgba(203, 213, 225, 0.4)",
          }}
        >
          <button
            onClick={handleCrossSection}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                showCrossSection,
                models.length === 0 || isProcessing || axesLoading
              ),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Mặt Cắt Ngang
          </button>
          <button
            onClick={handleWireframeToggle}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                wireframeMode,
                models.length === 0 || isProcessing || axesLoading
              ),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Khung Dây
          </button>
          <button
            onClick={handleXrayToggle}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                xrayMode,
                models.length === 0 || isProcessing || axesLoading
              ),
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Tia X
          </button>
        </div>

        {/* Camera Presets */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            paddingLeft: "16px",
            borderLeft: "1px solid rgba(203, 213, 225, 0.4)",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: "600",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Góc Nhìn:
          </span>
          <button
            onClick={() => handleCameraPreset("front")}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                false,
                models.length === 0 || isProcessing || axesLoading
              ),
              padding: "6px 10px",
              minWidth: "60px",
              fontSize: "12px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Mặt Trước
          </button>
          <button
            onClick={() => handleCameraPreset("side")}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                false,
                models.length === 0 || isProcessing || axesLoading
              ),
              padding: "6px 10px",
              minWidth: "60px",
              fontSize: "12px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Mặt Bên
          </button>
          <button
            onClick={() => handleCameraPreset("top")}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                false,
                models.length === 0 || isProcessing || axesLoading
              ),
              padding: "6px 10px",
              minWidth: "60px",
              fontSize: "12px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Mặt Trên
          </button>
          <button
            onClick={() => handleCameraPreset("occlusal")}
            disabled={models.length === 0 || isProcessing || axesLoading}
            style={{
              ...getButtonStyle(
                false,
                models.length === 0 || isProcessing || axesLoading
              ),
              padding: "6px 10px",
              minWidth: "70px",
              fontSize: "12px",
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            }}
          >
            Khớp Cắn
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1))",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#1e40af",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "500",
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              borderTop: "2px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          {showSegments ? "Đang xử lý..." : "Đang tải nhãn..."}
        </div>
      )}
    </div>
  );
}
