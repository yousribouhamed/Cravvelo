import Image from "next/image";
import { Button } from "@ui/components/button";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import { Sidebar } from "@/src/components/SideBar";
import Header from "@/src/components/Header";
export default function Home() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex ">
        <Header />
      </main>
    </MaxWidthWrapper>
  );
}
