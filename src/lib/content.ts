import { getCollection, getEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';
import { toDecimalYear } from './dates';

/** Entry ids are `<lang>/<slug>`; returns `<slug>`. */
export function slugOf(id: string): string {
  return id.split('/').slice(1).join('/');
}

export async function getProfile(lang: Lang) {
  const entry = await getEntry('profile', lang);
  if (!entry) throw new Error(`Missing src/content/profile/${lang}.yaml`);
  return entry.data;
}

/** Positions for `lang`, most recent first. */
export async function getExperience(lang: Lang) {
  const entries = await getCollection('experience', ({ id }) => id.startsWith(`${lang}/`));
  return entries.sort((a, b) => toDecimalYear(b.data.start) - toDecimalYear(a.data.start));
}

/** Projects for `lang`: featured first, then by `order`, then newest. */
export async function getProjects(lang: Lang) {
  const entries = await getCollection('projects', ({ id }) => id.startsWith(`${lang}/`));
  return entries.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      toDecimalYear(b.data.date) - toDecimalYear(a.data.date),
  );
}
