import type { FC } from "react";
import { WebSitePage } from "@/src/types";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
import { useEditorStore } from "@/src/lib/zustand/editor-state";

interface EditorRightbarAbdullahProps {}

const EditorRightbar: FC<EditorRightbarAbdullahProps> = ({}) => {
  const { selectComponent, currentComponent } = useEditorStore();
  return (
    <ScrollArea className="w-[300px]  shadow border-l  dark:border-zinc-900  h-full pb-10 ">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">الصفحات</TabsTrigger>
          <TabsTrigger value="password">طبقات</TabsTrigger>
          <TabsTrigger value="password">أصول</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <h1>this is account</h1>
        </TabsContent>
        <TabsContent value="password">
          <h1>this is account</h1>
        </TabsContent>
        <TabsContent value="password">
          <h1>this is account</h1>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default EditorRightbar;
