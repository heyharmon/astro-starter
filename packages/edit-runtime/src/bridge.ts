import { buildElementContext } from './element-context'
import type { DownMessage, Mode, UpMessage } from './protocol'

const EDITABLE_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'li', 'a', 'button', 'span', 'td', 'th', 'caption', 'blockquote', 'figcaption',
])

const INLINE_FORMATTING = new Set([
  'strong', 'em', 'b', 'i', 'u', 'code', 'mark', 'small', 'sub', 'sup', 'br',
])

const HOVER_CLASS = '_acE'
const ACTIVE_CLASS = '_acE-on'
const POP_CLASS = '_acP'
const POP_HEADER_CLASS = '_acP-h'
const POP_TEXTAREA_CLASS = '_acP-t'
const POP_ACTIONS_CLASS = '_acP-a'
const POP_HINT_CLASS = '_acP-k'
const STYLE_ID = '_acE-styles'

// Debounce blur→commit by 500ms per element. Click-type-click-type bursts on
// the same element collapse into a single dispatch with the user's latest text.
// A click on a *different* element flushes any pending dispatches immediately.
const COMMIT_DEBOUNCE_MS = 500

type BridgeState = {
  mode: Mode
  parentOrigin: string | null
  nonce: string | null
  popoverEl: HTMLDivElement | null
  popoverTarget: Element | null
  activeNode: Element | null
  activeBefore: string | null
}

type PendingEdit = { node: HTMLElement; before: string; timer: number }

const state: BridgeState = {
  mode: 'off',
  parentOrigin: null,
  nonce: null,
  popoverEl: null,
  popoverTarget: null,
  activeNode: null,
  activeBefore: null,
}

const pendingEdits = new Map<HTMLElement, PendingEdit>()

export function mountBridge(): void {
  if (window.parent === window) return
  if ((window as any).__agenticEditBridgeMounted) return
  ;(window as any).__agenticEditBridgeMounted = true

  injectStyles()

  window.addEventListener('message', onParentMessage)
  window.addEventListener('beforeunload', () => {
    flushAllPending()
    sendUp({ type: 'agentic:nav', pathname: window.location.pathname })
  })

  // Announce ready. The parent will respond with hello + mode.
  // We post to '*' for the announce because we haven't received the parent's
  // origin yet; once we have it, every subsequent message is targeted.
  window.parent.postMessage(
    { type: 'agentic:ready', nonce: '', route: window.location.pathname },
    '*',
  )
}

function onParentMessage(e: MessageEvent): void {
  const data = e.data as DownMessage | undefined
  if (!data || typeof data !== 'object') return
  if (typeof data.type !== 'string' || !data.type.startsWith('agentic:')) return

  // Capture the parent origin from the first hello.
  if (data.type === 'agentic:hello') {
    state.parentOrigin = e.origin
    state.nonce = data.nonce
    sendUp({
      type: 'agentic:ready',
      nonce: data.nonce,
      route: window.location.pathname,
    })
    return
  }

  // Reject messages from unknown origins after handshake.
  if (state.parentOrigin && e.origin !== state.parentOrigin) return

  if (data.type === 'agentic:mode') {
    setMode(data.mode)
  }
}

function setMode(mode: Mode): void {
  if (mode === state.mode) return
  teardownActive()
  flushAllPending()
  removeAffordances()
  state.mode = mode

  if (mode === 'edit' || mode === 'comment') {
    applyAffordances()
  }
}

function applyAffordances(): void {
  const nodes = collectEditable()
  for (const node of nodes) {
    node.classList.add(HOVER_CLASS)
    if (state.mode === 'edit') {
      node.addEventListener('click', onEditClick as EventListener)
    } else if (state.mode === 'comment') {
      node.addEventListener('click', onCommentClick as EventListener)
    }
  }
}

function removeAffordances(): void {
  document.querySelectorAll('.' + HOVER_CLASS).forEach((node) => {
    node.classList.remove(HOVER_CLASS, ACTIVE_CLASS)
    node.removeEventListener('click', onEditClick as EventListener)
    node.removeEventListener('click', onCommentClick as EventListener)
    if ((node as HTMLElement).isContentEditable) {
      ;(node as HTMLElement).removeAttribute('contenteditable')
    }
  })
  closePopover()
}

function collectEditable(): Element[] {
  const out: Element[] = []
  const candidates = document.body.querySelectorAll<HTMLElement>(
    Array.from(EDITABLE_TAGS).join(','),
  )
  for (const node of Array.from(candidates)) {
    if (!isTextLeaf(node)) continue
    if (isInsideHydratedIsland(node)) continue
    if (isInsidePopover(node)) continue
    out.push(node)
  }
  return out
}

function isTextLeaf(node: Element): boolean {
  if (!node.textContent || !node.textContent.trim()) return false
  for (const child of Array.from(node.children)) {
    if (!INLINE_FORMATTING.has(child.tagName.toLowerCase())) return false
  }
  return true
}

