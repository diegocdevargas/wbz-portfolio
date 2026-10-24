/** Holds the page's space while a project loads, so the footer never shows up alone. */
export default function Loading() {
  return <div aria-hidden style={{ minHeight: "100vh" }} />;
}
