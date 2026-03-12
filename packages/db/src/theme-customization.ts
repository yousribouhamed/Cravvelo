/**
 * Shape of Website.themeCustomization JSON.
 * All keys optional; defaults applied in academia when missing.
 */
export type ThemeCustomization = {
  // Cards
  cardRadius?: "sm" | "md" | "lg" | "xl" | "2xl" | "none" | string;
  cardBorderWidth?: "none" | "thin" | "medium" | "thick";
  cardShadow?: "none" | "sm" | "md" | "lg";
  cardBackgroundLight?: string;
  cardBackgroundDark?: string;

  // Buttons
  buttonRadius?: string;
  buttonStyle?:
    | "DEFAULT"
    | "PILL"
    | "ROUNDED"
    | "SQUARE"
    | "THREE_D"
    | "PRESSED"
    | "GLASS"
    | "BOLD_OUTLINE"
    | "GRADIENT"
    | "NEUMORPHIC";
  buttonBorderWidth?: "none" | "thin" | "medium";
  buttonShadow?: "none" | "sm" | "md";
  buttonFontWeight?: "normal" | "medium" | "semibold" | "bold";

  // Navbar
  navbarStyle?: "DEFAULT" | "MINIMAL" | "BLUR" | "CENTERED";
  navbarHeight?: "compact" | "default" | "tall";
  navbarBackgroundLight?: string;
  navbarBackgroundDark?: string;
  navbarBorder?: "none" | "thin" | "thick";
  navbarShadow?: "none" | "sm" | "md";
  logoRadius?: "none" | "sm" | "md" | "lg" | "full";
  logoSize?: "sm" | "md" | "lg";

  // Page and layout
  pageBackgroundLight?: string;
  pageBackgroundDark?: string;
  contentMaxWidth?: "narrow" | "default" | "wide" | "full";
  sectionSpacing?: "compact" | "default" | "relaxed";
  globalRadius?: string;

  // Shadcn design tokens (override --radius and all semantic colors; light/dark per token)
  radius?: string;
  backgroundLight?: string;
  backgroundDark?: string;
  foregroundLight?: string;
  foregroundDark?: string;
  cardLight?: string;
  cardDark?: string;
  cardForegroundLight?: string;
  cardForegroundDark?: string;
  popoverLight?: string;
  popoverDark?: string;
  popoverForegroundLight?: string;
  popoverForegroundDark?: string;
  primaryLight?: string;
  primaryDark?: string;
  primaryForegroundLight?: string;
  primaryForegroundDark?: string;
  secondaryLight?: string;
  secondaryDark?: string;
  secondaryForegroundLight?: string;
  secondaryForegroundDark?: string;
  mutedLight?: string;
  mutedDark?: string;
  mutedForegroundLight?: string;
  mutedForegroundDark?: string;
  accentLight?: string;
  accentDark?: string;
  accentForegroundLight?: string;
  accentForegroundDark?: string;
  destructiveLight?: string;
  destructiveDark?: string;
  borderLight?: string;
  borderDark?: string;
  inputLight?: string;
  inputDark?: string;
  ringLight?: string;
  ringDark?: string;
  chart1Light?: string;
  chart1Dark?: string;
  chart2Light?: string;
  chart2Dark?: string;
  chart3Light?: string;
  chart3Dark?: string;
  chart4Light?: string;
  chart4Dark?: string;
  chart5Light?: string;
  chart5Dark?: string;
  sidebarLight?: string;
  sidebarDark?: string;
  sidebarForegroundLight?: string;
  sidebarForegroundDark?: string;
  sidebarPrimaryLight?: string;
  sidebarPrimaryDark?: string;
  sidebarPrimaryForegroundLight?: string;
  sidebarPrimaryForegroundDark?: string;
  sidebarAccentLight?: string;
  sidebarAccentDark?: string;
  sidebarAccentForegroundLight?: string;
  sidebarAccentForegroundDark?: string;
  sidebarBorderLight?: string;
  sidebarBorderDark?: string;
  sidebarRingLight?: string;
  sidebarRingDark?: string;

  // Footer
  footerBackgroundLight?: string;
  footerBackgroundDark?: string;
  footerBorder?: "none" | "thin" | "thick";

  // Inputs
  inputRadius?: "sm" | "md" | "lg" | "pill" | "none";
  inputBorderWidth?: "thin" | "medium" | "thick";
  inputFocusRing?: "none" | "thin" | "thick";

  // Images and media
  imageRadius?: "none" | "sm" | "md" | "lg" | "full";
  badgeRadius?: "sm" | "md" | "pill";

  // Modals
  modalRadius?: "sm" | "md" | "lg" | "xl";
  modalShadow?: "sm" | "md" | "lg";

  // Typography
  headingFontFamily?: string;
  englishFontFamily?: string;
  arabicFontFamily?: string;
  baseFontSize?: "sm" | "md" | "lg";
  headingWeight?: "normal" | "semibold" | "bold";

  // Links
  linkUnderline?: "never" | "hover" | "always";
  linkColor?: "primary" | "accent" | "custom";
  linkColorValue?: string;

  // Profile sidebar
  sidebarRadius?: string;
  sidebarItemRadius?: string;

  // Component style variants (academia)
  bannerStyle?: "DEFAULT" | "MINIMAL" | "CENTERED" | "ILLUSTRATION_LEFT";
  courseCardStyle?: "DEFAULT" | "COMPACT" | "MINIMAL" | "FEATURED";
  productCardStyle?: "DEFAULT" | "COMPACT" | "MINIMAL";
  coursePlayerStyle?: "DEFAULT" | "MINIMAL" | "THEATER";
  authFormStyle?: "DEFAULT" | "CENTERED_CARD" | "SPLIT";
  profileStyle?: "DEFAULT" | "COMPACT" | "SIDEBAR_LEFT";
};
