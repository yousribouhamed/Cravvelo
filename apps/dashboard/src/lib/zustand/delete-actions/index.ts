import { create } from "zustand";

interface StateShape {
  id: string | null;
  setId: (id: string) => void;
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useOpenProductDeleteAction = create<StateShape>()((set) => ({
  id: null,
  open: false,
  setId: (val: string) => set({ id: val }),
  setIsOpen: (open: boolean) => set({ open: open }),
}));

export const useOpenCourseDeleteAction = create<StateShape>()((set) => ({
  id: null,
  open: false,
  setId: (val: string) => set({ id: val }),
  setIsOpen: (open: boolean) => set({ open: open }),
}));
