"use client";

import type { FC } from "react";
import { useAcademiaStore } from "../../global-state/academia-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

import { Input } from "@ui/components/ui/input";
import { useChargily } from "../../hooks/use-chargily";
import React from "react";

interface Props {
  subdomain: string;
}

const PaymentForm: FC<Props> = ({ subdomain }) => {
  const bagItems = useAcademiaStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { pay } = useChargily();

  const handlePayWithChargily = async () => {
    if (bagItems.state.shoppingBag?.length === 0) return;
    setIsLoading(true);
    await pay({
      product_name: bagItems.state.shoppingBag[0]?.name,
      product_price: Number(bagItems.state.shoppingBag[0]?.price),
      subdomain,
    });
    setIsLoading(false);
  };

  return (
    <div className="w-full min-h-[700px] h-fit grid gird grid-cols-1 lg:grid-cols-2 mb-[70px] p-8 gap-8">
      <div className="w-full h-full bg-gray-100 flex flex-col items-end p-8 rounded-xl">
        <div className="w-full min-h-[200px] h-fit  flex flex-col items-start p-2">
          {Array.isArray(bagItems.state.shoppingBag) &&
            bagItems.state.shoppingBag?.length !== 0 && (
              <div className="w-full h-[400px] flex flex-col items-center justify-center">
                <h3 className="font-bold text-xl text-black">
                  حقيبة التسوق الخاصة بك فارغة
                </h3>
              </div>
            )}
          {Array.isArray(bagItems.state.shoppingBag) &&
            bagItems.state.shoppingBag?.length > 0 &&
            bagItems.state.shoppingBag?.map((product) => (
              <li key={product.id} className="flex py-4 gap-x-4">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={product.imageUrl}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{product.name}</h3>
                    </div>
                  </div>
                  <div className="flex w-full flex-1 items-end justify-between text-sm">
                    <div className="flex justify-between items-end w-full ">
                      <p className="ml-4">{product.price} DZD</p>

                      <button
                        type="button"
                        className="font-medium bg-blue-500 px-4 py-2 rounded-xl text-white"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </div>
        <div className="w-full h-[100px] flex flex-col items-start justify-center gap-y-4 text-black border-t ">
          <div className="flex w-full h-[20px] justify-between text-base font-medium">
            <p>المجموع الفرعي</p>
            <p>DZD 262.00</p>
          </div>
          <div className="flex w-full h-[20px] justify-between text-base font-medium">
            <p> الشحن والضرائب .</p>
            <p>DZD 0.00</p>
          </div>
          <div className="flex w-full h-[20px] justify-between text-base font-medium border-t">
            <p className="text-lg font-bold ">المجموع</p>
            <p className="text-lg font-bold ">DZD 0.00</p>
          </div>
        </div>
      </div>
      <div className="w-full h-full lg:p-8 flex flex-col  gap-y-8 ">
        <Card className=" w-full lg:w-[480px] pt-4 min-h-[250px] h-fit ">
          <CardHeader>
            <CardTitle> حقل خاص بقسائم التخفيض</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <div className="w-full h-1 border-b my-4 max-w-[480px] " />
        <div className="w-full h-[100px] grid lg:grid-cols-1 grid-cols-2 gap-4  max-w-[480px]">
          <button
            disabled={isLoading}
            onClick={handlePayWithChargily}
            className="w-full h-[50px]  max-w-[480px] my-4 rounded-xl bg-violet-500 border-2 border-black text-white flex items-center justify-center"
          >
            {isLoading ? "loading..." : "pay with chargily"}
          </button>
          <button className="w-full h-[50px]  max-w-[480px] my-4 rounded-xl bg-amber-500 border-2 border-black text-white flex items-center justify-center">
            pay with coubon
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
