"use client";

import { Star } from "lucide-react";
import type { FC } from "react";
import StarRatings from "react-star-ratings";

interface FeedbacksProps {}

const Feedbacks: FC = ({}) => {
  return (
    <div className="w-full h-[400px] flex flex-col rounded-xl ">
      {/* this is the first title */}
      <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
        <div className="w-[45px] h-[45px] rounded-[50%] bg-black flex items-center justify-center">
          <Star className="text-white w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold"> التقييمات</h3>
      </div>
      {/* this is the second component within the component */}
      <div className="w-full h-[300px] flex flex-col  bg-gray-100   gap-y-4 rounded-xl  p-8">
        <div className="bg-white rounded-xl p-4 flex items-center ">
          <div className=" w-full h-[200px] rounded-xl  flex flex-col justify-center items-start gap-y-4">
            <p className="text-3xl font-bold "> 5</p>
            <StarRatings
              rating={2.403}
              starDimension="20px"
              starSpacing="1px"
            />
            <p className="text-gray-500 text-xl text-center">
              لم يصح اي احد تقييما لهذه الدورة
            </p>
          </div>
          <div className=" w-full h-[200px] rounded-xl flex flex-col justify-center items-start gap-y-4">
            <div className="w-full flex items-center justify-between gap-x-4">
              <span className="text-xs  text-gray-600">نجوم5</span>
              <div className="w-[300px] h-2 rounded-2xl bg-gray-200 flex items-center justify-between p-2">
                <div className="w-[100px] h-1.5 rounded-2xl bg-yellow-400" />
                <span className="text-gray-600 text-xs "> 3%</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-x-4">
              <span className="text-xs  text-gray-600">4نجوم</span>
              <div className="w-[300px] h-2 rounded-2xl bg-gray-200 flex items-center justify-between p-2">
                <div className="w-[100px] h-1.5 rounded-2xl bg-yellow-400" />
                <span className="text-gray-600 text-xs "> 3%</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-x-4">
              <span className="text-xs  text-gray-600">3نجوم</span>
              <div className="w-[300px] h-2 rounded-2xl bg-gray-200 flex items-center justify-between p-2">
                <div className="w-[100px] h-1.5 rounded-2xl bg-yellow-400" />
                <span className="text-gray-600 text-xs "> 3%</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-x-4">
              <span className="text-xs  text-gray-600">2نجوم</span>
              <div className="w-[300px] h-2 rounded-2xl bg-gray-200 flex items-center justify-between p-2">
                <div className="w-[100px] h-1.5 rounded-2xl bg-yellow-400" />
                <span className="text-gray-600 text-xs "> 3%</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-x-4">
              <span className="text-xs  text-gray-600">نجمة</span>
              <div className="w-[300px] h-2 rounded-2xl bg-gray-200 flex items-center justify-between p-2">
                <div className="w-[100px] h-1.5 rounded-2xl bg-yellow-400" />
                <span className="text-gray-600 text-xs "> 3%</span>
              </div>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gray-600  my-2 "></div>
        </div>
      </div>
      {/* this is the comments in here */}
    </div>
  );
};

export default Feedbacks;
