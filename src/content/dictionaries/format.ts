// Client-safe helpers: importing this does not pull every language into the bundle.
export type { Dictionary } from "./pt";

/** Fill "{name}" placeholders. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}
