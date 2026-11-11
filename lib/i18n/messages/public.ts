import type { Locale } from "../config";
import type { StickerHeading } from "./common";

const en = {
  home: {
    heading: { before: "Let's", word: "learn", after: " today." } as StickerHeading,
    lead: "Pick a lesson. It opens right here, on any phone.",
  },
  filterByTopic: "Filter by topic",
  all: "All",
  loadingLessons: "Loading lessons",
  empty: { title: "No lessons yet", body: "Your teacher has not published anything. Check back soon." },
  loadError: {
    title: "Lessons could not be loaded",
    body: "Check your connection and reload the page. If it keeps happening, tell your teacher.",
  },
  openFullScreen: "Open full screen",
  lessonTitleFallback: "Lesson",
  lessonNotFoundTitle: "Lesson not found",
  seo: {
    homeTitle: "Fragen · Deutsch lessons for our class",
    lessonDescription: "A Deutsch lesson from our class. Opens right in the browser on any phone or laptop.",
    cardEyebrow: "Deutsch lesson",
    cardFooter: "Open it on any phone or laptop",
    siteCardTitle: "Deutsch lessons that open on any phone",
  },
};

export type PublicMessages = typeof en;

const de: PublicMessages = {
  home: {
    heading: { before: "Heute", word: "lernen", after: " wir." },
    lead: "Wähle eine Lektion. Sie öffnet sich direkt hier, auf jedem Handy.",
  },
  filterByTopic: "Nach Thema filtern",
  all: "Alle",
  loadingLessons: "Lektionen werden geladen",
  empty: {
    title: "Noch keine Lektionen",
    body: "Deine Lehrkraft hat noch nichts veröffentlicht. Schau bald wieder vorbei.",
  },
  loadError: {
    title: "Lektionen konnten nicht geladen werden",
    body: "Prüfe deine Verbindung und lade die Seite neu. Wenn es weiter passiert, sag deiner Lehrkraft Bescheid.",
  },
  openFullScreen: "Vollbild öffnen",
  lessonTitleFallback: "Lektion",
  lessonNotFoundTitle: "Lektion nicht gefunden",
  seo: {
    homeTitle: "Fragen · Deutschlektionen für unseren Kurs",
    lessonDescription: "Eine Deutschlektion aus unserem Kurs. Öffnet sich direkt im Browser, auf jedem Handy oder Laptop.",
    cardEyebrow: "Deutschlektion",
    cardFooter: "Auf jedem Handy oder Laptop öffnen",
    siteCardTitle: "Deutschlektionen, die auf jedem Handy laufen",
  },
};

const id: PublicMessages = {
  home: {
    heading: { before: "Ayo", word: "belajar", after: " hari ini." },
    lead: "Pilih pelajaran. Langsung terbuka di sini, di HP mana pun.",
  },
  filterByTopic: "Saring berdasarkan topik",
  all: "Semua",
  loadingLessons: "Memuat pelajaran",
  empty: { title: "Belum ada pelajaran", body: "Gurumu belum menerbitkan apa pun. Coba cek lagi nanti." },
  loadError: {
    title: "Pelajaran gagal dimuat",
    body: "Periksa koneksimu lalu muat ulang halaman. Kalau masih terjadi, beri tahu gurumu.",
  },
  openFullScreen: "Buka layar penuh",
  lessonTitleFallback: "Pelajaran",
  lessonNotFoundTitle: "Pelajaran tidak ditemukan",
  seo: {
    homeTitle: "Fragen · Pelajaran bahasa Jerman untuk kelas kita",
    lessonDescription: "Pelajaran bahasa Jerman dari kelas kita. Langsung terbuka di browser, di HP atau laptop mana pun.",
    cardEyebrow: "Pelajaran bahasa Jerman",
    cardFooter: "Buka di HP atau laptop mana pun",
    siteCardTitle: "Pelajaran bahasa Jerman yang bisa dibuka di HP mana pun",
  },
};

export const publicMessages: Record<Locale, PublicMessages> = { en, de, id };
