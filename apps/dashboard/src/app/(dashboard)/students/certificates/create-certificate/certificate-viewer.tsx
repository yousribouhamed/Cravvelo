"use client";

import type { FC } from "react";

const CertificateViewer: FC = ({}) => {
  return (
    <div className="w-full h-full flex flex-col gap-y-4 ">
      <div className="w-full h-[500px] border rounded-xl bg-white p-8 shadow ">
        <div className="w-full h-full border-4 border-black bg-orange-200  flex flex-col items-center justify-center">
          <div className="w-full h-[100px] flex items-center justify-between px-4">
            <p>14/11/2001</p>
            <p className="font-bold text-xl">اسم الشهادة</p>
          </div>
          <div className="w-full h-[350px] flex items-center justify-center">
            <p className="text-2xl">
              نشهد بان الطالب المعني قد انهى الدورة المعنية بنجاح{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;
