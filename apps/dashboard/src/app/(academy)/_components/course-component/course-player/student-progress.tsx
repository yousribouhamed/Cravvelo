import type { FC } from "react";
import { Progress } from "@ui/components/ui/progress";

interface StudentProgressProps {}

const StudentProgress: FC = ({}) => {
  return (
    <div className="w-full h-20 flex items-center justify-between bg-gray-100 rounded-xl  mt-8 px-4">
      <span className="text-xl font-bold text-start">التقدم في الدورة</span>
      <Progress value={33} className="w-[70%] h-1" />
    </div>
  );
};

export default StudentProgress;
