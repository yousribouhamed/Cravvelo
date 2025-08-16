"use server";

import { z } from "zod";
import { withTenant } from "@/_internals/with-tenant";
import { EmailTemplate } from "@/components/email-template";
import crypto from "crypto";
import { resend } from "@/lib/resend";

export const requestEmailConfirmation = withTenant({
  input: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .max(320, "Email too long")
      .toLowerCase()
      .trim(),
  }),

  handler: async ({ accountId, input, website, account, db }) => {
    try {
      // Check if user exists
      const user = await db.student.findFirst({
        where: {
          email: input.email,
          accountId: accountId,
        },
      });

      if (!user) {
        throw new Error("User not found with this email");
      }

      // Check if user is already verified
      if (user.emailVerified) {
        throw new Error("Email is already verified");
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save verification token to database
      await db.student.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerificationToken: verificationToken,
          emailVerificationExpiry: tokenExpiry,
        },
      });

      // Create verification URL
      const verificationUrl = `${
        website.subdomain
      }/verify-email?token=${verificationToken}&email=${encodeURIComponent(
        input.email
      )}`;

      // Send confirmation email
      const { data, error } = await resend.emails.send({
        from: `${website.name} <noreply@cravvelo.com>`,
        to: [input.email],
        subject: `Confirm your email - ${website.name}`,
        react: EmailTemplate({
          firstName: user.full_name.split(" ")[0],
          verificationUrl: verificationUrl,
          websiteName: website.name ?? "",
        }),
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send confirmation email");
      }

      console.log(
        `Sent confirmation email to ${input.email} for ${website.name} (${account.user_name})`
      );

      return {
        success: true,
        message: "Confirmation email sent successfully",
        emailId: data?.id,
      };
    } catch (error) {
      console.error("Error requesting email confirmation:", error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to request email confirmation");
    }
  },
});
