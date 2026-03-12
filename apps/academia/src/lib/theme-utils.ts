import type { ThemeCustomization } from "database";

const RADIUS_PRESETS: Record<string, string> = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  none: "0",
};

function radiusValue(v: string | undefined): string | undefined {
  if (!v) return undefined;
  return RADIUS_PRESETS[v] ?? v;
}

function buttonRadiusFromStyle(style: string | undefined, explicitRadius: string | undefined): string | undefined {
  if (explicitRadius) return radiusValue(explicitRadius) ?? explicitRadius;
  switch (style) {
    case "PILL":
      return "9999px";
    case "SQUARE":
      return "0";
    case "ROUNDED":
      return "0.5rem";
    case "DEFAULT":
    default:
      return "0.375rem";
  }
}

/** CSSProperties plus custom CSS variables (string values) */
type ThemeStyle = React.CSSProperties & Record<string, string | undefined>;

/** Theme key (light/dark) -> CSS variable name for shadcn overrides */
const SHADCN_COLOR_TOKENS: { lightKey: keyof ThemeCustomization; darkKey: keyof ThemeCustomization; cssVar: string }[] = [
  { lightKey: "backgroundLight", darkKey: "backgroundDark", cssVar: "background" },
  { lightKey: "foregroundLight", darkKey: "foregroundDark", cssVar: "foreground" },
  { lightKey: "cardLight", darkKey: "cardDark", cssVar: "card" },
  { lightKey: "cardForegroundLight", darkKey: "cardForegroundDark", cssVar: "card-foreground" },
  { lightKey: "popoverLight", darkKey: "popoverDark", cssVar: "popover" },
  { lightKey: "popoverForegroundLight", darkKey: "popoverForegroundDark", cssVar: "popover-foreground" },
  { lightKey: "primaryLight", darkKey: "primaryDark", cssVar: "primary" },
  { lightKey: "primaryForegroundLight", darkKey: "primaryForegroundDark", cssVar: "primary-foreground" },
  { lightKey: "secondaryLight", darkKey: "secondaryDark", cssVar: "secondary" },
  { lightKey: "secondaryForegroundLight", darkKey: "secondaryForegroundDark", cssVar: "secondary-foreground" },
  { lightKey: "mutedLight", darkKey: "mutedDark", cssVar: "muted" },
  { lightKey: "mutedForegroundLight", darkKey: "mutedForegroundDark", cssVar: "muted-foreground" },
  { lightKey: "accentLight", darkKey: "accentDark", cssVar: "accent" },
  { lightKey: "accentForegroundLight", darkKey: "accentForegroundDark", cssVar: "accent-foreground" },
  { lightKey: "destructiveLight", darkKey: "destructiveDark", cssVar: "destructive" },
  { lightKey: "borderLight", darkKey: "borderDark", cssVar: "border" },
  { lightKey: "inputLight", darkKey: "inputDark", cssVar: "input" },
  { lightKey: "ringLight", darkKey: "ringDark", cssVar: "ring" },
  { lightKey: "chart1Light", darkKey: "chart1Dark", cssVar: "chart-1" },
  { lightKey: "chart2Light", darkKey: "chart2Dark", cssVar: "chart-2" },
  { lightKey: "chart3Light", darkKey: "chart3Dark", cssVar: "chart-3" },
  { lightKey: "chart4Light", darkKey: "chart4Dark", cssVar: "chart-4" },
  { lightKey: "chart5Light", darkKey: "chart5Dark", cssVar: "chart-5" },
  { lightKey: "sidebarLight", darkKey: "sidebarDark", cssVar: "sidebar" },
  { lightKey: "sidebarForegroundLight", darkKey: "sidebarForegroundDark", cssVar: "sidebar-foreground" },
  { lightKey: "sidebarPrimaryLight", darkKey: "sidebarPrimaryDark", cssVar: "sidebar-primary" },
  { lightKey: "sidebarPrimaryForegroundLight", darkKey: "sidebarPrimaryForegroundDark", cssVar: "sidebar-primary-foreground" },
  { lightKey: "sidebarAccentLight", darkKey: "sidebarAccentDark", cssVar: "sidebar-accent" },
  { lightKey: "sidebarAccentForegroundLight", darkKey: "sidebarAccentForegroundDark", cssVar: "sidebar-accent-foreground" },
  { lightKey: "sidebarBorderLight", darkKey: "sidebarBorderDark", cssVar: "sidebar-border" },
  { lightKey: "sidebarRingLight", darkKey: "sidebarRingDark", cssVar: "sidebar-ring" },
];

