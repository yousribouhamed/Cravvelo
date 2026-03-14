import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Comment } from "database";
import { prisma } from "database/src";
import CommentsTableShell from "./CommentsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const PAGE_SIZE = 10;

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<{
  comments: Comment[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}> {
  const [comments, totalCount] = await Promise.all([
    prisma.comment.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: 0,
    }),
    prisma.comment.count({ where: { accountId } }),
  ]);
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);
  return { comments, totalCount, pageCount, currentPage: 1 };
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const t = await getServerTranslations("comments");

  const data = await getData({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header notifications={[]} user={user} title={t("pageTitle")} />
        <CommentsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
