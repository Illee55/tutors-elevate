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

  // Contact form -> Formspree (AJAX, no page reload)
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending…';
      status.hidden = true;
      status.className = 'form-status';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          status.textContent = 'Thanks — your enquiry has been sent. We’ll be in touch within one working day.';
          status.classList.add('is-success');
          status.hidden = false;
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          const msg = (data.errors && data.errors.map(x => x.message).join(' ')) || 'Something went wrong. Please email qazii005.304@gmail.com instead.';
          status.textContent = msg;
          status.classList.add('is-error');
          status.hidden = false;
        }
      } catch (err) {
        status.textContent = 'Network error. Please email qazii005.304@gmail.com instead.';
        status.classList.add('is-error');
        status.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  }

  // Footer year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
