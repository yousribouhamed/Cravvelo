import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import Image from "next/image";

interface NotFoundCardAbdullahProps {
  text?: string;
}

export const NotFoundCard: FC<NotFoundCardAbdullahProps> = ({ text }) => {
  return (
    <Card className="w-full bg-transparent h-full min-h-[200px] min-w-[200px] border-none shadow-none">
      <CardContent className="w-full h-full flex items-center flex-col gap-y-4 justify-center">
        <Image
          src="/mintad.svg"
          alt="this is the error page"
          width={200}
          height={200}
        />
        <p className="text-xl font-bold text-center">
          {text ? "" : "لا يوجد أي عناصر"}
        </p>
      </CardContent>
    </Card>
  );
};
