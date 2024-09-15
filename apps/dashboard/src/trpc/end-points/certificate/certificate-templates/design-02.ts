import { formatDateInArabic } from "@/src/lib/utils";
import { getCurrentDate } from "../utils";

export const design02 = ({
  certificateName,
  courseName,
  studentName,
  stamp,
}: {
  studentName: string;
  certificateName: string;
  stamp: string | null;
  courseName: string;
}) => {
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
      class="w-[700px] h-[500px] mx-auto flex flex-col items-center relative justify-start pt-20 gap-y-4 bg-[#FAF5EC]"
    >
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%B4%D9%87%D8%A7%D8%AF%D8%A9+%D9%85%D8%B4%D8%A7%D8%B1%D9%83%D8%A9.png"
        class="w-[350px] h-[60px] z-[4]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%A8%D9%83%D9%84+%D9%81%D8%AE%D8%B1+%D9%87%D8%B0%D9%87+%D8%A7%D9%84%D8%B4%D9%87%D8%A7%D8%AF%D8%A9+%D8%AA%D9%85%D9%86%D8%AD+%D9%84%D9%84%D8%B7%D8%A7%D9%84%D8%A8.png"
        class="w-[200px] h-[16px] z-[4] mt-6"
      />

      <h1 class="text-4xl text-[#1A3661] font-bold z-[4]">${studentName}</h1>

      <h2 class="text-sm mt-6 text-[#1A3661] z-[4]">
        تقديرًا لحضوره بنجاح دورة
        <span class="font-bold"> ${courseName} </span>
        واستكماله جميع المتطلبات.
      </h2>

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Clip+path+group.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />

      <div class="absolute bottom-14 mb-4 left-[10rem] z-[4]">
        <span class="text-black text-xs"> ${getCurrentDate()} صدرت الشهادة بتاريخ</span>
      </div>
      <div class="absolute bottom-12 right-[13rem] z-[4]">
        <img src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%A7%D9%84%D8%AA%D9%88%D9%82%D9%8A%D8%B9.png" class="w-[66px] h-[24px] z-[4]" />
      </div>


       <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/working_by_crqvvelo.png"
        class="w-[159px] h-[35px] absolute left-[180px] bottom-5 z-[5]"
      />
           <img
           src=${stamp}
           style="
           width: 150px;
           height: 150px;
           position: absolute;
           left: 0;
           bottom: 0;
           z-index: 900;
          "
      /> 
    </main>
  </body>
  <script src="https://cdn.tailwindcss.com"></script>
</html>


      `;
};
