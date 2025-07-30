# Image Naming Rules for Orthodontic Cases

## Overview
This document defines the standardized naming convention for orthodontic case images to ensure consistent processing and automatic categorization.

## Image Types & Naming Convention

### 1. **Lateral Cephalometric X-ray**
- **Filename**: `lateral.jpg`
- **Description**: Lateral cephalometric radiograph for skeletal analysis
- **File format**: JPG/JPEG
- **Use case**: Cephalometric analysis, growth prediction

### 2. **Panoramic Radiograph** 
- **Filename**: `pano.jpg`
- **Description**: Panoramic X-ray showing full dental arch
- **File format**: JPG/JPEG
- **Use case**: General dental health assessment, impacted teeth detection

### 3. **Frontal Portrait**
- **Filename**: `frontal.jpg` 
- **Description**: Front-facing facial photograph
- **File format**: JPG/JPEG
- **Use case**: Facial symmetry analysis, smile design

### 4. **Profile Portrait**
- **Filename**: `profile.jpg`
- **Description**: Lateral facial photograph  
- **File format**: JPG/JPEG
- **Use case**: Profile analysis, soft tissue evaluation

### 5. **3D Intraoral Scan - Upper**
- **Filename**: `model_3d_upper.stl`
- **Description**: 3D digital impression of upper dental arch
- **File format**: STL
- **Use case**: Upper jaw analysis, orthodontic planning

### 6. **3D Intraoral Scan - Lower**
- **Filename**: `model_3d_lower.stl`
- **Description**: 3D digital impression of lower dental arch
- **File format**: STL
- **Use case**: Lower jaw analysis, bite relationship

## Folder Structure

### Input Structure (Local Storage)
```
📁 orthodontic-cases/
├── case01/
│   ├── lateral.jpg
│   ├── pano.jpg
│   ├── frontal.jpg  
│   ├── profile.jpg
│   ├── model_3d_upper.stl
│   └── model_3d_lower.stl
├── case02/
│   └── ... (same structure)
└── case03/
    └── ... (same structure)
```

### Output Structure (Project Assets)
```
📁 assets/outputs/
├── case01/
│   ├── analysis_results.json
│   ├── processed_lateral.jpg
│   ├── processed_frontal.jpg
│   └── measurements.pdf
├── case02/
│   └── ... (analysis outputs)
└── case03/
    └── ... (analysis outputs)
```

## Implementation Rules

### File Detection Logic
The system will automatically categorize images based on exact filename matching:

```typescript
const IMAGE_TYPES = {
  'lateral.jpg': 'lateral',
  'pano.jpg': 'general_xray', 
  'frontal.jpg': 'frontal',
  'profile.jpg': 'profile',
  'model_3d_upper.stl': 'model_3d_upper',
  'model_3d_lower.stl': 'model_3d_lower'
} as const;
```

### Case ID Format
- **Pattern**: `case` + zero-padded number
- **Examples**: `case01`, `case02`, `case03`, ..., `case99`
- **Maximum**: 99 cases supported

### Quality Requirements
- **Image resolution**: Minimum 1024x768 for photos
- **X-ray quality**: High contrast, proper positioning
- **STL files**: Valid mesh, no corrupted geometry
- **File size**: Maximum 10MB per image, 50MB per STL

## Usage Examples

### Adding New Case
1. Create folder: `case04/`
2. Add images with exact filenames
3. System automatically detects and categorizes
4. Run analysis pipeline

### Batch Processing
```bash
# All cases with lateral X-rays
find ./orthodontic-cases/*/lateral.jpg

# All 3D models  
find ./orthodontic-cases/*/model_3d_*.stl
```

---
**Last Updated**: December 2024  
**Version**: 1.1 - Added dual 3D model support
