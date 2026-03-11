import Link from "next/link";
import Banner from "@/components/banner";
import CourseCard from "@/modules/courses/components/course-card";
import { getCoursesWithDefaultPricing } from "@/modules/courses/actions/get-courses";
import { getTranslations } from "next-intl/server";
import { getProductsWithDefaultPricing } from "@/modules/products/actions/get-products";
import ProductCard from "@/modules/products/components/product-card";
import { getTenantWebsite } from "@/actions/tanant";

interface TenantPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant: tenantKey } = await params;
  const tenant = decodeURIComponent(tenantKey);
  const tHome = await getTranslations("home");

  const coursesRes = await getCoursesWithDefaultPricing();
  const courses = coursesRes.success ? coursesRes.data ?? [] : [];

  const website = await getTenantWebsite(tenant);
  const showProductsOnHome = (website as any)?.dDigitalProductsHomeScreen ?? false;
  const displayName =
    (website as any)?.name ?? (website as any)?.Account?.user_name ?? tenant;

  const productsRes = showProductsOnHome
    ? await getProductsWithDefaultPricing()
    : null;
  const products = productsRes?.success ? productsRes.data ?? [] : [];

  return (
    <div className="py-6 sm:py-8">
      <h1 className="text-3xl font-bold mb-4">
        {tHome("welcomeTo", { name: displayName })}
      </h1>

      <Banner />

      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-3xl font-bold">{tHome("courses.title")}</h2>
            <p className="text-muted-foreground">{tHome("courses.subtitle")}</p>
          </div>
          <Link
            href="/courses"
            className="text-sm font-medium text-primary hover:underline shrink-0"
          >
            {tHome("courses.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course as any} />
          ))}
        </div>
      </div>

      {showProductsOnHome && (
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-3xl font-bold">{tHome("products.title")}</h2>
              <p className="text-muted-foreground">
                {tHome("products.subtitle")}
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline shrink-0"
            >
              {tHome("products.viewAll")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: TenantPageProps) {
  const awaitedParams = await params;
  return {
    title: `${awaitedParams.tenant} - Multi-tenant App`,
    description: `Welcome to ${awaitedParams.tenant}'s space`,
  };
}
