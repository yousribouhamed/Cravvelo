export type FontOption = {
  value: string;
  label: string;
};

export const ENGLISH_FONT_OPTIONS: FontOption[] = [
  { label: "Inter", value: "var(--font-inter), 'Inter', 'Segoe UI', sans-serif" },
  { label: "Poppins", value: "var(--font-poppins), 'Poppins', 'Segoe UI', sans-serif" },
  {
    label: "Montserrat",
    value: "var(--font-montserrat), 'Montserrat', 'Segoe UI', sans-serif",
  },
  { label: "Nunito", value: "var(--font-nunito), 'Nunito', 'Segoe UI', sans-serif" },
  { label: "Lora", value: "var(--font-lora), 'Lora', Georgia, serif" },
];

export const ARABIC_FONT_OPTIONS: FontOption[] = [
  { label: "Tajawal", value: "var(--font-tajawal), 'Tajawal', sans-serif" },
  { label: "Cairo", value: "var(--font-cairo), 'Cairo', sans-serif" },
  { label: "Almarai", value: "var(--font-almarai), 'Almarai', sans-serif" },
  {
    label: "Noto Kufi Arabic",
    value: "var(--font-noto-kufi-arabic), 'Noto Kufi Arabic', sans-serif",
  },
  {
    label: "Noto Naskh Arabic",
    value: "var(--font-noto-naskh-arabic), 'Noto Naskh Arabic', serif",
  },
];

export const DEFAULT_ENGLISH_FONT =
  ENGLISH_FONT_OPTIONS[0]?.value ?? "var(--font-inter), 'Inter', sans-serif";
export const DEFAULT_ARABIC_FONT =
  ARABIC_FONT_OPTIONS[0]?.value ?? "var(--font-tajawal), 'Tajawal', sans-serif";

export const PRESET_FONT_PAIRS: Record<
  string,
  { englishFontFamily: string; arabicFontFamily: string }
> = {
  sakura: {
    englishFontFamily: "var(--font-poppins), 'Poppins', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-cairo), 'Cairo', sans-serif",
  },
  crimson: {
    englishFontFamily: "var(--font-montserrat), 'Montserrat', 'Segoe UI', sans-serif",
    arabicFontFamily:
      "var(--font-noto-kufi-arabic), 'Noto Kufi Arabic', sans-serif",
  },
  emerald: {
    englishFontFamily: "var(--font-nunito), 'Nunito', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
  },
  oceanic: {
    englishFontFamily: "var(--font-inter), 'Inter', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-almarai), 'Almarai', sans-serif",
  },
  lavender: {
    englishFontFamily: "var(--font-lora), 'Lora', Georgia, serif",
    arabicFontFamily:
      "var(--font-noto-naskh-arabic), 'Noto Naskh Arabic', serif",
  },
  "amber-dawn": {
    englishFontFamily: "var(--font-lora), 'Lora', Georgia, serif",
    arabicFontFamily: "var(--font-cairo), 'Cairo', sans-serif",
  },
  "midnight-blue": {
    englishFontFamily: "var(--font-inter), 'Inter', 'Segoe UI', sans-serif",
    arabicFontFamily:
      "var(--font-noto-kufi-arabic), 'Noto Kufi Arabic', sans-serif",
  },
  "rose-gold": {
    englishFontFamily: "var(--font-poppins), 'Poppins', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
  },
  "forest-mist": {
    englishFontFamily: "var(--font-nunito), 'Nunito', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-almarai), 'Almarai', sans-serif",
  },
  "sunset-peach": {
    englishFontFamily: "var(--font-montserrat), 'Montserrat', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-cairo), 'Cairo', sans-serif",
  },
  "nordic-frost": {
    englishFontFamily: "var(--font-inter), 'Inter', 'Segoe UI', sans-serif",
    arabicFontFamily:
      "var(--font-noto-naskh-arabic), 'Noto Naskh Arabic', serif",
  },
  "royal-violet": {
    englishFontFamily: "var(--font-poppins), 'Poppins', 'Segoe UI', sans-serif",
    arabicFontFamily:
      "var(--font-noto-kufi-arabic), 'Noto Kufi Arabic', sans-serif",
  },
  "desert-sand": {
    englishFontFamily: "var(--font-lora), 'Lora', Georgia, serif",
    arabicFontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
  },
  "mono-ink": {
    englishFontFamily: "var(--font-inter), 'Inter', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-almarai), 'Almarai', sans-serif",
  },
  "neo-mint": {
    englishFontFamily: "var(--font-nunito), 'Nunito', 'Segoe UI', sans-serif",
    arabicFontFamily: "var(--font-cairo), 'Cairo', sans-serif",
  },
};
