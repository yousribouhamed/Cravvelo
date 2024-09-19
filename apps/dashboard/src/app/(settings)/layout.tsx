import { ClerkProvider } from "@clerk/nextjs";
import ConnectionStatusAlert from "@/src/components/connection-status-alert";
import { constructMetadata } from "@/src/lib/utils";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/components/ui/drawer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConnectionStatusAlert>
        <div className="flex w-full min-h-screen gap-x-2 bg-gray-200 ">
          <Drawer open fixed>
            <DrawerContent className="w-full h-[95%]">
              <DrawerHeader>
                <DrawerTitle>Cravvelo settings</DrawerTitle>
              </DrawerHeader>

              {children}
            </DrawerContent>
          </Drawer>
        </div>
      </ConnectionStatusAlert>
    </ClerkProvider>
  );
}
