import { InvoiceDetailsPage } from "@/src/modules/settings/pages/invoice-details.page";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { getServerTranslations } from "@/src/lib/i18n/utils";

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { invoiceId } = await params;
  const t = await getServerTranslations("invoices");
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("details.title")}
          goBack
        />

        <GeneralSettingsHeader />

        <InvoiceDetailsPage invoiceId={invoiceId} />
      </main>
    </MaxWidthWrapper>
  );
}
