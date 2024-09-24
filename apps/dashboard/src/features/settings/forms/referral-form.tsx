"use client";

import type { FC } from "react";
import { Card, CardContent } from "@ui/components/ui/card";
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
} from "@ui/components/ui/form";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { Switch } from "@ui/components/ui/switch";
import { AUTHORITIES_AR, AUTHORITIES_EN } from "@cravvelo/i18n";

const formSchema = z.object({
  isEnabled: z.boolean(),
});

interface DisableReferralFormAbdullahProps {
  enabled: boolean;
  lang: string;
}

const ReferralForm: FC<DisableReferralFormAbdullahProps> = ({
  enabled,
  lang,
}) => {
  const AUTHORITIES = lang === "en" ? AUTHORITIES_EN : AUTHORITIES_AR;
  const mutation = trpc.enableReferal.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isEnabled: enabled,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      enabled: data.isEnabled,
    });
  }

  return (
    <>
      <div>
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row bg-white items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      {/* @ts-ignore */}
                      <FormLabel>{AUTHORITIES?.referral}</FormLabel>
                    </div>
                    <FormControl>
                      <div dir="ltr">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="col-span-1 w-full h-full ">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6 items-end  space-y-4">
            <Button
              disabled={!form.formState.isDirty || mutation.isLoading}
              type="submit"
              form="add-text"
              className=""
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {lang === "en" ? "save" : "حفظ والمتابعة"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ReferralForm;
