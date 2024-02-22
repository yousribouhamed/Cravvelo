"use client";

import type { FC } from "react";

const CertificateViewer: FC = ({}) => {
  return (
    <div className="w-full h-full flex flex-col gap-y-4 ">
      <div className="w-full h-[50px] bg-white border rounded-xl shadow flex items-center justify-end"></div>
      <div className="w-full h-[400px] border rounded-xl bg-white p-8 shadow ">
        <div className="w-full h-full border-4 border-black flex items-center justify-center">
          <h2 className="text-4xl font-bold text-black">شهادة</h2>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;
