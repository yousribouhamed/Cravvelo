import { builder } from "./builder";
import { collector } from "./collector";
import { domain } from "./domain";

export const website = {
  ...builder,
  ...collector,
  ...domain,
};
