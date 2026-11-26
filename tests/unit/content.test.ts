import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const CONTENT = resolve(__dirname, '../../src/content');
const LANGS = ['en', 'es'];

const slugs = (collection: string, lang: string) =>
  readdirSync(join(CONTENT, collection, lang))
    .map((f) => f.replace(/\.(md|ya?ml)$/, ''))
    .sort();

const frontmatter = (file: string) => {
  const match = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return parse(match?.[1] ?? '') as Record<string, unknown>;
};

describe.each(['experience', 'projects'])('%s collection', (collection) => {
  it('has the same entries in every language', () => {
    const [first, ...rest] = LANGS.map((l) => slugs(collection, l));
    for (const other of rest) expect(other).toEqual(first);
  });
});

describe('projects', () => {
  it('share language-neutral fields across translations', () => {
    for (const slug of slugs('projects', 'en')) {
      const [en, es] = LANGS.map((l) => frontmatter(join(CONTENT, 'projects', l, `${slug}.md`)));
      for (const key of ['date', 'repo', 'demo', 'cover', 'status', 'featured', 'order', 'tags']) {
        expect(es![key], `${slug}.${key}`).toEqual(en![key]);
      }
    }
  });

  it('point to cover images that exist', () => {
    for (const lang of LANGS) {
      for (const slug of slugs('projects', lang)) {
        const file = join(CONTENT, 'projects', lang, `${slug}.md`);
        const cover = frontmatter(file).cover as string;
        expect(existsSync(resolve(dirname(file), cover)), `${lang}/${slug}`).toBe(true);
      }
    }
  });
});

describe('experience', () => {
  it('share dates and stack across translations', () => {
    for (const slug of slugs('experience', 'en')) {
      const [en, es] = LANGS.map(
        (l) =>
          parse(readFileSync(join(CONTENT, 'experience', l, `${slug}.yaml`), 'utf8')) as Record<
            string,
            unknown
          >,
      );
      for (const key of ['company', 'start', 'end', 'stack']) {
        expect(es![key], `${slug}.${key}`).toEqual(en![key]);
      }
    }
  });
});

describe('profile', () => {
  const read = (l: string) => readFileSync(join(CONTENT, 'profile', `${l}.yaml`), 'utf8');

  it('exists for every language', () => {
    for (const l of LANGS) expect(existsSync(join(CONTENT, 'profile', `${l}.yaml`))).toBe(true);
  });

  it('never publishes a phone number', () => {
    for (const l of LANGS) {
      expect(read(l)).not.toMatch(/\+?\d[\d\s-]{7,}\d/);
      expect(read(l)).not.toMatch(/tel:/i);
    }
  });
});
