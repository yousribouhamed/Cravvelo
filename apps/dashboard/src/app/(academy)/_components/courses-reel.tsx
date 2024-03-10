"use client";

import { Course } from "database";
import { BookMarked } from "lucide-react";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { useAcademiaStore } from "../global-state/academia-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface CoursesReelProps {
  courses: Course[];
  blurData: String[];
}

const CoursesReel: FC<CoursesReelProps> = ({ courses, blurData }) => {
  const router = useRouter();

  const handleRouting = ({ id }: { id: string }) => {
    router.push(`/course-academy/${id}`);
  };

  return (
    <div className="w-full min-h-[400px] h-fit flex flex-col items-center p-4 gap-y-4">
      <div className="w-full h-[50px] flex items-center justify-between">
        <h2 className="text-3xl  font-bold text-zinc-900 text-start">
          الدورات البارزة
        </h2>
      </div>
      <div className="w-full min-h-[200px] h-fit flex items-start justify-start gap-x-8 flex-wrap">
        {Array.isArray(courses) &&
          courses?.map((item, index) => {
            return (
              <div
                onClick={() => handleRouting({ id: item.id })}
                key={item.title + index}
                className="w-[320px] h-[450px] bg-white   flex flex-col border rounded-xl  transition-all shadow  duration-700 cursor-pointer "
              >
                <div className="h-[200px] w-full rounded-t-xl relative">
                  {blurData[index] && (
                    <Image
                      alt={item.title}
                      src={item.thumnailUrl}
                      className="  object-cover rounded-t-xl"
                      fill
                      placeholder="blur"
                      //@ts-ignore
                      blurDataURL={blurData[index]}
                    />
                  )}
                </div>

                <div className="w-full h-[50px] flex items-center justify-between my-4 px-4">
                  <Link href={`/course-academy/${item.id}`}>
                    <h2 className="text-black font-semibold text-lg text-start hover:text-primary hover:underline  cursor-pointer">
                      {item.title}
                    </h2>
                  </Link>
                </div>
                {/* this will hold the stars */}
                <div className="w-full h-[10px] flex items-center justify-between my-4 px-4">
                  <div className="w-[50%] h-[20px] flex items-center justify-start gap-x-2">
                    <BookMarked className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500  text-sm text-start ">
                      {item.nbrChapters} مادة
                    </span>
                  </div>

                  <StarRatings
                    rating={0}
                    starDimension="20px"
                    starSpacing="1px"
                  />
                </div>

                {/* this will hold the price */}

                {Number(item.price) === 0 ? (
                  <div className="w-full h-[10px] flex items-center justify-start gap-x-4 my-4 px-4">
                    <h2 className="text-blue-500 font-semibold text-sm text-start ">
                      الدورة مجانية
                    </h2>
                  </div>
                ) : (
                  <div className="w-full h-[10px] flex items-center justify-start gap-x-4 my-4 px-4">
                    <h2 className="text-black font-semibold text-lg text-start ">
                      DZD {item.price}
                    </h2>
                    <span className="  text-gray-500  line-through ">
                      DZD {item.compareAtPrice}
                    </span>
                  </div>
                )}

                <div className="w-full h-[70px] flex items-center justify-center gap-x-4 pt-2 p-4">
                  <button
                    onClick={() => {
                      handleRouting({ id: item.id });
                    }}
                    className="w-[99%] bg-primary text-white p-2 h-[45px] rounded-lg"
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
