import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

interface CravveloVerifyEmailProps {
  url: string;
}

export default function StudentResetPasswordEmail({
  url,
}: CravveloVerifyEmailProps) {
  return (
    <Html lang="ar" dir="ltr">
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

      <Preview>قم بتغير كلمة المرور</Preview>
      <Body style={main} dir="ltr">
        <Container dir="ltr" style={container}>
          <Section dir="ltr" style={box}>
            <Text dir="ltr" style={paragraph}>
              طلب شخص ما مؤخرًا تغيير كلمة المرور لحساب الخاص بك. إذا كنت أنت،
              فيمكنك تعيين كلمة مرور جديدة هنا
            </Text>

            <a style={button} href={url}>
              إعادة تعيين كلمة المرور
            </a>
            <Hr style={hr} />
            <Text dir="ltr" style={paragraph}>
              إذا كنت لا ترغب في تغيير كلمة المرور الخاصة بك أو لم تطلب ذلك، فما
              عليك سوى تجاهل هذه الرسالة وحذفها.
            </Text>
            <Text dir="ltr" style={paragraph}>
              للحفاظ على أمان حسابك، يرجى عدم إعادة توجيه هذه الرسالة
              الإلكترونية إلى أي شخص.
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
