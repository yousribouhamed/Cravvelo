import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/src/app/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url:
    process.env.NODE_ENV === "production"
      ? "https://jadir.vercel.app/api/uploadthing"
      : "http://localhost:3001/api/uploadthing",
});
