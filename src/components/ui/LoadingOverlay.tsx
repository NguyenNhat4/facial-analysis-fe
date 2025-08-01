function LoadingOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          border: "4px solid rgba(59, 130, 246, 0.2)",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      />
      <div
        style={{
          color: "#e2e8f0",
          fontSize: "18px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        Đang tải mô hình 3D...
      </div>
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          border: none;
        }
        
        input[type="range"]::-ms-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        
        /* Custom scrollbar for toolbar */
        .control-panel::-webkit-scrollbar {
          width: 6px;
        }
        
        .control-panel::-webkit-scrollbar-track {
          background: rgba(203, 213, 225, 0.2);
          border-radius: 3px;
        }
        
        .control-panel::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        
        .control-panel::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

export default LoadingOverlay;
