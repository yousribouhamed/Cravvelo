import { getAllApps } from "@/modules/apps/actions/apps.actions";
import AppsListingPage from "@/modules/apps/pages/apps-listing";

export default async function Page() {
  const response = await getAllApps({});

  if (response.success) {
    return <AppsListingPage data={response.data?.apps ?? []} />;
  } else {
    <div className="w-full h-[40px] bg-card rounded-2xl border p-6">
      <h1>something went wrong sorry ry again later</h1>
    </div>;
  }
}
