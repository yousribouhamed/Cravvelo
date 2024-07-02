const unknownErrArabic = "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا.";

export const ERRORS = {
  ALL_FIELDS_REQUIRED: "",
  WRONG_PASSWORD: "",
};

export function translateClerkErrorToArabic(err) {
  switch (err) {
    case "form_password_incorrect":
      return "كلمة المرور غير صحيحة. حاول مرة أخرى.";
    case "form_identifier_exists":
      return "تم أخذ عنوان البريد الإلكتروني هذا. يرجى المحاولة مرة أخرى.";
    case "actor_token_revoked_code":
      return "تم إلغاء رمز الممثل ولا يمكن استخدامه بعد الآن.";
    case "resource_not_found_code":
      return "المورد غير موجود.";
    case "clerk_key_invalid_code":
      return "مفتاح Clerk السري غير صالح. تأكد من صحة مفتاح Clerk السري الخاص بك.";
    case "backup_codes_not_available_code":
      return "لا تتوفر رموز النسخ الاحتياطي. لاستخدام رموز النسخ الاحتياطي، يجب عليك تفعيل أي طريقة تحقق متعدد العوامل.";
    case "checkout_locked_code":
      return "الدفع لا يزال قيد المعالجة لتطبيق معرف <appID>.";
    case "duplicate_record_code":
      return "المعرف <identifier> موجود بالفعل.";
    case "cookie_invalid_code":
      return "ملف تعريف الارتباط غير صالح.";
    case "api_operation_deprecated_code":
      return "النقطة النهاية متقادمة وتنتظر الإزالة.";
    case "form_invalid_entitlement_key_code":
      return "<value> لا يمكن استخدامه كمفتاح الاستحقاق. يجب أن يحتوي مفتاح الاستحقاق على التنسيق التالي: <scope>:<feature>. يجب أن تحتوي `scope` و`feature` على أحرف أبجدية رقمية فقط بدون أي مسافات.";
    case "feature_not_enabled_code":
      return "هذه الميزة غير مفعلة في هذه النسخة.";
    case "session_exists":
      return "الجلسة موجودة بالفعل. أنت حالياً في وضع الجلسة الواحدة. يمكنك تسجيل الدخول إلى حساب واحد فقط في كل مرة.";
    case "sign_in_token_revoked_code":
      return "تم إلغاء رمز تسجيل الدخول ولا يمكن استخدامه بعد الآن.";
    default:
      return unknownErrArabic;
  }
}
