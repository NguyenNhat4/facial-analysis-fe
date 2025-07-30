
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Radiation,
  MessageCircle,
  Heart,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react";
import { Link } from "wouter";
import type { XrayAnalysis, ToothAnalysis } from "@shared/schema";

// Mock image mapping: Maps Input image names to corresponding Output images
const imageMapping: Record<string, string> = {
  "input.jpeg": "assets/output.jpeg",
  "input_xray.jpg": "assets/output_xray.jpg",
  "leetray_logo.png": "assets/input_xray.jpg",
  "output_xray.jpg": "assets/output_xray_processed.jpg",
  "pananomic_xray_log...": "assets/output_pananomic.jpg",
  "xquang.png": "assets/output_xquang.jpg",
  "image1.jpg": "assets/output_image1.jpg",
  "image2.jpg": "assets/output_image2.jpg",
  "image3.jpg": "assets/output_image3.jpg",
};

// Default image if no match is found
const defaultImage = "assets/output_xray.jpg";

// Mock data sets with treatment recommendations
const xrayAnalysis1: XrayAnalysis = {
  healthyTeeth: 26,
  decayedTeeth: 4,
  treatmentNeeded: 2,
  teeth: [
    {
      toothNumber: 11,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 10, y: 30, width: 8, height: 28 },
    },
    {
      toothNumber: 12,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 20, y: 32, width: 8, height: 27 },
    },
    {
      toothNumber: 13,
      status: "decay",
      condition: "Sâu răng nhẹ, cần trám",
      position: { x: 30, y: 34, width: 8, height: 26 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Kiểm tra định kỳ sau 6 tháng.",
      },
    },
    {
      toothNumber: 14,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 40, y: 35, width: 8, height: 25 },
    },
    {
      toothNumber: 16,
      status: "treatment_needed",
      condition: "Hư hỏng nặng, cần điều trị tủy",
      position: { x: 50, y: 36, width: 8, height: 24 },
      treatmentRecommendation: {
        method: "Điều trị tủy và bọc sứ",
        estimatedTime: "2-3 buổi, mỗi buổi 1.5 giờ",
        notes: "Cần chụp X-quang kiểm tra sau điều trị.",
      },
    },
    {
      toothNumber: 21,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 60, y: 30, width: 8, height: 28 },
    },
    {
      toothNumber: 22,
      status: "decay",
      condition: "Sâu răng, cần trám composite",
      position: { x: 70, y: 32, width: 8, height: 27 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Tránh nhai thức ăn cứng trong 24 giờ sau trám.",
      },
    },
    {
      toothNumber: 23,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 80, y: 34, width: 8, height: 26 },
    },
    {
      toothNumber: 26,
      status: "treatment_needed",
      condition: "Nứt răng, cần bọc sứ",
      position: { x: 90, y: 36, width: 8, height: 24 },
      treatmentRecommendation: {
        method: "Bọc sứ toàn phần",
        estimatedTime: "2 buổi, mỗi buổi 1 giờ",
        notes: "Đảm bảo vệ sinh răng miệng tốt sau khi bọc sứ.",
      },
    },
    {
      toothNumber: 27,
      status: "decay",
      condition: "Sâu răng, cần trám",
      position: { x: 100, y: 38, width: 8, height: 25 },
      treatmentRecommendation: {
        method: "Trám răng bằng amalgam",
        estimatedTime: "45 phút",
        notes: "Kiểm tra định kỳ sau 6 tháng.",
      },
    },
  ],
};

