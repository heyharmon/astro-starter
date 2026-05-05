import { mountBridge } from './bridge'

export type { ElementContext, Mode, DownMessage, UpMessage } from './protocol'

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountBridge(), { once: true })
  } else {
    mountBridge()
  }
}
