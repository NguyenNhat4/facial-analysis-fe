import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Calendar, 
  FileText, 
  Loader2, 
  Info, 
  Settings,
  FolderOpen,
  Eye,
  EyeOff
} from 'lucide-react';
import { DemoCase, ImageType } from '../types/demo-cases';
import { getAllDemoCases, loadDemoCasesConfig } from '../utils/demo-cases';

interface DemoCaseManagerProps {
  onCaseSelect: (demoCase: DemoCase) => void;
  selectedCase: DemoCase | null;
}

const DemoCaseManager: React.FC<DemoCaseManagerProps> = ({
  onCaseSelect,
  selectedCase
}) => {
  const [demoCases, setDemoCases] = useState<DemoCase[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showOutputs, setShowOutputs] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cases, configData] = await Promise.all([
          getAllDemoCases(),
          loadDemoCasesConfig()
        ]);
        setDemoCases(cases);
        setConfig(configData);
      } catch (error) {
        console.error('Failed to load demo data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getGenderIcon = (gender: 'male' | 'female') => {
    return gender === 'male' ? '👨' : '👩';
  };

  const getGenderColor = (gender: 'male' | 'female') => {
    return gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700';
  };

  const getImageTypeIcon = (type: ImageType) => {
    const icons: Record<ImageType, string> = {
      lateral: '🦷',
      general_xray: '📷',
      frontal: '👤',
      profile: '👥',
      model_3d: '📦'
    };
    return icons[type] || '📄';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Demo Cases Manager</h3>
            <p className="text-sm text-gray-600">Manage patient demo data and configurations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOutputs(!showOutputs)}
            className="flex items-center space-x-2"
          >
            {showOutputs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showOutputs ? 'Hide' : 'Show'} Outputs</span>
          </Button>
        </div>
      </div>

      {/* Configuration Info */}
      {config && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Input Path:</span>
                <p className="text-gray-600 font-mono text-xs">{config.settings.baseInputPath}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Output Path:</span>
                <p className="text-gray-600 font-mono text-xs">{config.settings.baseOutputPath}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {config.demoCases.length} Cases Available
              </Badge>
              <Badge variant="outline" className="text-xs">
                {Object.keys(config.settings.fallbackImages).length} Fallback Images
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Cases List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-gray-800">Available Cases</h4>
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {demoCases.map((demoCase) => (
            <Card 
              key={demoCase.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                selectedCase?.id === demoCase.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => onCaseSelect(demoCase)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${getGenderColor(demoCase.gender)}`}>
                      {getGenderIcon(demoCase.gender)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-gray-800">{demoCase.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          {demoCase.age} years
                        </Badge>
                        <Badge 
                          variant={selectedCase?.id === demoCase.id ? "default" : "outline"}
                          className="text-xs"
                        >
                          {selectedCase?.id === demoCase.id ? 'Selected' : 'Case #' + demoCase.id.split('_')[1]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{demoCase.description}</p>
                      
                      {/* Available Images */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">Available Images:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {demoCase.availableImages.map((image) => (
                            <Badge 
                              key={image.type}
                              variant="outline" 
                              className="text-xs bg-white/80"
                            >
                              <span className="mr-1">{getImageTypeIcon(image.type)}</span>
                              {image.displayName}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Output Images (Hidden by default) */}
                      {showOutputs && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-gray-700">Output Images:</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {demoCase.availableImages.map((image) => (
                              <Badge 
                                key={image.type}
                                variant="outline" 
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                {image.type}_seg.png
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-800">How to Add New Demo Cases</h4>
              <div className="text-sm text-amber-700 space-y-1">
                <p>1. Add your input images to <code className="bg-amber-100 px-1 rounded">assets/demo_cases/case_XXX/inputs/</code></p>
                <p>2. Add your output images to <code className="bg-amber-100 px-1 rounded">assets/demo_cases/case_XXX/outputs/</code></p>
                <p>3. Update <code className="bg-amber-100 px-1 rounded">public/demo-cases-config.json</code> with new case details</p>
                <p>4. The system will automatically load the new configuration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoCaseManager; 