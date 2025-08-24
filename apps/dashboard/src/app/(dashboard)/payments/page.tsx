import AppShell from "@/src/components/app-shell";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import { getAllPayments } from "@/src/modules/payments/actions/payments";
import { paymentColumns } from "@/src/modules/payments/components/columns/payments";
import { DataTable } from "@/src/components/data-table";
import { formatCurrency } from "@/src/modules/payments/utils";

const Page = async () => {
  const user = await getMyUserAction();

  const [payments, notifications] = await Promise.all([
    getAllPayments(),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <AppShell user={user} notifications={notifications}>
      <div className="w-full h-[100px] flex items-start justify-center  flex-col gap-y-8 mb-4">
        <h1>الرصيد</h1>
        <p className="font-bold text-2xl">
          {formatCurrency({ amount: 100, currency: "DZD" })}
        </p>
      </div>
      <DataTable columns={paymentColumns} data={payments.data || []} />
    </AppShell>
  );
};

export default Page;
