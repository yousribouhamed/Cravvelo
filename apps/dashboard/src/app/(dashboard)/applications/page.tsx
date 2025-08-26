import AppShell from "@/src/components/app-shell";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";

export const fetchCache = "force-no-store";

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [notifications] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <AppShell user={user} notifications={notifications}>
      <div></div>
    </AppShell>
  );
};

export default Page;
