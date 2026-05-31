import { useState } from "react";
import { useImageStore } from "../stores/image-store";
import type { ImageType } from "../stores/image-store";

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
        // Process uploaded files
        let processedCount = 0;
        const imageTypes: ImageType[] = ["lateral", "profile", "frontal"];

        for (let i = 0; i < files.length && i < imageTypes.length; i++) {
          const file = files[i];
          const imageType = imageTypes[i];
          
          setLoadingCards((prev) => ({ ...prev, [imageType]: true }));
          await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 800));

          const inputPreviewUrl = URL.createObjectURL(file);
          const outputPath = `/assets/outputs/${file.name}`;

          setImagePreviewUrl(imageType, inputPreviewUrl);
          setLocalImages((prev: any) => ({
            ...prev,
            [imageType]: {
              input: file,
              inputPreview: inputPreviewUrl,
              outputPreview: outputPath,
              outputFilename: outputPath.split("/").pop() || "output.png",
            },
          }));

          setUploadedImage(imageType, true);
          setLoadingCards((prev) => ({ ...prev, [imageType]: false }));

          processedCount++;
          setLoadingProgress((processedCount / files.length) * 100);
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
