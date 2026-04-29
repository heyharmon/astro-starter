---
description: "Create a new page — content file, route file, and optional nav entry."
---

Create a new page for this Astro site.

## Required inputs

The user should provide: page topic or title, and optionally the slug, description, and whether to add it to navigation.

## Procedure

1. **Determine the slug** from the user's input (lowercase, hyphenated). Confirm with the user if ambiguous.

2. **Read 1-2 existing pages** in `src/content/pages/` to calibrate tone, formatting, and frontmatter patterns.

3. **Create the content file** at `src/content/pages/{slug}.md`:

   ```yaml
   ---
   title: "Team"
   description: "Meet the people behind Acme Corp."
   headline: "Our Team"
   subheadline: "Passionate people building great things."
   ---

   Page body content in Markdown.
   ```

   Required frontmatter: `title` (≤60 chars), `description` (≤155 chars), `headline`. Optional: `subheadline`, `featuredImage: { src, alt }`, `draft`. See `docs/content-schemas.md` if uncertain about a field.

4. **Create the route file** at `src/pages/{slug}.astro`:

   ```astro
   ---
   import BaseLayout from "../layouts/BaseLayout.astro";
   import { getEntry, render } from "astro:content";

   const page = await getEntry("pages", "{slug}");
   const { Content } = await render(page);
   ---

   <BaseLayout title={page.data.title} description={page.data.description}>
     <section class="mx-auto max-w-5xl px-6 py-24 sm:py-32">
       <h1 class="max-w-3xl">{page.data.headline}</h1>
       {page.data.subheadline && (
         <p class="mt-6 max-w-2xl text-lg text-neutral-500">
           {page.data.subheadline}
         </p>
       )}
     </section>
     <section class="mx-auto max-w-5xl px-6 pb-24">
       <div class="prose">
         <Content />
       </div>
     </section>
   </BaseLayout>
   ```

   If an existing page route uses a different layout pattern, prefer copying that pattern over this template.

5. **Ask about navigation** — if the user wants it in the nav, read `src/data/nav.json`, add an entry with the next `order` value, and verify `href` matches the new route.

6. **Validate**: Run `npm run validate`. If unavailable, run `npm run build`.

## What the user said

$ARGUMENTS
