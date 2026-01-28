import { getStudentProducts } from "@/modules/profile/actions/products.actions";
import { ProductColumns } from "@/modules/profile/components/columns/products";
import { DataTable } from "@/modules/profile/components/data-table";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const res = await getStudentProducts();
  const t = await getTranslations("profile.products");

  if (res.data && res.data.length > 0) {
    return (
      <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
        <h2 className="font-bold text-xl">{t("title")}</h2>
        <DataTable columns={ProductColumns} data={res.data} />
      </div>
    );
  }

  return (
    <div className="bg-card h-full rounded-2xl flex flex-col gap-y-4 p-4 border">
      <h2 className="font-bold text-xl">{t("title")}</h2>
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">{t("empty")}</p>
      </div>
    </div>
  );
}
