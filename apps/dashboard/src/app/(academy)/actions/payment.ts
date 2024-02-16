"use server";

import { Course } from "database";
import { prisma } from "database/src";
import { getStudent } from "./auth";

export const buyCourse = ({ course }: { course: Course }) => {
  const currentStudent = getStudent();
};

export const buyProduct = () => {};
