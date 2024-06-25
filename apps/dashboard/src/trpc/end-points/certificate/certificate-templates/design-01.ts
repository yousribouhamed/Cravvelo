import { getCurrentDate } from "../utils";

export const designO1 = ({
  courseName,
  studentName,
}: {
  studentName: string;

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
      class="w-[700px] h-[500px] mx-auto flex flex-col items-center relative justify-start pt-10 gap-y-4 bg-[#FAF5EC]"
    >
      <img src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/%D8%B4%D9%87%D8%A7%D8%AF%D8%A9.png" class="w-[150px] h-[60px] z-[4]" />
      <div class="flex items-center justify-center gap-x-2 z-[4]">
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

        <span class="text-black">مشاركة</span>
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

      <span class="text-5xl mt-8 text-[#B78747] font-extrabold z-[4]">
       ${studentName}
      </span>

      <div class="w-[350px] h-[5px] bg-[#B78747] rounded-full z-[4]"></div>

      <span class="text-center text-sm mt-2 max-w-md text-black z-[4]"
        >تقديرًا لحضوره بنجاح دورة
        <span class="font-bold">${courseName}</span> واستكماله جميع
        المتطلبات.</span
      >

   <div class="absolute bottom-20 mb-[0.5rem] left-10 z-[4]">
        <span class="text-black text-xs"> ${getCurrentDate()} صدرت الشهادة بتاريخ</span>
      </div>
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group+(2).png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group-1.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[3]"
      />

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group-2.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />

      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />
<img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/working_by_crqvvelo.png"
        class="w-[159px] h-[35px] absolute left-20 bottom-10 z-[5]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Vector.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[1]"
      />
    </main>
  </body>
  <script src="https://cdn.tailwindcss.com"></script>
</html>

    `;
};
