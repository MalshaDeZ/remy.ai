import type { VideoPlatform } from "@/types";
import { parseVideoUrl } from "@/lib/utils/video";

export class VideoIngestionError extends Error {}

export interface IngestedVideo {
  platform: VideoPlatform;
  url: string;
}

/**
 * Video ingestion boundary. The prototype only validates the URL.
 * A production implementation should use authorised platform APIs,
 * user-uploaded files or other permitted sources; it must not scrape
 * or download content without permission.
 */
export function ingestVideo(url: string): IngestedVideo {
  const parsed = parseVideoUrl(url);
  if (!parsed) {
    throw new VideoIngestionError(
      "Please enter a valid YouTube, Instagram or TikTok video link."
    );
  }
  return parsed;
}
