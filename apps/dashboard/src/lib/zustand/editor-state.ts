import { create } from "zustand";

interface ComponentState {
  currentComponent: string | null;
  selectComponent: (compoent: string) => void;
}

export const useEditorStore = create<ComponentState>()((set) => ({
  currentComponent: null,
  selectComponent: (compoent) => set(() => ({ currentComponent: compoent })),
}));
