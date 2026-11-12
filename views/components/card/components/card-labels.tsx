import { createContext, useContext, useMemo } from "react";

import { CARD_LABELS } from "../constants/card";
import type { CardLabels, CardLabelsProviderProps } from "../types/card";

const CardLabelsContext = createContext<CardLabels>(CARD_LABELS);

export function CardLabelsProvider({
  labels,
  children,
}: CardLabelsProviderProps) {
  const parent = useContext(CardLabelsContext);
  const value = useMemo(() => ({ ...parent, ...labels }), [parent, labels]);
  return (
    <CardLabelsContext.Provider value={value}>
      {children}
    </CardLabelsContext.Provider>
  );
}

export function useCardLabels(): CardLabels {
  return useContext(CardLabelsContext);
}
