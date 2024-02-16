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
    <div className="w-full min-h-[200px] flex flex-col items-center p-4">
      <div className="w-full h-[50px] flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-500 text-start">
          الدورات البارزة
        </h2>
      </div>
      <div className="w-full h-[200px] flex items-start justify-start gap-x-4 flex-wrap">
        {Array.isArray(courses) &&
          courses?.map((item, index) => {
            return (
              <div
                key={item.title + index}
                className="w-[350px] min-h-[300px] h-fit p-4   flex flex-col shadow-2xl rounded-xl  transition-all duration-700 cursor-pointer "
              >
                <img
                  src={item.thumnailUrl}
                  className="w-full h-[200px] object-cover "
                />
                <div className="w-full h-[50px] flex items-center justify-between my-4">
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
                  <span className="  text-gray-500  line-through ">
                    DZD 12000
                  </span>
                </div>

                <div className="w-full h-[50px] flex items-center justify-center gap-x-4 border-t pt-2">
                  <button
                    onClick={() => {
                      addItemToShoppingBag({
                        id: uuidv4(),
                        imageUrl: item.thumnailUrl,
                        name: item.title,
                        price: item.price.toString(),
                      });
                    }}
                    className="w-[80%] bg-blue-500 text-white p-2 h-[45px] rounded-xl"
                  >
                    اشتري الآن
                  </button>

                  <button className="w-[20%] h-[45px] flex items-center justify-center bg-secondary rounded-xl">
                    <ShoppingCart className="w-4 h-4" />
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
