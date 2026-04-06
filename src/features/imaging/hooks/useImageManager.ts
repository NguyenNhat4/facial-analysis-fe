import { useState, useEffect } from "react";
import { ImageType } from "../../../types/demo-cases";
import { getFallbackImages } from "../../../utils/demo-cases";
import { groupFilesByType, validateFileType } from "../../../utils/image-detection";
import {
  findOutputPathFromAssets,
  extractCaseIdFromInputFile,
} from "../../../utils/case-mapping";

interface ValidationState {
  show: boolean;
  message: string;
  imageId: string;
  fileName: string;
}

export function useImageManager(showToast: (message: string, type?: "success" | "error" | "info") => void) {
  const [localImages, setLocalImages] = useState<{
    [key in ImageType]?: {
      input: File;
      inputPreview: string;
      outputPreview: string;
      outputFilename: string;
    };
  }>({});

  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: boolean }>({
    lateral: false,
    profile: false,
    frontal: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    lateral: null,
    profile: null,
    frontal: null,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<{ [key: string]: string }>({
    lateral: "",
    profile: "",
    frontal: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>({});

  const [validationError, setValidationError] = useState<ValidationState>({
    show: false,
    message: "",
    imageId: "",
    fileName: "",
  });

  useEffect(() => {
    return () => {
      Object.values(imagePreviewUrls).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []); // Only on unmount or initial, depends on imagePreviewUrls. Actually to be safe we can use a ref or just keep it simple as in demo.tsx

  const validateFileNameForType = (fileName: string, imageId: string): boolean => {
    const fileNameLower = fileName.toLowerCase();
    const validationPatterns: Record<string, RegExp[]> = {
      lateral: [/lateral/i, /ceph/i, /cephalometric/i, /side.*x.*ray/i, /nghieng/i],
      frontal: [/frontal/i, /front/i, /face.*front/i, /portrait/i, /mat.*truoc/i, /chinh.*dien/i],
      profile: [/profile/i, /side.*face/i, /lateral.*face/i, /mat.*nghieng/i, /ben.*hong/i],
    };

    const patterns = validationPatterns[imageId];
    if (!patterns) return true;
    return patterns.some((pattern) => pattern.test(fileNameLower));
  };

  const getValidationErrorMessage = (imageId: string, fileName: string): string => {
    const typeNames: Record<string, string> = {
      lateral: "Lateral Cephalometric",
      frontal: "Frontal Face",
      profile: "Profile Face",
    };
    return `Invalid file name for ${typeNames[imageId] || imageId}: "${fileName}"`;
  };

  const handleFileUpload = (imageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValidFileName = validateFileNameForType(file.name, imageId);

      if (!isValidFileName) {
        setValidationError({
          show: true,
          message: getValidationErrorMessage(imageId, file.name),
          imageId: imageId,
          fileName: file.name,
        });
        showToast("Sai loại ảnh", "error");
        return;
      }

      if (imagePreviewUrls[imageId]) {
        URL.revokeObjectURL(imagePreviewUrls[imageId]);
      }

      setUploadedFiles((prev) => ({ ...prev, [imageId]: file }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrls((prev) => ({ ...prev, [imageId]: previewUrl }));

      setUploadedImages((prev) => ({ ...prev, [imageId]: true }));

      showToast("Upload thành công", "success");
    }
  };

  const handleImageUpload = (imageId: string) => {
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

  const handleRemoveImage = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (imagePreviewUrls[imageId]) {
      URL.revokeObjectURL(imagePreviewUrls[imageId]);
    }
    setUploadedFiles((prev) => ({ ...prev, [imageId]: null }));
    setImagePreviewUrls((prev) => ({ ...prev, [imageId]: "" }));
    setUploadedImages((prev) => ({ ...prev, [imageId]: false }));
  };

  const fakeLoadImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,.stl,.obj,.ply";

    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      if (files.length === 0) return;

      setIsLoading(true);
      setLoadingProgress(0);
      setLoadingCards({});
      setUploadedImages({ lateral: false, profile: false, frontal: false });
      setImagePreviewUrls({ lateral: "", profile: "", frontal: "" });
      setCurrentCaseId(null);
      setCurrentFolderName(null);

      try {
        const validFiles = files.filter(validateFileType);
        const { detected } = await groupFilesByType(validFiles);

        let detectedCaseId: string | null = null;
        let detectedFolderName: string | null = null;

        for (const file of validFiles) {
          detectedCaseId = extractCaseIdFromInputFile(file);
          if (detectedCaseId) {
            detectedFolderName = detectedCaseId;
            break;
          }
        }

        if (detectedCaseId && detectedFolderName) {
          setCurrentCaseId(detectedCaseId);
          setCurrentFolderName(detectedFolderName);
        }

        const allDetectedFiles = Object.values(detected).flat();
        let processedCount = 0;

        for (const [imageType, typeFiles] of Object.entries(detected)) {
          if (typeFiles.length > 0) {
            const file = typeFiles[0];
            setLoadingCards((prev) => ({ ...prev, [imageType]: true }));
            await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 800));

            const inputPreviewUrl = URL.createObjectURL(file);
            const outputPath = findOutputPathFromAssets(file, imageType as ImageType);

            setImagePreviewUrls((prev) => ({ ...prev, [imageType]: inputPreviewUrl }));
            setLocalImages((prev) => ({
              ...prev,
              [imageType as ImageType]: {
                input: file,
                inputPreview: inputPreviewUrl,
                outputPreview: outputPath,
                outputFilename: outputPath.split("/").pop() || "output.png",
              },
            }));

            setUploadedImages((prev) => ({ ...prev, [imageType]: true }));
            setLoadingCards((prev) => ({ ...prev, [imageType]: false }));

            processedCount++;
            setLoadingProgress((processedCount / allDetectedFiles.length) * 100);
          }
        }
      } catch (error) {
        console.error("Failed to process uploaded images:", error);
      }

      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 300);
    };

    input.click();
  };

  const getKeywordsForType = (imageId: string): string => {
    const keywords: Record<string, string> = {
      lateral: "• lateral, ceph, cephalometric, side x-ray, nghieng",
      frontal: "• frontal, front, face front, portrait, mat truoc, chinh dien",
      profile: "• profile, side face, lateral face, mat nghieng, ben hong",
    };
    return keywords[imageId] || "• Any valid keyword for this image type";
  };

  const getExampleFileName = (imageId: string): string => {
    const examples: Record<string, string> = {
      lateral: "lateral.jpg",
      frontal: "frontal.jpg",
      profile: "profile.jpg",
    };
    return examples[imageId] || "example.jpg";
  };

  const hasFaceImages = uploadedImages.frontal && uploadedImages.profile;
  const hasCephImages = uploadedImages.lateral;
  const hasAllImages = uploadedImages.frontal && uploadedImages.profile && uploadedImages.lateral;
  
  const availableAnalysisCount = [hasFaceImages, hasCephImages, true].filter(Boolean).length;
  const totalAnalysisCount = 3;

  return {
    localImages,
    currentCaseId,
    currentFolderName,
    uploadedImages,
    uploadedFiles,
    imagePreviewUrls,
    isLoading,
    loadingProgress,
    loadingCards,
    validationError,
    setValidationError,
    handleFileUpload,
    handleImageUpload,
    handleRemoveImage,
    fakeLoadImages,
    getKeywordsForType,
    getExampleFileName,
    hasFaceImages,
    hasCephImages,
    hasAllImages,
    availableAnalysisCount,
    totalAnalysisCount
  };
}
