import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Course } from "database";
import { prisma } from "database/src";
import CoursesTableShell from "./courses-table-shell";

export const fetchCache = "force-no-store";

async function getData(): Promise<Course[]> {
  const data = await prisma.course.findMany({});
  return data;
}

const Page = async ({}) => {
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header title="الدورات التدريبية" />
        <CoursesTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
