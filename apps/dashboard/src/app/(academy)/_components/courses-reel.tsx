"use client";

import { Course } from "database";
import { BookMarked, ShoppingCart } from "lucide-react";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { useAcademiaStore } from "../global-state/academia-store";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CoursesReelProps {
  courses: Course[];
}

const CoursesReel: FC<CoursesReelProps> = ({ courses }) => {
  const router = useRouter();
  const addItemToShoppingBag = useAcademiaStore(
    (state) => state.actions.addItem
  );

  const handleRouting = ({ id }: { id: string }) =>
    router.push(`/course-academy/${id}`);
  return (
    <div className="w-full min-h-[200px] h-fit flex flex-col items-center p-4 gap-y-4">
      <div className="w-full h-[50px] flex items-center justify-between">
        <h2 className="text-3xl  font-bold text-zinc-900 text-start">
          الدورات البارزة
        </h2>
      </div>
      <div className="w-full h-[200px] flex items-start justify-start gap-x-8 flex-wrap">
        {Array.isArray(courses) &&
          courses?.map((item, index) => {
            return (
              <div
                key={item.title + index}
                className="w-[320px] min-h-[350px] h-fit    flex flex-col border rounded-xl  transition-all shadow  duration-700 cursor-pointer "
              >
                <img
                  src={item.thumnailUrl}
                  className="w-full h-[200px] object-cover rounded-t-xl"
                />
                <div className="w-full h-[50px] flex items-center justify-between my-4 px-4">
                  <Link href={`/course-academy/${item.id}`}>
                    <h2 className="text-black font-semibold text-lg text-start hover:text-blue-500 hover:underline  cursor-pointer">
                      {item.title}
                    </h2>
                  </Link>

                  <span className="block  bg-gray-100 w-fit  rounded-full text-black my-auto">
                    دورة
                  </span>
                </div>
                {/* this will hold the stars */}
                <div className="w-full h-[10px] flex items-center justify-between my-4 px-4">
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

                <div className="w-full h-[10px] flex items-center justify-start gap-x-4 my-4 px-4">
                  <h2 className="text-black font-semibold text-lg text-start ">
                    DZD 10000
                  </h2>
                  <span className="  text-gray-500  line-through ">
                    DZD 12000
                  </span>
                </div>

                <div className="w-full h-[70px] flex items-center justify-center gap-x-4 pt-2 p-4">
                  <button
                    onClick={() => {
                      addItemToShoppingBag({
                        id: uuidv4(),
                        imageUrl: item.thumnailUrl,
                        name: item.title,
                        price: item.price.toString(),
                      });
                    }}
                    className="w-[99%] bg-blue-500 text-white p-2 h-[45px] rounded-xl"
                  >
                    اشتري الآن
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CoursesReel;
