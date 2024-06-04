import jwt from "jsonwebtoken";

import type { NextApiRequest, NextApiResponse } from "next";
import { CravveloVerifyEmailStudent } from "@/src/emails/student-verify-email";
import { Resend } from "resend";

// Generate a random numeric token (e.g., 6-digit OTP)
const generateNumericToken = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
};

const resend = new Resend(process.env.RESEND_API_KEY);

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const secretKey = "abdullahsecretkey";
//   const generateJwt = jwt.sign(
//     { numericToken: generateNumericToken() },
//     secretKey,
//     { expiresIn: "1 hour" }
//   ); // Token expires in 1 hour

//   const { data, error } = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: ["delivered@resend.dev"],
//     subject: "Hello world",
//     react: CravveloVerifyEmailStudent({ verificationCode: "90000" }),
//   });

//   if (error) {
//     return res.status(400).json(error);
//   }

//   res.status(200).json(data);
// };

// send email to virify student

export const verifyStudentEmail = async ({
  email,
  code,
}: {
  email: string;
  code: number;
}) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "قم بتأكيد بريدك الألكتروني",
    react: CravveloVerifyEmailStudent({ verificationCode: code.toString() }),
  });

  if (error) {
    console.log("there is an error");
    console.log(error.message);
  }

  console.log("the email has been send with this data");
  console.log(data);
};

// reset password  confirme email

export const resetPasswordEmail = async ({ email }: { email: string }) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Hello world",
    react: CravveloVerifyEmailStudent({ verificationCode: "90000" }),
  });
};

// sen wolcom email to students

export const SendWolcomEmail = async ({ email }: { email: string }) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Hello world",
    react: CravveloVerifyEmailStudent({ verificationCode: "90000" }),
  });
};
