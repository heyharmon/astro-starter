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
    draft: z
      .boolean()
      .default(false)
      .describe("Draft content not yet approved — set to true during content drafting stage"),
  }),
});

/**
 * PROJECTS collection
 * Each .md file in src/content/projects/ represents a completed project.
 * The markdown body is used as the project's detailed description on its individual page.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z
      .string()
      .describe("Project name — displayed as the card title"),
    description: z
      .string()
      .describe("Short summary — shown on project cards"),
    client: z
      .string()
      .optional()
      .describe("Client name — shown on the project detail page"),
    location: z
      .string()
      .optional()
      .describe("Project location — shown on the project detail page"),
    image: z
      .object({
        src: z
          .string()
          .describe("Path to project image, e.g. /images/projects/hospital.jpg"),
        alt: z
          .string()
          .describe("Accessible alt text describing the image"),
      })
      .optional()
      .describe("Project image — shown on card and detail page"),
    order: z
      .number()
      .describe("Sort order — lower numbers appear first"),
    featured: z
      .boolean()
      .default(false)
      .describe("Set to true to show on the homepage featured projects section"),
    draft: z
      .boolean()
      .default(false)
      .describe("Draft projects are hidden from production builds"),
  }),
});

/**
 * POSTS collection
 * Each .md file in src/content/posts/ represents a single blog post.
 * The filename (without extension) becomes the URL slug at /blog/<slug>.
 */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z
      .string()
      .describe("Post title — used in <title> tag and as the main heading"),
    description: z
      .string()
      .describe("Short summary — shown in listings and used for SEO"),
    date: z
      .coerce.date()
      .describe("Publication date — used for sorting and display"),
    author: z
      .string()
      .optional()
      .describe("Author name — shown on the post detail page"),
    tags: z
      .array(z.string())
      .default([])
      .describe("Tags — used for grouping and display on the post"),
    featuredImage: z
      .object({
        src: z
          .string()
          .describe("Path to image file, e.g. /images/blog/post.jpg"),
        alt: z
          .string()
          .describe("Accessible alt text describing the image"),
      })
      .optional()
      .describe("Featured image — shown on the post and used for social sharing"),
    draft: z
      .boolean()
      .default(false)
      .describe("Draft posts are hidden from production builds"),
  }),
});

export const collections = { pages, projects, posts };
