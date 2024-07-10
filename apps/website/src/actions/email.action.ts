"use server";

import { InquiryEmail } from "../email/inquiry-email";
import { resend } from "../lib/resend";

interface InquiryEmail {
  name: string;
  email: string;
  message: string;
}
export const sendInquiryEmail = async ({
  email,
  message,
  name,
}: InquiryEmail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: ` inquiry from ${name} <inquiry@cravvelo.com>`,
      to: ["support@cravvelo.com"],
      subject: `inquiry from ${name}`,
      react: InquiryEmail({ name, message }),
    });

    if (error) {
      throw new Error("there is an error in here ");
    }
  } catch (error) {
    throw new Error("there is an error in here ");
  }
};
