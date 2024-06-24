import { splitName } from "@/src/app/(dashboard)/students/certificates/create-certificate/certificate-viewer";
import { formatDateInArabic } from "@/src/lib/utils";

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
      class="w-[700px] h-[500px] mx-auto flex flex-col items-center relative justify-start pt-20 gap-y-4 bg-[#FAF5EC]"
    >
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
    </main>
  </body>
  <script src="https://cdn.tailwindcss.com"></script>
</html>

      `;
};
