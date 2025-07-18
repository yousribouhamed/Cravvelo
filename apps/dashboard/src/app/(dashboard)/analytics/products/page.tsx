import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Course } from "database";
import { prisma } from "database/src";
import CoursesTableShell from "./ProductsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData(): Promise<Course[]> {
  const data = await prisma.course.findMany();
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={[]} user={user} title=" المنتجات" />
        <CoursesTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
