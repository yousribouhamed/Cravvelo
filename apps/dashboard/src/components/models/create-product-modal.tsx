"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { addCourseSchema } from "@/src/lib/validators/course";
import { trpc } from "@/src/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

const AddProductModel: FC = ({}) => {
  const t = useTranslations("products");
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLaoding, setIsLoading] = React.useState(false);
  const mutation = trpc.products.createProduct.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/products/${id}/content`);
    },
    onError: () => {},
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof addCourseSchema>>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof addCourseSchema>) {
    setIsLoading(true);
    await mutation
      .mutateAsync({
        productName: data.title,
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button
          data-ripple-light="true"
          variant="default"
          className="h-[50px] px-4 rounded-xl flex items-center gap-x-2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current"
          >
            <path
              d="M8.8575 3.61523V14.0404M14.0701 8.82784H3.6449"
              strokeWidth="1.04252"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("actions.addNew")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" title={t("modal.title")}>
        <div className="w-full px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("modal.productTitle")} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("modal.productTitlePlaceholder")}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="w-full h-[50px] flex items-center justify-end gap-x-4">
                <Button data-ripple-light="true" variant="ghost">
                  {t("modal.cancel")}
                </Button>
                <Button
                  data-ripple-light="true"
                  className=" flex items-center gap-x-2"
                  disabled={isLaoding}
                  type="submit"
                >
                  {mutation.isLoading ? <LoadingSpinner /> : null}
                  {t("modal.add")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModel;
