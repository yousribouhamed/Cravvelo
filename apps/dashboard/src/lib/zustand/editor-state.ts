import { ComponentBuilder } from "@/src/types";
import { create } from "zustand";

interface ComponentState {
  currentComponent: ComponentBuilder | null;
  selectComponent: (compoent: ComponentBuilder | null) => void;
}

export const useEditorStore = create<ComponentState>()((set) => ({
  currentComponent: null,
  selectComponent: (compoent: ComponentBuilder | null) =>
    set(() => ({ currentComponent: compoent })),
}));

interface screenSizes {
  screen: string;
  setScreen: (val: string) => void;
}

export const useEditorScreen = create<screenSizes>()((set) => ({
  screen: "lg",
  setScreen: (screen: string) => set(() => ({ screen })),
}));

interface VirtualComponentdding {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const openAddVirtualCompoent = create<VirtualComponentdding>()(
  (set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set(() => ({ isOpen: isOpen })),
  })
);
