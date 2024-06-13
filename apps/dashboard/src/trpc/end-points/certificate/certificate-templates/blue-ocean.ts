import { formatDateInArabic } from "@/src/lib/utils";

export const BlueOcean = ({
  certificateName,
  courseName,
  studentName,
}: {
  studentName: string;
  certificateName: string;
  courseName: string;
}) => {
  return `
     <!DOCTYPE html>
<html lang="ar">
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
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap");
      * {
        font-family: "Poppins", "sans-serif" !important ;
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
    <main class="w-[800px] mx-auto bg-slate-950 h-full flex items-center justify-center p-[25px]">
      <div class="bg-slate-50 w-full h-full rounded-xl">
        <div class="w-full h-[100px] flex items-center justify-between px-4">
          <p class="text-2xl font-bold text-black">${certificateName}</p>

          <p class="text-md font-bold text-gray-500">${formatDateInArabic(
            new Date(),
            "dd MMMM yyyy"
          )}</p>
        </div>

        <div class="h-[250px] w-[60%] mx-auto flex items-center justify-center">
          <h1 class="text-4xl font-bold text-slate-950 text-center">
            نشهد بأن الطالب المذكور قد أتم بنجاح جميع متطلبات الدورة التدريبية
            المعنية بكل تفوق وإتقان
          </h1>
        </div>
        <div class="h-[150px] w-[100%] flex items-start justify-between p-4">
          <img
            src="https://cravvel-bucket.s3.eu-west-1.amazonaws.com/certificate-design.png"
            class="w-20 h-20"
            alt="ah"
          />
          <p class="text-xl font-bold text-black">${studentName}</p>
        </div>
      </div>
    </main>
  </body>
  <script src="https://cdn.tailwindcss.com"></script>
</html>

      `;
};
