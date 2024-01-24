import ViewSwitcher from "./components/view-switcher";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen  bg-white overflow-hidden ">
      <ViewSwitcher />

      <main className=" w-full lg:w-[calc(100%-64px)] lg:mr-[64px]   ">
        {children}
      </main>
    </div>
  );
}
