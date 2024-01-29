import type { FC } from "react";
import EditorHeader from "../components/editor-header";
import EditorBoard from "../components/editor-board";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";
import { proccessWebsiteJsonToObject } from "../utils/help-me";

interface pageAbdullahProps {}

// i have to get the current website

const getUserWebsite = async ({ accountId }: { accountId: string }) => {
  const website = await prisma.website.findFirst({ where: { accountId } });

  return website;
};

//
const Page = async ({}) => {
  const { account } = await useHaveAccess();

  const website = await getUserWebsite({ accountId: account.id });

  const pages = proccessWebsiteJsonToObject({ pages: website.pages });

  console.log(pages);
  return <EditorBoard />;
};

export default Page;
