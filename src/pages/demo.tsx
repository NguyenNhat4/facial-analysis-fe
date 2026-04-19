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
import ToastNotification from "../components/toast-notification";
import { PatientRecordHeader } from "../features/patient";
import { ImagingUploadHeader, ImagingUploadGrid } from "../features/imaging";
import { ClinicalAnalysisSidebar, MedicalHeader, MedicalFooter } from "../features/analysis";

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
    handleImageUpload,
    handleRemoveImage,
    fakeLoadImages,
    hasFaceImages,
    hasAllImages,
    availableAnalysisCount,
    totalAnalysisCount
  } = useImageManager(showToast);

  // AI Thinking Modal state
  const [showAIThinking, setShowAIThinking] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<
    "facial" | "ceph"
  >("facial");

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
    analysisType: "facial" | "ceph",
    path: string,
    withImages = false
  ) => {
    setCurrentAnalysis(analysisType);
    setShowAIThinking(true);

    // Close modal after 1s and navigate
    setTimeout(() => {
      setShowAIThinking(false);
      // Navigate after modal closes
      if (withImages) {
        handleNavigation(path, true);
      } else {
        handleNavigation(path);
      }
    }, 1000); // 1 second delay
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
      <MedicalHeader onNavigation={handleNavigation} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medical Patient Record Header */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
          <PatientRecordHeader />

          {/* Medical Navigation Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="record" className="p-8">
              {/* Upload Section */}
              <div className="mb-10">
                <ImagingUploadHeader
                  currentFolderName={currentFolderName}
                  isLoading={isLoading}
                  loadingProgress={loadingProgress}
                  onFakeLoadImages={fakeLoadImages}
                />

                <div className="flex gap-8">
                  <ImagingUploadGrid
                    uploadCategories={uploadCategories}
                    loadingCards={loadingCards}
                    uploadedImages={uploadedImages}
                    imagePreviewUrls={imagePreviewUrls}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={handleRemoveImage}
                  />

                  <ClinicalAnalysisSidebar
                    availableAnalysisCount={availableAnalysisCount}
                    totalAnalysisCount={totalAnalysisCount}
                    hasFaceImages={hasFaceImages}
                    showAIThinking={showAIThinking}
                    uploadedImages={uploadedImages}
                    currentFolderName={currentFolderName}
                    onAnalysisClick={handleAnalysisClick}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MedicalFooter />

      {/* AI Thinking Modal */}
      <AIThinkingModal
        isOpen={showAIThinking}
        analysisType={currentAnalysis}
        onComplete={() => {}} // No-op since modal closes immediately via parent
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
