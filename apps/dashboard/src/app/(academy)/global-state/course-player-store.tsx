import { Module } from "@/src/types";
import { create } from "zustand";

interface CoursePlayer {
  state: {
    currentModule: Module | null;
  };
  actions: {
    setCurrentModule: (item: Module) => void;
  };
}

export const useCoursePlayerStore = create<CoursePlayer>()((set, get) => ({
  state: {
    currentModule: null,
  },
  actions: {
    setCurrentModule: (item: Module) => {},
  },
}));
