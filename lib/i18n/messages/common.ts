import type { Locale } from "../config";

/** Heading with one sticker word: rendered as `${before} <sticker>${word}</sticker>${after}`. */
export type StickerHeading = { before: string; word: string; after: string };

const en = {
  tagline: "Lessons for our Deutsch class. Open any lesson on your phone or laptop.",
  language: "Language",
  teacherPanel: "Teacher panel",
  allLessons: "All lessons",
  seeAllLessons: "See all lessons",
  homeLabel: "Fragen, all lessons",
  notConnected: {
    title: "This site is not connected yet",
    body: "Teacher: add the Supabase keys to the environment settings (see .env.example), then reload this page.",
  },
  notFound: {
    heading: { before: "This", word: "page", after: " is missing." } as StickerHeading,
    lead: "We could not find that page. The lesson may have been removed, or the link has a typo.",
  },
  error: {
    heading: { before: "That", word: "didn't", after: " work." } as StickerHeading,
    lead: "Something went wrong and the page did not load. Try again, and if it keeps failing, tell your teacher.",
    retry: "Try again",
  },
  frame: {
    loading: "Loading lesson…",
    previewSize: "Preview size",
    laptop: "Laptop",
    phone: "Phone",
    laptopNote: "Shown at {width}px wide, scaled to fit.",
    phoneNote: "Shown at {width}px wide, like a phone.",
  },
};

export type CommonMessages = typeof en;

const de: CommonMessages = {
  tagline: "Lektionen für unseren Deutschkurs. Öffne jede Lektion auf dem Handy oder Laptop.",
  language: "Sprache",
  teacherPanel: "Lehrerbereich",
  allLessons: "Alle Lektionen",
  seeAllLessons: "Alle Lektionen ansehen",
  homeLabel: "Fragen, alle Lektionen",
  notConnected: {
    title: "Diese Seite ist noch nicht verbunden",
    body: "Lehrkraft: Trage die Supabase-Schlüssel in die Umgebungsvariablen ein (siehe .env.example) und lade die Seite neu.",
  },
  notFound: {
    heading: { before: "Diese", word: "Seite", after: " fehlt." },
    lead: "Wir konnten diese Seite nicht finden. Vielleicht wurde die Lektion entfernt oder der Link hat einen Tippfehler.",
  },
  error: {
    heading: { before: "Das hat", word: "nicht", after: " geklappt." },
    lead: "Etwas ist schiefgelaufen und die Seite wurde nicht geladen. Versuch es noch einmal, und wenn es weiter nicht klappt, sag deiner Lehrkraft Bescheid.",
    retry: "Noch einmal versuchen",
  },
  frame: {
    loading: "Lektion wird geladen…",
    previewSize: "Vorschaugröße",
    laptop: "Laptop",
    phone: "Handy",
    laptopNote: "Angezeigt mit {width} px Breite, passend verkleinert.",
    phoneNote: "Angezeigt mit {width} px Breite, wie auf einem Handy.",
  },
};

const id: CommonMessages = {
  tagline: "Pelajaran untuk kelas bahasa Jerman kita. Buka pelajaran apa pun di HP atau laptop.",
  language: "Bahasa",
  teacherPanel: "Panel guru",
  allLessons: "Semua pelajaran",
  seeAllLessons: "Lihat semua pelajaran",
  homeLabel: "Fragen, semua pelajaran",
  notConnected: {
    title: "Situs ini belum terhubung",
    body: "Guru: tambahkan kunci Supabase ke pengaturan environment (lihat .env.example), lalu muat ulang halaman ini.",
  },
  notFound: {
    heading: { before: "Halaman ini", word: "hilang", after: "." },
    lead: "Halaman itu tidak ditemukan. Mungkin pelajarannya sudah dihapus, atau ada salah ketik di tautannya.",
  },
  error: {
    heading: { before: "Ada yang", word: "salah", after: "." },
    lead: "Terjadi kesalahan dan halaman gagal dimuat. Coba lagi, dan kalau masih gagal, beri tahu gurumu.",
    retry: "Coba lagi",
  },
  frame: {
    loading: "Memuat pelajaran…",
    previewSize: "Ukuran pratinjau",
    laptop: "Laptop",
    phone: "HP",
    laptopNote: "Ditampilkan selebar {width}px, diperkecil agar muat.",
    phoneNote: "Ditampilkan selebar {width}px, seperti di HP.",
  },
};

export const common: Record<Locale, CommonMessages> = { en, de, id };
