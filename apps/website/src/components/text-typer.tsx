"use client";

import type { FC } from "react";
import { useTypewriter } from "react-simple-typewriter";

const TextTyper: FC = ({}) => {
  const [text] = useTypewriter({
    words: ["خبراتك التعليمية ", "دوراتك  التدريبية "],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <span
      className="text-[#FC6B00] qatar-bold min-w-[10px] h-fit sm:h-[60px] w-fit mt-[10px] sm:mt-[0]  mx-2 border-[#FC6B00] border-2 rounded-full block sm:inline-block bg-[#F8FAE5] px-3 py-2.5 "
      style={{ fontFamily: "Qatar2022 Arabic bold" }}
    >
      {text}
    </span>
  );
};

export default TextTyper;
