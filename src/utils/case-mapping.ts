import { ImageType } from '../types/demo-cases';
import { detectImageTypeFromFilename } from './image-detection';

// Interface cho một case mapping
export interface CaseMapping {
  caseId: string;
  inputs: {
    [key in ImageType]?: {
      filename: string;
      fullPath: string;
    }
  };
  outputs: {
    [key in ImageType]?: {
      filename: string;
      fullPath: string;
    }
  };
}

// Function để scan và tạo mapping từ uploaded files
export const createCaseMappingFromFiles = async (files: File[]): Promise<CaseMapping[]> => {
  const caseMappings: { [caseId: string]: CaseMapping } = {};
  
  for (const file of files) {
    const caseMatch = extractCaseIdFromPath(file.webkitRelativePath || file.name);
    const imageType = detectImageTypeFromFilename(file.name);
    const isOutput = isOutputFile(file.webkitRelativePath || file.name);
    
    if (caseMatch && imageType) {
      // Initialize case if not exists
      if (!caseMappings[caseMatch]) {
        caseMappings[caseMatch] = {
          caseId: caseMatch,
          inputs: {},
          outputs: {}
        };
      }
      
      const fileInfo = {
        filename: file.name,
        fullPath: file.webkitRelativePath || file.name
      };
      
      if (isOutput) {
        caseMappings[caseMatch].outputs[imageType] = fileInfo;
      } else {
        caseMappings[caseMatch].inputs[imageType] = fileInfo;
      }
    }
  }
  
  return Object.values(caseMappings);
};

// Function để extract case ID từ file path
export const extractCaseIdFromPath = (filePath: string): string | null => {
  // Patterns để detect case ID
  const patterns = [
    /case(\d+)/i,           // case01, case02, CASE01
    /case_(\d+)/i,          // case_01, case_02
    /patient(\d+)/i,        // patient01, patient02
    /patient_(\d+)/i,       // patient_01, patient_02
    /case-(\d+)/i,          // case-01, case-02
    /benhNhan(\d+)/i,       // benhNhan01, benhNhan02
    /bn(\d+)/i              // bn01, bn02
  ];
  
  for (const pattern of patterns) {
    const match = filePath.match(pattern);
    if (match) {
      return `case${match[1].padStart(2, '0')}`; // Normalize to case01, case02, etc.
    }
  }
  
  return null;
};

// Function để check xem file có phải output không
export const isOutputFile = (filePath: string): boolean => {
  const outputPatterns = [
    /\/outputs?\//i,        // /output/ or /outputs/
    /\/result/i,            // /result/
    /\/processed/i,         // /processed/
    /_seg\./i,              // filename_seg.png
    /_analysis\./i,         // filename_analysis.png
    /_result\./i,           // filename_result.png
    /_processed\./i         // filename_processed.png
  ];
  
  return outputPatterns.some(pattern => pattern.test(filePath));
};

// Function để tìm output path từ assets/outputs/ dựa trên input file
export const findOutputPathFromAssets = (inputFile: File, imageType: ImageType): string => {
  // For this demo, output files are stored directly in assets/outputs/ with same filename as input
  // e.g., DaoThiDiemTrangfrontal.jpg → /assets/outputs/DaoThiDiemTrangfrontal.jpg
  
  const inputFilename = inputFile.name;
  const directOutputPath = `/assets/outputs/${inputFilename}`;
  
  console.log(`🔗 Output mapping: ${inputFilename} → ${directOutputPath}`);
  return directOutputPath;
};

// Function để extract case ID từ input file (chỉ từ filename, không cần folder structure)
export const extractCaseIdFromInputFile = (inputFile: File): string | null => {
  const filename = inputFile.name.toLowerCase();
  const originalFilename = inputFile.name; // Keep original case for extraction
  
  // Patterns để detect case ID từ filename (numbered cases)
  const numberedPatterns = [
    /case(\d+)/i,           // case01_lateral.jpg
    /case_(\d+)/i,          // case_01_lateral.jpg
    /patient(\d+)/i,        // patient01_lateral.jpg
    /patient_(\d+)/i,       // patient_01_lateral.jpg
    /case-(\d+)/i,          // case-01_lateral.jpg
    /bn(\d+)/i,             // bn01_lateral.jpg
    /(\d+)_/,               // 01_lateral.jpg (number at start)
    /_(\d+)/,               // lateral_01.jpg (number after underscore)
  ];
  
  // Try numbered patterns first
  for (const pattern of numberedPatterns) {
    const match = filename.match(pattern);
    if (match) {
      const caseNumber = match[1].padStart(2, '0');
      return `case${caseNumber}`; // Normalize to case01, case02, etc.
    }
  }
  
  // If no numbered pattern found, try to extract name prefix before image type keywords
  const imageTypeKeywords = [
    'frontal', 'profile', 'lateral', 'pano', 'panoramic', 
    'ceph', 'cephalometric', 'xray', 'general'
  ];
  
  // Remove file extension first
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  
  // Find which keyword appears in the filename
  for (const keyword of imageTypeKeywords) {
    const keywordIndex = nameWithoutExt.toLowerCase().indexOf(keyword);
    if (keywordIndex > 0) { // Must have some prefix before keyword
      const prefix = nameWithoutExt.substring(0, keywordIndex);
      // Clean up prefix (remove trailing underscores, hyphens, etc.)
      const cleanPrefix = prefix.replace(/[-_\s]+$/, '').trim();
      if (cleanPrefix.length > 0) {
        console.log(`🎯 Extracted folder name: "${cleanPrefix}" from "${originalFilename}"`);
        return cleanPrefix;
      }
    }
  }
  
  return null;
};

// Function để generate output path dựa trên input filename
export const generateOutputPath = (inputFile: File, imageType: ImageType): string => {
  return findOutputPathFromAssets(inputFile, imageType);
};

// Function để validate case structure
export const validateCaseStructure = (caseMappings: CaseMapping[]): {
  valid: CaseMapping[];
  invalid: CaseMapping[];
  warnings: string[];
} => {
  const valid: CaseMapping[] = [];
  const invalid: CaseMapping[] = [];
  const warnings: string[] = [];
  
  for (const caseMapping of caseMappings) {
    const inputCount = Object.keys(caseMapping.inputs).length;
    const outputCount = Object.keys(caseMapping.outputs).length;
    
    if (inputCount === 0) {
      invalid.push(caseMapping);
      warnings.push(`Case ${caseMapping.caseId}: No input files found`);
    } else if (outputCount === 0) {
      warnings.push(`Case ${caseMapping.caseId}: No output files found (will use fake outputs)`);
      valid.push(caseMapping);
    } else if (inputCount > outputCount) {
      warnings.push(`Case ${caseMapping.caseId}: Missing some output files (${inputCount} inputs, ${outputCount} outputs)`);
      valid.push(caseMapping);
    } else {
      valid.push(caseMapping);
    }
  }
  
  return { valid, invalid, warnings };
};