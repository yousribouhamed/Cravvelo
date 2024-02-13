"use client";

import type { FC } from "react";
import StarRatings from "react-star-ratings";

interface FilterCoursesProps {}

const FilterCourses: FC<FilterCoursesProps> = ({}) => {
  return (
    <div className="w-full max-w-[300px]  h-[700px] rounded-xl border bg-gray-100 flex flex-col justify-center items-center sticky top-[70px]">
      <div className="w-full min-h-[200px] h-fit flex flex-col  border-b p-4">
        <p>raiting</p>
        <div className="w-full flex flex-col h-fit gap-y-4 my-4">
          {/* 5 starts */}
          <div className="w-full h-[20px] flex items-center justify-between ">
            <button className="w-7 h-7 border rounded-xl bg-white"></button>
            <StarRatings rating={5} starDimension="20px" starSpacing="1px" />
          </div>
          {/* 4 starts */}
          <div className="w-full h-[20px] flex items-center justify-between">
            <button className="w-7 h-7 border rounded-xl bg-white"></button>
            <StarRatings rating={4} starDimension="20px" starSpacing="1px" />
          </div>
          {/* 3 starts */}
          <div className="w-full h-[20px] flex items-center justify-between">
            <button className="w-7 h-7 border rounded-xl bg-white"></button>
            <StarRatings rating={3} starDimension="20px" starSpacing="1px" />
          </div>
          {/* 2 stars */}
          <div className="w-full h-[20px] flex items-center justify-between">
            <button className="w-7 h-7 border rounded-xl bg-white"></button>
            <StarRatings rating={2} starDimension="20px" starSpacing="1px" />
          </div>
        </div>
      </div>
      <div className="w-full h-[300px] flex flex-col  border-b p-4">
        <p>course duration</p>
      </div>
      <div className="w-full h-[300px] flex flex-col  border-b p-4">
        <p>raiting</p>
      </div>
      <div className="w-full h-[300px] flex flex-col  border-b p-4">
        <p>pricing</p>
      </div>

      <div className="w-full h-[300px] flex flex-col  border-b p-4">
        <p>level</p>
      </div>
      <div className="w-full h-[300px] flex justify-center items-center  ">
        <button className="px-4 py-2 rounded-xl bg-blue-500 text-white">
          apply filters
        </button>
      </div>
    </div>
  );
};

export default FilterCourses;
