import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import Header from "@/src/components/Header";

export default async function Home() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex ">
        <Header />
      </main>
    </MaxWidthWrapper>
  );
}
