export function countUp(el, target, suffix = '', duration = 1400) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initCountUpStats() {
  const stats = document.querySelectorAll('.stat-num[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countUp(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

export function staggerIn(elements, baseDelay = 0, step = 70) {
  elements.forEach((el, i) => {
    el.style.animationDelay = `${baseDelay + i * step}ms`;
    el.classList.add('slide-in-right');
  });
}
