import { SignInForm } from "@/src/components/forms/sign-in-form";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

const page = async () => {
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <SignInForm />
    </div>
  );
};

export default page;
