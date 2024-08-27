import { getCurrentDate } from "@/src/trpc/end-points/certificate/utils";
import type { FC } from "react";

interface sunCertificateViewerProps {
  student_name: string;
  courseName: string;
  stamp: string;
}

const SunCertificateViewer: FC<sunCertificateViewerProps> = ({
  courseName,
  student_name,
  stamp,
}) => {
  return (
    <main className="w-[700px] h-[500px] mx-auto flex flex-col items-center relative justify-start pt-20 gap-y-4 bg-[#FAF5EC]">
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%B4%D9%87%D8%A7%D8%AF%D8%A9+%D9%85%D8%B4%D8%A7%D8%B1%D9%83%D8%A9.png"
        className="w-[350px] h-[60px] z-[4]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%A8%D9%83%D9%84+%D9%81%D8%AE%D8%B1+%D9%87%D8%B0%D9%87+%D8%A7%D9%84%D8%B4%D9%87%D8%A7%D8%AF%D8%A9+%D8%AA%D9%85%D9%86%D8%AD+%D9%84%D9%84%D8%B7%D8%A7%D9%84%D8%A8.png"
        className="w-[200px] h-[16px] z-[4] mt-6"
      />
      <h1 className="text-4xl text-[#1A3661] font-bold z-[4]">
        {student_name}
      </h1>
      <h2 className="text-sm mt-6 text-[#1A3661] z-[4]">
        تقديرًا لحضوره بنجاح دورة
        <span className="font-bold"> {courseName} </span>
        واستكماله جميع المتطلبات.
      </h2>
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Clip+path+group.png"
        className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />
      <div className="absolute bottom-14 mb-4 left-[10rem] z-[4]">
        <span className="text-black text-xs">
          {" "}
          صدرت الشهادة بتاريخ {getCurrentDate()}
        </span>
      </div>
      <div className="absolute bottom-12 right-[13rem] z-[4]">
        <img
          src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%A7%D9%84%D8%AA%D9%88%D9%82%D9%8A%D8%B9.png"
          className="w-[66px] h-[24px] z-[4]"
        />
      </div>
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/working_by_crqvvelo.png"
        className="w-[159px] h-[35px] absolute left-[180px] bottom-5 z-[5]"
      />
      {stamp && (
        <img
          src={stamp}
          className="w-[150px] h-[150px] absolute   left-[100px] bottom-[100px] z-[100]"
        />
      )}
    </main>
  );
};

export default SunCertificateViewer;
