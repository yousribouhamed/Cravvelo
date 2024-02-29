"use client";

import { BookMarked, ShoppingCart } from "lucide-react";
import StarRatings from "react-star-ratings";
import {
  ItemCourse,
  useAcademiaStore,
} from "../../global-state/academia-store";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Course } from "database";

//https://i.ytimg.com/vi/NqzdVN2tyvQ/maxresdefault.jpg

interface Props {
  courses: Course[];
}

const CoursesGrid: FC<Props> = ({ courses }) => {
  const addItemToShoppingBag = useAcademiaStore(
    (state) => state.actions.addItem
  );

  const router = useRouter();

  const handleNavigate = ({ id }: { id: string }) => {
    router.push(`/course-academy/${id}`);
  };

  return (
    <div className="flex flex-wrap   gap-8 w-full h-full mim-h-[500px] ">
      {Array.isArray(courses) && courses.length === 0 && (
        <div className="w-full h-[200px] flex items-center justify-center">
          <p className="text-xl font-bold">
            لا توجد دورات حتى الآن في الأكاديمية
          </p>
        </div>
      )}
      {Array.isArray(courses) &&
        courses.map((item, index) => (
          <div
            key={item.title + index}
            className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl  transition-all duration-700 bg-white cursor-pointer "
          >
            <img
              src={item.thumnailUrl}
              className="w-full h-[200px] rounded-t-xl object-cover "
            />
            <div className="w-full h-[50px] px-4 flex items-center justify-between my-4">
              <button onClick={() => handleNavigate({ id: item?.id })}>
                <h2 className="text-black font-semibold text-lg text-start ">
                  {item.title}
                </h2>
              </button>
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
                <StarRatings
                  rating={2}
                  starDimension="20px"
                  starSpacing="1px"
                />
              </div>
            </div>

            {/* this will hold the price */}

            <div className="w-full h-[10px] px-4 flex items-center justify-start gap-x-4 my-4">
              <h2 className="text-black font-bold text-sm  text-start ">
                DZD {item.price}
              </h2>
              <span className="  text-gray-500  text-sm line-through ">
                DZD {item.compareAtPrice}
              </span>
            </div>

            <div className="w-full h-[70px] px-4 flex items-center justify-center gap-x-4 border-t pt-2">
              <button
                onClick={() => {
                  addItemToShoppingBag({
                    id: item.id,
                    imageUrl: item.thumnailUrl,
                    name: item.title,
                    price: item.price.toString(),
                  });
                  router.push(`/cart`);
                }}
                className="w-[99%] bg-primary hover:bg-orange-700 text-white p-2 h-[45px] rounded-xl"
              >
                اشتري الآن
              </button>

              {/* <button
                onClick={() => {
                  addItemToShoppingBag({
                    id: item.id,
                    imageUrl: item.thumnailUrl,
                    name: item.title,
                    price: item.price.toString(),
                  });
                }}
                className="w-[20%] h-[45px] flex items-center justify-center bg-secondary rounded-xl"
              >
                <ShoppingCart className="w-4 h-4" />
              </button> */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CoursesGrid;
