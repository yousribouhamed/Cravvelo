"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/ui/tabs";
import { cn } from "@ui/lib/utils";
import {
  Clock,
  Globe,
  Bell,
  MessageSquare,
  ShoppingBag,
  Award,
  Users,
  CreditCard,
  FileText,
} from "lucide-react";

// Serializable student shape (dates as strings after server→client serialization)
type SerializedStudent = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  photo_url: string | null;
  isActive: boolean;
  preferredLanguage: string | null;
  timezone: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
  createdAt: string;
  updatedAt: string;
  lastVisitedAt: string | null;
  Sales: Array<{
    id: string;
    itemType: string;
    itemId: string;
    status: string;
    createdAt: string;
    Course: { id: string; title: string } | null;
    Product: { id: string; title: string } | null;
  }>;
  Certificates: Array<{
    id: string;
    courseName: string | null;
    status: string;
    issueDate: string | null;
    createdAt: string;
  }>;
  Comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    Course: { id: string; title: string } | null;
  }>;
  Referrals: Array<{
    id: string;
    studentName: string;
    numberOfReferredStudents: number;
    totalEarnings: number;
    createdAt: string;
  }>;
  Payments: Array<{
    id: string;
    type: string;
    amount: number;
    currency: string | null;
    status: string;
    createdAt: string;
  }>;
  Invoices: Array<{
    id: string;
    description: string | null;
    createdAt: string;
  }>;
};

