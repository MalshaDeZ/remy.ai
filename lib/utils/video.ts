import type { VideoPlatform } from "@/types";

export interface ParsedVideoUrl {
  platform: VideoPlatform;
  url: string;
}

const HOSTS: Record<VideoPlatform, string[]> = {
  youtube: ["youtube.com", "youtu.be", "m.youtube.com"],
  instagram: ["instagram.com"],
  tiktok: ["tiktok.com", "vm.tiktok.com"],
};

/** Validates a URL and detects the supported platform. Returns null if invalid. */
export function parseVideoUrl(input: string): ParsedVideoUrl | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  for (const [platform, hosts] of Object.entries(HOSTS) as [VideoPlatform, string[]][]) {
    if (hosts.some((h) => host === h || host.endsWith("." + h))) {
      return { platform, url: url.toString() };
    }
  }
  return null;
}
