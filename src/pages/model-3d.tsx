import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Box, MessageCircle, RotateCw, Clock, Zap } from "lucide-react";
import { Link } from "wouter";
import { Model3D } from "@/components/model-3d";
import type { Comparison } from "@shared/schema";

export default function Model3DPage() {
  // Mock data - in a real app this would come from API
  const comparison: Comparison = {
    biteImprovement: 85,
    aestheticImprovement: 92,
    treatmentTime: "18 tháng",
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Box className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-clinical-900">Mô phỏng 3D</h1>
                <p className="text-xs text-clinical-500">So sánh trước và sau điều trị</p>
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
                <span className="text-clinical-500">Mô hình:</span>
                <span className="text-clinical-900 ml-2">Intraoral Scan</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <p className="text-clinical-500">Độ cải thiện</p>
                <p className="text-lg font-bold text-green-600">{comparison.aestheticImprovement}%</p>
              </div>
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  <MessageCircle size={14} className="mr-2" />
                  Thảo luận mô phỏng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Improvement Metrics */}
      <section className="bg-clinical-50 border-b border-clinical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <RotateCw className="text-white" size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-700">{comparison.biteImprovement}%</p>
                    <p className="text-sm text-blue-600">Cải thiện</p>
                  </div>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Khớp cắn</h4>
                <Progress value={comparison.biteImprovement} className="h-2 mb-2" />
                <p className="text-sm text-blue-700">Khớp cắn được cải thiện đáng kể</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="text-white" size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">{comparison.aestheticImprovement}%</p>
                    <p className="text-sm text-green-600">Cải thiện</p>
                  </div>
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Thẩm mỹ</h4>
                <Progress value={comparison.aestheticImprovement} className="h-2 mb-2" />
                <p className="text-sm text-green-700">Vẻ đẹp nụ cười được nâng cao</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">{comparison.treatmentTime}</p>
                    <p className="text-sm text-purple-600">Thời gian</p>
                  </div>
                </div>
                <h4 className="font-semibold text-purple-900 mb-2">Điều trị</h4>
                <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
                <p className="text-sm text-purple-700">Kế hoạch điều trị tối ưu</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3D Model Content */}
      <section className="bg-clinical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Demo - Tính năng đang phát triển</h4>
                <p className="text-sm text-purple-700">Đây là demo giao diện cho tính năng mô phỏng 3D. Chúng tôi sẽ phát triển tính năng này trong tương lai gần.</p>
              </div>
            </div>
          </div>

          <Card className="bg-white shadow-sm border-clinical-200">
            <CardHeader className="border-b border-clinical-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-clinical-900">Mô hình 3D Tương tác (Demo)</h3>
                  <p className="text-clinical-600 mt-1">Ví dụ minh họa mô phỏng điều trị 3D</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <p className="text-clinical-500">Độ phân giải</p>
                    <p className="text-lg font-bold text-clinical-900">Ultra HD</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-clinical-500">Định dạng</p>
                    <p className="text-lg font-bold text-clinical-900">STL</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <Model3D comparison={comparison} />
            </CardContent>
          </Card>

          {/* Interactive Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="border-b border-blue-200">
                <h4 className="font-semibold text-blue-900 flex items-center">
                  <RotateCw className="mr-2" size={20} />
                  Điều khiển Mô hình
                </h4>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Xoay mô hình</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Kéo chuột</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Phóng to/thu nhỏ</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Cuộn chuột</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Di chuyển</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Giữ Shift + Kéo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Reset view</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Đặt lại
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="border-b border-green-200">
                <h4 className="font-semibold text-green-900 flex items-center">
                  <Zap className="mr-2" size={20} />
                  Điểm nổi bật
                </h4>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Cải thiện đường cười</p>
                      <p className="text-xs text-green-700">Răng được sắp xếp đều và hài hòa</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Khớp cắn tối ưu</p>
                      <p className="text-xs text-green-700">Phân bố lực cắn đều khắp hàm răng</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Tỷ lệ khuôn mặt</p>
                      <p className="text-xs text-green-700">Cân đối và hài hòa với khuôn mặt</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Treatment Timeline */}
          <Card className="mt-8 border-purple-200 bg-purple-50">
            <CardHeader className="border-b border-purple-200">
              <h4 className="font-semibold text-purple-900 flex items-center">
                <Clock className="mr-2" size={20} />
                Lộ trình Điều trị
              </h4>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-purple-900">Giai đoạn chuẩn bị (Tháng 1-3)</h5>
                    <p className="text-sm text-purple-700">Điều trị nội nha, vệ sinh răng miệng</p>
                  </div>
                  <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">3 tháng</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-purple-900">Giai đoạn chính (Tháng 4-15)</h5>
                    <p className="text-sm text-purple-700">Niềng răng chỉnh nha, điều chỉnh khớp cắn</p>
                  </div>
                  <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">12 tháng</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-purple-900">Giai đoạn hoàn thiện (Tháng 16-18)</h5>
                    <p className="text-sm text-purple-700">Tháo niềng, lắp hàm duy trì, theo dõi</p>
                  </div>
                  <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">3 tháng</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-purple-900">Tổng thời gian điều trị</p>
                    <p className="text-sm text-purple-700">Từ khám ban đầu đến hoàn thành</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-900">{comparison.treatmentTime}</p>
                    <Link href="/chat">
                      <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                        <MessageCircle size={14} className="mr-2" />
                        Tư vấn kế hoạch
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