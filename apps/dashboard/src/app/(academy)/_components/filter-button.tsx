"use client";
import { Button } from "@ui/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/sheet";
import { Filter } from "lucide-react";
import { Checkbox } from "@ui/components/ui/checkbox";
import StarRatings from "react-star-ratings";
import type { FC } from "react";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import { ScrollArea } from "@ui/components/ui/scroll-area";

const FilterButtonMobile: FC = ({}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Filter className="w-4 h-4 " />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full w-full">
          <div
            dir="rtl"
            className="w-full   flex p-4 min-h-[200px] h-fit bg-white  rounded-xl  flex-col gap-y-4 pt-8 gap-x-4"
          >
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
              <button className="w-full h-[50px]  bg-primary flex items-center justify-center text-white rounded-xl">
                تصفية النتائج
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FilterButtonMobile;
