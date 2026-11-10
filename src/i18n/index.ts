import { en } from "./en";
import { th } from "./th";
import { Language, Translations } from "./types";

export const translations: Record<Language, Translations> = {
  en,
  th,
};

export * from "./types";

