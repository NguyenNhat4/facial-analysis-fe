import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Camera, MessageCircle, Radiation, Box, User, Upload } from "lucide-react";
import { Link } from "wouter";
import { FacialAnalysisComponent } from "@/components/facial-analysis";
import type { FacialAnalysis } from "@shared/schema";
import { useState } from "react";

export default function FacialAnalysisPage() {
  const [activeTab, setActiveTab] = useState("patient-info");

  // Mock data - in a real app this would come from API
  const facialAnalysis: FacialAnalysis = {
    noseLipAngle: 95,
    goldenRatio: 1.6,
    chinProjection: 4,
    recommendations: [
      "Điều chỉnh độ nhô cằm bằng kỹ thuật orthognathic",
      "Cải thiện tỉ lệ vàng qua niềng răng",
      "Tái khám sau 3 tháng để đánh giá tiến độ",
    ],
  };

  return (
    <div className="min-h-screen bg-clinical-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-clinical-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-clinical-600 hover:text-primary">
                  <ArrowLeft size={20} className="mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Camera className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-clinical-900">Phân tích Gương mặt</h1>
                <p className="text-xs text-clinical-500">Đo lường và phân tích các tỷ lệ khuôn mặt</p>
              </div>
            </div>
            <Link href="/chat">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <MessageCircle size={16} className="mr-2" />
                Tư vấn AI
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-blue-50 to-clinical-50 border-b border-clinical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-clinical-900 mb-4">
              Phân tích Gương mặt AI
            </h2>
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                🚀 Demo - Tính năng đang phát triển
              </span>
            </div>
            <p className="text-lg text-clinical-600 max-w-2xl mx-auto">
              Công nghệ AI tiên tiến phân tích các tỷ lệ khuôn mặt, đo lường góc mũi môi, 
              tỷ lệ vàng và độ nhô cằm để đưa ra kế hoạch điều trị tối ưu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with 4 Tabs */}
      <section className="bg-clinical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Demo - Hệ thống Phân tích Nha khoa AI LeeTray</h4>
                <p className="text-sm text-blue-700">Khám phá đầy đủ quy trình từ nhập thông tin bệnh nhân đến phân tích AI. Chuyển đổi giữa các tab để trải nghiệm từng bước.</p>
              </div>
            </div>
          </div>

          {/* Tabbed Interface với 4 Tab */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-200 h-16 rounded-xl">
              <TabsTrigger 
                value="patient-info" 
                className="flex flex-col items-center space-y-1 text-sm font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg m-1 py-3"
              >
                <User size={20} />
                <span>Thông tin Bệnh nhân</span>
              </TabsTrigger>
              <TabsTrigger 
                value="facial" 
                className="flex flex-col items-center space-y-1 text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg m-1 py-3"
              >
                <Camera size={20} />
                <span>Phân tích Gương mặt</span>
              </TabsTrigger>
              <TabsTrigger 
                value="xray" 
                className="flex flex-col items-center space-y-1 text-sm font-medium data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-lg m-1 py-3"
              >
                <Radiation size={20} />
                <span>Phân tích X-quang</span>
              </TabsTrigger>
              <TabsTrigger 
                value="model3d" 
                className="flex flex-col items-center space-y-1 text-sm font-medium data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-lg m-1 py-3"
              >
                <Box size={20} />
                <span>Mô phỏng 3D</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient-info" className="mt-0">
              <PatientInfoSection />
            </TabsContent>

            <TabsContent value="facial" className="mt-0">
              <Card className="bg-white shadow-sm border-clinical-200">
                <CardHeader className="border-b border-clinical-200 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-clinical-900">Phân tích Gương mặt AI (Demo)</h3>
                      <p className="text-clinical-600 mt-1">Phân tích đa góc độ với đo lường chính xác</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-clinical-500">Độ chính xác</p>
                      <p className="text-2xl font-bold text-blue-600">96.8%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <FacialAnalysisComponent analysis={facialAnalysis} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="xray" className="mt-0">
              <XRayAnalysisDemo />
            </TabsContent>

            <TabsContent value="model3d" className="mt-0">
              <Model3DDemo />
            </TabsContent>
          </Tabs>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Kết quả Tốt</h4>
                <p className="text-sm text-green-700">
                  Góc mũi môi đạt chuẩn. Không cần can thiệp phẫu thuật.
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-yellow-900 mb-2">Cần Theo dõi</h4>
                <p className="text-sm text-yellow-700">
                  Tỷ lệ vàng gần đạt chuẩn. Có thể cải thiện bằng niềng răng.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-red-900 mb-2">Cần Điều trị</h4>
                <p className="text-sm text-red-700">
                  Độ nhô cằm cần điều chỉnh. Khuyến nghị phẫu thuật orthognathic.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// X-Ray Analysis Demo Component
function XRayAnalysisDemo() {
  return (
    <Card className="bg-white shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Phân tích X-quang AI (Demo)</h3>
            <p className="text-gray-600 mt-1">AI phát hiện sâu răng, nhiễm trùng và phân loại răng</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Độ chính xác</p>
            <p className="text-2xl font-bold text-gray-700">94.5%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Radiation className="text-gray-600" size={28} />
                <h4 className="text-2xl font-bold text-gray-900">
                  Phân tích X-quang AI
                </h4>
              </div>
              <p className="text-gray-700 text-lg">
                AI phát hiện sâu răng, nhiễm trùng và phân loại răng tự động
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* X-ray Image with AI Detection */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h5 className="font-semibold text-gray-900 text-lg mb-4">Ảnh X-quang với AI Detection</h5>
                <div className="relative bg-black rounded-lg h-80 overflow-hidden">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* X-ray background */}
                    <rect width="400" height="300" fill="#1a1a1a"/>
                    
                    {/* Teeth outlines */}
                    <g stroke="#e5e7eb" strokeWidth="2" fill="none">
                      {/* Upper teeth */}
                      <rect x="50" y="80" width="20" height="30" rx="5"/>
                      <rect x="80" y="75" width="20" height="35" rx="5"/>
                      <rect x="110" y="70" width="25" height="40" rx="5"/>
                      <rect x="140" y="70" width="25" height="40" rx="5"/>
                      <rect x="170" y="70" width="25" height="40" rx="5"/>
                      <rect x="200" y="70" width="25" height="40" rx="5"/>
                      <rect x="230" y="70" width="25" height="40" rx="5"/>
                      <rect x="260" y="75" width="20" height="35" rx="5"/>
                      <rect x="290" y="80" width="20" height="30" rx="5"/>
                      
                      {/* Lower teeth */}
                      <rect x="50" y="180" width="20" height="30" rx="5"/>
                      <rect x="80" y="175" width="20" height="35" rx="5"/>
                      <rect x="110" y="170" width="25" height="40" rx="5"/>
                      <rect x="140" y="170" width="25" height="40" rx="5"/>
                      <rect x="170" y="170" width="25" height="40" rx="5"/>
                      <rect x="200" y="170" width="25" height="40" rx="5"/>
                      <rect x="230" y="170" width="25" height="40" rx="5"/>
                      <rect x="260" y="175" width="20" height="35" rx="5"/>
                      <rect x="290" y="180" width="20" height="30" rx="5"/>
                    </g>
                    
                    {/* AI Detection boxes */}
                    <rect x="108" y="68" width="29" height="44" stroke="#ef4444" strokeWidth="2" fill="none"/>
                    <text x="115" y="60" fill="#ef4444" fontSize="10" fontWeight="bold">Sâu răng</text>
                    
                    <rect x="198" y="168" width="29" height="44" stroke="#f59e0b" strokeWidth="2" fill="none"/>
                    <text x="205" y="160" fill="#f59e0b" fontSize="10" fontWeight="bold">Viêm tủy</text>
                    
                    <rect x="168" y="68" width="29" height="44" stroke="#10b981" strokeWidth="2" fill="none"/>
                    <text x="175" y="60" fill="#10b981" fontSize="10" fontWeight="bold">Bình thường</text>
                  </svg>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Sâu răng: 2 ca</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Viêm tủy: 1 ca</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Bình thường: 29 răng</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Results */}
              <div className="space-y-6">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <h6 className="font-semibold text-red-900 mb-2">Phát hiện Sâu răng</h6>
                    <p className="text-2xl font-bold text-red-900">2 răng</p>
                    <p className="text-sm text-red-700 mt-2">Răng số 6, 14 cần điều trị ngay</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <h6 className="font-semibold text-yellow-900 mb-2">Viêm tủy răng</h6>
                    <p className="text-2xl font-bold text-yellow-900">1 răng</p>
                    <p className="text-sm text-yellow-700 mt-2">Răng số 36 cần lấy tủy</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h6 className="font-semibold text-green-900 mb-2">Tình trạng tổng thể</h6>
                    <p className="text-2xl font-bold text-green-900">Tốt</p>
                    <p className="text-sm text-green-700 mt-2">91% răng khỏe mạnh</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 3D Model Demo Component  
function Model3DDemo() {
  return (
    <Card className="bg-white shadow-sm border-purple-200">
      <CardHeader className="border-b border-purple-200 bg-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-purple-900">Mô phỏng 3D Interactive (Demo)</h3>
            <p className="text-purple-600 mt-1">So sánh trước và sau điều trị với mô hình 3D</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-500">Độ cải thiện</p>
            <p className="text-2xl font-bold text-purple-600">95%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Box className="text-purple-600" size={28} />
                <h4 className="text-2xl font-bold text-purple-900">
                  Mô phỏng 3D Interactive
                </h4>
              </div>
              <p className="text-purple-700 text-lg">
                So sánh trước và sau điều trị với mô hình 3D tương tác
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Before 3D Model */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h5 className="font-semibold text-gray-900 text-lg mb-4 text-center">Trước điều trị</h5>
                <div className="relative bg-gradient-to-b from-purple-100 to-purple-50 rounded-lg h-80 flex items-center justify-center">
                  <svg viewBox="0 0 300 200" className="w-full h-3/4">
                    {/* 3D jaw representation */}
                    <g transform="translate(150, 100)">
                      {/* Upper jaw */}
                      <ellipse cx="0" cy="-30" rx="80" ry="25" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                      {/* Lower jaw */}
                      <ellipse cx="0" cy="30" rx="75" ry="20" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                      
                      {/* Teeth - misaligned */}
                      <g stroke="#6b7280" strokeWidth="1.5" fill="#f3f4f6">
                        {/* Upper teeth - crooked */}
                        <rect x="-60" y="-40" width="8" height="15" rx="2" transform="rotate(-10)"/>
                        <rect x="-45" y="-42" width="8" height="15" rx="2" transform="rotate(5)"/>
                        <rect x="-30" y="-40" width="8" height="15" rx="2"/>
                        <rect x="-15" y="-45" width="8" height="15" rx="2" transform="rotate(-15)"/>
                        <rect x="0" y="-40" width="8" height="15" rx="2"/>
                        <rect x="15" y="-42" width="8" height="15" rx="2" transform="rotate(8)"/>
                        <rect x="30" y="-40" width="8" height="15" rx="2"/>
                        <rect x="45" y="-38" width="8" height="15" rx="2" transform="rotate(-5)"/>
                        <rect x="60" y="-40" width="8" height="15" rx="2"/>
                      </g>
                      
                      {/* Problem indicators */}
                      <circle cx="-15" cy="-35" r="8" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2"/>
                      <text x="-25" y="-50" fill="#ef4444" fontSize="8" fontWeight="bold">Lệch</text>
                    </g>
                  </svg>
                  <div className="absolute bottom-4 left-4 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Răng lệch: 3 răng
                  </div>
                </div>
              </div>

              {/* After 3D Model */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h5 className="font-semibold text-gray-900 text-lg mb-4 text-center">Sau điều trị (Dự đoán)</h5>
                <div className="relative bg-gradient-to-b from-green-100 to-green-50 rounded-lg h-80 flex items-center justify-center">
                  <svg viewBox="0 0 300 200" className="w-full h-3/4">
                    {/* 3D jaw representation */}
                    <g transform="translate(150, 100)">
                      {/* Upper jaw */}
                      <ellipse cx="0" cy="-30" rx="80" ry="25" fill="none" stroke="#10b981" strokeWidth="2"/>
                      {/* Lower jaw */}
                      <ellipse cx="0" cy="30" rx="75" ry="20" fill="none" stroke="#10b981" strokeWidth="2"/>
                      
                      {/* Teeth - aligned */}
                      <g stroke="#6b7280" strokeWidth="1.5" fill="#f8fafc">
                        {/* Upper teeth - straight */}
                        <rect x="-60" y="-40" width="8" height="15" rx="2"/>
                        <rect x="-45" y="-40" width="8" height="15" rx="2"/>
                        <rect x="-30" y="-40" width="8" height="15" rx="2"/>
                        <rect x="-15" y="-40" width="8" height="15" rx="2"/>
                        <rect x="0" y="-40" width="8" height="15" rx="2"/>
                        <rect x="15" y="-40" width="8" height="15" rx="2"/>
                        <rect x="30" y="-40" width="8" height="15" rx="2"/>
                        <rect x="45" y="-40" width="8" height="15" rx="2"/>
                        <rect x="60" y="-40" width="8" height="15" rx="2"/>
                      </g>
                      
                      {/* Success indicators */}
                      <circle cx="0" cy="-35" r="15" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2"/>
                      <text x="-20" y="-50" fill="#10b981" fontSize="8" fontWeight="bold">Thẳng hàng</text>
                    </g>
                  </svg>
                  <div className="absolute bottom-4 left-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Cải thiện: 95%
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment Timeline */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-purple-200">
              <h5 className="text-lg font-semibold text-purple-900 mb-6 text-center">Kế hoạch Điều trị</h5>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
                  <p className="text-sm font-medium">Tháng 1-6</p>
                  <p className="text-xs text-gray-600">Niềng răng</p>
                </div>
                <div className="flex-1 h-1 bg-purple-200 mx-4"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2">2</div>
                  <p className="text-sm font-medium">Tháng 6-12</p>
                  <p className="text-xs text-gray-600">Điều chỉnh</p>
                </div>
                <div className="flex-1 h-1 bg-purple-200 mx-4"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">✓</div>
                  <p className="text-sm font-medium">Tháng 12+</p>
                  <p className="text-xs text-gray-600">Hoàn thành</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Patient Info Section Component
function PatientInfoSection() {
  return (
    <div className="space-y-8">
      {/* Patient Information Card */}
      <Card className="bg-white shadow-sm border-green-200">
        <CardHeader className="border-b border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-green-900">Thông tin Bệnh nhân</h3>
              <p className="text-green-600 mt-1">Quản lý hồ sơ và dữ liệu bệnh nhân</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-500">Trạng thái</p>
              <p className="text-lg font-bold text-green-600">Đã xác nhận</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Thông tin cá nhân */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 text-green-600" size={20} />
                  Thông tin Cá nhân
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Họ và tên:</span>
                    <span className="text-gray-900 font-semibold">Nguyễn Văn A</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Mã bệnh nhân:</span>
                    <span className="text-gray-900 font-mono">P012345</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Ngày sinh:</span>
                    <span className="text-gray-900">15/03/1985</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Giới tính:</span>
                    <span className="text-gray-900">Nam</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Số điện thoại:</span>
                    <span className="text-gray-900">0123 456 789</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900">nguyenvana@email.com</span>
                  </div>
                </div>
              </div>

              {/* Lịch sử khám */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử Khám bệnh</h4>
                <div className="space-y-3">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-900">Khám định kỳ</span>
                      <span className="text-sm text-green-600">21/07/2025</span>
                    </div>
                    <p className="text-sm text-green-700">Phân tích gương mặt, X-quang, mô phỏng 3D</p>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Đang thực hiện</span>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Tư vấn niềng răng</span>
                      <span className="text-sm text-gray-600">15/05/2025</span>
                    </div>
                    <p className="text-sm text-gray-700">Đánh giá tình trạng răng miệng</p>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Hoàn thành</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tải lên dữ liệu */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="mr-2 text-blue-600" size={20} />
                  Tải lên Dữ liệu
                </h4>
                <div className="space-y-4">
                  {/* Upload Cards */}
                  <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Camera className="mx-auto text-blue-500 mb-3" size={32} />
                    <h5 className="font-semibold text-blue-900 mb-2">Ảnh Gương mặt</h5>
                    <p className="text-sm text-blue-700 mb-4">Tải lên ảnh chụp từ nhiều góc độ</p>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Chọn ảnh
                    </Button>
                    <div className="mt-3 text-xs text-blue-600">
                      ✓ 3 ảnh đã tải lên (Mặt trước, Nghiêng, 3/4)
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Radiation className="mx-auto text-gray-500 mb-3" size={32} />
                    <h5 className="font-semibold text-gray-900 mb-2">Ảnh X-quang</h5>
                    <p className="text-sm text-gray-700 mb-4">Tải lên ảnh X-quang răng</p>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Chọn ảnh X-quang
                    </Button>
                    <div className="mt-3 text-xs text-gray-500">
                      ✓ 2 ảnh X-quang đã tải lên
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <Box className="mx-auto text-purple-500 mb-3" size={32} />
                    <h5 className="font-semibold text-purple-900 mb-2">Mô hình 3D</h5>
                    <p className="text-sm text-purple-700 mb-4">Tải lên file quét 3D</p>
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                      Chọn file 3D
                    </Button>
                    <div className="mt-3 text-xs text-purple-600">
                      ✓ File .STL đã tải lên (15.2 MB)
                    </div>
                  </div>
                </div>
              </div>

              {/* Ghi chú bác sĩ */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú của Bác sĩ</h4>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-semibold text-yellow-900 mb-2">BS. Nguyễn Thị B - Chuyên khoa Chỉnh nha</h5>
                  <p className="text-sm text-yellow-800 mb-3">
                    "Bệnh nhân có tình trạng răng lệch nhẹ, góc mũi môi trong giới hạn bình thường. 
                    Khuyến nghị thực hiện phân tích chi tiết bằng AI để đưa ra kế hoạch điều trị tối ưu."
                  </p>
                  <div className="text-xs text-yellow-700">
                    Ngày: 21/07/2025 | Thời gian: 14:30
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nút chuyển sang phân tích */}
      <div className="text-center">
        <div className="flex justify-center space-x-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3">
            <Camera className="mr-2" size={18} />
            Phân tích Gương mặt
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3">
            <Radiation className="mr-2" size={18} />
            Phân tích X-quang
          </Button>
          <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100 px-6 py-3">
            <Box className="mr-2" size={18} />
            Mô phỏng 3D
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Chọn loại phân tích AI để xem kết quả demo
        </p>
      </div>
    </div>
  );
}