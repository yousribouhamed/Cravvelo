import SwitchMode from "../components/switch-mode";
import LanguageSelector from "../components/language-selector";

export default function GeneralSettings() {
  return (
    <div className="flex flex-col gap-4 min-h-[200px] bg-background py-2">
      <LanguageSelector />
      <SwitchMode />
    </div>
  );
}
