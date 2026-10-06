import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '../constants/anime';
import type { Anime } from '../types/anime';

export function calculateProgress(currentEpisode: number, totalEpisodes: number): number {
  if (totalEpisodes <= 0) {
    return 0;
  }

  const percentage = (currentEpisode / totalEpisodes) * 100;

  return Math.min(Math.max(percentage, 0), 100);
}

export function formatEpisodeProgress(anime: Anime): string {
  return `Episode ${anime.current_episode} / ${anime.total_episodes}`;
}

export function getProgressPercentage(anime: Anime): number {
  return calculateProgress(anime.current_episode, anime.total_episodes);
}

export function isAnimeCompleted(anime: Anime): boolean {
  return anime.total_episodes > 0 && anime.current_episode >= anime.total_episodes;
}

export function clampEpisode(episode: number, totalEpisodes: number): number {
  return Math.min(Math.max(Math.floor(episode), 0), Math.max(totalEpisodes, 0));
}

export function validateAnimeTitle(title: string): string | null {
  const value = title.trim();

  if (!value) {
    return 'Title is required.';
  }

  if (value.length > MAX_TITLE_LENGTH) {
    return `Title must not exceed ${MAX_TITLE_LENGTH} characters.`;
  }

  return null;
}

export function validateAnimeDescription(description: string): string | null {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  return null;
}

export function validateEpisodeCount(totalEpisodes: number): string | null {
  if (!Number.isInteger(totalEpisodes)) {
    return 'Episode count must be a whole number.';
  }

  if (totalEpisodes < 0) {
    return 'Episode count cannot be negative.';
  }

  return null;
}

export function validateWebsiteUrl(url: string): string | null {
  const value = url.trim();

  if (!value) {
    return null;
  }

  try {
    const parsedUrl = new URL(value);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return 'Website URL must use HTTP or HTTPS.';
    }
  } catch {
    return 'Please enter a valid website URL.';
  }

  return null;
}
