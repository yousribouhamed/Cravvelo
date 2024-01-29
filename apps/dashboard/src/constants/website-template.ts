import { ComponentBuilder, WebSitePage } from "../types";
import { v4 as uuidv4 } from "uuid";

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

// here we need to create a start with shape

export const getVirtualComponent = ({ type }: { type: string }) => {
  const id = uuidv4();

  switch (type) {
    case "ANNOUNCEMENTBAR":
      return {
        id,
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
      };

    case "HEADER":
      return {
        id,
        name: "رأس",
        type: "HEADER",
        content: [{ text: "شعارك", name: "شعارك" }],
        style: {
          backgroundColor: "#FFFFFF",
          innerPosition: "CENTER",
          textColor: "#000000",
          textSize: "5px",
          textThoughness: "500",
        },
      };
    case "HERO":
      return {
        id,
        name: "قسم البطل",
        type: "HERO",
        content: [{ text: "مرحبا بكم في أكاديميتنا" }],
        style: {
          backgroundColor: "#FFFFFF",
          innerPosition: "CENTER",
          textColor: "#000000",
          textSize: "5px",
          textThoughness: "500",
        },
      };
    case "TEXT":
      return {
        id,
        name: "نص",
        type: "TEXT",
        content: [{ text: "إلى أي مدى يمكن أن نصل" }],
        style: {
          backgroundColor: "#FFFFFF",
          innerPosition: "CENTER",
          textColor: "#000000",
          textSize: "5px",
          textThoughness: "500",
        },
      };
    case "TITLEANDTEXT":
      return {
        id,
        name: "العنوان والنص",
        type: "TITLEANDTEXT",
        content: [
          { text: "إلى أي مدى يمكن أن نصل" },
          { text: "إلى أي مدى يمكن أن نصل" },
        ],
        style: {
          backgroundColor: "#FFFFFF",
          innerPosition: "CENTER",
          textColor: "#000000",
          textSize: "5px",
          textThoughness: "500",
        },
      };
    default:
      return {};
  }
};
