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

const PaymentMethodsConnectors: FC = ({}) => {
  const router = useRouter();

  return (
    <div className="w-full min-h-[400px]  flex flex-wrap gap-4 m-8">
      <Card className="w-full max-w-sm h-[300px] rounded-2xl">
        <CardHeader>
          <CardTitle>stripe </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-start p-4">
            منصة لمعالجة الدفع تمكن الشركات من قبول المدفوعات عبر الإنترنت
            وإدارة المعاملات المالية بشكل آمن وفعال.
          </p>
        </CardContent>
        <CardFooter>
          <Button className=" bg-cyan-500 hover:bg-cyan-600">
            الاتصال ب سترايب
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-full max-w-sm h-[300px] rounded-2xl">
        <CardHeader>
          <CardTitle>chargily </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-start p-4">
            منصة لمعالجة الدفع تمكن الشركات من قبول المدفوعات عبر الإنترنت
            وإدارة المعاملات المالية بشكل آمن وفعال.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push("/settings/payments-methods/chargily")}
            className="bg-violet-500 hover:bg-vilet-600"
          >
            الاتصال ب chargily
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentMethodsConnectors;
