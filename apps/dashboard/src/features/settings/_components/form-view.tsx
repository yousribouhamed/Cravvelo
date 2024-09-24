import type { FC } from "react";

interface Props {
  defaultLang: string;
  children: React.ReactNode;
  title: {
    arabic: string;
    english: string;
  };
}

const FormView: FC<Props> = ({ defaultLang, children, title }) => {
  return (
    <div
      dir={defaultLang === "en" ? "ltr" : "rtl"}
      className="w-full min-h-[200px] h-fit flex flex-col gap-y-4  "
    >
      <h1 className="text-xl text-[#303030] font-bold ">
        {defaultLang === "en" ? title.english : title.arabic}
      </h1>

      {children}
    </div>
  );
};

export default FormView;
