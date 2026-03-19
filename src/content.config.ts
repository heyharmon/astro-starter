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
    title: z
      .string()
      .describe("Page title — used in <title> tag and as the main heading"),
    description: z
      .string()
      .describe("Meta description — used for SEO and social sharing"),
    headline: z
      .string()
      .describe("Hero headline — the large text shown at the top of the page"),
    subheadline: z
      .string()
      .optional()
      .describe("Hero subtext — supporting text below the headline"),
    featuredImage: z
      .object({
        src: z
          .string()
          .describe("Path to image file, e.g. /images/hero.jpg"),
        alt: z
          .string()
          .describe("Accessible alt text describing the image"),
      })
      .optional()
      .describe("Hero image — shown in hero section and used for social sharing"),
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
    title: z
      .string()
      .describe("Service name — displayed as the card title"),
    description: z
      .string()
      .describe("Short summary — shown on the services listing page"),
    icon: z
      .string()
      .describe("Emoji or icon identifier — displayed alongside the service title"),
    order: z
      .number()
      .describe("Sort order — lower numbers appear first on the services page"),
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
    title: z
      .string()
      .describe("Post title — shown as heading and in listings"),
    description: z
      .string()
      .describe("Post summary — shown in listings and used as meta description"),
    date: z
      .coerce.date()
      .describe("Publish date — used for sorting (newest first). Format: YYYY-MM-DD"),
    author: z
      .string()
      .default("Team")
      .describe("Author name — defaults to 'Team' if not specified"),
    tags: z
      .array(z.string())
      .default([])
      .describe("Tags for categorization — used for filtering and display"),
    image: z
      .object({
        src: z
          .string()
          .describe("Path to cover image, e.g. /images/blog/post-cover.jpg"),
        alt: z
          .string()
          .describe("Accessible alt text describing the cover image"),
      })
      .optional()
      .describe("Cover image — shown at top of post and in listings"),
    draft: z
      .boolean()
      .default(false)
      .describe("Set to true to hide from published listings"),
  }),
});

export const collections = { pages, services, blog };
