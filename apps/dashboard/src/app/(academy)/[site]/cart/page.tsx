import PaymentForm from "../../_components/forms/payment-form";
import { authorization, getStudent } from "../../_actions/auth";

export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.jadir.vercel.app"
      : decodeURIComponent(params?.site);
  await authorization({ origin: "cart" });

  const student = await getStudent();

  return (
    <>
      <PaymentForm studentId={student?.id} subdomain={subdomain_value} />
    </>
  );
};

export default Page;
