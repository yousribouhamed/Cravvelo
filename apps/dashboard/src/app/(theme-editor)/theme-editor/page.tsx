import ThemeEditorBoard from "../_components/theme-editor-board";
import useHaveAccess from "@/src/hooks/use-have-access";
import { getUserThemePages } from "../actions/theme-editor-actions";

const Page = async ({}) => {
  const user = await useHaveAccess();
  const pages = await getUserThemePages({ accountId: user.accountId });

  return <ThemeEditorBoard pages={pages} />;
};

export default Page;
