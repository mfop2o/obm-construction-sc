import { useEffect } from 'react'

/* ============================================================================
   useDocumentMeta — per-page SEO control.
   Sets the document <title>, meta description and the primary Open Graph
   tags whenever the page mounts. Restores sensible defaults on unmount.
   ========================================================================== */

interface DocumentMeta {
  /** Full page title. */
  title: string
  /** Meta description (recommended ~150–160 chars). */
  description?: string
  /** Optional og:title — defaults to `title` minus the brand suffix. */
  ogTitle?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const DEFAULT_TITLE = 'OBM Construction S.C.'

export function useDocumentMeta({ title, description, ogTitle }: DocumentMeta) {
  useEffect(() => {
    document.title = title

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
    }

    if (ogTitle) {
      upsertMeta('property', 'og:title', ogTitle)
    }

    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title, description, ogTitle])
}
