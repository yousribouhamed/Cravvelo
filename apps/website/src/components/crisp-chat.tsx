"use client";

import { useEffect } from "react";
import { Crisp, ChatboxColors, ChatboxPosition } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("8974edcb-dc2b-4c50-b2e3-4a4d22f9ef8f");
    Crisp.setColorTheme(ChatboxColors.Orange);
    Crisp.setPosition(ChatboxPosition.Left);
  }, []);

  return null;
};
