import type { FC } from "react";
import { SearcInput } from "./search";
import UserNav from "./user-nav";
import { Button } from "@ui/components/ui/button";
import { Icons } from "./Icons";

interface Props {
  title: string;
}

const Header: FC<Props> = ({ title }) => {
  return (
    <div className="w-full h-[96px] flex justify-between items-center  px-4">
      <div className="w-[25%] h-full flex items-center justify-start gap-x-2">
        {/* <Button
          size="icon"
          className="!bg-[#EDEDED] rounded-[8px]"
          variant="ghost"
        >
          <Icons.bell className="w-4 h-4 text-[#43766C]" />
        </Button> */}
        <h1 className="text-xl font-bold text-start">{title}</h1>
      </div>
      <div className="w-[50%] h-full flex items-center justify-center">
        <SearcInput />
      </div>

      <div className="w-[25%]  h-full flex items-center justify-end gap-x-2">
        <Button size="icon" variant="ghost">
          <Icons.bell className="w-4 h-4 text-[#353E5C]" />
        </Button>
        <UserNav />
      </div>
    </div>
  );
};

export default Header;
