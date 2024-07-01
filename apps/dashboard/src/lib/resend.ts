import CravveloVerifyEmailStudent from "@/src/emails/student-verify-email";
import { Resend } from "resend";
import StudentResetPasswordEmail from "../emails/student-reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyStudentEmail = async ({
  email,
  code,
  sender_name,
}: {
  email: string;
  code: number;
  sender_name: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: `${sender_name}@cravvelo.com`,
    to: [email],
    subject: "قم بتأكيد بريدك الألكتروني",
    react: CravveloVerifyEmailStudent({ verificationCode: code.toString() }),
  });

  if (error) {
    console.log("there is an error");
    console.log(error.message);
  }

  console.log("the email has been send with this data");
  console.log({ email, code });
};

// reset password  confirme email

// this one we are not using
export const resetPasswordEmail = async ({
  email,
  sender_name,
}: {
  email: string;
  sender_name: string;
}) => {
  await resend.emails.send({
    from: "anyname@cravvelo.com",
    to: [email],
    subject: "اعادة ضبط كلمة المرور",
    react: CravveloVerifyEmailStudent({ verificationCode: "90000" }),
  });
};

// sen wolcom email to students

export const SendWolcomEmail = async ({ email }: { email: string }) => {
  await resend.emails.send({
    from: "anyname@cravvelo.com",
    to: [email],
    subject: "Hello world",
    react: CravveloVerifyEmailStudent({ verificationCode: "90000" }),
  });
};

export const ResSetPassword = async ({
  email,
  sender_name,
  url,
}: {
  email: string;
  url: string;
  sender_name: string;
}) => {
  await resend.emails.send({
    from: `${sender_name}@cravvelo.com`,
    to: [email],
    subject: "اعادة ضبط كلمة المرور",
    react: StudentResetPasswordEmail({ url }),
  });
};
