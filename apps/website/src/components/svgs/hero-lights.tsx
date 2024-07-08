import type { FC } from "react";
import Image from "next/image";

const HeroLights: FC = ({}) => {
  return (
    <>
      <div className="absolute top-0 left-0 bottom-0 z-[-20]  h-screen w-full">
        <Image
          src="/Background.svg"
          alt="background"
          width={1920}
          height={3743}
          loading="lazy"
        />
      </div>
    </>
  );
};

export default HeroLights;
