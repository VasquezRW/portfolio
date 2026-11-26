import en from './en.json';
import es from './es.json';

export const languages = { en: 'English', es: 'Español' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

export type UIKey = keyof typeof en;
const ui: Record<Lang, Partial<Record<UIKey, string>>> = { en, es };

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : defaultLang;
}

/** Returns a translator for `lang`; missing keys fall back to English. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars: Record<string, string | number> = {}): string {
    const template = ui[lang][key] ?? ui[defaultLang][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
  };
}

/** Removes the locale prefix from a pathname: `/es/projects/x` → `/projects/x`. */
export function stripLang(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  if (isLang(first) && first !== defaultLang) return '/' + rest.join('/');
  return pathname || '/';
}

/** Builds the path for `lang`: `localizePath('/projects/x', 'es')` → `/es/projects/x`. */
export function localizePath(path: string, lang: Lang): string {
  const clean = stripLang(path.startsWith('/') ? path : `/${path}`);
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

export const htmlLang: Record<Lang, string> = { en: 'en', es: 'es' };
export const dateLocale: Record<Lang, string> = { en: 'en-US', es: 'es-GT' };
