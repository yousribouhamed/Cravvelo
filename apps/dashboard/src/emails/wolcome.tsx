import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Font,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

export default function WolcomeEmail({}) {
  return (
    <Html lang="ar">
      <Head>
        <Font
          fontFamily="montserrat"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Montserrat-Arabic+Regular+400.0722a65d.otf",
            format: "opentype",
          }}
          fontWeight={200}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Body
          dir="rtl"
          className="w-full h-full flex items-center justify-center min-h-[600px] mx-auto relative  "
        >
          <Container className=" w-[400px]  h-fit min-h-[600px] mx-auto relative ">
            <Section>
              <Section className="relative w-full h-[100px] flex justify-start items-end p-2">
                <Img
                  src={`https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/email-image.png`}
                  width="100%"
                  height="100%"
                  alt="cravvelo"
                  className="absolute inset-0 z-[-10]"
                />
              </Section>
              <Section className="flex flex-col bg-[#F8FAE5] ">
                <Section className=" w-full h-fit  p-4 ">
                  <Text>أهلاً 👋</Text>
                  <Text>شكرا لاختيارك منصتنا و وضعكم ثقتنا فيها</Text>

                  <Text>
                    إذا لم تكن تحاول الدخول إلى أحد منتجات جدير بإستخدام هذا
                    البريد يمكنك تجاهل هذه الرسالة.
                  </Text>
                </Section>
                <Hr />
                <Section className=" w-full h-[50px]   flex items-center justify-end p-4">
                  <Img
                    src={`https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Cravvelo-transparent.png`}
                    width="100"
                    height="30"
                    alt="cravvelo logo"
                  />
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
