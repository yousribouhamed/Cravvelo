import EditorBoard from "../components/editor-board";
import useHaveAccess from "@/src/hooks/use-have-access";
import { proccessWebsiteJsonToObject } from "../utils/help-me";
import { getUserPages } from "../actions";

interface pageAbdullahProps {}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const pages = await getUserPages({ accountId: user.accountId });
  console.log("here are the pages of my website");
  console.log(pages);

  return (
    <div className="w-full h-screen overflow-hidden">
      <EditorBoard pages={pages} />
    </div>
  );
};

export default Page;
