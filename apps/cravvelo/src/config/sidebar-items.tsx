import {
  LayoutDashboard,
  CreditCard,
  AppWindow,
  Users,
  ShieldCheck,
  BarChart3,
  LifeBuoy,
  Shield,
  Flag,
  Settings,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    slug: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
    enabled: true,
  },
  {
    name: "Payments",
    slug: "/payments",
    icon: <CreditCard className="w-5 h-5" />,
    enabled: true,
  },
  {
    name: "Apps",
    slug: "/applications",
    icon: <AppWindow className="w-5 h-5" />,
    enabled: true,
  },
  {
    name: "Users",
    slug: "/users",
    icon: <Users className="w-5 h-5" />,
    enabled: true,
  },
  {
    name: "Admins",
    slug: "/admins",
    icon: <ShieldCheck className="w-5 h-5" />,
    enabled: false,
  },
  {
    name: "Analytics",
    slug: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    enabled: false,
  },
  {
    name: "Support",
    slug: "/support",
    icon: <LifeBuoy className="w-5 h-5" />,
    enabled: false,
  },
  {
    name: "Security",
    slug: "/security",
    icon: <Shield className="w-5 h-5" />,
    enabled: false,
  },
  {
    name: "Feature Flags",
    slug: "/flags",
    icon: <Flag className="w-5 h-5" />,
    enabled: false,
  },
  {
    name: "Settings",
    slug: "/settings",
    icon: <Settings className="w-5 h-5" />,
    enabled: false,
  },
];
