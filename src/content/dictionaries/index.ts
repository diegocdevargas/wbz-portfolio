import type { Locale } from "@/i18n/config";
import { pt, type Dictionary } from "./pt";
import { en } from "./en";
import { es } from "./es";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { pt, en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { format } from "./format";
