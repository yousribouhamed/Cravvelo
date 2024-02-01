import { EditorElement, EditorState, WebSitePage } from "@/src/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { defaultStyles } from "@/src/constants/website-template";

interface EditorGobalState {
  state: EditorState;

  actions: {
    addElement: (element: EditorElement) => void;
    getWebPage: () => WebSitePage;
    toggleSelectionMode: () => void;
    selectElement: (element: EditorElement) => void;
    updateElement: (element: EditorElement) => void;

    // removeElement: (element: EditorElement) => void;
    // updateElement: (element: EditorElement) => void;
  };
}

export const useWebSiteEditor = create<EditorGobalState>()((set, get) => ({
  state: {
    editor: {
      pages: [
        {
          pathname: "/",
          title: "home",
          elements: [
            {
              styles: {},
              id: uuidv4(),
              type: "ANNOUNCEMENTBAR",
              content: [
                {
                  type: "TEXT",
                  content: { innerText: "عندما تغرب الشمس" },
                  id: uuidv4(),
                  name: "الكتابة",
                  styles: { ...defaultStyles },
                },
              ],
              name: "شريط الإعلان",
            },
            {
              styles: {},
              id: uuidv4(),
              type: "ANNOUNCEMENTBAR",
              content: [
                {
                  type: "TEXT",
                  content: { innerText: "تغرب الشمس" },
                  id: uuidv4(),
                  name: "الكتابة",
                  styles: { ...defaultStyles },
                },
              ],
              name: "شريط الإعلان",
            },
          ],
        },
      ],
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
    isSelectionMode: true,
  },

  actions: {
    addElement: (element: EditorElement) =>
      set({
        state: (() => {
          // get the current page
          const selectedPage = get().state.editor.selectedPageIndex;
          const currentPage = get().state.editor.pages[selectedPage];

          // add the component to the page
          const newPageUpdated = {
            ...currentPage,
            elements: [...currentPage.elements, element],
          };

          // update the state
          // create a copy of the current state
          const newEditor = {
            ...get().state.editor,
            pages: [
              ...get().state.editor.pages.slice(0, selectedPage), // copy pages before the selected page
              newPageUpdated, // replace the selected page with the updated one
              ...get().state.editor.pages.slice(selectedPage + 1), // copy pages after the selected page
            ],
          };

          // ste the new state
          return { ...get().state, editor: newEditor } as EditorState;
        })(),
      }),
    getWebPage: () => {
      return get().state.editor.pages[get().state.editor.selectedPageIndex];
    },

    toggleSelectionMode: () =>
      set({
        state: {
          ...get().state,
          isSelectionMode: !get().state.isSelectionMode,
        },
      }),

    selectElement: (element: EditorElement) =>
      set({
        state: {
          ...get().state,
          editor: { ...get().state.editor, selectedElement: element },
        },
      }),
    updateElement: (element: EditorElement) =>
      set({
        state: (() => {
          // get the current page
          const selectedPage = get().state.editor.selectedPageIndex;
          const currentPage = get().state.editor.pages[selectedPage];

          const newElements = currentPage.elements.map((item) => {
            if (element.id === item.id) {
              return element;
            }

            return {
              ...item,
              content:
                Array.isArray(item.content) &&
                item.content.map((subitem) =>
                  subitem.id === element.id ? element : subitem
                ),
            };
          });

          console.log("here it is the new element ");

          console.log(newElements);

          // add the component to the page
          const newPageUpdated = {
            ...currentPage,
            elements: newElements,
          };

          // update the state
          // create a copy of the current state
          const newEditor = {
            ...get().state.editor,
            pages: [
              ...get().state.editor.pages.slice(0, selectedPage), // copy pages before the selected page
              newPageUpdated, // replace the selected page with the updated one
              ...get().state.editor.pages.slice(selectedPage + 1), // copy pages after the selected page
            ],
          };

          // ste the new state
          return { ...get().state, editor: newEditor } as EditorState;
        })(),
      }),
  },
}));

// {
//   name: "editor state",
//   merge: (persistedState, defaultState) => {
//     if (!persistedState || typeof persistedState !== "object") {
//       return defaultState;
//     }

//     let resultState: EditorGobalState = { ...defaultState };
//     const keys = Object.keys(defaultState) as (keyof EditorGobalState)[];

//     keys.forEach((key) => {
//       if (key in persistedState) {
//         //@ts-ignore // TypeScript currently don't recognize that key exists in localState
//         const state = persistedState[key];
//         if (!!state) {
//           resultState = {
//             ...resultState,
//             [key]: { ...defaultState[key], ...state },
//           };
//         }
//       }
//     });

//     return resultState;
//   },
// }
// )
