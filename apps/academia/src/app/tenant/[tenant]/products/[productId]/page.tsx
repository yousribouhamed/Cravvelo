import { getProductById } from "@/modules/products/actions/get-products";
import { checkProductOwnership } from "@/modules/products/actions/check-ownership";
import { PaymentSheet } from "@/modules/payments/components/payment-sheet";
import ProductBuyCard from "@/modules/products/components/product-buycard";
import Image from "next/image";
import { CravveloEditor } from "@cravvelo/editor";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{
    tenant: string;
    productId: string;
  }>;
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
          <div className="w-full col-span-1 lg:col-span-2 h-fit min-h-[400px]">
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

            <div className="bg-card text-card-foreground rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-start">
                  {t("description")}
                </h2>
              </div>
              <div className="p-0">
                <CravveloEditor readOnly value={cleanDescription} />
              </div>
            </div>
          </div>

          <ProductBuyCard product={product as any} isOwned={isOwned} />
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

