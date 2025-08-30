"use server";

import { prisma } from "database/src";
import { z } from "zod";

// ✅ Zod schema for validation
const waitingListSchema = z.object({
  name: z.string().trim().min(1, "الاسم قصير جداً").max(100).optional(),
  email: z.string().trim().email("البريد الإلكتروني غير صالح").max(255),
});

export async function joinWaitingList(data: unknown) {
  // Validate input with Zod
  const parsed = waitingListSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email } = parsed.data;

  try {
    const waitingUser = await prisma.waitingList.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });

    return { success: true, data: waitingUser };
  } catch (error) {
    console.error("❌ Error joining waiting list:", error);
    return { success: false, message: "حدث خطأ غير متوقع" };
  }
}
