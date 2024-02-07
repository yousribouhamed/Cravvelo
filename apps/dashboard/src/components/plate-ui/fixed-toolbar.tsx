import { withCn } from "@udecode/cn";

import { Toolbar } from "./toolbar";

export const FixedToolbar = withCn(
  Toolbar,
  "supports-backdrop-blur:bg-background/60 sticky left-0 -top-[15px] z-50 w-full h-fit justify-between overflow-x-auto   backdrop-blur"
);
