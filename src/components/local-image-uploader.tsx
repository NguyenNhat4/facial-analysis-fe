import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  File, 
  Image, 
  AlertCircle, 
  CheckCircle, 
  X,
  FolderOpen,
  Loader2
} from 'lucide-react';
import { ImageType, IMAGE_TYPE_MAPPING } from '../types/demo-cases';
import { 
  groupFilesByType, 
  validateFileType, 
  generateOutputFilename 
} from '../utils/image-detection';

interface LocalImageUploaderProps {
  onImagesProcessed: (processedImages: {
    [key in ImageType]?: {
      input: File;
      inputPreview: string;
      outputPreview: string;
      outputFilename: string;
    }
  }) => void;
  isProcessing?: boolean;
}

interface ProcessedFile {
  file: File;
  type: ImageType;
  preview: string;
  outputFilename: string;
  outputPreview: string;
}

const LocalImageUploader: React.FC<LocalImageUploaderProps> = ({
  onImagesProcessed,
  isProcessing = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      // Validate files
      const validFiles = files.filter(validateFileType);
      const invalidFiles = files.filter(file => !validateFileType(file));

      if (invalidFiles.length > 0) {
        console.warn('Invalid files detected:', invalidFiles.map(f => f.name));
      }

      // Group files by type
      const { detected, undetected } = await groupFilesByType(validFiles);
      
      // Process detected files
      const processed: ProcessedFile[] = [];
      let progressStep = 0;
      const totalSteps = Object.values(detected).flat().length;

      for (const [imageType, files] of Object.entries(detected)) {
        for (const file of files) {
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
          
          // Create preview URL
          const preview = URL.createObjectURL(file);
          
          // Generate fake output
          const outputFilename = generateOutputFilename(file, imageType as ImageType);
          const outputPreview = await generateFakeOutput(file, imageType as ImageType);
          
          processed.push({
            file,
            type: imageType as ImageType,
            preview,
            outputFilename,
            outputPreview
          });

          progressStep++;
          setUploadProgress((progressStep / totalSteps) * 100);
        }
      }

      setProcessedFiles(processed);

      // Convert to format expected by parent component
      const processedImages: {
        [key in ImageType]?: {
          input: File;
          inputPreview: string;
          outputPreview: string;
          outputFilename: string;
        }
      } = {};

      processed.forEach(item => {
        processedImages[item.type] = {
          input: item.file,
          inputPreview: item.preview,
          outputPreview: item.outputPreview,
          outputFilename: item.outputFilename
        };
      });

      onImagesProcessed(processedImages);

    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  // Generate fake output image (placeholder)
  const generateFakeOutput = async (inputFile: File, imageType: ImageType): Promise<string> => {
    // In a real app, this would call your AI processing API
    // For demo, we'll create a simple overlay or use a placeholder
    
    // For now, return empty placeholder - user will add output images later
    const placeholders: Record<ImageType, string> = {
      lateral: '/assets/output_xray.jpg',
      general_xray: '/assets/output_xray.jpg',
      frontal: '/assets/output_xray.jpg',
      profile: '/assets/output_xray.jpg',
      model_3d_upper: '/assets/output_xray.jpg',
      model_3d_lower: '/assets/output_xray.jpg'
    };

    return placeholders[imageType];
  };

  // Remove processed file
  const removeProcessedFile = (index: number) => {
    const newProcessed = [...processedFiles];
    const removed = newProcessed.splice(index, 1)[0];
    
    // Clean up preview URL
    URL.revokeObjectURL(removed.preview);
    
    setProcessedFiles(newProcessed);

    // Update parent component
    const processedImages: {
      [key in ImageType]?: {
        input: File;
        inputPreview: string;
        outputPreview: string;
        outputFilename: string;
      }
    } = {};

    newProcessed.forEach(item => {
      processedImages[item.type] = {
        input: item.file,
        inputPreview: item.preview,
        outputPreview: item.outputPreview,
        outputFilename: item.outputFilename
      };
    });

    onImagesProcessed(processedImages);
  };

  // Clear all files
  const clearAllFiles = () => {
    // Clean up preview URLs
    processedFiles.forEach(item => {
      URL.revokeObjectURL(item.preview);
    });
    
    setSelectedFiles([]);
    setProcessedFiles([]);
    onImagesProcessed({});
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
          <FolderOpen className="w-5 h-5 text-blue-600" />
          <span>Local Image Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.stl,.obj,.ply"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Processing...' : 'Select Images'}
            </Button>
            
            {processedFiles.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllFiles}
                disabled={isAnalyzing || isProcessing}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-600">
            Select multiple images (JPG, PNG, STL). The system will automatically detect image types.
          </p>
        </div>

        {/* Processing Progress */}
        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Analyzing uploaded images...</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500">
              Detecting image types and preparing for analysis
            </p>
          </div>
        )}

        {/* Processed Files Display */}
        {processedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">Processed Images</h4>
              <Badge variant="outline" className="text-xs">
                {processedFiles.length} images ready
              </Badge>
            </div>

            <div className="grid gap-3">
              {processedFiles.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                >
                  {/* Preview */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.type === 'model_3d' ? (
                      <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                        <File className="w-6 h-6 text-purple-600" />
                      </div>
                    ) : (
                      <img 
                        src={item.preview} 
                        alt={item.file.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.file.name}
                      </p>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {IMAGE_TYPE_MAPPING[item.type].name}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Output: {item.outputFilename}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProcessedFile(index)}
                      disabled={isProcessing}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Auto-Detection Tips:</p>
              <ul className="text-xs space-y-1">
                <li>• Use descriptive filenames (e.g., "patient_lateral.jpg", "frontal_face.png")</li>
                <li>• Supported: lateral, ceph, pano, frontal, profile, 3d, model</li>
                <li>• The system will map images to appropriate analysis slots</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalImageUploader;