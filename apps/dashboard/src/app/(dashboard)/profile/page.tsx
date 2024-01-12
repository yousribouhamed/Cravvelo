import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
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
        <div className="w-full h-[500px] flex items-center justify-center">
          <h1 className="text-4xl font-bold ">this is your profile page </h1>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
