import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Camera, MessageCircle, User, ZoomIn, ZoomOut, RotateCw, Settings, Save, RefreshCw } from "lucide-react";

// Interface for facial analysis data - new structure with filename as keys
interface FacialAnalysisData {
  [filename: string]: {
    za_ag_me?: { value: number; unit: string };
    az_ga_me?: { value: number; unit: string };
    g_ans_me?: { value: number; unit: string };
    u6_6u_vs_zr_zl?: { value: number; unit: string };
    lower_1_3_ratio?: { value: number };
  } | Array<{
    indicator: string;
    description: string;
    value: number;
    average: number | null;
    unit: string;
  }>;
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
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock patient data
  const patientData = {
    name: "NHẬT NGUYỄN",
    id: "P012345",
    date: "28/07/2025",
    age: 35,
    gender: "Nam"
  };

  // Helper function to extract filename from blob URL or file path
  const extractFilename = (url: string): string | null => {
    if (!url) return null;
    
    // If it's a blob URL, we can't extract the original filename directly
    // We'll need to use the folder parameter or fall back to demo data
    if (url.startsWith('blob:')) {
      return null; // Will use folder name to find corresponding output
    }
    
    // Extract filename from regular path
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // Parse query parameters to get input images and folder
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const frontal = urlParams.get('frontal');
    const profile = urlParams.get('profile');
    const folder = urlParams.get('folder');
    
    if (frontal || profile) {
      setInputImages({
        frontal: frontal ? decodeURIComponent(frontal) : undefined,
        profile: profile ? decodeURIComponent(profile) : undefined,
      });
    }
    
    if (folder) {
      setCurrentFolder(folder);
    }
  }, [location]);

  // Load facial analysis data from JSON and map output images
  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        const response = await fetch('/facial-analysis-output.json');
        const data: FacialAnalysisData = await response.json();
        setAnalysisData(data);

        // Map output images based on current folder or available data in JSON
        let frontalOutputPath: string | undefined;
        let profileOutputPath: string | undefined;
        
        if (currentFolder) {
          // Use folder name to construct output paths  
          // Try to find files matching the folder name pattern
          const folderBasedFrontal = Object.keys(data).find(key => 
            key.includes(currentFolder) && key.includes('frontal')
          );
          const folderBasedProfile = Object.keys(data).find(key => 
            key.includes(currentFolder) && key.includes('profile')
          );
          
          if (folderBasedFrontal || folderBasedProfile) {
            frontalOutputPath = folderBasedFrontal ? `/assets/outputs/${folderBasedFrontal}` : undefined;
            profileOutputPath = folderBasedProfile ? `/assets/outputs/${folderBasedProfile}` : undefined;
            console.log(`🎯 Using folder-based mapping: ${currentFolder}`, { folderBasedFrontal, folderBasedProfile });
          } else {
            // Fallback: construct paths assuming direct filename mapping
            frontalOutputPath = `/assets/outputs/${currentFolder}frontal.jpg`;
            profileOutputPath = `/assets/outputs/${currentFolder}profile.jpg`;
            console.log(`🎯 Using constructed paths for folder: ${currentFolder}`);
          }
        } else {
          // Fallback: Find first available frontal and profile data in JSON
          const frontalFile = Object.keys(data).find(key => key.includes('frontal'));
          const profileFile = Object.keys(data).find(key => key.includes('profile'));
          
          frontalOutputPath = frontalFile ? `/assets/outputs/${frontalFile}` : undefined;
          profileOutputPath = profileFile ? `/assets/outputs/${profileFile}` : undefined;
          console.log(`🎯 Using JSON-based mapping`, { frontalFile, profileFile });
        }
        
        setOutputImages({
          frontal: frontalOutputPath,
          profile: profileOutputPath
        });
        
        console.log(`🎯 Final output images:`, {
          frontal: frontalOutputPath,
          profile: profileOutputPath
        });
      } catch (error) {
        console.error('Failed to load facial analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [currentFolder]);

  // Get current case data based on available files
  const getCurrentCaseData = () => {
    if (!analysisData) return { frontal: null, profile: null };
    
    let frontalFile: string | undefined;
    let profileFile: string | undefined;
    
    if (currentFolder) {
      // Try to find data by folder name first
      frontalFile = Object.keys(analysisData).find(key => 
        key.includes(currentFolder) && key.includes('frontal')
      );
      profileFile = Object.keys(analysisData).find(key => 
        key.includes(currentFolder) && key.includes('profile')
      );
    }
    
    // Fallback: Find any frontal and profile data
    if (!frontalFile) {
      frontalFile = Object.keys(analysisData).find(key => key.includes('frontal'));
    }
    if (!profileFile) {
      profileFile = Object.keys(analysisData).find(key => key.includes('profile'));
    }
    
    const frontalData = frontalFile ? analysisData[frontalFile] : null;
    const profileData = profileFile ? analysisData[profileFile] : null;
    
    // Type check - frontal should be object, profile should be array
    const frontal = frontalData && !Array.isArray(frontalData) ? frontalData : null;
    const profile = profileData && Array.isArray(profileData) ? profileData : null;
    
    console.log(`📊 Using data files:`, { frontalFile, profileFile });
    
    return { frontal, profile };
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
                    {caseData?.frontal ? (
                      <div className="space-y-4">
                        {/* ZA -> AG <- Me */}
                        {caseData.frontal.za_ag_me && (
                          <div className="border-b border-gray-100 pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">ZA → AG ← Me</span>
                              <span className="text-xl font-bold text-blue-600">
                                {caseData.frontal.za_ag_me.value}{caseData.frontal.za_ag_me.unit}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* AZ -> GA <- Me */}
                        {caseData.frontal.az_ga_me && (
                          <div className="border-b border-gray-100 pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">AZ → GA ← Me</span>
                              <span className="text-xl font-bold text-blue-600">
                                {caseData.frontal.az_ga_me.value}{caseData.frontal.az_ga_me.unit}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* G' -> ANS <- Me */}
                        {caseData.frontal.g_ans_me && (
                          <div className="border-b border-gray-100 pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">G&apos; → ANS ← Me</span>
                              <span className="text-xl font-bold text-blue-600">
                                {caseData.frontal.g_ans_me.value}{caseData.frontal.g_ans_me.unit}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* U6-6U vs ZR-ZL */}
                        {caseData.frontal.u6_6u_vs_zr_zl && (
                          <div className="border-b border-gray-100 pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">U6-6U vs ZR-ZL</span>
                              <span className="text-xl font-bold text-blue-600">
                                {caseData.frontal.u6_6u_vs_zr_zl.value}{caseData.frontal.u6_6u_vs_zr_zl.unit}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Lower 1/3 Ratio */}
                        {caseData.frontal.lower_1_3_ratio && (
                          <div className="border-b border-gray-100 pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">Lower 1/3 Ratio</span>
                              <span className="text-xl font-bold text-blue-600">
                                {caseData.frontal.lower_1_3_ratio.value}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-2">Không có dữ liệu phân tích frontal</p>
                        <p className="text-sm text-gray-400">Vui lòng upload ảnh frontal để bắt đầu phân tích</p>
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
                    {caseData?.profile ? (
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
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-2">Không có dữ liệu phân tích profile</p>
                        <p className="text-sm text-gray-400">Vui lòng upload ảnh profile để bắt đầu phân tích</p>
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