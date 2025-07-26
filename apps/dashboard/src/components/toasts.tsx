import toast from "react-hot-toast";
import { AlertTriangle, Check, Info, X } from "lucide-react";

export const maketoast = {
  success: (text?: string) =>
    toast.success(text || "نجاح", {
      style: {
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 16px",
      },
      position: "top-center",
      icon: <Check className="w-5 h-5" />,
    }),

  error: (text?: string) =>
    toast.error(text || "خطأ", {
      style: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 16px",
      },
      position: "top-center",
      icon: <AlertTriangle className="w-5 h-5" />,
    }),

  info: (text?: string) =>
    toast(text || "معلومة", {
      style: {
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 16px",
      },
      position: "top-center",
      icon: <Info className="w-5 h-5" />,
    }),

  warning: (text?: string) =>
    toast(text || "تحذير", {
      style: {
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 16px",
      },
      position: "top-center",
      icon: <AlertTriangle className="w-5 h-5" />,
    }),
};
