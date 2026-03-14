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
import { Input } from "@ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Card, CardContent } from "@ui/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Course, Pricing } from "database";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const PricingFormSchema = z.object({
  pricingType: z.enum(["FREE", "ONE_TIME"]),
  price: z.string().optional(),
  compareAtPrice: z.string().optional(),
  accessDuration: z.enum(["LIMITED", "UNLIMITED"]).optional(),
  accessDurationDays: z.string().optional(),
});

interface PricingPlanWithJunction extends Pricing {
  isDefault: boolean;
  junctionId: string;
}

interface AddPricingFormProps {
  course: Course;
  pricingPlans?: PricingPlanWithJunction[];
}

function AddPricingForm({ course, pricingPlans }: AddPricingFormProps) {
  const t = useTranslations("courseForms");
  const tPricing = useTranslations("courses.pricingForm");
  const currentPlan = pricingPlans?.[0]; // Fixed: added optional chaining
  const router = useRouter();
  const path = usePathname();
  const courseId = getValueFromUrl(path, 2);

  const mutation = trpc.course.priceCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${courseId}/students-management`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof PricingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PricingFormSchema),
    defaultValues: {
      pricingType:
        currentPlan?.pricingType === "RECURRING"
          ? "ONE_TIME"
          : currentPlan?.pricingType ?? "ONE_TIME",
      price: currentPlan?.price ? currentPlan.price.toString() : "10",
      accessDuration: currentPlan?.accessDuration ?? "UNLIMITED",
      accessDurationDays: currentPlan?.accessDurationDays
        ? currentPlan.accessDurationDays.toString()
        : "",
      compareAtPrice: currentPlan?.compareAtPrice
        ? currentPlan.compareAtPrice.toString()
        : "",
    },
  });

  async function onSubmit(values: z.infer<typeof PricingFormSchema>) {
    await mutation.mutateAsync({
      courseId,
      pricingType: values.pricingType,
      price: values.pricingType === "FREE" ? 0 : Number(values.price || 0),
      compareAtPrice:
        values.pricingType === "FREE"
          ? undefined
          : values.compareAtPrice != null && String(values.compareAtPrice).trim() !== ""
            ? Number(values.compareAtPrice)
            : undefined,
      accessDuration:
        values.pricingType === "ONE_TIME" ? values.accessDuration : undefined,
      accessDurationDays:
        values.pricingType === "ONE_TIME" && values.accessDuration === "LIMITED"
          ? Number(values.accessDurationDays || 0)
          : undefined,
      recurringDays: undefined,
    });
  }

  const pricingType = form.watch("pricingType");
  const accessDuration = form.watch("accessDuration");

  return (
    <div className="w-full h-fit grid grid-cols-2 md:grid-cols-3 mt-4 gap-x-8">
      <div className="col-span-2 w-full min-h-full h-fit pb-6">
        <Form {...form}>
          <form
            id="add-pricing"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormLabel className="text-xl block font-bold text-foreground">
              {tPricing("pricingSettings")}
            </FormLabel>
            <FormLabel className="text-md block text-muted-foreground">
              {tPricing("pricingDescription")}
            </FormLabel>
            {/* Pricing Type Tabs */}
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 block text-sm font-medium">
                    {t("planType")}
                  </FormLabel>
                  <Tabs
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full rounded-xl border">
                      <TabsTrigger value="FREE">{t("free")}</TabsTrigger>
                      <TabsTrigger value="ONE_TIME">{t("oneTime")}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show price fields if not FREE */}
            {pricingType !== "FREE" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tPricing("price")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
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
                      <FormLabel>{tPricing("compareAtPrice")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ONE_TIME extra fields */}
            {pricingType === "ONE_TIME" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accessDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("accessDuration")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectDuration")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LIMITED">{t("limited")}</SelectItem>
                          <SelectItem value="UNLIMITED">
                            {t("unlimited")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {accessDuration === "LIMITED" && (
                  <FormField
                    control={form.control}
                    name="accessDurationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("numberOfDays")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Save Actions */}
            <Card className="md:hidden">
              <CardContent className="w-full h-fit flex justify-end items-center p-6 gap-x-4">
                <Button
                  onClick={() => router.back()}
                  className="rounded-xl"
                  variant="secondary"
                  type="button"
                >
                  {t("cancelAndGoBack")}
                </Button>
                <Button
                  disabled={mutation.isLoading}
                  type="submit"
                  className="flex items-center gap-x-2 rounded-xl"
                >
                  {mutation.isLoading ? <LoadingSpinner /> : null}
                  {t("saveAndContinue")}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-fit self-start hidden md:block">
        <Card className="sticky top-24">
          <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
            <Button
              disabled={mutation.isLoading}
              type="submit"
              form="add-pricing"
              className="w-full flex items-center gap-x-2"
              size="lg"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {t("saveAndContinue")}
            </Button>
            <Button
              onClick={() => router.back()}
              className="w-full"
              variant="secondary"
              type="button"
              size="lg"
            >
              {t("cancelAndGoBack")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddPricingForm;
