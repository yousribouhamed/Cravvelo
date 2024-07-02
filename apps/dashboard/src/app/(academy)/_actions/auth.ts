"use server";

/**
 * Module for managing student-related functionalities such as creation, authentication, profile update,
 * authorization, and retrieval of student data.
 * @requires prisma Prisma client for database operations.
 * @requires bcrypt Library for hashing passwords.
 * @requires SignJWT Class for generating JWT tokens.
 */

import { prisma } from "database/src";
import {
  generateRandomSixDigitNumber,
  getJwtSecritKey,
  verifyToken,
} from "../lib";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Student } from "database";
import { StudentBag } from "@/src/types";
import { getSiteData } from ".";
import { ResSetPassword, verifyStudentEmail } from "@/src/lib/resend";
import jwt from "jsonwebtoken";
import { pusherServer } from "@/src/lib/pusher";

/**
 * Function to create a new student.
 * @param email The email of the student.
 * @param password The password of the student.
 * @param full_name The full name of the student.
 * @param accountId The ID of the account associated with the student.
 * @returns A Promise that resolves to the created student.
 */
export const create_student = async ({
  email,
  password,
  full_name,
  accountId,
}: {
  email: string;
  full_name: string;
  password: string;
  accountId: string;
}) => {
  // Verify if the email exists
  // const student_with_same_email = await prisma.student.findFirst({
  //   where: {
  //     AND: [{ email: email }, { accountId: accountId }],
  //   },
  // });

  const students = await prisma.student.findMany({
    where: {
      accountId,
    },
  });

  const student_with_same_email = students.find((item) => item.email === email);

  if (student_with_same_email) {
    throw new Error("Student already exists");
  }

  // Hash the password
  const hashedPassword: string = await bcrypt?.hash(password, 10);

  // Create the student bag
  const bag = {
    courses: [],
  } as StudentBag;

  const codeOtp = generateRandomSixDigitNumber();
  // Create new student in the database
  const student = await prisma.student.create({
    data: {
      email,
      otp: generateRandomSixDigitNumber(),
      full_name,
      password: hashedPassword,
      accountId,
      bag: JSON.stringify(bag),
    },
  });

  await verifyStudentEmail({
    email,
    code: codeOtp,
    sender_name: "i will update this",
  });

  cookies().set({
    name: "studentIdVerifyEmail",
    value: student.id,
  });

  const notification = await prisma.notification.create({
    data: {
      accountId,
      content: `  إلى الأكاديمية ${full_name}  انضم`,
    },
  });

  pusherServer.trigger(accountId, "incomming-notifications", notification);

  return student;
};

/**
 * Function to sign in as a student.
 * @param email The email of the student.
 * @param password The password of the student.
 * @param accountId The ID of the account associated with the student.
 * @returns A Promise that resolves to nothing.
 */
export const sign_in_as_student = async ({
  email,
  password,
  accountId,
}: {
  email: string;
  password: string;
  accountId: string;
}) => {
  // Find the user by the email
  const students = await prisma.student.findMany({
    where: {
      accountId,
    },
  });

  const student = await students.find((item) => item.email === email);

  if (!student) {
    throw new Error("There is no student with such email");
  }

  // Compare the hashed password
  const response = await bcrypt
    .compare(password as string, student?.password)
    .catch((error) => {
      throw new Error("Password is incorrect");
    });

  console.log({ response, student });

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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    cookies().set({
      name: "studentId",
      value: student.id,
    });
  } else {
    throw new Error("something went wrong");
  }
};

/**
 * Function to update the student's profile.
 * @returns Nothing.
 */
export const update_profile = async ({
  bio,
  full_name,
  imageUrl,
}: {
  imageUrl: string;
  full_name: string;
  bio: string;
}) => {
  try {
    const student = await getStudent();

    if (!student) {
      throw new Error("you are not sign in dammm ");
    }

    const updateStudent = await prisma.student.update({
      where: {
        id: student.id,
      },
      data: {
        full_name,
        photo_url: imageUrl,
        bio,
      },
    });

    console.log(updateStudent);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Function to authorize student access.
 * @returns A Promise that resolves to a boolean indicating if the student is authorized.
 */
export const authorization = async ({
  origin = null,
}: {
  origin?: string | null;
}): Promise<boolean> => {
  const token = cookies().get("jwt");

  if (!token || !token?.value) {
    if (origin) {
      redirect(`/auth-academy/sign-in?origin=${origin}`);
    } else {
      redirect("/auth-academy/sign-in");
    }
  }

  try {
    const verified = await verifyToken({ token: token?.value });
    if (!verified) {
      return false;
    }

    return true;
  } catch (error) {
    redirect("/auth-academy/sign-in");
  }
};

/**
 * Function to retrieve student data.
 * @returns A Promise that resolves to the retrieved student data or null if not found.
 */
export const getStudent = async (): Promise<Student | null> => {
  const studentId = cookies().get("studentId");

  if (!studentId) {
    return null;
  }

  const student = await prisma.student.findFirst({
    where: {
      id: studentId.value,
    },
  });

  if (!student) {
    return null;
  }

  return student;
};

const verifyJwtAndGetNumericToken = (jwtToken) => {
  try {
    const secretKey = "abdullahsecretkey";
    const decoded = jwt.verify(jwtToken, secretKey);
    return decoded.numericToken; // Extract numeric token from JWT payload
  } catch (error) {
    throw new Error("not ");
  }
};

export const verifyEmailAction = async ({ code }: { code: string }) => {
  //TODO VIRIFY THE CODE SEND TO THE STUDENT

  const studentId = cookies().get("studentIdVerifyEmail")?.value;

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
    },
  });

  if (student.otp === Number(code)) {
    await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        confirmedEmail: new Date(),
      },
    });
    return student;
  } else {
    throw new Error("code is not currect");
  }
};

export const sendEmailAgain = async ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  // where can i get the code from here ??

  const students = await prisma.student.findMany({
    where: {
      accountId,
    },
  });

  const student = students.find((item) => item.email === email);

  await verifyStudentEmail({
    code: student.otp,
    email,
  });
};

export const sendRestPasswordEmail = async ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  try {
    const [students, website] = await Promise.all([
      prisma.student.findMany({
        where: {
          accountId,
        },
      }),
      prisma.website.findFirst({
        where: {
          accountId,
        },
      }),
    ]);

    const student = students.find((item) => item.email === email);

    await ResSetPassword({
      email,
      url: `${website.subdomain}/auth-academy/sign-in/reset-password/${student.id}`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const changeStudentpassword = async ({
  password,
  studentId,
}: {
  password: string;
  studentId: string;
}) => {
  try {
    const hashedPassword: string = await bcrypt?.hash(password, 10);

    const oldStudent = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
    });

    const student = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        password: hashedPassword,
      },
    });

    console.log({
      hashedPassword,
      new: student.password,
      old: oldStudent.password,
    });
  } catch (err) {
    console.error(err);
  }
};

export const applayReferral = async (): Promise<null> => {
  const referral_code = cookies().get("referral_code");

  if (!referral_code) {
    return null;
  }

  try {
    const getreferral = await prisma.referral.findFirst({
      where: {
        id: referral_code.value,
      },
    });

    const newReferralNumber = getreferral.numberOfReferredStudents + 1;

    await prisma.referral.update({
      where: {
        id: referral_code.value,
      },
      data: {
        numberOfReferredStudents: newReferralNumber,
      },
    });
  } catch (err) {
    console.error(err);
  }
};
