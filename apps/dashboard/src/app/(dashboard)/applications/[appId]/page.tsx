import AppShell from "@/src/components/app-shell";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import ApplicationsBoard from "@/src/modules/apps/components/applications-board";
import { getAllApps } from "@/src/modules/apps/actions/apps.actions";

export const fetchCache = "force-no-store";

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [notifications, appsData] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),

    getAllApps(),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <AppShell
      title={"متجر التطبيقات"}
      user={user}
      notifications={notifications}
    >
      <ApplicationsBoard apps={appsData.data} />
    </AppShell>
  );
};

export default Page;
