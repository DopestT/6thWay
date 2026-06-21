import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

const articles = defineCollection({
  // [^_]*.md excludes underscore-prefixed files, e.g. _TEMPLATE.md
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    beat: z.enum([
      'arms-pipeline',
      'who-profits',
      'empire-tracker',
      'gaza-reconstruction',
      'west-bank-settlements',
      'aipac-money-outcome',
      'media-bias',
    ]),
    tags: z.array(z.string()).default([]),
    dek: z.string(),
    summary: z.string(),
    // Every article needs at least one traceable source — enforced at build time.
    sources: z.array(sourceSchema).min(1, 'At least one source is required.'),
    data_through: z.coerce.date().optional(),
    tracker_update: z.boolean().default(false),
    related_slugs: z.array(z.string()).default([]),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
  }),
});

const editorials = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/editorials' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    week_ending: z.coerce.date(),
    threads_covered: z.array(z.string()).default([]),
    dek: z.string(),
    summary: z.string(),
    sources: z.array(sourceSchema).default([]),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
  }),
});

export const collections = { articles, editorials };
