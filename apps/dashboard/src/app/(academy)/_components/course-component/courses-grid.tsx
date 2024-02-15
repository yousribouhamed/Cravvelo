"use client";

import { BookMarked, ShoppingCart } from "lucide-react";
import StarRatings from "react-star-ratings";
import {
  ItemCourse,
  useAcademiaStore,
} from "../../global-state/academia-store";
import { v4 as uuidv4 } from "uuid";
import type { FC } from "react";
import { useRouter } from "next/navigation";

const items = [
  {
    id: "uuuu",
    image: "https://img-c.udemycdn.com/course/750x422/1630508_94eb_8.jpg",
    title: "رسم الشخصيات بأسلوب الأنمي والمانغا",
    price: 99.0,
  },
  {
    id: "uuuu",
    image:
      "https://framerusercontent.com/images/OSrhhE7i4s6onZmoAng3StH6geA.jpg",
    title: "  كيفية استخدام Framer في بناء الويب",
    price: 99.0,
  },
  {
    id: "uuuu",
    image: "/opengraph-image.png",
    title: "redux دورة كاملة",
    price: 99.0,
  },
];

//https://i.ytimg.com/vi/NqzdVN2tyvQ/maxresdefault.jpg

const CoursesGrid: FC = ({}) => {
  const addItemToShoppingBag = useAcademiaStore(
    (state) => state.actions.addItem
  );

  const router = useRouter();

  const handleNavigate = ({ id }: { id: string }) => {
    router.push(`/course-academy/${id}`);
  };

  const handleBuyNow = ({ item }: { item: ItemCourse }) => {
    addItemToShoppingBag(item);
    router.push(`/cart`);
  };

  return (
    <div className="flex flex-wrap   gap-8 w-full h-full mim-h-[500px] ">
      {items.map((item, index) => (
        <div
          key={item.title + index}
          onClick={() => handleNavigate({ id: item?.id })}
          className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl  transition-all duration-700 bg-white cursor-pointer "
        >
          <img
            src={item.image}
            className="w-full h-[200px] rounded-t-xl object-cover "
          />
          <div className="w-full h-[50px] px-4 flex items-center justify-between my-4">
            <h2 className="text-black font-semibold text-lg text-start ">
              {item.title}
            </h2>
            <span className="block  bg-gray-100 w-fit  rounded-full text-black my-auto px-2">
              دورة
            </span>
          </div>
          {/* this will hold the stars */}
          <div className="w-full h-[10px] px-4 flex items-center justify-between my-4">
            <div className="w-[50%] h-[20px] flex items-center justify-start gap-x-2">
              <BookMarked className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500  text-sm text-start ">
                99 مادة
              </span>
            </div>

            <div>
              <StarRatings rating={2} starDimension="20px" starSpacing="1px" />
            </div>
          </div>

          {/* this will hold the price */}

          <div className="w-full h-[10px] px-4 flex items-center justify-start gap-x-4 my-4">
            <h2 className="text-black font-bold text-sm  text-start ">
              DZD 10000
            </h2>
            <span className="  text-gray-500  text-sm line-through ">
              DZD 12000
            </span>
          </div>

          <div className="w-full h-[70px] px-4 flex items-center justify-center gap-x-4 border-t pt-2">
            <button
              // @ts-ignore
              onClick={() => handleBuyNow(item)}
              className="w-[80%] bg-blue-500 hover:bg-blue-600 text-white p-2 h-[45px] rounded-xl"
            >
              اشتري الآن
            </button>

            <button
              onClick={() => {
                addItemToShoppingBag({
                  id: uuidv4(),
                  imageUrl: item.image,
                  name: item.title,
                  price: item.price.toString(),
                });
              }}
              className="w-[20%] h-[45px] flex items-center justify-center bg-secondary rounded-xl"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesGrid;
