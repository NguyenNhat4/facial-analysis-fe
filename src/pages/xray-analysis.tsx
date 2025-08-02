import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft,
  Radiation,
  MessageCircle,
  Heart,
  AlertTriangle,
  AlertCircle,
  X,
  User,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Settings,
  Save,
  RefreshCw,
  Camera,
  Target,
  Scan,
  FileText,
  Clock
} from "lucide-react";

// Interface for X-ray analysis data - new structure with filename as keys
interface XrayAnalysisData {
  [filename: string]: {
    summary: {
      total_teeth: number;
      healthy_teeth: number;
      decayed_teeth: number;
      treatment_needed: number;
      overall_health: number;
    };
    detailed_analysis: Array<{
      tooth_number: number;
      status: "healthy" | "decay" | "treatment_needed";
      condition: string;
      position: { x: number; y: number; width: number; height: number };
      confidence: number;
      treatment?: {
        priority: "low" | "medium" | "high" | "urgent";
        method: string;
        estimated_time: string;
        cost_estimate: string;
        notes: string;
      };
    }>;
    ai_insights: {
      overall_assessment: string;
      main_concerns: string[];
      recommendations: string[];
    };
  };
}

export default function XrayAnalysisPage() {
  const [location] = useLocation();
  const [analysisData, setAnalysisData] = useState<XrayAnalysisData | null>(null);
  const [inputImages, setInputImages] = useState<{
    general_xray?: string;
  }>({});
  const [outputImages, setOutputImages] = useState<{
    general_xray?: string;
  }>({});
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<any>(null);

  // Demo patient data for presentation
  const patientData = {
    name: currentFolder || "DEMO PATIENT",
    id: "P2025-001",
    date: new Date().toLocaleDateString("en-GB"),
    age: 28,
    gender: "Demo Case"
  };

  // Parse query parameters to get input images and folder
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const general_xray = urlParams.get('general_xray');
    const folder = urlParams.get('folder');
    
    if (general_xray) {
      setInputImages({
        general_xray: general_xray ? decodeURIComponent(general_xray) : undefined,
      });
    }
    
    if (folder) {
      setCurrentFolder(folder);
    }
  }, [location]);

  // Load X-ray analysis data from JSON and map output images
  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        const response = await fetch('/xray-analysis-output.json');
        const data: XrayAnalysisData = await response.json();
        setAnalysisData(data);

        // Map output images based on current folder or available data in JSON
        let xrayOutputPath: string | undefined;
        
        if (currentFolder) {
          // Try to find files matching the folder name pattern
          const folderBasedXray = Object.keys(data).find(key => 
            key.includes(currentFolder) && key.includes('pano')
          );
          
          if (folderBasedXray) {
            xrayOutputPath = `/assets/outputs/${folderBasedXray}`;
            console.log(`🎯 Using folder-based mapping: ${currentFolder}`, { folderBasedXray });
          } else {
            // Fallback: construct paths assuming direct filename mapping
            xrayOutputPath = `/assets/outputs/${currentFolder}pano.jpg`;
            console.log(`🎯 Using constructed paths for folder: ${currentFolder}`);
          }
        } else {
          // Fallback: Find first available pano data in JSON
          const xrayFile = Object.keys(data).find(key => key.includes('pano'));
          
          xrayOutputPath = xrayFile ? `/assets/outputs/${xrayFile}` : undefined;
          console.log(`🎯 Using JSON-based mapping`, { xrayFile });
        }
        
        setOutputImages({
          general_xray: xrayOutputPath
        });
        
        console.log(`🎯 Final output images:`, {
          general_xray: xrayOutputPath
        });
      } catch (error) {
        console.error('Failed to load X-ray analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [currentFolder]);

  // Get current case data based on available files
  const getCurrentCaseData = () => {
    if (!analysisData) {
      console.log(`📊 No analysis data available`);
      return null;
    }
    
    let xrayFile: string | undefined;
    
    console.log(`📊 getCurrentCaseData called with currentFolder:`, currentFolder);
    console.log(`📊 Available keys in analysisData:`, Object.keys(analysisData));
    
    if (currentFolder) {
      // Try to find data by folder name first
      xrayFile = Object.keys(analysisData).find(key => 
        key.toLowerCase().includes(currentFolder.toLowerCase()) && key.toLowerCase().includes('pano')
      );
      console.log(`📊 Folder-based search for "${currentFolder}":`, xrayFile);
    }
    
    // Fallback: Find any pano data (prefer DaoThiDiemTrang over NgocHieu for demo)
    if (!xrayFile) {
      // Try DaoThiDiemTrang first for demo
      xrayFile = Object.keys(analysisData).find(key => 
        key.includes('DaoThiDiemTrang') && key.includes('pano')
      );
      
      // If not found, get any pano data
      if (!xrayFile) {
        xrayFile = Object.keys(analysisData).find(key => key.includes('pano'));
      }
      console.log(`📊 Fallback search found:`, xrayFile);
    }
    
    const xrayData = xrayFile ? analysisData[xrayFile] : null;
    
    console.log(`📊 Final selection - Using data file:`, { xrayFile, hasData: !!xrayData });
    
    return xrayData;
  };

  const caseData = getCurrentCaseData();
  
  // Debug log for caseData
  React.useEffect(() => {
    if (caseData) {
      console.log(`📊 CaseData updated:`, {
        totalTeeth: caseData.summary.total_teeth,
        healthyTeeth: caseData.summary.healthy_teeth,
        currentFolder
      });
    }
  }, [caseData, currentFolder]);

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Khỏe mạnh</Badge>;
      case "decay":
        return <Badge className="bg-yellow-100 text-yellow-800">Sâu răng</Badge>;
      case "treatment_needed":
        return <Badge className="bg-red-100 text-red-800">Cần điều trị</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-600 text-white animate-pulse">KHẨN CẤP</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800">Cao</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Thấp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu phân tích X-quang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25">
      {/* Medical Header */}
      <header className="bg-white border-b-2 border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-6">
              <Button 
                onClick={() => window.history.back()}
                variant="ghost" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại
              </Button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src="/assets/leetray_logo.png"
                    alt="LeeTray Logo"
                    className="w-14 h-14 object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="relative">
                  <img
                    src="/assets/hiai-logo.png"
                    alt="HiAI Logo"
                    className="w-14 h-14 object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white"></div>
                </div>
              </div>
              <div className="border-l-2 border-blue-200 pl-6">
                <h1 className="text-xl font-bold text-gray-800">
                  Phân tích X-quang AI
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Panoramic Analysis - Phân tích X-quang toàn cảnh
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Dr</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Dr. Smith</p>
                <p className="text-gray-500">Radiology</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        <Card className="mb-8 border border-gray-200 shadow-lg">
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{patientData.name}</h2>
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                      DEMO
                    </span>
                  </div>
                  <p className="text-blue-100 text-lg font-medium">
                    ID: {patientData.id} • {patientData.gender} • Age: {patientData.age}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-sm">Ngày chụp X-quang</div>
                <div className="text-white font-semibold text-lg">{patientData.date}</div>
                <div className="text-blue-200 text-sm">
                  {new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Analysis Overview Cards */}
        {caseData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tổng số răng</p>
                    <p className="text-3xl font-bold text-gray-800">{caseData.summary.total_teeth}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Răng khỏe mạnh</p>
                    <p className="text-3xl font-bold text-green-800">{caseData.summary.healthy_teeth}</p>
                  </div>
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">Răng sâu</p>
                    <p className="text-3xl font-bold text-yellow-800">{caseData.summary.decayed_teeth}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 font-medium">Cần điều trị</p>
                    <p className="text-3xl font-bold text-red-800">{caseData.summary.treatment_needed}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Analysis Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* X-ray Image Display - 2/3 width */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border border-gray-200">
              <div className="bg-blue-900 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">PANORAMIC X-RAY ANALYSIS</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Camera className="w-4 h-4 mr-1" />
                      Adjust
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Display Area */}
              <div className="bg-black p-6">
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  {outputImages.general_xray ? (
                    <img
                      src={outputImages.general_xray}
                      alt="X-ray Analysis"
                      className="w-full h-96 object-contain bg-black"
                    />
                  ) : inputImages.general_xray ? (
                    <img
                      src={inputImages.general_xray}
                      alt="X-ray Input"
                      className="w-full h-96 object-contain bg-black"
                    />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center text-gray-400 bg-black">
                      <div className="text-center">
                        <Radiation className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Không có ảnh X-quang để hiển thị</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control Panel */}
                <div className="mt-4 flex flex-col space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <RotateCw className="w-4 h-4 mr-1" />
                      Rotate
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Settings className="w-4 h-4 mr-1" />
                      Contrast
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Settings className="w-4 h-4 mr-1" />
                      Brightness
                    </Button>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ZoomIn className="w-4 h-4 mr-1" />
                      Zoom in
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ZoomOut className="w-4 h-4 mr-1" />
                      Zoom out
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Save className="w-4 h-4 mr-1" />
                      Save analysis
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Analysis Results Panel - 1/3 width */}
          <div className="space-y-6">
            {/* AI Insights */}
            {caseData && (
              <Card className="shadow-lg border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <CardTitle className="flex items-center">
                    <Scan className="w-5 h-5 mr-2" />
                    AI INSIGHTS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Đánh giá tổng thể</h4>
                      <p className="text-sm text-gray-600">{caseData.ai_insights.overall_assessment}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Vấn đề chính</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {caseData.ai_insights.main_concerns.map((concern, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Khuyến nghị</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {caseData.ai_insights.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0">•</div>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Health Progress */}
            {caseData && (
              <Card className="shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    Tình trạng sức khỏe răng miệng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600">
                      {caseData.summary.overall_health.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Tổng thể</p>
                  </div>
                  <Progress 
                    value={caseData.summary.overall_health} 
                    className="h-3 mb-4"
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Răng khỏe mạnh:</span>
                      <span className="font-semibold text-green-600">
                        {((caseData.summary.healthy_teeth / caseData.summary.total_teeth) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cần chú ý:</span>
                      <span className="font-semibold text-yellow-600">
                        {(((caseData.summary.decayed_teeth + caseData.summary.treatment_needed) / caseData.summary.total_teeth) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detailed Tooth Analysis */}
        {caseData && (
          <Card className="mt-8 shadow-lg border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                CHI TIẾT PHÂN TÍCH TỪNG RĂNG
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseData.detailed_analysis
                  .filter(tooth => tooth.status !== "healthy")
                  .map((tooth) => (
                    <Card 
                      key={tooth.tooth_number}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        tooth.status === "treatment_needed" 
                          ? "border-red-200 bg-red-50" 
                          : "border-yellow-200 bg-yellow-50"
                      }`}
                      onClick={() => setSelectedTooth(tooth)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              tooth.status === "treatment_needed" ? "bg-red-500" : "bg-yellow-500"
                            }`}
                          >
                            {tooth.tooth_number}
                          </div>
                          {getStatusBadge(tooth.status)}
                        </div>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Răng số {tooth.tooth_number}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">{tooth.condition}</p>
                        
                        {tooth.treatment && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Ưu tiên:</span>
                              {getPriorityBadge(tooth.treatment.priority)}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {tooth.treatment.estimated_time}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Độ tin cậy AI:</span>
                            <span className="font-semibold text-blue-600">
                              {(tooth.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Treatment Detail Modal */}
      {selectedTooth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết điều trị - Răng số {selectedTooth.tooth_number}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTooth(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tình trạng</h4>
                <p className="text-gray-600">{selectedTooth.condition}</p>
              </div>
              
              {selectedTooth.treatment && (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Phương pháp điều trị</h4>
                    <p className="text-gray-600">{selectedTooth.treatment.method}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Thời gian dự kiến</h4>
                    <p className="text-gray-600">{selectedTooth.treatment.estimated_time}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Chi phí ước tính</h4>
                    <p className="text-gray-600 font-semibold text-green-600">{selectedTooth.treatment.cost_estimate}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ghi chú</h4>
                    <p className="text-gray-600">{selectedTooth.treatment.notes}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Độ ưu tiên:</span>
                      {getPriorityBadge(selectedTooth.treatment.priority)}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setSelectedTooth(null)}
              >
                Đóng
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Lên lịch điều trị
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}