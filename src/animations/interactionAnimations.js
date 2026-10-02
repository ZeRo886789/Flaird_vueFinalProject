export function pulseElement(element) {
  if (!element || prefersReducedMotion()) return
  element.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.08)' },
      { transform: 'scale(1)' }
    ],
    { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' }
  )
}

export function revealOnScroll(selector = '[data-reveal]') {
  const nodes = document.querySelectorAll(selector)
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    nodes.forEach(n => n.classList.add('is-visible'))
    return () => {}
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  nodes.forEach(n => observer.observe(n))
  return () => observer.disconnect()
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
