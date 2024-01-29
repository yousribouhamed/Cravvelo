import { ComponentBuilder, WebSitePage } from "../types";

export const pageTemplate = {
  pathname: "/",
  title: "الصفحة الرئيسية",
  components: [
    {
      id: "jsjdbnyetednsmssss",
      name: "شريط الإعلان",
      type: "ANNOUNCEMENTBAR",
      content: [{ text: "مرحبا بكم في أكاديميتنا", name: "كتابة" }],
      style: {
        backgroundColor: "#FFFFFF",
        innerPosition: "CENTER",
        textColor: "#000000",
        textSize: "5px",
        textThoughness: "500",
      },
    },
  ] as ComponentBuilder[],
} satisfies WebSitePage;
