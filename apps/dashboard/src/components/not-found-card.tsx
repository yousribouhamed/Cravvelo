import type { FC } from "react";
import { Card, CardContent } from "@ui/components/ui/card";
import Image from "next/image";

interface NotFoundCardAbdullahProps {
  text?: string;
  src?: string;
}

export const NotFoundCard: FC<NotFoundCardAbdullahProps> = () => {
  return (
    <Card className="w-full  min-h-[100px] h-fit min-w-[200px] mt-8 bg-transparent border-none shadow-none flex items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center gap-y-1">
        <Image
          src="/empty-box.svg"
          alt="this is the error page"
          width={150}
          height={150}
          className="opacity-80 dark:opacity-70"
        />
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
          لا يوجد أي عناصر
        </p>
      </CardContent>
    </Card>
  );
};
