import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ItemCourse = {
  type: string;
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
    clear: () => void;
  };
}

export const useAcademiaStore = create<AcademiaState>()(
  persist(
    (set, get) => ({
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
              shoppingBag: get().state.shoppingBag.filter(
                (item) => item.id !== id
              ),
            },
          }),
        clear: () =>
          set({
            state: {
              ...get().state,
              shoppingBag: [],
            },
          }),
      },
    }),
    {
      name: "editor state",
      merge: (persistedState, defaultState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return defaultState;
        }

        let resultState: AcademiaState = { ...defaultState };
        const keys = Object.keys(defaultState) as (keyof AcademiaState)[];

        keys.forEach((key) => {
          if (key in persistedState) {
            //@ts-ignore // TypeScript currently don't recognize that key exists in localState
            const state = persistedState[key];
            if (state) {
              resultState = {
                ...resultState,
                [key]: { ...defaultState[key], ...state },
              };
            }
          }
        });

        return resultState;
      },
    }
  )
);
