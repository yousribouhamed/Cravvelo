import { z } from "zod";

export const formSchema = z.object({
  full_name: z.string().min(2, "الاسم يجب أن يحتوي على حرفين على الأقل").max(50, "الاسم طويل جداً").optional().or(z.literal("")),
  bio: z.string().max(500, "السيرة الذاتية طويلة جداً").optional().or(z.literal("")),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  username: z.string().min(3, "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل").optional().or(z.literal("")),
  website: z.string().url("الموقع الإلكتروني غير صالح").optional().or(z.literal("")),
  location: z.string().max(100, "الموقع طويل جداً").optional().or(z.literal("")),
  occupation: z.string().max(100, "المهنة طويلة جداً").optional().or(z.literal("")),
});
