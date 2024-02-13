import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChargilyConnectSchema } from "@/src/lib/validators/payments";
import { Input } from "@ui/components/ui/input";

type Inputs = z.infer<typeof ChargilyConnectSchema>;

const ChargilyConnector: FC = ({}) => {
  const router = useRouter();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(ChargilyConnectSchema),
    defaultValues: {
      chargilyPrivateKey: "",
      chargilyPublicKey: "",
    },
  });

  function onSubmit(data: Inputs) {}

  return (
    <Card className="w-full h-[300px] rounded-2xl">
      <CardHeader>
        <CardTitle>chargily </CardTitle>
        <CardDescription>
          منصة لمعالجة الدفع تمكن الشركات من قبول المدفوعات عبر الإنترنت وإدارة
          المعاملات المالية بشكل آمن وفعال.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="chargilyPublicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>chargily public key</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chargilyPrivateKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>chargily public key</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              data-ripple-light="true"
              type="submit"
              size="lg"
              className="w-full text-white font-bold bg-primary"
            >
              تغيير كلمة المرور
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button>الاتصال ب سترايب</Button>
      </CardFooter>
    </Card>
  );
};

export default ChargilyConnector;
