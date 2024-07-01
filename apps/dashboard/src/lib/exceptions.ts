const unknownErrArabic = "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا.";

export const ERRORS = {
  ALL_FIELDS_REQUIRED: "",
  WRONG_PASSWORD: "",
};

export function translateClerkErrorToArabic(err) {
  switch (err) {
    case "something_went_wrong":
      return "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا.";
    case "email_invalid":
      return "البريد الإلكتروني غير صالح.";
    case "password_too_short":
      return "كلمة المرور قصيرة جدًا.";
    case "email_already_exists":
      return "البريد الإلكتروني موجود بالفعل.";
    case "invalid_credentials":
      return "بيانات الاعتماد غير صالحة.";
    case "account_locked":
      return "تم قفل الحساب.";
    case "too_many_attempts":
      return "عدد المحاولات كبير جدًا. يرجى المحاولة لاحقًا.";
    case "email_not_verified":
      return "البريد الإلكتروني غير مؤكد.";
    case "weak_password":
      return "كلمة المرور ضعيفة.";
    case "password_mismatch":
      return "كلمة المرور غير متطابقة.";
    case "unauthorized":
      return "غير مصرح.";
    case "forbidden":
      return "ممنوع.";
    case "resource_not_found":
      return "المورد غير موجود.";
    case "session_expired":
      return "انتهت صلاحية الجلسة.";
    case "invalid_token":
      return "رمز غير صالح.";
    case "server_error":
      return "خطأ في الخادم.";
    case "rate_limit_exceeded":
      return "تم تجاوز الحد الأقصى للمعدل.";
    case "email_not_found":
      return "البريد الإلكتروني غير موجود.";
    default:
      return unknownErrArabic;
  }
}
