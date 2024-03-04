"use client";

import { useState, type FC } from "react";
import { Label } from "@ui/components/ui/label";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { useAcademiaStore } from "../../global-state/academia-store";
import { applyCoupon, makePayment } from "../../_actions/payments";
import { useRouter } from "next/navigation";

interface AcademyPymentsProps {
  subdomain: string | null;
}

const AcademyPyments: FC<AcademyPymentsProps> = ({ subdomain }) => {
  const { state, actions } = useAcademiaStore();

  const router = useRouter();
  const [couponCode, setCouponCode] = useState<null | string>(null);

  const [priceAfterCouponCode, setPriceAfterCouponCode] = useState<
    number | null
  >(null);

  const [error, setError] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // make the applay button

  const applayCouponCode = async () => {
    try {
      setError(false);
      setLoading(true);
      const price = await applyCoupon({
        couponCode,
        price:
          state?.shoppingBag
            ?.map((item) => Number(item.price))
            ?.reduce((current, next) => current + next) - priceAfterCouponCode,
      });

      setPriceAfterCouponCode(price);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // proccess the payment

  const proccessPayment = async () => {
    console.log("the funtion is starting");
    try {
      setError(false);
      setLoading(true);

      if (!subdomain) {
        throw new Error("there is no subdmain");
      }

      const url = await makePayment({
        couponCode,
        courcesId: state.shoppingBag?.map((item) => item.id),
        productsId: [],
        subdomain,
      });
      console.log("this is the chargily url");
      console.log(url);

      router.push(url);
    } catch (err) {
      console.error("an error in the process payment funtion");
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[300px] h-fit  flex flex-col p-4 ">
      <div className="w-full h-[70px] flex flex-col gap-y-4">
        <Label>كوبون الخصم</Label>
        <div className="flex items-center justify-between border-2 rounded-xl bg-white h-[40px] border-primary px-2">
          <div className="w-[90%] h-full rounded-xl flex items-center justify-start gap-x-2">
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3 7.84035C19.69 7.84035 20 7.53035 20 7.14035V6.21035C20 2.11035 18.75 0.860352 14.65 0.860352H5.35C1.25 0.860352 0 2.11035 0 6.21035V6.68035C0 7.07035 0.31 7.38035 0.7 7.38035C1.6 7.38035 2.33 8.11035 2.33 9.01035C2.33 9.91035 1.6 10.6304 0.7 10.6304C0.31 10.6304 0 10.9404 0 11.3304V11.8004C0 15.9004 1.25 17.1504 5.35 17.1504H14.65C18.75 17.1504 20 15.9004 20 11.8004C20 11.4104 19.69 11.1004 19.3 11.1004C18.4 11.1004 17.67 10.3704 17.67 9.47035C17.67 8.57035 18.4 7.84035 19.3 7.84035ZM7 5.88035C7.55 5.88035 8 6.33035 8 6.88035C8 7.43035 7.56 7.88035 7 7.88035C6.45 7.88035 6 7.43035 6 6.88035C6 6.33035 6.44 5.88035 7 5.88035ZM13 12.8804C12.44 12.8804 11.99 12.4304 11.99 11.8804C11.99 11.3304 12.44 10.8804 12.99 10.8804C13.54 10.8804 13.99 11.3304 13.99 11.8804C13.99 12.4304 13.56 12.8804 13 12.8804ZM13.9 6.48035L7.17 13.2104C7.02 13.3604 6.83 13.4304 6.64 13.4304C6.45 13.4304 6.26 13.3604 6.11 13.2104C5.82 12.9204 5.82 12.4404 6.11 12.1504L12.84 5.42035C13.13 5.13035 13.61 5.13035 13.9 5.42035C14.19 5.71035 14.19 6.19035 13.9 6.48035Z"
                fill="#FC6B00"
              />
            </svg>
            <input
              onChange={(e) => setCouponCode(e.target.value)}
              className="h-full w-[80%] rounded-xl border-none focus:border-none "
            />
          </div>

          <button
            disabled={loading}
            onClick={applayCouponCode}
            className="text-primary text-xs font-bold h-full w-[10%] disabled:opacity-[50%] disabled:text-gray-700"
          >
            Apply
          </button>
        </div>
      </div>
      {error && (
        <div className="w-full h-[5px] flex items-center justify-center my-2">
          <span className="text-red-500 text-xs font-semibold">
            هذا الكوبون غير صالح
          </span>
        </div>
      )}

      <div className="w-full h-1 border-b border-[#E3E8EF] my-2 mt-4" />
      <div className="w-full h-[30px] flex items-center justify-between">
        <span className="text-[#677489] font-semibold text-md">المجموع</span>
        <span>
          DZD{" "}
          {state?.shoppingBag
            ?.map((item) => Number(item.price))
            ?.reduce((current, next) => current + next)}
        </span>
      </div>
      <div className="w-full h-[30px] flex items-center justify-between">
        <span className="text-[#677489] font-semibold text-md">قيمة الخصم</span>
        <span>
          -DZD{" "}
          {priceAfterCouponCode
            ? state?.shoppingBag
                ?.map((item) => Number(item.price))
                ?.reduce((current, next) => current + next) -
              priceAfterCouponCode
            : 0}
        </span>
      </div>
      <div className="w-full h-1 border-b border-[#E3E8EF] my-2" />
      <div className="w-full h-[30px] flex items-center justify-between">
        <span className="text-black font-semibold text-md">المجموع</span>
        <span>
          DZD{" "}
          {priceAfterCouponCode
            ? priceAfterCouponCode
            : state?.shoppingBag
                ?.map((item) => Number(item.price))
                ?.reduce((current, next) => current + next)}
        </span>
      </div>
      {subdomain ? (
        <button
          onClick={proccessPayment}
          disabled={loading}
          className="mt-8 w-full h-12 bg-primary flex items-center justify-center text-white gap-x-4 disabled:opacity-[50%]"
        >
          {loading && <LoadingSpinner />}
          دفع DZD{" "}
          {priceAfterCouponCode
            ? priceAfterCouponCode
            : state?.shoppingBag
                ?.map((item) => Number(item.price))
                ?.reduce((current, next) => current + next)}
        </button>
      ) : (
        <button
          onClick={() => router.push("/auth-academy/sign-up")}
          className="mt-8 w-full h-12 bg-primary flex items-center justify-center text-white gap-x-4 disabled:opacity-[50%]"
        >
          تسجيل الدخول
        </button>
      )}
    </div>
  );
};

export default AcademyPyments;
