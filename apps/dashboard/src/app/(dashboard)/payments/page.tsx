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

  const [payments, notifications, stats] = await Promise.all([
    getAllPayments(),
    getAllNotifications({ accountId: user.accountId }),
    getPaymentStats(),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <AppShell title={t("payments")} user={user} notifications={notifications}>
      <PaymentAnalytics stats={stats.data} />
      <PaymentsTable data={payments.data || []} />
    </AppShell>
  );
};

export default Page;
