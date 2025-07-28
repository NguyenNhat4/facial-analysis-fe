import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Xin chào! Tôi là Bác sĩ AI của LeeTray. Tôi sẽ giúp bạn phân tích kết quả và đưa ra kế hoạch điều trị phù hợp. Bạn có câu hỏi gì về kết quả phân tích không?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = [
    "Dựa trên kết quả phân tích gương mặt, góc mũi môi của bạn là 95°, nằm trong khoảng chuẩn (90-110°). Tuy nhiên, độ nhô cằm 4mm cần được điều chỉnh qua phẫu thuật orthognathic.",
    "Từ kết quả X-quang, tôi thấy bạn có 2 răng sâu và 1 răng cần điều trị tủy. Tôi khuyến nghị bắt đầu với điều trị tủy răng số 8, sau đó trám composite cho 2 răng sâu.",
    "Kế hoạch điều trị 18 tháng sẽ bao gồm: Tháng 1-3: Điều trị nội nha, Tháng 4-15: Niềng răng chỉnh nha, Tháng 16-18: Hoàn thiện và theo dõi.",
    "Tỉ lệ vàng hiện tại là 1.6, gần với chuẩn lý tưởng 1.618. Sau niềng răng, tỉ lệ này sẽ được cải thiện lên 1.62, tạo nên gương mặt hài hòa hơn.",
    "Chi phí ước tính cho toàn bộ kế hoạch điều trị là 45-60 triệu VNĐ, bao gồm điều trị nội nha, niềng răng và phẫu thuật chỉnh hình nếu cần.",
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response after 1-2 seconds
    setTimeout(() => {
      const randomResponse = predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
                <Button variant="ghost" size="sm" className="text-clinical-600 hover:text-primary">
                  <ArrowLeft size={20} className="mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-clinical-900">Bác sĩ AI LeeTray</h1>
                <p className="text-xs text-clinical-500">Tư vấn điều trị thông minh</p>
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
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div>
              <h4 className="font-semibold text-green-900">AI Chat đang hoạt động</h4>
              <p className="text-sm text-green-700">Tính năng chat AI cơ bản đã sẵn sàng. Chúng tôi đang phát triển thêm tính năng chuyên sâu về nha khoa.</p>
            </div>
          </div>
        </div>

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
                <h3 className="font-semibold text-clinical-900">Bác sĩ AI LeeTray</h3>
                <p className="text-sm text-clinical-600">Chuyên gia tư vấn điều trị nha khoa</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
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
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-blue-100" : "text-clinical-500"
                        }`}>
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
                          <div className="w-2 h-2 bg-clinical-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-clinical-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-clinical-200 p-4">
              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi về kế hoạch điều trị..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-6"
                >
                  <Send size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("Chi phí điều trị ước tính bao nhiêu?")}
                  className="text-xs"
                >
                  Chi phí điều trị?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("Thời gian điều trị mất bao lâu?")}
                  className="text-xs"
                >
                  Thời gian điều trị?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("Các bước điều trị cụ thể là gì?")}
                  className="text-xs"
                >
                  Các bước điều trị?
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}