import CravveloVerifyEmailStudent from "@/src/emails/student-verify-email";
import { Resend } from "resend";
import StudentResetPasswordEmail from "../emails/student-reset-password";
import StudentCertifictaeReady from "../emails/certificate-ready-email";
import SubscriptionSuccessEmail from "../emails/subscription-success-email";
import SubscriptionFailedEmail from "../emails/subscription-failed-email";

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

const APP_BASE_FOR_EMAIL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://app.cravvelo.com");
const SUBSCRIPTION_SETTINGS_URL = `${APP_BASE_FOR_EMAIL}/settings/subscription`;

export async function sendSubscriptionSuccessEmail({
  email,
  planName,
  periodEnd,
}: {
  email: string;
  planName: string;
  periodEnd: string;
}) {
  const { error } = await resend.emails.send({
    from: "sender@cravvelo.com",
    to: [email],
    subject: "Your subscription is active",
    react: SubscriptionSuccessEmail({
      planName,
      periodEnd,
      settingsUrl: SUBSCRIPTION_SETTINGS_URL,
    }),
  });
  if (error) console.error("Subscription success email error:", error.message);
}

export async function sendSubscriptionFailedEmail({
  email,
}: {
  email: string;
}) {
  const { error } = await resend.emails.send({
    from: "sender@cravvelo.com",
    to: [email],
    subject: "Your subscription payment could not be completed",
    react: SubscriptionFailedEmail({ settingsUrl: SUBSCRIPTION_SETTINGS_URL }),
  });
  if (error) console.error("Subscription failed email error:", error.message);
}
