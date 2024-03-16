import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Comment } from "database";
import { prisma } from "database/src";
import CommentsTableShell from "./CommentsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<Comment[]> {
  const data = await prisma.comment.findMany({
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
        <Header user={user} title="التعليقات" />
        <CommentsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
