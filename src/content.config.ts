import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * PAGES collection
 * Stores content for static pages (home, about, services intro, contact intro).
 * Each .md file in src/content/pages/ becomes a page entry.
 * The filename (without extension) is the page ID used with getEntry().
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    // Page title — used in <title> tag and as the main heading
    title: z.string(),
    // Meta description — used for SEO and social sharing
    description: z.string(),
    // Hero headline — the large text shown at the top of the page
    headline: z.string(),
    // Hero subtext — supporting text below the headline
    subheadline: z.string().optional(),
    // Featured image — shown in hero section and social sharing
    featuredImage: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
  }),
});

/**
 * SERVICES collection
 * Each .md file in src/content/services/ represents a single service offering.
 * The markdown body is used as the service's detailed description.
 */
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    // Service name — displayed as the card title
    title: z.string(),
    // Short summary — shown on the services listing page
    description: z.string(),
    // Emoji or icon identifier — displayed alongside the service title
    icon: z.string(),
    // Sort order — lower numbers appear first on the services page
    order: z.number(),
  }),
});

/**
 * BLOG collection
 * Each .md file in src/content/blog/ is a blog post.
 * Posts with draft: true are excluded from the published listing.
 * The filename (without extension) becomes the URL slug.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    // Post title — shown as heading and in listings
    title: z.string(),
    // Post summary — shown in listings and meta description
    description: z.string(),
    // Publish date — used for sorting (newest first). Format: YYYY-MM-DD
    date: z.coerce.date(),
    // Author name
    author: z.string().default("Team"),
    // Tags for categorization — used for filtering
    tags: z.array(z.string()).default([]),
    // Cover image — shown at top of post and in listings
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    // Set to true to hide from published listings (useful for drafts and templates)
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, services, blog };
