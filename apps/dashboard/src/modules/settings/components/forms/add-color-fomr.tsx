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

const formSchema = z.object({
  primaryColor: z.string().min(1, "اللون الرئيسي مطلوب"),
  darkPrimaryColor: z.string().min(1, "اللون الرئيسي للوضع المظلم مطلوب"),
});

interface ChangeDomainFormProps {
  primaryColor: string | null;
  darkPrimaryColor: string | null;
}

const AddColorFrom: FC<ChangeDomainFormProps> = ({
  primaryColor,
  darkPrimaryColor,
}) => {
  const mutation = trpc.addWebSiteColor.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: (error) => {
      console.log(error);
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: primaryColor || "#3B82F6",
      darkPrimaryColor: darkPrimaryColor || "#60A5FA",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate({
      primaryColor: data.primaryColor,
      darkPrimaryColor: data.darkPrimaryColor,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle>ألوان الأكاديمية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Color Field */}
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    اللون الرئيسي (الوضع العادي)
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="color"
                          className="w-16 h-10 p-1 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="#3B82F6"
                        className="font-mono text-sm"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: field.value }}
                      title="معاينة اللون"
                    />
                  </div>
                  <FormDescription>
                    سيظهر هذا اللون في الوضع العادي لأكاديميتك
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dark Mode Primary Color Field */}
            <FormField
              control={form.control}
              name="darkPrimaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    اللون الرئيسي (الوضع المظلم)
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="color"
                          className="w-16 h-10 p-1 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="#60A5FA"
                        className="font-mono text-sm"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: field.value }}
                      title="معاينة اللون"
                    />
                  </div>
                  <FormDescription>
                    سيظهر هذا اللون في الوضع المظلم لأكاديميتك
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Section */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">معاينة الألوان</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">الوضع العادي</div>
                  <div
                    className="w-full h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center text-white font-medium shadow-sm"
                    style={{ backgroundColor: form.watch("primaryColor") }}
                  >
                    عينة النص
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">الوضع المظلم</div>
                  <div
                    className="w-full h-20 rounded-lg border-2 border-gray-600 bg-gray-900 flex items-center justify-center text-white font-medium shadow-sm"
                    style={{
                      backgroundColor: form.watch("darkPrimaryColor"),
                      border: `2px solid ${form.watch("darkPrimaryColor")}40`,
                    }}
                  >
                    عينة النص
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="flex items-center gap-x-2"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? <LoadingSpinner /> : null}
              تأكيد
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddColorFrom;
