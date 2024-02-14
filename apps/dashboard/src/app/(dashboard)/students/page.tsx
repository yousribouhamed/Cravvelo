import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import StudentsTableShell from "./StudentsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData(): Promise<Student[]> {
  const data = await prisma.student.findMany();
  return data;
}

const Page = async ({}) => {
  // const user = await useHaveAccess();
  // const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        {/* @ts-ignore */}
        <Header user={{}} title="الطلاب" />
        <StudentsTableShell initialData={[]} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
