import Link from "next/link";
import { headers } from "next/headers";
import { LOCALE_HEADER, defaultLocale, isLocale, localePath } from "@/i18n/config";

// not-found pages receive no route params, so the language comes from the header the
// middleware sets.
const copy = {
  pt: { eyebrow: "Erro 404", text: "Fora de", accent: "órbita.", body: "A página que você procura não existe ou mudou de endereço.", back: "Voltar para a home" },
  en: { eyebrow: "Error 404", text: "Out of", accent: "orbit.", body: "The page you are looking for does not exist or has moved.", back: "Back to home" },
  es: { eyebrow: "Error 404", text: "Fuera de", accent: "órbita.", body: "La página que buscas no existe o cambió de dirección.", back: "Volver al inicio" },
};

export default async function NotFound() {
  const value = (await headers()).get(LOCALE_HEADER) ?? "";
  const locale = isLocale(value) ? value : defaultLocale;
  const t = copy[locale];
  return (
    <section
      className="container"
      style={{ minHeight: "70vh", paddingTop: 160, paddingBottom: 120 }}
    >
      <p className="label">{t.eyebrow}</p>
      <h1 className="section-title" style={{ marginTop: 16, fontSize: "clamp(56px, 8vw, 120px)" }}>
        {t.text} <span className="accent">{t.accent}</span>
      </h1>
      <p style={{ marginTop: 24, maxWidth: 480, color: "var(--text-muted)" }}>{t.body}</p>
      <p style={{ marginTop: 32 }}>
        <Link href={localePath(locale, "/")} className="mono-label" style={{ color: "var(--violet)" }}>
          ← {t.back}
        </Link>
      </p>
    </section>
  );
}
