import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('renders every section in English by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wilmer Vasquez');
    for (const name of ['Experience', 'Skills', 'Projects', 'Languages and education', 'Contact']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    await expect(page.getByTestId('project-card')).not.toHaveCount(0);
  });

  test('switches to Spanish and back', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang-link="es"]').click();
    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { level: 2, name: 'Experiencia' })).toBeVisible();
    await page.locator('[data-lang-link="en"]').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('toggles and remembers the theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.locator('#theme-toggle').click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('shows no phone number', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    expect(await page.content()).not.toContain('3078');
  });
});

test.describe('projects', () => {
  test('opens a project detail page in the same language', async ({ page }) => {
    await page.goto('/es/');
    await page.getByTestId('project-card').first().getByRole('link', { name: 'Detalles' }).click();
    await expect(page).toHaveURL(/\/es\/projects\/[\w-]+\/?$/);
    await expect(page.getByRole('link', { name: 'Ver código en GitHub' })).toHaveAttribute(
      'href',
      /github\.com/,
    );
    await page.locator('[data-lang-link="en"]').click();
    await expect(page).toHaveURL(/^[^]*\/projects\/[\w-]+\/?$/);
    await expect(page.getByRole('link', { name: 'View code on GitHub' })).toBeVisible();
  });
});

test.describe('accessibility', () => {
  for (const path of ['/', '/es/', '/projects/mobile-testing-demo/']) {
    for (const scheme of ['light', 'dark'] as const) {
      test(`${path} has no axe violations (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const summary = results.violations.map((v) => ({
          rule: v.id,
          help: v.help,
          nodes: v.nodes.map((n) => n.html.slice(0, 120)),
        }));
        expect(summary).toEqual([]);
      });
    }
  }
});
