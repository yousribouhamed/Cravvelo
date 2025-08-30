import { AppType } from "../types";
import EmptyBox from "./empty-box";
import AppCard from "./app-card";

interface PageProps {
  apps: AppType[];
}

export default function ApplicationsBoard({ apps }: PageProps) {
  if (!apps || apps?.length === 0) {
    return (
      <div className="w-full h-fit min-h-[300px] flex items-center justify-center">
        <EmptyBox />
      </div>
    );
  }

  return (
    <>
      <div className={"w-full h-[100px] flex items-center justify-start "}>
        <h2 className={"text-2xl font-bold"}>قم باظافة التطبيقات الى متجرك</h2>
      </div>

      <div
        className="w-full h-fit min-h-[300px] grid grid-cols-1 md:grid-cols-2 gap-4"
        dir="rtl"
      >
        {apps.map((item) => (
          <AppCard key={item.id} app={item} />
        ))}
      </div>
    </>
  );
}
