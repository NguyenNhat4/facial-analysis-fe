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
  hasAnalyzed: { [key: string]: boolean };

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
  setHasAnalyzed: (analysisType: string, value: boolean) => void;

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
  hasAnalyzed: {
    facial: false,
    ceph: false,
  },

  setLocalImages: (images) => set((state) => ({
    localImages: typeof images === "function" ? images(state.localImages) : images
  })),
  setCurrentCaseId: (id) => set({ currentCaseId: id }),
  setCurrentFolderName: (name) => set({ currentFolderName: name }),
  setUploadedImages: (images) => set({
    uploadedImages: images,
    hasAnalyzed: { facial: false, ceph: false }
  }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  setImagePreviewUrls: (urls) => set({ imagePreviewUrls: urls }),

  setUploadedImage: (imageId, isUploaded) => set((state) => {
    let resetFacial = false;
    let resetCeph = false;
    if (imageId === 'frontal' || imageId === 'profile') resetFacial = true;
    if (imageId === 'lateral') resetCeph = true;

    return {
      uploadedImages: { ...state.uploadedImages, [imageId]: isUploaded },
      hasAnalyzed: {
        ...state.hasAnalyzed,
        ...(resetFacial ? { facial: false } : {}),
        ...(resetCeph ? { ceph: false } : {}),
      }
    };
  }),
  setUploadedFile: (imageId, file) => set((state) => ({
    uploadedFiles: { ...state.uploadedFiles, [imageId]: file }
  })),
  setImagePreviewUrl: (imageId, url) => set((state) => ({
    imagePreviewUrls: { ...state.imagePreviewUrls, [imageId]: url }
  })),

  setHasAnalyzed: (analysisType, value) => set((state) => ({
    hasAnalyzed: { ...state.hasAnalyzed, [analysisType]: value }
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
      hasAnalyzed: {
        facial: false,
        ceph: false,
      },
    });
  }
}));
