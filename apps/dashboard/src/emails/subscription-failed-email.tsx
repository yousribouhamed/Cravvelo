import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SubscriptionFailedEmailProps {
  settingsUrl?: string;
}

export default function SubscriptionFailedEmail({
  settingsUrl = "https://app.cravvelo.com/settings/subscription",
}: SubscriptionFailedEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your payment could not be completed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Payment could not be completed</Text>
            <Text style={paragraph}>
              We were unable to process your subscription payment. This can
              happen if the payment was cancelled or if there was an issue with
              your payment method.
            </Text>
            <Text style={paragraph}>
              You can try again by visiting your{" "}
              <a href={settingsUrl} style={anchor}>
                subscription settings
              </a>{" "}
              and choosing a plan.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#000",
  marginBottom: "16px",
};

const paragraph = {
  color: "#000",
  fontSize: "16px",
  lineHeight: "24px",
};

const anchor = {
  color: "#556cd6",
};
