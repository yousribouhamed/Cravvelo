"use client";

import type { FC } from "react";
import { Typewriter } from "react-simple-typewriter";
interface TextTyperAbdullahProps {}

const TextTyper: FC = ({}) => {
  return (
    <span
      className="text-[#FC6B00]      mx-2 border-[#FC6B00] border-2 rounded-full inline-block bg-[#F8FAE5] px-3 py-2.5 "
      style={{ fontFamily: "Qatar2022 Arabic bold" }}
    >
      <Typewriter
        words={["خبراتك التعليمية ", "برامجك التدريبية "]}
        cursor
        cursorStyle="|"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
        loop={false}
      />
    </span>
  );
};

export default TextTyper;
