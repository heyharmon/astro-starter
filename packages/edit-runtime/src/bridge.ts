import { buildElementContext } from './element-context'
import type { DownMessage, Mode, UpMessage } from './protocol'

const EDITABLE_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'li', 'a', 'button', 'span', 'td', 'th', 'caption', 'blockquote', 'figcaption',
])

const INLINE_FORMATTING = new Set([
  'strong', 'em', 'b', 'i', 'u', 'code', 'mark', 'small', 'sub', 'sup', 'br',
])

const HOVER_CLASS = 'agentic-editable'
const ACTIVE_CLASS = 'agentic-editable-active'
const STYLE_ID = 'agentic-edit-runtime-styles'

type BridgeState = {
  mode: Mode
  parentOrigin: string | null
  nonce: string | null
  popoverEl: HTMLDivElement | null
  popoverTarget: Element | null
  activeNode: Element | null
  activeBefore: string | null
}

const state: BridgeState = {
  mode: 'off',
  parentOrigin: null,
  nonce: null,
  popoverEl: null,
  popoverTarget: null,
  activeNode: null,
  activeBefore: null,
}

export function mountBridge(): void {
  if (window.parent === window) return
  if ((window as any).__agenticEditBridgeMounted) return
  ;(window as any).__agenticEditBridgeMounted = true

  injectStyles()

  window.addEventListener('message', onParentMessage)
  window.addEventListener('beforeunload', () => {
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
  if (node.isContentEditable) return

  state.activeNode = node
  state.activeBefore = node.innerText
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

  const after = node.innerText
  if (after === before) return

  const elementContext = buildElementContext(node)
  sendUp({
    type: 'agentic:edit_committed',
    textBefore: before,
    textAfter: after,
    elementContext,
  })
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
  popover.className = 'agentic-comment-popover'
  popover.innerHTML = `
    <div class="agentic-comment-popover__header">Comment on this element</div>
    <textarea class="agentic-comment-popover__textarea" placeholder="Describe the change you want here..."></textarea>
    <div class="agentic-comment-popover__actions">
      <button type="button" data-action="cancel">Cancel</button>
      <button type="button" data-action="submit">Send</button>
    </div>
  `

  document.body.appendChild(popover)
  state.popoverEl = popover

  // Position relative to viewport, with a small gap below the element.
  const top = window.scrollY + rect.bottom + 8
  const left = window.scrollX + rect.left
  popover.style.top = `${top}px`
  popover.style.left = `${left}px`

  const ta = popover.querySelector(
    '.agentic-comment-popover__textarea',
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
    '.agentic-comment-popover__textarea',
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
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
.${HOVER_CLASS} { outline: 1px dashed transparent; outline-offset: 2px; cursor: pointer; transition: outline-color 120ms; }
.${HOVER_CLASS}:hover { outline-color: rgb(99 102 241 / 0.7); }
.${ACTIVE_CLASS} { outline: 2px solid rgb(99 102 241); outline-offset: 2px; cursor: text; }
.agentic-comment-popover { position: absolute; z-index: 2147483647; min-width: 320px; max-width: 420px; background: white; border: 1px solid rgb(228 228 231); border-radius: 8px; box-shadow: 0 10px 30px rgb(0 0 0 / 0.15); padding: 12px; font: 14px/1.4 system-ui, sans-serif; color: rgb(24 24 27); }
.agentic-comment-popover__header { font-size: 12px; color: rgb(113 113 122); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.agentic-comment-popover__textarea { width: 100%; min-height: 80px; box-sizing: border-box; border: 1px solid rgb(228 228 231); border-radius: 6px; padding: 8px; font: inherit; resize: vertical; outline: none; }
.agentic-comment-popover__textarea:focus { border-color: rgb(99 102 241); box-shadow: 0 0 0 3px rgb(99 102 241 / 0.15); }
.agentic-comment-popover__actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
.agentic-comment-popover__actions button { font: inherit; padding: 6px 12px; border-radius: 6px; border: 1px solid rgb(228 228 231); background: white; cursor: pointer; }
.agentic-comment-popover__actions button[data-action="submit"] { background: rgb(99 102 241); color: white; border-color: rgb(99 102 241); }
.agentic-comment-popover__actions button:hover { filter: brightness(1.05); }
`.trim()
  document.head.appendChild(style)
}
