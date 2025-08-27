import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getCheckoutByPaymentId } from "@/src/modules/payments/actions/payinvoice.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import {
  Clock,
  BookOpen,
  Download,
  Award,
  Tag,
  Mail,
  Shield,
  CreditCard,
  Smartphone,
} from "lucide-react";

interface CheckoutPageProps {
  searchParams: Promise<{ paymentId?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  if (!params.paymentId) {
    redirect("/");
  }

  const checkout = await getCheckoutByPaymentId({
    paymentId: params.paymentId,
  });

  if (!checkout.success || !checkout.data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <MaxWidthWrapper>
          <div className="text-center" dir="rtl">
            <h1 className="text-2xl font-bold text-red-400">الدفع غير موجود</h1>
            <p className="text-gray-400 mt-2">
              الدفع الذي تبحث عنه غير موجود أو ليس لديك الصلاحية لعرضه.
            </p>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  const {
    payment,
    invoice,
    sale,
    item,
    pricingPlan,
    customer,
    seller,
    appInstallation,
  } = checkout.data;

  const renderItemSummary = () => {
    // App Installation Summary
    if (appInstallation) {
      return (
        <div className="space-y-6">
          {/* App Header */}
          <div className="flex items-start space-x-4 space-x-reverse">
            {appInstallation.app.logoUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={appInstallation.app.logoUrl}
                  alt={appInstallation.app.name}
                  width={64}
                  height={64}
                  className="rounded-lg border border-gray-600"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {appInstallation.app.name}
              </h1>
              <p className="text-gray-400 mt-1">
                {appInstallation.app.shortDesc}
              </p>
              <Badge
                variant="secondary"
                className="mt-2 bg-gray-700 text-gray-300"
              >
                اشتراك تطبيق
              </Badge>
            </div>
          </div>

          {/* App Plan Details */}
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">الخطة</span>
              <span className="text-gray-300">{appInstallation.planName}</span>
            </div>

            {appInstallation.trialDays && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">فترة التجربة</span>
                <span className="text-gray-300">
                  {appInstallation.trialDays} يوم
                </span>
              </div>
            )}

            {appInstallation.isRecurring && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">دورة الفوترة</span>
                <span className="text-gray-300">
                  كل {appInstallation.recurringDays} يوم
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Course Summary
    if (item?.type === "COURSE" && item.details) {
      return (
        <div className="space-y-6">
          {/* Course Header */}
          <div className="flex items-start space-x-4 space-x-reverse">
            {item.details.thumbnailUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={item.details.thumbnailUrl}
                  alt={item.details.title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover border border-gray-600"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {item.details.title}
              </h1>
              <Badge
                variant="secondary"
                className="mt-2 bg-gray-700 text-gray-300"
              >
                دورة أونلاين
              </Badge>
            </div>
          </div>

          {/* Course Features */}
          <div className="grid grid-cols-2 gap-4">
            {item.details.length > 0 && (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{item.details.length} ساعة</span>
              </div>
            )}

            <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">
                {item.details.level || "جميع المستويات"}
              </span>
            </div>

            {item.details.certificate && (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                <Award className="h-4 w-4" />
                <span className="text-sm">شهادة متضمنة</span>
              </div>
            )}
          </div>

          {/* Course Description */}
          {item.details.courseDescription && (
            <div className="prose prose-sm prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    typeof item.details.courseDescription === "string"
                      ? item.details.courseDescription
                      : JSON.stringify(item.details.courseDescription),
                }}
              />
            </div>
          )}
        </div>
      );
    }

    // Product Summary
    if (item?.type === "PRODUCT" && item.details) {
      return (
        <div className="space-y-6">
          {/* Product Header */}
          <div className="flex items-start space-x-4 space-x-reverse">
            {item.details.thumbnailUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={item.details.thumbnailUrl}
                  alt={item.details.title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover border border-gray-600"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {item.details.title}
              </h1>
              <Badge
                variant="secondary"
                className="mt-2 bg-gray-700 text-gray-300"
              >
                منتج رقمي
              </Badge>
            </div>
          </div>

          {/* Product Features */}
          <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
            <Download className="h-4 w-4" />
            <span className="text-sm">تحميل فوري بعد الشراء</span>
          </div>

          {/* Product Description */}
          {item.details.description && (
            <div className="prose prose-sm prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    typeof item.details.description === "string"
                      ? item.details.description
                      : JSON.stringify(item.details.description),
                }}
              />
            </div>
          )}
        </div>
      );
    }

    // Fallback for other payment types
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {payment.description || "دفع"}
          </h1>
          <Badge variant="secondary" className="mt-2 bg-gray-700 text-gray-300">
            {payment.type
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900" dir="rtl">
      <MaxWidthWrapper>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Item Summary Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              {/* Customer Info Header */}
              {customer && (
                <div className="flex items-center space-x-3 space-x-reverse mb-6">
                  {customer.photo_url ? (
                    <Image
                      src={customer.photo_url}
                      alt={customer.full_name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {customer.full_name}
                    </h2>
                    <p className="text-gray-400 text-sm">{customer.email}</p>
                  </div>
                </div>
              )}

              {renderItemSummary()}

              <Separator className="my-6 bg-gray-600" />

              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">الوصف</h3>
                <p className="text-gray-300 text-sm">
                  {payment.description || "اشتري خدمتي هنا"}
                </p>

                {/* Apps included indicator */}
                <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                  <div className="flex space-x-1 space-x-reverse">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  </div>
                  <span className="text-sm">4 تطبيقات متضمنة</span>
                </div>
              </div>

              <Separator className="my-6 bg-gray-600" />

              {/* Pricing Plan Details */}
              {pricingPlan && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">
                    خطة الأسعار: {pricingPlan.name}
                  </h3>

                  {pricingPlan.description && (
                    <p className="text-gray-400 text-sm">
                      {pricingPlan.description}
                    </p>
                  )}

                  <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">النوع</span>
                      <Badge
                        variant="outline"
                        className="border-gray-500 text-gray-300"
                      >
                        {pricingPlan.pricingType.replace("_", " ")}
                      </Badge>
                    </div>

                    {pricingPlan.accessDuration && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">الوصول</span>
                        <span className="text-white">
                          {pricingPlan.accessDuration === "UNLIMITED"
                            ? "مدى الحياة"
                            : `${pricingPlan.accessDurationDays} يوم`}
                        </span>
                      </div>
                    )}

                    {pricingPlan.trialDays && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">التجربة</span>
                        <span className="text-white">
                          {pricingPlan.trialDays} يوم
                        </span>
                      </div>
                    )}

                    {pricingPlan.recurringDays && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">الفوترة</span>
                        <span className="text-white">
                          كل {pricingPlan.recurringDays} يوم
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-6 bg-gray-600" />

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">ملخص الطلب</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">المجموع الفرعي</span>
                    <span className="text-white">
                      {sale?.originalAmount || payment.amount}{" "}
                      {payment.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">رسوم التجديد</span>
                    <span className="text-white">
                      {payment.amount} {payment.currency} في الشهر
                    </span>
                  </div>

                  {sale?.discountAmount && sale.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-400">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Tag className="h-4 w-4" />
                        <span>خصم</span>
                        {sale.coupon && (
                          <Badge
                            variant="outline"
                            className="text-xs border-green-400 text-green-400"
                          >
                            {sale.coupon.code}
                          </Badge>
                        )}
                      </div>
                      <span>
                        -{sale.discountAmount} {payment.currency}
                      </span>
                    </div>
                  )}

                  <Separator className="bg-gray-600" />

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">المجموع المستحق اليوم</span>
                    <span className="text-white">
                      {payment.amount} {payment.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              {seller && (
                <>
                  <Separator className="my-6 bg-gray-600" />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">البائع</h3>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {seller.avatarUrl && (
                        <Image
                          src={seller.avatarUrl}
                          alt={seller.user_name || "البائع"}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-white">
                          {seller.user_name}
                        </p>
                        {seller.support_email && (
                          <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-400">
                            <Mail className="h-3 w-3" />
                            <span>{seller.support_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Side - Payment Form Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                تفاصيل الدفع
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="flex space-x-4 space-x-reverse mb-4">
                  <button className="flex-1 p-3 border-2 border-blue-600 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center space-x-2 space-x-reverse">
                    <CreditCard className="h-5 w-5" />
                    <span>البطاقة</span>
                  </button>
                  <button className="flex-1 p-3 border border-gray-600 text-gray-400 rounded-lg flex items-center justify-center space-x-2 space-x-reverse hover:border-gray-500">
                    <Smartphone className="h-5 w-5" />
                    <span>Cash App Pay</span>
                  </button>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">حالة الدفع</span>
                  <Badge
                    variant={
                      payment.status === "COMPLETED"
                        ? "default"
                        : payment.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                    }
                    className="bg-yellow-600/20 text-yellow-400 border-yellow-600"
                  >
                    {payment.status === "PENDING"
                      ? "في الانتظار"
                      : payment.status === "COMPLETED"
                      ? "مكتمل"
                      : payment.status}
                  </Badge>
                </div>

                {payment.gatewayId && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-sm">المرجع</span>
                    <span className="text-white text-sm font-mono">
                      {payment.gatewayId}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    رقم البطاقة
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="absolute left-3 top-3 flex space-x-1">
                      <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div className="w-6 h-4 bg-red-600 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      تاريخ انتهاء الصلاحية
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      رمز الأمان
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    defaultValue={customer?.full_name || ""}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    البلد أو المنطقة
                  </label>
                  <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                    <option value="الجزائر">الجزائر</option>
                    <option value="المغرب">المغرب</option>
                    <option value="تونس">تونس</option>
                    <option value="مصر">مصر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    العنوان السطر 1
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                  انضم
                </button>

                <div className="flex items-center justify-center text-gray-400 text-sm">
                  <Shield className="h-4 w-4 ml-2" />
                  <span>مؤمن بواسطة Whop</span>
                </div>

                <p className="text-gray-400 text-xs text-center leading-relaxed">
                  بالانضمام، فإنك توافق على شروط وأحكام Web Elites وشروط خدمة
                  Whop وسياسة الخصوصية والسماح لشركاء Whop الماليين بتحصيل رسوم
                  بطاقتك لهذه الدفعة والمدفوعات المستقبلية، إن أمكن. يمكنك
                  دائماً إلغاء عضويتك في لوحة التحكم الخاصة بك.
                </p>

                <div className="flex justify-center space-x-4 space-x-reverse text-gray-400 text-sm">
                  <a
                    href="#"
                    className="hover:text-white transition duration-200"
                  >
                    الشروط
                  </a>
                  <a
                    href="#"
                    className="hover:text-white transition duration-200"
                  >
                    الخصوصية
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
