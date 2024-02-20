"use server";

import { Course } from "database";
import { getStudent } from "./auth";

export const buyCourse = ({ course }: { course: Course }) => {
  const currentStudent = getStudent();
};

export const buyProduct = () => {};
