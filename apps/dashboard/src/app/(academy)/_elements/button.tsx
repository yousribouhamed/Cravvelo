import { EditorElement } from "@/src/types";
import type { FC } from "react";
import Link from "next/link";

interface elementProps {
  element: EditorElement;
}

const ButtonPlaceHolderProduction: FC<elementProps> = ({ element }) => {
  return (
    <Link
      href={"/"}
      style={{
        ...element.styles,
      }}
    >
      {/* @ts-ignore */}
      {element?.content?.innerText}
    </Link>
  );
};

export default ButtonPlaceHolderProduction;
