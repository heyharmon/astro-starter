import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * PROJECTS collection
 * Each .md file in src/content/projects/ is one project. The filename (without
 * extension) becomes the URL slug at /projects/<slug>. The markdown body is the
 * "About the project" copy. Everything a project detail page needs is here, so
 * adding a new project is just adding another .md file — the shared template in
 * src/pages/projects/[...slug].astro renders it.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z
      .string()
      .describe("Full project name — the detail-page heading, e.g. 'Black Desert – Golf Village'"),
    location: z
      .string()
      .optional()
      .describe("Location line above the title, e.g. 'Ivins, Utah'"),
    description: z
      .string()
      .describe("Intro paragraph shown in the hero, and used for SEO/social"),
    heroImage: z
      .object({
        src: z.string().describe("Path to the large hero image below the intro"),
        alt: z.string().describe("Accessible alt text"),
      })
      .optional()
      .describe("Hero image shown full-width under the intro text"),
    stats: z
      .array(
        z.object({
          label: z.string().describe("Stat label, e.g. 'Project Cost'"),
          value: z.string().describe("Stat value, e.g. '$41.8M'"),
        }),
      )
      .default([])
      .describe("Key facts shown in the stats band (label + value pairs)"),
    gallery: z
      .array(
        z.object({
          src: z.string().describe("Path to the gallery image"),
          alt: z.string().describe("Accessible alt text"),
          wide: z
            .boolean()
            .default(false)
            .describe("Set true to span the full width (2 columns) in the gallery grid"),
        }),
      )
      .default([])
      .describe("Photo gallery shown at the bottom of the detail page"),
    order: z
      .number()
      .default(0)
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
 * SERVICES collection
 * Each .md file in src/content/services/ is one service. The filename (without
 * extension) becomes the URL slug at /services/<slug>. The shared template in
 * src/pages/services/[...slug].astro renders every section from frontmatter, so
 * adding a service is just adding another .md file. Sections: hero, intro, a
 * grid of feature blocks, an optional "steps" list, a "why us" block, and a
 * closing CTA.
 */
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string().describe("Eyebrow label above the hero tagline, e.g. 'General Contracting'"),
    tagline: z.string().describe("Large hero headline"),
    description: z.string().describe("Meta description — used for SEO and social sharing"),
    heroImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional()
      .describe("Full-bleed hero background image"),
    ctaLabel: z.string().default("Get in touch").describe("Hero button label — links to /contact"),
    intro: z
      .object({ heading: z.string(), body: z.string() })
      .describe("Intro block below the hero — heading + paragraph"),
    features: z
      .array(
        z.object({
          heading: z.string(),
          body: z.string(),
          image: z.object({ src: z.string(), alt: z.string() }).optional(),
        }),
      )
      .default([])
      .describe("Feature blocks — alternating image + heading + body"),
    steps: z
      .object({
        heading: z.string(),
        intro: z.string().optional(),
        items: z.array(z.object({ title: z.string(), body: z.string() })),
      })
      .optional()
      .describe("Optional numbered process list (heading + intro + items)"),
    why: z
      .object({
        heading: z.string(),
        intro: z.string().optional(),
        items: z.array(z.object({ heading: z.string(), body: z.string() })),
      })
      .optional()
      .describe("'Why us' block — heading + intro + labelled items"),
    cta: z
      .object({ heading: z.string(), body: z.string().optional(), label: z.string().default("Get in touch") })
      .describe("Closing call-to-action band — links to /contact"),
    order: z.number().default(0).describe("Sort order — lower numbers appear first"),
    draft: z.boolean().default(false).describe("Draft services are hidden from production builds"),
  }),
});

export const collections = { projects, services };
