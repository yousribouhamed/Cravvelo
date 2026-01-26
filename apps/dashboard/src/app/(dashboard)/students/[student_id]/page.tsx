import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { prisma } from "database/src";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerTranslations } from "@/src/lib/i18n/utils";
import { getUserLocale } from "@/src/services/locale";
import { Badge } from "@ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import {  Clock, Globe, Bell, MessageSquare, ShoppingBag, Award, Users, CreditCard, FileText } from "lucide-react";

interface PageProps {
  params: Promise<{ student_id: string }>;
}

// Date formatter for server components
const formatDate = (date: Date | null, locale: string) => {
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

// Empty state component
const EmptyState = ({ message }: { message: string }) => {
  return (
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
};

export default async function Page({ params }: PageProps) {
  const { student_id } = await params;
  const user = await getMyUserAction();
  const locale = await getUserLocale();
  const t = await getServerTranslations("students");

  const [notifications, student] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    prisma.student.findUnique({
      where: {
        id: student_id,
        accountId: user.accountId,
      },
      include: {
        Sales: {
          include: {
            Course: {
              select: {
                id: true,
                title: true,
              },
            },
            Product: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        Certificates: {
          orderBy: { createdAt: "desc" },
        },
        Comments: {
          include: {
            Course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        Referrals: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        Payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        Invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title={student?.full_name}
        />

        {/* Personal Information Section */}
        <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{t("detail.personalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[300px] h-[300px] relative rounded-xl border overflow-hidden">
                <Image
                  src={student?.photo_url ?? "/avatar.png"}
                  alt={student?.full_name + " photo"}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.name")}:</p>
                  <p className="text-muted-foreground">{student?.full_name}</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.email")}:</p>
                  <p className="text-muted-foreground">{student?.email}</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.phone")}:</p>
                  <p className="text-muted-foreground">
                    {student?.phone || t("detail.emptyStates.notAvailable")}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-bold text-card-foreground min-w-[120px]">{t("detail.bio")}:</p>
                  <p className="text-muted-foreground">
                    {student?.bio || t("detail.emptyStates.notAvailable")}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{t("detail.accountStatus")}</h3>
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
                <div className="flex items-center gap-2">
                  <span className="font-medium text-card-foreground">{t("detail.emailVerified")}:</span>
                  <Badge
                    variant="outline"
                    className={
                      student.emailVerified
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
                        : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                    }
                  >
                    {student.emailVerified ? t("detail.enabled") : t("detail.disabled")}
                  </Badge>
                </div>
                {student.emailVerifiedAt && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-card-foreground">{t("detail.emailVerifiedAt")}:</span>
                    <span className="text-muted-foreground">{formatDate(student.emailVerifiedAt, locale)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity & Preferences Section */}
        <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("detail.activityTracking")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.joinedDate")}:</span>
                <span className="text-muted-foreground">{formatDate(student.createdAt, locale)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.lastVisited")}:</span>
                <span className="text-muted-foreground">
                  {student.lastVisitedAt ? formatDate(student.lastVisitedAt, locale) : t("detail.emptyStates.notAvailable")}
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
                <span className="text-muted-foreground">{student.preferredLanguage || t("detail.emptyStates.notAvailable")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{t("detail.timezone")}:</span>
                <span className="text-muted-foreground">{student.timezone || t("detail.emptyStates.notAvailable")}</span>
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

        {/* Purchases Section */}
        <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t("detail.purchases")} ({student.Sales.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{sale.status}</Badge>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("detail.emptyStates.noPurchases")} />
            )}
          </CardContent>
        </Card>

        {/* Certificates Section */}
        <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t("detail.certificates")} ({student.Certificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                          {t("detail.issuedDate")}: {formatDate(certificate.issueDate || certificate.createdAt, locale)}
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

        {/* Comments Section */}
        <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t("detail.comments")} ({student.Comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      <p className="text-sm text-muted-foreground line-clamp-2">{comment.content}</p>
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

        {/* Referrals Section */}
        {student.Referrals.length > 0 && (
          <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("detail.referrals")} ({student.Referrals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                        <div className="text-right">
                          <p className="text-sm font-medium text-card-foreground">
                            {referral.numberOfReferredStudents} {referral.numberOfReferredStudents === 1 ? "referral" : "referrals"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total: {referral.totalEarnings.toFixed(2)} DZD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payments Section */}
        {student.Payments.length > 0 && (
          <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("detail.payments")} ({student.Payments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.Payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-card-foreground">{payment.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.createdAt, locale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{payment.status}</Badge>
                        <span className="font-semibold text-card-foreground">
                          {payment.amount.toFixed(2)} {payment.currency || "DZD"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoices Section */}
        {student.Invoices.length > 0 && (
          <Card className="w-full mt-4 bg-card text-card-foreground border rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t("detail.invoices")} ({student.Invoices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.Invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-medium text-card-foreground">
                          Invoice #{invoice.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.createdAt, locale)}
                        </p>
                        {invoice.description && (
                          <p className="text-xs text-muted-foreground mt-1">{invoice.description}</p>
                        )}
                      </div>
                     
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </MaxWidthWrapper>
  );
}
