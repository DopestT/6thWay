# 6th Way — 6thway.com

Astro static site. Articles and editorials are Markdown files with validated
frontmatter — this is the publishing surface the n8n automation writes to.

## Local development

```
npm install
npm run dev      # http://localhost:4321 — shows drafts too
npm run build    # production build → dist/ — drafts are excluded
npm run preview  # serve the production build locally
```

## Content structure

```
src/content/articles/<slug>.md     — 3x/week tracker posts
src/content/editorials/<slug>.md   — Sunday synthesis pieces
```

Frontmatter is validated against `src/content.config.ts` at build time. A
malformed post (missing a required field, an empty `sources` array, an
invalid `beat` value) fails the build instead of going live broken — that's
intentional given how much scrutiny this content gets.

**Filename = URL slug.** `src/content/articles/my-post.md` publishes at
`/articles/my-post/`.

**`status` field controls visibility:**
- `draft` / `review` — visible in `npm run dev`, excluded from production builds
- `published` — visible everywhere

This means the default n8n output (`status: draft`) is safe to commit
directly without a separate "is this live yet" gate — it just won't appear
on the production site until someone (or a later workflow step) flips it to
`published` and a rebuild runs.

## Deploying to Cloudflare Pages

1. Connect this repo in the Cloudflare Pages dashboard.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. No environment variables or adapter needed — this is a fully static
   build, no SSR.
5. Every push to the connected branch triggers an automatic rebuild and
   deploy. This is what makes the n8n pipeline work end-to-end: commit →
   Cloudflare rebuilds → live.

## n8n integration

The automation should:
1. Generate a Markdown file matching `src/content/articles/_TEMPLATE.md` or
   `src/content/editorials/_SUNDAY_TEMPLATE.md` (see the editorial strategy
   docs for the generation prompts).
2. Commit it to this repo under the correct content directory, using the
   GitHub API or a Git node.
3. Leave `status: draft` by default. A human (or a separate approval flow)
   flips it to `published` and pushes again to go live.

No webhook or build trigger is needed beyond the Git push itself — Cloudflare
Pages handles the rebuild automatically once connected.
