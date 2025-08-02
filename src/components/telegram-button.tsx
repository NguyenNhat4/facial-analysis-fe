import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface TelegramButtonProps {
  children?: ReactNode;
  botUsername?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "floating" | "inline";
}

export function TelegramButton({
  children,
  botUsername = "AnsiudeptraiBot",
  className = "",
  size = "default",
  variant = "inline",
}: TelegramButtonProps) {
  const handleClick = () => {
    const url = `https://t.me/${botUsername}`;
    window.open(url, "_blank");
  };

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={handleClick}
          size={size}
          className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        >
          <Send size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      className={`bg-[#0088cc] hover:bg-[#0088cc]/90 text-white ${className}`}
    >
      <Send
        size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
        className="mr-2"
      />
      {children || "Telegram Bot"}
    </Button>
  );
}

export default TelegramButton;
