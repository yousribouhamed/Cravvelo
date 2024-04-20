import { create } from "zustand";

interface StateShape {
  action?: string | null;
  id: string | null;
  setId: (id: string) => void;
  open: boolean;
  setIsOpen: (open: boolean) => void;
  setAction?: (open: string) => void;
}

export const openAdminDeleteAction = create<StateShape>()((set) => ({
  id: null,
  open: false,
  setId: (val: string) => set({ id: val }),
  setIsOpen: (open: boolean) => set({ open: open }),
}));
export const openCourseDeleteOrSuspandAction = create<StateShape>()((set) => ({
  action: null,
  id: null,
  open: false,
  setId: (val: string) => set({ id: val }),
  setIsOpen: (open: boolean) => set({ open: open }),
  setAction: (action: string) => set({ action: action }),
}));
