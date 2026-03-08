import { ListEmptyState } from "@/components/list-empty-state";
import { getProductsWithDefaultPricing } from "@/modules/products/actions/get-products";
import ProductCard from "@/modules/products/components/product-card";
import { ProductsListFilters } from "@/modules/products/components/products-list-filters";
import { getTranslations } from "next-intl/server";
import { Package } from "lucide-react";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const t = await getTranslations("products.list");
  const sp = searchParams ? await searchParams : {};
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const sort =
    typeof sp.sort === "string" &&
    ["newest", "price_asc", "price_desc"].includes(sp.sort)
      ? (sp.sort as "newest" | "price_asc" | "price_desc")
      : undefined;

  const response = await getProductsWithDefaultPricing({ search, sort });

  if (response.success) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-start text-black dark:text-white">
          {t("title")}
        </h1>
        <ProductsListFilters />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {response.data?.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        {response.data?.length === 0 && (
          <ListEmptyState
            icon={<Package />}
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            actionLabel={t("backToHome")}
            actionHref="/"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h1 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2 text-start">
          {t("loadErrorTitle")}
        </h1>
        <p className="text-red-700 dark:text-red-300 text-start">
          {typeof response.message === "string" ? response.message : t("genericError")}
        </p>
      </div>
    </div>
  );
}

