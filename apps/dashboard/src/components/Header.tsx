"use client";

import type { FC } from "react";
import { SearchInput } from "./search";
import UserNav from "./auth/user-nav";
import { Button } from "@ui/components/ui/button";
import { Icons } from "./Icons";
import type { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";
import MobildSideBard from "./MobildSideBard";
interface Props {
  title: string;
  user: User;
  goBack?: boolean;
}

const Header: FC<Props> = ({ title, user, goBack }) => {
  const router = useRouter();
  return (
    <div className="w-full h-[96px] flex justify-between items-center border-b  ">
      <div className="w-[25%] h-full flex items-center justify-start gap-x-2">
        <div className="lg:hidden">
          <MobildSideBard />
        </div>
        {goBack && (
          <Button onClick={() => router.back()} variant="secondary" size="icon">
            <svg
              width="17"
              height="17"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.7305 1.37305L20.8159 11.0001L10.7305 20.6271"
                stroke="#43766C"
                stroke-width="2.1034"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.8162 11L1.18457 11"
                stroke="#43766C"
                stroke-width="2.1034"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        )}
        <h1 className="text-xl font-bold text-start">{title}</h1>
      </div>
      <div className="w-[50%] h-[88px] flex items-center justify-center px-4">
        <SearchInput />
      </div>

      <div className="w-[25%]  h-full flex items-center justify-end gap-x-2">
        <Button size="icon" variant="secondary">
          <Icons.bell className="w-4 h-4 text-[#353E5C]" />
        </Button>
        <UserNav user={user} />
      </div>
    </div>
  );
};

export default Header;
