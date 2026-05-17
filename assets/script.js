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
          status.textContent = 'Thanks, your enquiry has been sent. We’ll be in touch within one working day.';
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

  // Testimonial carousel (auto-rotate every 3s, pause on hover)
  const carousel = document.querySelector('.testimonial-carousel');
  const dotsBox  = document.querySelector('.carousel-dots');
  if (carousel) {
    const items = Array.from(carousel.querySelectorAll('.testimonial'));
    let current = 0;
    let timer = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (dotsBox) {
      items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        dot.addEventListener('click', () => { show(i); restart(); });
        dotsBox.appendChild(dot);
      });
    }

    function show(i) {
      items[current].classList.remove('is-active');
      if (dotsBox) dotsBox.children[current].classList.remove('is-active');
      current = ((i % items.length) + items.length) % items.length;
      items[current].classList.add('is-active');
      if (dotsBox) dotsBox.children[current].classList.add('is-active');
    }

    function next() { show(current + 1); }
    function start() { if (!reducedMotion && !timer) timer = setInterval(next, 3000); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    show(0);
    start();

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });
  }
})();
