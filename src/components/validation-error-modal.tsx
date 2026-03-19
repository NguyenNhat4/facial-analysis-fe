import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ValidationErrorModalProps {
  show: boolean;
  message: string;
  imageId: string;
  fileName: string;
  onClose: () => void;
  getKeywordsForType: (imageId: string) => string;
  getExampleFileName: (imageId: string) => string;
}

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  show,
  imageId,
  fileName,
  onClose,
  getKeywordsForType,
  getExampleFileName,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Invalid File Name
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            The file name doesn't match the expected format for this image type.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-mono text-gray-700">File: {fileName}</p>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Valid keywords for this type:</p>
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <pre className="text-xs text-blue-800 whitespace-pre-wrap">
                {getKeywordsForType(imageId)}
              </pre>
            </div>
            <p className="font-medium mb-2">Example file names:</p>
            <div className="bg-green-50 rounded-lg p-3">
              <pre className="text-xs text-green-800 whitespace-pre-wrap">
                case01_{getExampleFileName(imageId)}
                {"\n"}
                patient02_{getExampleFileName(imageId)}
                {"\n"}
                {getExampleFileName(imageId)}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;
