"use server";

import { prisma } from "database/src";
import { z } from "zod";

// نفس Schema اللي في الفورم (اختصرناه هنا)
const supportSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10).max(500),
  priority: z.enum(["low", "medium", "high"]),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true),
});

export async function createSupportTicket(data: unknown) {
  const parsed = supportSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const ticket = await prisma.supportTicket.create({
      //@ts-expect-error
      data: parsed.data,
    });

    return { success: true, data: ticket };
  } catch (error) {
    console.error("❌ Error creating ticket:", error);
    return { success: false, message: "حدث خطأ غير متوقع" };
  }
}
