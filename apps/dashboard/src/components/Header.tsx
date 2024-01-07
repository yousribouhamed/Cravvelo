import type { FC } from "react";
import { SearcInput } from "./search";
import UserNav from "./user-nav";
import { Button } from "@ui/components/ui/button";
import { Icons } from "./Icons";

const Header: FC = ({}) => {
  return (
    <div className="w-full h-[96px] flex justify-between items-center border-b px-4">
      <div className="w-[30%] h-full flex items-center justify-start">
        <h1 className="text-xl font-bold text-start">الرئيسية</h1>
      </div>
      <div className="w-[30%] h-full flex items-center justify-center">
        <SearcInput />
      </div>

      <div className="w-[30%]  h-full flex items-center justify-end gap-x-4">
        <Button size="icon" variant="ghost">
          <Icons.bell className="w-5 h-5" />
        </Button>
        <UserNav />
      </div>
    </div>
  );
};

export default Header;
