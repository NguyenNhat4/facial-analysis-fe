import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Scan, 
  Box, 
  Stethoscope, 
  Sparkles, 
  Zap,
  Loader2,
  Activity
} from 'lucide-react';

interface AIThinkingModalProps {
  isOpen: boolean;
  analysisType: 'facial' | 'radiographic' | '3d' | 'treatment';
  onComplete: () => void;
}

const AIThinkingModal: React.FC<AIThinkingModalProps> = ({
  isOpen,
  analysisType,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  // Configuration cho từng loại analysis
  const analysisConfig = {
    facial: {
      title: 'Facial Analysis AI',
      icon: Brain,
      color: 'blue',
      steps: [
        'Initializing neural networks...',
        'Loading facial recognition models...',
        'Analyzing facial landmarks...',
        'Computing cephalometric measurements...',
        'Generating aesthetic assessment...',
        'Finalizing facial analysis report...'
      ]
    },
    radiographic: {
      title: 'Radiographic Analysis AI',
      icon: Scan,
      color: 'emerald',
      steps: [
        'Initializing X-ray analysis engine...',
        'Loading diagnostic models...',
        'Processing radiographic data...',
        'Detecting dental structures...',
        'Analyzing bone density patterns...',
        'Generating diagnostic insights...'
      ]
    },
    '3d': {
      title: '3D Model Analysis AI',
      icon: Box,
      color: 'purple',
      steps: [
        'Initializing 3D processing engine...',
        'Loading mesh analysis algorithms...',
        'Processing upper jaw geometry...',
        'Processing lower jaw geometry...',
        'Computing bite relationships...',
        'Generating 3D analysis report...'
      ]
    },
    treatment: {
      title: 'Treatment Planning AI',
      icon: Stethoscope,
      color: 'orange',
      steps: [
        'Initializing treatment algorithms...',
        'Analyzing complete patient data...',
        'Evaluating treatment options...',
        'Simulating treatment outcomes...',
        'Optimizing treatment sequence...',
        'Finalizing treatment plan...'
      ]
    }
  };

  const config = analysisConfig[analysisType];
  const Icon = config.icon;

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setIsThinking(false);
      return;
    }

    setIsThinking(true);
    
    const totalSteps = config.steps.length;
    const stepDuration = 1000 + Math.random() * 800; // 1-1.8s per step
    
    let currentStepIndex = 0;
    
    const processStep = () => {
      setCurrentStep(currentStepIndex);
      
      // Animate progress for current step
      const stepProgress = (currentStepIndex / totalSteps) * 100;
      const nextStepProgress = ((currentStepIndex + 1) / totalSteps) * 100;
      
      let currentProgress = stepProgress;
      const progressIncrement = (nextStepProgress - stepProgress) / 20;
      
      const progressInterval = setInterval(() => {
        currentProgress += progressIncrement;
        setProgress(currentProgress);
        
        if (currentProgress >= nextStepProgress) {
          clearInterval(progressInterval);
          
          currentStepIndex++;
          
          if (currentStepIndex < totalSteps) {
            setTimeout(processStep, 200 + Math.random() * 300);
          } else {
            // Thinking complete
            setTimeout(() => {
              setIsThinking(false);
              onComplete();
            }, 500);
          }
        }
      }, stepDuration / 20);
    };

    // Start processing
    setTimeout(processStep, 800);
  }, [isOpen, config.steps.length, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center relative ${
              config.color === 'blue' ? 'bg-blue-100' :
              config.color === 'emerald' ? 'bg-emerald-100' :
              config.color === 'purple' ? 'bg-purple-100' :
              'bg-orange-100'
            }`}>
              <Icon className={`w-10 h-10 ${
                config.color === 'blue' ? 'text-blue-600' :
                config.color === 'emerald' ? 'text-emerald-600' :
                config.color === 'purple' ? 'text-purple-600' :
                'text-orange-600'
              }`} />
              {isThinking && (
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{config.title}</h3>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">AI Processing in Progress</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-mono text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            
            {/* Current Step */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[60px] flex items-center">
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-shrink-0">
                  {isThinking ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <Activity className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {config.steps[currentStep] || 'Initializing...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thinking Animation */}
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
            <span className="text-xs font-medium">AI is thinking</span>
            <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIThinkingModal;