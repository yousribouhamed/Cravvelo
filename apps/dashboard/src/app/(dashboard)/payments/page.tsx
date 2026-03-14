import AppShell from "@/src/components/app-shell";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import { getAllPayments, getPaymentStats } from "@/src/modules/payments/actions/payments";
import { PaymentsTable } from "@/src/modules/payments/components/payments-table";
import { PaymentAnalytics } from "@/src/modules/payments/components/payment-analytics";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async () => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("pages");

  const [paymentsResult, notifications, stats] = await Promise.all([
    getAllPayments({ page: 1, limit: 10 }),
    getAllNotifications({ accountId: user.accountId }),
    getPaymentStats(),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  const initialData = {
    data: paymentsResult.data ?? [],
    totalCount: paymentsResult.totalCount ?? 0,
    pageCount: paymentsResult.pageCount ?? 1,
    currentPage: paymentsResult.currentPage ?? 1,
  };

  return (
    <AppShell title={t("payments")} user={user} notifications={notifications}>
      <PaymentAnalytics stats={stats.data} />
      <PaymentsTable initialData={initialData} fetchPage={getAllPayments} />
    </AppShell>
  );
};

export default Page;
