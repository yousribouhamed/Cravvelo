import { SignUpForm } from "@/src/components/forms/sign-up-form";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import SliderShow from "./slider-show";

const page = async ({}) => {
  // const user = await currentUser();

  // if (user) {
  //   redirect("/");
  // }

  return (
    <div className="w-full min-h-screen  h-fit grid grid-cols-3  bg-[#FAFAFA] ">
      <div className="bg-white p-4 ot-8 hidden lg:flex">
        <SliderShow />
      </div>
      <div className=" col-span-3 lg:col-span-2 flex items-center justify-center p-6 ">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
