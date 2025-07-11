import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Image from "next/image";
import type { FC } from "react";

const CreateLanch: FC = ({}) => {
  return (
    <MaxWidthWrapper className="my-6   ">
      <section
        id="WHIY_US"
        className="mx-auto w-full my-14  lg:max-w-screen-2xl min-h-[300px] h-fit   grid grid-cols-1 lg:grid-cols-2 px-2 md:px-8 lg:px-0  "
      >
        <div className="w-full h-full flex flex-col items-start ">
          <div className="w-full mt-8 h-[60px] relative flex items-center justify-start ">
            <div className="bg-black w-[60px] h-[60px] rounded-[50%] flex items-center justify-center absolute -right-5 md:right-0 top-0 z-10 ">
              <svg
                width="39"
                height="39"
                viewBox="0 0 59 59"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.4808 0.539062L33.7112 19.2674L49.9455 9.01585L39.694 25.2502L58.4223 29.4806L39.694 33.7111L49.9455 49.9454L33.7112 39.6938L29.4808 58.4222L25.2503 39.6938L9.01597 49.9454L19.2675 33.7111L0.539185 29.4806L19.2675 25.2502L9.01597 9.01585L25.2503 19.2674L29.4808 0.539062Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className=" w-[200px]  md:w-[250px]  lg:w-[270px] h-[70px]  rounded-2xl  bg-primary flex items-center justify-center absolute  -bottom-8 p-2 rotate-6 right-3 md:right-5">
              <p className=" text-xl md:text-3xl font-extrabold text-white">
                أنشئ، وأطلق
              </p>
            </div>
            <div className=" w-[150px] md:w-[250px] lg:w-[270px] h-[70px]  rounded-2xl  bg-[#FFC901] flex items-center justify-center p-2 absolute right-[12rem] lg:right-[17.5rem] top-0 -rotate-12 z-10">
              <p className=" text-xl md:text-3xl font-extrabold text-black">
                {" "}
                دورتك التدريبية
              </p>
            </div>
          </div>

          <p className="text-xl text-black text-start mt-[100px]">
            حوّل معرفتك وخبرتك إلى عمل ناجح عبر الإنترنت بسهولة وتجربة جزائرية
            استثنائية.
          </p>
        </div>
        <div className=" border h-[400px] shadow-2xl relative rounded-2xl mt-16 p-4 col-span-1">
          <Image
            src={"/money-man.jpg"}
            alt="money"
            fill
            className="rounded-2xl object-cover"
          />
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default CreateLanch;
