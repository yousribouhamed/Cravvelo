import type { FC } from "react";
import FormView from "../_components/form-view";
import ColorFrom from "../forms/color-form";
import FavIconForm from "../forms/favicon-form";
import UploadStampForm from "../forms/stamp-form";

interface AcademiaViewProps {
  defaultLang: "en" | "ar";
  color: string;
  logo: string;
  stamp: string;
}

const AcademiaView: FC<AcademiaViewProps> = ({
  defaultLang,
  color,
  logo,
  stamp,
}) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "الأكاديمية",
        english: "Academia",
      }}
    >
      <ColorFrom lang={defaultLang} color={color} />
      <FavIconForm lang={defaultLang} logoUrl={logo} />
      <UploadStampForm lang={defaultLang} stempUrl={stamp} />
    </FormView>
  );
};

export default AcademiaView;
