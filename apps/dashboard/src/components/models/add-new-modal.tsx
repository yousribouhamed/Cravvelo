"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { Card } from "@ui/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import React from "react";
import { maketoast } from "../toasts";
import { BookOpen, Package } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

// Enhanced schema to include the type selection
const enhancedSchema = addCourseSchema.extend({
  type: z.enum(["course", "product"]).default("course"),
});

const AddNew: FC = () => {
  const router = useRouter();
  const t = useTranslations("addNew");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const courseMutation = trpc.course.createCourse.useMutation({
    onSuccess: ({ courseId }) => {
      router.push(`/courses/${courseId}/chapters`);
      maketoast.successWithText({ text: t("courseCreated") });
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      setIsLoading(false);
    },
  });

  const productMutation = trpc.products.createProduct.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/products/${id}/content`);
      maketoast.successWithText({ text: t("productCreated") });
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof enhancedSchema>>({
    resolver: zodResolver(enhancedSchema),
    defaultValues: {
      title: "",
      type: "course",
    },
  });

  const selectedType = form.watch("type");

  // Submit handler with proper async/await handling
  async function onSubmit(data: z.infer<typeof enhancedSchema>) {
    setIsLoading(true);

    try {
      if (data.type === "course") {
        // Create course
        await courseMutation.mutateAsync({
          title: data.title,
        });
      } else if (data.type === "product") {
        // Create product
        await productMutation.mutateAsync({
          productName: data.title,
        });
      }
    } catch (error) {
      console.error("Creation failed:", error);
      setIsLoading(false);
    }
  }

  const handleDialogClose = (val: boolean) => {
    setIsOpen(val);
    if (!val) {
      // Reset form when dialog closes
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button data-ripple-light="true">
          <svg
            width="30"
            height="30"
            viewBox="0 0 49 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.2962 34.9965C6.77536 28.2564 7.76372 18.3169 14.5038 12.7961C21.2439 7.27514 31.1833 8.26356 36.7042 15.0036C42.2251 21.7438 41.2368 31.6831 34.4966 37.204C27.7566 42.7249 17.8171 41.7366 12.2962 34.9965Z"
              fill="#FFFFFF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24.501 16.4453C25.4023 16.4453 26.1329 17.1759 26.1329 18.0772L26.1329 31.9247C26.1329 32.826 25.4023 33.5567 24.501 33.5567C23.5997 33.5567 22.869 32.826 22.869 31.9247L22.869 18.0772C22.869 17.1759 23.5997 16.4453 24.501 16.4453Z"
              fill="#FC6B00"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M33.0567 25.001C33.0567 25.9023 32.326 26.6329 31.4247 26.6329H17.5772C16.6759 26.6329 15.9453 25.9023 15.9453 25.001C15.9453 24.0997 16.6759 23.369 17.5772 23.369H31.4247C32.326 23.369 33.0567 24.0997 33.0567 25.001Z"
              fill="#FC6B00"
            />
          </svg>
          <span className="qatar-bold">{t("button")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" title={t("dialogTitle")}>
        <div className="w-full px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedType === "course"
                        ? t("courseTitle")
                        : t("productTitle")}
                      *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          selectedType === "course"
                            ? t("courseTitlePlaceholder")
                            : t("productTitlePlaceholder")
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contentType")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary/50 dark:hover:border-primary/50">
                          <FormItem
                            className="flex justify-between items-center space-y-0"
                            dir={isRTL ? "rtl" : "ltr"}
                          >
                            <div className={cn("flex items-center gap-4", isRTL ? "flex-row" : "flex-row-reverse")}>
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <BookOpen
                                  size={20}
                                  className="text-blue-600 dark:text-blue-400"
                                />
                              </div>
                              <div className={isRTL ? "text-right" : "text-left"}>
                                <FormLabel className="font-medium cursor-pointer text-foreground">
                                  {t("trainingCourse")}
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  {t("trainingCourseDescription")}
                                </p>
                              </div>
                            </div>
                            <FormControl>
                              <RadioGroupItem value="course" />
                            </FormControl>
                          </FormItem>
                        </Card>

                        <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary/50 dark:hover:border-primary/50">
                          <FormItem
                            className="flex justify-between items-center space-y-0"
                            dir={isRTL ? "rtl" : "ltr"}
                          >
                            <div className={cn("flex items-center gap-4", isRTL ? "flex-row" : "flex-row-reverse")}>
                              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                                <Package
                                  size={20}
                                  className="text-green-600 dark:text-green-400"
                                />
                              </div>
                              <div className={isRTL ? "text-right" : "text-left"}>
                                <FormLabel className="font-medium cursor-pointer text-foreground">
                                  {t("digitalProduct")}
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  {t("digitalProductDescription")}
                                </p>
                              </div>
                            </div>
                            <FormControl>
                              <RadioGroupItem value="product" />
                            </FormControl>
                          </FormItem>
                        </Card>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex items-center justify-center gap-x-4 pt-4">
                <Button
                  data-ripple-light="true"
                  size="lg"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="rounded-xl flex items-center justify-center gap-x-2 min-w-[120px]"
                >
                  {selectedType === "course" ? t("createCourse") : t("createProduct")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNew;
