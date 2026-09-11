import en from "./en";
import vi from "./vi";
import zh from "./zh";
import ko from "./ko";

export const dictionaries = {
  vi,
  en,
  zh,
  ko,
} as const;

export type Dictionaries = typeof dictionaries;
export type Namespace = keyof Dictionaries["vi"];
