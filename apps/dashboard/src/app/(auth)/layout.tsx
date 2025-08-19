import { constructMetadata } from "@/src/lib/utils";

export const metadata = constructMetadata();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex w-full h-screen  bg-[#FAFAFA]  ">{children}</div>;
}
