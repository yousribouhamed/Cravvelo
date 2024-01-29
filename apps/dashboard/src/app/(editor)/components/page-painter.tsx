import { ComponentBuilder, WebSitePage } from "../../../types";
import Text from "./visual-components/Text";
import TitleAndText from "./visual-components/TitleAndText";
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
    case "TITLEANDTEXT":
      return <TitleAndText component={component} />;
    case "TEXT":
      return <Text component={component} />;
    case "HEADER":
      return <Header component={component} />;
    case "HERO":
      return <Hero component={component} />;
    default:
      <h1>this is not a valid componet</h1>;
  }
}

export default PagePainter;
