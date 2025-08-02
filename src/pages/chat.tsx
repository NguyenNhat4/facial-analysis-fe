import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, ArrowLeft, Image, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TelegramButton from "@/components/telegram-button";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  hasImage?: boolean;
  filename?: string;
  imagePreview?: string; // Base64 data URL for image preview
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API Service functions
const chatbotAPI = {
  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<{ reply: string; sessionId: string }> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async sendImageWithMessage(
    file: File,
    message?: string,
    sessionId?: string
  ): Promise<{ reply: string; sessionId: string; filename: string }> {
    const formData = new FormData();
    formData.append("image", file);
    if (message) formData.append("message", message);
    if (sessionId) formData.append("sessionId", sessionId);

    const response = await fetch(`${API_BASE_URL}/chat/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async generateNewSession(): Promise<{ sessionId: string }> {
    const response = await fetch(`${API_BASE_URL}/memory/session/new`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getConversationHistory(sessionId: string): Promise<{ history: any[] }> {
    const response = await fetch(
      `${API_BASE_URL}/memory/session/${sessionId}/history`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Xin chào! Tôi là Bác sĩ AI của LeeTray. Tôi sẽ giúp bạn phân tích kết quả và đưa ra kế hoạch điều trị phù hợp. Bạn có câu hỏi gì về kết quả phân tích không?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize session and check API connection
  useEffect(() => {
    const initializeChat = async () => {
      const enableApiCheck = import.meta.env.VITE_ENABLE_API_CHECK !== "false";

      if (!enableApiCheck) {
        setIsConnected(false);
        setApiError("API connection check disabled. Using demo mode.");
        return;
      }

      try {
        // Check if API is running
        const healthResponse = await fetch(
          `${API_BASE_URL.replace("/api", "")}/health`
        );
        if (healthResponse.ok) {
          setIsConnected(true);
          setApiError("");

          // Generate new session
          const sessionResponse = await chatbotAPI.generateNewSession();
          setSessionId(sessionResponse.sessionId);
        } else {
          throw new Error("API not responding");
        }
      } catch (error) {
        console.error("Failed to connect to API:", error);
        setIsConnected(false);
        setApiError(
          "Không thể kết nối đến server AI. Đang sử dụng chế độ demo."
        );
      }
    };

    initializeChat();
  }, []);

  // Fallback responses for demo mode
  const predefinedResponses = [
    "Dựa trên kết quả phân tích gương mặt, góc mũi môi của bạn là 95°, nằm trong khoảng chuẩn (90-110°). Tuy nhiên, độ nhô cằm 4mm cần được điều chỉnh qua phẫu thuật orthognathic.",
    "Từ kết quả X-quang, tôi thấy bạn có 2 răng sâu và 1 răng cần điều trị tủy. Tôi khuyến nghị bắt đầu với điều trị tủy răng số 8, sau đó trám composite cho 2 răng sâu.",
    "Kế hoạch điều trị 18 tháng sẽ bao gồm: Tháng 1-3: Điều trị nội nha, Tháng 4-15: Niềng răng chỉnh nha, Tháng 16-18: Hoàn thiện và theo dõi.",
    "Tỉ lệ vàng hiện tại là 1.6, gần với chuẩn lý tưởng 1.618. Sau niềng răng, tỉ lệ này sẽ được cải thiện lên 1.62, tạo nên gương mặt hài hòa hơn.",
    "Chi phí ước tính cho toàn bộ kế hoạch điều trị là 45-60 triệu VNĐ, bao gồm điều trị nội nha, niềng răng và phẫu thuật chỉnh hình nếu cần.",
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setApiError("Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP, BMP)");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setApiError("Kích thước file không được vượt quá 10MB");
        return;
      }

      setSelectedFile(file);
      setApiError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    // Create image preview if file is selected
    let imagePreview: string | undefined;
    if (selectedFile) {
      imagePreview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: selectedFile ? `${inputMessage || "Đã gửi ảnh"}` : inputMessage,
      sender: "user",
      timestamp: new Date(),
      hasImage: !!selectedFile,
      filename: selectedFile?.name,
      imagePreview: imagePreview,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setApiError("");

    try {
      let response;

      if (isConnected) {
        // Use real API
        if (selectedFile) {
          response = await chatbotAPI.sendImageWithMessage(
            selectedFile,
            inputMessage || undefined,
            sessionId
          );
        } else {
          response = await chatbotAPI.sendMessage(inputMessage, sessionId);
        }

        // Update session ID if new one was generated
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.reply,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Fallback to demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const randomResponse =
          predefinedResponses[
            Math.floor(Math.random() * predefinedResponses.length)
          ];
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setApiError("Lỗi khi gửi tin nhắn. Vui lòng thử lại.");

      // Fallback to demo response on error
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ với đội ngũ hỗ trợ.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
      setSelectedFile(null);
      setSelectedFilePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-clinical-900">
                  Bác sĩ AI LeeTray
                </h1>
                <p className="text-xs text-clinical-500">
                  Tư vấn điều trị thông minh
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice for Chat */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isConnected ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              <span className="text-white text-sm">
                {isConnected ? "🤖" : "⚠️"}
              </span>
            </div>
            <div>
              <h4
                className={`font-semibold ${
                  isConnected ? "text-green-900" : "text-yellow-900"
                }`}
              >
                {isConnected ? "AI Chat đang hoạt động" : "Chế độ Demo"}
              </h4>
              <p
                className={`text-sm ${
                  isConnected ? "text-green-700" : "text-yellow-700"
                }`}
              >
                {isConnected
                  ? "Kết nối thành công với Dental AI API. Hỗ trợ phân tích ảnh X-quang và tư vấn nha khoa."
                  : "API chưa khởi động. Đang sử dụng câu trả lời mẫu. Vui lòng khởi động server backend."}
              </p>
            </div>
          </div>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {apiError}
            </AlertDescription>
          </Alert>
        )}

        <Card className="h-[700px] flex flex-col">
          <CardHeader className="bg-medical-blue-50 border-b border-clinical-200">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" />
                <AvatarFallback>
                  <Bot size={20} className="text-primary" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-clinical-900">
                  Bác sĩ AI LeeTray
                </h3>
                <p className="text-sm text-clinical-600">
                  Chuyên gia tư vấn điều trị nha khoa
                </p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <TelegramButton
                size="sm"
                botUsername="your_bot_username"
                className="ml-2"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {message.sender === "ai" ? (
                          <>
                            <AvatarImage src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" />
                            <AvatarFallback>
                              <Bot size={16} className="text-primary" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback>
                            <User size={16} className="text-clinical-600" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-primary text-white"
                            : "bg-clinical-100 text-clinical-900"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>

                        {/* Display image preview if available */}
                        {message.hasImage && message.imagePreview && (
                          <div className="mt-3">
                            <img
                              src={message.imagePreview}
                              alt={message.filename || "Uploaded image"}
                              className="max-w-full max-h-48 rounded-lg border border-opacity-20 border-white object-contain"
                            />
                            {message.filename && (
                              <div className="flex items-center mt-2 text-xs opacity-70">
                                <Image size={12} className="mr-1" />
                                {message.filename}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Fallback for messages with image but no preview */}
                        {message.hasImage &&
                          !message.imagePreview &&
                          message.filename && (
                            <div className="flex items-center mt-2 text-xs opacity-70">
                              <Image size={12} className="mr-1" />
                              {message.filename}
                            </div>
                          )}

                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-clinical-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" />
                        <AvatarFallback>
                          <Bot size={16} className="text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-clinical-100 rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-clinical-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-clinical-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-clinical-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-clinical-200 p-4">
              {/* File Upload Section */}
              {selectedFile && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    {/* Image Preview */}
                    {selectedFilePreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={selectedFilePreview}
                          alt={selectedFile.name}
                          className="w-16 h-16 rounded object-cover border border-blue-300"
                        />
                      </div>
                    )}

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Image
                          size={16}
                          className="text-blue-600 flex-shrink-0"
                        />
                        <span className="text-sm text-blue-800 truncate">
                          {selectedFile.name}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        {Math.round(selectedFile.size / 1024)}KB
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setSelectedFilePreview("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedFile
                      ? "Mô tả về ảnh (tùy chọn)..."
                      : "Nhập câu hỏi về kế hoạch điều trị..."
                  }
                  className="flex-1"
                />

                {/* File Upload Button */}
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTyping}
                  className="px-3"
                >
                  <Image size={16} />
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && !selectedFile) || isTyping}
                  className="px-6"
                >
                  <Send size={16} />
                </Button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage("Chi phí điều trị ước tính bao nhiêu?")
                  }
                  className="text-xs"
                  disabled={isTyping}
                >
                  Chi phí điều trị?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage("Thời gian điều trị mất bao lâu?")
                  }
                  className="text-xs"
                  disabled={isTyping}
                >
                  Thời gian điều trị?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage("Các bước điều trị cụ thể là gì?")
                  }
                  className="text-xs"
                  disabled={isTyping}
                >
                  Các bước điều trị?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInputMessage("Phân tích ảnh X-quang này giúp tôi")
                  }
                  className="text-xs"
                  disabled={isTyping}
                >
                  Phân tích X-quang
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Telegram Button */}
      <TelegramButton variant="floating" botUsername="your_bot_username" />
    </div>
  );
}
