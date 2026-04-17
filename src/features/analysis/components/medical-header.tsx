import React from "react";

interface MedicalHeaderProps {
  onNavigation: (path: string) => void;
}

export const MedicalHeader: React.FC<MedicalHeaderProps> = ({ onNavigation }) => {
  return (
    <header className="bg-white border-b-2 border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-6">
            <div className="border-l-2 border-blue-200 pl-6 border-l-0">
              <h1 className="text-xl font-bold text-gray-800">
                Dental Analysis System
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                AI-Powered Clinical Diagnostics
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigation("/")}
              className="px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigation("/demo")}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200"
            >
              Clinical Analysis
            </button>
            <button
              onClick={() => onNavigation("/facial-analysis")}
              className="px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
            >
              Reports
            </button>
            <button
              onClick={() => onNavigation("/chat")}
              className="px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
            >
              Settings
            </button>
            <div className="h-6 w-px bg-gray-300 mx-4"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Dr</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Dr. Smith</p>
                <p className="text-gray-500">Orthodontist</p>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
