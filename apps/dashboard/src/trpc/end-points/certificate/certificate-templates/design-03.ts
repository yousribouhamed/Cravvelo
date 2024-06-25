import { splitName } from "@/src/app/(dashboard)/students/certificates/create-certificate/certificate-viewer";
import { getCurrentDate } from "../utils";

export const designO3 = ({
  certificateName,
  courseName,
  studentName,
}: {
  studentName: string;
  certificateName: string;
  courseName: string;
}) => {
  const { firstName, lastName } = splitName(studentName);

  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
      crossorigin="anonymous"
    />

    <title>certificate</title>
  </head>

  <body>
    <style>
      @font-face {
        font-family: "montserrat";
        src: url("https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Montserrat-Arabic+Regular+400.0722a65d.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
      }

      * {
        font-family: "montserrat" !important ;
      }
      html {
        -webkit-print-color-adjust: exact;
      }
      @media print {
        body {
          font-size: 16px;
          color: lightgrey;
        }

        .no-break-inside {
          /* apply this class to every component that shouldn't be cut off between two pages of your PDF */
          break-inside: avoid;
        }

        .break-before {
          /* apply this class to every component that should always display on the next page */
          break-before: always;
        }
      }


    </style>
    <main
    class="w-[700px] h-[500px] mx-auto flex flex-col items-end relative justify-between p-4 gap-y-4 bg-[#FAF5EC]"
    >
     <div
        class="z-[4] absolute flex top-[9.5rem] right-[19.5rem] mb-1 flex-col items-start gap-y-4"
      >
        <span class="text-black text-lg font-bold">${firstName} </span>
        <span class="text-black text-lg font-bold">${lastName}</span>
      </div>


      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/blue-blue.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />

      <div class="absolute bottom-14 mb-4 left-[10rem] z-[4]">
        <span class="text-black text-xs"> ${getCurrentDate()} صدرت الشهادة بتاريخ</span>
      </div>
      <div class="absolute bottom-12 right-[13rem] z-[4]">
        <img src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%A7%D9%84%D8%AA%D9%88%D9%82%D9%8A%D8%B9.png" class="w-[66px] h-[24px] z-[4]" />
      </div>

       <div class="z-[4] flex flex-col items-end">
        <span class="text-[#0168D1] text-md font-semibold">صدرت الشهادة</span>
        <span class="text-[#0168D1] text-md font-semibold">
          بتاريخ ${getCurrentDate()} </span
        >
      </div>
      <h2 class="text-sm max-w-md text-end mr-10 mt-6 text-[#1A3661] z-[4]">
    تقديرًا لحضوره بنجاح دورة
        <span class="font-bold"> ${courseName} </span>
        واستكماله جميع المتطلبات.
      </h2>
      <div class="z-[4] flex flex-col items-end">
        <span class="text-[#0168D1] text-md font-semibold">شهادة </span>
        <span class="text-[#0168D1] text-md font-semibold"> مشاركة</span>
      </div>

      <div class="absolute bottom-12 right-[13rem] z-[4]">
        <img src="./design-02/التوقيع.png" class="w-[66px] h-[24px] z-[4]" />
      </div>

      
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/working_by_crqvvelo.png"
        class="w-[159px] h-[35px] absolute top-5 left-5 z-[5]"
      />
    </main>
  </body>
  <script src="https://cdn.tailwindcss.com"></script>
</html>

      `;
};
