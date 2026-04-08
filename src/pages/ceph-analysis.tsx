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

  // Parse query parameters for lateral image and load demo JSON
  useEffect(() => {
    // Only load from query param if we don't already have an image in store
    if (!loadedImageSrc) {
      const urlParams = new URLSearchParams(window.location.search);
      const lateral = urlParams.get("lateral");

      if (lateral) {
        setLoadedImageSrc(lateral);
      }
    }

    // Always pre-load demo data if empty, for testing (matches old behavior somewhat)
    // Actually, only load if we have no landmarksData
    if (!landmarksData) {
      import("../data/mock/cephalometric-demo.json").then((module) => {
         loadJsonData(module.default as any);
      });
      // also load the demo image if no image src
      if (!loadedImageSrc) {
        setLoadedImageSrc("/ceph/cks2ip8fq2a0j0yufdfssbc09.png");
      }
    }
  }, [location, loadedImageSrc, landmarksData, setLoadedImageSrc, loadJsonData]);


  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a local blob url for the user to view immediately without detection
    // but the actual requirement usually pairs upload with detection
    const src = URL.createObjectURL(file);
    setLoadedImageSrc(src);
  };

  // Handle JSON upload
  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        loadJsonData(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("File JSON không hợp lệ");
      }
    };
    reader.readAsText(file);
  };

  // Handle API upload and detection
  const handleAPIUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      await uploadAndDetect(file);

      if (error) {
        alert(error);
      }
    };

    input.click();
  };

  // Reset canvas
  const handleReset = () => {
    reset();
  };

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
              <button
                onClick={handleAPIUpload}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Đang xử lý..." : "Upload & Detect với AI"}
              </button>

              <label htmlFor="imageInput" className="btn-secondary cursor-pointer">
                Chọn Ảnh
              </label>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <label htmlFor="jsonInput" className="btn-secondary cursor-pointer">
                Chọn JSON
              </label>
              <input
                type="file"
                id="jsonInput"
                accept="application/json"
                onChange={handleJsonUpload}
                style={{ display: "none" }}
              />

              <button onClick={handleReset} className="btn-secondary">
                Reset
              </button>

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
            </div>
          </div>

          {/* Measurements Table */}
          <MeasurementTable />
        </div>
      </div>
    </div>
  );
}
