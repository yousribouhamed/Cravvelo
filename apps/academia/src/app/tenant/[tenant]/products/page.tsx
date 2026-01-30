import { getProductsWithDefaultPricing } from "@/modules/products/actions/get-products";
import ProductCard from "@/modules/products/components/product-card";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("products.list");
  const response = await getProductsWithDefaultPricing();

  if (response.success) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-right text-black dark:text-white">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {response.data?.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        {response.data?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              {t("emptyTitle")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("emptyDescription")}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h1 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2 text-right">
          {t("loadErrorTitle")}
        </h1>
        <p className="text-red-700 dark:text-red-300 text-right">
          {typeof response.message === "string" ? response.message : t("genericError")}
        </p>
      </div>
    </div>
  );
}

