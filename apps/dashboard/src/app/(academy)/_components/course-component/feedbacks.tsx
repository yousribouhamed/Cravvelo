"use client";

import { Star } from "lucide-react";
import type { FC } from "react";
import StarRatings from "react-star-ratings";

const Feedbacks: FC = ({}) => {
  return (
    <div className="w-full min-h-[200px] h-fit flex flex-col rounded-xl ">
      {/* this is the first title */}
      <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
        <h3 className="text-xl font-bold"> التقييمات</h3>
      </div>
      {/* this is the second component within the component */}
      <div className="w-full min-h-[300px] h-fit flex flex-col  bg-gray-100   gap-y-4 rounded-xl  p-8">
        <div className="bg-white rounded-xl p-4 flex flex-col lg:flex-row items-center ">
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
        </div>

        <div className="w-full h-0.5 border-b  my-2 flex items-center justify-center ">
          comments
        </div>
        {/* this is comment */}
        <div className="w-full flex flex-col h-[250px] bg-white rounded-xl ">
          <div className="w-full h-[70px]  flex items-center justify-between p-4">
            <div className="w-[200px] h-full flex  justify-start items-center gap-x-4">
              <div className="rounded-[50%] w-[40px] h-[40px] bg-primary"></div>
              <div className="w-fit min-w-[100px] h-full flex flex-col gap-y-1 justify-center items-start">
                <p className="text-black text-xl font-bold ">abdullah chehri</p>
                <span className="text-gray-500 text-sm ">9:99 pm</span>
              </div>
            </div>

            <div className="bg-black rounded-xl w-[60px] h-[20px] p-2 flex items-center justify-center">
              <span className="text-white text-sm"> 5 start</span>
            </div>
          </div>
          <div className="w-full h-[160px] p-4">
            <p className="text-md text-gray-700 text-start">
              يعد إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.
            </p>
          </div>
        </div>

        {/* this is the second comment */}
        <div className="w-full flex flex-col h-[250px] bg-white rounded-xl ">
          <div className="w-full h-[70px]  flex items-center justify-between p-4">
            <div className="w-[200px] h-full flex  justify-start items-center gap-x-4">
              <div className="rounded-[50%] w-[40px] h-[40px] bg-primary"></div>
              <div className="w-fit min-w-[100px] h-full flex flex-col gap-y-1 justify-center items-start">
                <p className="text-black text-xl font-bold ">abdullah chehri</p>
                <span className="text-gray-500 text-sm ">9:99 pm</span>
              </div>
            </div>

            <div className="bg-black rounded-xl w-[60px] h-[20px] p-2 flex items-center justify-center">
              <span className="text-white text-sm"> 5 start</span>
            </div>
          </div>
          <div className="w-full h-[160px] p-4">
            <p className="text-md text-gray-700 text-start">
              يعد إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.يعد
              إنشاء برامج مخصصة لألعاب تطوير الألعاب ظاهرة ترفيه عالمية.
            </p>
          </div>
        </div>
      </div>
      {/* this is the comments in here */}
    </div>
  );
};

export default Feedbacks;
