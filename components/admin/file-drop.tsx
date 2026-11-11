"use client";

import { useRef, useState } from "react";
import { buttonClass, cn, IconFile } from "@/components/ui";
import { useI18n } from "@/components/i18n/provider";
import { checkLessonFile } from "@/lib/lesson-html";

/** Drag and drop plus a real file input. Validates with checkLessonFile and reports translated messages via callbacks. */
export function FileDrop({
  id,
  onFile,
  onError,
  fileName,
  describedBy,
}: {
  id: string;
  onFile: (file: File) => void;
  onError: (message: string) => void;
  fileName?: string | null;
  describedBy?: string;
}) {
  const { dict } = useI18n();
  const t = dict.admin.fileDrop;
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function take(file: File | undefined) {
    if (!file) return;
    const problem = checkLessonFile(file);
    if (problem) {
      onError(t[problem]);
      return;
    }
    onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files[0]);
      }}
      className={cn(
        "flex flex-col items-start gap-3 rounded-[16px] border-[2.5px] border-dashed border-ink p-5 transition-colors duration-150 sm:flex-row sm:items-center sm:justify-between",
        over ? "bg-sky" : "bg-surface",
      )}
    >
      <p className="min-w-0 text-[0.9375rem] text-ink-muted">
        {fileName ? (
          <span className="break-all font-semibold text-ink">{fileName}</span>
        ) : (
          t.prompt
        )}
      </p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".html,.htm,text/html"
        className="peer sr-only"
        aria-describedby={describedBy}
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <label
        htmlFor={id}
        className={buttonClass("secondary", "md", "cursor-pointer peer-focus-visible:-translate-y-px peer-focus-visible:shadow-[4px_4px_0_var(--accent)]")}
      >
        <IconFile />
        {fileName ? t.chooseAnother : t.chooseFile}
      </label>
    </div>
  );
}
