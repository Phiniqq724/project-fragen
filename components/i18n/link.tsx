"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useHref } from "./provider";

/** next/link that adds the current language prefix to internal string hrefs ("/admin" -> "/de/admin"). */
export function LocalLink({ href, ...props }: ComponentProps<typeof Link>) {
  const localize = useHref();
  return <Link {...props} href={typeof href === "string" ? localize(href) : href} />;
}
