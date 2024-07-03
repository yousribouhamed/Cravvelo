import CravveloVerifyEmailStudent from "@/src/emails/student-verify-email";
import { Resend } from "resend";
import StudentResetPasswordEmail from "../emails/student-reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyStudentEmail = async ({
  email,
  code,
}: {
  email: string;
  code: number;
}) => {
  const { data, error } = await resend.emails.send({
    from: "sender@cravvelo.com",
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

export const ResSetPassword = async ({
  email,

  url,
}: {
  email: string;
  url: string;
}) => {
  await resend.emails.send({
    from: "sender@cravvelo.com",
    to: [email],
    subject: "اعادة ضبط كلمة المرور",
    react: StudentResetPasswordEmail({ url }),
  });
};
