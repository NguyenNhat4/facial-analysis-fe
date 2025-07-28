import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Radiation, MessageCircle, Heart, AlertTriangle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { XrayAnalysisComponent } from "@/components/xray-analysis";
import type { XrayAnalysis } from "@shared/schema";

export default function XrayAnalysisPage() {
  // Mock data - in a real app this would come from API
  const xrayAnalysis: XrayAnalysis = {
    healthyTeeth: 24,
    decayedTeeth: 2,
    treatmentNeeded: 1,
    teeth: [
      { toothNumber: 3, status: "healthy", condition: "Khỏe mạnh", position: { x: 15, y: 40, width: 8, height: 25 } },
      { toothNumber: 4, status: "healthy", condition: "Khỏe mạnh", position: { x: 25, y: 35, width: 8, height: 30 } },
      { toothNumber: 6, status: "decay", condition: "Sâu răng", position: { x: 35, y: 38, width: 8, height: 28 } },
      { toothNumber: 8, status: "treatment_needed", condition: "Hư hỏng nặng, cần điều trị tủy", position: { x: 45, y: 42, width: 8, height: 24 } },
      { toothNumber: 11, status: "decay", condition: "Sâu răng", position: { x: 57, y: 38, width: 8, height: 28 } },
      { toothNumber: 13, status: "healthy", condition: "Khỏe mạnh", position: { x: 67, y: 35, width: 8, height: 30 } },
      { toothNumber: 14, status: "healthy", condition: "Khỏe mạnh", position: { x: 77, y: 40, width: 8, height: 25 } },
    ],
  };

  const totalTeeth = xrayAnalysis.healthyTeeth + xrayAnalysis.decayedTeeth + xrayAnalysis.treatmentNeeded;
  const healthPercentage = (xrayAnalysis.healthyTeeth / totalTeeth) * 100;

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
              <div className="w-10 h-10 bg-clinical-800 rounded-lg flex items-center justify-center">
                <Radiation className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-clinical-900">Phân tích X-quang</h1>
                <p className="text-xs text-clinical-500">Phát hiện và phân loại tình trạng răng</p>
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

      {/* Patient Info Bar */}
      <section className="bg-white border-b border-clinical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-clinical-500">Bệnh nhân:</span>
                <span className="text-clinical-900 font-semibold ml-2">Nguyễn Văn A</span>
              </div>
              <div className="text-sm">
                <span className="text-clinical-500">ID:</span>
                <span className="text-clinical-900 font-mono ml-2">P012345</span>
              </div>
              <div className="text-sm">
                <span className="text-clinical-500">Ngày chụp:</span>
                <span className="text-clinical-900 ml-2">21/07/2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <p className="text-clinical-500">Tình trạng răng</p>
                <p className="text-lg font-bold text-clinical-900">{healthPercentage.toFixed(1)}% khỏe mạnh</p>
              </div>
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  <MessageCircle size={14} className="mr-2" />
                  Thảo luận kết quả
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-clinical-50 border-b border-clinical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-clinical-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-clinical-500">Tổng số răng</p>
                    <p className="text-2xl font-bold text-clinical-900">{totalTeeth}</p>
                  </div>
                  <div className="w-12 h-12 bg-clinical-100 rounded-lg flex items-center justify-center">
                    <svg className="text-clinical-600" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Răng khỏe mạnh</p>
                    <p className="text-2xl font-bold text-green-700">{xrayAnalysis.healthyTeeth}</p>
                  </div>
                  <Heart className="text-green-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Răng sâu</p>
                    <p className="text-2xl font-bold text-yellow-700">{xrayAnalysis.decayedTeeth}</p>
                  </div>
                  <AlertTriangle className="text-yellow-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Cần điều trị</p>
                    <p className="text-2xl font-bold text-red-700">{xrayAnalysis.treatmentNeeded}</p>
                  </div>
                  <AlertCircle className="text-red-500" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analysis Content */}
      <section className="bg-clinical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Demo - Tính năng đang phát triển</h4>
                <p className="text-sm text-gray-700">Đây là demo giao diện cho tính năng phân tích X-quang AI. Chúng tôi sẽ phát triển tính năng này trong tương lai gần.</p>
              </div>
            </div>
          </div>

          <Card className="bg-white shadow-sm border-clinical-200">
            <CardHeader className="border-b border-clinical-200 bg-clinical-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Phân tích Chi tiết (Demo)</h3>
                  <p className="text-clinical-200 mt-1">Ví dụ minh họa kết quả phân tích X-quang</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-clinical-300">Độ chính xác AI</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <XrayAnalysisComponent analysis={xrayAnalysis} />
            </CardContent>
          </Card>

          {/* Treatment Priority */}
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardHeader className="border-b border-red-200">
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Ưu tiên Điều trị</h3>
                  <p className="text-red-700">Các răng cần được điều trị sớm</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      8
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900">Răng số 8</h4>
                      <p className="text-sm text-red-700">Hư hỏng nặng, cần điều trị tủy</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="status-badge-danger">Khẩn cấp</span>
                    <Link href="/chat">
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                        Tư vấn điều trị
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      6
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-900">Răng số 6</h4>
                      <p className="text-sm text-yellow-700">Sâu răng, cần trám composite</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="status-badge-warning">Trung bình</span>
                    <Link href="/chat">
                      <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                        Tư vấn điều trị
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      11
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-900">Răng số 11</h4>
                      <p className="text-sm text-yellow-700">Sâu răng, cần trám composite</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="status-badge-warning">Trung bình</span>
                    <Link href="/chat">
                      <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                        Tư vấn điều trị
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}