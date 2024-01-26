import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { Course } from "database";
import { columns } from "@/src/components/data-table/columns/courses";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "database/src";
import { redirect } from "next/navigation";
import CoursesTableShell from "./courses-table-shell";

async function getData(): Promise<Course[]> {
  const data = await prisma.course.findMany();
  return data;
}

const page = async ({}) => {
  const data = await getData();

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الدورات التدريبية" />
        <CoursesTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
