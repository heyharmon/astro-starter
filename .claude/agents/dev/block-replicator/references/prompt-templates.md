# Block Replicator Reference

Supplementary prompts and troubleshooting for the block replication workflow.

## Alternative Prompts

### Quick Visual Analysis (Simpler Version)

Use when the full prompt feels like overkill:

```
Describe this UI block for HTML/CSS replication:

1. Layout: flex or grid? direction? alignment?
2. Colors: list all hex values (backgrounds, text, borders)
3. Typography: fonts, sizes, weights for each text element
4. Spacing: padding and gaps in pixels
5. Effects: shadows, borders, border-radius

Be specific with pixel values and hex colors.
```

### Typography-Only Analysis

Use when fonts are the main concern:

```
Analyze only the typography in this block:

For each text element:
- Role (heading, body, label, etc.)
- Font family (best guess + alternatives)
- Size in pixels
- Weight (400, 500, 600, 700, etc.)
- Line height
- Letter spacing
- Color (hex)

Note the typographic hierarchy and any unusual styling.
```

### Color-Only Extraction

Use when you need precise color matching:

```
Extract every color from this UI block:

For each color:
- What uses it (background, text, border, shadow)
- Hex value
- If gradient: direction and stops
- If transparent: rgba value

Pay special attention to subtle grays.
```

## Troubleshooting

### Colors Look Different

**Problem**: Implemented colors don't match reference
**Causes**:
- Screenshot color profile differs from sRGB
- Monitor calibration differences
- JPEG compression shifted colors

**Fixes**:
- Use DevTools eyedropper on live site, not screenshot
- Check if site uses CSS custom properties and extract those
- Test in same browser as reference

### Fonts Don't Match

**Problem**: Same font family looks different
**Causes**:
- Wrong font weight (500 vs 600 is noticeable)
- Different font-smoothing settings
- Font not actually loading (fallback showing)

**Fixes**:
- Verify exact weight from DevTools
- Add `-webkit-font-smoothing: antialiased`
- Check Network tab to confirm font file loads
- Use Google Fonts embed with correct weights

### Spacing Feels Off

**Problem**: Measurements match but spacing looks wrong
**Causes**:
- Line-height affecting vertical rhythm
- Margin collapse behavior
- Different box-sizing

**Fixes**:
- Use `gap` instead of margins in flex containers
- Check line-height on all text elements
- Ensure `box-sizing: border-box` is set

### Shadows Look Flat

**Problem**: Shadow doesn't have same depth
**Causes**:
- Missing layered shadows (many designs use 2-3)
- Wrong blur/spread ratio
- Color too dark or light

**Fixes**:
- Check for multiple box-shadow values in original
- Typical layered shadow: `0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)`
- Use rgba with low opacity, not solid colors

### Hover States Missing Smoothness

**Problem**: Hover works but feels abrupt
**Causes**:
- Missing transition property
- Wrong easing function
- Transition too fast/slow

**Fixes**:
- Add `transition: all 200ms ease-in-out` as baseline
- Match original timing from interaction analysis
- Common durations: 150ms (snappy), 200ms (smooth), 300ms (deliberate)

## Tailwind Arbitrary Value Reference

For pixel-perfect matching, use arbitrary values:

```html
<!-- Exact sizing -->
<div class="w-[347px] h-[52px] p-[18px] gap-[14px]">

<!-- Exact colors -->
<div class="bg-[#1a1b23] text-[#f5f5f7] border-[#2a2b33]">

<!-- Exact typography -->
<p class="text-[17px] leading-[1.4] tracking-[0.02em] font-[450]">

<!-- Exact effects -->
<div class="rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">

<!-- Exact positioning -->
<div class="top-[72px] left-[50%] translate-x-[-50%]">
```

## Common Tailwind Gotchas

### Shadow Syntax
```html
<!-- Wrong - won't work -->
<div class="shadow-[0 4px 12px rgba(0,0,0,0.1)]">

<!-- Correct - underscores for spaces -->
<div class="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
```

### Multiple Shadows
```html
<!-- Use commas, underscores for spaces -->
<div class="shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.08)]">
```

### Gradients
```html
<!-- Simple linear gradient -->
<div class="bg-gradient-to-r from-[#hex1] to-[#hex2]">

<!-- Complex gradient - use custom CSS instead -->
<style>
.custom-gradient {
  background: linear-gradient(135deg, #hex1 0%, #hex2 50%, #hex3 100%);
}
</style>
```

### When to Use Custom CSS

Tailwind arbitrary values work for most cases, but use custom CSS for:
- Multi-stop gradients
- Multiple layered shadows
- Complex animations with keyframes
- Pseudo-element content
- backdrop-filter with multiple effects
- Clip-path shapes
