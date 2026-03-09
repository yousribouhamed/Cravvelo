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

interface SubscriptionSuccessEmailProps {
  planName: string;
  periodEnd: string;
  settingsUrl?: string;
}

export default function SubscriptionSuccessEmail({
  planName,
  periodEnd,
  settingsUrl = "https://app.cravvelo.com/settings/subscription",
}: SubscriptionSuccessEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your subscription is active</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Subscription active</Text>
            <Text style={paragraph}>
              Your subscription to <strong>{planName}</strong> is now active.
            </Text>
            <Text style={paragraph}>
              Your current period ends on <strong>{periodEnd}</strong>.
            </Text>
            <Text style={paragraph}>
              You can manage your subscription in your{" "}
              <a href={settingsUrl} style={anchor}>
                account settings
              </a>
              .
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
