import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsAppWithMessage } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  whatsappNumber: string;
  suggestedMessage: string;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

const WhatsAppButton = ({
  whatsappNumber,
  suggestedMessage,
  buttonText = "WhatsApp",
  variant = "outline",
  size = "default",
  className = "",
  showIcon = true,
  children,
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    openWhatsAppWithMessage(whatsappNumber, suggestedMessage);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center justify-center gap-2 ${className}`}
      onClick={handleClick}
    >
      {showIcon && <MessageCircle size={18} />}
      {buttonText}
    </Button>
  );
};

export default WhatsAppButton;
