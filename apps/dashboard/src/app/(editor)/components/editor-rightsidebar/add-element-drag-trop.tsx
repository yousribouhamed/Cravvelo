"use client";

import { EditorElement } from "@/src/types";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import type { FC } from "react";
import { useWebSiteEditor } from "../../editor-state";
import { Button } from "@ui/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface AddComponentsProps {}

const components: EditorElement[] = [
  {
    content: [
      {
        content: { innerText: "نبذة عني" },
        id: "nav_bar_btn1",
        name: "زر التوجيه",
        styles: {
          background: "#fff",
          color: "#000",
          width: "120px",
          borderRadius: "17px",
          height: "40px",
        },
        type: "BUTTON",
      },
      {
        content: { innerText: "أعمالي" },
        id: "nav_bar_btn3",
        name: "زر التوجيه",
        styles: {
          background: "#fff",
          color: "#000",
          width: "120px",
          borderRadius: "17px",
          height: "40px",
        },
        type: "BUTTON",
      },
      {
        content: { innerText: "المدونة" },
        id: "nav_bar_btn2",
        name: "زر التوجيه",
        styles: {
          background: "#fff",
          color: "#000",
          width: "120px",
          borderRadius: "17px",
          height: "40px",
        },
        type: "BUTTON",
      },
      {
        content: { innerText: " دخول الأكاديمية" },
        id: "nav_bar_btn5",
        name: "زر التوجيه",
        styles: {
          color: "#fff",
          width: "120px",
          borderRadius: "17px",
          height: "40px",
          background: "#60a5fa",
        },
        type: "BUTTON",
      },
    ],
    id: "",
    name: "شريط التنقل",
    styles: {
      display: "flex",
      justifyContent: "end",
      gap: "4px",
      alignItems: "center",
      paddingLeft: "4px",
      paddingRight: "4px",
      borderBottom: "#000 1px",
      height: "70px",
      width: "100%",
    },
    type: "header",
  },
];

const AddElementDragDrop: FC = ({}) => {
  // deisplay all the header in here
  const { actions } = useWebSiteEditor();
  // when the user cloks on the component

  // we add it
  return (
    <div className=" min-h-full w-[300px] h-fit flex flex-col py-4">
      <div className="w-full h-[700px] ">
        <ScrollArea className=" w-full  h-full p-2 flex flex-col  ">
          {components.map((item, index) => {
            return (
              <div
                key={item.id}
                className="w-full h-[150px] relative rounded-2xl bg-white/20 my-4 group"
              >
                <Button
                  onClick={() =>
                    actions.addElement({
                      ...item,
                      id: uuidv4(),
                      //@ts-ignore
                      content: setIdToTreeOfElement({ elements: item.content }),
                    })
                  }
                  className=" absolute inset-0 m-auto rounded-xl bg-primary text-white hidden group-hover:flex  items-center justify-center p-2 w-[150px]  shadow-primary shadow-xl"
                >
                  add item
                </Button>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AddElementDragDrop;

const setIdToTreeOfElement = ({ elements }: { elements: EditorElement[] }) => {
  const newElements = elements.map((item) => {
    if (!Array.isArray(item.content)) {
      return { ...item, id: uuidv4() };
    } else {
      return {
        ...item,
        id: uuidv4(),
        content: setIdToTreeOfElement({ elements: item.content }),
      };
    }
  });

  return newElements;
};
