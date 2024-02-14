import MaxWidthWrapper from "@/src/components/max-width-wrapper";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen overflow-hidden  bg-white  light ">
      {/* <ViewSwitcher /> */}

      <main className=" w-full h-full  ">{children}</main>
    </div>
  );
}
