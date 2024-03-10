"use client";

import { BookMarked } from "lucide-react";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Course } from "database";
import { Switch } from "@ui/components/ui/switch";
import Image from "next/image";
import Link from "next/link";

//https://i.ytimg.com/vi/NqzdVN2tyvQ/maxresdefault.jpg

interface Props {
  courses: Course[];
  blurData: String[];
}

const CoursesGrid: FC<Props> = ({ courses, blurData }) => {
  const router = useRouter();

  const handleNavigate = ({ id }: { id: string }) => {
    router.push(`/course-academy/${id}`);
  };

  return (
    <div className="grid grid-cols-4  gap-8">
      <div className="w-full col-span-1 h-[800px] bg-white flex flex-col gap-y-4 pt-8 gap-x-4">
        <div
          dir="ltr"
          className="w-full h-[40px] flex items-center justify-between p-4"
        >
          <Switch />
          <span className="font-bold text-lg">الدورات المجانية</span>
        </div>

        <div
          dir="ltr"
          className="w-full h-[40px] flex items-center justify-between p-4"
        >
          <Switch />
          <span className="font-bold text-lg">الدورات المجانية</span>
        </div>

        <div
          dir="ltr"
          className="w-full h-[40px] flex items-center justify-between p-4"
        >
          <Switch />
          <span className="font-bold text-lg">الدورات المجانية</span>
        </div>

        <div
          dir="ltr"
          className="w-full h-[40px] flex items-center justify-between p-4"
        >
          <Switch />
          <span className="font-bold text-lg">الدورات المجانية</span>
        </div>
      </div>

      <div className="col-span-3">
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
                <div className="h-[200px] w-full rounded-t-xl relative">
                  <Image
                    alt={item.title}
                    src={item.thumnailUrl}
                    className="  object-cover rounded-t-xl"
                    fill
                    placeholder="blur"
                    //@ts-ignore
                    blurDataURL={blurData[index]}
                  />
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
                    onClick={() => handleNavigate({ id: item.id })}
                    className="w-[99%] bg-primary text-white p-2 h-[45px] rounded-lg"
                  >
                    اشتري الآن
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesGrid;
