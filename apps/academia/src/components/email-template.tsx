import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  verificationUrl: string;
  websiteName: string;
}

export function EmailTemplate({
  firstName,
  verificationUrl,
  websiteName,
}: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        lineHeight: "1.6",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ color: "#333" }}>Welcome, {firstName}!</h1>
        <p style={{ color: "#555" }}>
          Thanks for signing up for <strong>{websiteName}</strong>. Please
          confirm your email address to get started.
        </p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={verificationUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Confirm Email
          </a>
        </div>

        <p style={{ color: "#777", fontSize: "14px" }}>
          If you didn’t create an account with {websiteName}, you can safely
          ignore this email.
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #eee",
            margin: "20px 0",
          }}
        />

        <p style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>
          &copy; {new Date().getFullYear()} {websiteName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
