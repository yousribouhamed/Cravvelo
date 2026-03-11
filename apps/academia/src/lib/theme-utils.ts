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

export function buildThemeStyleAndData(theme: ThemeCustomization | null | undefined): {
  style: React.CSSProperties;
  dataAttributes: Record<string, string>;
} {
  const style: React.CSSProperties = {};
  const dataAttributes: Record<string, string> = {};

  if (!theme || typeof theme !== "object") {
    return { style, dataAttributes };
  }

  const t = theme as Record<string, unknown>;

  if (t.cardRadius !== undefined && t.cardRadius !== "") {
    const v = radiusValue(t.cardRadius as string);
    if (v !== undefined) style["--academia-card-radius" as keyof React.CSSProperties] = v;
  }
  if (t.cardShadow !== undefined && t.cardShadow !== "") {
    dataAttributes["data-card-shadow"] = String(t.cardShadow);
  }

  const buttonRad = buttonRadiusFromStyle(
    t.buttonStyle as string | undefined,
    t.buttonRadius as string | undefined
  );
  if (buttonRad !== undefined) {
    style["--academia-button-radius" as keyof React.CSSProperties] = buttonRad;
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
    style["--academia-navbar-bg-light" as keyof React.CSSProperties] = String(t.navbarBackgroundLight);
  }
  if (t.navbarBackgroundDark !== undefined && String(t.navbarBackgroundDark).trim() !== "") {
    style["--academia-navbar-bg-dark" as keyof React.CSSProperties] = String(t.navbarBackgroundDark);
  }

  if (t.pageBackgroundLight !== undefined && String(t.pageBackgroundLight).trim() !== "") {
    style["--academia-page-bg-light" as keyof React.CSSProperties] = String(t.pageBackgroundLight);
  }
  if (t.pageBackgroundDark !== undefined && String(t.pageBackgroundDark).trim() !== "") {
    style["--academia-page-bg-dark" as keyof React.CSSProperties] = String(t.pageBackgroundDark);
  }

  if (t.contentMaxWidth !== undefined && t.contentMaxWidth !== "") {
    dataAttributes["data-content-max-width"] = String(t.contentMaxWidth);
  }

  if (t.footerBackgroundLight !== undefined && String(t.footerBackgroundLight).trim() !== "") {
    style["--academia-footer-bg-light" as keyof React.CSSProperties] = String(t.footerBackgroundLight);
  }
  if (t.footerBackgroundDark !== undefined && String(t.footerBackgroundDark).trim() !== "") {
    style["--academia-footer-bg-dark" as keyof React.CSSProperties] = String(t.footerBackgroundDark);
  }

  if (t.inputRadius !== undefined && t.inputRadius !== "") {
    const v = radiusValue(t.inputRadius as string) ?? (t.inputRadius === "pill" ? "9999px" : undefined);
    if (v !== undefined) style["--academia-input-radius" as keyof React.CSSProperties] = v;
  }

  if (t.imageRadius !== undefined && t.imageRadius !== "") {
    const v = radiusValue(t.imageRadius as string) ?? (t.imageRadius === "full" ? "9999px" : undefined);
    if (v !== undefined) style["--academia-image-radius" as keyof React.CSSProperties] = v;
  }

  if (t.modalRadius !== undefined && t.modalRadius !== "") {
    const v = radiusValue(t.modalRadius as string);
    if (v !== undefined) style["--academia-modal-radius" as keyof React.CSSProperties] = v;
  }

  if (t.sidebarRadius !== undefined && String(t.sidebarRadius).trim() !== "") {
    style["--academia-sidebar-radius" as keyof React.CSSProperties] = String(t.sidebarRadius);
  }
  if (t.sidebarItemRadius !== undefined && String(t.sidebarItemRadius).trim() !== "") {
    style["--academia-sidebar-item-radius" as keyof React.CSSProperties] = String(t.sidebarItemRadius);
  }

  return { style, dataAttributes };
}
