"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
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
import { CUSTOM_DOMAIN_AR, CUSTOM_DOMAIN_EN } from "@cravvelo/i18n";

interface AddCustomDomain {
  customDomain: string | null;
  lang: string;
}

const formSchema = z.object({
  cutomedomain: z.string(),
});

const CusotmDomainForm: FC<AddCustomDomain> = ({ customDomain, lang }) => {
  const CUSTOM_DOMAIN = lang === "en" ? CUSTOM_DOMAIN_EN : CUSTOM_DOMAIN_AR;
  const mutation = trpc.setCustomDomain.useMutation({
    onSuccess: () => {
      maketoast.successWithText({
        text: "لقد تم تسجيل النطاق الجديد الخاص بك",
      });
    },
    onError: (err) => {
      console.error(err);
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cutomedomain: customDomain ? customDomain : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      customdomain: data?.cutomedomain,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border h-full w-full rounded-xl">
          <CardHeader>
            <CardTitle className="text-[#303030]">
              {CUSTOM_DOMAIN.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="cutomedomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{CUSTOM_DOMAIN.desc}</FormLabel>
                  <div className="relative flex w-full ">
                    <FormControl>
                      <Input
                        placeholder="yourdomain.com"
                        {...field}
                        className="z-10 flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                      />
                    </FormControl>
                    <div className="absolute left-3 z-10 flex h-full items-center">
                      {form.watch("cutomedomain") && (
                        <DomainStatus domain={form.watch("cutomedomain")} />
                      )}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("cutomedomain") && (
              <div dir="ltr" className="w-full  min-h-[300px] h-fit ">
                <DomainConfiguration domain={form.watch("cutomedomain")} />
              </div>
            )}
          </CardContent>
          <CardFooter
            className={`w-full h-[70px] flex items-center ${
              lang === "en" ? "justify-end" : "justify-start"
            } `}
          >
            <Button
              className=" flex items-center gap-x-2"
              disabled={!form.formState.isDirty || mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {lang === "en" ? "save" : "تاكيد"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CusotmDomainForm;
