import { useEditorStore } from "@/src/lib/zustand/editor-state";

import type { FC } from "react";

interface HeaderAbdullahProps {}

const Header: FC = ({}) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      onClick={() => selectComponent("HEADER")}
      className="w-full h-[70px] relative bg-white flex items-center justify-between border-b px-4 hover:border-2 hover:border-green-500  group cursor-pointer "
    >
      <h2 className="text-lg font-extrabold text-start ">شعارك</h2>
      <div className="w-[200px] h-full flex items-center justify-end gap-x-4 ">
        <p>بيت</p>
        <p>الدورات</p>
        <p>معلومات عنا</p>
      </div>
    </div>
  );
};

export default Header;
