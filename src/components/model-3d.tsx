import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Box, RotateCw, Clock } from "lucide-react";
import type { Comparison } from "@shared/schema";

interface Model3DProps {
  comparison: Comparison;
}

export function Model3D({ comparison }: Model3DProps) {
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Initialize Three.js scenes here
    // This would set up the 3D rendering for dental models
    console.log("3D models would be initialized here with Three.js");
  }, []);

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-clinical-900">Mô phỏng 3D - So sánh Trước/Sau điều trị</h3>
        <p className="text-clinical-600 mt-2">Sử dụng chuột để xoay, phóng to/thu nhỏ mô hình</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Before Treatment */}
        <Card className="border-clinical-200 overflow-hidden">
          <div className="bg-clinical-100 px-4 py-3 border-b border-clinical-200">
            <h4 className="font-semibold text-clinical-900">Trước điều trị</h4>
          </div>
          <CardContent className="p-0">
            <div className="relative h-96 bg-clinical-50">
              <div ref={beforeRef} className="w-full h-full"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-clinical-500">
                  <Box className="mx-auto mb-2" size={48} />
                  <p>Mô hình 3D sẽ được tải tại đây</p>
                  <p className="text-sm flex items-center justify-center mt-2">
                    <RotateCw size={16} className="mr-1" />
                    Kéo để xoay mô hình
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* After Treatment */}
        <Card className="border-medical-blue-200 overflow-hidden">
          <div className="bg-medical-blue-100 px-4 py-3 border-b border-medical-blue-200">
            <h4 className="font-semibold text-medical-blue-900">Sau điều trị</h4>
          </div>
          <CardContent className="p-0">
            <div className="relative h-96 bg-clinical-50">
              <div ref={afterRef} className="w-full h-full"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-clinical-500">
                  <Box className="mx-auto mb-2" size={48} />
                  <p>Mô hình 3D sẽ được tải tại đây</p>
                  <p className="text-sm flex items-center justify-center mt-2">
                    <RotateCw size={16} className="mr-1" />
                    Kéo để xoay mô hình
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Comparison */}
      <Card className="border-clinical-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-clinical-900 mb-4">So sánh Điều trị</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-medical-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <RotateCw className="text-primary" size={24} />
              </div>
              <h5 className="font-medium text-clinical-900">Cải thiện Khớp cắn</h5>
              <p className="text-2xl font-bold text-primary mt-1">{comparison.biteImprovement}%</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <svg className="text-green-600" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h5 className="font-medium text-clinical-900">Thẩm mỹ</h5>
              <p className="text-2xl font-bold text-green-600 mt-1">{comparison.aestheticImprovement}%</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Clock className="text-purple-600" size={24} />
              </div>
              <h5 className="font-medium text-clinical-900">Thời gian điều trị</h5>
              <p className="text-2xl font-bold text-purple-600 mt-1">{comparison.treatmentTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
