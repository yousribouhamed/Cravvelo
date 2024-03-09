import { Home, Settings, Sparkles, User, Activity } from "lucide-react";

export const sidebar_item = [
  {
    name: "home",
    url: "/",
    icon: () => <Home className="w-4 h-4 text-white" />,
  },
  {
    name: "users",
    url: "/users",
    icon: () => <User className="w-4 h-4 text-white" />,
  },
  {
    name: "content",
    url: "/content",
    icon: () => <Sparkles className="w-4 h-4 text-white" />,
  },
  {
    name: "websites",
    url: "/websites",
    icon: () => <Activity className="w-4 h-4 text-white" />,
  },
  {
    name: "settings",
    url: "/settings",
    icon: () => <Settings className="w-4 h-4 text-white" />,
  },
];
