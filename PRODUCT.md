# Product

## Register

brand

## Users

Parents and caregivers researching early childhood care for a child aged 6 weeks to 5 years, usually on a phone, often late at night, comparing two or three local options. They are anxious, time-poor, and deciding who they trust with the most important thing in their life. The job to be done: feel confident enough about this one place to book a tour. Secondary audience: prospective educators and the studio re-skinning this base into client sites.

## Product Purpose

Maplewood Early Learning is a neighborhood daycare and preschool. This site exists to convert a worried parent into a tour booking by making the place feel warm, safe, known, and unhurried before they ever walk in. Success = the visitor books a tour or reaches out, and leaves believing their child would be *seen* here.

This repository is also a **theme-base**: one neutral foundation that five demo themes (Hearth, Beacon, Jubilee, Grove, Atelier) re-skin by changing only token values, fonts, and per-component presentation. Content, routing, and component prop APIs stay identical across every theme branch. The base must therefore be **structurally excellent but personality-neutral** — it sets the layout, hierarchy, rhythm, motion, and copy DNA all five themes inherit, while leaving color and typeface identity to the themes.

## Brand Personality

Warm, calm, trustworthy. The voice of a real director who knows every child's name, not a franchise. Specific over sentimental: concrete details (a 1:4 infant ratio, a daily photo journal, educators who stay) carry the warmth, not adjectives. Reassuring without overpromising. Unhurried.

## Anti-references

- **AI-template daycare site.** The thing this must not look like: a tiny uppercase tracked eyebrow above every single section, identical icon-heading-text card grids stamped down the page, one fade-up animation on everything, em-dash-laced copy, a cream/sand "warm-neutral" body background passed off as design.
- **Corporate childcare chain** (bright primary-color clip-art, stock-smile photography walls, "enroll now" urgency banners). Maplewood is the independent alternative to that.
- **Editorial-magazine affectation** (display-serif + italic drop caps + broadsheet rules) forced onto a brief that isn't a magazine.

## Design Principles

1. **Structure is the product here.** On this neutral base, "impeccable" means impeccable hierarchy, spacing rhythm, type contrast, composition variety, and motion that fits what it reveals — not a brand color. Color and fonts are the theme branches' job; do not give the base a fixed brand identity.
2. **Specific, not aphoristic.** Let concrete facts (ratios, hours, the photo journal, fifteen years) do the reassuring. Cut buzzwords, em-dashes, and the "serious statement, then punchy negation" cadence.
3. **Every section earns its own shape.** No single module stamped ten times. Vary the intro device, the alignment, the affordance (list vs card vs timeline), and the spacing so the page reads as a composed narrative, not a stack.
4. **Reassure at the decision moment.** This is a high-stakes, anxious choice. Peak-end matters: the hero and the closing tour CTA must feel calm and confident, and trust signals (ratios, licensing, testimonials, the founder) should land before the ask.
5. **Theme-swappable by construction.** Express every improvement through the token contract, scoped component CSS, and centralized content. Never hard-code a color/font/radius a theme would need to override; never change a component prop API or the `site-content.json` shape.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text ≥ 4.5:1, large/bold text ≥ 3:1 (the neutral base must hold contrast before themes tint it). Visible `:focus-visible` indicators on every interactive element. Honor `prefers-reduced-motion` for all motion (content is fully visible without JS; reveals only enhance an already-visible default). Keyboard-operable nav and FAQ (native `<details>`), labeled form fields, semantic heading order, descriptive image alt text, and 44px minimum touch targets.
