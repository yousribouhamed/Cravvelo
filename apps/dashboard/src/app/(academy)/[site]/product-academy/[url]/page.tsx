import {
  getCourseByUrlPath,
  getProductByUrlPath,
} from "../../../_actions/course";
import { getSubDomainValue } from "../../../lib";
import { getSiteData } from "../../../_actions";
import { notFound } from "next/navigation";
import AcademyHeader from "../../../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../../../_actions/auth";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import Suspanded from "../../../_components/suspanded";
import { Product_card } from "./product-card";
import ProductContent from "./product-content";

interface PageProps {
  params: { site: string; url: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website, product] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    getProductByUrlPath({ url: params?.url }),
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
      />
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-70px)]  ">
        <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
          <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8 pb-4">
            <h1 className="text-3xl font-bold text-black text-start">
              {product.title}
            </h1>
            <ProductContent product={product} />
          </div>

          <Product_card color={website?.color} product={product} />
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
