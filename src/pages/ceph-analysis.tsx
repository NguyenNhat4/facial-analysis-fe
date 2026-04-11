import React, { useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  User,
  Activity,
  Target,
} from "lucide-react";

import { useCephStore } from "../features/cephalometric/stores/ceph-store";
import { InteractiveCanvas } from "../features/cephalometric/components/InteractiveCanvas";
import { MeasurementTable } from "../features/cephalometric/components/MeasurementTable";

// Import styles from reference project
import "./ceph-analysis.css";

export default function CephAnalysisPage() {
  const [location, setLocation] = useLocation();

  const {
    loadedImageSrc,
    loading,
    showLandmarkNames,
    setShowLandmarkNames,
    uploadAndDetect,
    setLoadedImageSrc,
    loadJsonData,
    reset,
    error,
    landmarksData
  } = useCephStore();

  // Demo patient data
  const patientData = {
    name: "DEMO PATIENT",
    id: "P2025-001",
    date: new Date().toLocaleDateString("en-GB"),
    age: 28,
    gender: "Demo Case",
  };

  // Parse query parameters for lateral image and trigger API
  useEffect(() => {
    const processImage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const lateral = urlParams.get("lateral");

      // Only trigger if we have a lateral param from the query and it's different from the currently loaded one,
      // or if we have no landmarksData for the current loaded image.
      if (lateral && (loadedImageSrc !== lateral || !landmarksData)) {
        setLoadedImageSrc(lateral);

        try {
          const response = await fetch(lateral);
          const blob = await response.blob();
          const file = new File([blob], "lateral.jpg", { type: blob.type });
          await uploadAndDetect(file);
        } catch (err: any) {
          console.error("Failed to load image for detection:", err);
          alert(err.message || "Lỗi tải ảnh");
        }
      }
    };

    processImage();
  }, [location, loadedImageSrc, landmarksData, setLoadedImageSrc, uploadAndDetect]);

  return (
    <div className="ceph-analysis-page min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25" style={{ backgroundColor: "#fafbfc" }}>
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-6">
              <Button
                onClick={() => setLocation("/")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Button>
              <div className="border-l-2 border-blue-200 pl-6">
                <h1 className="text-xl font-bold text-gray-800">
                  Phân Tích Cephalometric
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  AI-Powered Ceph Analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        <Card className="mb-8 border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    {patientData.name}
                  </CardTitle>
                  <p className="text-blue-100 text-sm">
                    ID: {patientData.id} • {patientData.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-500 text-white">
                  <Activity className="w-3 h-3 mr-1" />
                  Active Session
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Wrapper - Reference style grid */}
        <div className="content-wrapper">
          {/* Canvas Section */}
          <div className="canvas-section">
            <h2>
              <Target className="inline w-6 h-6 mr-2 text-blue-600" />
              Hình Ảnh X-quang
            </h2>

            <InteractiveCanvas />

            {/* Controls */}
            <div className="canvas-controls">
              {/* Toggle for landmark names */}
              <div className="toggle-container">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    id="toggleLandmarkNames"
                    className="toggle-checkbox"
                    checked={showLandmarkNames}
                    onChange={(e) => setShowLandmarkNames(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Hiển thị tên landmark</span>
                </label>
              </div>

              {loading && <div className="text-blue-600 font-medium">Đang xử lý phân tích AI...</div>}
            </div>
          </div>

          {/* Measurements Table */}
          <MeasurementTable />
        </div>
      </div>
    </div>
  );
}
