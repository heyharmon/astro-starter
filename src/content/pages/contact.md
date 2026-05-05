---
title: "Contact this page"
description: "How the contact page demonstrates a site config driven view."
headline: "Site config, rendered live"
subheadline: "This page reads from src/data/site-meta.json. The values rendered below are pulled directly from that file."
---

This page is a **site-config-driven view** — the third pattern. The route at `src/pages/contact.astro` imports `site-meta.json` and renders its fields directly, instead of pulling content from a Markdown file. Use this pattern when the values you want to render aren't really *content*; they're structural site data — names, URLs, social handles, IDs, copyright strings.

## Why this pattern

Two reasons. First, JSON is the right shape for key-value config that gets read by lots of components (header, footer, head). Second, it keeps templates focused on rendering — your `.astro` files don't get cluttered with hardcoded strings that should be edited centrally.

## What the page renders from config

The "Live config values" panel on this page shows fields read from `src/data/site-meta.json`:

- `name` — the site name (also rendered in the `<title>` tag and footer)
- `tagline` — short positioning line
- `social.twitter`, `social.linkedin`, `social.github` — outbound profile links
- `formspreeId` — passed to the React contact form so submissions go to the right Formspree endpoint

Edit the JSON file and rebuild. Every page that reads it picks up the new values.
