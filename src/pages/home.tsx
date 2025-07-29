import { Button } from "@/components/ui/button";
import { Camera, Radiation, Box, Menu, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const handleUpload = (type: string) => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'facial' ? 'image/*' : type === 'xray' ? 'image/*' : '.stl,.obj,.ply';
    input.multiple = type === 'facial';
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log(`Uploading ${type} files:`, files);
        // Here you would handle the actual upload
        alert(`Đã chọn ${files.length} file(s) cho ${type}. Chức năng upload sẽ được thêm trong phiên bản chính thức.`);
      }
    };
    
    input.click();
  };

  return (
    <div className="min-h-screen bg-clinical-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-clinical-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/leetray_logo.png" 
                alt="LeeTray Logo" 
                className="w-20 h-20 object-contain"
              />
              <span className="text-clinical-400 font-bold text-xl">×</span>
              <img 
                src="/assets/hiai-logo.png" 
                alt="HiAI Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-clinical-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Trang chủ</a>
                <a href="#" className="text-clinical-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Tính năng</a>
                <a href="#" className="text-clinical-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Giới thiệu</a>
                <a href="#" className="text-clinical-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Liên hệ</a>
              </nav>
              <Link href="/chat">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <MessageCircle size={16} className="mr-2" />
                  Tư vấn AI
                </Button>
              </Link>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/chat">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  <MessageCircle size={14} />
                </Button>
              </Link>
              <button className="text-clinical-600">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>



      {/* Hero Trailer Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-8">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg font-bold px-8 py-3 rounded-full animate-bounce inline-block">
              🚀 COMING SOON 2025
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            LeeTray AI
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
            The Future of Dental AI
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed">
            Chuẩn bị đón nhận cuộc <span className="text-yellow-400 font-bold">CÁCH MẠNG</span> trong chẩn đoán nha khoa. 
            Ba tính năng AI <span className="text-blue-400 font-bold">ĐỘT PHÁ</span> sẽ thay đổi hoàn toàn cách bạn làm việc.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16 text-lg">
            <div className="flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Analysis in Real-time</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Interactive 3D Interface</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
              <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Deep AI Consultation</span>
            </div>
          </div>

          <div className="mb-12">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                <MessageCircle size={24} className="mr-3" />
                Experience AI Demo Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Three Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Khám phá tương lai của nha khoa với ba tính năng AI tiên tiến nhất thế giới
            </p>
          </div>

          {/* Revolutionary Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1: Facial Analysis */}
            <div className="group cursor-pointer bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative p-8 h-[450px] flex flex-col">
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500/20 backdrop-blur-sm text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                    FEATURE #1
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                    <Camera className="text-white" size={40} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      Phân tích Gương mặt AI
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Phân tích tỷ lệ gương mặt cách mạng với xử lý AI thời gian thực
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300">Xử lý Thời gian thực</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-300">Phân tích Tỷ lệ Vàng</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <Button 
                    onClick={() => handleUpload('facial')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg"
                  >
                    Tải ảnh Gương mặt
                  </Button>
                  <Link href="/facial-analysis">
                    <Button className="w-full bg-transparent border border-blue-500 text-blue-300 hover:bg-blue-500/10 font-bold py-2 rounded-xl">
                      Xem Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 2: X-ray Analysis */}
            <div className="group cursor-pointer bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative p-8 h-[450px] flex flex-col">
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500/20 backdrop-blur-sm text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                    FEATURE #2
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-800 to-slate-900 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-2xl overflow-hidden">
                    <img 
                      src="/assets/logo/paranomic_icon.png" 
                      alt="X-ray Panoramic Analysis" 
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      Phân tích X-quang AI
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Phân tích và chẩn đoán X-quang nha khoa tiên tiến bằng AI
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-red-300">Phát hiện Bệnh lý</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-300">Phân loại Răng</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <Button 
                    onClick={() => handleUpload('xray')}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white font-bold py-3 rounded-xl shadow-lg"
                  >
                    Tải ảnh X-quang
                  </Button>
                  <Link href="/xray-analysis">
                    <Button className="w-full bg-transparent border border-blue-500 text-blue-300 hover:bg-blue-500/10 font-bold py-2 rounded-xl">
                      Xem Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3: 3D Simulation */}
            <div className="group cursor-pointer bg-gradient-to-br from-purple-900 to-pink-900 text-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative p-8 h-[450px] flex flex-col">
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-500/20 backdrop-blur-sm text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
                    FEATURE #3
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-2xl overflow-hidden" style={{background: 'linear-gradient(to bottom right, #511ba2, #4c1d95)'}}>
                    <img 
                      src="/assets/logo/3D_icon.png" 
                      alt="3D Simulation" 
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Mô phỏng 3D
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Mô phỏng điều trị 3D tương tác và dự đoán kết quả
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-300">Mô hình 3D</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      <span className="text-pink-300">Xem trước Điều trị</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <Button 
                    onClick={() => handleUpload('3d')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg"
                  >
                    Tải mô hình 3D
                  </Button>
                  <Link href="/model-3d">
                    <Button className="w-full bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-500/10 font-bold py-2 rounded-xl">
                      Xem Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                Ready to Experience the Future?
              </h3>
              <p className="text-gray-300 mb-6">
                Hãy trải nghiệm AI chat và khám phá những tính năng đang được phát triển
              </p>
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold text-lg px-8 py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                  Try AI Chat Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-clinical-800 text-clinical-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
}
