import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { prisma } from "database/src";
import { increaseVerificationSteps } from "@/src/lib/actions/increase-steps";

export const users = {
  update_user_profile: privateProcedure
    .input(
      z.object({
      
        user_name: z.string().optional(),
        user_bio: z.string().optional(),
        avatarUrl: z.string().optional(),
        phoneNumber: z.number().optional(),
        support_email: z.string().email().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.enum(["MALE", "FEMALE"]).optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        postalCode: z.string().optional(),
        website: z.string().url().optional(),
        socialMediaLinks: z.record(z.string()).optional(), // {platform: url}
        profession: z.string().optional(),
        company: z.string().optional(),
        education: z.string().optional(),
        skills: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        preferredLanguage: z.string().optional(),
        timezone: z.string().optional(),
        emailNotifications: z.boolean().optional(),
        smsNotifications: z.boolean().optional(),
        marketingEmails: z.boolean().optional(),
        profileVisibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS_ONLY"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
    
        const updateData: any = {};
        
   
        if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
        if (input.user_name !== undefined) updateData.user_name = input.user_name;
        if (input.user_bio !== undefined) updateData.user_bio = input.user_bio;
        if (input.phoneNumber !== undefined) updateData.phone = input.phoneNumber;
        if (input.support_email !== undefined) updateData.support_email = input.support_email;
        if (input.firstName !== undefined) updateData.firstName = input.firstName;
        if (input.lastName !== undefined) updateData.lastName = input.lastName;
        if (input.dateOfBirth !== undefined) updateData.dateOfBirth = input.dateOfBirth;
        if (input.gender !== undefined) updateData.gender = input.gender;
        if (input.country !== undefined) updateData.country = input.country;
        if (input.city !== undefined) updateData.city = input.city;
        if (input.address !== undefined) updateData.address = input.address;
        if (input.postalCode !== undefined) updateData.postalCode = input.postalCode;
        if (input.website !== undefined) updateData.website = input.website;
        if (input.socialMediaLinks !== undefined) updateData.socialMediaLinks = input.socialMediaLinks;
        if (input.profession !== undefined) updateData.profession = input.profession;
        if (input.company !== undefined) updateData.company = input.company;
        if (input.education !== undefined) updateData.education = input.education;
        if (input.skills !== undefined) updateData.skills = input.skills;
        if (input.interests !== undefined) updateData.interests = input.interests;
        if (input.preferredLanguage !== undefined) updateData.preferredLanguage = input.preferredLanguage;
        if (input.timezone !== undefined) updateData.timezone = input.timezone;
        if (input.emailNotifications !== undefined) updateData.emailNotifications = input.emailNotifications;
        if (input.smsNotifications !== undefined) updateData.smsNotifications = input.smsNotifications;
        if (input.marketingEmails !== undefined) updateData.marketingEmails = input.marketingEmails;
        if (input.profileVisibility !== undefined) updateData.profileVisibility = input.profileVisibility;


        const significantFields = ['firstName', 'lastName', 'user_bio', 'country', 'profession'];
        const hasSignificantUpdate = significantFields.some(field => 
          input[field as keyof typeof input] !== undefined
        );
        
        if (hasSignificantUpdate) {
          updateData.profileCompleted = true;
        }

        const account = await prisma.account.update({
          where: {
            userId: ctx.user.id,
          },
          data: updateData,
        });

        await increaseVerificationSteps({ accountId: ctx.account.id });

        return account;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to update profile");
      }
    }),
};