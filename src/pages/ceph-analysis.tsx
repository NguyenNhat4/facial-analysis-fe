import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Upload,
  RefreshCw,
  User,
  Activity,
  Target,
  FileText,
  Ruler,
} from "lucide-react";

// Import styles from reference project
import "./ceph-analysis.css";

// Interface for landmark data
interface Landmark {
  symbol: string;
  value: {
    x: number;
    y: number;
  };
}

interface LandmarksData {
  landmarks: Landmark[];
}

interface LandmarksObject {
  [symbol: string]: {
    x: number;
    y: number;
  };
}

interface Measurement {
  name: string;
  value: number;
  mean: number;
  sd: number;
  unit: string;
  classification: "normal" | "moderate" | "severe" | "error";
  significance: string;
  interpretation: string;
}

// Load external scripts and config
declare global {
  interface Window {
    MEASUREMENTS_CONFIG: any;
    calculateAllMeasurements: (landmarksObj: LandmarksObject) => { [key: string]: Measurement };
    landmarksArrayToObject: (landmarksArray: Landmark[]) => LandmarksObject;
    drawLine: (ctx: CanvasRenderingContext2D, start: any, end: any, scale: number, color?: string, width?: number, dash?: number[]) => void;
    drawAngleArc: (ctx: CanvasRenderingContext2D, A: any, B: any, C: any, scale: number, color?: string) => void;
    drawPerpendicularLine: (ctx: CanvasRenderingContext2D, P: any, A: any, B: any, scale: number, color?: string) => void;
    drawMeasurementLine: (ctx: CanvasRenderingContext2D, start: any, end: any, scale: number) => void;
  }
}

