import type { FC } from "react";
import FormView from "../_components/form-view";
import CusotmDomainForm from "../forms/cusotmdomain-form";
import SubDomainForm from "../forms/subdomain-form";

interface AppearanceViewProps {
  defaultLang: "en" | "ar";
  customeDomain: string | null;
  subdomain: string;
}

const DomainsView: FC<AppearanceViewProps> = ({
  defaultLang,
  customeDomain,
  subdomain,
}) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "المجالات",
        english: "Domains",
      }}
    >
      <CusotmDomainForm customDomain={customeDomain} />
      <SubDomainForm subdomain={subdomain} />
    </FormView>
  );
};

export default DomainsView;
