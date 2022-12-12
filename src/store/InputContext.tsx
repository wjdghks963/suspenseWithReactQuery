import { createContext, Dispatch, SetStateAction } from "react";

export const InputContext = createContext<{
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}>({ query: "", setQuery: () => "" });
