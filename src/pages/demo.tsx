import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Upload, Camera, Radiation, Box, User, Calendar, Phone, Mail, MapPin } from 'lucide-react';

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('information');
  const [analysisTab, setAnalysisTab] = useState('facial');
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: boolean}>({
    lateral: false,
    panoramic: false,
    posterior: false,
    periapical: false,
    frontal: false,
    smile: false,
    profile: false,
    maxillary: false,
    mandibular: false,
    rightBuccal: false,
    anterior: false,
    leftBuccal: false,
    intraoral: false,
    oblique: false
  });

  // Mock patient data
  const patientData = {
    name: "NHẬT NGUYỄN",
    firstName: "NGUYỄN", 
    lastName: "NHẬT",
    email: "635107103@st.utc2.edu.v",
    sex: "male",
    dateOfBirth: "01/01/1990",
    consultationDate: "07/07/2025",
    phone: "0909090909909",
    address: "Click to edit"
  };

  const uploadCategories = [
    {
      title: "X-ray Images",
      items: [
        { id: 'lateral', name: 'Lateral x-ray image', icon: '🦷' },
        { id: 'panoramic', name: 'Panorama x-ray image', icon: '📷' },
        { id: 'posterior', name: 'Posterior anterior x-ray image', icon: '💀' },
        { id: 'periapical', name: 'Periapical x-ray image', icon: '🔲' },
      ]
    },
    {
      title: "Occlusal Images", 
      items: [
        { id: 'maxillary', name: 'Maxillary occlusal image', icon: '🦷' },
        { id: 'mandibular', name: 'Mandibular occlusal image', icon: '🦷' },
        { id: 'rightBuccal', name: 'Right buccal image', icon: '🦷' },
        { id: 'anterior', name: 'Anterior image (front intraoral)', icon: '🦷' },
        { id: 'leftBuccal', name: 'Left buccal image', icon: '🦷' }
      ]
    },
    {
      title: "Face Images",
      items: [
        { id: 'intraoral', name: 'Intra-oral image', icon: '👄' },
        { id: 'smile', name: 'Smiley face image', icon: '😊' },
        { id: 'frontal', name: 'Frontal face image', icon: '👤' },
        { id: 'oblique', name: 'Oblique face image', icon: '👤' },
        { id: 'profile', name: 'Side face image', icon: '👤' }
      ]
    }
  ];

  const handleImageUpload = (imageId: string) => {
    setUploadedImages(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/leetray_logo.png" 
                alt="LeeTray Logo" 
                className="w-16 h-16 object-contain"
              />
              <span className="text-clinical-400 font-bold text-lg">×</span>
              <img 
                src="/assets/hiai-logo.png" 
                alt="HiAI Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-clinical-600">Trang chủ</a>
              <a href="#" className="text-gray-600 hover:text-clinical-600">Tính năng</a>
              <a href="#" className="text-gray-600 hover:text-clinical-600">Giới thiệu</a>
              <a href="#" className="text-gray-600 hover:text-clinical-600">Liên hệ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Selection Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="bg-clinical-800 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <User className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-semibold">Select Patient</h2>
                  <p className="text-clinical-200">{patientData.name} (Male | 35 Years)</p>
                </div>
              </div>
              <Button className="bg-clinical-600 hover:bg-clinical-700">
                START TREATMENT
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-clinical-700 rounded-none">
              <TabsTrigger value="information" className="text-white data-[state=active]:bg-clinical-600">
                INFORMATION
              </TabsTrigger>
              <TabsTrigger value="record" className="text-white data-[state=active]:bg-clinical-600">
                RECORD  
              </TabsTrigger>
              <TabsTrigger value="treatment" className="text-white data-[state=active]:bg-clinical-600">
                TREATMENT HISTORY
              </TabsTrigger>
            </TabsList>

            <TabsContent value="information" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Patient Avatar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LAST NAME:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.lastName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">FIRST NAME:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.firstName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">EMAIL:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEX:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.sex}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DATE OF BIRTH:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.dateOfBirth}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CONSULTATION DATE:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.consultationDate}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PHONE:</label>
                      <div className="bg-gray-50 p-3 rounded border">{patientData.phone}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ADDRESS:</label>
                      <div className="bg-gray-50 p-3 rounded border text-clinical-600 cursor-pointer hover:bg-gray-100">
                        {patientData.address}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CHIEF COMPLAINT</label>
                      <div className="bg-gray-50 p-3 rounded border text-clinical-600 cursor-pointer hover:bg-gray-100">
                        Click to edit
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DIAGNOSE</label>
                      <div className="bg-gray-50 p-3 rounded border text-clinical-600 cursor-pointer hover:bg-gray-100">
                        Click to edit
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NOTE</label>
                      <div className="bg-gray-50 p-6 rounded border text-clinical-600 cursor-pointer hover:bg-gray-100 h-24">
                        Click to edit
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SELECTED TREATMENT PLAN</label>
                      <div className="bg-gray-50 p-6 rounded border text-clinical-600 cursor-pointer hover:bg-gray-100 h-24">
                        Click to edit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="record" className="p-6">
              {/* Upload Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Medical Records</h3>
                    <p className="text-gray-600">DATE: 28/07/2025</p>
                  </div>
                  <Button className="bg-clinical-600 hover:bg-clinical-700">
                    <Upload className="w-4 h-4 mr-2" />
                    UPLOAD IMAGE A+
                  </Button>
                </div>

                {/* Upload Grid */}
                <div className="space-y-8">
                  {uploadCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h4 className="text-md font-medium text-gray-800 mb-4">{category.title}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {category.items.map((item) => (
                          <Card 
                            key={item.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                              uploadedImages[item.id] ? 'border-clinical-500 bg-clinical-50' : 'border-gray-200'
                            }`}
                            onClick={() => handleImageUpload(item.id)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className={`w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl ${
                                uploadedImages[item.id] ? 'bg-clinical-100' : 'bg-gray-100'
                              }`}>
                                {uploadedImages[item.id] ? '✓' : item.icon}
                              </div>
                              <p className="text-xs text-gray-600 leading-tight">{item.name}</p>
                              {uploadedImages[item.id] && (
                                <Badge className="mt-2 bg-clinical-600">Uploaded</Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Section */}
              <div className="bg-white rounded-lg border">
                <div className="border-b px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
                </div>
                
                <Tabs value={analysisTab} onValueChange={setAnalysisTab} className="w-full">
                  <TabsList className="w-full justify-start bg-gray-50 rounded-none border-b">
                    <TabsTrigger value="facial" className="data-[state=active]:bg-white">
                      <Camera className="w-4 h-4 mr-2" />
                      Phân tích Gương mặt
                    </TabsTrigger>
                    <TabsTrigger value="xray" className="data-[state=active]:bg-white">
                      <Radiation className="w-4 h-4 mr-2" />
                      Phân tích X-quang
                    </TabsTrigger>
                    <TabsTrigger value="model3d" className="data-[state=active]:bg-white">
                      <Box className="w-4 h-4 mr-2" />
                      Mô phỏng 3D
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="facial" className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Image Display */}
                      <div>
                        <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Ảnh phân tích gương mặt sẽ hiển thị tại đây</p>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Results */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">Góc mũi môi</h4>
                            <Badge className="bg-green-100 text-green-800">Đạt chuẩn</Badge>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">95°</p>
                          <Progress value={85} className="mt-2" />
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-500">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">Tỉ lệ vàng</h4>
                            <Badge className="bg-yellow-100 text-yellow-800">Gần chuẩn</Badge>
                          </div>
                          <p className="text-2xl font-bold text-yellow-600">1.6</p>
                          <Progress value={75} className="mt-2" />
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border-l-4 border-red-500">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">Độ nhô cằm</h4>
                            <Badge className="bg-red-100 text-red-800">Cần điều chỉnh</Badge>
                          </div>
                          <p className="text-2xl font-bold text-red-600">4mm</p>
                          <Progress value={45} className="mt-2" />
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-500">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">Góc mentolabial</h4>
                            <Badge className="bg-blue-100 text-blue-800">Bình thường</Badge>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">132°</p>
                          <Progress value={80} className="mt-2" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="xray" className="p-6">
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center mb-6">
                        <div>
                          <Radiation className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Ảnh X-quang và phân tích sẽ hiển thị tại đây</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        AI sẽ tự động phát hiện và đánh dấu các vấn đề trên ảnh X-quang
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="model3d" className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-center">Trước điều trị</h4>
                        <div className="bg-gray-100 rounded-lg p-8 h-80 flex items-center justify-center">
                          <div className="text-center">
                            <Box className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Mô hình 3D trước điều trị</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-center">Sau điều trị</h4>
                        <div className="bg-gray-100 rounded-lg p-8 h-80 flex items-center justify-center">
                          <div className="text-center">
                            <Box className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Mô hình 3D sau điều trị</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="treatment" className="p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Lịch sử điều trị</h3>
                <p className="text-gray-600">Thông tin lịch sử điều trị sẽ được hiển thị tại đây</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-clinical-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/assets/leetray_logo.png" 
                alt="LeeTray Logo" 
                className="w-16 h-16 object-contain"
              />
              <span className="text-clinical-400 font-bold text-lg">×</span>
              <img 
                src="/assets/hiai-logo.png" 
                alt="HiAI Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-clinical-400">© 2025 LeeTray × HiAI. All Rights Reserved.</p>
            <p className="text-clinical-500 mt-2 text-sm">Hệ thống Phân tích Nha khoa AI - Công nghệ tiên tiến cho chăm sóc sức khỏe răng miệng</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage; 