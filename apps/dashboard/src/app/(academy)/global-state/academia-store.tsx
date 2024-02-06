import { create } from "zustand";

interface AcademiaState {
  state: {
    shoppingBag: [];
  };
  actions: {
    addItem: () => void;
  };
}

export const useAcademiaStore = create<AcademiaState>()((set) => ({
  state: {
    shoppingBag: [],
  },
  actions: {
    addItem: () => {},
  },
}));
