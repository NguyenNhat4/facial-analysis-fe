import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  Tabs,
  TabsContent,
} from "../components/ui/tabs";
import { useSimpleToast } from "../hooks/useSimpleToast";
import { useImageManager } from "@/hooks/useImageManager";
import AIThinkingModal from "../components/ai-thinking-modal";
import ToastNotification from "../components/toast-notification";
import { PatientRecordHeader } from "@/components/patient-record-header";
import { ImagingUploadHeader } from "@/components/imaging-upload-header";
import { ImagingUploadGrid } from "@/components/imaging-upload-grid";
import { ClinicalAnalysisSidebar } from "@/components/clinical-analysis-sidebar";
import { MedicalHeader } from "@/components/medical-header";
import { MedicalFooter } from "@/components/medical-footer";
import { usePatient } from "@/api/patients";
import { usePatientStore } from "@/stores/patient-store";
export type ImageType = "lateral" | "profile" | "frontal";

const UPLOAD_CATEGORIES = [
  {
    title: "Radiographic Imaging",
    subtitle: "Digital X-Ray Acquisitions",
    items: [
      {
        id: "lateral" as ImageType,
        name: "Lateral Cephalometric",
        icon: "/assets/upload_logo/logo-lateral-xray.png",
      },
    ],
  },
  {
    title: "Clinical Photography",
    subtitle: "Facial Analysis Images",
    items: [
      {
        id: "frontal" as ImageType,
        name: "Frontal Portrait",
        icon: "/assets/upload_logo/frontal-face.png",
      },
      {
        id: "profile" as ImageType,
        name: "Lateral Profile",
        icon: "/assets/upload_logo/logo-side-face.png",
      },
    ],
  },
];

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

  const { data: patient, isLoading: isLoadingPatient, isError } = usePatient(params?.id);

  useEffect(() => {
    if (isError) {
      showToast("Patient not found", "error");
      return;
    }
    if (patient) {
      setPatientData({
        patientId: patient.id.toString(),
        name: patient.fullname,
        firstName: patient.fullname.split(" ")[0] || "",
        lastName: patient.fullname.split(" ").slice(1).join(" ") || "",
        phone: patient.phone,
        consultationDate: new Date(patient.consultation_date).toLocaleDateString("en-GB"),
        note: patient.notes?.[0]?.content || "",
      });
    }
  }, [patient, isError, setPatientData, showToast]);

  // AI Thinking Modal state
  const [showAIThinking, setShowAIThinking] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<
    "facial" | "ceph"
  >("facial");

  const uploadCategories = UPLOAD_CATEGORIES;



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
        onComplete={() => { }} // No-op since modal closes immediately via parent
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
