import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  Tabs,
  TabsContent,
} from "../components/ui/tabs";
import { useSimpleToast } from "../hooks/useSimpleToast";
import { useImageManager } from "../features/imaging/hooks/useImageManager";
import AIThinkingModal from "../components/ai-thinking-modal";
import ToastNotification from "../components/toast-notification";
import { PatientRecordHeader } from "../features/patient";
import { ImagingUploadHeader, ImagingUploadGrid } from "../features/imaging";
import { ClinicalAnalysisSidebar } from "@/components/clinical-analysis-sidebar";
import { MedicalHeader } from "@/components/medical-header";
import { MedicalFooter } from "@/components/medical-footer";
import { getPatientById } from "../features/patient/data/patient-mocks";
import { usePatientStore } from "../features/patient/stores/patient-store";
const IMAGE_TYPE_MAPPING: Record<
  ImageType,
  {
    name?: string;
    category?: string;
    icon?: string;
  }
> = {
  lateral: {
    name: "Lateral Cephalometric",
    category: "Radiographic Imaging",
    icon: "/assets/upload_logo/logo-lateral-xray.png",
  },
  frontal: {
    name: "Frontal Portrait",
    category: "Clinical Photography",
    icon: "/assets/upload_logo/frontal-face.png",
  },
  profile: {
    name: "Lateral Profile",
    category: "Clinical Photography",
    icon: "/assets/upload_logo/logo-side-face.png",
  },
};
export type ImageType =
  | "lateral"
  | "profile"
  | "frontal";

const DemoPage = () => {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute("/patients/:id/upload");
  const [activeTab, setActiveTab] = useState("record");

  const { toast, showToast, hideToast } = useSimpleToast();
  const { setPatientData } = usePatientStore();
  
 
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
    availableAnalysisCount,
    totalAnalysisCount
  } = useImageManager(showToast);

  useEffect(() => {
    if (!params?.id) return;
    const patient = getPatientById(params.id);
    if (!patient) {
      showToast("Patient not found", "error");
      return;
    }
    setPatientData(patient);
  }, [params?.id, setPatientData, showToast]);

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

      {/* <MedicalFooter /> */}

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
