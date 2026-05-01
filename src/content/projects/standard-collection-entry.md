---
title: "A standard project entry"
description: "This entry has featured: false. It still appears on the projects index, just not in any curated featured section."
client: "Beta Demo LLC"
location: "Remote"
order: 2
featured: false
draft: false
---

## Why this entry exists

This is the contrast case — a project with `featured: false`. It demonstrates that *every* entry in the collection appears on the listing route at `/projects`, regardless of the flag. The flag only matters when another route filters on it.

In practice, most of your projects will live in this state: present, browsable, but not promoted. A subset get `featured: true` and surface in higher-traffic locations.

## Lorem ipsum, for body weight

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## Adding more entries

To add another project, drop a new Markdown file in `src/content/projects/` with the required frontmatter (see the schema in `src/content.config.ts`). Pick the next `order` value. Decide whether it's featured. The build picks it up automatically — listing route, detail route, sitemap, RSS if you add one.

If you find yourself wanting to override layout for one specific entry, that's the signal that the entry shouldn't be in a collection at all — it should be a unique inline page in `src/pages/`. Collections are for things that share a shape.
