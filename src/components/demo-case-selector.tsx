import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Calendar, FileText, Loader2 } from 'lucide-react';
import { DemoCase } from '../types/demo-cases';
import { getAllDemoCases } from '../utils/demo-cases';

interface DemoCaseSelectorProps {
  onCaseSelect: (demoCase: DemoCase) => void;
  selectedCase: DemoCase | null;
  isLoading?: boolean;
}

const DemoCaseSelector: React.FC<DemoCaseSelectorProps> = ({
  onCaseSelect,
  selectedCase,
  isLoading = false
}) => {
  const [demoCases, setDemoCases] = useState<DemoCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);

  useEffect(() => {
    const loadDemoCases = async () => {
      setLoadingCases(true);
      try {
        const cases = await getAllDemoCases();
        setDemoCases(cases);
      } catch (error) {
        console.error('Failed to load demo cases:', error);
      } finally {
        setLoadingCases(false);
      }
    };

    loadDemoCases();
  }, []);

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = demoCases.find(case_ => case_.id === caseId);
    if (selectedCase) {
      onCaseSelect(selectedCase);
    }
  };

  const getGenderIcon = (gender: 'male' | 'female') => {
    return gender === 'male' ? '👨' : '👩';
  };

  const getGenderColor = (gender: 'male' | 'female') => {
    return gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700';
  };

  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
          <User className="w-5 h-5 text-blue-600" />
          <span>Demo Case Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Case Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Select Patient Case:</label>
          <Select 
            value={selectedCase?.id || ''} 
            onValueChange={handleCaseSelect}
            disabled={loadingCases || isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingCases ? "Loading cases..." : "Choose a demo case"} />
            </SelectTrigger>
            <SelectContent>
              {demoCases.map((demoCase) => (
                <SelectItem key={demoCase.id} value={demoCase.id}>
                  <div className="flex items-center space-x-2">
                    <span>{getGenderIcon(demoCase.gender)}</span>
                    <span>{demoCase.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {demoCase.age} years
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Case Info */}
        {selectedCase && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getGenderColor(selectedCase.gender)}`}>
                  {getGenderIcon(selectedCase.gender)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedCase.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{selectedCase.age} years old</span>
                    <span>•</span>
                    <span className="capitalize">{selectedCase.gender}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Case #{selectedCase.id.split('_')[1]}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Clinical Description:</span>
              </div>
              <p className="text-sm text-gray-700 bg-white/60 rounded p-2 border border-gray-200">
                {selectedCase.description}
              </p>
            </div>

                         {/* Available Images Summary */}
             <div className="mt-4">
               <div className="flex items-center space-x-2 mb-2">
                 <Calendar className="w-4 h-4 text-blue-600" />
                 <span className="text-sm font-medium text-gray-700">Available Images:</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {selectedCase.availableImages.map((image) => (
                   <Badge 
                     key={image.type} 
                     variant="outline" 
                     className="bg-white/80 text-xs"
                   >
                     {image.displayName}
                   </Badge>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* Loading State */}
        {(loadingCases || isLoading) && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingCases ? 'Loading demo cases...' : 'Processing case data...'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoCaseSelector; 