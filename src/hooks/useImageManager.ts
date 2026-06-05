import { useState } from "react";
import { useImageStore } from "@/stores/image-store";
import type { ImageType } from "@/stores/image-store";
import { usePatientStore } from "@/stores/patient-store";
import { useUploadImage, useDeleteImage } from "@/api/patients";

interface LocalImageDetail {
  input: File;
  inputPreview: string;
  outputPreview: string;
  outputFilename: string;
}

type LocalImagesMap = {
  [key in ImageType]?: LocalImageDetail;
};

export function useImageManager(
  showToast: (message: string, type?: "success" | "error" | "info") => void
) {
  const {
    localImages,
    currentCaseId,
    currentFolderName,
    uploadedImages,
    uploadedFiles,
    imagePreviewUrls,
    imageIds,
    setLocalImages,
    setCurrentCaseId,
    setCurrentFolderName,
    setUploadedImages,
    setUploadedFiles,
    setImagePreviewUrls,
    setUploadedImage,
    setUploadedFile,
    setImagePreviewUrl,
    setImageId,
  } = useImageStore();
  const { patientData } = usePatientStore();
  const uploadImageMutation = useUploadImage();
  const deleteImageMutation = useDeleteImage();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingCards, setLoadingCards] = useState<Record<string, boolean>>({});

  /**
   * Performs the upload of an image file to the backend
   */
  const uploadFile = (imageId: string, file: File) => {
    // Revoke previous local object URL to avoid memory leaks
    if (imagePreviewUrls[imageId]) {
      URL.revokeObjectURL(imagePreviewUrls[imageId]);
    }

    // Save locally
    setUploadedFile(imageId, file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(imageId, previewUrl);
    setUploadedImage(imageId, true);

    // Save to backend if patient ID exists
    if (patientData.patientId) {
      uploadImageMutation.mutate(
        {
          patientId: patientData.patientId,
          file,
          imageType: imageId === "lateral" ? "xray" : imageId,
        },
        {
          onSuccess: (dbImage) => {
            setImageId(imageId, dbImage.id);
            showToast("Upload successful", "success");
          },
          onError: (err: any) => {
            showToast(`Failed to upload image: ${err.message}`, "error");
          },
        }
      );
    } else {
      showToast("Upload local success (no patient ID)", "success");
    }
  };

  /**
   * Prompts the browser's native file selector and handles the file selection
   */
  const handleImageUpload = (imageId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        uploadFile(imageId, file);
      }
    };

    input.click();
  };

  /**
   * Removes an uploaded image and releases resources
   */
  const handleRemoveImage = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    // Remove from backend if exists
    const dbImageId = imageIds[imageId];
    if (dbImageId) {
      deleteImageMutation.mutate(
        { imageId: dbImageId, patientId: patientData.patientId },
        {
          onSuccess: () => {
            showToast("Image removed successfully", "success");
          },
          onError: (err: any) => {
            showToast(`Failed to remove image: ${err.message}`, "error");
          },
        }
      );
    }

    if (imagePreviewUrls[imageId]) {
      URL.revokeObjectURL(imagePreviewUrls[imageId]);
    }
    setUploadedFile(imageId, null);
    setImagePreviewUrl(imageId, "");
    setUploadedImage(imageId, false);
    setImageId(imageId, null);
  };



  const hasFaceImages = uploadedImages.frontal && uploadedImages.profile;
  const hasCephImages = uploadedImages.lateral;
  const hasAllImages =
    uploadedImages.frontal && uploadedImages.profile && uploadedImages.lateral;

  const availableAnalysisCount = [hasFaceImages, hasCephImages].filter(
    Boolean
  ).length;
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
    uploadFile,
    handleImageUpload,
    handleRemoveImage,
    hasFaceImages,
    hasCephImages,
    hasAllImages,
    availableAnalysisCount,
    totalAnalysisCount,
  };
}
