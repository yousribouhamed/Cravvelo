import type { FC } from "react";
import { ComponentsList } from "./components-list";
import { Card, CardContent } from "@ui/components/ui/card";
import { ScrollArea } from "@ui/components/ui/scroll-area";

interface DragDropComponentsProps {}

const DragDropComponents: FC = ({}) => {
  const handleOnDrag = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("componetType", type);
  };

  return (
    <ScrollArea>
      <div className="w-full h-fit min-h-[300px] flex flex-col items-center p-4 gap-y-4">
        {ComponentsList.map((item, index) => (
          <Card key={item.type + index} className="w-full">
            <CardContent className="w-full p-0">
              {/* <img
              className="w-full h-[200px] object-contain rounded-xl"
              src={item.imageUrl}
            /> */}
              <div
                draggable
                onDragStart={(e) => handleOnDrag(e, item.type)}
                className="w-full h-[100px] bg-primary rounded-xl flex items-center justify-center"
              >
                <p className="text-white font-bold text-xl">{item.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DragDropComponents;
