"use client";

import type { FC } from "react";
import { useThemeEditorStore } from "../../theme-editor-store";
import { ShoppingCart } from "lucide-react";
import { BookMarked } from "lucide-react";
import StarRatings from "react-star-ratings";

const items = [
  {
    image: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
    title: "رسم الشخصيات بأسلوب الأنمي والمانغا",
  },
  {
    image: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
    title: "  كيفية استخدام Framer في بناء الويب",
  },
  {
    image: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
    title: "redux دورة كاملة",
  },
];

const ThemeCollection: FC = ({}) => {
  const { state } = useThemeEditorStore();

  const isMobil = state.viewMode === "MOBILE";
  return (
    <>
      <div className="w-full h-[50px] flex items-center justify-start px-4">
        <h2 className="text-start font-bold text-4xl">الدورات الأكثر شعبية</h2>
      </div>
      <div
        className={`  w-full min-h-[300px] h-fit flex ${
          isMobil ? "flex-col" : "md:flex-row"
        }    items-center justify-center gap-x-4 my-16 rounded-xl `}
      >
        {items.map((item, index) => (
          <div
            key={item.title + index}
            className="w-[350px] min-h-[300px] h-fit p-4   flex flex-col shadow-2xl rounded-xl hover:-translate-y-4 transition-all duration-700 cursor-pointer"
          >
            <img src={item.image} className="w-full h-[200px] object-cover " />
            <div className="w-full h-[50px] flex items-center justify-between my-4">
              <h2 className="text-black font-semibold text-lg text-start ">
                {item.title}
              </h2>
              <span className="block  bg-gray-100 w-fit px-2 rounded-full text-black my-auto">
                دورة
              </span>
            </div>
            {/* this will hold the stars */}
            <div className="w-full h-[10px] flex items-center justify-between my-4">
              <div className="w-[50%] h-[20px] flex items-center justify-start gap-x-2">
                <BookMarked className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500  text-sm text-start ">
                  99 مادة
                </span>
              </div>

              <StarRatings
                rating={2.403}
                starDimension="20px"
                starSpacing="1px"
              />
            </div>

            {/* this will hold the price */}

            <div className="w-full h-[10px] flex items-center justify-start gap-x-4 my-4">
              <h2 className="text-black font-semibold text-lg text-start ">
                DZD 10000
              </h2>
              <span className="  text-gray-500  line-through ">DZD 12000</span>
            </div>

            <div className="w-full h-[50px] flex items-center justify-center gap-x-4 border-t pt-2">
              <button
                style={{
                  background: state.color,
                }}
                className="w-[80%]  text-white p-2 h-[45px] rounded-xl"
              >
                اشتري الآن
              </button>

              <button className="w-[20%] h-[45px] flex items-center justify-center bg-secondary rounded-xl">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ThemeCollection;
