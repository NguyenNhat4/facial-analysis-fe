import React, { useEffect, useRef } from "react";
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

import { useCephStore } from "@/stores/ceph-store";
import { InteractiveCanvas } from "@/components/InteractiveCanvas";
import { MeasurementTable } from "@/components/MeasurementTable";
import { MedicalHeader } from "@/components/medical-header";
import { PatientRecordHeader } from "@/components/patient-record-header";

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


  // Parse query parameters for lateral image and trigger API
  const processedLateralRef = useRef<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const lateral = urlParams.get("lateral");

      // Only process if we have a lateral param and haven't processed it yet
      if (lateral && processedLateralRef.current !== lateral) {
        processedLateralRef.current = lateral;
        setLoadedImageSrc(lateral);

        try {
          // Extract image ID from the URL (e.g. .../api/v1/images/1/file)
          const match = lateral.match(/\/images\/(\d+)\/file/);
          if (match && match[1]) {
            const imageId = parseInt(match[1], 10);
            await uploadAndDetect(imageId, "xray");
          } else {
            console.error("Could not extract image ID from URL:", lateral);
          }
        } catch (err: any) {
          console.error("Failed to load image for detection:", err);
          alert(err.message || "Lỗi tải ảnh");
        }
      }
    };

    processImage();
  }, []);

  return (
    <div className="ceph-analysis-page min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25" style={{ backgroundColor: "#fafbfc" }}>
      {/* Header */}
      <MedicalHeader
        onNavigation={setLocation}
        previousPage={location}
        title="Phân Tích Cephalometric"
        subtitle="AI-Powered Ceph Analysis"
        maxWidthClass="max-w-[1800px]"
      />

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8 border-2 border-blue-200">
          <PatientRecordHeader />
        </div>

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
