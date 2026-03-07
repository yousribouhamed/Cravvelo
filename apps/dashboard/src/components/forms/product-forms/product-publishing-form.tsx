"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardContent } from "@ui/components/ui/card";
import * as React from "react";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import {  Product } from "database";
import { useTranslations } from "next-intl";
// import CourseContent from "@/src/app/(academy)/_components/course-component/course-content";

const addTextSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.any(),
});


interface PublishProductFormProps {
  product: Product;
}

function ProductPublishingForm({ product }: PublishProductFormProps) {
  const t = useTranslations("productForms.publishingForm");
  const router = useRouter();
  const path = usePathname();
  const productId = getValueFromUrl(path, 2);

  const [selectedItem, setSelectedItem] = React.useState<
    "DRAFT" | "PUBLISED" | "EARLY_ACCESS" | "PRIVATE"
  >("PUBLISED");

  const selectionButtoms = [
    {
      title: t("draft"),
      description: t("draftDescription"),
      value: "DRAFT",
    },
    {
      title: t("availableToAll"),
      description: t("availableToAllDescription"),
      value: "PUBLISHED",
    },
  ];
  const form = useForm<z.infer<typeof addTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(addTextSchema),
    defaultValues: {
      title: product.title ?? "",
    },
  });

  const mutation = trpc.products.launchProduct.useMutation({
    onSuccess: () => {
      maketoast.success(t("productPublished"));
      window.location.href = "/products";
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function onSubmit(values: z.infer<typeof addTextSchema>) {
    await mutation.mutateAsync({
      productId: productId,
      status: selectedItem,
    });
  }

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("productTitle")} <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("productTitlePlaceholder")} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="col-span-1 hidden md:block  w-full h-full ">
        <Card>
          <CardContent className="w-full bg-muted h-fit flex flex-col pt-4 space-y-2">
            {selectionButtoms.map((item) => (
              <Button
                key={item.value}
                type="button"
                //@ts-expect-error
                onClick={() => setSelectedItem(item.value)}
                variant="secondary"
                size="lg"
                className={`bg-card flex items-start justify-start flex-col gap-y-1 text-lg border border-border text-foreground min-h-[80px] w-full ${
                  selectedItem === item.value ? "border-primary border-2" : ""
                }`}
              >
                <span className="text-md font-bold text-start w-full">
                  {item.title}
                </span>
                <p className="text-muted-foreground text-sm text-start w-full">
                  {item.description}
                </p>
              </Button>
            ))}

            <div className="space-y-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-text"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                {t("publishProduct")}
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                size="lg"
                type="button"
              >
                {t("cancelAndGoBack")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductPublishingForm;
