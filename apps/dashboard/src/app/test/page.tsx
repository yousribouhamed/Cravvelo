"use client";

import { type FC } from "react";
import Image from "next/image";
import axios from "axios";
import { maketoast } from "@/src/components/toasts";

const page: FC = ({}) => {
  const makeCall = async () => {
    maketoast.error();
    maketoast.info();
    maketoast.warnning();
  };
  return (
    <div className="w-full h-screen flex items-center  flex-col gap-y-8 justify-center pt-12">
      <button onClick={makeCall}>click me</button>
    </div>
  );
};

export default page;
