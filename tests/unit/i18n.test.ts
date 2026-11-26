import { describe, expect, it } from 'vitest';
import en from '../../src/i18n/en.json';
import es from '../../src/i18n/es.json';
import { getLangFromUrl, localizePath, stripLang, useTranslations } from '../../src/i18n/utils';

describe('UI dictionaries', () => {
  it('have the same keys in every language', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it('have no empty strings', () => {
    for (const dict of [en, es]) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), key).not.toBe('');
      }
    }
  });

  it('use the same placeholders in both languages', () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(vars(es[key]), key).toEqual(vars(en[key]));
    }
  });
});

describe('getLangFromUrl', () => {
  it.each([
    ['https://x.dev/', 'en'],
    ['https://x.dev/projects/demo/', 'en'],
    ['https://x.dev/es/', 'es'],
    ['https://x.dev/es/projects/demo/', 'es'],
    ['https://x.dev/fr/', 'en'],
  ])('%s → %s', (url, lang) => {
    expect(getLangFromUrl(new URL(url))).toBe(lang);
  });
});

describe('localizePath', () => {
  it.each([
    ['/', 'es', '/es/'],
    ['/', 'en', '/'],
    ['/es/', 'en', '/'],
    ['/es/', 'es', '/es/'],
    ['/projects/demo/', 'es', '/es/projects/demo/'],
    ['/es/projects/demo/', 'en', '/projects/demo/'],
    ['projects/demo/', 'es', '/es/projects/demo/'],
  ] as const)('%s in %s → %s', (path, lang, expected) => {
    expect(localizePath(path, lang)).toBe(expected);
  });

  it('stripLang keeps paths without a locale', () => {
    expect(stripLang('/projects/x/')).toBe('/projects/x/');
  });
});

describe('useTranslations', () => {
  it('translates and interpolates', () => {
    const t = useTranslations('es');
    expect(t('nav.projects')).toBe('Proyectos');
    expect(t('experience.months', { n: 9 })).toBe('9 meses');
  });
});
