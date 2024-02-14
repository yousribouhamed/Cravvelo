import { Sidebar } from "@/src/components/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] light ">
        <Sidebar className="  lg:block lg:w-[250px] lg:fixed right-5  top-0  bottom-0 " />

        <main className=" w-full lg:w-[calc(100%-250px)] lg:mr-[250px]  px-10 ">
          {children}
        </main>
        {/* <SubscripeButton /> */}
      </div>
      <Script src="//code.tidio.co/f4ntqdkrkcmkov2pbgapiuevig4fhtbq.js" async />
    </ClerkProvider>
  );
}
