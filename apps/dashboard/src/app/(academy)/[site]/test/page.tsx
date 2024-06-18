"use client";

import { Button } from "@ui/components/ui/button";
import { academiatoast } from "../../_components/academia-toasts";
import toast from "react-hot-toast";

const Loading = async () => {
  return (
    <div className="   w-full h-fit min-h-screen flex flex-col gap-4 items-center justify-center py-4">
      <Button
        onClick={() => {
          toast.success("تم تسجيل الدخول بنجاح");
        }}
      >
        show me toats
      </Button>
    </div>
  );
};

export default Loading;
