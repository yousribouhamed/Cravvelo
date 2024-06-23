"use client";

import Image from "next/image";
import type { FC } from "react";

interface certificateViewerProps {
  student_name: string;

  courseName: string;
}

const CertificateViewer: FC<certificateViewerProps> = ({
  student_name,
  courseName,
}) => {
  const { firstName, lastName } = splitName(student_name);

  return (
    <div className="w-full h-full flex flex-col gap-y-4 ">
      <div className="w-full relative  h-[500px] border rounded-xl bg-white p-8 shadow ">
        <div className="absolute  inset-0 z-[90] flex flex-col  items-end pb-[7rem] pl-[19rem] justify-center ">
          <span className="text-2xl font-extrabold  text-black ">
            {firstName}
          </span>
          <span className="text-2xl mt-1 font-extrabold text-black ">
            {lastName}
          </span>
        </div>
        <div className="absolute  inset-0 z-[90] flex flex-col  items-start pt-[7rem] mr-[4rem]  justify-center ">
          <span className="text-sm max-w-md  text-black ">
            تقديرًا لحضوره بنجاح دورة{" "}
            <span className="font-bold mx-2">{courseName}</span>
            واستكماله جميع المتطلبات.
          </span>
        </div>
        <div className="w-full h-full relative">
          <Image alt="ice " fill src="/certificate/design-03/template.png" />
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;

function splitName(fullName: string): { firstName: string; lastName: string } {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }
  const nameParts = fullName?.trim()?.split(" ");

  // Assuming the first part is the first name and the last part is the last name
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  return { firstName, lastName };
}
