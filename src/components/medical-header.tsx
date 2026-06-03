import React from "react";

interface MedicalHeaderProps {
  previousPage?: string;
  onNavigation?: (path: string) => void;
  showBackButton?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  maxWidthClass?: string;
}

export const MedicalHeader: React.FC<MedicalHeaderProps> = ({
  previousPage,
  onNavigation,
  showBackButton = true,
  title = "Facial Harmony Analysis System",
  subtitle = "AI-Powered Clinical Diagnostics",
  maxWidthClass = "max-w-7xl"
}) => {
  return (
    <header className="bg-white border-b-2 border-blue-100 shadow-sm">
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-6">
            {showBackButton && (
              <button
                onClick={() => {
                  if (previousPage && onNavigation && previousPage !== window.location.pathname) {
                    onNavigation(previousPage);
                  } else if (window.history.length > 1) {
                    window.history.back();
                  } else if (onNavigation) {
                    onNavigation("/");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg border-2 border-blue-700 hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200 ease-out"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            )}
            <div className={`${showBackButton && onNavigation ? 'border-l-2 border-blue-200 pl-6' : ''}`}>
              <h1 className="text-xl font-bold text-gray-800">
                {title}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {subtitle}
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
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
