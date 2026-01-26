"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { Switch } from "@ui/components/ui/switch";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { useState } from "react";
import * as React from "react";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Product } from "database";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductPricingFormProps {
  product: Product;
}

function ProductPricingForm({ product }: ProductPricingFormProps) {
  const t = useTranslations("productForms.pricingForm");
  const tForm = useTranslations("courseForms");
  const router = useRouter();
  const path = usePathname();
  const productId = getValueFromUrl(path, 2);
  const [isFree, setIsFree] = useState(product?.price === 0 ? true : false);
  
  const createPricingSchema = () => z.object({
    price: z.string().min(1, { message: tForm("requiredField") }),
    compareAtPrice: z.string().min(1, { message: tForm("requiredField") }),
  });
  
  const PricingFormSchema = createPricingSchema();
  
  const mutation = trpc.products.priceProduct.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/products/${product.id}/publishing`);
    },
    onError: (err) => {
      maketoast.error();
      console.error(err);
    },
  });

  const form = useForm<z.infer<typeof PricingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PricingFormSchema),

    defaultValues: {
      price: product?.price ? product?.price?.toString() : "100",
      compareAtPrice: product?.compareAtPrice
        ? product?.compareAtPrice?.toString()
        : "1000",
    },
  });

  async function onSubmit(values: z.infer<typeof PricingFormSchema>) {
    await mutation.mutateAsync({
      productId,
      pricingType: isFree ? "FREE" : "ONE_TIME",
      price: isFree ? 0 : Number(values.price),
      compareAtPrice: isFree ? 0 : Number(values.compareAtPrice) || undefined,
    });
  }

  return (
    <TooltipProvider>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-8 ">
        <div className="col-span-2 w-full h-full">
          <Form {...form}>
            <form
              id="add-text"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full "
            >
              <FormLabel className="text-xl block font-bold text-foreground">
                {t("pricingDescription")}
              </FormLabel>

              <div className="grid grid-cols-2 w-full h-fit gap-x-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel asChild>
                        <div className="w-full h-fit flex gap-x-3 items-center">
                          <span>{t("price")}</span>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <HelpCircle className="text-foreground w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[150px]">
                              <p>
                                {t("priceTooltip")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("pricePlaceholder")}
                          disabled={isFree}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel asChild>
                        <div className="w-full h-fit flex gap-x-3 items-center">
                          <span>{t("compareAtPrice")}</span>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <HelpCircle className="text-foreground w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[150px]">
                              <p>{t("compareAtPriceTooltip")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isFree}
                          placeholder={t("compareAtPricePlaceholder")}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row bg-card items-center justify-between rounded-lg border border-border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>{t("makeFree")}</FormLabel>
                </div>

                <div dir="ltr">
                  <Switch
                    checked={isFree}
                    onCheckedChange={(val) => {
                      setIsFree(val);
                      if (val === true) {
                        form.setValue("compareAtPrice", "0");
                        form.setValue("price", "0");
                      }
                    }}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1  hidden md:block  w-full h-full ">
          <Card>
            <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-text"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                {t("saveAndContinue")}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                size="lg"
              >
                {t("cancelAndGoBack")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ProductPricingForm;