const formatDate = (date: string | null, locale: string) => {
  if (!date) return null;
  const localeMap: Record<string, string> = {
    ar: "ar-DZ",
    en: "en-US",
  };
  const dateLocale = localeMap[locale] || "en-US";
  return new Intl.DateTimeFormat(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="w-full h-[200px] flex flex-col justify-center items-center gap-y-2 text-center">
    <Image
      src="/academia/not-found.svg"
      alt="Empty state"
      width={200}
      height={200}
      className="opacity-60"
    />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

interface StudentDetailContentProps {
  student: SerializedStudent;
  locale: string;
}

const TAB_IDS = [
  "overview",
  "activity",
  "purchases",
  "certificates",
  "comments",
  "referrals",
  "paymentsInvoices",
] as const;

export function StudentDetailContent({ student, locale }: StudentDetailContentProps) {
  const t = useTranslations("students");
  const tPayments = useTranslations("payments");
  const currentLocale = useLocale();
  const isRTL = currentLocale === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";

  const paymentTypeLabel = (type: string) => {
    const key = `types.${type}`;
    const translated = tPayments(key);
    return translated !== key ? translated : type;
  };

  const paymentStatusLabel = (status: string) => {
    const key = `status.${status}`;
    const translated = tPayments(key);
    return translated !== key ? translated : status;
  };

  return (
    <Tabs
      defaultValue="overview"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full mt-4"
    >
      <div className="relative w-full overflow-x-auto overflow-y-hidden h-[60px]">
        <TabsList
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "w-full flex flex-nowrap overflow-x-auto h-[60px] p-0 gap-0 rounded-lg border border-border bg-card text-foreground"
          )}
        >
          {TAB_IDS.map((tabId) => (
            <TabsTrigger
              key={tabId}
              value={tabId}
              className={cn(
                "h-[60px] rounded-none px-3 sm:px-6 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors hover:text-primary",
                "flex-shrink-0 min-w-max sm:flex-1 sm:min-w-0",
                "border-b-2 border-transparent text-muted-foreground",
                "data-[state=active]:border-b-2 data-[state=active]:border-b-[#F0B110] data-[state=active]:text-foreground data-[state=active]:font-bold dark:data-[state=active]:text-white"
              )}
            >
              {t(`detail.tabs.${tabId}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{t("detail.personalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4", textAlignClass)}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[300px] h-[300px] relative rounded-xl border overflow-hidden">
                <Image
                  src={student.photo_url ?? "/avatar.png"}
                  alt={`${student.full_name} photo`}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.name")}:</p>
                  <p className="text-muted-foreground">{student.full_name}</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.email")}:</p>
                  <p className="text-muted-foreground">{student.email}</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.phone")}:</p>
                  <p className="text-muted-foreground">
                    {student.phone || t("detail.emptyStates.notAvailable")}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.bio")}:</p>
                  <p className="text-muted-foreground">
                    {student.bio || t("detail.emptyStates.notAvailable")}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                {t("detail.accountStatus")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-card-foreground">{t("detail.status")}:</span>
                  <Badge
                    variant="outline"
                    className={
                      student.isActive
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                        : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    }
                  >
                    {student.isActive ? t("detail.active") : t("detail.inactive")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("detail.activityTracking")}
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.joinedDate")}:</span>
                <span className="text-muted-foreground">{formatDate(student.createdAt, locale)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.lastVisited")}:</span>
                <span className="text-muted-foreground">
                  {student.lastVisitedAt
                    ? formatDate(student.lastVisitedAt, locale)
                    : t("detail.emptyStates.notAvailable")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.updatedAt")}:</span>
                <span className="text-muted-foreground">{formatDate(student.updatedAt, locale)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {t("detail.preferredLanguage")}:
                </span>
                <span className="text-muted-foreground">
                  {student.preferredLanguage || t("detail.emptyStates.notAvailable")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.timezone")}:</span>
                <span className="text-muted-foreground">
                  {student.timezone || t("detail.emptyStates.notAvailable")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground flex items-center gap-1">
                  <Bell className="w-4 h-4" />
                  {t("detail.emailNotifications")}:
                </span>
                <Badge variant="outline">
                  {student.emailNotifications ? t("detail.enabled") : t("detail.disabled")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.smsNotifications")}:</span>
                <Badge variant="outline">
                  {student.smsNotifications ? t("detail.enabled") : t("detail.disabled")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="purchases" className="mt-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t("detail.purchases")} ({student.Sales.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            {student.Sales.length > 0 ? (
              <div className="space-y-3">
                {student.Sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">
                          {sale.itemType === "COURSE" && sale.Course
                            ? sale.Course.title
                            : sale.itemType === "PRODUCT" && sale.Product
                              ? sale.Product.title
                              : `${sale.itemType} #${sale.itemId}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(sale.createdAt, locale)}
                        </p>
                      </div>
                      <Badge variant="outline">{sale.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noPurchases")} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="certificates" className="mt-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t("detail.certificates")} ({student.Certificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            {student.Certificates.length > 0 ? (
              <div className="space-y-3">
                {student.Certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">
                          {certificate.courseName || t("detail.emptyStates.notAvailable")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("detail.issuedDate")}:{" "}
                          {formatDate(
                            certificate.issueDate || certificate.createdAt,
                            locale
                          )}
                        </p>
                      </div>
                      <Badge variant="outline">{certificate.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noCertificates")} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="comments" className="mt-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t("detail.comments")} ({student.Comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            {student.Comments.length > 0 ? (
              <div className="space-y-3">
                {student.Comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-card-foreground">
                        {comment.Course?.title || t("detail.emptyStates.notAvailable")}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {comment.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noComments")} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="referrals" className="mt-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t("detail.referrals")} ({student.Referrals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            {student.Referrals.length > 0 ? (
              <div className="space-y-3">
                {student.Referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {referral.studentName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("detail.joinedDate")}: {formatDate(referral.createdAt, locale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={textAlignClass}>
                          <p className="text-sm font-medium text-card-foreground">
                            {referral.numberOfReferredStudents}{" "}
                            {referral.numberOfReferredStudents === 1
                              ? t("detail.referralSingular")
                              : t("detail.referralPlural")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("detail.total")}: {referral.totalEarnings.toFixed(2)} DZD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noReferrals")} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="paymentsInvoices" className="mt-4 space-y-4">
        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {t("detail.payments")} ({student.Payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            {student.Payments.length > 0 ? (
              <div className="space-y-3">
                {student.Payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {paymentTypeLabel(payment.type)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.createdAt, locale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {paymentStatusLabel(payment.status)}
                        </Badge>
                        <span className="font-semibold text-card-foreground">
                          {payment.amount.toFixed(2)} {payment.currency || "DZD"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noPayments")} />
            )}
          </CardContent>
        </Card>

        <Card className="w-full bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("detail.invoices")} ({student.Invoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={textAlignClass}>
            {student.Invoices.length > 0 ? (
              <div className="space-y-3">
                {student.Invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {t("detail.invoiceNumber", { id: invoice.id.slice(0, 8) })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.createdAt, locale)}
                        </p>
                        {invoice.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {invoice.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noInvoices")} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
