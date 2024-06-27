"use client";

import { BookMarked } from "lucide-react";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@ui/components/ui/pagination";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { CourseWithEpisode } from "@/src/types";
import { Play } from "lucide-react";

interface CoursesReelProps {
  courses: CourseWithEpisode[];
  color: string;
}

const CoursesReel: FC<CoursesReelProps> = ({ courses, color }) => {
  const router = useRouter();

  const handleRouting = ({
    id,
    direction = "LANDING",
  }: {
    id: string;
    direction?: "PLAYER" | "LANDING";
  }) => {
    if (direction === "LANDING") {
      router.push(`/course-academy/${id}`);
      return;
    }
    router.push(`/course-academy/${id}/course-player`);
  };

  // State to keep track of current page
  const [currentPage, setCurrentPage] = React.useState(1);
  // Number of items per page
  const itemsPerPage = 3; // Change this to your desired number

  // Calculate index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Slice the data array to get items for the current page
  const currentItems = courses?.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full min-h-[400px] h-fit flex flex-col items-center p-4 gap-y-4">
      <div className="w-full h-[50px] flex items-center justify-between">
        <h2 className="text-3xl  font-bold text-zinc-900 text-start">
          الدورات
        </h2>
      </div>
      <div className="w-full min-h-[200px] h-fit flex items-start justify-center gap-8 flex-wrap">
        {Array.isArray(currentItems) &&
          currentItems?.map((item, index) => {
            return (
              <div
                onClick={() =>
                  handleRouting({
                    id: item.id,
                    direction: item.owned ? "PLAYER" : "LANDING",
                  })
                }
                key={item.title + index}
                className="w-[320px] h-[450px] bg-white   flex flex-col border rounded-xl  transition-all shadow  duration-700 cursor-pointer hover:-translate-y-2  "
              >
                <div className="h-[200px] w-full rounded-t-xl relative">
                  <Image
                    alt={item?.title}
                    src={item.thumbnailUrl ? item.thumbnailUrl : ""}
                    className="  object-cover rounded-t-xl"
                    fill
                  />
                </div>

                <div className="w-full h-[50px] flex items-center justify-between my-4 px-4">
                  <Link href={`/course-academy/${item.id}`}>
                    <h2 className="text-black font-semibold text-lg text-start   hover:underline  cursor-pointer">
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
                  <div dir="ltr">
                    <StarRatings
                      rating={item.rating}
                      starDimension="20px"
                      starSpacing="1px"
                    />
                  </div>
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
                  {item.owned ? (
                    <button
                      className="w-[99%]  text-white p-2 h-[45px] flex items-center justify-center gap-x-2 rounded-lg"
                      style={{
                        background: color ?? "#FC6B00",
                      }}
                    >
                      <Play
                        className="w-4 h-4 text-white ml-2"
                        strokeWidth={3}
                      />
                      المشاهدة الان
                    </button>
                  ) : (
                    <>
                      <button
                        className="w-[99%]  text-white p-2 h-[45px] rounded-lg"
                        style={{
                          background: color ?? "#FC6B00",
                        }}
                      >
                        {Number(item.price) === 0
                          ? "المطالبة بالدورة"
                          : "اشتري الآن"}
                      </button>
                      <button className="w-[60px]  h-[45px]  rounded-lg bg-secondary flex items-center justify-center cursor-pointer ">
                        <ShoppingCart className="w-4 h-4 text-black" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {courses?.length > 3 && (
        <div
          dir="ltr"
          className="w-full h-fit min-h-[100px] flex items-center justify-center "
        >
          <Pagination>
            <PaginationContent dir="rtl">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {courses.map((item, index) => (
                <PaginationItem key={item.accountId}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CoursesReel;
