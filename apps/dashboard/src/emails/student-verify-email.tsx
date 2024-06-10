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
} from "@react-email/components";
import * as React from "react";

interface CravveloVerifyEmailProps {
  verificationCode?: string;
}

const baseUrl = process.env.VERCEL_URL ? process.env.VERCEL_URL : "/static";

export function CravveloVerifyEmailStudent({
  verificationCode,
}: CravveloVerifyEmailProps) {
  return (
    <Html lang="ar">
      <Head>
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/Montserrat-Arabic+Regular+400.0722a65d.otf",
            format: "opentype",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body
        dir="rtl"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "600px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          style={{
            width: "400px",
            minHeight: "600px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <Section>
            <Section
              style={{
                width: "100%",
                height: "100px",
                display: "flex",
                justifyContent: "start",
                alignItems: "end",
                padding: "2px",
                position: "relative",
              }}
            >
              <Img
                src={`https://cravvelo-bucket.s3.eu-west-1.amazonaws.com/email-image.png`}
                width="100%"
                height="100%"
                alt="cravvelo"
                style={{ position: "absolute", inset: "0", zIndex: "-10" }}
              />
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: "24px" }}
              >
                الدخول الى حسابك في كرافيلو
              </Text>
            </Section>
            <Section
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#F8FAE5",
              }}
            >
              <Section style={{ width: "100%", padding: "16px" }}>
                <Text>أهلاً 👋</Text>
                <Text>أدخل الرمز لتتمكن من إنشاء حساب على جدير:</Text>
                <Heading
                  style={{
                    fontWeight: "800",
                    fontSize: "24px",
                    color: "black",
                  }}
                >
                  {verificationCode}
                </Heading>
                <Text>
                  إذا لم تكن تحاول الدخول إلى أحد منتجات جدير بإستخدام هذا
                  البريد يمكنك تجاهل هذه الرسالة.
                </Text>
              </Section>
              <Hr />
              <Section
                style={{
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  padding: "16px",
                }}
              >
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
    </Html>
  );
}
