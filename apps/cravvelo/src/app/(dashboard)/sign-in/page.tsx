import SignInForm from "@/modules/auth/forms/signin-as-admin";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SignInForm redirectTo="/" />
    </div>
  );
}
