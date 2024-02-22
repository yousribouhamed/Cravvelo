import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CertificateViewer from "./certificate-viewer";
import CertificateForm from "./certificate-form";

const page = ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        {/* @ts-ignore */}
        <Header user={{}} title="الطلاب" />
        <div className="w-full min-h-[400px] h-fit grid grid-cols-3 mt-8 py-2   gap-4">
          <div className="col-span-1 w-full h-full   ">
            <CertificateForm />
          </div>
          <div className="col-span-2 w-full h-full  ">
            <CertificateViewer />
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
