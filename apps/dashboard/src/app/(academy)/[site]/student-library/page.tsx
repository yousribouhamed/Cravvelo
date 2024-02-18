import React from "react";
import LibraryNavigation from "../../_components/library-navigation";
import { authorization, getStudent } from "../../actions/auth";
import { StudentBag } from "@/src/types";
import Link from "next/link";

async function Page() {
  await authorization();

  const student = await getStudent();

  const bag = JSON.parse(student.bag as string) as StudentBag;
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-[100px] flex items-center justify-start">
        <h1 className="text-3xl font-bold"> المكتبة الرقمية</h1>
      </div>
      <LibraryNavigation />
      <div className="w-full h-full flex flex-wrap gap-6 my-8">
        {Array.isArray(bag?.courses) && bag?.courses?.length === 0 && (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-xl font-bold">انت لم تقم ببناء اي كورس بعد</p>
          </div>
        )}
        {bag?.courses?.map((item, index) => {
          return (
            <div
              key={item.title + index}
              className="w-[320px] min-h-[300px] h-fit p-0  border  flex flex-col shadow rounded-xl  transition-all duration-700 bg-white cursor-pointer "
            >
              <img
                src={item.thumnailUrl}
                className="w-full h-[200px] rounded-t-xl object-cover "
              />
              <div className="w-full h-[50px] px-4 flex items-center justify-between my-4">
                <h2 className="text-black font-semibold text-lg text-start ">
                  {item.title}
                </h2>
              </div>

              {/* this will hold the price */}

              <div className="w-full h-[70px] px-4 flex items-center justify-center gap-x-4  p-2">
                <Link
                  href={`/course-academy/${item.id}/course-player`}
                  className="w-[80%] bg-blue-500 hover:bg-blue-600 text-white p-2 h-[45px] flex items-center justify-center rounded-xl"
                >
                  شاهد الان
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
