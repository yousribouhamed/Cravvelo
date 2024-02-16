import type { FC } from "react";
import PaymentForm from "../../_components/forms/payment-form";

export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.jadir.vercel.app"
      : decodeURIComponent(params?.site);

  return (
    <>
      <PaymentForm subdomain={subdomain_value} />
    </>
  );
};

export default Page;
