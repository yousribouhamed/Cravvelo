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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { useDomainStatus } from "@/src/hooks/use-domain-status";
import {
  addDomainToVercel,
  getConfigResponse,
  getDomainResponse,
} from "@/src/lib/domains";
import DomainStatus from "@/src/components/domain-status";
import DomainConfiguration from "@/src/components/domain-configuration";

interface AddCustomDomain {
  customDomain: string | null;
}

const formSchema = z.object({
  cutomedomain: z.string(),
});

const AddCusotmDomainForm: FC<AddCustomDomain> = ({ customDomain }) => {
  const mutation = trpc.setCustomDomain.useMutation({
    onSuccess: () => {
      maketoast.success();
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
    // await useDomainStatus({ domain: data.cutomedomain });
    // const response = await getDomainResponse("abdullah.com");
    // console.log(response);
    // const response = await getConfigResponse("abdullah.com");
    // console.log(response);
    // const response = await fetch(`/api/domain/${data.cutomedomain}/verify`);
    // const values = await response.json();
    // console.log(values);

    // const ah = await addDomainToVercel(data.cutomedomain);

    // console.log(ah);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border h-full w-full rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>مجال مخصص</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="cutomedomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق المخصص لموقعك.</FormLabel>
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
          <CardFooter>
            <Button
              className=" flex items-center gap-x-2"
              disabled={mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              تاكيد
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddCusotmDomainForm;
