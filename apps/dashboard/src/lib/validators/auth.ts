import * as z from "zod";

export const authSchema = z.object({
  email: z
    .string({
      required_error: "كلمة المرور مطلوبة",
      invalid_type_error: "يجب أن تكون كلمة المرور نصية",
    })
    .email({
      message: "يرجى إدخال عنوان بريد إلكتروني صالح",
    }),
  password: z
    .string({
      required_error: "كلمة المرور مطلوبة",
      invalid_type_error: "يجب أن تكون كلمة المرور نصية",
    })
    .min(7, {
      message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    })
    .max(100, {
      message: "يجب ألا تتجاوز كلمة المرور 100 حرف",
    }),
  firstName: z.string({
    required_error: "كلمة المرور مطلوبة",
    invalid_type_error: "يجب أن تكون كلمة المرور نصية",
  }),
});

export const authSchemaLogin = z.object({
  email: z
    .string({
      required_error: "كلمة المرور مطلوبة",
      invalid_type_error: "يجب أن تكون كلمة المرور نصية",
    })
    .email({
      message: "يرجى إدخال عنوان بريد إلكتروني صالح",
    }),
  password: z
    .string({
      required_error: "كلمة المرور مطلوبة",
      invalid_type_error: "يجب أن تكون كلمة المرور نصية",
    })
    .min(8, {
      message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    })
    .max(100, {
      message: "يجب ألا تتجاوز كلمة المرور 100 حرف",
    }),
});

export const restPasswordStep2 = z.object({
  email: z
    .string({
      required_error: "كلمة المرور مطلوبة",
      invalid_type_error: "يجب أن تكون كلمة المرور نصية",
    })
    .email({
      message: "يرجى إدخال عنوان بريد إلكتروني صالح",
    }),
});

export const verifyEmailSchema = z.object({
  code: z
    .string({
      required_error: "كلمة المرور مطلوبة",
      invalid_type_error: "يجب أن تكون كلمة المرور نصية",
    })
    .min(6, {
      message: "يجب أن يتكون رمز التحقق من 6 أحرف",
    })
    .max(6, {
      message: "يجب ألا تتجاوز كلمة المرور 6 حرف",
    }),
});

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير مطابقة",
    path: ["confirmPassword"],
  });
