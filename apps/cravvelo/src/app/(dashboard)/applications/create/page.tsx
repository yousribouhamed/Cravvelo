import Header from "@/components/header";
import CreateAppForm from "@/modules/apps/pages/create-app";

export default function Page() {
  return (
    <div className="w-full h-screen">
      <Header backTo="/applications" title="Create New App" />
      <CreateAppForm />
    </div>
  );
}
