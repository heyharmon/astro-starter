/**
 * Content collections.
 *
 * The Maplewood base intentionally ships NO collections — all shared
 * content lives in src/data/site-content.json (plus nav/footer/site-meta),
 * which keeps it byte-identical across every theme branch.
 *
 * When a client needs a repeating, individually-addressable content type
 * (e.g. a blog/news section), define it here with a Zod schema and add
 * entries under src/content/<collection>/. See docs/content-collections.md.
 */
export const collections = {};
