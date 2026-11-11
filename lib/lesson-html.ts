/**
 * Lesson HTML runs in an opaque-origin sandbox (no `allow-same-origin`), so it can
 * never read the teacher's session. The catch: in that sandbox, touching
 * `localStorage` / `sessionStorage` throws, which breaks many AI-generated quizzes.
 * We inject a tiny in-memory replacement before any lesson script runs.
 * Isomorphic: used by the server route and by the admin preview in the browser.
 */

export const LESSON_SANDBOX =
  "allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads";

export const MAX_LESSON_BYTES = 5 * 1024 * 1024;

const STORAGE_SHIM = `<script data-fragen-shim>(function(){function m(){var d=Object.create(null);return{getItem:function(k){k=String(k);return k in d?d[k]:null},setItem:function(k,v){d[String(k)]=String(v)},removeItem:function(k){delete d[String(k)]},clear:function(){d=Object.create(null)},key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}}["localStorage","sessionStorage"].forEach(function(n){try{window[n].getItem("x")}catch(e){try{Object.defineProperty(window,n,{value:m(),configurable:true})}catch(_){}}});})();</script>`;

const VIEWPORT_META = `<meta name="viewport" content="width=device-width, initial-scale=1">`;

export function prepareLessonHtml(raw: string): string {
  const hasViewport = /<meta[^>]+name=["']?viewport/i.test(raw);
  const inject = STORAGE_SHIM + (hasViewport ? "" : VIEWPORT_META);

  const headOpen = raw.match(/<head(\s[^>]*)?>/i);
  if (headOpen?.index !== undefined) {
    const at = headOpen.index + headOpen[0].length;
    return raw.slice(0, at) + inject + raw.slice(at);
  }
  const htmlOpen = raw.match(/<html(\s[^>]*)?>/i);
  if (htmlOpen?.index !== undefined) {
    const at = htmlOpen.index + htmlOpen[0].length;
    return raw.slice(0, at) + `<head>${inject}</head>` + raw.slice(at);
  }
  const doctype = raw.match(/<!doctype[^>]*>/i);
  if (doctype?.index !== undefined) {
    const at = doctype.index + doctype[0].length;
    return raw.slice(0, at) + inject + raw.slice(at);
  }
  return inject + raw;
}

export type LessonFileProblem = "notHtml" | "empty" | "tooLarge";

/** Quick sanity check for the upload form. Returns a problem code (translated by the UI) or null. */
export function checkLessonFile(file: { name: string; size: number }): LessonFileProblem | null {
  if (!/\.html?$/i.test(file.name)) return "notHtml";
  if (file.size === 0) return "empty";
  if (file.size > MAX_LESSON_BYTES) return "tooLarge";
  return null;
}

/** Pulls the <title> out of an HTML file to prefill the lesson title. */
export function extractHtmlTitle(raw: string): string | null {
  const match = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match?.[1]?.replace(/\s+/g, " ").trim();
  return title ? title.slice(0, 120) : null;
}

export function slugify(title: string): string {
  const base = title
    .normalize("NFKD")
    .replace(/ß/g, "ss")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "lesson"}-${suffix}`;
}
