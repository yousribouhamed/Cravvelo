import { ClerkProvider } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] light ">
        {children}
      </div>
    </ClerkProvider>
  );
}
