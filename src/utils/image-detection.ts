import { ImageType } from '../types/demo-cases';

// Patterns để detect loại ảnh từ filename
const IMAGE_PATTERNS: Record<ImageType, RegExp[]> = {
  lateral: [
    /lateral/i,
    /ceph/i,
    /cephalometric/i,
    /side.*x.*ray/i,
    /nghieng/i
  ],
  frontal: [
    /frontal/i,
    /front/i,
    /face.*front/i,
    /portrait/i,
    /mat.*truoc/i,
    /chinh.*dien/i
  ],
  profile: [
    /profile/i,
    /side.*face/i,
    /lateral.*face/i,
    /mat.*nghieng/i,
    /ben.*hong/i
  ]
};

// Keywords để detect từ EXIF/metadata
const METADATA_KEYWORDS: Record<ImageType, string[]> = {
  lateral: ['lateral', 'cephalometric', 'side x-ray'],
  frontal: ['frontal face', 'front portrait', 'face front'],
  profile: ['profile', 'side face', 'lateral face']
};

// Function để detect image type từ filename
export const detectImageTypeFromFilename = (filename: string): ImageType | null => {
  const cleanFilename = filename.toLowerCase();
  
  for (const [imageType, patterns] of Object.entries(IMAGE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(cleanFilename)) {
        return imageType as ImageType;
      }
    }
  }
  
  return null;
};

// Function để detect image type từ file content/metadata
export const detectImageTypeFromFile = async (file: File): Promise<ImageType | null> => {
  // First try filename detection
  const filenameDetection = detectImageTypeFromFilename(file.name);
  if (filenameDetection) {
    return filenameDetection;
  }


  // Could add EXIF reading here if needed
  // For now, return null if can't detect
  return null;
};

// Function để suggest image type cho user confirm
export const getSuggestedImageTypes = (filename: string): ImageType[] => {
  const suggestions: ImageType[] = [];
  const cleanFilename = filename.toLowerCase();
  
  for (const [imageType, patterns] of Object.entries(IMAGE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(cleanFilename)) {
        suggestions.push(imageType as ImageType);
        break; // Only add once per type
      }
    }
  }
  
  return suggestions;
};

// Function để group files theo potential image type
export const groupFilesByType = async (files: File[]): Promise<{
  detected: Record<ImageType, File[]>;
  undetected: File[];
}> => {
  const detected: Record<ImageType, File[]> = {
    lateral: [],
    frontal: [],
    profile: []
  };
  const undetected: File[] = [];

  for (const file of files) {
    const detectedType = await detectImageTypeFromFile(file);
    if (detectedType) {
      detected[detectedType].push(file);
    } else {
      undetected.push(file);
    }
  }

  return { detected, undetected };
};

// Function để tạo fake output filename từ input
export const generateOutputFilename = (inputFile: File, imageType: ImageType): string => {
  const baseName = inputFile.name.split('.')[0];
  const outputSuffix = getOutputSuffix(imageType);
  return `${baseName}_${outputSuffix}.png`;
};

// Function để get output suffix theo image type
const getOutputSuffix = (imageType: ImageType): string => {
  const suffixes: Record<ImageType, string> = {
    lateral: 'ceph_analysis',
    frontal: 'face_analysis',
    profile: 'profile_analysis'
  };
  return suffixes[imageType];
};

// Function để validate file types
export const validateFileType = (file: File): boolean => {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
  
  return validImageTypes.includes(file.type);
};