import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Font,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface CravveloVerifyEmailProps {
  url: string;
}

const baseUrl = process.env.VERCEL_URL ? process.env.VERCEL_URL : "/static";

export default function StudentResetPasswordEmail({
  url,
}: CravveloVerifyEmailProps) {
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
              <Section className="flex flex-col bg-[#F8FAE5] ">
                <Section className=" w-full h-fit  p-4 ">
                  <Text>اعد ضبط كلمه السر</Text>

                  <Text>
                    إذا لم تكن قد قدمت هذا الطلب، فما عليك سوى تجاهل هذه الرسالة
                    الإلكترونية. إذا قمت بتقديم هذا الطلب، يرجى إعادة تعيين كلمة
                    المرور الخاصة بك عن طريق النقر على هذا الزر.
                  </Text>
                  <Section className="w-full flex justify-center mt-4">
                    <a
                      href={url}
                      style={{
                        backgroundColor: "#1a73e8",
                        color: "#ffffff",
                        padding: "12px 24px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        display: "inline-block",
                      }}
                    >
                      إعادة تعيين كلمة المرور
                    </a>
                  </Section>
                </Section>
                <Hr />
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
