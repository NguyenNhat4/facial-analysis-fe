import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Upload,
  Camera,
  Radiation,
  Box,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Target,
  Activity,
  Edit3,
  Save,
  X,
  Brain,
  Scan,
  Stethoscope,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ImageType, IMAGE_TYPE_MAPPING } from "../types/demo-cases";
import { useToast } from "../shared/hooks/useToast";
import { usePatientData } from "../features/patient/hooks/usePatientData";
import { useImageManager } from "../features/imaging/hooks/useImageManager";
import AIThinkingModal from "../components/ai-thinking-modal";
import ValidationErrorModal from "../components/validation-error-modal";
import ToastNotification from "../components/toast-notification";

const DemoPage = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("record");

  const { toast, showToast, hideToast } = useToast();
  
  const {
    patientData,
    editingField,
    tempValue,
    setTempValue,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  } = usePatientData();

  const {
    currentFolderName,
    uploadedImages,
    imagePreviewUrls,
    isLoading,
    loadingProgress,
    loadingCards,
    validationError,
    setValidationError,
    handleImageUpload,
    handleRemoveImage,
    fakeLoadImages,
    getKeywordsForType,
    getExampleFileName,
    hasFaceImages,
    hasAllImages,
    availableAnalysisCount,
    totalAnalysisCount
  } = useImageManager(showToast);

  // AI Thinking Modal state
  const [showAIThinking, setShowAIThinking] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<
    "facial" | "ceph" | "treatment"
  >("facial");
  const [pendingNavigation, setPendingNavigation] = useState<{
    path: string;
    withImages: boolean;
  } | null>(null);

  // Generate upload categories from IMAGE_TYPE_MAPPING
  const uploadCategories = (() => {
    const categories: {
      [key: string]: { title: string; subtitle: string; items: any[] };
    } = {};

    Object.entries(IMAGE_TYPE_MAPPING).forEach(
      ([type, config]: [string, any]) => {
        if (!categories[config.category]) {
          categories[config.category] = {
            title: config.category,
            subtitle:
              config.category === "Radiographic Imaging"
                ? "Digital X-Ray Acquisitions"
                : config.category === "Clinical Photography"
                ? "Facial Analysis Images"
                : "3D Dental Scans",
            items: [],
          };
        }

        categories[config.category].items.push({
          id: type,
          name: config.name,
          icon: config.icon,
        });
      }
    );

    return Object.values(categories);
  })();



  // AI Thinking handlers
  const handleAnalysisClick = (
    analysisType: "facial" | "ceph" | "treatment",
    path: string,
    withImages = false
  ) => {
    setCurrentAnalysis(analysisType);
    setPendingNavigation({ path, withImages });
    setShowAIThinking(true);
  };

  const handleAIThinkingComplete = () => {
    setShowAIThinking(false);

    // Navigate after thinking is complete
    if (pendingNavigation) {
      if (pendingNavigation.withImages) {
        handleNavigation(pendingNavigation.path, true);
      } else {
        handleNavigation(pendingNavigation.path);
      }
      setPendingNavigation(null);
    }
  };

  // Navigation handlers
  const handleNavigation = (path: string, withImages = false) => {
    if (withImages) {
      // Create URL params with uploaded image data and folder name
      const imageParams = new URLSearchParams();

      // Add folder name if available
      if (currentFolderName) {
        imageParams.set("folder", currentFolderName);
      }

      // Add image URLs for analysis
      Object.entries(imagePreviewUrls).forEach(([key, url]) => {
        if (url && uploadedImages[key]) {
          imageParams.set(key, url);
        }
      });


      // Navigate with query params
      const queryString = imageParams.toString();
      setLocation(queryString ? `${path}?${queryString}` : path);
    } else {
      setLocation(path);
    }
  };

  const renderEditableField = (
    field: string,
    value: string,
    isTextarea = false
  ) => {
    const isEditing = editingField === field;
    const isClickToEdit = value === "Click to edit";

    if (isEditing) {
      return (
        <div className="relative">
          {isTextarea ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-4 bg-white border-2 border-blue-300 rounded-xl font-medium resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter details..."
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-4 bg-white border-2 border-blue-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter value..."
              autoFocus
            />
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => handleEditSave(field)}
              className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Save className="w-3 h-3" />
            </button>
            <button
              onClick={handleEditCancel}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`group relative p-4 rounded-xl font-medium cursor-pointer transition-all duration-300 hover:shadow-md ${
          isClickToEdit
            ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-2 border-blue-200/60 text-blue-600 hover:from-blue-100/80 hover:to-indigo-100/80 hover:border-blue-300/60"
            : "bg-white/80 border-2 border-gray-200/60 text-gray-800 hover:bg-white hover:border-gray-300/60"
        }`}
        onClick={() => handleEditStart(field, isClickToEdit ? "" : value)}
      >
        {value}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-25 via-blue-25 to-indigo-25"
      style={{ backgroundColor: "#fafbfc" }}
    >
      {/* Medical Header */}
      <header className="bg-white border-b-2 border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-6">
              <div className="border-l-2 border-blue-200 pl-6 border-l-0">
                <h1 className="text-xl font-bold text-gray-800">
                  Dental Analysis System
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  AI-Powered Clinical Diagnostics
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleNavigation("/")}
                className="px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation("/demo")}
                className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200"
              >
                Clinical Analysis
              </button>
              <button
                onClick={() => handleNavigation("/facial-analysis")}
                className="px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
              >
                Reports
              </button>
              <button
                onClick={() => handleNavigation("/chat")}
                className="px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
              >
                Settings
              </button>
              <div className="h-6 w-px bg-gray-300 mx-4"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">Dr</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">Dr. Smith</p>
                  <p className="text-gray-500">Orthodontist</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medical Patient Record Header */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
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
                    <h2 className="text-2xl font-bold text-white">
                      Demonstration Case
                    </h2>
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                      DEMO
                    </span>
                  </div>
                  <p className="text-blue-100 text-lg font-medium">
                    Sample Clinical Data
                  </p>
                  <p className="text-blue-200 text-sm">
                    Case ID: #DEMO-2025-001 • Session Date:{" "}
                    {new Date().toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-sm">Current Session</div>
                <div className="text-white font-semibold">
                  {new Date().toLocaleDateString("en-GB")}
                </div>
                <div className="text-blue-200 text-sm">
                  {new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Navigation Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="record" className="p-8">
              {/* Upload Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Clinical Imaging Data
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <p className="text-gray-700 font-medium">
                          Session Date: {new Date().toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <p className="text-gray-700 font-medium">
                          Status: Ready for Analysis
                        </p>
                      </div>
                      {currentFolderName && (
                        <>
                          <div className="h-4 w-px bg-gray-300"></div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <p className="text-gray-700 font-medium">
                              Current Case: {currentFolderName}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      className={`bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-6 py-3 text-base font-semibold rounded-lg border border-purple-700`}
                      onClick={fakeLoadImages}
                      disabled={isLoading}
                    >
                      <Sparkles
                        className={`w-5 h-5 mr-2 ${
                          isLoading ? "animate-spin" : ""
                        }`}
                      />
                      {isLoading ? "Classifying..." : "Upload and Classify"}
                    </Button>
                  </div>
                </div>

                {/* Medical Loading Progress */}
                {isLoading && (
                  <div className="mt-4 bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-base font-semibold text-gray-800">
                          Processing Images
                        </span>
                      </div>
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {Math.round(loadingProgress)}%
                      </span>
                    </div>
                    <Progress value={loadingProgress} className="h-3 mb-3" />
                    <div className="text-sm text-gray-600 flex items-center justify-between">
                      <span>Processing uploaded images...</span>
                      <span className="text-xs text-gray-500">
                        Auto-detecting image types
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Content with Sidebar Layout */}
                <div className="flex gap-8">
                  {/* Upload Grid - Left Side */}
                  <div className="flex-1 space-y-10">
                    {uploadCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="space-y-6">
                        <div className="mb-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">
                                {category.title}
                              </h4>
                              <p className="text-sm text-gray-600 font-medium">
                                {category.subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-gray-200 ml-7"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {category.items.map((item) =>
                            item.name !== "Upper Jaw Scan" &&
                            item.name !== "Lower Jaw Scan" ? (
                              <Card
                                key={item.id}
                                className={`group cursor-pointer transition-all duration-200 hover:shadow-lg border rounded-xl ${
                                  loadingCards[item.id]
                                    ? "border-blue-300 bg-blue-50 shadow-md animate-pulse"
                                    : uploadedImages[item.id]
                                    ? "border-emerald-300 bg-emerald-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                                }`}
                                onClick={() =>
                                  !loadingCards[item.id] &&
                                  handleImageUpload(item.id)
                                }
                              >
                                <CardContent className="p-5 text-center relative">
                                  {/* Medical Status Indicator */}
                                  <div className="absolute top-3 right-3 flex items-center space-x-1">
                                    {uploadedImages[item.id] && (
                                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    )}
                                    {uploadedImages[item.id] && (
                                      <button
                                        onClick={(e) =>
                                          handleRemoveImage(item.id, e)
                                        }
                                        className="w-5 h-5 bg-gray-300 hover:bg-red-400 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        title="Remove image"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>

                                  <div
                                    className={`w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 ${
                                      loadingCards[item.id]
                                        ? "bg-blue-100 border border-blue-200"
                                        : uploadedImages[item.id]
                                        ? "bg-emerald-100 border border-emerald-200"
                                        : "bg-transparent"
                                    }`}
                                  >
                                    {loadingCards[item.id] ? (
                                      <Upload className="w-8 h-8 text-blue-500 animate-spin" />
                                    ) : uploadedImages[item.id] ? (
                                      imagePreviewUrls[item.id] ? (
                                        <img
                                          src={imagePreviewUrls[item.id]}
                                          alt={item.name}
                                          className="w-full h-full object-cover rounded-xl"
                                        />
                                      ) : (
                                        <img
                                          src={item.icon}
                                          alt={item.name}
                                          className="w-16 h-16 object-contain drop-shadow-sm"
                                        />
                                      )
                                    ) : (
                                      <img
                                        src={item.icon}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain drop-shadow-sm"
                                      />
                                    )}
                                  </div>

                                  <div className="text-center">
                                    <h5 className="text-sm font-semibold text-gray-500 mb-3">
                                      {item.name}
                                    </h5>
                                    {loadingCards[item.id] ? (
                                      <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium">
                                        <Upload className="w-3 h-3 mr-1 animate-spin" />
                                        Processing...
                                      </Badge>
                                    ) : uploadedImages[item.id] ? (
                                      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                        Ready
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">
                                        <Upload className="w-3 h-3 mr-1" />
                                        Click to Load
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ) : null
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Analysis Sidebar */}
                  <div className="w-80 space-y-6">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="text-xl font-bold text-gray-800">
                        Clinical Analysis
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        AI-Powered Diagnostic Tools
                      </p>
                    </div>

                    {/* Analysis Status Panel */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Activity className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="text-base font-semibold text-gray-800">
                            Analysis Status
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-mono">
                          {availableAnalysisCount} / {totalAnalysisCount} Available
                        </span>
                      </div>
                      <Progress
                        value={(availableAnalysisCount / totalAnalysisCount) * 100}
                        className="h-2 mb-3"
                      />
                      <div className="text-sm text-gray-700">
                        {availableAnalysisCount === totalAnalysisCount
                          ? "✅ All diagnostic tools are ready for use"
                          : `⏳ ${availableAnalysisCount} of ${totalAnalysisCount} analysis tools available`}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Facial Analysis */}
                      <div className="relative group">
                        <Button
                          className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${
                            hasFaceImages
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md border border-blue-700"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                          }`}
                          disabled={!hasFaceImages || showAIThinking}
                          onClick={() =>
                            hasFaceImages &&
                            handleAnalysisClick(
                              "facial",
                              "/facial-analysis",
                              true
                            )
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${
                              hasFaceImages ? "bg-blue-500" : "bg-gray-200"
                            }`}
                          >
                            <Brain className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-base flex items-center justify-between">
                              Facial Analysis
                              {hasFaceImages && (
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="text-sm opacity-80 mt-1">
                              {hasFaceImages
                                ? "Cephalometric Assessment"
                                : "Requires frontal & profile images"}
                            </div>
                          </div>
                        </Button>
                        {!hasFaceImages && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Frontal & Profile photos required
                            {!currentFolderName && <br />}
                            {!currentFolderName &&
                              "Upload images to detect case folder"}
                          </div>
                        )}
                      </div>

                      {/* Ceph Analysis */}
                      <div className="relative group">
                        <Button
                          className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${
                            uploadedImages.lateral
                              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md border border-teal-700"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                          }`}
                          disabled={!uploadedImages.lateral || showAIThinking}
                          onClick={() =>
                            uploadedImages.lateral &&
                            handleAnalysisClick("ceph", "/ceph-analysis", true)
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${
                              uploadedImages.lateral ? "bg-teal-500" : "bg-gray-200"
                            }`}
                          >
                            <Target className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-base flex items-center justify-between">
                              Ceph Analysis
                              {uploadedImages.lateral && (
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="text-sm opacity-80 mt-1">
                              {uploadedImages.lateral
                                ? "Cephalometric Measurements"
                                : "Requires lateral ceph X-ray"}
                            </div>
                          </div>
                        </Button>
                        {!uploadedImages.lateral && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Lateral ceph X-ray required
                          </div>
                        )}
                      </div>

                      {/* 3D Model Analysis
                      <div className="relative group">
                        <Button
                          className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${
                            has3DModel
                              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md border border-purple-700"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                          }`}
                          disabled={!has3DModel || showAIThinking}
                          onClick={() =>
                            has3DModel &&
                            handleAnalysisClick("3d", "/model-3d", true)
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${
                              has3DModel ? "bg-purple-500" : "bg-gray-200"
                            }`}
                          >
                            <Box className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-base flex items-center justify-between">
                              3D Model Analysis
                              {has3DModel && (
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="text-sm opacity-80 mt-1">
                              {has3DModel
                                ? "Digital Model Assessment"
                                : "Requires 3D scan data"}
                            </div>
                          </div>
                        </Button>
                        {!has3DModel && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Intraoral scan required
                          </div>
                        )}
                      </div> */}

                      {/* Treatment Planning */}
                      <div className="relative group">
                        <Button
                          className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${"bg-orange-600 hover:bg-orange-700 text-white shadow-md border border-orange-700"}`}
                          onClick={() =>
                            handleAnalysisClick(
                              "treatment",
                              "/treatment-plan",
                              true
                            )
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${"bg-orange-500"}`}
                          >
                            <Stethoscope className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-base flex items-center justify-between">
                              Treatment Planning
                              {hasAllImages && (
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="text-sm opacity-80 mt-1">
                              {hasAllImages
                                ? "AI Treatment Simulation"
                                : "Requires complete dataset"}
                            </div>
                          </div>
                        </Button>
                        {!hasAllImages && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Complete clinical data required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Medical Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 mt-16 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-8">
            </div>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
            <div className="max-w-3xl mx-auto mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Clinical AI Diagnostic Platform
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Advanced artificial intelligence for dental diagnostics and
                treatment planning. Empowering healthcare professionals with
                cutting-edge technology.
              </p>
            </div>
            <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-6">
              <span>FDA Compliant</span>
              <span>•</span>
              <span>HIPAA Secure</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 LeeTray × HiAI. All Rights Reserved. Medical Device
              Software.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Thinking Modal */}
      <AIThinkingModal
        isOpen={showAIThinking}
        analysisType={currentAnalysis}
        onComplete={handleAIThinkingComplete}
      />

      {/* Validation Error Modal */}
      <ValidationErrorModal
        show={validationError.show}
        message={validationError.message}
        imageId={validationError.imageId}
        fileName={validationError.fileName}
        onClose={() =>
          setValidationError({
            show: false,
            message: "",
            imageId: "",
            fileName: "",
          })
        }
        getKeywordsForType={getKeywordsForType}
        getExampleFileName={getExampleFileName}
      />

      {/* Toast Notification */}
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default DemoPage;
