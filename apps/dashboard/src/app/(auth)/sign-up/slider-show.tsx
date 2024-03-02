"use client";

import type { FC } from "react";

import { Card, CardContent } from "@ui/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/components/ui/carousel";
import Image from "next/image";

const Items = [
  {
    title: "أنشئ أكادميتك اونلاين وأرفع دورتك التدريبية",
    image: "/roupes/groupe-1.png",
  },
  {
    title: "إعطي تجربة أفضل لطلابك من خلال إختبارات",
    image: "/roupes/groupe-2.png",
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

interface SliderShowProps {}

const SliderShow: FC = ({}) => {
  return (
    <Carousel className="w-full h-full p-0 m-0 ">
      <CarouselContent className="w-full h-full  p-0 m-0 ">
        {Items.map((item, index) => (
          <CarouselItem
            className="w-full h-full p-0 m-0 flex items-center justify-center  "
            key={index}
          >
            <img
              src={item.image}
              alt="this is an image"
              className="w-full h-full "
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SliderShow;
