"use client";

import { ScrollArea } from "@ui/components/ui/scroll-area";
import type { FC } from "react";
import ThemeHeader from "./theme-components/theme-header";
import { ComponentBuilder, useThemeEditorStore } from "../theme-editor-store";
import { ComponentsList } from "./theme-editor-rightbar/components-list";
import { v4 as uuidv4 } from "uuid";
import ThemeCollection from "./theme-components/theme-collection";
import ThemeHeading from "./theme-components/theme-heading";
import ThemeFooter from "./theme-components/theme-footer";
import ThemeSignup from "./theme-components/theme-signup";
import ThemeSignin from "./theme-components/theme-signin";

interface PagePainterProps {}

const PagePainter: FC = ({}) => {
  const { state } = useThemeEditorStore();

  const addComponent = useThemeEditorStore((state) => state.actions.updatePage);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const componetType = e.dataTransfer.getData("componetType");

    const item = ComponentsList.find((item) => item.type === componetType);
    if (!item) return;

    addComponent({
      id: uuidv4(),
      name: item.name,
      type: item.type,
    });
  };

  return (
    <ScrollArea className="w-[80%] flex-grow   h-full bg-gray-100 p-4 ">
      <div
        onDrop={handleOnDrop}
        onDragOver={handleDragOver}
        className={`${
          state.viewMode === "DESKTOP"
            ? "w-[1000px]"
            : state.viewMode === "MOBILE"
            ? "w-[450px]"
            : "w-full"
        } min-h-[2000px] bg-white border rounded-xl mx-auto flex flex-col justify-start transition-all duration-500`}
      >
        {Array.isArray(state.pages[state.currentPageIndex].components) &&
          state.pages[state.currentPageIndex].components.map((item) => (
            <>{renderBuilderComponent({ components: item })}</>
          ))}
      </div>
    </ScrollArea>
  );
};

export default PagePainter;

export const renderBuilderComponent = ({
  components,
}: {
  components: ComponentBuilder;
}) => {
  switch (components.type) {
    case "header":
      return <ThemeHeader />;
    case "footer":
      return <ThemeFooter />;
    case "collection":
      return <ThemeHeading />;
    case "heading":
      return <ThemeCollection />;
    case "signupform":
      return <ThemeSignup />;
    case "signinform":
      return <ThemeSignin />;
    default:
      return <h1>this compoent does&apos;t exists</h1>;
  }
};
