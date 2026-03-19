// Định nghĩa các loại ảnh input/output
export type ImageType =
  | "lateral"
  | "profile"
  | "frontal";

// Interface cho một image trong demo case
export interface DemoCaseImage {
  type: ImageType;
  filename: string;
  displayName: string;
}

// Interface cho một demo case (bệnh nhân)
export interface DemoCase {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  description: string;
  inputFolder: string;
  outputFolder: string;
  availableImages: DemoCaseImage[];
}

// Interface cho demo cases configuration
export interface DemoCasesConfig {
  demoCases: DemoCase[];
  settings: {
    baseInputPath: string;
    baseOutputPath: string;
    fallbackImages: Record<ImageType, string>;
  };
}

// Interface cho demo cases manager
export interface DemoCasesManager {
  cases: DemoCase[];
  currentCase: DemoCase | null;
  isLoading: boolean;
  loadingProgress: number;
}

// Mapping giữa image type và display name
export const IMAGE_TYPE_MAPPING: Record<
  ImageType,
  {
    name?: string;
    category?: string;
    icon?: string;
  }
> = {
  lateral: {
    name: "Lateral Cephalometric",
    category: "Radiographic Imaging",
    icon: "/assets/upload_logo/logo-lateral-xray.png",
  },
  frontal: {
    name: "Frontal Portrait",
    category: "Clinical Photography",
    icon: "/assets/upload_logo/frontal-face.png",
  },
  profile: {
    name: "Lateral Profile",
    category: "Clinical Photography",
    icon: "/assets/upload_logo/logo-side-face.png",
  },
};
