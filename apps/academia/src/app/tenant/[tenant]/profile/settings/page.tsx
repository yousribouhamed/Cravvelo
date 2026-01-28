import SettingsForm from "@/modules/profile/forms/settings.form";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col gap-y-4 bg-white dark:bg-[#0A0A0C] dark:border-[#1F1F23]">
      <SettingsForm />
    </div>
  );
}
