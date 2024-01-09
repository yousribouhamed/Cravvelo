import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import CoursesShell, { Payment } from "@/src/components/shells/CoursesShell";
import type { FC } from "react";

interface pageAbdullahProps {}

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

const page = async ({}) => {
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header title="الدورات التدريبية" />
        <CoursesShell data={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
