"use client";

import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { LogoUploader } from "./uploaders/logo-uploader";
import React from "react";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingButton } from "@/src/components/loading-button";

const DragDropAssets: FC = ({}) => {
  const mutation = trpc.addWebSiteLogo.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const [logoUrl, setLogoUrl] = React.useState<string>("");
  // const [faviconUrl, faviconLogoUrl] = React.useState<string>("");
  return (
    <ScrollArea>
      <div className="w-[290px] h-fit min-h-[300px] flex flex-col items-center p-4  gap-y-4 ">
        <LogoUploader fileUrl={logoUrl} onChnage={setLogoUrl} />
        {/* <FavIconUploader fileUrl={faviconUrl} onChnage={faviconLogoUrl} /> */}

        <div className="w-full h-[100px] flex items-center justify-center">
          <LoadingButton
            className="w-full "
            onClick={() => mutation.mutate({ logo: logoUrl })}
          >
            save
          </LoadingButton>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DragDropAssets;
