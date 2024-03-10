import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@ui/components/ui/context-menu";
import { ReactNode } from "react";

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <span>لا تحاول سرقة الفيديو</span>
      </ContextMenuContent>
    </ContextMenu>
  );
}
