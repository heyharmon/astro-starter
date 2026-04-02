---
name: vue-converter
description: Convert vanilla HTML/CSS/JS/Tailwind website blocks into Vue.js components using script setup syntax (no TypeScript). Use when users provide HTML sections, blocks, or components (hero sections, navbars, cards, footers, etc.) that need conversion to Vue SFCs. Handles Tailwind classes, custom CSS, animations, and JavaScript interactions. Triggers on requests like "convert to Vue", "make this a Vue component", or when HTML blocks are provided with Vue conversion context.
---

# Vue Converter

Convert HTML/CSS/JS/Tailwind blocks into Vue 3 Single File Components using `<script setup>` syntax. Never use TypeScript.

## Output Format

Always generate Vue SFCs with this structure:

```vue
<script setup>
// Imports first (if needed)
import { ref, computed, onMounted } from 'vue'

// Reactive state
const myState = ref(initialValue)

// Computed properties
const derivedValue = computed(() => /* ... */)

// Methods as const arrow functions
const handleClick = () => {
  // logic
}

// Lifecycle (if needed)
onMounted(() => {
  // initialization
})
</script>

<template>
  <!-- Single root element preferred, multi-root supported -->
</template>

<style scoped>
/* Custom CSS that can't be handled by Tailwind */
</style>
```

## Conversion Rules

### Template Conversion

| HTML | Vue |
|------|-----|
| `class="..."` | Keep as-is (Tailwind classes preserved) |
| `onclick="fn()"` | `@click="fn"` |
| `onmouseover="..."` | `@mouseover="..."` |
| `href="./page"` | `:href="'/page'"` or use `<RouterLink to="/page">` |
| `<a href="...">` | Keep for external links, `<RouterLink>` for internal |
| Static text | Keep as-is |
| `id="unique"` | Remove if only used for JS targeting |
| `style="..."` | Prefer Tailwind or scoped CSS |

### JavaScript → Script Setup

| Vanilla JS | Vue 3 Script Setup |
|------------|-------------------|
| `let x = value` | `const x = ref(value)` |
| `x = newValue` | `x.value = newValue` |
| `const x = value` (static) | `const x = value` (no ref needed) |
| `document.getElementById()` | Template refs: `const el = ref(null)` + `ref="el"` |
| `element.classList.toggle()` | Reactive class binding: `:class="{ active: isActive }"` |
| `element.style.x = y` | Reactive style: `:style="{ x: y }"` |
| `addEventListener()` | `@event="handler"` in template |
| `window.addEventListener()` | `onMounted()` + `onUnmounted()` cleanup |
| `setTimeout/setInterval` | Same, but clear in `onUnmounted()` |
| `fetch()` in script | Keep in async function, call from `onMounted()` or event |

### CSS Handling

1. **Tailwind classes**: Preserve exactly as provided
2. **Custom CSS**: Move to `<style scoped>`
3. **CSS variables**: Define in scoped style or keep global
4. **Animations/keyframes**: Place in `<style>` (not scoped) if global, or scoped if component-specific
5. **Hover/focus states**: Use Tailwind (`hover:`, `focus:`) or scoped CSS

### Props & Emits

If the block appears to be a reusable component:

```vue
<script setup>
// Props with defaults
const props = defineProps({
  title: {
    type: String,
    default: 'Default Title'
  },
  variant: {
    type: String,
    default: 'primary'
  }
})

// Events
const emit = defineEmits(['click', 'close'])

const handleClick = () => {
  emit('click')
}
</script>
```

### Hardcoded vs Dynamic Content

Analyze the block to determine:
- **Keep hardcoded**: Brand names, static navigation, footer text
- **Make props**: Content that varies per instance (titles, descriptions, CTAs)
- **Make slots**: Large content areas, nested components

For hero sections like the example, default to hardcoded unless user specifies otherwise.

## Common Patterns

### Conditional Classes

```vue
<!-- Tailwind with conditional -->
<div :class="[
  'base-classes',
  isActive ? 'active-classes' : 'inactive-classes'
]">

<!-- Object syntax -->
<div :class="{
  'opacity-100': isVisible,
  'opacity-0': !isVisible
}">
```

### Dynamic Styles

```vue
<div :style="{
  transform: `translateX(${offset}px)`,
  '--custom-prop': dynamicValue
}">
```

### Event Handling

```vue
<!-- Simple -->
<button @click="handleClick">

<!-- With argument -->
<button @click="handleClick(item.id)">

<!-- Event object -->
<button @click="handleClick($event)">

<!-- Modifiers -->
<button @click.prevent="handleSubmit">
<input @keyup.enter="submit">
```

### Template Refs

```vue
<script setup>
import { ref, onMounted } from 'vue'

const container = ref(null)

onMounted(() => {
  // Access DOM element
  container.value.scrollTo(0, 0)
})
</script>

<template>
  <div ref="container">...</div>
</template>
```

## Conversion Example

**Input HTML:**
```html
<section class="flex flex-col items-center gap-6 py-20">
  <h1 class="text-5xl font-bold">Welcome</h1>
  <button onclick="handleClick()" class="bg-blue-500 px-6 py-3 rounded">
    Get Started
  </button>
</section>
```

**Output Vue:**
```vue
<script setup>
const handleClick = () => {
  // TODO: Implement click logic
}
</script>

<template>
  <section class="flex flex-col items-center gap-6 py-20">
    <h1 class="text-5xl font-bold">Welcome</h1>
    <button 
      class="bg-blue-500 px-6 py-3 rounded"
      @click="handleClick"
    >
      Get Started
    </button>
  </section>
</template>
```

## Workflow

1. **Receive HTML block** — analyze structure, classes, inline JS
2. **Identify interactivity** — events, state changes, animations
3. **Determine component scope** — standalone section vs reusable component
4. **Convert template** — HTML → Vue template syntax
5. **Extract state** — identify reactive data needs
6. **Convert JS** — vanilla → Composition API
7. **Handle CSS** — preserve Tailwind, scope custom CSS
8. **Output SFC** — complete `.vue` file

## Notes

- Always use `<script setup>` syntax, never Options API
- Never use TypeScript — no type annotations, no `.ts` files
- Preserve all Tailwind arbitrary values: `text-[#1e1e1e]`, `pt-[196px]`
- Keep component focused — one section = one component
- Use semantic HTML elements from source
- External links stay as `<a>`, internal routes use `<RouterLink>` if in Vue Router context
