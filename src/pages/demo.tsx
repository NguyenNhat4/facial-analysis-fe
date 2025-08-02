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
import { getFallbackImages } from "../utils/demo-cases";
import { groupFilesByType, validateFileType } from "../utils/image-detection";
import {
  findOutputPathFromAssets,
  extractCaseIdFromInputFile,
} from "../utils/case-mapping";
import AIThinkingModal from "../components/ai-thinking-modal";

const DemoPage = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("record");

  // Local upload state
  const [localImages, setLocalImages] = useState<{
    [key in ImageType]?: {
      input: File;
      inputPreview: string;
      outputPreview: string;
      outputFilename: string;
    };
  }>({});

  // Current case info
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(
    null
  );

  const [uploadedImages, setUploadedImages] = useState<{
    [key: string]: boolean;
  }>({
    lateral: false,
    profile: false,
    frontal: false,
    general_xray: false,
  });

  // State to store uploaded image files
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({
    lateral: null,
    profile: null,
    frontal: null,
    general_xray: null,
  });

  // State to store image preview URLs
  const [imagePreviewUrls, setImagePreviewUrls] = useState<{
    [key: string]: string;
  }>({
    lateral: "",
    profile: "",
    frontal: "",
    general_xray: "",
  });

  // Loading state for fake upload
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Validation error state
  const [validationError, setValidationError] = useState<{
    show: boolean;
    message: string;
    imageId: string;
    fileName: string;
  }>({
    show: false,
    message: "",
    imageId: "",
    fileName: "",
  });

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info",
  });

  // Show toast notification
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ show: true, message, type });

    // Auto hide after 3 seconds with fade out
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
      // Clear message after animation completes
      setTimeout(() => {
        setToast({ show: false, message: "", type: "info" });
      }, 500); // Match animation duration
    }, 3000);
  };

  // Enhanced patient data with editing states
  const [patientData, setPatientData] = useState({
    name: "NHẬT NGUYỄN",
    firstName: "NGUYỄN",
    lastName: "NHẬT",
    email: "635107103@st.utc2.edu.v",
    sex: "male",
    dateOfBirth: "01/01/1990",
    consultationDate: "07/07/2025",
    phone: "0909090909909",
    address: "Click to edit",
    chiefComplaint: "Click to edit",
    diagnose: "Click to edit",
    note: "Click to edit",
    treatmentPlan: "Click to edit",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  // AI Thinking Modal state
  const [showAIThinking, setShowAIThinking] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<
    "facial" | "radiographic" | "3d" | "treatment"
  >("facial");
  const [pendingNavigation, setPendingNavigation] = useState<{
    path: string;
    withImages: boolean;
  } | null>(null);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup all preview URLs to prevent memory leaks
      Object.values(imagePreviewUrls).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

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

  // Handle file upload with validation
  const handleFileUpload = (
    imageId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file name for specific image type
      const isValidFileName = validateFileNameForType(file.name, imageId);

      if (!isValidFileName) {
        // Show error message
        setValidationError({
          show: true,
          message: getValidationErrorMessage(imageId, file.name),
          imageId: imageId,
          fileName: file.name,
        });

        // Show toast error
        showToast("Sai loại ảnh", "error");
        return;
      }

      // Clean up previous URL if exists
      if (imagePreviewUrls[imageId]) {
        URL.revokeObjectURL(imagePreviewUrls[imageId]);
      }

      // Store the file
      setUploadedFiles((prev) => ({
        ...prev,
        [imageId]: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrls((prev) => ({
        ...prev,
        [imageId]: previewUrl,
      }));

      // Mark as uploaded
      setUploadedImages((prev) => ({
        ...prev,
        [imageId]: true,
      }));

      // Show success toast
      showToast("Upload thành công", "success");
    }
  };

  // Validate file name for specific image type
  const validateFileNameForType = (
    fileName: string,
    imageId: string
  ): boolean => {
    const fileNameLower = fileName.toLowerCase();

    const validationPatterns: Record<string, RegExp[]> = {
      lateral: [
        /lateral/i,
        /ceph/i,
        /cephalometric/i,
        /side.*x.*ray/i,
        /nghieng/i,
      ],
      general_xray: [
        /pano/i,
        /panoramic/i,
        /general.*x.*ray/i,
        /toan.*canh/i,
        /xquang.*tong/i,
        /ortho.*x.*ray/i,
      ],
      frontal: [
        /frontal/i,
        /front/i,
        /face.*front/i,
        /portrait/i,
        /mat.*truoc/i,
        /chinh.*dien/i,
      ],
      profile: [
        /profile/i,
        /side.*face/i,
        /lateral.*face/i,
        /mat.*nghieng/i,
        /ben.*hong/i,
      ],
    };

    const patterns = validationPatterns[imageId];
    if (!patterns) return true; // Skip validation for unknown types

    return patterns.some((pattern) => pattern.test(fileNameLower));
  };

  // Get validation error message
  const getValidationErrorMessage = (
    imageId: string,
    fileName: string
  ): string => {
    const typeNames: Record<string, string> = {
      lateral: "Lateral Cephalometric",
      general_xray: "General X-Ray (Panoramic)",
      frontal: "Frontal Face",
      profile: "Profile Face",
    };

    const typeName = typeNames[imageId] || imageId;

    return `Invalid file name for ${typeName}: "${fileName}"`;
  };

  // Get keywords for specific image type
  const getKeywordsForType = (imageId: string): string => {
    const keywords: Record<string, string> = {
      lateral: "• lateral, ceph, cephalometric, side x-ray, nghieng",
      general_xray: "• pano, panoramic, general x-ray, toan canh, xquang tong",
      frontal: "• frontal, front, face front, portrait, mat truoc, chinh dien",
      profile: "• profile, side face, lateral face, mat nghieng, ben hong",
    };

    return keywords[imageId] || "• Any valid keyword for this image type";
  };

  // Get example file name for specific image type
  const getExampleFileName = (imageId: string): string => {
    const examples: Record<string, string> = {
      lateral: "lateral.jpg",
      general_xray: "panoramic.jpg",
      frontal: "frontal.jpg",
      profile: "profile.jpg",
    };

    return examples[imageId] || "example.jpg";
  };

  // Handle remove uploaded image
  const handleRemoveImage = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click

    // Clean up URL to prevent memory leak
    if (imagePreviewUrls[imageId]) {
      URL.revokeObjectURL(imagePreviewUrls[imageId]);
    }

    // Reset states
    setUploadedFiles((prev) => ({
      ...prev,
      [imageId]: null,
    }));

    setImagePreviewUrls((prev) => ({
      ...prev,
      [imageId]: "",
    }));

    setUploadedImages((prev) => ({
      ...prev,
      [imageId]: false,
    }));
  };

  const handleImageUpload = (imageId: string) => {
    // Create and trigger file input for real upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleFileUpload(imageId, { target: { files: target.files } } as any);
      }
    };
    input.click();
  };

  // Check if specific image types are available for analysis
  const hasFaceImages = uploadedImages.frontal && uploadedImages.profile;
  const hasXrayImages = uploadedImages.lateral || uploadedImages.general_xray;
  const hasAllImages =
    uploadedImages.frontal &&
    uploadedImages.profile &&
    uploadedImages.lateral &&
    uploadedImages.general_xray;

  const handleEditStart = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleEditSave = (field: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: tempValue,
    }));
    setEditingField(null);
    setTempValue("");
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  // AI Thinking handlers
  const handleAnalysisClick = (
    analysisType: "facial" | "radiographic" | "3d" | "treatment",
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

  // Handle local images processed
  const handleLocalImagesProcessed = (processedImages: {
    [key in ImageType]?: {
      input: File;
      inputPreview: string;
      outputPreview: string;
      outputFilename: string;
    };
  }) => {
    setLocalImages(processedImages);

    // Update uploaded images state
    const newUploadedImages: { [key: string]: boolean } = {
      lateral: false,
      profile: false,
      frontal: false,
      general_xray: false,
    };

    const newImagePreviewUrls: { [key: string]: string } = {
      lateral: "",
      profile: "",
      frontal: "",
      general_xray: "",
    };

    Object.entries(processedImages).forEach(([imageType, data]) => {
      if (data) {
        newUploadedImages[imageType] = true;
        newImagePreviewUrls[imageType] = data.inputPreview;
      }
    });

    setUploadedImages(newUploadedImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  // Handle file picker and load images (input from local, output from assets)
  const fakeLoadImages = async () => {
    // Create file input element for multiple files (not folders)
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,.stl,.obj,.ply";

    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      console.log("file ", files);
      if (files.length === 0) return;

      setIsLoading(true);
      setLoadingProgress(0);
      setLoadingCards({});

      // Reset all states first
      setUploadedImages({
        lateral: false,
        profile: false,
        frontal: false,
        general_xray: false,
      });

      setImagePreviewUrls({
        lateral: "",
        profile: "",
        frontal: "",
        general_xray: "",
      });

      // Reset folder info
      setCurrentCaseId(null);
      setCurrentFolderName(null);

      try {
        // Validate and group files by type
        const validFiles = files.filter(validateFileType);
        const { detected } = await groupFilesByType(validFiles);

        // Extract case ID from first file (assume all files are from same case)
        let detectedCaseId: string | null = null;
        let detectedFolderName: string | null = null;

        for (const file of validFiles) {
          detectedCaseId = extractCaseIdFromInputFile(file);
          if (detectedCaseId) {
            detectedFolderName = detectedCaseId; // folder name is same as case ID
            break;
          }
        }

        if (detectedCaseId && detectedFolderName) {
          setCurrentCaseId(detectedCaseId);
          setCurrentFolderName(detectedFolderName);
          console.log(
            `Detected case: ${detectedCaseId}, folder: ${detectedFolderName}`
          );
        }

        const allDetectedFiles = Object.values(detected).flat();
        let processedCount = 0;

        // Process each detected file
        for (const [imageType, typeFiles] of Object.entries(detected)) {
          if (typeFiles.length > 0) {
            // Take the first file of each type
            const file = typeFiles[0];

            // Set loading state for current card
            setLoadingCards((prev) => ({ ...prev, [imageType]: true }));

            // Simulate loading delay
            await new Promise((resolve) =>
              setTimeout(resolve, 500 + Math.random() * 800)
            );

            // Create preview URL from uploaded input file
            const inputPreviewUrl = URL.createObjectURL(file);

            // Generate output path from assets/outputs/
            const outputPath = findOutputPathFromAssets(
              file,
              imageType as ImageType
            );

            console.log(`Input: ${file.name} → Output: ${outputPath}`);

            // Set preview URL (input image)
            setImagePreviewUrls((prev) => ({
              ...prev,
              [imageType]: inputPreviewUrl,
            }));

            // Store local image data for future processing
            setLocalImages((prev) => ({
              ...prev,
              [imageType as ImageType]: {
                input: file,
                inputPreview: inputPreviewUrl,
                outputPreview: outputPath,
                outputFilename: outputPath.split("/").pop() || "output.png",
              },
            }));

            // Mark as uploaded
            setUploadedImages((prev) => ({
              ...prev,
              [imageType]: true,
            }));

            // Remove loading state for current card
            setLoadingCards((prev) => ({ ...prev, [imageType]: false }));

            processedCount++;
            setLoadingProgress(
              (processedCount / allDetectedFiles.length) * 100
            );
          }
        }
      } catch (error) {
        console.error("Failed to process uploaded images:", error);
      }

      // Finish loading
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 300);
    };

    // Trigger file picker
    input.click();
  };

  // Load single sample image
  const loadSingleSampleImage = async (imageId: string) => {
    try {
      const sampleImages = await getFallbackImages();
      const imagePath = sampleImages[imageId as keyof typeof sampleImages];
      if (!imagePath) return;

      // Set loading state for this card
      setLoadingCards((prev) => ({ ...prev, [imageId]: true }));

      // Simulate loading delay
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 600)
      );

      // Clean up previous URL if exists
      if (imagePreviewUrls[imageId]) {
        URL.revokeObjectURL(imagePreviewUrls[imageId]);
      }

      // Set preview URL to demo image path
      setImagePreviewUrls((prev) => ({
        ...prev,
        [imageId]: imagePath,
      }));

      // Mark as uploaded
      setUploadedImages((prev) => ({
        ...prev,
        [imageId]: true,
      }));

      // Remove loading state
      setLoadingCards((prev) => ({ ...prev, [imageId]: false }));
    } catch (error) {
      console.error("Failed to load single image:", error);
    }
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
                                      item.id === "model_3d_upper" ||
                                      item.id === "model_3d_lower" ? (
                                        <div className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                          <Box className="w-12 h-12 text-purple-600" />
                                          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                          <div className="absolute top-1 left-1 text-xs bg-purple-600 text-white px-1 rounded">
                                            {item.id === "model_3d_upper"
                                              ? "U"
                                              : "L"}
                                          </div>
                                        </div>
                                      ) : imagePreviewUrls[item.id] ? (
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
                    {/* 3D Model Analysis */}
                    <div className="relative group">
                      <Button
                        className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${"bg-purple-600 hover:bg-purple-700 text-white shadow-md border border-purple-700"}`}
                        onClick={() => handleNavigation("/model-3d", true)}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${"bg-purple-500"}`}
                        >
                          <Box className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-base flex items-center justify-between">
                            3D Model Analysis
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                          </div>
                          <div className="text-sm opacity-80 mt-1">
                            Digital Model Assessment
                          </div>
                        </div>
                      </Button>
                    </div>
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
                          {Object.values(uploadedImages).filter(Boolean).length}{" "}
                          / {Object.keys(uploadedImages).length} Ready
                        </span>
                      </div>
                      <Progress
                        value={
                          (Object.values(uploadedImages).filter(Boolean)
                            .length /
                            Object.keys(uploadedImages).length) *
                          100
                        }
                        className="h-2 mb-3"
                      />
                      <div className="text-sm text-gray-700">
                        {Object.values(uploadedImages).filter(Boolean)
                          .length === Object.keys(uploadedImages).length
                          ? "✅ All diagnostic tools are ready for use"
                          : "⏳ Load more data to enable additional analysis"}
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

                      {/* Radiographic Analysis */}
                      <div className="relative group">
                        <Button
                          className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${
                            hasXrayImages
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border border-emerald-700"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                          }`}
                          disabled={!hasXrayImages || showAIThinking}
                          onClick={() =>
                            hasXrayImages &&
                            handleAnalysisClick(
                              "radiographic",
                              "/xray-analysis",
                              true
                            )
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${
                              hasXrayImages ? "bg-emerald-500" : "bg-gray-200"
                            }`}
                          >
                            <Scan className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-base flex items-center justify-between">
                              Radiographic Analysis
                              {hasXrayImages && (
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="text-sm opacity-80 mt-1">
                              {hasXrayImages
                                ? "Digital X-Ray Interpretation"
                                : "Requires radiographic data"}
                            </div>
                          </div>
                        </Button>
                        {!hasXrayImages && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Digital radiographs required
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
              <div className="flex items-center space-x-4">
                <img
                  src="/assets/leetray_logo.png"
                  alt="LeeTray Logo"
                  className="w-16 h-16 object-contain"
                />
                <div className="h-8 w-px bg-gray-600"></div>
                <img
                  src="/assets/hiai-logo.png"
                  alt="HiAI Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
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
      {validationError.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Invalid File Name
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                The file name doesn't match the expected format for this image
                type.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-mono text-gray-700">
                  File: {validationError.fileName}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">
                  Valid keywords for this type:
                </p>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <pre className="text-xs text-blue-800 whitespace-pre-wrap">
                    {getKeywordsForType(validationError.imageId)}
                  </pre>
                </div>
                <p className="font-medium mb-2">Example file names:</p>
                <div className="bg-green-50 rounded-lg p-3">
                  <pre className="text-xs text-green-800 whitespace-pre-wrap">
                    case01_{getExampleFileName(validationError.imageId)}
                    patient02_{getExampleFileName(validationError.imageId)}
                    {getExampleFileName(validationError.imageId)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() =>
                  setValidationError({
                    show: false,
                    message: "",
                    imageId: "",
                    fileName: "",
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 ease-in-out ${
            toast.show
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <div
            className={`px-6 py-4 rounded-lg shadow-lg max-w-sm ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {toast.type === "error" && (
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {toast.type === "info" && (
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() =>
                  setToast({ show: false, message: "", type: "info" })
                }
                className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
