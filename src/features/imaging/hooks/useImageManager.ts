import { useState } from "react";
import { ImageType } from "../../../types/demo-cases";
import { getFallbackImages } from "../../../utils/demo-cases";
import { groupFilesByType, validateFileType } from "../../../utils/image-detection";
import {
  findOutputPathFromAssets,
  extractCaseIdFromInputFile,
} from "../../../utils/case-mapping";
import { useImageStore } from "../stores/image-store";

export function useImageManager(showToast: (message: string, type?: "success" | "error" | "info") => void) {
  const {
    localImages,
    currentCaseId,
    currentFolderName,
    uploadedImages,
    uploadedFiles,
    imagePreviewUrls,
    setLocalImages,
    setCurrentCaseId,
    setCurrentFolderName,
    setUploadedImages,
    setUploadedFiles,
    setImagePreviewUrls,
    setUploadedImage,
    setUploadedFile,
    setImagePreviewUrl,
  } = useImageStore();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = (imageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {

    

    if (imagePreviewUrls[imageId]) {
      URL.revokeObjectURL(imagePreviewUrls[imageId]);
    }

      setUploadedFile(imageId, file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageId, previewUrl);

      setUploadedImage(imageId, true);

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
    setUploadedFile(imageId, null);
    setImagePreviewUrl(imageId, "");
    setUploadedImage(imageId, false);
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

            setImagePreviewUrl(imageType, inputPreviewUrl);
            setLocalImages((prev: any) => ({
              ...prev,
              [imageType as ImageType]: {
                input: file,
                inputPreview: inputPreviewUrl,
                outputPreview: outputPath,
                outputFilename: outputPath.split("/").pop() || "output.png",
              },
            }));

            setUploadedImage(imageType, true);
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

  const hasFaceImages = uploadedImages.frontal && uploadedImages.profile;
  const hasCephImages = uploadedImages.lateral;
  const hasAllImages = uploadedImages.frontal && uploadedImages.profile && uploadedImages.lateral;
  
  const availableAnalysisCount = [hasFaceImages, hasCephImages].filter(Boolean).length;
  const totalAnalysisCount = 2;

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
    handleFileUpload,
    handleImageUpload,
    handleRemoveImage,
    fakeLoadImages,
    hasFaceImages,
    hasCephImages,
    hasAllImages,
    availableAnalysisCount,
    totalAnalysisCount
  };
}
