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
  general_xray: [
    /pano/i,
    /panoramic/i,
    /general.*x.*ray/i,
    /toan.*canh/i,
    /xquang.*tong/i,
    /ortho.*x.*ray/i
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
  ],
  model_3d_upper: [
    /3d.*upper/i,
    /upper.*3d/i,
    /model.*upper/i,
    /upper.*model/i,
    /scan.*upper/i,
    /upper.*scan/i,
    /upper.*stl$/i,
    /ham.*tren/i
  ],
  model_3d_lower: [
    /3d.*lower/i,
    /lower.*3d/i,
    /model.*lower/i,
    /lower.*model/i,  
    /scan.*lower/i,
    /lower.*scan/i,
    /lower.*stl$/i,
    /ham.*duoi/i
  ]
};

// Keywords để detect từ EXIF/metadata
const METADATA_KEYWORDS: Record<ImageType, string[]> = {
  lateral: ['lateral', 'cephalometric', 'side x-ray'],
  general_xray: ['panoramic', 'general x-ray', 'ortho x-ray'],
  frontal: ['frontal face', 'front portrait', 'face front'],
  profile: ['profile', 'side face', 'lateral face'],
  model_3d_upper: ['3d model upper', 'upper jaw scan', 'upper intraoral'],
  model_3d_lower: ['3d model lower', 'lower jaw scan', 'lower intraoral']
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

  // Try to detect from file type - fallback for STL files without upper/lower in name
  if (file.type.includes('model') || file.name.endsWith('.stl') || file.name.endsWith('.obj')) {
    // If no upper/lower specified, suggest it could be either
    // In real implementation, you might want to prompt user to choose
    console.warn(`STL file ${file.name} detected but no upper/lower specified. Please rename with _upper or _lower suffix.`);
    return null; // Force user to be explicit
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
    general_xray: [],
    frontal: [],
    profile: [],
    model_3d_upper: [],
    model_3d_lower: []
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
    general_xray: 'pano_seg',
    frontal: 'face_analysis',
    profile: 'profile_analysis',
    model_3d_upper: '3d_upper_analysis',
    model_3d_lower: '3d_lower_analysis'
  };
  return suffixes[imageType];
};

// Function để validate file types
export const validateFileType = (file: File): boolean => {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
  const valid3DTypes = ['application/octet-stream']; // For .stl files
  
  return validImageTypes.includes(file.type) || 
         valid3DTypes.includes(file.type) ||
         file.name.toLowerCase().endsWith('.stl') ||
         file.name.toLowerCase().endsWith('.obj') ||
         file.name.toLowerCase().endsWith('.ply');
};