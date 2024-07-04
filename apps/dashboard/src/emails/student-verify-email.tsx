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
  Preview,
} from "@react-email/components";
import * as React from "react";

interface CravveloVerifyEmailProps {
  verificationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

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

      <Preview> قم بتأكيد حسابك </Preview>

      <Body dir="rtl" style={main}>
        <Container dir="ltr" style={container}>
          <Section dir="ltr" style={box}>
            <Text dir="ltr" style={paragraph}>
              أدخل الرمز لتتمكن من إنشاء حسابك في الأكاديمية
            </Text>
            <Heading
              style={{
                fontWeight: "800",
                fontSize: "24px",
                color: "black",
              }}
            >
              {verificationCode ?? "no code provided"}
            </Heading>
            <Hr style={hr} />
            <Text dir="ltr" style={paragraph}>
              إذا لم تكن تحاول الدخول إلى أحد منتجات جدير بإستخدام هذا البريد
              يمكنك تجاهل هذه الرسالة.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#FC6B0033",
  fontFamily: "Montserrat",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#000000",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "right" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#FC6B00",
  cursor: "pointer",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