const xrayAnalysis2: XrayAnalysis = {
  healthyTeeth: 20,
  decayedTeeth: 8,
  treatmentNeeded: 4,
  teeth: [
    {
      toothNumber: 11,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 15, y: 28, width: 8, height: 29 },
    },
    {
      toothNumber: 12,
      status: "decay",
      condition: "Sâu răng nặng, cần trám",
      position: { x: 25, y: 30, width: 8, height: 28 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1.5 giờ",
        notes: "Cần kiểm tra sâu răng lan rộng trước khi trám.",
      },
    },
    {
      toothNumber: 13,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 35, y: 32, width: 8, height: 27 },
    },
    {
      toothNumber: 15,
      status: "treatment_needed",
      condition: "Hư hỏng nặng, cần nhổ răng",
      position: { x: 45, y: 35, width: 8, height: 25 },
      treatmentRecommendation: {
        method: "Nhổ răng và cân nhắc cấy ghép implant",
        estimatedTime: "1 giờ cho nhổ răng, implant cần 2-3 tháng",
        notes: "Cần chụp X-quang kiểm tra xương trước khi implant.",
      },
    },
    {
      toothNumber: 17,
      status: "decay",
      condition: "Sâu răng, cần trám composite",
      position: { x: 55, y: 37, width: 8, height: 26 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Tránh nhai thức ăn cứng trong 24 giờ sau trám.",
      },
    },
    {
      toothNumber: 21,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 65, y: 28, width: 8, height: 29 },
    },
    {
      toothNumber: 22,
      status: "decay",
      condition: "Sâu răng, cần trám",
      position: { x: 75, y: 30, width: 8, height: 28 },
      treatmentRecommendation: {
        method: "Trám răng bằng amalgam",
        estimatedTime: "45 phút",
        notes: "Kiểm tra định kỳ sau 6 tháng.",
      },
    },
    {
      toothNumber: 24,
      status: "treatment_needed",
      condition: "Nứt răng, cần bọc sứ",
      position: { x: 85, y: 33, width: 8, height: 26 },
      treatmentRecommendation: {
        method: "Bọc sứ toàn phần",
        estimatedTime: "2 buổi, mỗi buổi 1 giờ",
        notes: "Đảm bảo vệ sinh răng miệng tốt sau khi bọc sứ.",
      },
    },
    {
      toothNumber: 26,
      status: "decay",
      condition: "Sâu răng nhẹ, cần trám",
      position: { x: 95, y: 35, width: 8, height: 25 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Kiểm tra định kỳ sau 6 tháng.",
      },
    },
    {
      toothNumber: 28,
      status: "treatment_needed",
      condition: "Răng khôn mọc lệch, cần nhổ",
      position: { x: 105, y: 38, width: 8, height: 24 },
      treatmentRecommendation: {
        method: "Nhổ răng khôn",
        estimatedTime: "1-1.5 giờ",
        notes: "Nghỉ ngơi và tránh hoạt động nặng sau nhổ răng.",
      },
    },
  ],
};

const xrayAnalysis3: XrayAnalysis = {
  healthyTeeth: 28,
  decayedTeeth: 3,
  treatmentNeeded: 1,
  teeth: [
    {
      toothNumber: 11,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 12, y: 29, width: 8, height: 28 },
    },
    {
      toothNumber: 12,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 22, y: 31, width: 8, height: 27 },
    },
    {
      toothNumber: 14,
      status: "decay",
      condition: "Sâu răng nhẹ, cần trám",
      position: { x: 32, y: 33, width: 8, height: 26 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Kiểm tra định kỳ sau 6 tháng.",
      },
    },
    {
      toothNumber: 15,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 42, y: 34, width: 8, height: 25 },
    },
    {
      toothNumber: 17,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 52, y: 36, width: 8, height: 24 },
    },
    {
      toothNumber: 21,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 62, y: 29, width: 8, height: 28 },
    },
    {
      toothNumber: 23,
      status: "decay",
      condition: "Sâu răng, cần trám composite",
      position: { x: 72, y: 31, width: 8, height: 27 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Tránh nhai thức ăn cứng trong 24 giờ sau trám.",
      },
    },
    {
      toothNumber: 25,
      status: "treatment_needed",
      condition: "Hư hỏng nặng, cần điều trị tủy",
      position: { x: 82, y: 33, width: 8, height: 26 },
      treatmentRecommendation: {
        method: "Điều trị tủy và bọc sứ",
        estimatedTime: "2-3 buổi, mỗi buổi 1.5 giờ",
        notes: "Cần chụp X-quang kiểm tra sau điều trị.",
      },
    },
    {
      toothNumber: 27,
      status: "decay",
      condition: "Sâu răng nhẹ, cần trám",
      position: { x: 92, y: 35, width: 8, height: 25 },
      treatmentRecommendation: {
        method: "Trám răng bằng composite",
        estimatedTime: "1 giờ",
        notes: "Kiểm tra định kỳ sau 6 tháng.",
      },
    },
    {
      toothNumber: 28,
      status: "healthy",
      condition: "Khỏe mạnh",
      position: { x: 102, y: 37, width: 8, height: 24 },
    },
  ],
};

// Mapping from input image file names to analysis data and patient info
const dataMapping: Record<
  string,
  { analysis: XrayAnalysis; patientName: string; patientId: string }
> = {
  "hiar-logo.png": {
    analysis: xrayAnalysis1,
    patientName: "Nguyễn Văn A",
    patientId: "P012345",
  },
  "input_xray.jpg": {
    analysis: xrayAnalysis2,
    patientName: "Trần Thị B",
    patientId: "P012346",
  },
  "image3.jpg": {
    analysis: xrayAnalysis3,
    patientName: "Lê Văn C",
    patientId: "P012347",
  },
};

// Default analysis if no mapping found
const defaultAnalysis: XrayAnalysis = xrayAnalysis1;
const defaultPatientName = "Nguyễn Văn A";
const defaultPatientId = "P012345";

interface XrayAnalysisProps {
  analysis: XrayAnalysis;
  inputSrc: string;
  outputSrc: string;
}

