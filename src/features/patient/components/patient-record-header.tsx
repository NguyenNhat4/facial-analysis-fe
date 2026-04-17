import React from "react";
import { User } from "lucide-react";

export const PatientRecordHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-8 py-6 rounded-t-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                Demonstration Case
              </h2>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                DEMO
              </span>
            </div>
            <p className="text-blue-100 text-lg font-medium">
              Sample Clinical Data
            </p>
            <p className="text-blue-200 text-sm">
              Case ID: #DEMO-2025-001 • Session Date:{" "}
              {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-blue-100 text-sm">Current Session</div>
          <div className="text-white font-semibold">
            {new Date().toLocaleDateString("en-GB")}
          </div>
          <div className="text-blue-200 text-sm">
            {new Date().toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
