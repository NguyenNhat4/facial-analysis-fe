import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Brain, Target } from "lucide-react";

interface ClinicalAnalysisSidebarProps {
  availableAnalysisCount: number;
  totalAnalysisCount: number;
  hasFaceImages: boolean;
  showAIThinking: boolean;
  uploadedImages: Record<string, boolean>;
  currentFolderName: string | null;
  onAnalysisClick: (analysisType: "facial" | "ceph", path: string, withImages: boolean) => void;
}

export const ClinicalAnalysisSidebar: React.FC<ClinicalAnalysisSidebarProps> = ({
  availableAnalysisCount,
  totalAnalysisCount,
  hasFaceImages,
  showAIThinking,
  uploadedImages,
  currentFolderName,
  onAnalysisClick,
}) => {
  return (
    <div className="w-80 space-y-6">
      <div className="border-l-4 border-blue-600 pl-4">
        <h4 className="text-xl font-bold text-gray-800">
          Clinical Analysis
        </h4>
        <p className="text-sm text-gray-600 font-medium">
          AI-Powered Diagnostic Tools
        </p>
      </div>

      {/* Analysis Status Panel */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-base font-semibold text-gray-800">
              Analysis Status
            </span>
          </div>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-mono">
            {availableAnalysisCount} / {totalAnalysisCount} Available
          </span>
        </div>
        <Progress
          value={(availableAnalysisCount / totalAnalysisCount) * 100}
          className="h-2 mb-3"
        />
        <div className="text-sm text-gray-700">
          {availableAnalysisCount === totalAnalysisCount
            ? "✅ All diagnostic tools are ready for use"
            : `⏳ ${availableAnalysisCount} of ${totalAnalysisCount} analysis tools available`}
        </div>
      </div>

      <div className="space-y-4">
        {/* Facial Analysis */}
        <div className="relative group">
          <Button
            className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${
              hasFaceImages
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md border border-blue-700"
                : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
            disabled={!hasFaceImages || showAIThinking}
            onClick={() =>
              hasFaceImages &&
              onAnalysisClick(
                "facial",
                "/facial-analysis",
                true
              )
            }
          >
            <div
              className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${
                hasFaceImages ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Brain className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-base flex items-center justify-between">
                Facial Analysis
                {hasFaceImages && (
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="text-sm opacity-80 mt-1">
                {hasFaceImages
                  ? "Cephalometric Assessment"
                  : "Requires frontal & profile images"}
              </div>
            </div>
          </Button>
          {!hasFaceImages && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Frontal & Profile photos required
              {!currentFolderName && <br />}
              {!currentFolderName &&
                "Upload images to detect case folder"}
            </div>
          )}
        </div>

        {/* Ceph Analysis */}
        <div className="relative group">
          <Button
            className={`w-full flex items-center justify-start p-5 h-auto rounded-xl transition-all duration-200 ${
              uploadedImages.lateral
                ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md border border-teal-700"
                : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
            disabled={!uploadedImages.lateral || showAIThinking}
            onClick={() =>
              uploadedImages.lateral &&
              onAnalysisClick("ceph", "/ceph-analysis", true)
            }
          >
            <div
              className={`w-12 h-12 rounded-lg mr-4 flex items-center justify-center ${
                uploadedImages.lateral ? "bg-teal-500" : "bg-gray-200"
              }`}
            >
              <Target className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-base flex items-center justify-between">
                Ceph Analysis
                {uploadedImages.lateral && (
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="text-sm opacity-80 mt-1">
                {uploadedImages.lateral
                  ? "Cephalometric Measurements"
                  : "Requires lateral ceph X-ray"}
              </div>
            </div>
          </Button>
          {!uploadedImages.lateral && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Lateral ceph X-ray required
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
