// Theme initialization
(function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemPrefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);
  updateThemeMeta();
})();

function updateThemeMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  // Read the resolved background color to keep browser UI consistent
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
  if (meta) meta.setAttribute('content', bg);
}

window.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const setPressed = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
    };
    setPressed();

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setPressed();
      updateThemeMeta();
    });
  }

  // Print to PDF
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Active section highlighting (scroll spy) for large screens
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    const byId = id => navLinks.find(a => a.getAttribute('href') === `#${id}`);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = byId(entry.target.id);
          if (!link) return;
          navLinks.forEach(a => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1] });

    sections.forEach(sec => io.observe(sec));
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
