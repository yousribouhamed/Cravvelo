import type { FC } from "react";

interface ThemeHeadingProps {}

const ThemeHeading: FC = ({}) => {
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <h1 className="text-7xl font-bold text-center">مرحبا بكم في أكاديميتي</h1>
    </div>
  );
};

export default ThemeHeading;
