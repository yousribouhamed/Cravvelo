import { EditorState } from "@/src/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BearState {
  editor: EditorState;
}

const useBuilderState = create<BearState>()(
  persist(
    (set) => ({
      editor: {
        editor: {
          pages: [],
          selectedPageIndex: 0,
          selectedElement: {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
        history: {
          history: [],
          currentIndex: 0,
        },
      },
    }),
    { name: "editor state" }
  )
);
