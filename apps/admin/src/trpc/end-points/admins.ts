import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "database/src";
import { getJwtSecritKey } from "@/src/lib/utils";

export const admin = {
  getAllAdmins: privateProcedure.query(async ({ input, ctx }) => {
    const admins = await ctx.prisma.admin.findMany();
    return admins;
  }),

  createAdmin: privateProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify if the email exists
      const admin_with_same_email = await prisma.admin.findFirst({
        where: {
          email: input.email,
        },
      });

      if (admin_with_same_email) {
        throw new Error("Student already exists");
      }

      // Hash the password
      const hashedPassword: string = await bcrypt?.hash(input.password, 10);
      // save the data in the database

      // Create new student in the database
      const admin = await prisma.admin.create({
        data: {
          email: input.email,
          name: input.name,
          photo_url: "",
          password: hashedPassword,
        },
      });

      return admin;
    }),

  deleteAdmin: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deletedAdmin = await prisma.admin.delete({
        where: {
          id: input.id,
        },
      });

      return deletedAdmin;
    }),

  SignInAsAdmin: privateProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // chec if root admin

      if (
        input.email === process.env.ROOT_ADMIN_EMAIL &&
        input.password === process.env.ROOT_ADMIN_PASSWORD
      ) {
        // Generate and set JWT token in the cookies
        const token = await new SignJWT({})
          .setProtectedHeader({ alg: "HS256" })
          .setJti(uuidv4())
          .setIssuedAt()
          .setExpirationTime("10h")
          .sign(new TextEncoder().encode(getJwtSecritKey()));

        cookies().set({
          name: "jwt",
          value: token,
          secure: process.env.NODE_ENV === "production",
        });

        return;
      }

      // Find the user by the email
      const admin = await prisma.admin.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!admin) {
        throw new Error("There is no admin with such email");
      }

      // Compare the hashed password
      const response = await bcrypt
        .compare(input.password as string, admin?.password)
        .catch((error) => {
          throw new Error("Password is incorrect");
        });

      if (response) {
        // Generate and set JWT token in the cookies
        const token = await new SignJWT({})
          .setProtectedHeader({ alg: "HS256" })
          .setJti(uuidv4())
          .setIssuedAt()
          .setExpirationTime("10h")
          .sign(new TextEncoder().encode(getJwtSecritKey()));

        cookies().set({
          name: "jwt",
          value: token,
          secure: process.env.NODE_ENV === "production",
        });

        cookies().set({
          name: "adminId",
          value: admin.id,
        });
      }
    }),
};