function isInsideHydratedIsland(node: Element): boolean {
  // Astro wraps hydrated React/Vue/Svelte islands in <astro-island>.
  // Editing these is the contenteditable+reconciler risk; skip for the spike.
  return node.closest('astro-island') !== null
}

function isInsidePopover(node: Element): boolean {
  return state.popoverEl ? state.popoverEl.contains(node) : false
}

function onEditClick(e: Event): void {
  const node = e.currentTarget as HTMLElement
  if (state.activeNode && state.activeNode !== node) {
    commitActive()
  }
  // Clicking a *different* element flushes any other elements' pending edits
  // immediately so the order user sees in chat matches the order they edited.
  flushAllPendingExcept(node)
  if (node.isContentEditable) return

  // If this element has a pending debounced commit, we're inside the burst
  // window — take over its captured before-text instead of recapturing the
  // current (already-typed) innerText.
  const pending = pendingEdits.get(node)
  let before: string
  if (pending) {
    clearTimeout(pending.timer)
    pendingEdits.delete(node)
    before = pending.before
  } else {
    before = node.innerText
  }

  state.activeNode = node
  state.activeBefore = before
  // Astro/JSX templates leave \n + indent in the boundary text nodes
  // (e.g. `<h1>\n  This homepage…\n</h1>`). Under `white-space: normal`
  // those collapse, but the UA stylesheet flips contenteditable to
  // `white-space-collapse: preserve`, making the leading newline render
  // as a visible empty line and the trailing space sit at the end —
  // which also makes a stray click+blur diff against the (collapsed)
  // captured `before` and fire a no-op `edit_committed`. Normalize the
  // boundary text nodes so the editable view matches what was rendered.
  trimBoundaryWhitespace(node)
  node.setAttribute('contenteditable', 'plaintext-only')
  node.classList.add(ACTIVE_CLASS)
  node.focus()
  placeCaretAtEnd(node)

  node.addEventListener('blur', onEditableBlur, { once: true })
  node.addEventListener('keydown', onEditableKeyDown)
}

function onEditableKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    e.preventDefault()
    cancelActive()
  } else if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).blur()
  }
}

function onEditableBlur(): void {
  commitActive()
}

function commitActive(): void {
  const node = state.activeNode as HTMLElement | null
  const before = state.activeBefore
  state.activeNode = null
  state.activeBefore = null

  if (!node || before === null) return

  node.removeEventListener('keydown', onEditableKeyDown)
  node.removeAttribute('contenteditable')
  node.classList.remove(ACTIVE_CLASS)

  // Drop a no-op blur immediately — no diff means nothing to debounce.
  if (node.innerText === before) return

  // Replace any prior pending entry for this node so the burst keeps the
  // earliest captured before-text but rolls forward the timer.
  const prior = pendingEdits.get(node)
  if (prior) clearTimeout(prior.timer)
  const timer = window.setTimeout(() => flushPending(node), COMMIT_DEBOUNCE_MS)
  pendingEdits.set(node, { node, before, timer })
}

function flushPending(node: HTMLElement): void {
  const pending = pendingEdits.get(node)
  if (!pending) return
  clearTimeout(pending.timer)
  pendingEdits.delete(node)

  const after = node.innerText
  if (after === pending.before) return

  const elementContext = buildElementContext(node)
  sendUp({
    type: 'agentic:edit_committed',
    textBefore: pending.before,
    textAfter: after,
    elementContext,
  })
}

function flushAllPending(): void {
  for (const node of Array.from(pendingEdits.keys())) {
    flushPending(node)
  }
}

function flushAllPendingExcept(node: HTMLElement): void {
  for (const other of Array.from(pendingEdits.keys())) {
    if (other !== node) flushPending(other)
  }
}

function cancelActive(): void {
  const node = state.activeNode as HTMLElement | null
  const before = state.activeBefore
  state.activeNode = null
  state.activeBefore = null

  if (!node || before === null) return
  node.removeEventListener('keydown', onEditableKeyDown)
  node.removeAttribute('contenteditable')
  node.classList.remove(ACTIVE_CLASS)
  node.innerText = before
}

function onCommentClick(e: Event): void {
  e.preventDefault()
  e.stopPropagation()
  const node = e.currentTarget as Element
  openPopover(node)
}

function openPopover(target: Element): void {
  closePopover()
  state.popoverTarget = target

  const rect = target.getBoundingClientRect()

  const popover = document.createElement('div')
  popover.className = POP_CLASS
  popover.innerHTML =
    `<div class="${POP_HEADER_CLASS}">Comment on this element</div>` +
    `<textarea class="${POP_TEXTAREA_CLASS}" placeholder="Describe the change you want here..."></textarea>` +
    `<div class="${POP_ACTIONS_CLASS}">` +
    `<span class="${POP_HINT_CLASS}" aria-hidden="true"><kbd>⌘</kbd><kbd>Return</kbd> to send</span>` +
    `<button type="button" data-action="cancel">Cancel</button>` +
    `<button type="button" data-action="submit">Send</button>` +
    `</div>`

  document.body.appendChild(popover)
  state.popoverEl = popover

  // Position relative to viewport, with a small gap below the element.
  const top = window.scrollY + rect.bottom + 8
  const left = window.scrollX + rect.left
  popover.style.top = `${top}px`
  popover.style.left = `${left}px`

  const ta = popover.querySelector(
    '.' + POP_TEXTAREA_CLASS,
  ) as HTMLTextAreaElement
  setTimeout(() => ta.focus(), 0)

  popover.addEventListener('click', (e) => {
    const action = (e.target as HTMLElement).getAttribute('data-action')
    if (action === 'cancel') {
      closePopover()
    } else if (action === 'submit') {
      submitComment()
    }
  })

  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      closePopover()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submitComment()
    }
  })
}

