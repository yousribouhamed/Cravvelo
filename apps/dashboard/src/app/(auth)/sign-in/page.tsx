import { SignInForm } from "@/src/components/forms/sign-in-form";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA] justify-center p-4 md:p-0">
      <SignInForm />
    </div>
  );
};

export default page;
