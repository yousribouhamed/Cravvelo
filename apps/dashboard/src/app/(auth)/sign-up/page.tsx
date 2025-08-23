import { SignUpForm } from "@/src/components/forms/sign-up-form";
import SliderShow from "./slider-show";
import PublicPageRestrictionGuard from "@/src/components/guards/page-restriction";

const page = async ({}) => {
  return (
    <PublicPageRestrictionGuard>
      <div className="w-full min-h-screen  h-fit grid grid-cols-3   ">
        <div className="bg-card p-4 ot-8 hidden lg:flex">
          <SliderShow />
        </div>
        <div className=" col-span-3 lg:col-span-2 flex items-center justify-center p-6 ">
          <SignUpForm />
        </div>
      </div>
    </PublicPageRestrictionGuard>
  );
};

export default page;
