"use client";

import { updateStudentProgress } from "@/src/app/(academy)/_actions/course";
import { useCoursePlayerStore } from "@/src/app/(academy)/global-state/course-player-store";
import { useState, type FC } from "react";
import { Loader } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { buttonVariants } from "@ui/components/ui/button";
interface CompleteCourseProps {
  courseId: string;
  color: string;
  refetch: () => Promise<any>;
}

const CompleteCourse: FC<CompleteCourseProps> = ({
  courseId,
  color,
  refetch,
}) => {
  const { state } = useCoursePlayerStore();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-[100px] my-4 flex items-center justify-between px-4 border rounded-xl">
      <span className="text-xl font-bold">
        {state?.currentModule?.title ?? "الانتقال الى الحلقة التالية"}
      </span>
      <div className="flex items-center gap-x-2 justify-end">
        <button
          onClick={async () => {
            setLoading(true);
            try {
              await updateStudentProgress({
                courseId,
              });

              await refetch();
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="  rounded-xl w-fit text-white py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
          style={{ backgroundColor: color }}
        >
          {loading && <Loader className="w-4 h-4 ml-2 animate-spin" />}
          توثيق اكمال المشاهدة
        </button>

        <Link
          href={"/"}
          className={`${buttonVariants()} bg-black hover:bg-black text-white`}
        >
          العودة الى الاكادمية
        </Link>
      </div>
    </div>
  );
};

export default CompleteCourse;
