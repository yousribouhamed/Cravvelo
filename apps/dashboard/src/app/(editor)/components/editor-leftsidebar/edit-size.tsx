import { Input } from "@ui/components/ui/input";
import { useWebSiteEditor } from "../../editor-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { useState } from "react";
import { EditorState } from "@/src/types";

type size = number | "FULL" | "RELATIVE" | "FIT";

export const EditeSize = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();

  const [width, setWidth] = useState<size>(
    Number(state.editor.selectedElement.styles.height) ?? 0
  );
  const [height, setHeight] = useState<size>(
    Number(state.editor.selectedElement.styles.height) ?? 0
  );

  const hableChangewidth = ({ widthParams }: { widthParams: size }) => {
    setWidth(widthParams);

    const newElement = {
      ...state.editor.selectedElement,
      styles: {
        ...state.editor.selectedElement.styles,

        width:
          widthParams === "FULL"
            ? "100%"
            : widthParams === "RELATIVE"
            ? "100%"
            : widthParams === "FIT"
            ? "fit-content"
            : widthParams + "px",
      },
    };
    actions.updateElement(newElement);
    actions.selectElement(newElement);
  };

  const hanleChnageHeight = ({ heightParams }: { heightParams: size }) => {
    setHeight(heightParams);

    const newElement = {
      ...state.editor.selectedElement,
      styles: {
        ...state.editor.selectedElement.styles,
        height:
          heightParams === "FULL"
            ? "100%"
            : heightParams === "RELATIVE"
            ? "100%"
            : heightParams === "FIT"
            ? "fit-content"
            : heightParams + "px",
      },
    };
    actions.updateElement(newElement);
    actions.selectElement(newElement);
  };

  return (
    <div
      dir="rtl"
      className="w-full h-fit flex flex-col px-4  border-t dark:border-[#252525] "
    >
      <h2 className="text-white font-bold text-md my-4">مقاس</h2>
      <div className="w-full flex items-start justify-center  flex-col ">
        <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
          <span className="text-gray-50 text-sm">عرض</span>
          <div className="flex items-center justify-end gap-x-2">
            <Input
              className="w-[70px] h-8"
              value={width}
              onChange={(e) =>
                hableChangewidth({ widthParams: Number(e.target.value) })
              }
            />
            <Select
              onValueChange={(value) => {
                hableChangewidth({ widthParams: value as size });
              }}
            >
              <SelectTrigger className="w-[70px] h-8 dark:bg-zinc-900">
                <SelectValue placeholder="مقاس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL">ملء الفراغ</SelectItem>
                <SelectItem value="RELATIVE">نسبي</SelectItem>
                <SelectItem value="FIT">حجم المحتوى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
          <span className="text-gray-50 text-sm">ارتفاع</span>
          <div className="flex items-center justify-end gap-x-2">
            <Input
              className="w-[70px] h-8"
              value={height}
              onChange={(e) =>
                hanleChnageHeight({ heightParams: Number(e.target.value) })
              }
            />

            <Select
              onValueChange={(value) => {
                hanleChnageHeight({ heightParams: value as size });
              }}
            >
              <SelectTrigger className="w-[70px] h-8 dark:bg-zinc-900">
                <SelectValue placeholder="مقاس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL">ملء الفراغ</SelectItem>
                <SelectItem value="RELATIVE">نسبي</SelectItem>
                <SelectItem value="FIT">حجم المحتوى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
