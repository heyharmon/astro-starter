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
    subtitle: z
      .string()
      .optional()
      .describe("Hero subtitle on the detail page, e.g. 'Luxury Golf Village Condos'"),
    intro: z
      .string()
      .optional()
      .describe("Lead paragraph opening the 'About the project' section on the detail page"),
    client: z
      .string()
      .optional()
      .describe("Client name — shown on the project detail page"),
    location: z
      .string()
      .optional()
      .describe("Project location — shown in the detail page meta sidebar"),
    jobType: z
      .string()
      .optional()
      .describe("Scope of work label — shown in the detail page meta sidebar, e.g. 'Stairs & Railings'"),
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
      .describe("Card image — shown on the index grid (may carry branding/overlay)"),
    heroImage: z
      .object({
        src: z.string().describe("Path to a clean full-bleed hero image"),
        alt: z.string().describe("Accessible alt text"),
      })
      .optional()
      .describe("Detail page hero background — a clean photo with no baked-in text. Falls back to `image`."),
    scope: z
      .array(z.string())
      .default([])
      .describe("Bullet list of work performed — shown under the intro on the detail page"),
    sections: z
      .array(
        z.object({
          heading: z.string().describe("Narrative block heading"),
          body: z.string().describe("Narrative block paragraph(s)"),
          images: z
            .array(
              z.object({
                src: z.string().describe("Path to a photo shown under this section"),
                alt: z.string().describe("Accessible alt text"),
              }),
            )
            .optional()
            .describe(
              "Photos shown directly after this section's copy. When present, these override the auto-split of the top-level `gallery` for this section, letting each section own an uneven number of photos (matching the source site's per-heading groups).",
            ),
          video: z
            .object({
              src: z.string().describe("Path to a self-hosted video, e.g. /images/eaglepoint/hero-video.mp4"),
              poster: z.string().optional().describe("Poster image shown before the video plays"),
            })
            .optional()
            .describe("Optional autoplay/looping muted clip shown after this section's copy, before its photos"),
        }),
      )
      .default([])
      .describe("Narrative story blocks shown below the intro on the detail page"),
    gallery: z
      .array(
        z.object({
          src: z.string().describe("Path to gallery image"),
          alt: z.string().describe("Accessible alt text"),
        }),
      )
      .default([])
      .describe("Photo gallery shown near the bottom of the detail page"),
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

export const collections = { pages, projects };
