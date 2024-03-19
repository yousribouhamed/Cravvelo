"use client";

import { type FC } from "react";
import { Button } from "@ui/components/ui/button";
import { maketoast } from "@/src/components/toasts";

const page: FC = ({}) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Button onClick={() => maketoast.error()}>maketoast</Button>
    </div>
  );
};

export default page;
