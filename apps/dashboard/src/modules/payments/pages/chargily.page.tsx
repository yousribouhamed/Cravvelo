"use client";

import ChargilyConnector from "../components/chargily-form";
import { ChargilyConfigType } from "../types";

interface Props {
  config: ChargilyConfigType | null;
}

export const ChargilyConnectPage = ({ config }: Props) => {
  return <ChargilyConnector data={config} />;
};
