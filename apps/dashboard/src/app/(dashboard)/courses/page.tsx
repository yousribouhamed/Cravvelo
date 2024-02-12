import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { Course } from "database";
import { prisma } from "database/src";
import CoursesTableShell from "./courses-table-shell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<Course[]> {
  const data = await prisma.course.findMany({
    where: {
      accountId,
    },
  });
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData({ accountId: user.accountId });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الدورات التدريبية" />
        <CoursesTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
