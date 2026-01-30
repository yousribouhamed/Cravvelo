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
  const { tenant } = await params;
  const tHome = await getTranslations("home");

  const coursesRes = await getCoursesWithDefaultPricing();
  const courses = coursesRes.success ? coursesRes.data ?? [] : [];

  const website = await getTenantWebsite(`${tenant}.cravvelo.com`);
  const showProductsOnHome = (website as any)?.dDigitalProductsHomeScreen ?? false;

  const productsRes = showProductsOnHome
    ? await getProductsWithDefaultPricing()
    : null;
  const products = productsRes?.success ? productsRes.data ?? [] : [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to {tenant}</h1>

      <Banner />

      <div className="mt-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">{tHome("courses.title")}</h2>
            <p className="text-muted-foreground">{tHome("courses.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course as any} />
          ))}
        </div>
      </div>

      {showProductsOnHome && (
        <div className="mt-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">{tHome("products.title")}</h2>
              <p className="text-muted-foreground">
                {tHome("products.subtitle")}
              </p>
            </div>
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
