import { PlateEditorReactOnly } from "@/src/components/reich-text-editor/read-only";
import type { FC } from "react";

const DisplayPolicy: FC = (props: any) => {
  return (
    <>
      <div className="w-full my-4 min-h-[500px]  h-fit flex flex-col rounded-xl">
        <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
          <h3 className="text-xl font-bold"> سياسة الأكاديمية</h3>
        </div>
        <div className="w-full min-h-[200px] h-fit ">
          {!props?.value ? (
            <p>there is no description </p>
          ) : (
            <PlateEditorReactOnly value={props?.value} />
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayPolicy;
