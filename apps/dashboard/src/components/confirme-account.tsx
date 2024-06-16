"use client";

import Link from "next/link";
import type { FC } from "react";

const ConfirmeAccount: FC = ({}) => {
  return (
    <div className="w-full min-h-[300px] h-fit mt-8 bg-white rounded-xl shadow border flex items-center  gap-x-4 p-8">
      <div className=" w-[50%] 2xl:w-[60%] h-full flex flex-col items-start justify-start p-4 border rounded-xl">
        <h2 className="text-xl font-bold">دعنا نذهب لتأكيد حسابك ❤️</h2>

        <div className="w-full h-[30px]  flex  justify-start items-center gap-x-4 px-4  my-4">
          <div className="bg-[#2ECA8B] rounded-[50%] w-6 h-6 flex items-center justify-center">
            <span className="text-white font-bold">1</span>
          </div>
          <Link
            href={"/profile"}
            className="flex items-center justify-start gap-x-2"
          >
            <p className="text-lg hover:underline">قم بانهاء ملفك الشخصي</p>
          </Link>
        </div>
        <div className="w-full h-[30px]  flex  justify-start items-center gap-x-4 px-4  my-4">
          <div className="bg-[#2ECA8B] rounded-[50%] w-6 h-6 flex items-center justify-center">
            <span className="text-white font-bold">2</span>
          </div>
          <Link href={"/courses"}>
            <p className="text-lg hover:underline">قم بانشاء أكاديمية الخاصة</p>
          </Link>
        </div>
        <div className="w-full h-[30px]  flex  justify-start items-center gap-x-4 px-4  my-4">
          <div className="bg-[#2ECA8B] rounded-[50%] w-6 h-6 flex items-center justify-center">
            <span className="text-white font-bold">3</span>
          </div>
          <Link href={"/settings/payments-methods"}>
            <p className="text-lg hover:underline">ادخل وسيلة الدفع</p>
          </Link>
        </div>
        <div className="w-full h-[30px]  flex  justify-start items-center gap-x-4 px-4  my-4">
          <div className="bg-[#2ECA8B] rounded-[50%] w-6 h-6 flex items-center justify-center">
            <span className="text-white font-bold">4</span>
          </div>
          <Link href={"/settings/payments-methods"}>
            <p className="text-lg hover:underline">
              {" "}
              قم بتخصيص سياسة الاكاديمية
            </p>
          </Link>
        </div>
      </div>
      <div className=" w-[50%] 2xl:w-[40%] h-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <iframe
            width="460"
            height="315"
            className="!rounded-2xl"
            src="https://www.youtube.com/embed/a_feKqxjY-4?si=SDZlRSzMXzjHIkU0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ConfirmeAccount;