export default function CephAnalysisPage() {
  const [location, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [landmarksData, setLandmarksData] = useState<LandmarksData | null>(null);
  const [landmarksObj, setLandmarksObj] = useState<LandmarksObject | null>(null);
  const [measurements, setMeasurements] = useState<{ [key: string]: Measurement }>({});
  const [loading, setLoading] = useState(false);
  const [showLandmarkNames, setShowLandmarkNames] = useState(false);
  const [hoveredMeasurement, setHoveredMeasurement] = useState<string | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Demo patient data
  const patientData = {
    name: "DEMO PATIENT",
    id: "P2025-001",
    date: new Date().toLocaleDateString("en-GB"),
    age: 28,
    gender: "Demo Case",
  };

  // Load external scripts
  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript("/ceph/measurements-config.js");
        await loadScript("/ceph/calculations.js");
        setScriptsLoaded(true);
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadScripts();
  }, []);

  // Auto-load demo data when scripts are loaded
  useEffect(() => {
    if (scriptsLoaded) {
      loadDemoData();
    }
  }, [scriptsLoaded]);

  // Parse query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lateral = urlParams.get("lateral");

    if (lateral && scriptsLoaded) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setLoadedImage(img);
      };
      img.src = lateral;
    }
  }, [location, scriptsLoaded]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    if (loadedImage && scriptsLoaded) {
      drawCanvas();
    }
  }, [loadedImage, landmarksObj, showLandmarkNames, hoveredMeasurement, scriptsLoaded]);

  // Load demo data
  const loadDemoData = async () => {
    try {
      const jsonResponse = await fetch("/ceph/cks2ip8fq2a0j0yufdfssbc09.json");
      const data = await jsonResponse.json();
      setLandmarksData(data);

      const img = new Image();
      img.onload = () => {
        setLoadedImage(img);
        initializeData(data);
      };
      img.src = "/ceph/cks2ip8fq2a0j0yufdfssbc09.png";
    } catch (error) {
      console.error("Error loading demo data:", error);
    }
  };

  // Initialize data and calculate measurements
  const initializeData = (data: LandmarksData) => {
    if (!data || !window.landmarksArrayToObject || !window.calculateAllMeasurements) {
      console.log("Waiting for scripts to load...");
      return;
    }

    const landmarksObject = window.landmarksArrayToObject(data.landmarks);
    setLandmarksObj(landmarksObject);

    const calculatedMeasurements = window.calculateAllMeasurements(landmarksObject);
    setMeasurements(calculatedMeasurements);
  };

  // Draw canvas with image and landmarks
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate scale to fit canvas
    const maxWidth = 800;
    const maxHeight = 900;
    const scale = Math.min(maxWidth / loadedImage.width, maxHeight / loadedImage.height);
    setCanvasScale(scale);

    canvas.width = loadedImage.width * scale;
    canvas.height = loadedImage.height * scale;

    // Draw image
    ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

    // Draw all landmarks (small dots)
    if (landmarksObj) {
      Object.entries(landmarksObj).forEach(([symbol, pos]) => {
        drawLandmark(ctx, pos.x * scale, pos.y * scale, symbol, false);
      });
    }

    // Draw measurement guide if hovering
    if (hoveredMeasurement && window.MEASUREMENTS_CONFIG && window.MEASUREMENTS_CONFIG[hoveredMeasurement]) {
      const config = window.MEASUREMENTS_CONFIG[hoveredMeasurement];

      // Highlight landmarks
      config.landmarks.forEach((symbol: string) => {
        if (landmarksObj && landmarksObj[symbol]) {
          const pos = landmarksObj[symbol];
          drawLandmark(ctx, pos.x * scale, pos.y * scale, symbol, true);
        }
      });

      // Draw guide lines/angles
      if (config.drawGuide && landmarksObj) {
        config.drawGuide(ctx, landmarksObj, scale);
      }
    }
  };

  // Draw landmark point
  const drawLandmark = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    symbol: string,
    highlighted: boolean
  ) => {
    ctx.save();

    if (highlighted) {
      // Highlighted landmark
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#FF4500";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label with background
      ctx.font = "bold 16px Arial";
      const textMetrics = ctx.measureText(symbol);
      const textWidth = textMetrics.width;
      const textHeight = 16;

      ctx.fillStyle = "rgba(255, 69, 0, 0.9)";
      ctx.fillRect(x + 12, y - textHeight - 4, textWidth + 8, textHeight + 8);

      ctx.fillStyle = "white";
      ctx.fillText(symbol, x + 16, y - 2);
    } else {
      // Normal landmark
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();

      // Show label if toggle is on
      if (showLandmarkNames) {
        ctx.font = "bold 12px Arial";
        const textMetrics = ctx.measureText(symbol);
        const textWidth = textMetrics.width;
        const textHeight = 12;

        ctx.fillStyle = "rgba(33, 150, 243, 0.85)";
        ctx.fillRect(x + 8, y - textHeight - 2, textWidth + 6, textHeight + 4);

        ctx.fillStyle = "white";
        ctx.fillText(symbol, x + 11, y - 2);
      }
    }

    ctx.restore();
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle JSON upload
  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setLandmarksData(data);
        initializeData(data);
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

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8006/predict", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setLandmarksData(data);

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImage(img);
            initializeData(data);
            setLoading(false);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error:", error);
        alert("Lỗi khi gọi API. Đảm bảo API đang chạy tại http://localhost:8006");
        setLoading(false);
      }
    };

    input.click();
  };

  // Reset canvas
  const handleReset = () => {
    setHoveredMeasurement(null);
  };

  // Get color class based on classification
  const getColorClass = (classification: string) => {
    switch (classification) {
      case "normal":
        return "color-normal";
      case "moderate":
        return "color-moderate";
      case "severe":
        return "color-severe";
      default:
        return "";
    }
  };

  return (
    <div className="ceph-analysis-page min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25" style={{ backgroundColor: "#fafbfc" }}>
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-6">
              <Button
                onClick={() => setLocation("/demo")}
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
            <div className="canvas-container">
              <canvas ref={canvasRef} id="cephCanvas" />
            </div>

            {/* Controls */}
            <div className="canvas-controls">
              <button
                onClick={handleAPIUpload}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Đang xử lý..." : "Upload & Detect với AI"}
              </button>

              <label htmlFor="imageInput" className="btn-secondary">
                Chọn Ảnh
              </label>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <label htmlFor="jsonInput" className="btn-secondary">
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
          <div className="table-section">
            <h2>
              <Ruler className="inline w-6 h-6 mr-2 text-purple-600" />
              Bảng Các Chỉ Số
            </h2>
            <div className="table-container">
              <table id="measurementsTable">
                <thead>
                  <tr>
                    <th>Ý nghĩa</th>
                    <th>Giá trị</th>
                    <th>S.D.</th>
                    <th>Kết quả</th>
                    <th></th>
                    <th>Ý nghĩa</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(measurements).map(([key, measurement]) => (
                    <tr
                      key={key}
                      className={`measurement-row ${hoveredMeasurement === key ? "row-highlight" : ""}`}
                      onMouseEnter={() => setHoveredMeasurement(key)}
                      onMouseLeave={() => setHoveredMeasurement(null)}
                    >
                      <td className="measurement-name">{measurement.name}</td>
                      <td className="text-center">{measurement.value.toFixed(2)}</td>
                      <td className="text-center">
                        {((measurement.value - measurement.mean) / measurement.sd).toFixed(1)}
                      </td>
                      <td className={`text-center font-bold ${getColorClass(measurement.classification)}`}>
                        {measurement.value.toFixed(2)}
                      </td>
                      <td className="text-center color-severe">{measurement.significance}</td>
                      <td className={getColorClass(measurement.classification)}>
                        {measurement.interpretation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
