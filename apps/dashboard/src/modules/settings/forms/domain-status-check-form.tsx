"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import DomainStatus from "@/src/components/domain-status";
import DomainConfiguration from "@/src/components/domain-configuration";
import { useState } from "react";

const domainCheckSchema = z.object({
  domain: z.string().min(1, "يجب إدخال النطاق"),
});

const DomainStatusCheckForm: FC = () => {
  const [domainStatusData, setDomainStatusData] = useState<any>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [checkedDomain, setCheckedDomain] = useState<string>("");

  const domainStatusMutation = trpc.getDomainStatus.useMutation({
    onSuccess: (data) => {
      setDomainStatusData(data);
      setIsCheckingDomain(false);
    },
    onError: (err) => {
      console.error(err);
      maketoast.error();
      setIsCheckingDomain(false);
      setDomainStatusData(null);
    },
  });

  const form = useForm<z.infer<typeof domainCheckSchema>>({
    resolver: zodResolver(domainCheckSchema),
    defaultValues: {
      domain: "",
    },
  });

  async function onCheckDomain(data: z.infer<typeof domainCheckSchema>) {
    setIsCheckingDomain(true);
    setDomainStatusData(null);
    setCheckedDomain(data.domain);
    await domainStatusMutation.mutateAsync({
      domain: data.domain,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCheckDomain)} className="space-y-8">
        <Card className="border h-full w-full rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>فحص حالة النطاق</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق المراد فحصه</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="yourdomain.com"
                        {...field}
                        className="flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                      />
                    </FormControl>
                    <Button
                      className="flex items-center gap-x-2 whitespace-nowrap"
                      disabled={isCheckingDomain}
                      type="submit"
                    >
                      {isCheckingDomain ? <LoadingSpinner /> : null}
                      فحص الحالة
                    </Button>
                  </div>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-2">
                    أدخل النطاق واضغط "فحص الحالة" للتحقق من إعدادات DNS والتحقق
                    من صحة النطاق.
                  </p>
                </FormItem>
              )}
            />

            {/* Display Domain Status Results */}
            {domainStatusData && checkedDomain && (
              <div dir="ltr" className="w-full min-h-[300px] h-fit mt-6">
                <div className="space-y-4 p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <DomainStatus domain={checkedDomain} />
                    <div>
                      <h3 className="font-medium">Domain Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Current verification status for {checkedDomain}
                      </p>
                    </div>
                  </div>
                  <DomainConfiguration domain={checkedDomain} />
                </div>
              </div>
            )}

            {/* Loading State */}
            {isCheckingDomain && (
              <div className="w-full min-h-[200px] h-fit mt-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <LoadingSpinner />
                  <p className="text-sm text-muted-foreground">
                    جاري فحص حالة النطاق...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default DomainStatusCheckForm;
