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

import { usePatientStore } from "@/stores/patient-store";
import { usePatientAnalyses, useSaveAnalysis } from "@/api/patients";
import { useSimpleToast } from "@/hooks/useSimpleToast";
import ToastNotification from "@/components/toast-notification";

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

  const { toast, showToast, hideToast } = useSimpleToast();
  const patientId = usePatientStore((state) => state.patientData?.patientId);
  const { data: patientAnalyses, isSuccess: isAnalysesLoaded } = usePatientAnalyses(patientId);
  const saveAnalysisMutation = useSaveAnalysis();

  const processedLateralRef = useRef<string | null>(null);
  const [imageId, setImageId] = React.useState<number | null>(null);
  const [originalLandmarks, setOriginalLandmarks] = React.useState<any>(null);

  useEffect(() => {
    const processImage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const lateral = urlParams.get("lateral");

      // We only proceed if analyses are loaded and we have a lateral param
      if (!isAnalysesLoaded || !lateral) return;

      // Extract image ID from the URL (e.g. .../api/v1/images/1/file)
      const match = lateral.match(/\/images\/(\d+)\/file/);
      if (!match || !match[1]) {
        console.error("Could not extract image ID from URL:", lateral);
        return;
      }

      const extractedImageId = parseInt(match[1], 10);
      setImageId(extractedImageId);

      // Only process once for this image
      if (extractedImageId && extractedImageId.toString() !== processedLateralRef.current) {
        processedLateralRef.current = extractedImageId.toString();
        setLoadedImageSrc(lateral);

        const existingAnalysis = patientAnalyses?.find((a) => a.image_id === extractedImageId);

        if (existingAnalysis && existingAnalysis.landmarks) {
          // If analysis exists, load it from DB instead of doing inference
          try {
            const parsedLandmarks = typeof existingAnalysis.landmarks === 'string' 
              ? JSON.parse(existingAnalysis.landmarks) 
              : existingAnalysis.landmarks;

            // Map backend schema {name, coordinate: {x,y,confidence}} back to frontend schema {symbol, value: {x,y}}
            const mappedLandmarks = parsedLandmarks.map((lm: any) => ({
              symbol: lm.name,
              description: lm.name, // The backend doesn't store descriptions currently
              value: { x: lm.coordinate.x, y: lm.coordinate.y }
            }));

            const dataToLoad = {
              landmarks: mappedLandmarks,
              image_size: { width: 1000, height: 1000 }, // Default size, might need adjustment
              calibration: { scale: 1.0, unit: "mm" }
            };

            loadJsonData(dataToLoad);
            setOriginalLandmarks(mappedLandmarks);
          } catch (e) {
            console.error("Failed to parse existing landmarks", e);
            showToast("Lỗi tải kết quả cũ", "error");
          }
        } else {
          // No analysis exists, do inference and save automatically
          try {
            await uploadAndDetect(extractedImageId, "xray");
            
            // At this point, the store should have the new landmarksData
            // But since uploadAndDetect doesn't return data, we need to wait for the store update
            // However, uploadAndDetect sets it synchronously at the end of the async function.
          } catch (err: any) {
            console.error("Failed to load image for detection:", err);
            alert(err.message || "Lỗi tải ảnh");
          }
        }
      }
    };

    processImage();
  }, [isAnalysesLoaded, patientAnalyses, setLoadedImageSrc, uploadAndDetect, loadJsonData]);

  // Separate effect to handle auto-save after inference (when landmarksData becomes available and it's not from a load)
  // We use a ref to track if we need to auto-save
  const autoSaveRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (processedLateralRef.current && imageId && landmarksData && !originalLandmarks) {
      // Auto-save branch
      if (autoSaveRef.current) return; // Prevent double save
      autoSaveRef.current = true;

      setOriginalLandmarks(landmarksData.landmarks);

      const formattedLandmarks = landmarksData.landmarks.map((lm) => ({
        name: lm.symbol,
        coordinate: {
          x: lm.value.x,
          y: lm.value.y,
          confidence: 1.0,
        },
      }));

      saveAnalysisMutation.mutate(
        {
          patient_id: parseInt(patientId!, 10),
          image_id: imageId,
          landmarks: formattedLandmarks,
          confidence_score: 1.0,
        },
        {
          onSuccess: () => {
            console.log("Auto-saved initial inference");
          },
          onError: (err: any) => {
            console.error("Auto-save failed", err);
          }
        }
      );
    }
  }, [landmarksData, imageId, originalLandmarks, patientId, saveAnalysisMutation]);

  const handleSave = () => {
    if (!patientId || !imageId) {
      showToast("Thiếu thông tin bệnh nhân hoặc ảnh chụp", "error");
      return;
    }

    if (!landmarksData || !landmarksData.landmarks) {
      showToast("Chưa có kết quả phân tích để lưu", "error");
      return;
    }

    const existingAnalysis = patientAnalyses?.find((a) => a.image_id === imageId);
    
    // Check if landmarks are different from original
    const isDifferent = JSON.stringify(landmarksData.landmarks) !== JSON.stringify(originalLandmarks);
    const status = isDifferent ? "retrain" : undefined;

    const formattedLandmarks = landmarksData.landmarks.map((lm) => ({
      name: lm.symbol,
      coordinate: {
        x: lm.value.x,
        y: lm.value.y,
        confidence: 1.0,
      },
    }));

    saveAnalysisMutation.mutate(
      {
        patient_id: parseInt(patientId, 10),
        image_id: imageId,
        landmarks: formattedLandmarks,
        confidence_score: 1.0,
        analysis_id: existingAnalysis?.id,
        status: status
      },
      {
        onSuccess: () => {
          showToast(isDifferent ? "Đã lưu cập nhật kết quả!" : "Lưu kết quả thành công!", "success");
          setOriginalLandmarks(landmarksData.landmarks); // Update baseline
        },
        onError: (err: any) => {
          showToast("Lỗi khi lưu kết quả: " + err.message, "error");
        },
      }
    );
  };

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
          <div className="flex flex-col gap-6">
            <MeasurementTable />
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saveAnalysisMutation.isPending} className="px-8 py-2">
                {saveAnalysisMutation.isPending ? "Đang lưu..." : "Lưu kết quả"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastNotification show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />
    </div>
  );
}
