import { getMyUserAction } from "@/src/actions/user.actions";
import CreateAcademiaSection from "@/src/modules/analytics/components/create-academia-section";

export default async function Page() {
  const user = await getMyUserAction();

  if (!user.subdomain) {
    return <CreateAcademiaSection />;
  }
  return (
    <div className="w-full h-[500px] ">
      <h1>this is the error page</h1>
    </div>
  );
}
