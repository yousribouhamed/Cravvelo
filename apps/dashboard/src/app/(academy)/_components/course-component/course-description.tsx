import { CravveloEditor } from "@cravvelo/editor";
import type { FC } from "react";

const CourseDescription: FC = (props: any) => {
  return (
    <div className="w-full my-4 min-h-[100px] h-fit flex flex-col rounded-xl">
      <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
        <h3 className="text-xl font-bold">وصف الوردة</h3>
      </div>
      <div className="w-full min-h-[50px] h-fit ">
        {!props?.value ? (
          <p>there is no description </p>
        ) : (
          <CravveloEditor readOnly value={props?.value} />
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
