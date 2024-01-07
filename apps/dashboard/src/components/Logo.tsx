import { Button } from "@ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

const Logo: FC = ({}) => {
  return (
    <Link href={"/"}>
      <div className="w-[100px] relative  h-[60px] flex items-center justify-center">
        <Button variant="ghost" size="icon">
          <Image alt="logo" src={"/logo.PNG"} fill />
        </Button>
      </div>
    </Link>
  );
};

export default Logo;
