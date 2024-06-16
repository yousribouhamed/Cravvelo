import Image from "next/image";
import type { FC } from "react";
import PublishWebsite from "./models/editor/publish-website";

const CreateAcademiaSection: FC = ({}) => {
  return (
    <div className="w-full h-[500px] my-8 shadow border rounded-xl bg-white flex flex-col items-center justify-center gap-y-4">
      <Image
        src="/academia/welcome.svg"
        alt="academia not found avg"
        width={400}
        height={400}
      />
      <h2 className="max-w-md font-bold text-gray-900 text-center">
        يجب عليك إنشاء أكاديمية حتى تتمكن من رؤية تحليلات لوحة المعلومات
        واستخدام النظام الأساسي
      </h2>
      <PublishWebsite />
    </div>
  );
};

export default CreateAcademiaSection;
