import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Camera, MessageCircle, Upload, CheckCircle, RotateCcw, User } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function FacialAnalysisPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Mock patient data
  const patientData = {
    name: "NHẬT NGUYỄN",
    id: "P012345",
    date: "28/07/2025",
    age: 35,
    gender: "Nam"
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setIsAnalyzed(false);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzed(true);
  };

  const handleNewAnalysis = () => {
    setUploadedImage(null);
    setIsAnalyzed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-clinical-600 hover:text-clinical-700">
                  <ArrowLeft size={20} className="mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-clinical-600 rounded-lg flex items-center justify-center">
                  <Camera className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Phân tích Gương mặt AI</h1>
                  <p className="text-sm text-gray-600">Đo lường và phân tích các tỷ lệ khuôn mặt chuyên nghiệp</p>
                </div>
              </div>
            </div>
            <Link href="/chat">
              <Button className="bg-clinical-600 hover:bg-clinical-700 text-white">
                <MessageCircle size={16} className="mr-2" />
                Tư vấn AI
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        <Card className="mb-8 border-l-4 border-l-clinical-500">
          <CardHeader className="bg-gradient-to-r from-clinical-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-clinical-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-clinical-600" />
                </div>
                <div>
                  <CardTitle className="text-gray-900">{patientData.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    ID: {patientData.id} • {patientData.gender} • {patientData.age} tuổi
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Ngày khám</p>
                <p className="text-lg font-semibold text-clinical-600">{patientData.date}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {!uploadedImage ? (
          /* Upload Section */
          <Card className="border-2 border-dashed border-clinical-300 bg-clinical-50/30">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-clinical-100 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-clinical-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tải lên ảnh gương mặt để phân tích
                </h3>
                <p className="text-gray-600 mb-6">
                  Chỉ phân tích ảnh chụp thẳng mặt. Hỗ trợ định dạng JPG, PNG (tối đa 10MB)
                </p>
                
                <div className="space-y-4">
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button className="bg-clinical-600 hover:bg-clinical-700 text-white px-8 py-3 text-lg">
                      <Upload className="w-5 h-5 mr-2" />
                      Chọn ảnh từ máy tính
                    </Button>
                  </label>
                  
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">💡 Lưu ý để có kết quả tốt nhất:</h4>
                    <ul className="text-sm text-blue-800 space-y-2 text-left max-w-md mx-auto">
                      <li>• Chụp thẳng mặt, không nghiêng</li>
                      <li>• Ánh sáng đều, không có bóng</li>
                      <li>• Khuôn mặt rõ nét, không bị che khuất</li>
                      <li>• Biểu cảm tự nhiên, môi khép nhẹ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !isAnalyzed ? (
          /* Preview and Analyze */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Ảnh đã tải lên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded face"
                    className="w-full h-80 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNewAnalysis}
                      className="bg-white/90 hover:bg-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Đổi ảnh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sẵn sàng phân tích</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-clinical-100 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-clinical-600" />
                  </div>
                  <p className="text-gray-600 mb-6">
                    AI sẽ phân tích các tỷ lệ và góc độ trên khuôn mặt của bạn
                  </p>
                  <Button
                    onClick={handleAnalyze}
                    className="bg-clinical-600 hover:bg-clinical-700 text-white px-8 py-3 text-lg"
                  >
                    🔍 Bắt đầu phân tích
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Analysis Results */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Image with Analysis Overlay */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Kết quả phân tích</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNewAnalysis}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Phân tích ảnh mới
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Analyzed face"
                      className="w-full h-96 object-cover"
                    />
                    {/* Analysis overlay would go here */}
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="bg-white/90 px-4 py-2 rounded-lg text-sm font-medium">
                        Đường phân tích AI được áp dụng
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Metrics */}
            <div className="space-y-6">
              {/* Nasolabial Angle */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Góc mũi môi</h3>
                    <Badge className="bg-green-100 text-green-800">Đạt chuẩn</Badge>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">95°</div>
                  <Progress value={85} className="mb-2" />
                  <p className="text-sm text-gray-600">Khoảng chuẩn: 90°-110°</p>
                </CardContent>
              </Card>

              {/* Mentolabial Angle */}
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Góc cằm môi</h3>
                    <Badge className="bg-blue-100 text-blue-800">Bình thường</Badge>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">132°</div>
                  <Progress value={80} className="mb-2" />
                  <p className="text-sm text-gray-600">Khoảng chuẩn: 120°-140°</p>
                </CardContent>
              </Card>

              {/* Chin Projection */}
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Độ nhô cằm</h3>
                    <Badge className="bg-red-100 text-red-800">Cần điều chỉnh</Badge>
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">4mm</div>
                  <Progress value={45} className="mb-2" />
                  <p className="text-sm text-gray-600">Khoảng chuẩn: 0-2mm</p>
                </CardContent>
              </Card>

              {/* Golden Ratio */}
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Tỷ lệ vàng</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">Gần chuẩn</Badge>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">1.6</div>
                  <Progress value={75} className="mb-2" />
                  <p className="text-sm text-gray-600">Tỷ lệ lý tưởng: 1.618</p>
                </CardContent>
              </Card>

              {/* Overall Summary */}
              <Card className="bg-gradient-to-br from-clinical-50 to-blue-50 border-clinical-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">📋 Tóm tắt & Khuyến nghị</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Góc mũi môi trong khoảng chuẩn</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">✓</span>
                      <span>Góc cằm môi bình thường</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-red-600">!</span>
                      <span>Cằm hơi nhô, có thể cần điều chỉnh</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">~</span>
                      <span>Tỷ lệ vàng gần đạt chuẩn</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleNewAnalysis}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Phân tích ảnh mới
                </Button>
                <Link href="/chat" className="block">
                  <Button className="w-full bg-clinical-600 hover:bg-clinical-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Tư vấn với AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}