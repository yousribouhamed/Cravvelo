import { getCurrentDate } from "@/src/trpc/end-points/certificate/utils";
import { useEffect, useState, type FC } from "react";

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
  const [isStampVisible, setIsStampVisible] = useState(Boolean(stamp));

  useEffect(() => {
    setIsStampVisible(Boolean(stamp));
  }, [stamp]);

  return (
    <div className="w-full overflow-x-auto">
      <main
        data-certificate-capture="true"
        className="w-[700px] min-w-[320px] max-w-full h-[500px] min-h-[400px] mx-auto flex flex-col items-center relative justify-start pt-20 gap-y-4 bg-[#FAF5EC] rounded-lg shadow-inner border border-border"
      >
      <div className="z-[4] mt-2 flex flex-col items-center gap-1">
        <h2 className="text-5xl font-black tracking-tight text-black">شهادة</h2>
        <span className="text-2xl font-semibold text-[#B78747]">مشاركة</span>
      </div>
      <p className="z-[4] mt-2 text-xs text-[#1A3661]">
        بكل فخر هذه الشهادة تمنح للطالب
      </p>
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
        alt="Certificate background"
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
          alt="Signature"
          className="w-[66px] h-[24px] z-[4]"
        />
      </div>
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/working_by_crqvvelo.png"
        alt="Powered by Cravvelo"
        className="hidden"
      />
      <div className="absolute left-[180px] bottom-5 z-[5] rounded-full border border-[#B78747] bg-white/85 px-3 py-1 text-xs text-[#8E5C2C]">
        بواسطة Cravvelo
      </div>
      {stamp && isStampVisible && (
        <img
          src={stamp}
          alt="Stamp"
          onError={() => setIsStampVisible(false)}
          className="w-[150px] h-[150px] absolute   left-[100px] bottom-[100px] z-[100]"
        />
      )}
    </main>
    </div>
  );
};

export default SunCertificateViewer;
