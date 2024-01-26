import * as z from "zod";

export const addCourseSchema = z.object({
  title: z.string().min(2).max(50),
});
export const addChapterSchema = z.object({
  title: z.string().min(2).max(50),
});
export const updateChapterSchema = z.object({
  title: z.string().min(2).max(50),
});
