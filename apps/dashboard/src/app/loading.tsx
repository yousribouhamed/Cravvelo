"use client";

import type { FC } from "react";
import { Spinner as CravveloSpinner } from "@geist-ui/core";

const Loading: FC = ({}) => {
  return (
    <div className="w-full min-h-[400px] h-full flex items-center justify-center">
      <CravveloSpinner />
    </div>
  );
};

export default Loading;
