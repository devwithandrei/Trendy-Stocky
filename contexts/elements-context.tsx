import React, { createContext, useContext } from 'react';
import { StripeElements } from '@stripe/stripe-js';

interface ElementsContextProps {
  elements: StripeElements | null;
}

const ElementsContext = createContext<ElementsContextProps>({
  elements: null,
});

export const ElementsProvider = ElementsContext.Provider;

export const useElementsContext = () => useContext(ElementsContext);
