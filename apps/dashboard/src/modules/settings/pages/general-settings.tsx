import SwitchMode from "../components/switch-mode";
import LanguageSelector from "../components/language-selector";

export default function GeneralSettings() {
  return (
    <div className="flex flex-col gap-4">
      <LanguageSelector />
      <SwitchMode />
    </div>
  );
}
