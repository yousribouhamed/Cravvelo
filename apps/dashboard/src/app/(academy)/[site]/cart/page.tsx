import type { FC } from "react";
import PaymentForm from "../../_components/forms/payment-form";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

interface PageProps {}

const Page: FC = ({}) => {
  return (
    <>
      {/* <div className="w-full h-[30px] flex items-center justify-start gap-x-4 my-6">
        <Link href="/">
          <button className="p-4 bg-white rounded-xl  ">
            <ArrowBigRight className="w-6 h-6" />
          </button>
        </Link>
        <h2 className="text-lg  text-black"> حقيبة التسوق الخاصة بك </h2>
      </div> */}
      <PaymentForm />
    </>
  );
};

export default Page;
