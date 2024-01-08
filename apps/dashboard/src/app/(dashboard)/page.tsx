import Image from "next/image";
import { Button } from "@ui/components/button";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import { Sidebar } from "@/src/components/SideBar";
import Header from "@/src/components/Header";
import { prisma } from "database/src/index";

export default async function Home() {
  const data = await prisma.user.findMany();

  console.log("here it is your data ");
  console.log(data);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex ">
        <Header />
      </main>
    </MaxWidthWrapper>
  );
}
