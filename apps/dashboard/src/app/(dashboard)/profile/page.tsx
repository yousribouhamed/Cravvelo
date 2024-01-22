import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import UserProfile from "@/src/components/auth/user-profile";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  console.log(user);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header user={user} title="الرئيسية" />
        <UserProfile />
      </main>
    </MaxWidthWrapper>
  );
}
