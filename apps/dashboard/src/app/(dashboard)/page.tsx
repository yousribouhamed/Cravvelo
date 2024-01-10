import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import Header from "@/src/components/Header";

export default async function Home() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header title="الدورات التدريبية" />
        <div className="w-full h-[500px] flex items-center justify-center">
          <h1 className="text-4xl font-bold ">this is the home page </h1>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
