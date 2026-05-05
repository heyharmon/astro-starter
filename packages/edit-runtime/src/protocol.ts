export type Mode = 'off' | 'edit' | 'comment'

export type ElementContext = {
  route: string
  tag: string
  domPath: string
  semanticLandmark: string | null
  precedingText: string
  followingText: string
  parentText: string | null
  position: { indexInParent: number; totalSiblingsOfSameTag: number }
  attributes: Record<string, string>
}

export type DownMessage =
  | { type: 'agentic:hello'; nonce: string }
  | { type: 'agentic:mode'; mode: Mode }

export type UpMessage =
  | { type: 'agentic:ready'; nonce: string; route: string }
  | {
      type: 'agentic:edit_committed'
      textBefore: string
      textAfter: string
      elementContext: ElementContext
    }
  | {
      type: 'agentic:comment_submitted'
      comment: string
      targetText: string
      elementContext: ElementContext
    }
  | { type: 'agentic:nav'; pathname: string }
