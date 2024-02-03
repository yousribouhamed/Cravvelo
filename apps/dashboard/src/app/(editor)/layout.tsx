import ViewSwitcher from "./components/view-switcher";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import CustomeThemeProvider from "./providers";

//lg:w-[calc(100%-64px)] lg:mr-[64px]
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomeThemeProvider>
      <div className="flex w-full h-screen  bg-white  dark:bg-[#111111] light ">
        {/* <ViewSwitcher /> */}

        <main className=" w-full   ">{children}</main>
      </div>
    </CustomeThemeProvider>
  );
}
