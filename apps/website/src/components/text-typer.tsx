"use client";

import type { FC } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const TextTyper: FC = ({}) => {
  const [text, count] = useTypewriter({
    words: ["خبراتك التعليمية ", "برامجك التدريبية "],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <span
      className="text-[#FC6B00] qatar-bold    mx-2 border-[#FC6B00] border-2 rounded-full inline-block bg-[#F8FAE5] px-3 py-2.5 "
      style={{ fontFamily: "Qatar2022 Arabic bold" }}
    >
      {text}
    </span>
  );
};

export default TextTyper;
