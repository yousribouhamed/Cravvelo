import { ComponentBuilder, WebSitePage } from "../../../types";
import AnnouncementBar from "./visual-components/announcement-bar";
import Header from "./visual-components/header";
import Hero from "./visual-components/hero";

interface PagePainterProps {
  page: WebSitePage;
}

function PagePainter({ page }: PagePainterProps) {
  return (
    <div className="w-full h-fit min-h-[300px] bg-white max-w-[1500px]">
      {page.components.map((item, index) => processComponent(item))}
    </div>
  );
}

function processComponent(component: ComponentBuilder) {
  switch (component.type) {
    case "ANNOUNCEMENTBAR":
      return <AnnouncementBar component={component} />;
    case "HEADER":
      return <div>comming soon</div>;
    case "HERO":
      return <div>comming soon</div>;
    default:
      <h1>this is not a valid componet</h1>;
  }
}

export default PagePainter;
