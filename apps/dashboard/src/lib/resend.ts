import CravveloVerifyEmailStudent from "@/src/emails/student-verify-email";
import { Resend } from "resend";
import StudentResetPasswordEmail from "../emails/student-reset-password";
import StudentCertifictaeReady from "../emails/certificate-ready-email";

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

export const sendCertififcateEmail = async ({
  email,

  url,
}: {
  email: string;
  url: string;
}) => {
  await resend.emails.send({
    from: "noreplay@cravvelo.com",
    to: [email],
    subject: "شهادتك جاهزة ويمكنك المطالبة بها",
    react: StudentCertifictaeReady({ url_certificate: url }),
  });
};
