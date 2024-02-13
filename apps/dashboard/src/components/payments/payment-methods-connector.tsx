import type { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";

const PaymentMethodsConnectors: FC = ({}) => {
  return (
    <div className="w-full min-h-[400px] max-w-lg flex flex-wrap gap-4 m-8">
      <Card className="w-full h-[300px] rounded-2xl">
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
          <Button>الاتصال ب سترايب</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentMethodsConnectors;
