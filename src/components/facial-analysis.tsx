import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Upload, RotateCw } from "lucide-react";
import type { FacialAnalysis } from "@shared/schema";

interface FacialAnalysisProps {
  analysis: FacialAnalysis;
}

export function FacialAnalysisComponent({ analysis }: FacialAnalysisProps) {
  return (
    <div className="space-y-8">
      {/* Multi-Angle Upload Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Camera className="text-blue-600" size={28} />
            <h4 className="text-2xl font-bold text-blue-900">
              Phân tích Đa Góc Độ AI
            </h4>
          </div>
          <p className="text-blue-700 text-lg">
            Upload 3 ảnh để AI phân tích toàn diện cấu trúc khuôn mặt
          </p>
        </div>
        
        {/* Three Analysis Views */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Front View Analysis (1) */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 relative">
            <div className="text-center mb-4">
              <Badge className="bg-blue-500 text-white text-sm font-bold px-4 py-2 mb-3">
                Góc chính diện (1)
              </Badge>
              <h5 className="font-semibold text-gray-900 text-lg">Phân tích đối xứng</h5>
            </div>
            
            {/* Mock image with overlay analysis */}
            <div className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg overflow-hidden h-80">
              {/* Simulated face photo background */}
              <div className="absolute inset-0 bg-gradient-radial-face opacity-30"></div>
              
              {/* Analysis overlay */}
              <svg viewBox="0 0 300 400" className="w-full h-full absolute inset-0">
                {/* Face outline */}
                <ellipse cx="150" cy="200" rx="80" ry="120" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8"/>
                
                {/* Center symmetry line */}
                <line x1="150" y1="80" x2="150" y2="320" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" opacity="0.9"/>
                
                {/* Horizontal measurement lines */}
                <line x1="70" y1="140" x2="230" y2="140" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/>
                <line x1="70" y1="200" x2="230" y2="200" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/>
                <line x1="70" y1="260" x2="230" y2="260" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/>
                
                {/* Eye measurement points */}
                <circle cx="120" cy="140" r="3" fill="#ef4444"/>
                <circle cx="180" cy="140" r="3" fill="#ef4444"/>
                
                {/* Nose and mouth points */}
                <circle cx="150" cy="180" r="3" fill="#10b981"/>
                <circle cx="150" cy="220" r="3" fill="#10b981"/>
                
                {/* Angle measurements */}
                <path d="M 130 200 L 170 200 L 150 240" fill="none" stroke="#ef4444" strokeWidth="2"/>
                <text x="155" y="215" fontSize="10" fill="#ef4444" fontWeight="bold">140.6°</text>
                
                <path d="M 130 240 L 170 240 L 150 280" fill="none" stroke="#10b981" strokeWidth="2"/>
                <text x="155" y="255" fontSize="10" fill="#10b981" fontWeight="bold">135.6°</text>
                
                {/* Golden ratio measurements */}
                <text x="240" y="145" fontSize="9" fill="#f59e0b" fontWeight="bold">1.61</text>
                <text x="240" y="205" fontSize="9" fill="#f59e0b" fontWeight="bold">1.0</text>
                <text x="240" y="265" fontSize="9" fill="#f59e0b" fontWeight="bold">1.58</text>
              </svg>
              
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs p-2 rounded">
                <div>• Đối xứng: 96.2%</div>
                <div>• Tỷ lệ vàng: 1.58</div>
              </div>
            </div>
          </div>

          {/* Side View Analysis (2) */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200 relative">
            <div className="text-center mb-4">
              <Badge className="bg-green-500 text-white text-sm font-bold px-4 py-2 mb-3">
                Góc nghiêng (2)
              </Badge>
              <h5 className="font-semibold text-gray-900 text-lg">Góc mũi cằm</h5>
            </div>
            
            {/* Side profile analysis */}
            <div className="relative bg-gradient-to-b from-green-100 to-green-50 rounded-lg overflow-hidden h-80">
              <svg viewBox="0 0 300 400" className="w-full h-full absolute inset-0">
                {/* Profile outline */}
                <path d="M 120 80 Q 140 60 170 70 Q 200 80 210 120 Q 215 160 210 200 Q 205 240 195 270 Q 180 300 160 310 Q 140 300 130 270 Q 125 240 128 200" 
                      fill="none" stroke="#10b981" strokeWidth="2"/>
                
                {/* Nose projection */}
                <path d="M 170 180 L 190 185 L 185 200 L 175 195" fill="none" stroke="#10b981" strokeWidth="2"/>
                
                {/* Nose-lip angle measurement */}
                <path d="M 170 180 L 200 180 L 185 220" fill="none" stroke="#ef4444" strokeWidth="2"/>
                <text x="205" y="195" fontSize="12" fill="#ef4444" fontWeight="bold">95°</text>
                
                {/* Facial plane reference line */}
                <line x1="150" y1="80" x2="150" y2="310" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3"/>
                
                {/* Chin projection measurement */}
                <line x1="150" y1="280" x2="175" y2="280" stroke="#8b5cf6" strokeWidth="2"/>
                <text x="180" y="285" fontSize="10" fill="#8b5cf6" fontWeight="bold">4mm</text>
                
                {/* Measurement points */}
                <circle cx="170" cy="180" r="3" fill="#ef4444"/>
                <circle cx="185" cy="185" r="3" fill="#ef4444"/>
                <circle cx="175" cy="220" r="3" fill="#ef4444"/>
                <circle cx="160" cy="280" r="3" fill="#8b5cf6"/>
                
                {/* Nasolabial angle indicator */}
                <text x="80" y="160" fontSize="8" fill="#ef4444" fontWeight="bold" transform="rotate(-90 80 160)">Nasolabial Angle</text>
                <text x="80" y="200" fontSize="8" fill="#10b981" fontWeight="bold" transform="rotate(-90 80 200)">Mentolabial Angle</text>
                <text x="80" y="240" fontSize="8" fill="#8b5cf6" fontWeight="bold" transform="rotate(-90 80 240)">Pogonion Angle</text>
              </svg>
              
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs p-2 rounded">
                <div>• Góc mũi-môi: 95°</div>
                <div>• Độ nhô cằm: 4mm</div>
              </div>
            </div>
          </div>

          {/* 3/4 View Analysis (3) */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 relative">
            <div className="text-center mb-4">
              <Badge className="bg-purple-500 text-white text-sm font-bold px-4 py-2 mb-3">
                Góc 3/4 (3)
              </Badge>
              <h5 className="font-semibold text-gray-900 text-lg">Chiều sâu khuôn mặt</h5>
            </div>
            
            {/* 3/4 view analysis */}
            <div className="relative bg-gradient-to-b from-purple-100 to-purple-50 rounded-lg overflow-hidden h-80">
              <svg viewBox="0 0 300 400" className="w-full h-full absolute inset-0">
                {/* 3/4 face outline */}
                <ellipse cx="160" cy="200" rx="70" ry="100" fill="none" stroke="#8b5cf6" strokeWidth="2" transform="rotate(10 160 200)"/>
                
                {/* Depth measurement lines */}
                <line x1="120" y1="140" x2="200" y2="140" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="125" y1="200" x2="195" y2="200" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="130" y1="260" x2="190" y2="260" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2"/>
                
                {/* Facial contour highlighting */}
                <path d="M 130 140 Q 140 135 160 140 Q 180 145 200 155 Q 210 165 215 180" 
                      fill="none" stroke="#10b981" strokeWidth="2"/>
                
                {/* Cheekbone measurement */}
                <circle cx="140" cy="170" r="3" fill="#ef4444"/>
                <circle cx="185" cy="175" r="3" fill="#ef4444"/>
                <line x1="140" y1="170" x2="185" y2="175" stroke="#ef4444" strokeWidth="2"/>
                <text x="155" y="165" fontSize="10" fill="#ef4444" fontWeight="bold">42mm</text>
                
                {/* Jawline angle */}
                <path d="M 150 240 L 180 255 L 165 285" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                <text x="185" y="265" fontSize="10" fill="#8b5cf6" fontWeight="bold">118°</text>
                
                {/* Mid-facial depth indicator */}
                <line x1="160" y1="120" x2="160" y2="280" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="170" y="200" fontSize="9" fill="#f59e0b" fontWeight="bold">32mm</text>
              </svg>
              
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs p-2 rounded">
                <div>• Độ rộng gò má: 42mm</div>
                <div>• Góc hàm: 118°</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="mt-8 p-6 bg-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Upload className="text-blue-600" size={24} />
            <h5 className="text-xl font-semibold text-blue-900">Hướng dẫn Upload Ảnh</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800 mb-6">
            <div className="text-center bg-white p-4 rounded-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h6 className="font-bold mb-2">Chính diện</h6>
              <p>Nhìn thẳng camera, môi khép tự nhiên, không cười</p>
            </div>
            <div className="text-center bg-white p-4 rounded-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h6 className="font-bold mb-2">Nghiêng 90°</h6>
              <p>Profile hoàn toàn bên, tai và mũi nhìn rõ</p>
            </div>
            <div className="text-center bg-white p-4 rounded-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h6 className="font-bold mb-6">Góc 3/4</h6>
              <p>Quay mặt 45°, nhìn thấy cả hai mắt</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg">
              <Upload size={20} className="mr-3" />
              Upload 3 Ảnh để Phân tích
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-blue-900">Góc mũi môi</h4>
                <p className="text-3xl font-bold text-blue-900 mt-1">{analysis.noseLipAngle}°</p>
              </div>
              <span className={analysis.noseLipAngle >= 90 && analysis.noseLipAngle <= 110 ? "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium" : "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium"}>
                {analysis.noseLipAngle >= 90 && analysis.noseLipAngle <= 110 ? "Đạt chuẩn" : "Gần chuẩn"}
              </span>
            </div>
            <Progress value={Math.min((analysis.noseLipAngle / 110) * 100, 100)} className="h-3" />
            <p className="text-xs text-blue-700 mt-2">Chuẩn: 90-110°</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-yellow-900">Tỷ lệ vàng</h4>
                <p className="text-3xl font-bold text-yellow-900 mt-1">{analysis.goldenRatio}</p>
              </div>
              <span className={Math.abs(analysis.goldenRatio - 1.618) < 0.1 ? "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium" : "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium"}>
                {Math.abs(analysis.goldenRatio - 1.618) < 0.1 ? "Lý tưởng" : "Tốt"}
              </span>
            </div>
            <Progress value={Math.min((analysis.goldenRatio / 1.618) * 100, 100)} className="h-3" />
            <p className="text-xs text-yellow-700 mt-2">Lý tưởng: 1.618</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-green-900">Độ nhô cằm</h4>
                <p className="text-3xl font-bold text-green-900 mt-1">{analysis.chinProjection}mm</p>
              </div>
              <span className={analysis.chinProjection >= 2 && analysis.chinProjection <= 4 ? "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium" : "bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium"}>
                {analysis.chinProjection >= 2 && analysis.chinProjection <= 4 ? "Bình thường" : "Cần điều trị"}
              </span>
            </div>
            <Progress value={Math.min((analysis.chinProjection / 6) * 100, 100)} className="h-3" />
            <p className="text-xs text-green-700 mt-2">Chuẩn: 2-4mm</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <h4 className="text-xl font-semibold text-purple-900 mb-6 flex items-center">
            <RotateCw className="mr-3" size={24} />
            Khuyến nghị Điều trị AI
          </h4>
          <div className="space-y-4">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-purple-900 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}