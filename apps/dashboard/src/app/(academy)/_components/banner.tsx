import Image from "next/image";
import type { FC } from "react";

interface BannerProps {}

const Banner: FC = ({}) => {
  return (
    <div className="w-full h-[250px] bg-primary rounded-xl my-10 grid grid-cols-2 ">
      <div className=" w-full flex flex-col gap-y-2 justify-between items-start p-4">
        <div className="flex flex-col gap-y-4">
          <span className="text-2xl text-white">مرحباً بك في آكاديمية</span>
          <h2 className="text-4xl font-bold text-white">يسري بوحامد</h2>
        </div>

        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white flex items-center gap-x-2">
          يعمل بواسطة{" "}
          <a
            href="https://www.cravvelo.com"
            className="font-semibold text-primary"
          >
            <Image
              src="/cravvelo-logo.svg"
              alt="cravvelo logo"
              width={60}
              height={12}
            />
          </a>
        </div>
      </div>

      <div className="w-full h-full relative flex items-center justify-center overflow-hidden ">
        <div className="absolute top-[0] left-4">
          <svg
            width="81"
            height="69"
            viewBox="0 0 61 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.5 -59C30.5 -59 28.8172 -28.6154 22.2622 -15.9354C15.7073 -3.25534 0 -3.8147e-06 0 -3.8147e-06C0 -3.8147e-06 15.7073 3.25534 22.2622 15.9354C28.8172 28.6154 30.5 59 30.5 59C30.5 59 32.1828 28.6154 38.7378 15.9354C45.2927 3.25534 61 -3.8147e-06 61 -3.8147e-06C61 -3.8147e-06 45.2927 -3.25534 38.7378 -15.9354C32.1828 -28.6154 30.5 -59 30.5 -59Z"
              fill="white"
              fill-opacity="0.1"
            />
          </svg>
        </div>
        <svg
          width="120"
          height="120"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 0C40 0 37.793 20.5997 29.1964 29.1964C20.5997 37.793 0 40 0 40C0 40 20.5997 42.207 29.1964 50.8036C37.793 59.4003 40 80 40 80C40 80 42.207 59.4003 50.8036 50.8036C59.4003 42.207 80 40 80 40C80 40 59.4003 37.793 50.8036 29.1964C42.207 20.5997 40 0 40 0Z"
            fill="white"
            fill-opacity="0.25"
          />
        </svg>

        <div className="absolute bottom-0 left-0">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 0C40 0 37.793 20.5997 29.1964 29.1964C20.5997 37.793 0 40 0 40C0 40 20.5997 42.207 29.1964 50.8036C37.793 59.4003 40 80 40 80C40 80 42.207 59.4003 50.8036 50.8036C59.4003 42.207 80 40 80 40C80 40 59.4003 37.793 50.8036 29.1964C42.207 20.5997 40 0 40 0Z"
              fill="white"
              fill-opacity="0.1"
            />
          </svg>
        </div>

        <div className="absolute right-0 top-5">
          <svg
            width="61"
            height="60"
            viewBox="0 0 61 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.5 0C30.5 0 28.8172 15.4498 22.2622 21.8973C15.7073 28.3447 0 30 0 30C0 30 15.7073 31.6553 22.2622 38.1027C28.8172 44.5502 30.5 60 30.5 60C30.5 60 32.1828 44.5502 38.7378 38.1027C45.2927 31.6553 61 30 61 30C61 30 45.2927 28.3447 38.7378 21.8973C32.1828 15.4498 30.5 0 30.5 0Z"
              fill="white"
              fill-opacity="0.1"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 right-28">
          <svg
            width="80"
            height="59"
            viewBox="0 0 80 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 0C40 0 37.793 30.3846 29.1964 43.0646C20.5997 55.7447 0 59 0 59C0 59 20.5997 62.2553 29.1964 74.9354C37.793 87.6154 40 118 40 118C40 118 42.207 87.6154 50.8036 74.9354C59.4003 62.2553 80 59 80 59C80 59 59.4003 55.7447 50.8036 43.0646C42.207 30.3846 40 0 40 0Z"
              fill="white"
              fill-opacity="0.1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Banner;
