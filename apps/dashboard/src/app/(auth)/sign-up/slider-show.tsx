"use client";

import { useEffect, type FC } from "react";

import { Card, CardContent } from "@ui/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/components/ui/carousel";
import Image from "next/image";
import { maketoast } from "@/src/components/toasts";

const Items = [
  {
    title: "إعطي تجربة أفضل لطلابك من خلال إختبارات",
    image: "/roupes/groupe-2.png",
  },
  {
    title: "أنشئ أكادميتك اونلاين وأرفع دورتك التدريبية",
    image: "/roupes/groupe-1.png",
  },

  {
    title: "إحمي دوراتك ومحتواك من السرقة وبع بكل سهولة",
    image: "/roupes/groupe-3.png",
  },
  {
    title: "إحمي دوراتك ومحتواك من السرقة وبع بكل سهولة",
    image: "/roupes/groupe-4.png",
  },
];

const SliderShow: FC = ({}) => {
  return (
    <>
      <Carousel dir="ltr" className="w-full h-full p-0 m-0  ">
        <CarouselNext className="hidden" />
        <CarouselPrevious className="hidden" />

        <CarouselContent className="w-full h-[calc(100%-50px)]  p-0 m-0 ">
          {Items.map((item, index) => (
            <CarouselItem
              className="w-full  h-full m-0 flex items-center justify-center p-4 relative "
              key={item.title}
            >
              <img
                src={item.image}
                alt="this is an image"
                className="w-full h-full "
              />
              <div>
                <h2 className="text-2xl font-bold text-white absolute bottom-10 z-[10] mx-4">
                  {item.title}
                </h2>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default SliderShow;
