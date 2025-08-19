import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";

export default async function Page() {
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <MaxWidthWrapper>
      <main>
        <Header notifications={notifications} user={user} title="الرئيسية" />
      </main>
    </MaxWidthWrapper>
  );
}
