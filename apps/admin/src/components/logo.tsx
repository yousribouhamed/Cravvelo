import Image from "next/image";
import type { FC } from "react";

interface LogoProps {}

const Logo: FC = ({}) => {
  return (
    <div className="w-full h-[50px]  flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="cravvelo logo in white"
        width={150}
        height={50}
        loading="eager"
      />
    </div>
  );
};

export default Logo;
