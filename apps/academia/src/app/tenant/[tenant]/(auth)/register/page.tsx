import SignUpForm from "@/modules/auth/forms/signup-form";

export default function page() {
  return (
    <div className="min-h-screen  flex items-start justify-center py-8">
      <SignUpForm />
    </div>
  );
}
