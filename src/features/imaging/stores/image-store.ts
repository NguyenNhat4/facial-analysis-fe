import { create } from "zustand";
import { ImageType } from "../../../types/demo-cases";

interface ImageState {
  localImages: {
    [key in ImageType]?: {
      input: File;
      inputPreview: string;
      outputPreview: string;
      outputFilename: string;
    };
  };
  currentCaseId: string | null;
  currentFolderName: string | null;
  uploadedImages: { [key: string]: boolean };
  uploadedFiles: { [key: string]: File | null };
  imagePreviewUrls: { [key: string]: string };

  setLocalImages: (images: any | ((prev: any) => any)) => void;
  setCurrentCaseId: (id: string | null) => void;
  setCurrentFolderName: (name: string | null) => void;
  setUploadedImages: (images: any) => void;
  setUploadedFiles: (files: any) => void;
  setImagePreviewUrls: (urls: any) => void;

  // Convenient single image updates
  setUploadedImage: (imageId: string, isUploaded: boolean) => void;
  setUploadedFile: (imageId: string, file: File | null) => void;
  setImagePreviewUrl: (imageId: string, url: string) => void;

  reset: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  localImages: {},
  currentCaseId: null,
  currentFolderName: null,
  uploadedImages: {
    lateral: false,
    profile: false,
    frontal: false,
  },
  uploadedFiles: {
    lateral: null,
    profile: null,
    frontal: null,
  },
  imagePreviewUrls: {
    lateral: "",
    profile: "",
    frontal: "",
  },

  setLocalImages: (images) => set((state) => ({
    localImages: typeof images === "function" ? images(state.localImages) : images
  })),
  setCurrentCaseId: (id) => set({ currentCaseId: id }),
  setCurrentFolderName: (name) => set({ currentFolderName: name }),
  setUploadedImages: (images) => set({ uploadedImages: images }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  setImagePreviewUrls: (urls) => set({ imagePreviewUrls: urls }),

  setUploadedImage: (imageId, isUploaded) => set((state) => ({
    uploadedImages: { ...state.uploadedImages, [imageId]: isUploaded }
  })),
  setUploadedFile: (imageId, file) => set((state) => ({
    uploadedFiles: { ...state.uploadedFiles, [imageId]: file }
  })),
  setImagePreviewUrl: (imageId, url) => set((state) => ({
    imagePreviewUrls: { ...state.imagePreviewUrls, [imageId]: url }
  })),

  reset: () => {
    // Note: If you want to revoke URLs, it should be done where this is called
    set({
      localImages: {},
      currentCaseId: null,
      currentFolderName: null,
      uploadedImages: {
        lateral: false,
        profile: false,
        frontal: false,
      },
      uploadedFiles: {
        lateral: null,
        profile: null,
        frontal: null,
      },
      imagePreviewUrls: {
        lateral: "",
        profile: "",
        frontal: "",
      },
    });
  }
}));
