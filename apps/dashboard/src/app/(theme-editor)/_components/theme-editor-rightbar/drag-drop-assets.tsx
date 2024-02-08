"use client";

import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { LogoUploader } from "./uploaders/logo-uploader";
import { FavIconUploader } from "./uploaders/fav-icon-uploader";
import React from "react";

const DragDropAssets: FC = ({}) => {
  const [logoUrl, setLogoUrl] = React.useState<string>("");
  const [faviconUrl, faviconLogoUrl] = React.useState<string>("");
  return (
    <ScrollArea>
      <div className="w-[290px] h-fit min-h-[300px] flex flex-col items-center p-4  gap-y-4 ">
        <LogoUploader fileUrl={logoUrl} onChnage={setLogoUrl} />
        <FavIconUploader fileUrl={faviconUrl} onChnage={faviconLogoUrl} />
      </div>
    </ScrollArea>
  );
};

export default DragDropAssets;
