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
        <h3 className="text-lg font-semibold text-clinical-900">Mô phỏng 3D</h3>
        <p className="text-clinical-600 mt-2">Sử dụng chuột để xoay, phóng to/thu nhỏ mô hình</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Model view */}
        <Card className="border-clinical-200 overflow-hidden">
          <div className="bg-clinical-100 px-4 py-3 border-b border-clinical-200">
            <h4 className="font-semibold text-clinical-900">Mô hình</h4>
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
      </div>
    </div>
  );
}
