import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex ">
        <Header title="الدورات التدريبية" />
        <h1 className="text-xl font-bold ">this is the home page </h1>
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
