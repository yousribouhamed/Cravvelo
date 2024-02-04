import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";
import { processComponent } from "../../page-painter";
import { Button } from "@ui/components/ui/button";
import ShoppingCardPlaceholder from "./shoping-card";
import { Search } from "lucide-react";
import ButtonPlaceHolder from "../basic/button";

interface ElementProps {
  element: EditorElement;
}

const HeaderPlaceholder: FC<ElementProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    actions.selectElement(element);
  };

  return (
    <div
      onClick={handleSelectElement}
      style={{
        borderBottom: "1px #404040 solid",
        ...element.styles,
      }}
      className=" w-full h-[70px] grid grid-cols-2  relative"
    >
      <div className="w-full h-full flex items-center justify-start">
        <ButtonPlaceHolder
          element={{
            id: "header-button-homepage",
            content: { innerText: "     الرئيسية" },
            name: "button",
            styles: {
              background: "#ffffff",
              color: "#000000",
              padding: "10px",
              borderRadius: "17px",
            },
            type: "BUTTON",
          }}
        />
      </div>
      <div className="w-full h-full flex items-center justify-end gap-x-4 px-4">
        <button className="w-8 h-8 flex items-center justify-center bg-transparent ">
          <Search className="w-4 h-4 text-black" />
        </button>
        <ShoppingCardPlaceholder />
        {/* <Button className="bg-blue-500 text-white">تسجيل الدخول</Button> */}
        <ButtonPlaceHolder
          element={{
            id: "header-button",
            content: { innerText: "تسجيل الدخول" },
            name: "button",
            styles: {
              background: "#06b6d4",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "17px",
            },
            type: "BUTTON",
          }}
        />
      </div>

      {/* {Array.isArray(element.content) &&
        element.content.map((item) => processComponent(item))} */}
    </div>
  );
};

export default HeaderPlaceholder;
