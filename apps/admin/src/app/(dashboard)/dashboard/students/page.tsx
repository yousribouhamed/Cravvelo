import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import StudentsTableShell from "./students-table-shell";

async function getData(): Promise<Student[]> {
  const data = await prisma.student.findMany({});
  return data;
}

const Page = async ({}) => {
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header title="جميع الطلاب" />
        <StudentsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
