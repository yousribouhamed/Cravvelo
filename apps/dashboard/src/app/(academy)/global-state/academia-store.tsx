import { create } from "zustand";

export type ItemCourse = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
};

interface AcademiaState {
  state: {
    shoppingBag: ItemCourse[];
  };
  actions: {
    addItem: (item: ItemCourse) => void;
    removeItem: (id: string) => void;
  };
}

export const useAcademiaStore = create<AcademiaState>()((set, get) => ({
  state: {
    shoppingBag: [],
  },
  actions: {
    addItem: (item: ItemCourse) =>
      set({
        state: {
          ...get().state,
          shoppingBag: [...get().state.shoppingBag, item],
        },
      }),
    removeItem: (id: string) =>
      set({
        state: {
          ...get().state,
          shoppingBag: get().state.shoppingBag.filter((item) => item.id !== id),
        },
      }),
  },
}));
