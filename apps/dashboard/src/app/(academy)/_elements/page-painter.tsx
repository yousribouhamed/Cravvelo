import { EditorElement, WebSitePage } from "../../../types";
import ButtonPlaceHolderProduction from "./button";
import ContainerPlaceHolderProduction from "./container";
import TextPlaceHolderProduction from "./text";

interface PagePainterProps {
  page: WebSitePage;
}

function PagePainterProduction({ page }: PagePainterProps) {
  return (
    <div className="w-fit h-fit">
      {Array.isArray(page?.elements) &&
        processComponentProduction(page?.elements[0])}
    </div>
  );
}

export function processComponentProduction(element: EditorElement) {
  switch (element.type) {
    case "TEXT":
      return <TextPlaceHolderProduction element={element} />;
    case "BUTTON":
      return <ButtonPlaceHolderProduction element={element} />;
    case "link":
      return <ButtonPlaceHolderProduction element={element} />;
    case "__body":
      return <ContainerPlaceHolderProduction element={element} />;
    case "2Col":
      return <ContainerPlaceHolderProduction element={element} />;
    case "container":
      return <ContainerPlaceHolderProduction element={element} />;
    case "header":
      return <ContainerPlaceHolderProduction element={element} />;
    default:
      <h1>this is not a valid componet</h1>;
  }
}

export default PagePainterProduction;
