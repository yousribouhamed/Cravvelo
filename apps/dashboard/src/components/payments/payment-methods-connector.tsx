"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { PaymentsConnect } from "database";
import Image from "next/image";

interface PaymentMethodsConnectorsProps {
  data: PaymentsConnect;
}

const PaymentMethodsConnectors: FC<PaymentMethodsConnectorsProps> = ({
  data,
}) => {
  const router = useRouter();

  const isChargilyConnected =
    data && data?.chargilyPublicKey && data?.chargilySecretKey ? true : false;

  return (
    <div className="w-full min-h-[400px]  flex flex-wrap gap-4 m-8">
      <Card className="w-full max-w-sm h-[300px] rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-start gap-x-2">
            <Image
              src="/chargily.jpg"
              alt="chargily image"
              width={50}
              height={50}
              className="object-fill rounded-xl"
            />
            <CardTitle>chargily</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl  text-start ">
            المنصة الاولى في الجزائر لاستقبال الاموال عبر الانترنت دون الحاجة
            لسجل تجاري
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-x-4 mt-6">
          <Button
            onClick={() => router.push("/settings/payments-methods/chargily")}
            className={` hover:bg-vilet-600 ${
              isChargilyConnected ? "bg-violet-500 " : "bg-violet-500"
            }`}
          >
            {isChargilyConnected ? "التفاصيل" : "  الاتصال ب chargily"}
          </Button>
          {isChargilyConnected && (
            <Button className={` hover:bg-vilet-600 bg-green-500`}>متصل</Button>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full max-w-sm h-[300px] rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-start gap-x-2">
            <Image
              src="/stripe-2.svg"
              alt="chargily image"
              width={50}
              height={50}
              className="object-fill rounded-xl"
            />
            <CardTitle>stripe</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl  text-start ">
            Stripe هي منصة مدفوعات عبر الإنترنت تتيح للشركات قبول المدفوعات
            وإدارة العمليات المالية بسهولة.
          </p>
        </CardContent>
        <CardFooter className="flex items-center  gap-x-4 mb-4">
          <Button className={`bg-blue-700`} disabled>
            قريبا
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentMethodsConnectors;
