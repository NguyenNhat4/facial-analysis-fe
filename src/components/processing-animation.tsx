import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Brain, 
  Loader2, 
  CheckCircle, 
  Zap,
  Activity,
  Scan
} from 'lucide-react';
import { ImageType, IMAGE_TYPE_MAPPING } from '../types/demo-cases';

interface ProcessingAnimationProps {
  imageType: ImageType;
  inputFile: File;
  inputPreview: string;
  onProcessingComplete: (outputPreview: string, outputFilename: string) => void;
  isVisible: boolean;
}

const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  imageType,
  inputFile,
  inputPreview,
  onProcessingComplete,
  isVisible
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const processingSteps = [
    { label: 'Preprocessing Image', icon: Scan, duration: 1000 },
    { label: 'AI Analysis', icon: Brain, duration: 2000 },
    { label: 'Feature Detection', icon: Activity, duration: 1500 },
    { label: 'Generating Results', icon: Zap, duration: 1000 }
  ];

  useEffect(() => {
    if (!isVisible) return;

    let totalDuration = 0;
    let currentProgress = 0;

    const runProcessing = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        const step = processingSteps[i];
        
        // Animate progress for this step
        const stepProgress = 100 / processingSteps.length;
        const startProgress = currentProgress;
        const endProgress = currentProgress + stepProgress;
        
        const animateStep = () => {
          const stepDuration = step.duration;
          const increment = stepProgress / (stepDuration / 50); // 50ms intervals
          
          const interval = setInterval(() => {
            currentProgress += increment;
            setProgress(Math.min(currentProgress, endProgress));
            
            if (currentProgress >= endProgress) {
              clearInterval(interval);
              currentProgress = endProgress;
            }
          }, 50);
        };

        animateStep();
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }

      // Complete processing
      setProgress(100);
      setIsComplete(true);
      
      // Generate fake output
      setTimeout(() => {
        const outputFilename = `${inputFile.name.split('.')[0]}_processed.png`;
        const outputPreview = '/assets/output_xray.jpg';
        onProcessingComplete(outputPreview, outputFilename);
      }, 500);
    };

    runProcessing();
  }, [isVisible, inputFile, onProcessingComplete]);

  if (!isVisible) return null;

  const CurrentStepIcon = processingSteps[currentStep]?.icon || Loader2;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 bg-white shadow-xl">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <CurrentStepIcon className={`w-8 h-8 text-blue-600 ${!isComplete ? 'animate-pulse' : ''}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Processing {IMAGE_TYPE_MAPPING[imageType].name}
              </h3>
              <p className="text-sm text-gray-600">
                AI analysis in progress...
              </p>
            </div>

            {/* Input Preview */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                {(imageType === 'model_3d_upper' || imageType === 'model_3d_lower') ? (
                  <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                    <div className="text-2xl">📦</div>
                  </div>
                ) : (
                  <img 
                    src={inputPreview} 
                    alt="Processing" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {isComplete ? 'Complete!' : processingSteps[currentStep]?.label}
                </span>
                <span className="font-mono text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="space-y-2">
              {processingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCurrentStep = index === currentStep;
                const isCompletedStep = index < currentStep || isComplete;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                      isCurrentStep 
                        ? 'bg-blue-50 border border-blue-200' 
                        : isCompletedStep 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompletedStep 
                        ? 'bg-green-100' 
                        : isCurrentStep 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}>
                      {isCompletedStep && !isCurrentStep ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <StepIcon className={`w-4 h-4 ${
                          isCurrentStep 
                            ? 'text-blue-600 animate-pulse' 
                            : isCompletedStep 
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isCurrentStep 
                        ? 'text-blue-800' 
                        : isCompletedStep 
                        ? 'text-green-800'
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {isCurrentStep && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs ml-auto">
                        Processing...
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* File Info */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>File:</span>
                <span className="font-mono">{inputFile.name}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Size:</span>
                <span className="font-mono">{(inputFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Type:</span>
                <span className="font-mono">{IMAGE_TYPE_MAPPING[imageType].name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingAnimation;