"use client";

import type { FC } from "react";
import AnnouncementBar from "./visual-components/announcement-bar";
import Header from "./visual-components/header";
import Hero from "./visual-components/hero";
import EditorLeftbar from "./editor-leftbar";
import EditorRightbar from "./editor-rightbar";
import EditorHeader from "./editor-header";
import React from "react";
import { WebSitePage } from "@/src/types";

const page = {
  pathname: "/",
  title: "الصفحة الرئيسية",
  components: [
    {
      name: "شريط الإعلان",
      type: "ANNOUNCEMENTBAR",
      content: [{ text: "مرحبا بكم في أكاديميتنا", name: "كتابة" }],
      backgroudColor: "",
      textColor: "",
      FontSize: "",
    },
    {
      name: "رأس",
      type: "HEADER",
      content: [{ text: "شعارك", name: "شعارك" }],
      backgroudColor: "",
      textColor: "",
      FontSize: "",
    },
    {
      name: "قسم البطل",
      type: "HERO",
      content: [{ text: "مرحبا بكم في أكاديميتنا" }],
      backgroudColor: "",
      textColor: "",
      FontSize: "",
    },
  ],
};

const EditorBoard: FC = ({}) => {
  const [currentpage, setCurrentPage] = React.useState<WebSitePage>(page);
  return (
    <>
      <EditorHeader />
      <div className="w-full h-full flex ">
        <EditorRightbar page={currentpage} />
        <div className="w-[60%] flex-grow h-full bg-gray-50 p-4">
          <div className="w-full h-full bg-white rounded-md p-1">
            <AnnouncementBar />
            <Header />
            <Hero />
          </div>
        </div>
        <EditorLeftbar page={currentpage} />
      </div>
    </>
  );
};

export default EditorBoard;
