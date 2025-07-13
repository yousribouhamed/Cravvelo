import CoursesGrid from "../../_components/course-component/courses-grid";
import { getAllProducts, getSiteData } from "../../_actions";
import { getSubDomainValue } from "../../lib";
import { notFound } from "next/navigation";
import AcademyHeader from "../../_components/layout/academy-header";
import MaxWidthWrapper from "../../_components/max-width-wrapper";
import { getStudent } from "../../_actions/auth";
import AcademiaFooter from "../../_components/layout/academy-footer";
import Suspanded from "../../_components/suspanded";
import FilterButtonMobile from "../../_components/filter-button";
import ProductsGrid from "../../_components/course-component/products-grid";
export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ site: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { site } = await params;
  const subdomain = getSubDomainValue({ value: site });

  const [student, website, products] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    getAllProducts({ subdomain }),
  ]);

  if (!website) {
    notFound();
  }
  if (website.suspended) {
    return <Suspanded />;
  }

  return (
    <>
      <AcademyHeader
        referralEnabled={website.enableReferral}
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
        displaySalesBanner={website?.enableSalesBanner}
      />
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-70px)] ">
        <div className="  w-full h-fit min-h-screen flex flex-col gap-4 items-start py-4">
          <div className="w-full h-[100px] flex items-center justify-between">
            <h1 className="text-3xl font-bold">المنتجات الرقمية</h1>
          </div>
          <ProductsGrid products={products} color={website?.color} />
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
