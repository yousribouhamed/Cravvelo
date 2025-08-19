import { SignInForm } from "@/src/components/forms/sign-in-form";
import PublicPageRestrictionGuard from "@/src/components/guards/page-restriction";

const page = async () => {
  return (
    <PublicPageRestrictionGuard>
      <div className="w-full h-screen flex items-center justify-center ">
        <SignInForm />
      </div>
    </PublicPageRestrictionGuard>
  );
};

export default page;
