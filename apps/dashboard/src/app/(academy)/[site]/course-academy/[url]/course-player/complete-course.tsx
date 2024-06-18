"use client";

import { updateStudentProgress } from "@/src/app/(academy)/_actions/course";
import { useCoursePlayerStore } from "@/src/app/(academy)/global-state/course-player-store";
import { useState, type FC } from "react";
import { Loader, LogOut } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@ui/components/ui/button";
import Ripples from "react-ripples";
import { ListChecks } from "lucide-react";

interface CompleteCourseProps {
  progress: number;
  courseId: string;
  color: string;
  refetch: () => Promise<any>;
}

const CompleteCourse: FC<CompleteCourseProps> = ({
  courseId,
  color,
  progress,
  refetch,
}) => {
  const { state } = useCoursePlayerStore();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-[100px] my-4 flex items-center justify-between px-4 border rounded-xl">
      <span className="text-xl font-bold">
        {state?.currentModule?.title ?? "الانتقال الى الحلقة التالية"}
      </span>
      <div className="flex w-fit items-center gap-x-4 justify-end">
        <Ripples>
          <Link
            href={"/"}
            className={`${buttonVariants()} !bg-black hover:!bg-black text-white`}
          >
            <LogOut className="w-4 h-4 ml-2 text-white" />
            العودة الى الاكادمية
          </Link>
        </Ripples>
        <Ripples>
          <button
            onClick={async () => {
              if (progress >= 100) {
                return;
              }
              setLoading(true);
              try {
                await updateStudentProgress({
                  courseId,
                });

                const audio = new Audio("/sounds/complete-effect.mp3");
                audio.play();

                await refetch();
              } catch (err) {
                console.error(err);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || progress >= 100}
            className="  rounded-xl w-fit text-white flex items-center gap-x-1 py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
            style={{ backgroundColor: color }}
          >
            {loading ? (
              <Loader className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <ListChecks className="w-4 h-4 ml-2" />
            )}
            توثيق اكمال المشاهدة
          </button>
        </Ripples>
      </div>
    </div>
  );
};

export default CompleteCourse;
