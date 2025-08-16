import LoginForm from "@/modules/auth/forms/signin-form";

export default function page() {
  return (
    <div className="min-h-screen  flex items-start justify-center py-8">
      <LoginForm />
    </div>
  );
}