export function XrayAnalysisComponent({
  analysis,
  inputSrc,
  outputSrc,
}: XrayAnalysisProps) {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    content: string;
    x: number;
    y: number;
  }>({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  const getToothColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "border-green-400 bg-green-400/20";
      case "decay":
        return "border-yellow-400 bg-yellow-400/20";
      case "treatment_needed":
        return "border-red-400 bg-red-400/20";
      default:
        return "border-gray-400 bg-gray-400/20";
    }
  };

  const handleToothHover = (tooth: ToothAnalysis, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      content: `Răng số ${tooth.toothNumber} | Tình trạng: ${tooth.condition}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleToothLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-clinical-900">
          Phân tích X-quang Panoramic
        </h3>
        <p className="text-clinical-600 mt-2">
          AI đã phát hiện và phân loại tình trạng các răng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative bg-clinical-900 rounded-lg overflow-hidden p-4 mb-8">
        <div>
          <p className="text-center text-white font-semibold mb-2">
            Input Image
          </p>
          <img
            src={inputSrc}
            alt="Input Panoramic X-ray"
            className="w-full h-auto opacity-90"
            onError={(e) => {
              console.error("Error loading input image:", inputSrc);
              e.currentTarget.src = defaultImage;
            }}
          />
        </div>
        <div>
          <p className="text-center text-white font-semibold mb-2">
            Output Image
          </p>
          <img
            src={outputSrc}
            alt="Output Panoramic X-ray"
            className="w-full h-auto opacity-90"
            onError={(e) => {
              console.error("Error loading output image:", outputSrc);
              e.currentTarget.src = defaultImage;
            }}
          />
        </div>

        {tooltip.show && (
          <div
            className="fixed bg-clinical-900 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none z-10"
            style={{
              left: tooltip.x - 100,
              top: tooltip.y - 40,
              transform: "translateX(-50%)",
            }}
          >
            {tooltip.content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-clinical-900"></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900">Răng khỏe mạnh</h4>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {analysis.healthyTeeth}
                </p>
              </div>
              <Heart className="text-green-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-900">Răng sâu</h4>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {analysis.decayedTeeth}
                </p>
              </div>
              <AlertTriangle className="text-yellow-500" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-900">Cần điều trị</h4>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {analysis.treatmentNeeded}
                </p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function XrayAnalysisPage() {
  const [analysis, setAnalysis] = useState<XrayAnalysis>(defaultAnalysis);
  const [patientName, setPatientName] = useState<string>(defaultPatientName);
  const [patientId, setPatientId] = useState<string>(defaultPatientId);
  const [inputSrc, setInputSrc] = useState<string>(defaultImage);
  const [outputSrc, setOutputSrc] = useState<string>(defaultImage);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedTooth, setSelectedTooth] = useState<ToothAnalysis | null>(null);

  const totalTeeth =
    analysis.healthyTeeth + analysis.decayedTeeth + analysis.treatmentNeeded;
  const healthPercentage = (analysis.healthyTeeth / totalTeeth) * 100;

  // Handle input image upload
  const handleInputImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadStatus("No input file selected.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadStatus("Please upload a valid input image file.");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setInputSrc(imageUrl);

    // Look up the corresponding output image based on the input file name
    const fileName = file.name.toLowerCase();
    const mappedOutput = imageMapping[fileName] || defaultImage;
    setOutputSrc(mappedOutput);

    // Look up the corresponding analysis data and patient info based on the input file name
    const mappedData = dataMapping[fileName];
    if (mappedData) {
      setAnalysis(mappedData.analysis);
      setPatientName(mappedData.patientName);
      setPatientId(mappedData.patientId);
    } else {
      setAnalysis(defaultAnalysis);
      setPatientName(defaultPatientName);
      setPatientId(defaultPatientId);
    }

    setUploadStatus(
      `Input image uploaded: ${
        file.name
      }, Output image set to: ${mappedOutput}, Data set for patient: ${
        mappedData?.patientName || defaultPatientName
      }`
    );
    console.log(
      `Input file: ${file.name}, URL: ${imageUrl}, Output: ${mappedOutput}`
    );
    return () => URL.revokeObjectURL(imageUrl);
  };

  // Handle opening treatment recommendation modal
  const handleShowTreatment = (tooth: ToothAnalysis) => {
    setSelectedTooth(tooth);
  };

  // Handle closing treatment recommendation modal
  const handleCloseTreatment = () => {
    setSelectedTooth(null);
  };

  return (
    <div className="min-h-screen bg-clinical-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-clinical-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-clinical-600 hover:text-primary"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="w-10 h-10 bg-clinical-800 rounded-lg flex items-center justify-center">
                <Radiation className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-clinical-900">
                  Phân tích X-quang
                </h1>
                <p className="text-xs text-clinical-500">
                  Phát hiện và phân loại tình trạng răng
                </p>
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
                <span className="text-clinical-900 font-semibold ml-2">
                  {patientName}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-clinical-500">ID:</span>
                <span className="text-clinical-900 font-mono ml-2">
                  {patientId}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-clinical-500">Ngày chụp:</span>
                <span className="text-clinical-900 ml-2">21/07/2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <p className="text-clinical-500">Tình trạng răng</p>
                <p className="text-lg font-bold text-clinical-900">
                  {healthPercentage.toFixed(1)}% khỏe mạnh
                </p>
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
                    <p className="text-2xl font-bold text-clinical-900">
                      {totalTeeth}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-clinical-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="text-clinical-600"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z" />
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
                    <p className="text-2xl font-bold text-green-700">
                      {analysis.healthyTeeth}
                    </p>
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
                    <p className="text-2xl font-bold text-yellow-700">
                      {analysis.decayedTeeth}
                    </p>
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
                    <p className="text-2xl font-bold text-red-700">
                      {analysis.treatmentNeeded}
                    </p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">ℹ️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Demo - Tính năng đang phát triển
                  </h4>
                  <p className="text-sm text-gray-700">
                    Đây là demo giao diện cho tính năng phân tích X-quang AI.
                    Chúng tôi sẽ phát triển tính năng này trong tương lai gần.
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="input-upload-image"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Tải ảnh Input
                </label>
                <input
                  type="file"
                  id="input-upload-image"
                  accept="image/*"
                  onChange={handleInputImageUpload}
                  className="mt-1 block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
           
          </div>

          <Card className="bg-white shadow-sm border-clinical-200">
            <CardHeader className="border-b border-clinical-200 bg-clinical-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Phân tích Chi tiết (Demo)
                  </h3>
                  <p className="text-clinical-200 mt-1">
                    Ví dụ minh họa kết quả phân tích X-quang
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-clinical-300">Độ chính xác AI</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <XrayAnalysisComponent
                analysis={analysis}
                inputSrc={inputSrc}
                outputSrc={outputSrc}
              />
            </CardContent>
          </Card>

          {/* Treatment Priority */}
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardHeader className="border-b border-red-200">
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    Ưu tiên Điều trị
                  </h3>
                  <p className="text-red-700">Các răng cần được điều trị sớm</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analysis.teeth
                  .filter((tooth) => tooth.status !== "healthy")
                  .map((tooth) => (
                    <div
                      key={tooth.toothNumber}
                      className={`flex items-center justify-between p-4 bg-white rounded-lg border ${
                        tooth.status === "treatment_needed"
                          ? "border-red-200"
                          : "border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            tooth.status === "treatment_needed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {tooth.toothNumber}
                        </div>
                        <div>
                          <h4
                            className={`font-semibold ${
                              tooth.status === "treatment_needed"
                                ? "text-red-900"
                                : "text-yellow-900"
                            }`}
                          >
                            Răng số {tooth.toothNumber}
                          </h4>
                          <p
                            className={`text-sm ${
                              tooth.status === "treatment_needed"
                                ? "text-red-700"
                                : "text-yellow-700"
                            }`}
                          >
                            {tooth.condition}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            tooth.status === "treatment_needed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {tooth.status === "treatment_needed"
                            ? "Khẩn cấp"
                            : "Trung bình"}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`border-${
                            tooth.status === "treatment_needed"
                              ? "red"
                              : "yellow"
                          }-300 text-${
                            tooth.status === "treatment_needed"
                              ? "red"
                              : "yellow"
                          }-700 hover:bg-${
                            tooth.status === "treatment_needed" ? "red" : "yellow"
                          }-50`}
                          onClick={() => handleShowTreatment(tooth)}
                        >
                          Tư vấn điều trị
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Treatment Recommendation Modal */}
      {selectedTooth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-clinical-900">
                Tư vấn Điều trị - Răng số {selectedTooth.toothNumber}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseTreatment}
                className="text-clinical-600"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-clinical-500">
                  Tình trạng
                </p>
                <p className="text-clinical-900">{selectedTooth.condition}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-clinical-500">
                  Phương pháp điều trị
                </p>
                <p className="text-clinical-900">
                  {selectedTooth.treatmentRecommendation?.method ||
                    "Không có thông tin"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-clinical-500">
                  Thời gian dự kiến
                </p>
                <p className="text-clinical-900">
                  {selectedTooth.treatmentRecommendation?.estimatedTime ||
                    "Không có thông tin"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-clinical-500">Lưu ý</p>
                <p className="text-clinical-900">
                  {selectedTooth.treatmentRecommendation?.notes ||
                    "Không có thông tin"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={handleCloseTreatment}
                className="text-clinical-600 border-clinical-300"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}