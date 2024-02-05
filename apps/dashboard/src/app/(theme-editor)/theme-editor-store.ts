"use client";

import { create } from "zustand";

export interface ThemePage {
  path: string;
  components: ComponentBuilder[];
  name: string;
}

export interface ComponentBuilder {
  type: string;
  name: string;
  id: string;
}

interface ThemeEditorState {
  state: {
    pages: ThemePage[];
    currentPageIndex: number;
    selectedComponent: ComponentBuilder | null;
    viewMode: string;
  };
  actions: {
    // getPage: () => ThemePage;
    updatePage: (component: ComponentBuilder) => void;
    chnageCurrentPage: (index: number) => void;
    chnageViewMode: (mode: string) => void;
  };
}

export const useThemeEditorStore = create<ThemeEditorState>()((set, get) => ({
  state: {
    pages: [
      {
        components: [],
        path: "/",
        name: "الصفحة الرئيسية",
      },
      {
        components: [],
        path: "/courses",
        name: "صفحة الدورات",
      },

      {
        components: [],
        path: "/",
        name: "صفحة تسجيل الدخول",
      },
      {
        components: [],
        path: "/courses",
        name: "صفحة التسجيل",
      },
    ],
    currentPageIndex: 0,
    selectedComponent: null,
    viewMode: "DESKTOP",
  },
  actions: {
    chnageCurrentPage: (index: number) =>
      set({ state: { ...get().state, currentPageIndex: index } }),
    chnageViewMode: (mode: string) =>
      set({ state: { ...get().state, viewMode: mode } }),
    updatePage(component: ComponentBuilder) {
      const oldComponents =
        get().state.pages[get().state.currentPageIndex].components;

      const newComponets = [...oldComponents, component];

      // add the component to the page
      const newPageUpdated = {
        ...get().state.pages[get().state.currentPageIndex],
        components: newComponets,
      };

      // update the state
      // create a copy of the current state
      const newState = {
        ...get().state,
        pages: [
          ...get().state.pages.slice(0, get().state.currentPageIndex), // copy pages before the selected page
          newPageUpdated, // replace the selected page with the updated one
          ...get().state.pages.slice(get().state.currentPageIndex + 1), // copy pages after the selected page
        ],
      };

      console.log(newState);

      set({ state: newState });
    },
  },
  //   increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
