"use client";

import { EditorElement } from "@/src/types";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import type { FC } from "react";
import { useWebSiteEditor } from "../../editor-state";
import { Button } from "@ui/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface AddComponentsProps {}

export const components: EditorElement[] = [
  {
    image: "/elements-images/header.PNG",
    content: [],
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
  {
    image: "/elements-images/courses.PNG",
    content: [],
    id: "",
    name: "الدورات",
    styles: {},
    type: "PRODUCTS",
  },
  {
    image:
      "https://static.vecteezy.com/system/resources/previews/018/907/204/original/cardboard-boxes-side-view-illustration-business-and-cargo-object-icon-concept-delivery-cargo-open-boxes-design-with-shadow-empty-open-and-cardboard-box-icon-design-free-vector.jpg",
    content: [],
    id: "",
    name: "حاوية",
    styles: {
      width: "100%",
      height: "400px",
      background: "#fcd34d",
    },
    type: "container",
  },
  {
    image: "/elements-images/large-text.PNG",
    content: { innerText: "اهلا بك في اكادمية يوسري" },
    id: "",
    name: "نص كبير",
    styles: {
      textAlign: "center",
      fontSize: "80px",
      fontWeight: "900",
      color: "black",
      marginBottom: "20px",
      marginTop: "200px",
    },
    type: "TEXT",
  },
  {
    image: "/elements-images/footer.PNG",
    content: [],
    id: "",
    name: "ذيل الموقع",
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

  {
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fsimilarpng.com%2Fclick-button-cursor-clicking-mouse-arrow-or-hand-pointer-over-button-frame-on-transparent-png%2F&psig=AOvVaw3hyB44ykbj4_lBw2zZNHo6&ust=1707167491008000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJDpmdHMkoQDFQAAAAAdAAAAABAE",
    content: { innerText: "اظغط علي" },
    id: "",
    name: "زر",
    styles: {},
    type: "BUTTON",
  },
];

const AddElementDragDrop: FC = ({}) => {
  // deisplay all the header in here
  const { actions } = useWebSiteEditor();
  // when the user cloks on the component

  const handleOnDrag = (e: React.DragEvent, element: EditorElement) => {
    e.dataTransfer.setData("elementType", element.type);
  };

  // we add it
  return (
    <ScrollArea className=" min-h-full w-[300px] h-full flex flex-col  py-4">
      <div className="w-full  h-fit p-2 flex flex-col ">
        {components.map((item, index) => {
          return (
            <div
              draggable
              onDragStart={(e) => handleOnDrag(e, item)}
              key={item.id}
              className="w-full h-[150px] relative rounded-2xl bg-white/20 my-4 group p-4"
            >
              <img
                src={item?.image}
                className="w-full h-full object-cover rounded-xl "
              />
              <Button
                onClick={() =>
                  actions.addElement({
                    ...item,
                    id: uuidv4(),
                    //@ts-ignore
                    content: item.content,
                  })
                }
                className=" absolute inset-0 m-auto rounded-xl bg-primary text-white hidden group-hover:flex  items-center justify-center p-2 w-[150px]  shadow-primary shadow-md"
              >
                اضافة عنصر
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
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
