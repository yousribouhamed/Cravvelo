import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import UserProfile from "@/src/components/auth/user-profile";
import useHaveAccess from "@/src/hooks/use-have-access";
import UserProfileForm from "@/src/components/auth/user-profile";

export default async function Home() {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header user={user} title="الرئيسية" />
        <div className="p-4 ">
          <UserProfileForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
