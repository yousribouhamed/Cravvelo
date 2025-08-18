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

const formSchema = z.object({
  subdomain: z.string().min(1, { message: "يرجى إدخال النطاق الفرعي" }),
});

interface ChangeDomainFormProps {
  subdomain: string | null;
  onSuccess?: (newSubdomain: string) => void;
  onError?: (error: string) => void;
}

const ChangeSubDomainForm: FC<ChangeDomainFormProps> = ({
  subdomain,
  onSuccess,
  onError,
}) => {
  const initialSubdomain = subdomain ? subdomain.split(".")[0] : "";

  const mutation = trpc.chnageSubDmain.useMutation({
    onSuccess: (data) => {
      onSuccess?.(data?.subdomain || form.getValues().subdomain);
    },
    onError: (error) => {
      const errorMessage = error.message || "حدث خطأ أثناء تحديث النطاق الفرعي";
      onError?.(errorMessage);
      form.setError("subdomain", { message: errorMessage });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subdomain: initialSubdomain,
    },
  });

  const watchedSubdomain = form.watch("subdomain");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync({
      subdomain: data.subdomain + ".cravvelo.com",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>النطاق الفرعي</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق الفرعي لموقعك</FormLabel>
                  <FormControl>
                    <div className="w-full h-14 border rounded-xl flex items-center p-2">
                      <div className="w-[150px] h-full flex items-center justify-center bg-primary text-white rounded-lg">
                        <span className="text-sm">cravvelo.com/</span>
                      </div>
                      <div className="flex-1 flex items-center">
                        <Input
                          className="border-none shadow-none focus-visible:ring-0"
                          placeholder="حدد اسم المجال الخاص بك"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    أدخل النطاق الفرعي المطلوب لموقعك
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              className="flex items-center gap-x-2"
              disabled={mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              تأكيد
            </Button>

            {/* Preview */}
            <div className="text-xs text-gray-500">
              {watchedSubdomain && (
                <span>المعاينة: {watchedSubdomain}.cravvelo.com</span>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ChangeSubDomainForm;
