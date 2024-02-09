import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import type { FC } from "react";
import { useThemeEditorStore } from "../../theme-editor-store";
import { ScrollArea } from "@ui/components/ui/scroll-area";

const links = [
  {
    id: "__linke1",
    name: "الصفحة الرئيسية ",
  },
  {
    id: "__linke2",
    name: " الدورات ",
  },
];

const TreeCompoent: FC = ({}) => {
  const { state, actions } = useThemeEditorStore();

  const deleteElement = useThemeEditorStore(
    (state) => state.actions.deleteElement
  );
  return (
    <ScrollArea className="w-full">
      <div dir="rtl" className="w-full min-h-[240px] h-fit flex flex-col ">
        <div className="w-full h-[40px] border-b  flex items-center justify-start p-4">
          <p className="text-lg font-semibold text-start">الصفحة الرئيسية </p>
        </div>
        <div className="w-full min-h-[50px] h-fit  border-b p-4">
          <p className="text-md font-semibold text-start">شريط التنقل</p>
          <div className="w-full min-h-[40px] flex flex-col items-start  gap-y-2 my-4  ">
            {links.map((item) => (
              <div
                key={item.id}
                className="w-full h-[20px] flex items-center justify-between hover:bg-zinc-50 group  cursor-pointer p-4 rounded-xl"
              >
                <div className="flex justify-start gap-x-4 items-center h-full">
                  <GripVertical className="w-4 h-4 text-white group-hover:text-zinc-500 hover:cursor-grab" />
                  <p className="text-zinc-500 text-sm">{item.name}</p>
                </div>

                <button
                  onClick={() => deleteElement(item.id)}
                  className="w-8 h-full flex items-center justify-end  text-white group-hover:text-zinc-500 "
                >
                  <Trash2 className="w-4 h-4 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-[200px] p-4 h-[20px] rounded-xl border flex items-center justify-start border-dashed border-primary text-sm font-semibold text-primary gap-x-4">
            <PlusCircle className="w-4 h-4" />
            اظافة عنصر
          </button>
        </div>

        <div className="w-full h-[400px]  p-4 ">
          <p className="text-md font-semibold text-start">نموذج </p>
          <div className="w-full min-h-[50px] h-fit flex flex-col gap-y-2  border-b ">
            {state.pages[state.currentPageIndex].components.map((item) => {
              return (
                <div
                  key={item.id}
                  className="w-full h-[20px] flex items-center justify-between hover:bg-zinc-50 group  cursor-pointer p-4 rounded-xl"
                >
                  <div className="flex justify-start gap-x-4 items-center h-full">
                    <GripVertical className="w-4 h-4 text-white group-hover:text-zinc-500 hover:cursor-grab" />
                    <p className="text-zinc-500 text-sm">{item.name}</p>
                  </div>

                  <button
                    onClick={() => deleteElement(item.id)}
                    className="w-8 h-full flex items-center justify-end  text-white group-hover:text-zinc-500 "
                  >
                    <Trash2 className="w-4 h-4 hover:text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TreeCompoent;
