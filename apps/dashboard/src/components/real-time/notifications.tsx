import type { FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { Button } from "@ui/components/ui/button";
import { Icons } from "../Icons";
import Image from "next/image";

interface notificationsAbdullahProps {}

const Notifications: FC = ({}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white border rounded-xl "
        >
          <Icons.bell className="w-4 h-4 text-black " />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <div className="w-[500px] h-[400px] shadow bg-white p-2">
          <div className="w-full border-b h-[70px] flex items-center justify-start">
            <p className="text-xl font-bold">الإشعارات</p>
          </div>
          <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
            <Image
              alt="verified image"
              src="/notifications.svg"
              width={300}
              height={300}
            />
            <p className="text-md text-center text-gray-500">
              لا يوجد إشعارات غير مقروءة بعد
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