function trimValue(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

export function buildThemeStyleAndData(theme: ThemeCustomization | null | undefined): {
  style: ThemeStyle;
  dataAttributes: Record<string, string>;
  cssOverrides: string;
} {
  const style: ThemeStyle = {};
  const dataAttributes: Record<string, string> = {};
  const lightRules: string[] = [];
  const darkRules: string[] = [];

  if (!theme || typeof theme !== "object") {
    return { style, dataAttributes, cssOverrides: "" };
  }

  const t = theme as Record<string, unknown>;

  if (t.cardRadius !== undefined && t.cardRadius !== "") {
    const v = radiusValue(t.cardRadius as string);
    if (v !== undefined) style["--academia-card-radius"] = v;
  }
  if (t.cardShadow !== undefined && t.cardShadow !== "") {
    dataAttributes["data-card-shadow"] = String(t.cardShadow);
  }

  const buttonRad = buttonRadiusFromStyle(
    t.buttonStyle as string | undefined,
    t.buttonRadius as string | undefined
  );
  if (buttonRad !== undefined) {
    style["--academia-button-radius"] = buttonRad;
  }
  if (t.buttonStyle !== undefined && t.buttonStyle !== "") {
    dataAttributes["data-button-style"] = String(t.buttonStyle);
  }

  if (t.navbarStyle !== undefined && t.navbarStyle !== "") {
    dataAttributes["data-navbar-style"] = String(t.navbarStyle);
  }
  if (t.navbarHeight !== undefined && t.navbarHeight !== "") {
    dataAttributes["data-navbar-height"] = String(t.navbarHeight);
  }
  if (t.navbarBackgroundLight !== undefined && String(t.navbarBackgroundLight).trim() !== "") {
    style["--academia-navbar-bg-light"] = String(t.navbarBackgroundLight);
  }
  if (t.navbarBackgroundDark !== undefined && String(t.navbarBackgroundDark).trim() !== "") {
    style["--academia-navbar-bg-dark"] = String(t.navbarBackgroundDark);
  }

  if (t.pageBackgroundLight !== undefined && String(t.pageBackgroundLight).trim() !== "") {
    style["--academia-page-bg-light"] = String(t.pageBackgroundLight);
  }
  if (t.pageBackgroundDark !== undefined && String(t.pageBackgroundDark).trim() !== "") {
    style["--academia-page-bg-dark"] = String(t.pageBackgroundDark);
  }
  if (t.englishFontFamily !== undefined && String(t.englishFontFamily).trim() !== "") {
    style["--academia-font-en"] = String(t.englishFontFamily);
  }
  if (t.arabicFontFamily !== undefined && String(t.arabicFontFamily).trim() !== "") {
    style["--academia-font-ar"] = String(t.arabicFontFamily);
  }

  if (t.footerBackgroundLight !== undefined && String(t.footerBackgroundLight).trim() !== "") {
    style["--academia-footer-bg-light"] = String(t.footerBackgroundLight);
  }
  if (t.footerBackgroundDark !== undefined && String(t.footerBackgroundDark).trim() !== "") {
    style["--academia-footer-bg-dark"] = String(t.footerBackgroundDark);
  }

  if (t.inputRadius !== undefined && t.inputRadius !== "") {
    const v = radiusValue(t.inputRadius as string) ?? (t.inputRadius === "pill" ? "9999px" : undefined);
    if (v !== undefined) style["--academia-input-radius"] = v;
  }

  if (t.imageRadius !== undefined && t.imageRadius !== "") {
    const v = radiusValue(t.imageRadius as string) ?? (t.imageRadius === "full" ? "9999px" : undefined);
    if (v !== undefined) style["--academia-image-radius"] = v;
  }

  if (t.modalRadius !== undefined && t.modalRadius !== "") {
    const v = radiusValue(t.modalRadius as string);
    if (v !== undefined) style["--academia-modal-radius"] = v;
  }

  if (t.sidebarRadius !== undefined && String(t.sidebarRadius).trim() !== "") {
    style["--academia-sidebar-radius"] = String(t.sidebarRadius);
  }
  if (t.sidebarItemRadius !== undefined && String(t.sidebarItemRadius).trim() !== "") {
    style["--academia-sidebar-item-radius"] = String(t.sidebarItemRadius);
  }

  // Component style variants (academia)
  if (t.bannerStyle !== undefined && String(t.bannerStyle).trim() !== "") {
    dataAttributes["data-banner-style"] = String(t.bannerStyle);
  }
  if (t.courseCardStyle !== undefined && String(t.courseCardStyle).trim() !== "") {
    dataAttributes["data-course-card-style"] = String(t.courseCardStyle);
  }
  if (t.productCardStyle !== undefined && String(t.productCardStyle).trim() !== "") {
    dataAttributes["data-product-card-style"] = String(t.productCardStyle);
  }
  if (t.coursePlayerStyle !== undefined && String(t.coursePlayerStyle).trim() !== "") {
    dataAttributes["data-course-player-style"] = String(t.coursePlayerStyle);
  }
  if (t.authFormStyle !== undefined && String(t.authFormStyle).trim() !== "") {
    dataAttributes["data-auth-form-style"] = String(t.authFormStyle);
  }
  if (t.profileStyle !== undefined && String(t.profileStyle).trim() !== "") {
    dataAttributes["data-profile-style"] = String(t.profileStyle);
  }

  // Shadcn design token overrides: set --theme-* on div and build injected CSS
  const radiusVal = trimValue(t.radius ?? t.globalRadius);
  if (radiusVal !== undefined) {
    const resolved = radiusValue(radiusVal) ?? radiusVal;
    style["--theme-radius"] = resolved;
    lightRules.push("--radius: var(--theme-radius)");
  }

  for (const { lightKey, darkKey, cssVar } of SHADCN_COLOR_TOKENS) {
    const lightVal = trimValue(t[lightKey]);
    const darkVal = trimValue(t[darkKey]);
    const themeVarLight = `--theme-${cssVar}-light`;
    const themeVarDark = `--theme-${cssVar}-dark`;
    if (lightVal !== undefined) {
      style[themeVarLight as keyof ThemeStyle] = lightVal;
      lightRules.push(`--${cssVar}: var(${themeVarLight})`);
    }
    if (darkVal !== undefined) {
      style[themeVarDark as keyof ThemeStyle] = darkVal;
      darkRules.push(`--${cssVar}: var(${themeVarDark})`);
    }
  }

  let cssOverrides = "";
  if (lightRules.length > 0 || darkRules.length > 0) {
    const lightBlock = lightRules.length > 0 ? `.academia-theme-root { ${lightRules.join("; ")} }` : "";
    const darkBlock = darkRules.length > 0 ? `.dark .academia-theme-root { ${darkRules.join("; ")} }` : "";
    cssOverrides = [lightBlock, darkBlock].filter(Boolean).join("\n");
  }

  return { style, dataAttributes, cssOverrides };
}
