import { notFound } from "next/navigation";

/** Unknown paths under a language (e.g. /de/nope) render the localized not-found page. */
export default function Missing() {
  notFound();
}
