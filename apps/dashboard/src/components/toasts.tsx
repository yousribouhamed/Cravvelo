import toast from "react-hot-toast";
import { AlertTriangle, Check, Info, X, AlertCircle } from "lucide-react";

// Check if dark mode is enabled
const isDarkMode = () => {
  if (typeof window !== "undefined") {
    return (
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }
  return false;
};

// Supabase-inspired color palette
const colors = {
  light: {
    success: {
      background: "#f0f9f4", // green-50
      border: "#d1fae5", // green-200
      text: "#166534", // green-800
      icon: "#10b981", // green-500
    },
    error: {
      background: "#fef2f2", // red-50
      border: "#fecaca", // red-200
      text: "#991b1b", // red-800
      icon: "#ef4444", // red-500
    },
    warning: {
      background: "#fffbeb", // amber-50
      border: "#fed7aa", // amber-200
      text: "#92400e", // amber-800
      icon: "#f59e0b", // amber-500
    },
    info: {
      background: "#eff6ff", // blue-50
      border: "#bfdbfe", // blue-200
      text: "#1e40af", // blue-800
      icon: "#3b82f6", // blue-500
    },
  },
  dark: {
    success: {
      background: "#0f1a14", // dark green
      border: "#1f2937", // gray-800
      text: "#34d399", // green-400
      icon: "#10b981", // green-500
    },
    error: {
      background: "#1a0f0f", // dark red
      border: "#1f2937", // gray-800
      text: "#f87171", // red-400
      icon: "#ef4444", // red-500
    },
    warning: {
      background: "#1a1611", // dark amber
      border: "#1f2937", // gray-800
      text: "#fbbf24", // amber-400
      icon: "#f59e0b", // amber-500
    },
    info: {
      background: "#0f1419", // dark blue
      border: "#1f2937", // gray-800
      text: "#60a5fa", // blue-400
      icon: "#3b82f6", // blue-500
    },
  },
};

// Get theme-appropriate colors
const getColors = (type: keyof typeof colors.light) => {
  const theme = isDarkMode() ? colors.dark : colors.light;
  return theme[type];
};

// Base toast style
const getBaseStyle = (type: keyof typeof colors.light) => {
  const themeColors = getColors(type);
  return {
    background: themeColors.background,
    color: themeColors.text,
    border: `1px solid ${themeColors.border}`,
    borderRadius: "12px",
    padding: "16px 20px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: isDarkMode()
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(8px)",
    maxWidth: "420px",
    minWidth: "300px",
    direction: "rtl" as const,
    textAlign: "right" as const,
  };
};

// Custom toast component with close button
const ToastContent = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: keyof typeof colors.light;
  onClose: () => void;
}) => {
  const themeColors = getColors(type);
  const IconComponent = {
    success: Check,
    error: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className="flex items-center justify-between gap-3" dir="rtl">
      <div className="flex items-center gap-3">
        <IconComponent
          className="w-5 h-5 flex-shrink-0"
          style={{ color: themeColors.icon }}
        />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        style={{ color: themeColors.text }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const maketoast = {
  success: (text?: string) => {
    const message = text || "نجاح";
    return toast.custom(
      (t) => (
        <div style={getBaseStyle("success")}>
          <ToastContent
            message={message}
            type="success"
            onClose={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: 4000,
        position: "top-left",
      }
    );
  },

  successWithText: ({ text }: { text: string }) => {
    return toast.custom(
      (t) => (
        <div style={getBaseStyle("success")}>
          <ToastContent
            message={text}
            type="success"
            onClose={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: 4000,
        position: "top-left",
      }
    );
  },

  error: (text?: string) => {
    const message = text || "خطأ";
    return toast.custom(
      (t) => (
        <div style={getBaseStyle("error")}>
          <ToastContent
            message={message}
            type="error"
            onClose={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: 5000,
        position: "top-left",
      }
    );
  },

  errorWithText: ({ text }: { text: string }) => {
    return toast.custom(
      (t) => (
        <div style={getBaseStyle("error")}>
          <ToastContent
            message={text}
            type="error"
            onClose={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: 5000,
        position: "top-left",
      }
    );
  },

  info: (text?: string) => {
    const message = text || "معلومة";
    return toast.custom(
      (t) => (
        <div style={getBaseStyle("info")}>
          <ToastContent
            message={message}
            type="info"
            onClose={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: 4000,
        position: "top-left",
      }
    );
  },

  warning: (text?: string) => {
    const message = text || "تحذير";
    return toast.custom(
      (t) => (
        <div style={getBaseStyle("warning")}>
          <ToastContent
            message={message}
            type="warning"
            onClose={() => toast.dismiss(t.id)}
          />
        </div>
      ),
      {
        duration: 5000,
        position: "top-left",
      }
    );
  },

  // Utility method to dismiss all toasts
  dismissAll: () => toast.dismiss(),

  // Loading toast
  loading: (text?: string) => {
    const message = text || "جاري التحميل...";
    return toast.loading(message, {
      style: getBaseStyle("info"),
      position: "top-left",
    });
  },

  // Promise-based toast
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: getBaseStyle("info"),
        position: "top-left",
        success: {
          style: getBaseStyle("success"),
          duration: 4000,
        },
        error: {
          style: getBaseStyle("error"),
          duration: 5000,
        },
      }
    );
  },
};
