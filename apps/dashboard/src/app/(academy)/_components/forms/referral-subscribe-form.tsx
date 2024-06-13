"use client";

import React, { type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { LoadingButton } from "@/src/components/loading-button";
import { Student } from "database";
import { subscribe } from "../../_actions/referral";
import { academiatoast } from "../academia-toasts";

const formSchema = z.object({
  ccp: z.string(),
});

interface ReferralFormProps {
  studnet: Student;
  accountId: string;
  color: string;
}

const ReferralSubscribtionForm: FC<ReferralFormProps> = ({
  studnet,
  color,
  accountId,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const refferal = await subscribe({
        accountId,
        ccp: values.ccp,
      });

      academiatoast.make({
        color,
        message: "تم الاشتراك بنجاح",
        title: "نجاح",
        type: "SUCCESS",
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      academiatoast.make({
        color,
        message: "حدث خطأ ما",
        title: "فشل",
        type: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-fit min-h-[200px] bg-white shadow border rounded-xl max-w-2xl p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="ccp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {" "}
                  للاشتراك في نظام التسويق بالعمولة يرجى ادخال حساب ccp فعال
                </FormLabel>
                <FormControl>
                  <Input className="focus:border-black" {...field} />
                </FormControl>
                <FormDescription>
                  سيم ارسال الاموال الى هذا الحساب
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full h-[50px] flex items-center justify-end">
            <LoadingButton
              data-ripple-light="true"
              pending={loading}
              className=" rounded-lg "
              type="submit"
              style={{
                backgroundColor: color ?? "#FC6B00",
              }}
            >
              اشترك الان
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReferralSubscribtionForm;
