import { getCurrentDate } from "@/src/trpc/end-points/certificate/utils";
import type { FC } from "react";

interface DeerCertificateViewerProps {
  student_name: string;
  courseName: string;
  stamp: string | null;
}

const DeerCertificateViewer: FC<DeerCertificateViewerProps> = ({
  courseName,
  student_name,
  stamp,
}) => {
  return (
    <main className="w-[700px] h-[500px] mx-auto flex flex-col items-center relative justify-start pt-10 gap-y-4 bg-[#FAF5EC]">
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%B4%D9%87%D8%A7%D8%AF%D8%A9.png"
        className="w-[150px] h-[60px] z-[4]"
      />
      <div className="flex items-center justify-center gap-x-2 z-[4]">
        <svg
          width="163"
          height="8"
          viewBox="0 0 163 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M159.704 0.688171L162.256 4.3376L159.704 7.97012L0 4.3376L159.704 0.688171Z"
            fill="#B78747"
          />
        </svg>

        <span className="text-black">مشاركة</span>
        <svg
          width="163"
          height="8"
          viewBox="0 0 163 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.55153 0.688171L0 4.3376L2.55153 7.97012L162.256 4.3376L2.55153 0.688171Z"
            fill="#B78747"
          />
        </svg>
      </div>

      <span className="text-5xl mt-8 text-[#B78747] font-extrabold z-[4]">
        {student_name}
      </span>

      <div className="w-[350px] h-[5px] bg-[#B78747] rounded-full z-[4]"></div>

      <span className="text-center text-sm mt-2 max-w-md text-black z-[4]">
        تقديرًا لحضوره بنجاح دورة
        <span className="font-bold">{courseName}</span> واستكماله جميع
        المتطلبات.
      </span>

      <div className="absolute bottom-20 mb-[0.5rem] left-10 z-[4]">
        <span className="text-black text-xs">
          {" "}
          صدرت الشهادة بتاريخ {getCurrentDate()}
        </span>
      </div>

      <img
        src={stamp}
        className="w-[150px] h-[150px] absolute   left-[100px] bottom-[100px] z-[100]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group+(2).png"
        className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group-1.png"
        className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[3]"
      />

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group-2.png"
        className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group.png"
        className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/working_by_crqvvelo.png"
        className="w-[159px] h-[35px] absolute left-20 bottom-10 z-[5]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Vector.png"
        className="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />
    </main>
  );
};

export default DeerCertificateViewer;
