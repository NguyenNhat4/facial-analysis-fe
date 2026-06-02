import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Sparkles } from "lucide-react";

interface ImagingUploadHeaderProps {
  currentFolderName: string | null;
  isLoading: boolean;
  loadingProgress: number;
  onFakeLoadImages: () => void;
}

export const ImagingUploadHeader: React.FC<ImagingUploadHeaderProps> = ({
  currentFolderName,
  isLoading,
  loadingProgress,
  onFakeLoadImages,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Clinical Imaging Data
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-gray-700 font-medium">
                Session Date: {new Date().toLocaleDateString("en-GB")}
              </p>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <p className="text-gray-700 font-medium">
                Status: Ready for Analysis
              </p>
            </div>
            {currentFolderName && (
              <>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-700 font-medium">
                    Current Case: {currentFolderName}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            className={`bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-6 py-3 text-base font-semibold rounded-lg border border-purple-700`}
            onClick={onFakeLoadImages}
            disabled={isLoading}
          >
            <Sparkles
              className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Classifying..." : "Upload and Classify"}
          </Button>
        </div>
      </div>

      {/* Medical Loading Progress */}
      {isLoading && (
        <div className="mt-4 bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-base font-semibold text-gray-800">
                Processing Images
              </span>
            </div>
            <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {Math.round(loadingProgress)}%
            </span>
          </div>
          <Progress value={loadingProgress} className="h-3 mb-3" />
          <div className="text-sm text-gray-600 flex items-center justify-between">
            <span>Processing uploaded images...</span>
            <span className="text-xs text-gray-500">
              Auto-detecting image types
            </span>
          </div>
        </div>
      )}
    </>
  );
};
