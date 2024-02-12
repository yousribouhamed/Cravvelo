"use server";

import { prisma } from "database/src";

export const sign_up_as_student = async ({
  email,
  password,
  phone,
  accountId,
}: {
  email: string;
  phone: string;
  password: string;
  accountId: string;
}) => {
  // create new student in the database
  //    const student = await prisma.student.create({
  //     data : {
  //     }
  //    })
};

export const sign_in_as_student = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // find the user by the email
  // comapre the hascode
  // if everything went ok then return something good
};

// mabe a should store the tooken id in the cookie and each time i send i request to the server to see if the user is still authanticated

export const update_profile = () => {};
