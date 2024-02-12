import { PlateEditorReactOnly } from "@/src/components/reich-text-editor/read-only";
import { Info } from "lucide-react";
import type { FC } from "react";

const CourseDescription: FC = (props: any) => {
  return (
    <div className="w-full h-[400px] flex flex-col rounded-xl">
      <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
        <div className="w-[45px] h-[45px] rounded-[50%] bg-black flex items-center justify-center">
          <Info className="text-white w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">وصف الوردة</h3>
      </div>
      <div className="w-full h-[200px] ">
        {!props?.value ? (
          <p>there is no description </p>
        ) : (
          <PlateEditorReactOnly value={props?.value} />
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
