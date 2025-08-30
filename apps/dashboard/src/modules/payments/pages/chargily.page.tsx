"use client";

import ChargilyConnector from "../components/chargily-form";
import { ChargilyConfigType } from "../types";

interface Props {
  config: ChargilyConfigType | null;
  isAlreadyActive: boolean;
}

export const ChargilyConnectPage = ({ config, isAlreadyActive }: Props) => {
  return <ChargilyConnector isAlreadyActive={isAlreadyActive} data={config} />;
};
