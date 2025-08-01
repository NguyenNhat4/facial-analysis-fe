import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Camera, MessageCircle, User, ZoomIn, ZoomOut, RotateCw, Settings, Save, RefreshCw } from "lucide-react";

// Interface for facial analysis data
interface FacialAnalysisData {
  id: {
    [caseId: string]: {
      facial_analysis: {
        frontal: {
          za_ag_me: { value: number; unit: string };
          az_ga_me: { value: number; unit: string };
          g_ans_me: { value: number; unit: string };
          u6_6u_vs_zr_zl: { value: number; unit: string };
          lower_1_3_ratio: { value: number };
        };
        profile: Array<{
          indicator: string;
          description: string;
          value: number;
          average: number | null;
          unit: string;
        }>;
      };
    };
  };
}

export default function FacialAnalysisPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("frontal");
  const [analysisData, setAnalysisData] = useState<FacialAnalysisData | null>(null);
  const [inputImages, setInputImages] = useState<{
    frontal?: string;
    profile?: string;
  }>({});
  const [outputImages, setOutputImages] = useState<{
    frontal?: string;
    profile?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  // Mock patient data
  const patientData = {
    name: "NHẬT NGUYỄN",
    id: "P012345",
    date: "28/07/2025",
    age: 35,
    gender: "Nam"
  };

  // Parse query parameters to get input images
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const frontal = urlParams.get('frontal');
    const profile = urlParams.get('profile');
    
    if (frontal || profile) {
      setInputImages({
        frontal: frontal ? decodeURIComponent(frontal) : undefined,
        profile: profile ? decodeURIComponent(profile) : undefined,
      });
    }
  }, [location]);

  // Load facial analysis data from JSON
  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        const response = await fetch('/facial-analysis-output.json');
        const data: FacialAnalysisData = await response.json();
        setAnalysisData(data);

        // Set output images from assets/outputs (demo paths)
        setOutputImages({
          frontal: '/assets/outputs/case01/frontal.png',
          profile: '/assets/outputs/case01/profile.png'
        });
      } catch (error) {
        console.error('Failed to load facial analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, []);

  // Get current case data (using first case for demo)
  const getCurrentCaseData = () => {
    if (!analysisData) return null;
    const firstCaseId = Object.keys(analysisData.id)[0];
    return analysisData.id[firstCaseId]?.facial_analysis;
  };

  const caseData = getCurrentCaseData();

  // Helper function to get status badge
  const getStatusBadge = (value: number, average: number | null, unit: string) => {
    if (!average) return <Badge className="bg-blue-100 text-blue-800">Đo được</Badge>;
    
    const tolerance = unit === '°' ? 5 : 0.1;
    const diff = Math.abs(value - average);
    
    if (diff <= tolerance) {
      return <Badge className="bg-green-100 text-green-800">Bình thường</Badge>;
    } else if (diff <= tolerance * 2) {
      return <Badge className="bg-yellow-100 text-yellow-800">Gần chuẩn</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Cần chú ý</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu phân tích...</p>
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
                  Phân tích Gương mặt AI
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Cephalometric Analysis - Đo lường và phân tích các tỷ lệ khuôn mặt
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Dr</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Dr. Smith</p>
                <p className="text-gray-500">Orthodontist</p>
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
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-blue-100 text-lg font-medium">
                    ID: {patientData.id} • {patientData.gender} • {patientData.age} tuổi
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-sm">Ngày phân tích</div>
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

        {/* Analysis Tabs */}
        <Card className="shadow-lg border border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
                <TabsTrigger 
                  value="frontal" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold"
                >
                  FRONTAL FACE ANALYSIS (WIDTH: 1333PX, HEIGHT: 2000PX)
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold"
                >
                  PROFILE ANALYSIS
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Frontal Analysis Tab */}
            <TabsContent value="frontal" className="p-0">
              <div className="flex h-[800px]">
                {/* Left Panel - Analysis Results */}
                <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
                  <div className="bg-blue-900 text-white px-4 py-3 rounded-t-lg">
                    <h3 className="font-bold text-center">ANALYSIS RESULTS</h3>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    {caseData?.frontal && (
                      <div className="space-y-4">
                        {/* ZA -> AG <- Me */}
                        <div className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">ZA → AG ← Me</span>
                            <span className="text-xl font-bold text-blue-600">
                              {caseData.frontal.za_ag_me.value}{caseData.frontal.za_ag_me.unit}
                            </span>
                          </div>
                        </div>

                        {/* AZ -> GA <- Me */}
                        <div className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">AZ → GA ← Me</span>
                            <span className="text-xl font-bold text-blue-600">
                              {caseData.frontal.az_ga_me.value}{caseData.frontal.az_ga_me.unit}
                            </span>
                          </div>
                        </div>

                        {/* G' -> ANS <- Me */}
                        <div className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">G&apos; → ANS ← Me</span>
                            <span className="text-xl font-bold text-blue-600">
                              {caseData.frontal.g_ans_me.value}{caseData.frontal.g_ans_me.unit}
                            </span>
                          </div>
                        </div>

                        {/* U6-6U vs ZR-ZL */}
                        <div className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">U6-6U vs ZR-ZL</span>
                            <span className="text-xl font-bold text-blue-600">
                              {caseData.frontal.u6_6u_vs_zr_zl.value}{caseData.frontal.u6_6u_vs_zr_zl.unit}
                            </span>
                          </div>
                        </div>

                        {/* Lower 1/3 Ratio */}
                        <div className="border-b border-gray-100 pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">Lower 1/3 Ratio</span>
                            <span className="text-xl font-bold text-blue-600">
                              {caseData.frontal.lower_1_3_ratio.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Note Section */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <span className="font-medium text-gray-800">Note</span>
                        <div className="mt-2 h-20 bg-gray-50 rounded border border-gray-200 p-2">
                          <textarea 
                            className="w-full h-full resize-none border-none outline-none bg-transparent text-sm"
                            placeholder="Ghi chú cho phân tích frontal..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Image Analysis */}
                <div className="flex-1 bg-blue-900 text-white p-6">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">FRONTAL FACE ANALYSIS (WIDTH: 1333PX, HEIGHT: 2000PX)</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Camera className="w-4 h-4 mr-1" />
                          Select/Upload images
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                    </div>

                    {/* Image Display Area */}
                    <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
                      {outputImages.frontal ? (
                        <img
                          src={outputImages.frontal}
                          alt="Frontal Analysis"
                          className="w-full h-full object-contain"
                        />
                      ) : inputImages.frontal ? (
                        <img
                          src={inputImages.frontal}
                          alt="Frontal Input"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Không có ảnh để hiển thị</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Control Panel */}
                    <div className="mt-4 flex flex-col space-y-2">
                      <div className="flex items-center justify-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <RotateCw className="w-4 h-4 mr-1" />
                          Rotate ▶
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4 mr-1" />
                          Contrast ▶
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4 mr-1" />
                          Brightness ▶
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
                      <div className="flex items-center justify-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          ℹ️ Guide ▶
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Profile Analysis Tab */}
            <TabsContent value="profile" className="p-0">
              <div className="flex h-[800px]">
                {/* Left Panel - Analysis Results */}
                <div className="w-96 bg-white border-r border-gray-200 p-6 overflow-y-auto">
                  <div className="bg-blue-900 text-white px-4 py-3 rounded-t-lg">
                    <h3 className="font-bold text-center">ANALYSIS RESULTS</h3>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    {caseData?.profile && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 border-b border-gray-200 pb-2">
                          <span>Indicator</span>
                          <span className="text-center">Value</span>
                          <span className="text-center">Average</span>
                        </div>
                        
                        {caseData.profile.map((indicator, index) => (
                          <div key={index} className="border-b border-gray-100 pb-3">
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <div>
                                <div className="font-medium text-gray-800 text-sm">
                                  {indicator.description}
                                </div>
                              </div>
                              <div className="text-center">
                                <span className="text-lg font-bold text-blue-600">
                                  {indicator.value}{indicator.unit}
                                </span>
                              </div>
                              <div className="text-center">
                                <span className="text-lg font-bold text-gray-600">
                                  {indicator.average ? `${indicator.average}${indicator.unit}` : '-'}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-end">
                              {getStatusBadge(indicator.value, indicator.average, indicator.unit)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Note Section */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <span className="font-medium text-gray-800">Note</span>
                        <div className="mt-2 h-20 bg-gray-50 rounded border border-gray-200 p-2">
                          <textarea 
                            className="w-full h-full resize-none border-none outline-none bg-transparent text-sm"
                            placeholder="Ghi chú cho phân tích profile..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Image Analysis */}
                <div className="flex-1 bg-blue-900 text-white p-6">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">FRONTAL FACE ANALYSIS (WIDTH: 1333PX, HEIGHT: 2000PX)</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Camera className="w-4 h-4 mr-1" />
                          Select/Upload images
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                    </div>

                    {/* Image Display Area */}
                    <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
                      {outputImages.profile ? (
                        <img
                          src={outputImages.profile}
                          alt="Profile Analysis"
                          className="w-full h-full object-contain"
                        />
                      ) : inputImages.profile ? (
                        <img
                          src={inputImages.profile}
                          alt="Profile Input"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Không có ảnh để hiển thị</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Control Panel */}
                    <div className="mt-4 flex flex-col space-y-2">
                      <div className="flex items-center justify-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <RotateCw className="w-4 h-4 mr-1" />
                          Rotate ▶
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4 mr-1" />
                          Contrast ▶
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Settings className="w-4 h-4 mr-1" />
                          Brightness ▶
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
                      <div className="flex items-center justify-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          ℹ️ Guide ▶
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}