function submitComment(): void {
  const popover = state.popoverEl
  const target = state.popoverTarget
  if (!popover || !target) return

  const ta = popover.querySelector(
    '.' + POP_TEXTAREA_CLASS,
  ) as HTMLTextAreaElement
  const comment = ta.value.trim()
  if (!comment) return

  const elementContext = buildElementContext(target)
  sendUp({
    type: 'agentic:comment_submitted',
    comment,
    targetText: (target as HTMLElement).innerText.slice(0, 200),
    elementContext,
  })
  closePopover()
}

function closePopover(): void {
  if (state.popoverEl && state.popoverEl.parentNode) {
    state.popoverEl.parentNode.removeChild(state.popoverEl)
  }
  state.popoverEl = null
  state.popoverTarget = null
}

function teardownActive(): void {
  if (state.activeNode) {
    cancelActive()
  }
}

function trimBoundaryWhitespace(el: HTMLElement): void {
  // Walk every descendant text node and collapse runs of whitespace to
  // single spaces (matching `white-space: normal` rendering). The leading
  // text node also has its leading whitespace trimmed; the trailing text
  // node has its trailing whitespace trimmed.
  //
  // Why this is needed: Astro/JSX emits text nodes with embedded `\n  `
  // wherever the source wraps onto a new line — including between inline
  // children like <code>. Under `white-space: normal` those collapse to
  // single spaces invisibly, but the UA stylesheet flips contenteditable
  // to `white-space-collapse: preserve` and they suddenly render as
  // mid-paragraph line breaks.
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) textNodes.push(node as Text)

  if (textNodes.length === 0) return

  for (const t of textNodes) {
    const text = t.nodeValue ?? ''
    const collapsed = text.replace(/\s+/g, ' ')
    if (collapsed !== text) t.nodeValue = collapsed
  }

  const first = textNodes[0]
  const firstText = first.nodeValue ?? ''
  const firstTrimmed = firstText.replace(/^\s+/, '')
  if (firstTrimmed !== firstText) first.nodeValue = firstTrimmed

  const last = textNodes[textNodes.length - 1]
  const lastText = last.nodeValue ?? ''
  const lastTrimmed = lastText.replace(/\s+$/, '')
  if (lastTrimmed !== lastText) last.nodeValue = lastTrimmed
}

function placeCaretAtEnd(el: HTMLElement): void {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(range)
}

function sendUp(msg: UpMessage): void {
  const target = state.parentOrigin || '*'
  window.parent.postMessage(msg, target)
}

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return
  const e = HOVER_CLASS
  const a = ACTIVE_CLASS
  const p = POP_CLASS
  const ph = POP_HEADER_CLASS
  const pt = POP_TEXTAREA_CLASS
  const pa = POP_ACTIONS_CLASS
  const pk = POP_HINT_CLASS
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent =
    `.${e}{outline:1px dashed transparent;outline-offset:2px;cursor:pointer;transition:outline-color .12s}` +
    `.${e}:hover{outline-color:#6366f1b3}` +
    `.${a}{outline:2px solid #6366f1;outline-offset:2px;cursor:text}` +
    `.${p}{position:absolute;z-index:2147483647;min-width:320px;max-width:420px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;box-shadow:0 10px 30px #00000026;padding:12px;font:14px/1.4 system-ui,sans-serif;color:#18181b}` +
    `.${ph}{font-size:12px;color:#71717a;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}` +
    `.${pt}{width:100%;min-height:80px;box-sizing:border-box;border:1px solid #e4e4e7;border-radius:6px;padding:8px;font:inherit;resize:vertical;outline:0}` +
    `.${pt}:focus{border-color:#6366f1;box-shadow:0 0 0 3px #6366f126}` +
    `.${pa}{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin-top:8px}` +
    `.${pa} button{font:inherit;padding:6px 12px;border-radius:6px;border:1px solid #e4e4e7;background:#fff;cursor:pointer}` +
    `.${pa} button[data-action=submit]{background:#6366f1;color:#fff;border-color:#6366f1}` +
    `.${pa} button:hover{filter:brightness(1.05)}` +
    `.${pk}{margin-right:auto;font-size:11px;color:#a1a1aa;display:inline-flex;align-items:center;gap:4px}` +
    `.${pk} kbd{font:inherit;background:#f4f4f5;border:1px solid #e4e4e7;border-bottom-width:2px;border-radius:4px;padding:1px 5px;color:#52525b}`
  document.head.appendChild(style)
}
