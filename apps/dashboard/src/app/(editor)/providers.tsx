"use client";

import type { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

const CustomeThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" enableSystem>
      {children}
    </ThemeProvider>
  );
};

export default CustomeThemeProvider;
