"use client";

import type { FC } from "react";
import { useTypewriter } from "react-simple-typewriter";

const TextTyper: FC = ({}) => {
  const [text] = useTypewriter({
    words: ["خبراتك التعليمية ", "دوراتك التدريبية "],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <span
      className="text-[#FC6B00] qatar-bold inline-flex items-center justify-center min-w-fit h-fit whitespace-nowrap mx-2 sm:mx-2 border-[#FC6B00] border-2 rounded-full bg-[#F8FAE5] px-3 py-2.5 mt-2 sm:mt-0"
      style={{ fontFamily: "Qatar2022 Arabic bold" }}
    >
      {text}
    </span>
  );
};

export default TextTyper;
