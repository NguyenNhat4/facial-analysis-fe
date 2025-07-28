import { Upload, Camera, Radiation, Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function UploadCards() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-clinical-900 flex items-center">
        <Upload className="text-primary mr-2" size={20} />
        Dữ liệu Đầu vào
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Portrait Card */}
        <Card className="border-2 border-dashed border-clinical-300 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
              alt="Patient Portrait" 
              className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
            />
            <h3 className="font-medium text-clinical-900 text-sm">Ảnh Ngoài Mặt</h3>
            <p className="text-xs text-clinical-500 mt-1">JPG, PNG</p>
            <div className="mt-2">
              <span className="status-badge-success">✓ Đã tải</span>
            </div>
          </CardContent>
        </Card>

        {/* X-ray Card */}
        <Card className="border-2 border-dashed border-clinical-300 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 bg-clinical-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Radiation className="text-white" size={24} />
            </div>
            <h3 className="font-medium text-clinical-900 text-sm">Ảnh X-quang</h3>
            <p className="text-xs text-clinical-500 mt-1">DICOM, JPG</p>
            <div className="mt-2">
              <span className="status-badge-success">✓ Đã tải</span>
            </div>
          </CardContent>
        </Card>

        {/* 3D Model Card */}
        <Card className="border-2 border-dashed border-clinical-300 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 bg-medical-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Box className="text-primary" size={24} />
            </div>
            <h3 className="font-medium text-clinical-900 text-sm">Mô hình 3D Xương Hàm</h3>
            <p className="text-xs text-clinical-500 mt-1">OBJ, STL</p>
            <div className="mt-2">
              <span className="status-badge-success">✓ Đã tải</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
