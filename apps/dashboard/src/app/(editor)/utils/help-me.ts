import { WebSitePage } from "@/src/types";
import { ServerContextJSONValue } from "react";

export const proccessWebsiteJsonToObject = ({ pages }: { pages: any }) => {
  const newPages = JSON.parse(pages as unknown as string) as WebSitePage[];

  return [...newPages];
};
