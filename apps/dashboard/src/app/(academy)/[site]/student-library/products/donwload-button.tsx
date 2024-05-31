"use client";

import { Button } from "@ui/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { FC } from "react";

interface DonwloadButtonProps {
  fileUrl: string;
}

const DonwloadButton: FC<DonwloadButtonProps> = ({ fileUrl }) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-center gap-x-2 p-2">
      <Button
        onClick={() => {
          window.open(fileUrl, "_blank", "noopener,noreferrer");
        }}
        className="flex items-center justify-center gap-x-2"
      >
        <ExternalLink className="w-4 h-4 text-white" />
        تحميل الملف
      </Button>
    </div>
  );
};

export default DonwloadButton;
