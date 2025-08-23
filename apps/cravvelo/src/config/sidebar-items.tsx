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
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    name: "Payments",
    slug: "/payments",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    name: "Apps",
    slug: "/apps",
    icon: <AppWindow className="w-6 h-6" />,
  },
  {
    name: "Users",
    slug: "/users",
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: "Admins",
    slug: "/admins",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    name: "Analytics",
    slug: "/analytics",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    name: "Support",
    slug: "/support",
    icon: <LifeBuoy className="w-6 h-6" />,
  },
  {
    name: "Security",
    slug: "/security",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    name: "Feature Flags",
    slug: "/flags",
    icon: <Flag className="w-6 h-6" />,
  },
  {
    name: "Settings",
    slug: "/settings",
    icon: <Settings className="w-6 h-6" />,
  },
];
