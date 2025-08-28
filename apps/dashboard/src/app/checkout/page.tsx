import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getCheckoutByPaymentId } from "@/src/modules/payments/actions/payinvoice.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import { Clock, BookOpen, Download, Award, Tag } from "lucide-react";
import { formatCurrency } from "@/src/modules/payments/utils";
import CheckoutForm from "@/src/modules/payments/components/checkout-form";

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
      <div className="w-full h-screen flex items-center justify-center bg-backgound">
        <MaxWidthWrapper>
          <div className="text-center" dir="rtl">
            <h1 className="text-lg font-bold text-red-400">الدفع غير موجود</h1>
            <p className="text-zinc-400 mt-2">
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
                  className="rounded-lg border border-zinc-600"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">
                {appInstallation.app.name}
              </h1>
              <p className="text-zinc-400 mt-1">
                {appInstallation.app.shortDesc}
              </p>
              <Badge variant="secondary">اشتراك تطبيق</Badge>
            </div>
          </div>

          {/* App Plan Details */}
          <div className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">الخطة</span>
              <span className="text-zinc-300">{appInstallation.planName}</span>
            </div>

            {appInstallation.trialDays && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">فترة التجربة</span>
                <span className="text-zinc-300">
                  {appInstallation.trialDays} يوم
                </span>
              </div>
            )}

            {appInstallation.isRecurring && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">دورة الفوترة</span>
                <span className="text-zinc-300">
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
                  className="rounded-lg object-cover border border-zinc-600"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">
                {item.details.title}
              </h1>
              <Badge
                variant="secondary"
                className="mt-2 bg-zinc-700 text-zinc-300"
              >
                دورة أونلاين
              </Badge>
            </div>
          </div>

          {/* Course Features */}
          <div className="grid grid-cols-2 gap-4">
            {item.details.length > 0 && (
              <div className="flex items-center space-x-2 space-x-reverse text-zinc-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{item.details.length} ساعة</span>
              </div>
            )}

            <div className="flex items-center space-x-2 space-x-reverse text-zinc-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">
                {item.details.level || "جميع المستويات"}
              </span>
            </div>

            {item.details.certificate && (
              <div className="flex items-center space-x-2 space-x-reverse text-zinc-400">
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
                  className="rounded-lg object-cover border border-zinc-600"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">
                {item.details.title}
              </h1>
              <Badge
                variant="secondary"
                className="mt-2 bg-zinc-700 text-zinc-300"
              >
                منتج رقمي
              </Badge>
            </div>
          </div>

          {/* Product Features */}
          <div className="flex items-center space-x-2 space-x-reverse text-zinc-400">
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
          <h1 className="text-lg font-bold text-white">
            {payment.description || "دفع"}
          </h1>
          <Badge variant="secondary" className="mt-2 bg-zinc-700 text-zinc-300">
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
    <div className="h-screen bg-backgound" dir="rtl">
      <div className="w-full h-screen">
        <div className="grid bg-black h-screen grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Item Summary Section */}
          <div className="  max-w-screen-2xl mr-auto border-left p-6 pt-8">
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
                  <p className="text-zinc-400 text-sm">{customer.email}</p>
                </div>
              </div>
            )}

            {renderItemSummary()}

            {/* Description */}
            {payment.description && (
              <div className="space-y-4">
                <h3 className="font-semibold text-white">الوصف</h3>
                <p className="text-zinc-300 text-sm">
                  {payment.description || "اشتري خدمتي هنا"}
                </p>
              </div>
            )}

            {/* Pricing Plan Details */}
            {pricingPlan && (
              <div className="space-y-4">
                <h3 className="font-semibold text-white">
                  خطة الأسعار: {pricingPlan.name}
                </h3>

                {pricingPlan.description && (
                  <p className="text-zinc-400 text-sm">
                    {pricingPlan.description}
                  </p>
                )}

                <div className="bg-card rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">النوع</span>
                    <Badge variant="outline">
                      {pricingPlan.pricingType.replace("_", " ")}
                    </Badge>
                  </div>

                  {pricingPlan.accessDuration && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">الوصول</span>
                      <span className="text-white">
                        {pricingPlan.accessDuration === "UNLIMITED"
                          ? "مدى الحياة"
                          : `${pricingPlan.accessDurationDays} يوم`}
                      </span>
                    </div>
                  )}

                  {pricingPlan.trialDays && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">التجربة</span>
                      <span className="text-white">
                        {pricingPlan.trialDays} يوم
                      </span>
                    </div>
                  )}

                  {pricingPlan.recurringDays && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">الفوترة</span>
                      <span className="text-white">
                        كل {pricingPlan.recurringDays} يوم
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-6 " />

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">ملخص الطلب</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">المجموع الفرعي</span>
                  <span className="text-white">
                    {formatCurrency({
                      amount: payment.amount,
                      currency: payment.currency as "DZD",
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">رسوم التجديد</span>
                  <span className="text-white">
                    {formatCurrency({
                      amount: payment.amount,
                      currency: payment.currency as "DZD",
                    })}{" "}
                    في الشهر
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

                <Separator />

                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white">المجموع المستحق اليوم</span>
                  <span className="text-white">
                    {formatCurrency({
                      amount: payment.amount,
                      currency: payment.currency as "DZD",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form Section */}
          <div className="bg-card   p-6 pt-8">
            <CheckoutForm paymentId={payment.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
