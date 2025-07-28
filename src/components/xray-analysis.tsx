import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, AlertCircle } from "lucide-react";
import type { XrayAnalysis, ToothAnalysis } from "@shared/schema";

interface XrayAnalysisProps {
  analysis: XrayAnalysis;
}

interface TooltipState {
  show: boolean;
  content: string;
  x: number;
  y: number;
}

export function XrayAnalysisComponent({ analysis }: XrayAnalysisProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, content: "", x: 0, y: 0 });

  const getToothColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "border-green-400 bg-green-400/20";
      case "decay":
        return "border-yellow-400 bg-yellow-400/20";
      case "treatment_needed":
        return "border-red-400 bg-red-400/20";
      default:
        return "border-gray-400 bg-gray-400/20";
    }
  };

  const handleToothHover = (tooth: ToothAnalysis, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      content: `Răng số ${tooth.toothNumber} | Tình trạng: ${tooth.condition}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleToothLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-clinical-900">Phân tích X-quang Panoramic</h3>
        <p className="text-clinical-600 mt-2">AI đã phát hiện và phân loại tình trạng các răng</p>
      </div>
      
      <div className="relative bg-clinical-900 rounded-lg overflow-hidden p-4 mb-8">
        <img 
          src="assets\output_xray.jpg" 
          alt="Panoramic X-ray" 
          className="w-full h-auto opacity-90"
        />
        
        {/* Bounding boxes for teeth analysis
        <div className="absolute inset-4">
          {analysis.teeth.map((tooth, index) => (
            <div
              key={index}
              className={`tooth-box absolute border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${getToothColor(tooth.status)}`}
              style={{
                left: `${tooth.position.x}%`,
                top: `${tooth.position.y}%`,
                width: `${tooth.position.width}%`,
                height: `${tooth.position.height}%`,
              }}
              onMouseEnter={(e) => handleToothHover(tooth, e)}
              onMouseLeave={handleToothLeave}
            />
          ))}
        </div> */}

        {/* Tooltip */}
        {tooltip.show && (
          <div 
            className="fixed bg-clinical-900 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none z-10"
            style={{
              left: tooltip.x - 100,
              top: tooltip.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-clinical-900"></div>
          </div>
        )}
      </div>

      {/* Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900">Răng khỏe mạnh</h4>
                <p className="text-2xl font-bold text-green-900 mt-1">{analysis.healthyTeeth}</p>
              </div>
              <Heart className="text-green-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-900">Răng sâu</h4>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{analysis.decayedTeeth}</p>
              </div>
              <AlertTriangle className="text-yellow-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-900">Cần điều trị</h4>
                <p className="text-2xl font-bold text-red-900 mt-1">{analysis.treatmentNeeded}</p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
