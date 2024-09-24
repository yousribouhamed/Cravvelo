import type { FC } from "react";
import FormView from "../_components/form-view";
import ColorFrom from "../forms/color-form";
import FavIconForm from "../forms/favicon-form";

interface AcademiaViewProps {
  defaultLang: "en" | "ar";
  color: string;
  logo: string;
}

const AcademiaView: FC<AcademiaViewProps> = ({ defaultLang, color, logo }) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "الأكاديمية",
        english: "Academia",
      }}
    >
      <ColorFrom color={color} />
      <FavIconForm logoUrl={logo} />
    </FormView>
  );
};

export default AcademiaView;
