import AddCusotmDomainForm from "../forms/chnage-customdomain.form";
import ChangeSubDomainForm from "../forms/chnage-subdomain.form";
// import DomainStatusCheckForm from "../forms/domain-status-check-form";

interface PageProps {
  subdomain: string | null;
  customDomain: string | null;
}

export function DomainSettignsPage({ customDomain, subdomain }: PageProps) {
  return (
    <div className="w-full h-fit grid  grid-cols-1 lg:grid-cols-2  my-8 gap-4">
      <ChangeSubDomainForm subdomain={subdomain} />
      <AddCusotmDomainForm customDomain={customDomain} />
      {/* <DomainStatusCheckForm /> */}
    </div>
  );
}
