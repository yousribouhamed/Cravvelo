import EditorBoard from "../components/editor-board";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";
import { proccessWebsiteJsonToObject } from "../utils/help-me";

interface pageAbdullahProps {}

// i have to get the current website

//
const Page = async ({}) => {
  // const user = await useHaveAccess();

  return (
    <div className="w-full h-screen overflow-hidden">
      <EditorBoard />
    </div>
  );
};

export default Page;
