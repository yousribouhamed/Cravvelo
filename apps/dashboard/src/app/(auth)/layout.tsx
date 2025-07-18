import { constructMetadata } from "@/src/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = constructMetadata();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex w-full h-screen  bg-[#FAFAFA] light ">
        {children}
      </div>
    </ClerkProvider>
  );
}
