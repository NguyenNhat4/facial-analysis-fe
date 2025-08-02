import React from "react";

const toolbarButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(203, 213, 225, 0.8)",
  fontSize: "14px",
  fontWeight: "600",
  letterSpacing: "0.025em",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  textAlign: "center" as const,
  minWidth: "120px",
  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
};

export const getButtonStyle = (
  isActive: boolean,
  isDisabled: boolean
): React.CSSProperties => ({
  ...toolbarButtonStyle,
  backgroundColor: isDisabled
    ? "rgba(148, 163, 184, 0.1)"
    : isActive
    ? "linear-gradient(135deg, #3b82f6, #1e40af)"
    : "rgba(255, 255, 255, 0.95)",
  background: isDisabled
    ? "rgba(148, 163, 184, 0.1)"
    : isActive
    ? "linear-gradient(135deg, #3b82f6, #1e40af)"
    : "rgba(255, 255, 255, 0.95)",
  color: isDisabled ? "#94a3b8" : isActive ? "#ffffff" : "#1e293b",
  cursor: isDisabled ? "not-allowed" : "pointer",
  opacity: isDisabled ? 0.6 : 1,
  border: isActive ? "1px solid #2563eb" : "1px solid rgba(203, 213, 225, 0.8)",
  boxShadow: isActive
    ? "0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
    : isDisabled
    ? "none"
    : "0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
  transform: isActive ? "translateY(-1px)" : "none",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
});
