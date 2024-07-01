import { z, setErrorMap } from "zod";

const arabicErrorMap = (issue, _ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return {
        message: `المتوقع هو ${issue.expected}، لكن حصلنا على ${issue.received}`,
      };
    case z.ZodIssueCode.too_small:
      return {
        message: `القيمة صغيرة جدًا: يجب أن تكون على الأقل ${issue.minimum}`,
      };
    case z.ZodIssueCode.too_big:
      return {
        message: `القيمة كبيرة جدًا: يجب أن تكون على الأكثر ${issue.maximum}`,
      };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: `البريد الإلكتروني غير صالح` };
      }
      if (issue.validation === "url") {
        return { message: `عنوان URL غير صالح` };
      }
      return { message: `النص غير صالح` };
    case z.ZodIssueCode.invalid_date:
      return { message: `التاريخ غير صالح` };
    case z.ZodIssueCode.invalid_enum_value:
      return {
        message: `القيمة يجب أن تكون واحدة من: ${issue.options.join(", ")}`,
      };
    default:
      return { message: "مدخلات غير صالحة" };
  }
};

setErrorMap(arabicErrorMap);

export { z };
