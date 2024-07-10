import * as React from "react";

interface EmailTemplateProps {
  name: string;

  message: string;
}

export const InquiryEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  message,
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Message : {message}</p>
  </div>
);
