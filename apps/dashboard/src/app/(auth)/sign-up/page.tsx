import { SignUpForm } from "@/src/components/forms/sign-up-form";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({}) => {
  const user = await currentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full min-h-screen  h-fit grid grid-cols-3  bg-[#FAFAFA] ">
      <div className="bg-white  col-span-1 flex justify-between pb-10 items-start flex-col gap-y-4 p-6">
        <div>
          <span>كل شئ في مكان واحد.</span>
          <h2 className="text-2xl font-bold">
            أكثر من +10,000 منصة وصانع محتوى وثقوا في مساق لتحقيق أكثر من +20
            مليون ريال سعودي.
          </h2>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center p-6 ">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
