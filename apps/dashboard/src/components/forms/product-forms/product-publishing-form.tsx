"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ui/components/ui/button";
import { Form, FormLabel } from "@ui/components/ui/form";
import { Card, CardContent } from "@ui/components/ui/card";
import * as React from "react";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCurrency } from "@/src/hooks/use-currency";
import { ProductPreviewCard } from "./product-preview-card";

export type ProductWithPricingForPublish = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  subDescription: string | null;
  price: number | null;
  compareAtPrice: number | null;
  totalSales?: number;
  ProductPricingPlans?: Array<{
    isDefault: boolean;
    PricingPlan: {
      price: number | null;
      compareAtPrice: number | null;
      pricingType: string;
      currency?: string;
    };
  }>;
  _count?: { Sale: number };
};

const addTextSchema = z.object({});

interface PublishProductFormProps {
  product: ProductWithPricingForPublish;
}

function ProductPublishingForm({ product }: PublishProductFormProps) {
  const t = useTranslations("productForms.publishingForm");
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const path = usePathname();
  const productId = getValueFromUrl(path, 2);

  const defaultPlan = product.ProductPricingPlans?.find((p) => p.isDefault)?.PricingPlan;
  const isFree =
    defaultPlan?.pricingType === "FREE" || (defaultPlan?.price ?? 0) === 0 || (product.price ?? 0) === 0;

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
    resolver: zodResolver(addTextSchema),
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

  async function onSubmit() {
    await mutation.mutateAsync({
      productId: productId,
      status: selectedItem,
    });
  }

  const salesCount = product._count?.Sale ?? product.totalSales ?? 0;

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-8">
      <div className="col-span-2 w-full min-h-full h-fit pb-6">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormLabel className="text-xl block font-bold text-foreground">
              {t("publishProductHeading")}
            </FormLabel>
            <FormLabel className="text-md block text-muted-foreground">
              {t("publishProductDescription")}
            </FormLabel>

            {/* Product summary */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground">
                  {t("productSummary")}
                </FormLabel>
                <div className="flex gap-4 flex-wrap items-start">
                  {product.thumbnailUrl ? (
                    <div className="relative w-24 h-16 rounded-md overflow-hidden border border-border shrink-0">
                      <Image
                        src={product.thumbnailUrl}
                        alt={product.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-md bg-muted border border-border shrink-0" />
                  )}
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>
                      <strong className="text-foreground">{t("pricing")}:</strong>{" "}
                      {isFree ? t("free") : `${formatPrice(defaultPlan?.price ?? product.price ?? 0)} ${defaultPlan?.currency ?? "DZD"}`}
                    </span>
                    {salesCount > 0 && (
                      <span>
                        <strong className="text-foreground">{t("sales")}:</strong> {salesCount}
                      </span>
                    )}
                    {product.subDescription && (
                      <span className="line-clamp-2">{product.subDescription}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProductPreviewCard product={product} />
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-full hidden md:block space-y-4">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
            <div className="space-y-2">
              {selectionButtoms.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedItem(item.value as "DRAFT" | "PUBLISHED")}
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
            </div>

            <div className="space-y-4 pt-4">
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
