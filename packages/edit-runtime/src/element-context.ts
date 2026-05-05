import type { ElementContext } from './protocol'

const CONTEXT_TEXT_LIMIT = 120
const PARENT_TEXT_LIMIT = 200
const KEEP_ATTRIBUTES = ['id', 'class', 'role', 'aria-label']
const KEEP_DATA_PREFIX = 'data-cms-'

export function buildElementContext(node: Element): ElementContext {
  return {
    route: window.location.pathname + window.location.search,
    tag: node.tagName.toLowerCase(),
    domPath: domPath(node),
    semanticLandmark: nearestLandmark(node),
    precedingText: surroundingText(node, 'before', CONTEXT_TEXT_LIMIT),
    followingText: surroundingText(node, 'after', CONTEXT_TEXT_LIMIT),
    parentText: parentBlockText(node, PARENT_TEXT_LIMIT),
    position: positionAmongSiblings(node),
    attributes: filteredAttributes(node),
  }
}

function domPath(node: Element): string {
  const segments: string[] = []
  let current: Element | null = node
  while (current && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase()
    const parent = current.parentElement
    if (!parent) {
      segments.unshift(tag)
      break
    }
    const sameTag = Array.from(parent.children).filter(
      (c) => c.tagName === current!.tagName,
    )
    if (sameTag.length === 1) {
      segments.unshift(tag)
    } else {
      const index = sameTag.indexOf(current) + 1
      segments.unshift(`${tag}:nth-of-type(${index})`)
    }
    current = parent
  }
  return segments.join(' > ')
}

function nearestLandmark(node: Element): string | null {
  const SELECTORS = [
    'main',
    'article',
    'section',
    'nav',
    'header',
    'footer',
    'aside',
    '[role="main"]',
    '[role="region"]',
    '[role="navigation"]',
    '[role="banner"]',
    '[role="contentinfo"]',
  ]
  let current: Element | null = node.parentElement
  while (current && current !== document.body) {
    for (const sel of SELECTORS) {
      if (current.matches(sel)) {
        const id = current.id ? `#${current.id}` : ''
        const ariaLabel = current.getAttribute('aria-label')
        const role = current.getAttribute('role')
        const tag = current.tagName.toLowerCase()
        const label = ariaLabel ? ` aria-label="${ariaLabel}"` : ''
        const roleAttr = role ? ` role="${role}"` : ''
        return `<${tag}${id}${roleAttr}${label}>`
      }
    }
    current = current.parentElement
  }
  return null
}

function surroundingText(
  node: Element,
  direction: 'before' | 'after',
  limit: number,
): string {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (textNode) => {
        const text = textNode.textContent
        if (!text || !text.trim()) return NodeFilter.FILTER_REJECT
        if (node.contains(textNode)) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    },
  )

  const collected: string[] = []
  let foundNode = false

  let textNode: Node | null
  while ((textNode = walker.nextNode())) {
    const cmp = node.compareDocumentPosition(textNode)
    const isBefore = (cmp & Node.DOCUMENT_POSITION_PRECEDING) !== 0
    const isAfter = (cmp & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

    if (direction === 'before' && isBefore) {
      collected.push(textNode.textContent!.trim())
    } else if (direction === 'after' && isAfter) {
      collected.push(textNode.textContent!.trim())
      foundNode = true
    }

    if (direction === 'after' && foundNode && joinedLength(collected) >= limit) {
      break
    }
  }

  let joined =
    direction === 'before'
      ? collected.slice(-8).join(' ')
      : collected.join(' ')

  joined = joined.replace(/\s+/g, ' ').trim()

  if (direction === 'before' && joined.length > limit) {
    joined = '…' + joined.slice(-limit)
  } else if (direction === 'after' && joined.length > limit) {
    joined = joined.slice(0, limit) + '…'
  }

  return joined
}

function joinedLength(parts: string[]): number {
  let n = 0
  for (const p of parts) n += p.length + 1
  return n
}

function parentBlockText(node: Element, limit: number): string | null {
  const parent = node.parentElement
  if (!parent) return null

  const blockTags = new Set(['ul', 'ol', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'div'])
  if (!blockTags.has(parent.tagName.toLowerCase())) return null

  const text = (parent.textContent || '').replace(/\s+/g, ' ').trim()
  if (!text) return null
  return text.length > limit ? text.slice(0, limit) + '…' : text
}

function positionAmongSiblings(node: Element): {
  indexInParent: number
  totalSiblingsOfSameTag: number
} {
  const parent = node.parentElement
  if (!parent) return { indexInParent: 0, totalSiblingsOfSameTag: 1 }

  const sameTag = Array.from(parent.children).filter(
    (c) => c.tagName === node.tagName,
  )
  return {
    indexInParent: sameTag.indexOf(node),
    totalSiblingsOfSameTag: sameTag.length,
  }
}

function filteredAttributes(node: Element): Record<string, string> {
  const out: Record<string, string> = {}
  for (const attr of Array.from(node.attributes)) {
    const name = attr.name.toLowerCase()
    if (KEEP_ATTRIBUTES.includes(name) || name.startsWith(KEEP_DATA_PREFIX)) {
      out[name] = attr.value
    }
  }
  return out
}
