import React from "react";

export const MedicalFooter: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 mt-16 border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 mb-8"></div>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
          <div className="max-w-3xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Clinical AI Diagnostic Platform
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Advanced artificial intelligence for dental diagnostics.
              Empowering healthcare professionals with cutting-edge technology.
            </p>
          </div>
          <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-6">
            <span>FDA Compliant</span>
            <span>•</span>
            <span>HIPAA Secure</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 LeeTray × HiAI. All Rights Reserved. Medical Device Software.
          </p>
        </div>
      </div>
    </footer>
  );
};
