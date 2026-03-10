import { getAllPayments } from "@/modules/payments/actions/payments.actions";
import PaymentsListingPage from "@/modules/payments/pages/payments-listing";

export default async function Page() {
  const response = await getAllPayments({ page: 1, limit: 10 });

  if (!response.success || !response.data) {
    return (
      <div className="w-full h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error loading payments
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {response.error ?? "Something went wrong. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return <PaymentsListingPage initialData={response.data} />;
}
