'use client'

import { useSyncExternalStore } from 'react'

/**
 * Developer credit. It is added in the browser after the page loads, so it is not part of the static HTML that
 * crawlers read first, and the link is nofollow so it passes no ranking value. (A crawler that fully renders
 * JavaScript could still see it; nothing visible to people can be made invisible to every crawler.)
 */
export function DevCredit() {
  // false while the static page is built and on the server, true in the browser
  const on = useSyncExternalStore(() => () => {}, () => true, () => false)
  if (!on) return null
  const host = ['www', 'calstins', 'com'].join('.')
  return (
    <p data-nosnippet className="text-xs text-ink-soft/80">
      Developed by{' '}
      <a href={`https://${host}`} target="_blank" rel="nofollow noopener noreferrer" className="font-semibold hover:text-primary">Calstins Ltd</a>
      {' '}(<a href={`https://${host}`} target="_blank" rel="nofollow noopener noreferrer" className="hover:text-primary">{host}</a>)
    </p>
  )
}
