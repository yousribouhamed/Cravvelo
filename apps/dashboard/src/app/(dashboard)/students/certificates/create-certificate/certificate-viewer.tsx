"use client";

import { useEffect, useState, type FC } from "react";

interface certificateViewerProps {
  student_name: string;
  stamp: string | null;
  courseName: string;
}

const CertificateViewer: FC<certificateViewerProps> = ({
  student_name,
  courseName,
  stamp,
}) => {
  const { firstName, lastName } = splitName(student_name);
  const [isStampVisible, setIsStampVisible] = useState(Boolean(stamp));

  useEffect(() => {
    setIsStampVisible(Boolean(stamp));
  }, [stamp]);

  return (
    <div className="w-full overflow-x-auto">
      <main
        data-certificate-capture="true"
        className="w-[700px] min-w-[320px] max-w-full h-[500px] min-h-[400px] mx-auto relative rounded-lg shadow-inner border border-border overflow-hidden bg-white"
      >
        <img
          src="/certificate/design-03/template.png"
          alt="Professional Blue template"
          className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
          loading="eager"
          draggable={false}
        />

        <div className="absolute inset-0 z-[90] flex flex-col items-end pb-[7rem] pl-[12rem] sm:pl-[19rem] justify-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-extrabold text-[#1A3661]">
            {firstName}
          </span>
          <span className="text-xl sm:text-2xl mt-1 font-extrabold text-[#1A3661]">
            {lastName}
          </span>
        </div>
        <div className="absolute inset-0 z-[90] flex flex-col items-start pt-[7rem] mr-[2rem] sm:mr-[4rem] justify-center pointer-events-none">
          <span className="text-xs sm:text-sm max-w-md text-[#1A3661]">
            تقديرًا لحضوره بنجاح دورة{" "}
            <span className="font-bold mx-2">{courseName}</span>
            واستكماله جميع المتطلبات.
          </span>
        </div>

        {stamp && isStampVisible && (
          <img
            src={stamp}
            alt="Stamp"
            onError={() => setIsStampVisible(false)}
            className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] absolute left-8 sm:left-[100px] bottom-8 sm:bottom-[100px] z-[100] pointer-events-none"
          />
        )}
      </main>
    </div>
  );
};

export default CertificateViewer;

export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }
  const nameParts = fullName?.trim()?.split(" ");

  // Assuming the first part is the first name and the last part is the last name
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  return { firstName, lastName };
}
