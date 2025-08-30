import { AppType } from "../types";
import { Card, CardContent, CardFooter } from "@ui/components/ui/card";
import InstallAppModal from "./install-app-modal";

interface Props {
  app: AppType;
}

export default function AppCard({ app }: Props) {
  return (
    <Card
      className="w-full h-[200px] rounded-xl shadow border flex flex-col  p-4 gap-3"
      dir="rtl"
    >
      <div className="flex items-between w-full justify-between gap-3">
        <div className="flex items-start gap-x-2">
          <img
            src={app.logoUrl ?? "/placeholder.png"}
            alt={app.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{app.name}</h2>
            <span className="text-xs text-gray-500">
              {app.installsCount.toLocaleString()} تثبيت
            </span>
          </div>
        </div>
        <InstallAppModal appId={app.id} />
      </div>

      <CardContent className="p-0 text-lg text-gray-700 dark:text-gray-50">
        {app.shortDesc}
      </CardContent>
    </Card>
  );
}
