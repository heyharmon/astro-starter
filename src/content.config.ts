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

/**
 * LOCATIONS collection
 * Each .md file in src/content/locations/ is a service-area landing page,
 * rendered at /locations/<slug>. Built to scale to many cities: all designed
 * sections are structured frontmatter so new cities are pure content adds.
 */
const locations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/locations" }),
  schema: z.object({
    title: z.string().describe("Page title — used in <title> tag"),
    description: z.string().describe("Meta description — used for SEO"),
    headline: z.string().describe("Hero headline"),
    subheadline: z
      .string()
      .optional()
      .describe("Hero supporting text below the headline"),
    city: z
      .string()
      .optional()
      .describe("City name — used for local SEO; omit for region-level pages"),
    state: z.string().default("Utah"),
    heroImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional()
      .describe("Hero image shown beside the headline"),
    bullets: z
      .array(z.string())
      .default([])
      .describe("Short proof points listed under the hero subheadline"),
    steps: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .default([])
      .describe("How-it-works steps (Schedule / Test / Get results)"),
    areasHeading: z
      .string()
      .optional()
      .describe("Heading for the areas-served list"),
    areas: z
      .array(z.string())
      .default([])
      .describe("Neighborhoods or cities served from this page"),
    includes: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .default([])
      .describe("What the inspection includes (air sampling, surface sampling, ...)"),
    pricing: z
      .string()
      .optional()
      .describe("Short pricing paragraph"),
    pricingHeading: z
      .string()
      .optional()
      .describe("Heading for the pricing section — defaults to a generic one"),
    pricingLink: z
      .object({ label: z.string(), href: z.string() })
      .optional()
      .describe("Optional 'learn more' link under the pricing paragraph"),
    signsHeading: z
      .string()
      .optional()
      .describe("Heading for the local mold-signs section"),
    signs: z
      .array(
        z.object({
          title: z.string(),
          text: z.string(),
          why: z
            .object({ label: z.string(), text: z.string() })
            .optional()
            .describe("The 🔎 callout — why this sign matters"),
          local: z
            .object({ label: z.string(), text: z.string() })
            .optional()
            .describe("The 🏡 callout — how it plays out in this city"),
        }),
      )
      .default([])
      .describe("Local mold signs (health symptoms, visible growth, water damage)"),
    signsImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional()
      .describe("Image shown beside the local mold-signs section"),
    valueCards: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .default([])
      .describe("Teal value cards (Unbiased / Accurate) shown as a row"),
    valueCardsImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional()
      .describe("Photo that sits alongside the value cards as the third cell"),
    trust: z
      .object({
        heading: z.string(),
        intro: z.string(),
        points: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
        image: z.object({ src: z.string(), alt: z.string() }).optional(),
      })
      .optional()
      .describe("'Why <city> trusts us' — floating white card over a photo band"),
    faqsHeading: z
      .string()
      .optional()
      .describe("Heading for the FAQ band"),
    cta: z
      .object({
        heading: z.string(),
        text: z.string(),
        image: z.object({ src: z.string(), alt: z.string() }).optional(),
      })
      .optional()
      .describe("Closing CTA — floating white card over a photo band"),
    molds: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .default([])
      .describe("Common local mold types with descriptions"),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([])
      .describe("FAQ items — also used for FAQ structured data later"),
    order: z.number().default(0).describe("Sort order in listings"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, projects, posts, locations };
