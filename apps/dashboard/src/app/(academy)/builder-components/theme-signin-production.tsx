import type { FC } from "react";

interface ThemeSignupProps {}

const ThemeSigninProduction: FC = ({}) => {
  return (
    <div className="w-full min-h-[700px] h-fit flex items-center justify-center">
      <div
        dir="rtl"
        className="w-full max-w-lg h-fit min-h-[400px] shadow rounded-lg flex flex-col items-start gap-y-4"
      >
        <h1 className="text-start text-xl font-bold">تسجيل الدخول</h1>

        <div className="w-full flex flex-col h-[100px] gap-y-4">
          <p>بريدك الالكتروني</p>
          <input className="border p-4 rounded-xl" />
        </div>
        <div className="w-full flex flex-col h-[100px] gap-y-4">
          <p> كلمة المرور</p>
          <input className="border p-4 rounded-xl" />
        </div>

        <button className="w-full h-[50px] bg-blue-500 rounded-xl text-white ">
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default ThemeSigninProduction;
