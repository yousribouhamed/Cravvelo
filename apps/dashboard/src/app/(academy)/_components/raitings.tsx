import type { FC } from "react";
import AddReview from "./add-review";

const avrage = [5, 4, 3, 2, 1];

const Raitings: FC = ({}) => {
  return (
    <div className="w-full flex flex-col bg-white min-h-[400px] border rounded-xl ">
      <div className="w-full h-[250px]  grid grid-cols-2 ">
        <div className="w-full h-full  flex flex-col p-4 ">
          {avrage.map((item) => (
            <div className="w-full h-[40px] flex justify-start items-center gap-x-4">
              <div className="w-[300px] h-[9px] rounded-xl bg-primary" />
              <svg
                width="24"
                height="23"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.59003 0.646465C6.75842 0.128228 7.49158 0.128229 7.65997 0.646466L8.76676 4.05281C8.84206 4.28458 9.05804 4.44149 9.30173 4.44149H12.8834C13.4283 4.44149 13.6548 5.13877 13.214 5.45906L10.3164 7.5643C10.1192 7.70754 10.0367 7.96143 10.1121 8.1932L11.2188 11.5995C11.3872 12.1178 10.7941 12.5487 10.3532 12.2284L7.45563 10.1232C7.25848 9.97996 6.99152 9.97996 6.79437 10.1232L3.89676 12.2284C3.45592 12.5487 2.86277 12.1178 3.03116 11.5995L4.13795 8.1932C4.21325 7.96143 4.13076 7.70754 3.93361 7.5643L1.036 5.45906C0.595158 5.13877 0.82172 4.44149 1.36663 4.44149H4.94827C5.19196 4.44149 5.40794 4.28458 5.48324 4.05281L6.59003 0.646465Z"
                  fill="#FC6B00"
                />
              </svg>
              <span className="text-lg text-[#6A6A6A]">{item}</span>
            </div>
          ))}
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex gap-x-4 items-center ">
            <svg
              width="55"
              height="53"
              viewBox="0 0 35 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8234 1.39058C16.2724 0.00861251 18.2276 0.00860948 18.6766 1.39058L21.628 10.4742C21.8288 11.0922 22.4048 11.5106 23.0546 11.5106H32.6057C34.0587 11.5106 34.6629 13.3701 33.4873 14.2242L25.7604 19.8381C25.2346 20.2201 25.0147 20.8972 25.2155 21.5152L28.1669 30.5988C28.6159 31.9807 27.0342 33.1299 25.8586 32.2758L18.1317 26.6619C17.6059 26.2799 16.8941 26.2799 16.3683 26.6619L8.64136 32.2758C7.46579 33.1299 5.88407 31.9807 6.33309 30.5988L9.28453 21.5152C9.48534 20.8972 9.26536 20.2201 8.73963 19.8381L1.01266 14.2242C-0.162908 13.3701 0.441253 11.5106 1.89434 11.5106H11.4454C12.0952 11.5106 12.6712 11.0922 12.872 10.4742L15.8234 1.39058Z"
                fill="#FC6B00"
              />
            </svg>
            <span className="font-bold text-8xl text-black">4.5 </span>
          </div>

          <div className="w-[300px] h-[50px] bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-lg">653 reviews</span>
          </div>
        </div>
      </div>
      <div className="w-full h-2 border-b" />
      <div className="h-[70px] w-full flex justify-between items-center px-4 ">
        <AddReview />
        <span className="font-bold text-2xl text-black">All Reviews (1)</span>
      </div>
      <div className="h-[70px] w-full  justify-between items-center ">
        <div className="">
          <span>this is a raiting</span>
        </div>
      </div>
    </div>
  );
};

export default Raitings;
