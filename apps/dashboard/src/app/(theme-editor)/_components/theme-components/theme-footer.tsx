import type { FC } from "react";

interface ThemeFooterProps {}

const ThemeFooter: FC = ({}) => {
  return (
    <div className="w-full h-[100px] flex bg-white ">
      <span className="block rounded-xl p-4 bg-yellow-500 text-black">
        يعمل بواسطة جدير
      </span>
    </div>
  );
};

export default ThemeFooter;
