import { SignInForm } from "@/src/components/forms/sign-in-form";

export default function page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignInForm />
    </main>
  );
}
