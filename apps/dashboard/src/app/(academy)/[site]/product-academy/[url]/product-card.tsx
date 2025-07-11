"use client";

import { Comment, Product } from "database";
import { useAcademiaStore } from "../../../global-state/academia-store";
import { ArrowBigUp, Headphones, Clock, User, Star, Globe } from "lucide-react";
import { Infinity } from "lucide-react";
import { calculateDiscountPercentage } from "../../../lib";
import { useTimer } from "react-timer-hook";
import React from "react";

const formatVideoLength = (sizeInBytes) => {
  const totalSeconds = sizeInBytes / 1000; // Convert bytes to seconds
  const OurHours = Math.floor(totalSeconds / 3600);
  const OurMinutes = Math.floor((totalSeconds % 3600) / 60);
  const OurSeconds = Math.floor(totalSeconds % 60);

  const expiryTimestamp = new Date();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600 * 12);

  let formattedTime = "";
  if (OurHours > 0) {
    formattedTime += `${OurHours} ساعة و `;
  }
  if (OurMinutes > 0) {
    formattedTime += `${OurMinutes} دقيقة و `;
  }
  formattedTime += `${OurSeconds} ثانية`;

  return formattedTime.trim();
};

// {formatVideoDuration(product.length)}

export const Product_card = ({
  product,
  color,
}: {
  product: Product;

  color: string;
}) => {
  const { actions, state } = useAcademiaStore();

  const expiryTimestamp = new Date();

  const [isFixed, setIsFixed] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 64;
      setIsFixed(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600 * 6);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div
      className={` ${
        isFixed ? "  " : ""
      } w-full lg:w-[350px] relative min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 2xl:sticky 2xl:top-[120px] bg-white mt-6 `}
    >
      <span
        className=" text-xs text-white p-2 rounded-full absolute -top-5 right-0"
        style={{ backgroundColor: color }}
      >
        dis
        {calculateDiscountPercentage(
          Number(product.price),
          Number(product.compareAtPrice)
        )
          ? calculateDiscountPercentage(
              Number(product.price),
              Number(product.compareAtPrice)
            )
          : 0}
        %
      </span>
      <p className="text-2xl font-bold text-start text-black">
        DZD {product.price}.00
      </p>
      <p>
        <span className="line-through text-red-500 text-lg">
          DZD {product.compareAtPrice}.00
        </span>{" "}
      </p>

      <button
        onClick={() => {
          actions.addItem({
            type: "PRODUCT",
            id: product.id,
            imageUrl: product.thumbnailUrl,
            name: product.title,
            price: product.price.toString(),
          });
        }}
        disabled={state.shoppingBag.length > 0}
        className="w-full h-12 rounded-lg  text-white flex items-center justify-center border-black disabled:cursor-not-allowed disabled:opacity-[50%]"
        style={{
          background: color ?? "#FC6B00",
        }}
      >
        اضف الى السلة
      </button>

      <div
        dir="ltr"
        className="w-full h-[20px] flex items-center justify-end  gap-x-2 text-red-500"
      >
        <div className="min-w-[10px] w-fit flex items-center justify-start ">
          <span className="text-sm ">{hours}</span>:
          <span className="text-sm ">{minutes}</span>:
          <span className="text-sm ">{seconds}</span>
        </div>
        <span className=" text-sm">ينتهي هذا العرض عند</span>
      </div>

      <div className="border-b w-full h-1 my-1" />

      <div className="w-full flex items-center justify-start gap-x-4">
        <User
          className="w-5 h-5 "
          style={{
            color: color ?? "#FC6B00",
          }}
        />
        <span>
          {product.numberOfDownloads ? product.numberOfDownloads : 0} عدد
          التحميلات
        </span>
      </div>

      <div className="w-full flex items-center justify-start gap-x-4">
        <Globe
          className="w-5 h-5 "
          style={{
            color: color ?? "#FC6B00",
          }}
        />
        <span>عبر الإنترنت وبالسرعة التي تناسبك</span>
      </div>
      <div className="w-full flex items-center justify-start gap-x-4">
        <Headphones
          className="w-5 h-5 "
          style={{
            color: color ?? "#FC6B00",
          }}
        />
        <span>الصوت: عربي</span>
      </div>

      <div className="w-full flex items-center justify-start gap-x-4">
        <ArrowBigUp
          className="w-5 h-5 "
          style={{
            color: color ?? "#FC6B00",
          }}
        />
        <span>المستوى: مبتدئ</span>
      </div>

      <div className="w-full flex items-center justify-start gap-x-4">
        <Infinity
          className="w-5 h-5 "
          style={{
            color: color ?? "#FC6B00",
          }}
        />
        <span>وصول غير محدود إلى الأبد</span>
      </div>
    </div>
  );
};
