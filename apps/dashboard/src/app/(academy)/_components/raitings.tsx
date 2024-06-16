"use client";

import type { FC } from "react";
import AddReview from "./add-review";
import { Comment, Course } from "database";
import StarRatings from "react-star-ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  calculateAverageRating,
  calculateRatingPercentage,
  formatDateTime,
} from "../lib";
import { Progress } from "@ui/components/ui/progress";

const avrage = [5, 4, 3, 2, 1];

const Raitings: FC<{
  course: Course;
  comments: Comment[];
  color: string;
  isAuthanticated: boolean;
}> = ({ course, color, comments, isAuthanticated }) => {
  return (
    <div className="w-full flex flex-col bg-white min-h-[400px] h-fit border rounded-xl ">
      <div className="w-full h-[400px] md:h-[250px]  grid grid-cols-1 md:grid-cols-2   ">
        <div className="w-full h-full  flex flex-col p-4   ">
          {avrage.map((item, index) => (
            <div
              key={item + index + "raiting"}
              className="w-full h-[40px] flex justify-center md:justify-start items-center gap-x-2"
            >
              {/* <div className=" h-[9px] rounded-xl bg-primary" /> */}
              <Progress
                value={calculateRatingPercentage(
                  comments.map((item) => item.rating),
                  item
                )}
                className="w-[300px] h-2"
              />
              <svg
                width="24"
                height="23"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.59003 0.646465C6.75842 0.110210 7.49158 0.110229 7.65997 0.646466L8.76676 4.05101C8.84206 4.10458 9.05804 4.44149 9.30173 4.44149H12.8834C13.4103 4.44149 13.6510 5.13877 13.214 5.45906L10.3164 7.5643C10.1192 7.70754 10.0367 7.96143 10.1121 8.1932L11.2188 11.5995C11.3872 12.1178 10.7941 12.5107 10.3532 12.2104L7.45563 10.1232C7.25810 9.97996 6.99152 9.97996 6.79437 10.1232L3.89676 12.2104C3.45592 12.5107 2.86277 12.1178 3.03116 11.5995L4.13795 8.1932C4.21325 7.96143 4.13076 7.70754 3.93361 7.5643L1.036 5.45906C0.595158 5.13877 0.82172 4.44149 1.36663 4.44149H4.91027C5.19196 4.44149 5.40794 4.10458 5.10324 4.05101L6.59003 0.646465Z"
                  fill="#FFB800"
                />
              </svg>
              <span className="text-lg text-[#6A6A6A]">{item}</span>
            </div>
          ))}
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex gap-x-4 items-center ">
            <svg
              width="55"
              height="53"
              viewBox="0 0 35 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8234 1.39058C16.2724 0.00861251 18.2276 0.00860948 18.6766 1.39058L21.628 10.4742C21.8288 11.0922 22.4048 11.5106 23.0546 11.5106H32.6057C34.0587 11.5106 34.6629 13.3701 33.4873 14.2242L25.7604 19.8381C25.2346 20.2201 25.0147 20.8972 25.2155 21.5152L28.1669 30.5988C28.6159 31.9807 27.0342 33.1299 25.8586 32.2758L18.1317 26.6619C17.6059 26.2799 16.8941 26.2799 16.3683 26.6619L8.64136 32.2758C7.46579 33.1299 5.88407 31.9807 6.33309 30.5988L9.28453 21.5152C9.48534 20.8972 9.26536 20.2201 8.73963 19.8381L1.01266 14.2242C-0.162908 13.3701 0.441253 11.5106 1.89434 11.5106H11.4454C12.0952 11.5106 12.6712 11.0922 12.872 10.4742L15.8234 1.39058Z"
                fill="#FC6B00"
              />
            </svg>

            <span className="font-bold text-8xl text-black">
              {" "}
              {calculateAverageRating(comments.map((item) => item.rating))}{" "}
            </span>
          </div>

          <div className="w-[300px] h-[50px] bg-black rounded-full flex items-center justify-center gap-x-2">
            <span className="text-white text-lg">reviews</span>
            <span className="text-white text-lg">{comments.length}</span>
            <div className="flex w-[100px]  justify-end items-center  -space-x-2 ">
              {comments.length > 3 && (
                <div className=" h-8 w-8 rounded-full ring-2 flex items-center justify-center bg-white ring-white">
                  {" "}
                  <span className="text-black text-xl font-bold">
                    +{comments.length - 3}
                  </span>{" "}
                </div>
              )}
              {comments[0] && (
                <img
                  width={10}
                  height={10}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={
                    "https://cdn.pixabay.com/photo/2021/11/12/03/04/woman-6787784_640.png"
                  }
                  alt=""
                />
              )}

              {comments[1] && (
                <img
                  width={10}
                  height={10}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={comments[1].studentImage}
                  alt=""
                />
              )}
              {comments[2] && (
                <img
                  width={10}
                  height={10}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={comments[2].studentImage}
                  alt=""
                />
              )}
            </div>{" "}
          </div>
        </div>
      </div>

      <div className=" h-[70px] w-full flex justify-between items-center px-4  ">
        {isAuthanticated && <AddReview color={color} course={course} />}

        <span className="font-bold text-2xl text-black">
          All Reviews ({comments.length})
        </span>
      </div>
      <div
        dir="ltr"
        className={` min-h-[50px] h-fit flex flex-col justify-start items-star gap-y-4 w-full `}
      >
        {comments.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-start h-fit min-h-[100px] justify-start gap-x-2 px-6"
            >
              <Avatar className="w-10 h-10 mt-4">
                <AvatarImage src={item.studentImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="w-full h-[40px] flex flex-col  justify-start items-start p-4">
                <p className="font-bold text-md">{item.studentName}</p>
                <div className="w-full h-[20px] flex items-center justify-start gap-x-4">
                  <StarRatings
                    starRatedColor="#FFB800"
                    rating={item.rating}
                    starDimension="20px"
                    starSpacing="1px"
                  />
                  <span className="text-gray-500 text-sm">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <div className="w-full h-fit p-2">
                  <p className="text-black text-start text-xl">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Raitings;
