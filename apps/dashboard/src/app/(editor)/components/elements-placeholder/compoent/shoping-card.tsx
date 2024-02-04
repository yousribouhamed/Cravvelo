import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";
import { processComponent } from "../../page-painter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Button } from "@ui/components/ui/button";

// interface ElementProps {
//   element: EditorElement;
// }

const ShoppingCardPlaceholder: FC = () => {
  const { state, actions } = useWebSiteEditor();

  return (
    // <div
    //   onClick={handleSelectElement}
    //   style={{
    //     ...element.styles,
    //   }}
    //   className="relative"
    // >
    //   {Array.isArray(element.content) &&
    //     element.content.map((item) => processComponent(item))}
    // </div>
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center bg-transparent ">
          <ShoppingCart className="w-4 h-4  text-black" />
        </button>
      </SheetTrigger>
      <SheetContent className="bg-white text-black">
        <SheetHeader>
          <SheetTitle className="text-blue-500">
            this is a shoping card
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCardPlaceholder;
