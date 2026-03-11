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
  buttonStyle?: "DEFAULT" | "PILL" | "ROUNDED" | "SQUARE";
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
  baseFontSize?: "sm" | "md" | "lg";
  headingWeight?: "normal" | "semibold" | "bold";

  // Links
  linkUnderline?: "never" | "hover" | "always";
  linkColor?: "primary" | "accent" | "custom";
  linkColorValue?: string;

  // Profile sidebar
  sidebarRadius?: string;
  sidebarItemRadius?: string;
};
