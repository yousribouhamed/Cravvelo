import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";
import ButtonPlaceHolder from "../basic/button";

interface elementProps {
  element: EditorElement;
}

const items = [
  {
    image: "https://img-c.udemycdn.com/course/750x422/1630508_94eb_8.jpg",
    title: "رسم الشخصيات بأسلوب الأنمي والمانغا",
  },
  {
    image:
      "https://framerusercontent.com/images/OSrhhE7i4s6onZmoAng3StH6geA.jpg",
    title: "  كيفية استخدام Framer في بناء الويب",
  },
  {
    image: "https://i.ytimg.com/vi/NqzdVN2tyvQ/maxresdefault.jpg",
    title: "redux دورة كاملة",
  },
];

const ProductsPlaceHolder: FC<elementProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Stop event bubbling
    event.nativeEvent.stopImmediatePropagation();
    actions.selectElement(element);
  };

  return (
    <div
      className={`  w-full h-[300px] flex items-center justify-center gap-x-4 my-16 `}
    >
      {items.map((item) => (
        <div className="w-[350px] h-[300px] p-4   flex flex-col shadow-2xl rounded-xl ">
          <img src={item.image} className="w-full h-[200px] object-cover " />
          <div className="w-full h-[50px] flex items-center justify-between my-4">
            <h2 className="text-black font-semibold text-lg text-start ">
              {item.title}
            </h2>
            <span className="block  bg-gray-100 w-fit  rounded-full text-black my-auto">
              دورة
            </span>
          </div>
          <div className="w-full h-[50px] flex items-center justify-center">
            <ButtonPlaceHolder
              element={{
                content: { innerText: "اشتري الآن" },
                id: `button-buy-one-${item.title}`,
                name: "button",
                styles: {
                  width: "100%",
                  height: "40px",
                  borderRadius: "15px",
                  background: "#06b6d4",
                },
                type: "BUTTON",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsPlaceHolder;
