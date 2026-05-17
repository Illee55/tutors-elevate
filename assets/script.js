(function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('is-open'));
    });
  }

  // Active section highlighting in nav
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  // Cookie banner
  const COOKIE_KEY = 'te-cookie-pref';
  const banner = document.querySelector('.cookie');
  if (banner && !localStorage.getItem(COOKIE_KEY)) {
    requestAnimationFrame(() => banner.classList.add('is-visible'));
    banner.querySelectorAll('[data-cookie]').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, btn.dataset.cookie);
        banner.classList.remove('is-visible');
      });
    });
  }

  // Contact form -> mailto
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lines = [];
      const fields = [
        ['Parent name', 'parent'],
        ['Child name', 'child'],
        ['Year group', 'year'],
        ['Subject(s) of interest', 'subjects'],
        ['Exam board', 'board'],
        ['Preferred contact', 'contact_method'],
        ['Best time to reach', 'best_time'],
      ];
      fields.forEach(([label, key]) => {
        const v = data.get(key);
        if (v) lines.push(label + ': ' + v);
      });
      const note = data.get('note');
      if (note) { lines.push(''); lines.push('What you’d like help with:'); lines.push(note); }

      const subject = 'Free consultation request — ' + (data.get('child') || data.get('parent') || 'New enquiry');
      const body = lines.join('\n');
      const mail = 'mailto:hello@tutorselevate.co.uk'
        + '?subject=' + encodeURIComponent(subject)
        + '&body='   + encodeURIComponent(body);
      window.location.href = mail;
    });
  }

  // Footer year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
