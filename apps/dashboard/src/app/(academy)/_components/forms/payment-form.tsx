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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";

import { Input } from "@ui/components/ui/input";
import { useChargily } from "../../../../hooks/use-chargily";
import React from "react";
import { Label } from "@ui/components/ui/label";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { buyWithCoupon } from "../../_actions/coupon";

interface Props {
  subdomain: string;
  studentId: string;
}

const PaymentForm: FC<Props> = ({ subdomain, studentId }) => {
  const bagItems = useAcademiaStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [code, setCode] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);

  const { pay } = useChargily();

  const handlePayWithChargily = async () => {
    try {
      if (bagItems.state.shoppingBag?.length === 0) return;

      const metadata = {
        studentId,
        productId: bagItems.state.shoppingBag[0]?.id,
      };
      setIsLoading(true);
      await pay({
        product_name: bagItems.state.shoppingBag[0]?.name,
        product_price: Number(bagItems.state.shoppingBag[0]?.price),
        subdomain,
        metadata,
      });
      setIsLoading(false);
      bagItems.actions.clear();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayWidthCoupon = async () => {
    try {
      setIsLoading(true);
      await buyWithCoupon({
        code,
        courseId: bagItems.state.shoppingBag[0]?.id,
      });
      setIsLoading(false);
      bagItems.actions.clear();
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-[700px] h-fit grid gird grid-cols-1 lg:grid-cols-2 mb-[70px] p-8 gap-8">
      <div className="w-full h-full bg-gray-100 flex flex-col items-end p-8 rounded-xl">
        <div className="w-full min-h-[200px] h-fit  flex flex-col items-start p-2">
          {Array.isArray(bagItems.state.shoppingBag) &&
            bagItems.state.shoppingBag?.length === 0 && (
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
                        onClick={() => bagItems.actions.removeItem(product.id)}
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
            <p>DZD {bagItems.state.shoppingBag[0]?.price}</p>
          </div>
          <div className="flex w-full h-[20px] justify-between text-base font-medium">
            <p> الشحن والضرائب .</p>
            <p>DZD 0.00</p>
          </div>
          <div className="flex w-full h-[20px] justify-between text-base font-medium border-t">
            <p className="text-lg font-bold ">المجموع</p>
            <p className="text-lg font-bold ">
              DZD {bagItems.state.shoppingBag[0]?.price}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-full lg:p-8 flex flex-col  gap-y-8 ">
        <Tabs defaultValue="chargily" className="w-[400px]">
          <TabsList className=" h-[110px]  w-full flex items-center justify-end gap-x-4">
            <TabsTrigger value="coupon" asChild>
              <button className="w-[100px] h-[100px] rounded-xl border text-green-500">
                قسيمة الخصم
              </button>
            </TabsTrigger>
            <TabsTrigger value="chargily" asChild>
              <button className="w-[100px] h-[100px] rounded-xl border text-green-500">
                chargily
              </button>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chargily">
            <Card>
              <CardHeader>
                <CardTitle>الدفع بواسطة منصة chargily</CardTitle>
                <CardDescription>
                  سيتم تحويلك الى صفحة شارجيلي لاتمام عملية الدفع بنجاح
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <button
                  disabled={isLoading}
                  onClick={handlePayWithChargily}
                  className="w-full h-[50px]  max-w-[480px] my-4 rounded-xl bg-violet-500 border-2 border-black text-white flex items-center justify-center disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? <LoadingSpinner /> : null}
                  pay with chargily
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="coupon">
            <Card>
              <CardHeader>
                <CardTitle>الدفع بواسطة قسيمة الخصم</CardTitle>
              </CardHeader>

              <CardContent className="w-full h-[100px] flex flex-col gap-y-2">
                <Label>الرمز</Label>
                <Input
                  disabled={isLoading}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="focus:border-blue-500"
                />
                {error && (
                  <span className="text-sm text-red-500 my-2">
                    الرمز الذي ادخلته غير صالح
                  </span>
                )}
              </CardContent>

              <CardFooter>
                <button
                  disabled={isLoading}
                  onClick={handlePayWidthCoupon}
                  className="w-full h-[50px] gap-x-2  max-w-[480px] my-4 rounded-xl bg-yellow-500 border-2 border-black text-white flex items-center justify-center disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? <LoadingSpinner /> : null}
                  استعمال القسيمة
                </button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PaymentForm;
