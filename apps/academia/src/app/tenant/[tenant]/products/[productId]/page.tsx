import { getProductById } from "@/modules/products/actions/get-products";
import { checkProductOwnership } from "@/modules/products/actions/check-ownership";
import { PaymentSheet } from "@/modules/payments/components/payment-sheet";
import ProductBuyCard from "@/modules/products/components/product-buycard";
import Image from "next/image";
import { CravveloEditor } from "@cravvelo/editor";
import { getTranslations } from "next-intl/server";
import { getTenantWebsite } from "@/actions/tanant";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    tenant: string;
    productId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tenant: tenantKey, productId } = await params;
  const tenant = decodeURIComponent(tenantKey);
  const [productRes, website] = await Promise.all([
    getProductById({ productId }),
    getTenantWebsite(tenant),
  ]);
  const product = productRes.success ? productRes.data : null;
  const tenantDisplayName =
    (website as any)?.name ?? (website as any)?.Account?.user_name ?? tenant;
  const pageTitle =
    (product as any)?.SeoTitle ?? (product as any)?.title ?? "Product";
  const description = (product as any)?.SeoDescription as string | undefined;
  return {
    title: `${pageTitle} – ${tenantDisplayName}`,
    ...(description && { description }),
  };
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;
  const t = await getTranslations("products.landing");

  const [response, ownershipResponse] = await Promise.all([
    getProductById({ productId }),
    checkProductOwnership({ productId }),
  ]);

  const product = response.data;
  const isOwned = ownershipResponse.data || false;

  const rawDescription = (product as any)?.description;
  const cleanDescription =
    rawDescription && typeof rawDescription === "string"
      ? rawDescription.replace(/^"+|"+$/g, "")
      : "";

  if (response.success && product) {
    return (
      <>
        <div className="w-full min-h-screen h-fit grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 my-8">
          <div className="w-full col-span-1 lg:col-span-2 min-h-[400px]">
            <h1 className="text-2xl font-bold text-start text-foreground mb-4">
              {product.title}
            </h1>

            {product.thumbnailUrl && (
              <div className="relative w-full h-[280px] rounded-lg overflow-hidden border mb-6">
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product Description - header and text area share same card background */}
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-card">
                <h2 className="text-lg font-semibold text-start">
                  {t("description")}
                </h2>
              </div>
              <div className="p-4 bg-card">
                <CravveloEditor readOnly value={cleanDescription} />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <ProductBuyCard product={product as any} isOwned={isOwned} />
          </div>
        </div>

        <PaymentSheet />
      </>
    );
  }

  return (
    <div className="w-full h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("notFound")}
        </h1>
        <p className="text-muted-foreground">{t("notFoundMessage")}</p>
      </div>
    </div>
  );
}

