export const pageTransition = {
  name: 'page',
  mode: 'out-in'
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
