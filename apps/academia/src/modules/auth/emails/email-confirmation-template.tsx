import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Button,
} from "@react-email/components";

interface EmailConfirmationTemplateProps {
  firstName: string;
  verificationUrl: string;
  websiteName: string;
}

export const EmailConfirmationTemplate = ({
  firstName,
  verificationUrl,
  websiteName,
}: EmailConfirmationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Welcome to {websiteName}!
          </Text>

          <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
            Hi {firstName},
          </Text>

          <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
            Thank you for signing up! Please confirm your email address by
            clicking the button below:
          </Text>

          <Button
            href={verificationUrl}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            Verify Email Address
          </Button>

          <Text
            style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}
          >
            If the button doesn't work, you can also click this link:
          </Text>

          <Link
            href={verificationUrl}
            style={{ color: "#007bff", fontSize: "14px" }}
          >
            {verificationUrl}
          </Link>

          <Text style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
            This link will expire in 24 hours. If you didn't create an account,
            you can safely ignore this email.
          </Text>

          <Text style={{ fontSize: "14px", color: "#666", marginTop: "20px" }}>
            Best regards,
            <br />
            The {websiteName} Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
