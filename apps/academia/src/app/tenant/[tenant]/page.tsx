import Link from "next/link";
import Banner from "@/components/banner";
import CourseCard from "@/modules/courses/components/course-card";
import { getCoursesWithDefaultPricing } from "@/modules/courses/actions/get-courses";
import { getTranslations } from "next-intl/server";
import { getProductsWithDefaultPricing } from "@/modules/products/actions/get-products";
import ProductCard from "@/modules/products/components/product-card";
import { getTenantWebsite } from "@/actions/tanant";
import { ContactCard } from "@/components/contact-card";
import { TestimonialsSection } from "@/components/testimonials-section";

interface TenantPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant: tenantKey } = await params;
  const tenant = decodeURIComponent(tenantKey);
  const tHome = await getTranslations("home");

  const website = await getTenantWebsite(tenant);
  const showCoursesOnHome = (website as any)?.dCoursesHomeScreen ?? true;
  const showProductsOnHome = (website as any)?.dDigitalProductsHomeScreen ?? false;
  const enableWelcomeBanner = (website as any)?.enableWelcomeBanner ?? true;
  // By default, do not show testimonials or contact form
  const enableTestimonials = (website as any)?.enableTestimonials ?? false;
  const enableContactForm = (website as any)?.enableContactForm ?? false;
  const displayName =
    (website as any)?.name ?? (website as any)?.Account?.user_name ?? tenant;

  const coursesRes = showCoursesOnHome ? await getCoursesWithDefaultPricing() : null;
  const courses = coursesRes?.success ? coursesRes.data ?? [] : [];

  const productsRes = showProductsOnHome
    ? await getProductsWithDefaultPricing()
    : null;
  const products = productsRes?.success ? productsRes.data ?? [] : [];

  return (
    <div className="py-6 sm:py-8">
      <h1 className="text-3xl font-bold mb-4">
        {tHome("welcomeTo", { name: displayName })}
      </h1>

      {enableWelcomeBanner && <Banner />}

      {showCoursesOnHome && (
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
      )}

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

      {enableTestimonials && <TestimonialsSection tenant={tenant} />}
      {enableContactForm && <ContactCard />}
    </div>
  );
}

export async function generateMetadata({ params }: TenantPageProps) {
  const { tenant: tenantKey } = await params;
  const tenant = decodeURIComponent(tenantKey);
  const website = await getTenantWebsite(tenant);
  const tenantDisplayName =
    (website as any)?.name ?? (website as any)?.Account?.user_name ?? tenant;
  const tNav = await getTranslations("nav");
  const pageTitle = tNav("home");
  return {
    title: `${pageTitle} – ${tenantDisplayName}`,
    description: `Welcome to ${tenantDisplayName}'s space`,
  };
}
