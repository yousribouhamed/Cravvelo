"use client";

import { type FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

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
      <Carousel
        plugins={[
          //@ts-ignore
          Autoplay({
            delay: 2000,
          }),
        ]}
        dir="ltr"
        className="w-full h-full p-0 m-0  "
      >
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
              <div
                dir="rtl"
                className="absolute bottom-10 z-[10] w-full h-[200px] flex flex-col justify-center items-start p-4"
              >
                <h2 className="text-3xl font-bold text-white  mx-4">
                  {item.title}
                </h2>

                <Image
                  src="/logo-in-white.png"
                  alt="cravvelo logo in white"
                  width={100}
                  height={30}
                  className="absolute bottom-2 left-8"
                  loading="eager"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default SliderShow;
