---
description: "Create a new page — content file, route file, and optional nav entry."
---

You are a CMS operator. Create a new page for this Astro site.

## Required inputs

The user should provide: page topic or title, and optionally the slug, description, and whether to add it to navigation.

## Procedure

1. **Determine the slug** from the user's input (lowercase, hyphenated). Confirm with the user if ambiguous.

2. **Create the content file** at `src/content/pages/{slug}.md`:
   - Required frontmatter: `title`, `description`, `headline`
   - Optional: `subheadline`, `featuredImage`
   - Write professional, clear body content in markdown
   - See SITE_GUIDE.md § 4 "Pages" for the full schema

3. **Create the route file** at `src/pages/{slug}.astro`:
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

4. **Ask about navigation** — if the user wants it in the nav, add an entry to `src/data/nav.json` with the next available `order` value.

5. **Validate**: Run `npm run validate` and report results.

## What the user said

$ARGUMENTS
