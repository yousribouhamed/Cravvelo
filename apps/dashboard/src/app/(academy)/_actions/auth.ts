"use server";

import { prisma } from "database/src";
import { getJwtSecritKey, verifyToken } from "../lib";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Student } from "database";
import { StudentBag } from "@/src/types";
import { getSiteData } from ".";

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
  // verify if the email exists
  const student_with_same_email = await prisma.student.findFirst({
    where: {
      email,
    },
  });

  if (student_with_same_email) {
    throw new Error("student already exists");
  }

  // hash the password
  const hashedPassword: string = await bcrypt?.hash(password, 10);

  // create the student bag
  const bag = {
    courses: [],
  } as StudentBag;
  // create new student in the database
  const student = await prisma.student.create({
    data: {
      email,
      full_name,
      password: hashedPassword,
      accountId,
      bag: JSON.stringify(bag),
    },
  });

  return student;
};

export const sign_in_as_student = async ({
  email,
  password,
  accountId,
}: {
  email: string;
  password: string;
  accountId: string;
}) => {
  // find the user by the email

  const student = await prisma.student.findFirst({
    where: {
      email,
      accountId,
    },
  });

  if (!student) {
    throw new Error("there is no student with such a name");
  }

  // comapre the hascode
  const response = await bcrypt
    .compare(password as string, student?.password)
    .catch((errpr) => {
      throw new Error(" password is not currect");
    });

  if (response) {
    // if everything went ok then return something good
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
  }
};

// mabe a should store the tooken id in the cookie and each time i send i request to the server to see if the user is still authanticated

export const update_profile = () => {};

export const authorization = async (): Promise<boolean> => {
  const token = cookies().get("jwt");

  if (!token || !token?.value) {
    redirect("/auth-academy/sign-in");
  }

  try {
    const verified = await verifyToken({ token: token?.value });
    if (!verified) {
      return false;
    }

    return true;
  } catch (err) {
    redirect("/auth-academy/sign-in");
  }
};

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
