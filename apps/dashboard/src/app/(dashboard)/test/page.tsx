import { PlateEditor } from "@/src/components/reich-text-editor/rich-text-editor";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen pt-20">
      <PlateEditor />
    </div>
  );
};

export default page;
