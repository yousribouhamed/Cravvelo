import { getAllApps } from "@/modules/apps/actions/apps.actions";

export default async function Page() {
  const apps = await getAllApps();

  return <div className="w-full h-full"></div>;
}
