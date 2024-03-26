import type { FC } from "react";
import LoadingCard from "./_components/loading";
import AcademyHeader from "./_components/layout/academy-header";
import MaxWidthWrapper from "./_components/max-width-wrapper";
import AcademiaFooter from "./_components/layout/academy-footer";

const Page: FC = ({}) => {
  return (
    <>
      <AcademyHeader
        color={"#FC6B00"}
        student={null}
        isAuthanticated={true}
        subdomain={null}
        logo={null}
      />

      <MaxWidthWrapper className="h-fit mt-[140px] min-h-[calc(100vh-70px)] overflow-hidden ">
        <LoadingCard />
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
