"use client";

import { BookMarked } from "lucide-react";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { Course } from "database";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@ui/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";

interface Props {
  courses: Course[];
  color: string;
}

const CoursesGrid: FC<Props> = ({ courses, color }) => {
  const router = useRouter();

  const handleNavigate = ({ id }: { id: string }) => {
    router.push(`/course-academy/${id}`);
  };

  return (
    <div className="grid grid-cols-4 h-fit   gap-x-16">
      <div className="w-full min-w-[300px] hidden sm:flex sm:col-span-1 p-4 min-h-[200px] h-fit bg-white border rounded-xl  flex-col gap-y-4 pt-8 gap-x-4">
        <RadioGroup defaultValue="option-one">
          <div dir="rtl" className="w-full h-[20px] ">
            <span>التقييم</span>
          </div>

          <div dir="rtl" className="flex items-center gap-x-4 my-2">
            <RadioGroupItem value="option-two" id="option-two" />
            <StarRatings
              starRatedColor="#FFB800"
              rating={4}
              starDimension="20px"
              starSpacing="1px"
            />
            <span>4 نجوم او اعلى</span>
          </div>
          <div dir="rtl" className="flex items-center gap-x-4  my-2">
            <RadioGroupItem value="option-three" id="option-three" />
            <StarRatings
              starRatedColor="#FFB800"
              rating={3}
              starDimension="20px"
              starSpacing="1px"
            />
            <span>3 نجوم او اعلى</span>
          </div>
          <div dir="rtl" className="flex items-center gap-x-4  my-2 ">
            <RadioGroupItem value="option-four" id="option-four" />
            <StarRatings
              starRatedColor="#FFB800"
              rating={2}
              starDimension="20px"
              starSpacing="1px"
            />
            <span>2 نجوم او اعلى</span>
          </div>
        </RadioGroup>

        <div className="w-full h-fit min-h-[50px] flex flex-col gap-y-4">
          <div dir="rtl" className="w-full h-[20px] ">
            <span>مدة الدورة</span>
          </div>
          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              اقل من ساعة
            </label>
          </div>
          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              اقل من ثلاث ساعات
            </label>
          </div>
          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              اكثر من ثلاث ساعات
            </label>
          </div>
        </div>

        <div className="w-full h-fit min-h-[50px] flex flex-col gap-y-4">
          <div dir="rtl" className="w-full h-[20px] ">
            <span>السعر</span>
          </div>

          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              مدفوع
            </label>
          </div>

          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              تخفيض
            </label>
          </div>
          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              مجاني
            </label>
          </div>
        </div>
        <div className="w-full h-fit min-h-[50px] flex flex-col gap-y-4">
          <div dir="rtl" className="w-full h-[20px] ">
            <span>المستوى</span>
          </div>

          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              كل المستويات
            </label>
          </div>

          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              مبتدئ
            </label>
          </div>

          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              متوسط
            </label>
          </div>

          <div className="flex items-center gap-x-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              محترف
            </label>
          </div>
        </div>
        <div className="w-full h-fit min-h-[50px] flex flex-col p-4 mb-6">
          <button
            className="w-full h-[50px]   flex items-center justify-center text-white rounded-xl"
            style={{
              background: color,
            }}
          >
            تصفية النتائج
          </button>
        </div>
      </div>

      <div className=" col-span-4 p-4 pt-0  sm:col-span-3">
        <div className="flex flex-wrap   gap-8 w-full h-full mim-h-[500px] ">
          {Array.isArray(courses) && courses.length === 0 && (
            <div className="w-full h-[300px] flex flex-col gap-y-4 items-center justify-center">
              <Image
                src="/academia/no-video.svg"
                alt="this is the error page"
                width={400}
                height={400}
              />
              <p className="text-2xl font-bold">
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
                    src={item.thumbnailUrl}
                    className="  object-cover rounded-t-xl"
                    fill
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
                  <button
                    onClick={() => handleNavigate({ id: item.id })}
                    className="w-[99%]  text-white p-2 h-[45px] rounded-lg"
                    style={{
                      background: color,
                    }}
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
