import { DemoCase, ImageType, DemoCasesConfig } from '../types/demo-cases';

// Load demo cases configuration từ JSON file
export const loadDemoCasesConfig = async (): Promise<DemoCasesConfig> => {
  try {
    const response = await fetch('/demo-cases-config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load demo cases config:', error);
    // Return default config if loading fails
    return getDefaultConfig();
  }
};

// Default config fallback
const getDefaultConfig = (): DemoCasesConfig => ({
  demoCases: [],
  settings: {
    baseInputPath: '/assets/demo_cases',
    baseOutputPath: '/assets/demo_cases',
    fallbackImages: {
      lateral: '',
      profile: '', 
      frontal: '',
      general_xray: '',
      model_3d_upper: '',
      model_3d_lower: ''
    }
  }
});

// Function để get tất cả demo cases
export const getAllDemoCases = async (): Promise<DemoCase[]> => {
  const config = await loadDemoCasesConfig();
  return config.demoCases;
};

// Function để load demo case
export const loadDemoCase = async (caseId: string): Promise<DemoCase | null> => {
  const config = await loadDemoCasesConfig();
  const demoCase = config.demoCases.find(case_ => case_.id === caseId);
  return demoCase || null;
};

// Function để get input image path cho một case
export const getInputImagePath = async (demoCase: DemoCase, imageType: ImageType): Promise<string | null> => {
  const image = demoCase.availableImages.find(img => img.type === imageType);
  if (!image) return null;
  
  const config = await loadDemoCasesConfig();
  return `${config.settings.baseInputPath}/${demoCase.inputFolder}/${image.filename}`;
};

// Function để get output image path cho một case (ẩn từ user)
export const getOutputImagePath = async (demoCase: DemoCase, imageType: ImageType): Promise<string | null> => {
  const image = demoCase.availableImages.find(img => img.type === imageType);
  if (!image) return null;
  
  const config = await loadDemoCasesConfig();
  return `${config.settings.baseOutputPath}/${demoCase.outputFolder}/${imageType}_seg.png`;
};

// Function để validate image path exists
export const validateImagePath = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Function để get fallback image nếu demo case image không tồn tại
export const getImagePath = async (path: string, fallbackPath: string): Promise<string> => {
  const exists = await validateImagePath(path);
  return exists ? path : fallbackPath;
};

// Function để get fallback images từ config
export const getFallbackImages = async (): Promise<Record<ImageType, string>> => {
  const config = await loadDemoCasesConfig();
  return config.settings.fallbackImages;
};

// Function để load images cho một demo case
export const loadDemoCaseImages = async (demoCase: DemoCase): Promise<Record<ImageType, string>> => {
  const config = await loadDemoCasesConfig();
  const fallbackImages = config.settings.fallbackImages;
  const imagePaths: Record<ImageType, string> = {} as Record<ImageType, string>;
  
  for (const image of demoCase.availableImages) {
    const inputPath = `${config.settings.baseInputPath}/${demoCase.inputFolder}/${image.filename}`;
    const validatedPath = await getImagePath(inputPath, fallbackImages[image.type]);
    imagePaths[image.type] = validatedPath;
  }
  
  return imagePaths;
}; 