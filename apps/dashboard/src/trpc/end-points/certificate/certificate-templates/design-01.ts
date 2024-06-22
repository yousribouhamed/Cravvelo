export const designO1 = () => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  

    <title>certificate</title>
  </head>

  <body>
    <style>
      @font-face {
  font-family: "montserrat";
  src: url("https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Montserrat-Arabic+Regular+400.0722a65d.otf") format("opentype");
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
      class="w-[700px] h-[500px] mx-auto flex itemc-center relative justify-center bg-[#FAF5EC]"
    >

    
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[-1]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Group-1.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[-2]"
      />
      <img
        src="https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Vector.png"
        class="w-full h-full absolute top-0 right-0 left-0 bottom-0 z-[-3]"
      />
    </main>
  </body>
  <script src="https://cdn.tailwindcss.com"></script>
</html>

    `;
};
