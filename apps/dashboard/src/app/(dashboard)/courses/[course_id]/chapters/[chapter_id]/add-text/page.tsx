import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import AddTextForm from "@/src/components/forms/course-forms/add-text-form";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";

export default async function Home() {
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title="اظافة نص "
        />
        <div className="w-full pt-8 min-h-[100px] ">
          <AddTextForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
