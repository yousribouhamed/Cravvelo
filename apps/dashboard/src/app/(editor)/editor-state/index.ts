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
              type: "__body",
              content: [],
              name: "جذر",
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

          // const newSlectedElement = {
          //   ...get().state.editor.selectedElement,
          //   content: Array.isArray(get().state.editor.selectedElement.content)
          //     ? //@ts-ignore
          //       [...get().state?.editor?.selectedElement?.content, element]
          //     : [element],
          // };

          // this helper funtion is lt help me do recursion so the new selected element will be added
          const NEW_ELEMENTS = addNewElementHelper({
            elements: currentPage.elements,
            element: get().state.editor.selectedElement,
            addedElement: element,
          });

          console.log("here are the new elements after the funtion runs");
          console.log(NEW_ELEMENTS);

          // add the component to the page
          const newPageUpdated = {
            ...currentPage,
            elements: NEW_ELEMENTS,
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

    selectElement: (element: EditorElement) => {
      set({
        state: {
          ...get().state,
          editor: { ...get().state.editor, selectedElement: element },
        },
      });

      console.log(get().state);
    },

    updateElement: (element: EditorElement) =>
      set({
        state: (() => {
          // get the current page
          const selectedPage = get().state.editor.selectedPageIndex;
          const currentPage = get().state.editor.pages[selectedPage];

          const newElements = updateElement({
            element: get().state.editor.selectedElement,
            elements: currentPage.elements,
            newElement: element,
          });
          // console.log("here it is the new element ");
          // console.log(newElements);

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

const addNewElementHelper = ({
  element,
  elements,
  addedElement,
}: {
  elements: EditorElement[];
  element: EditorElement; // this is the selected element
  addedElement: EditorElement; // this is the added element
}): EditorElement[] => {
  return elements.map((item) => {
    if (item.id === element.id && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, addedElement],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addNewElementHelper({
          element,
          elements: item.content,
          addedElement: addedElement,
        }),
      };
    }
    return item;
  });
};

const updateElement = ({
  element,
  elements,
  newElement,
}: {
  elements: EditorElement[];
  element: EditorElement; // this is the selected element
  newElement: EditorElement; // this will overwrite the selected element
}): EditorElement[] => {
  return elements.map((item) => {
    if (item.id === element.id && Array.isArray(item.content)) {
      return {
        ...newElement,
        styles: newElement.styles,
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateElement({
          element,
          elements: item.content,
          newElement,
        }),
      };
    }
    return item;
  });
};
