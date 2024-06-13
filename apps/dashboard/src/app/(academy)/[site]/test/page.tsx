"use client";

import { Button } from "@ui/components/ui/button";
import { academiatoast } from "../../_components/academia-toasts";

const Loading = async () => {
  return (
    <div className="   w-full h-fit min-h-screen flex flex-col gap-4 items-center justify-center py-4">
      <Button
        onClick={() => {
          academiatoast.make({
            color: "9fe870",
            message: "أوديسي العمل الحر",
            title: "أوديسي  ",
            type: "ERROR",
          });
        }}
      >
        open
      </Button>
    </div>
  );
};

export default Loading;
