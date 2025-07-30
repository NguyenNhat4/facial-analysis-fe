import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Upload, Camera, Radiation, Box, User, Calendar, Phone, Mail, MapPin, Sparkles, Target, Activity, Edit3, Save, X, Brain, Scan, Stethoscope } from 'lucide-react';

const DemoPage = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('information');
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: boolean}>({
    lateral: false,
    profile: false,
    frontal: false,
    general_xray: false,
    model_3d: false
  });

  // State to store uploaded image files
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    lateral: null,
    profile: null,
    frontal: null,
    general_xray: null,
    model_3d: null
  });

  // State to store image preview URLs
  const [imagePreviewUrls, setImagePreviewUrls] = useState<{[key: string]: string}>({
    lateral: '',
    profile: '',
    frontal: '',
    general_xray: '',
    model_3d: ''
  });

  // Enhanced patient data with editing states
  const [patientData, setPatientData] = useState({
    name: "NHẬT NGUYỄN",
    firstName: "NGUYỄN", 
    lastName: "NHẬT",
    email: "635107103@st.utc2.edu.v",
    sex: "male",
    dateOfBirth: "01/01/1990",
    consultationDate: "07/07/2025",
    phone: "0909090909909",
    address: "Click to edit",
    chiefComplaint: "Click to edit",
    diagnose: "Click to edit",
    note: "Click to edit",
    treatmentPlan: "Click to edit"
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  // Add demo state
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');

  // Demo data loader
  const loadDemoData = async () => {
    setIsLoading(true);
    
    // Simulate loading with demo images
    const demoFiles = [
      { id: 'frontal', name: 'demo-frontal.jpg' },
      { id: 'lateral', name: 'demo-lateral.jpg' },
      { id: 'model_3d', name: 'demo-3d.obj' }
    ];

    for (const file of demoFiles) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate upload
      setUploadedImages(prev => ({ ...prev, [file.id]: true }));
      setImagePreviewUrls(prev => ({ 
        ...prev, 
        [file.id]: `/assets/demo_image/${file.name}` 
      }));
    }
    
    setIsLoading(false);
  };

  const uploadCategories = [
    {
      title: "X-ray Images",
      items: [
        { 
          id: 'lateral', 
          name: 'Lateral x-ray image', 
          icon: '/assets/upload_logo/logo-lateral-xray.png'
        },
        { 
          id: 'general_xray', 
          name: 'General x-ray upload', 
          icon: '/assets/upload_logo/logo-upload-xray.png'
        },
      ]
    },
    {
      title: "Face Images",
      items: [
        { 
          id: 'frontal', 
          name: 'Frontal face image', 
          icon: '/assets/upload_logo/frontal-face.png'
        },
        { 
          id: 'profile', 
          name: 'Side face image', 
          icon: '/assets/upload_logo/logo-side-face.png'
        }
      ]
    },
    {
      title: "3D Models",
      items: [
        { 
          id: 'model_3d', 
          name: '3D model upload', 
          icon: '/assets/upload_logo/3D-model.png'
        }
      ]
    }
  ];

  // Handle file upload
  const handleFileUpload = (imageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the file
      setUploadedFiles(prev => ({
        ...prev,
        [imageId]: file
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrls(prev => ({
        ...prev,
        [imageId]: previewUrl
      }));

      // Mark as uploaded
      setUploadedImages(prev => ({
        ...prev,
        [imageId]: true
      }));
    }
  };

  const handleImageUpload = (imageId: string) => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => handleFileUpload(imageId, event as any);
    input.click();
  };

  // Check if specific image types are available for analysis
  const hasFaceImages = uploadedImages.frontal || uploadedImages.profile;
  const hasXrayImages = uploadedImages.lateral || uploadedImages.general_xray;
  const has3DModel = uploadedImages.model_3d;
  const hasAllImages = uploadedImages.frontal && uploadedImages.profile && uploadedImages.lateral && uploadedImages.model_3d;

  const handleEditStart = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleEditSave = (field: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
    setTempValue("");
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  // Navigation handlers
  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const renderEditableField = (field: string, value: string, isTextarea = false) => {
    const isEditing = editingField === field;
    const isClickToEdit = value === "Click to edit";
    
    if (isEditing) {
      return (
        <div className="relative">
          {isTextarea ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-4 bg-white border-2 border-blue-300 rounded-xl font-medium resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter details..."
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-4 bg-white border-2 border-blue-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter value..."
              autoFocus
            />
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={() => handleEditSave(field)}
              className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Save className="w-3 h-3" />
            </button>
            <button
              onClick={handleEditCancel}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`group relative p-4 rounded-xl font-medium cursor-pointer transition-all duration-300 hover:shadow-md ${
          isClickToEdit 
            ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-2 border-blue-200/60 text-blue-600 hover:from-blue-100/80 hover:to-indigo-100/80 hover:border-blue-300/60' 
            : 'bg-white/80 border-2 border-gray-200/60 text-gray-800 hover:bg-white hover:border-gray-300/60'
        }`}
        onClick={() => handleEditStart(field, isClickToEdit ? "" : value)}
      >
        {value}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="/assets/leetray_logo.png" 
                  alt="LeeTray Logo" 
                  className="w-16 h-16 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-gray-400 font-bold text-2xl">×</span>
              <div className="relative">
                <img 
                  src="/assets/hiai-logo.png" 
                  alt="HiAI Logo" 
                  className="w-16 h-16 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-gray-600 hover:text-sky-500 font-medium transition-all duration-300 hover:scale-105 relative group cursor-pointer"
              >
                Trang chủ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => handleNavigation('/demo')}
                className="text-sky-500 font-medium transition-all duration-300 hover:scale-105 relative group cursor-pointer"
              >
                Tính năng
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-sky-400 to-sky-500"></span>
              </button>
              <button 
                onClick={() => handleNavigation('/facial-analysis')}
                className="text-gray-600 hover:text-sky-500 font-medium transition-all duration-300 hover:scale-105 relative group cursor-pointer"
              >
                Giới thiệu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => handleNavigation('/chat')}
                className="text-gray-600 hover:text-sky-500 font-medium transition-all duration-300 hover:scale-105 relative group cursor-pointer"
              >
                Liên hệ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Selection Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mb-8 overflow-hidden border border-gray-200/50">
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Select Patient</h2>
                  <p className="text-slate-200 text-lg">{patientData.name} (Male | 35 Years)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-none h-14">
              <TabsTrigger 
                value="information" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-sky-500 data-[state=active]:shadow-lg transition-all duration-300 px-8 py-3 font-semibold"
              >
                <User className="w-4 h-4 mr-2" />
                INFORMATION
              </TabsTrigger>
              <TabsTrigger 
                value="record" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-sky-500 data-[state=active]:shadow-lg transition-all duration-300 px-8 py-3 font-semibold"
              >
                <Activity className="w-4 h-4 mr-2" />
                RECORD  
              </TabsTrigger>
              <TabsTrigger 
                value="treatment" 
                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-sky-500 data-[state=active]:shadow-lg transition-all duration-300 px-8 py-3 font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                TREATMENT HISTORY
              </TabsTrigger>
            </TabsList>

            <TabsContent value="information" className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Patient Avatar */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-gray-200/50">
                    <div className="w-36 h-36 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                      <User className="w-20 h-20 text-slate-500" />
                    </div>
                    <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">LAST NAME:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium">
                        {patientData.lastName}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">FIRST NAME:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium">
                        {patientData.firstName}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">EMAIL:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium">
                        {patientData.email}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">SEX:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium capitalize">
                        {patientData.sex}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">DATE OF BIRTH:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium">
                        {patientData.dateOfBirth}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">CONSULTATION DATE:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium">
                        {patientData.consultationDate}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">PHONE:</label>
                      <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 font-medium">
                        {patientData.phone}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">ADDRESS:</label>
                      {renderEditableField('address', patientData.address)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">CHIEF COMPLAINT</label>
                      {renderEditableField('chiefComplaint', patientData.chiefComplaint)}
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">DIAGNOSE</label>
                      {renderEditableField('diagnose', patientData.diagnose)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">NOTE</label>
                      {renderEditableField('note', patientData.note, true)}
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">SELECTED TREATMENT PLAN</label>
                      {renderEditableField('treatmentPlan', patientData.treatmentPlan, true)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="record" className="p-8">
              {/* Upload Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Medical Records</h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-600 font-medium">DATE: 28/07/2025</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
                      disabled={isLoading}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {isLoading ? 'UPLOADING...' : 'UPLOAD IMAGE A+'}
                    </Button>
                    
                    <Button 
                      onClick={loadDemoData}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
                      disabled={isLoading}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isLoading ? 'LOADING...' : 'LOAD DEMO DATA'}
                    </Button>
                  </div>
                </div>

                {/* Upload Grid */}
                <div className="space-y-10">
                  {uploadCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <h4 className="text-xl font-bold text-gray-800">{category.title}</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300/60 to-transparent"></div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {category.items.map((item) => (
                          <Card 
                            key={item.id}
                            className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 backdrop-blur-sm ${
                              uploadedImages[item.id] 
                                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 shadow-lg' 
                                : 'border-gray-200/60 bg-white/80 hover:border-blue-300/60 hover:bg-white'
                            }`}
                            onClick={() => handleImageUpload(item.id)}
                          >
                            <CardContent className="p-4 text-center relative overflow-hidden">
                              <div className={`w-24 h-24 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                                uploadedImages[item.id] 
                                  ? 'bg-gradient-to-br from-emerald-100 to-teal-100 transform scale-105' 
                                  : 'bg-white/90 border border-gray-200/60 shadow-sm group-hover:scale-105 group-hover:shadow-md group-hover:border-blue-300/60'
                              }`}>
                                {uploadedImages[item.id] && imagePreviewUrls[item.id] ? (
                                  <img 
                                    src={imagePreviewUrls[item.id]} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                ) : (
                                  <img src={item.icon} alt={item.name} className="w-16 h-16 object-contain drop-shadow-sm" />
                                )}
                              </div>
                              <p className="text-xs text-gray-700 leading-tight font-medium mb-2">{item.name}</p>
                              {uploadedImages[item.id] && (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md animate-pulse text-xs">
                                  <Sparkles className="w-2 h-2 mr-1" />
                                  Uploaded
                                </Badge>
                              )}
                              {/* Decorative corner */}
                              <div className={`absolute top-0 right-0 w-0 h-0 border-l-[15px] border-b-[15px] border-l-transparent transition-all duration-300 ${
                                uploadedImages[item.id] 
                                  ? 'border-b-emerald-400' 
                                  : 'border-b-blue-200/60 group-hover:border-b-blue-400/60'
                              }`}></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analysis Tools Section */}
                <div className="mt-16 pt-8 border-t border-gray-200/50">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="h-1 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <h4 className="text-xl font-bold text-gray-800">Analysis Tools</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300/60 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Facial Analysis */}
                    <div className="relative group">
                      <Button 
                        className={`w-full flex flex-col items-center justify-center p-6 h-auto transition-all duration-300 ${
                          hasFaceImages 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        disabled={!hasFaceImages}
                        onClick={() => hasFaceImages && handleNavigation('/facial-analysis')}
                      >
                        <Brain className="w-8 h-8 mb-3" />
                        <div className="text-center">
                          <div className="font-semibold text-sm flex items-center justify-center">
                            Phân tích Gương mặt
                            {hasFaceImages && <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>}
                          </div>
                          <div className="text-xs opacity-80 mt-1">
                            {hasFaceImages ? 'Sẵn sàng phân tích!' : 'Cần ảnh ngoài mặt'}
                          </div>
                        </div>
                      </Button>
                      {!hasFaceImages && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          Upload frontal or profile face image first
                        </div>
                      )}
                    </div>

                    {/* X-ray Analysis */}
                    <div className="relative group">
                      <Button 
                        className={`w-full flex flex-col items-center justify-center p-6 h-auto transition-all duration-300 ${
                          hasXrayImages 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        disabled={!hasXrayImages}
                        onClick={() => hasXrayImages && handleNavigation('/xray-analysis')}
                      >
                        <Scan className="w-8 h-8 mb-3" />
                        <div className="text-center">
                          <div className="font-semibold text-sm">Phân tích X-quang</div>
                          <div className="text-xs opacity-80 mt-1">
                            {hasXrayImages ? 'Sẵn sàng phân tích!' : 'Cần ảnh X-quang'}
                          </div>
                        </div>
                      </Button>
                      {!hasXrayImages && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          Upload X-ray images first
                        </div>
                      )}
                    </div>

                    {/* 3D Interactive */}
                    <div className="relative group">
                      <Button 
                        className={`w-full flex flex-col items-center justify-center p-6 h-auto transition-all duration-300 ${
                          has3DModel 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        disabled={!has3DModel}
                        onClick={() => has3DModel && handleNavigation('/model-3d')}
                      >
                        <Box className="w-8 h-8 mb-3" />
                        <div className="text-center">
                          <div className="font-semibold text-sm">Interactive 3D</div>
                          <div className="text-xs opacity-80 mt-1">
                            {has3DModel ? 'Sẵn sàng tương tác!' : 'Cần mô hình 3D'}
                          </div>
                        </div>
                      </Button>
                      {!has3DModel && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          Upload 3D model first
                        </div>
                      )}
                    </div>

                    {/* Treatment Prediction */}
                    <div className="relative group">
                      <Button 
                        className={`w-full flex flex-col items-center justify-center p-6 h-auto transition-all duration-300 ${
                          hasAllImages 
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        disabled={!hasAllImages}
                      >
                        <Stethoscope className="w-8 h-8 mb-3" />
                        <div className="text-center">
                          <div className="font-semibold text-sm">Dự đoán điều trị 3D</div>
                          <div className="text-xs opacity-80 mt-1">
                            {hasAllImages ? 'Sẵn sàng dự đoán!' : 'Cần đầy đủ ảnh & 3D'}
                          </div>
                        </div>
                      </Button>
                      {!hasAllImages && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          Upload all required images and 3D model
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  <div className="mt-8 bg-gradient-to-br from-white/90 to-blue-50/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="text-lg font-semibold text-gray-700">Upload Progress</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full">
                        {Object.values(uploadedImages).filter(Boolean).length} / {Object.keys(uploadedImages).length} completed
                      </span>
                    </div>
                    <Progress 
                      value={(Object.values(uploadedImages).filter(Boolean).length / Object.keys(uploadedImages).length) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-gray-600 mt-2">
                      {Object.values(uploadedImages).filter(Boolean).length === Object.keys(uploadedImages).length 
                        ? "🎉 All images uploaded! All analysis tools are now available." 
                        : "Upload more images to unlock additional analysis tools"
                      }
                    </div>
                  </div>
                </div>
              </div>


            </TabsContent>

            <TabsContent value="treatment" className="p-8">
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-white/80 to-blue-100/60 backdrop-blur-sm rounded-3xl p-12 mx-auto max-w-2xl border-2 border-gray-200/40 shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100/80 to-purple-100/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <Calendar className="w-12 h-12 text-indigo-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Lịch sử điều trị
                  </h3>
                  <p className="text-gray-600 text-lg font-medium mb-6">
                    Thông tin lịch sử điều trị sẽ được hiển thị tại đây
                  </p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative group">
                <img 
                  src="/assets/leetray_logo.png" 
                  alt="LeeTray Logo" 
                  className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-slate-400 font-bold text-3xl">×</span>
              <div className="relative group">
                <img 
                  src="/assets/hiai-logo.png" 
                  alt="HiAI Logo" 
                  className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mx-auto mb-6"></div>
            <p className="text-slate-300 text-lg font-medium mb-2">© 2025 LeeTray × HiAI. All Rights Reserved.</p>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Hệ thống Phân tích Nha khoa AI - Công nghệ tiên tiến cho chăm sóc sức khỏe răng miệng
            </p>
            <div className="mt-8 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage; 