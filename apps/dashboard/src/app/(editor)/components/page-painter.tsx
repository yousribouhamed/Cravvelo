"use client";

import { useMounted } from "@/src/hooks/use-mounted";
import { EditorElement, WebSitePage } from "../../../types";
import { useWebSiteEditor } from "../editor-state";
import Text from "./elements-placeholder/basic/text";
import { useState } from "react";
import Container from "./elements-placeholder/complex/container";
import ButtonPlaceHolder from "./elements-placeholder/basic/button";
import HeaderPlaceholder from "./elements-placeholder/compoent/header-placeholder";
import { components } from "./editor-rightsidebar/add-element-drag-trop";
import { v4 as uuidv4 } from "uuid";
import ProductsPlaceHolder from "./elements-placeholder/compoent/products-placeholder";

function PagePainter() {
  const {
    actions: { getWebPage, addElement },
    state,
  } = useWebSiteEditor();

  const isMounted = useMounted();

  const [isBodySelected, setIsBodySelected] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsBodySelected(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsBodySelected(false);
    }, 5000); // 5000 milliseconds = 5 seconds
  };

  const handleOnDrop = (e: React.DragEvent) => {
    const elementType = e.dataTransfer.getData("elementType");

    const item = components.find((item) => item.type === elementType);
    if (!item) return;

    addElement({
      ...item,
      id: uuidv4(),
      //@ts-ignore
      content: item.content,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!isMounted) {
    return <h1>loading...</h1>;
  }
  const pages = getWebPage();
  return (
    <div
      className="w-fit h-fit"
      draggable
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
    >
      {Array.isArray(pages?.elements) && processComponent(pages?.elements[0])}
    </div>
  );
}

export function processComponent(element: EditorElement) {
  switch (element.type) {
    case "TEXT":
      return <Text element={element} />;
    case "BUTTON":
      return <ButtonPlaceHolder element={element} />;
    case "PRODUCTS":
      return <ProductsPlaceHolder element={element} />;
    case "link":
      return <ButtonPlaceHolder element={element} />;
    case "__body":
      return <Container element={element} />;
    case "2Col":
      return <Container element={element} />;
    case "container":
      return <Container element={element} />;
    case "header":
      return <HeaderPlaceholder element={element} />;
    default:
      <h1>this is not a valid componet</h1>;
  }
}

export default PagePainter;
