import type { FC } from "react";
import { useThemeEditorStore } from "../../theme-editor-store";

interface ThemeSignupProps {}

const ThemeContactUs: FC = ({}) => {
  const { state } = useThemeEditorStore();

  return (
    <div className="w-full min-h-[700px] h-fit flex items-center justify-center p-4">
      <div
        dir="rtl"
        className="w-full max-w-lg h-fit min-h-[400px] shadow rounded-lg flex flex-col items-start gap-y-4"
      >
        <h1 className="text-start text-xl font-bold">تواصل معنا</h1>

        <div className="w-full flex flex-col h-[100px] gap-y-4">
          <p>بريدك الالكتروني</p>
          <input className="border p-4 rounded-xl" />
        </div>
        <div className="w-full flex flex-col h-[200px] gap-y-4">
          <p>رسالتك</p>
          <textarea rows={3} className="border p-4 rounded-xl h-[150px]" />
        </div>

        <button
          style={{
            background: state.color,
          }}
          className="w-full h-[50px]rounded-xl text-white "
        >
          ارسل الرسالة
        </button>
      </div>
    </div>
  );
};

export default ThemeContactUs;
