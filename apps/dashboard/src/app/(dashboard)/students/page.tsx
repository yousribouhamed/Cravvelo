import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import StudentsTableShell from "./StudentsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<Student[]> {
  const data = await prisma.student.findMany({
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
        <Header user={user} title="الطلاب" />
        <StudentsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
