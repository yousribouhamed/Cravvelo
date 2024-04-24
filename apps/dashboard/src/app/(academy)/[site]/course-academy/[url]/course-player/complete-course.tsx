"use client";

import { updateStudentProgress } from "@/src/app/(academy)/_actions/course";
import { useCoursePlayerStore } from "@/src/app/(academy)/global-state/course-player-store";
import { useState, type FC } from "react";
import { Loader } from "lucide-react";
import { revalidatePath } from "next/cache";
interface CompleteCourseProps {
  courseId: string;
}

const CompleteCourse: FC<CompleteCourseProps> = ({ courseId }) => {
  const { state } = useCoursePlayerStore();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-[100px] my-4 flex items-center justify-between px-4 border rounded-xl">
      <span className="text-xl font-bold">
        {state?.currentModule?.title ?? "الانتقال الى الحلقة التالية"}
      </span>
      <button
        onClick={async () => {
          setLoading(true);
          try {
            await updateStudentProgress({
              courseId,
            });
            revalidatePath(`/course-academy/${courseId}/course-player`);
          } catch (err) {
            console.error(err);
          } finally {
            window?.location?.reload();
            setLoading(false);
          }
        }}
        disabled={loading}
        className="bg-primary  rounded-xl text-white py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
      >
        {loading && <Loader className="w-4 h-4 ml-2 animate-spin" />}
        أكمل واستمر
      </button>
    </div>
  );
};

export default CompleteCourse;
