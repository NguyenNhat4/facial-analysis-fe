import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
      setTimeout(() => {
        setToast({ show: false, message: "", type: "info" });
      }, 500);
    }, 3000);
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "info" });
  };

  return { toast, showToast, hideToast };
}
