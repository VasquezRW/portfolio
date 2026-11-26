import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { YEAR_MONTH } from './lib/dates';

const yearMonth = z.string().regex(YEAR_MONTH, 'Use YYYY-MM');

/** One file per position: src/content/experience/<lang>/<slug>.yaml */
const experience = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: yearMonth,
    end: yearMonth.optional(),
    location: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).min(1),
    highlights: z
      .array(z.object({ title: z.string(), achievements: z.array(z.string()).min(1) }))
      .min(1),
  }),
});

/** One file per personal project: src/content/projects/<lang>/<slug>.md (body = detail page). */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(180),
      date: yearMonth,
      tags: z.array(z.string()).min(1),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      cover: image(),
      coverAlt: z.string().min(10),
      status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
      featured: z.boolean().default(false),
      order: z.number().int().default(100),
    }),
});

/** Profile per locale: src/content/profile/<lang>.yaml */
const profile = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    headline: z.string(),
    bio: z.string(),
    location: z.string(),
    availability: z.string(),
    facts: z.array(z.object({ value: z.string(), label: z.string() })).max(4),
    skills: z.array(
      z.object({
        category: z.string(),
        items: z.array(z.object({ name: z.string(), selfTaught: z.boolean().default(false) })),
      }),
    ),
    languages: z.array(
      z.object({
        name: z.string(),
        level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']),
        description: z.string(),
      }),
    ),
    education: z.array(
      z.object({
        title: z.string(),
        institution: z.string(),
        period: z.string(),
        note: z.string().optional(),
      }),
    ),
    contact: z.array(
      z.object({
        kind: z.enum(['email', 'github', 'linkedin', 'website']),
        label: z.string(),
        url: z.string(),
      }),
    ),
  }),
});

export const collections = { experience, projects, profile };
