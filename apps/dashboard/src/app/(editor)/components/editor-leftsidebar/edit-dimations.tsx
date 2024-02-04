import { Input } from "@ui/components/ui/input";
import { useWebSiteEditor } from "../../editor-state";
import { useState } from "react";
import { EditorState } from "@/src/types";

type size = number | "FULL" | "RELATIVE" | "FIT";

export const EditeDimations = ({ state }: { state: EditorState }) => {
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
      <h2 className="text-white font-bold text-md my-4">الأبعاد</h2>
      <div className="w-full flex items-center justify-start  h-[300px] flex-col ">
        <div className="w-[200px] h-[130px] relative rounded-xl bg-[#252525] border border-black flex items-center justify-center ">
          <div className="w-[25px] h-[35px] rounded-lg bg-white " />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  paddingBottom: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.paddingBottom}
            className="absolute bottom-2 w-[60px] h-[30px]"
          />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  paddingTop: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.paddingTop}
            className="absolute top-2 w-[60px] h-[30px]"
          />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  paddingLeft: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.paddingLeft}
            className="absolute left-2 w-[60px] h-[30px]"
          />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  paddingRight: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.paddingRight}
            className="absolute right-2 w-[60px] h-[30px]"
          />
        </div>

        <div className="w-[70px] h-[70px] relative rounded-xl bg-[#252525] border border-black  mt-14 flex items-center justify-center ">
          <div className="w-[25px] h-[25px] rounded-lg bg-white " />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  marginBottom: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.marginBottom}
            className="absolute -bottom-10 w-[60px] h-[30px]"
          />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  marginTop: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.marginTop}
            className="absolute -top-10 w-[60px] h-[30px]"
          />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  marginLeft: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.marginLeft}
            className="absolute -left-16 w-[60px] h-[30px]"
          />
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  marginRight: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.marginRight}
            className="absolute -right-16 w-[60px] h-[30px]"
          />
        </div>
      </div>
    </div>
  );
};
