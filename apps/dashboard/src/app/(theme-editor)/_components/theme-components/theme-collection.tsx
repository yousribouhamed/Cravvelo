"use client";

import type { FC } from "react";
import { useThemeEditorStore } from "../../theme-editor-store";

interface ThemeCollectionProps {}

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

const ThemeCollection: FC = ({}) => {
  const view = useThemeEditorStore((state) => state.state.viewMode);

  const isMobil = view === "MOBILE";
  return (
    <div
      className={`  w-full min-h-[300px] h-fit flex ${
        isMobil ? "flex-col" : "md:flex-row"
      }    items-center justify-center gap-x-4 my-16 `}
    >
      {items.map((item, index) => (
        <div
          key={item.title + index}
          className="w-[350px] min-h-[300px] h-fit p-4   flex flex-col shadow-2xl rounded-xl "
        >
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
            <button className="w-full bg-blue-500 text-white p-2 h-[50px] rounded-xl">
              اشتري الآن
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThemeCollection;
