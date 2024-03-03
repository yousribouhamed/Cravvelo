import type { SectionName } from "@/src/types";
import { create } from "zustand";

interface StateShape {
  timeOfLastClick: number; // we need to keep track of this to disable the observer temporarily when user clicks on a link
  activeSection: SectionName;
  setActiveSection: (section: SectionName) => void;
  setTimeOfLastClick: (time: number) => void;
}

export const useActiveSection = create<StateShape>()((set) => ({
  activeSection: "home",
  timeOfLastClick: 0,
  setActiveSection: (section: SectionName) => set({ activeSection: section }),
  setTimeOfLastClick: (time: number) => set({ timeOfLastClick: time }),
}));
