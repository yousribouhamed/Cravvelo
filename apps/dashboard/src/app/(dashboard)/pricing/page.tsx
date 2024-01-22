import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import UpgradeButton from "@/src/components/upgradeButton";
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
        <div className="w-full h-[200px] rounded-2xl bg-gradient-to-r from- to-pink-600 flex items-center justify-center">
          <h2 className="text-xl font-bold text-white text-center mu-4">
            اختر أفضل خطة لعملك
          </h2>
        </div>
        <UpgradeButton />
      </main>
    </MaxWidthWrapper>
  );
}
