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

export default function CravveloVerifyEmailStudent({
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
          backgroundColor: "#000000",
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
            ></Section>
            <Section
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
              }}
            >
              <Section style={{ width: "100%", padding: "16px" }}>
                <Text>أهلاً 👋</Text>
                <Text>أدخل الرمز لتتمكن من إنشاء حسابك في الأكاديمية:</Text>
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
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
