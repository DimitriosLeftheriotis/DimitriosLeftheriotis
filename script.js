(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = themeToggle?.querySelector('.sr-only');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeKey = 'portfolio-theme';

  const getSavedTheme = () => {
    try {
      const savedTheme = localStorage.getItem(themeKey);
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
    } catch {
      return null;
    }
  };

  let hasSavedTheme = getSavedTheme() !== null;

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
    }
    if (themeLabel) themeLabel.textContent = 'Dark mode';
    if (themeColor) themeColor.content = isDark ? '#0c131b' : '#f7f8fa';
  };

  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    hasSavedTheme = true;

    try {
      localStorage.setItem(themeKey, nextTheme);
    } catch {
      // The selected theme still applies for this visit when storage is unavailable.
    }
  });

  colorPreference.addEventListener('change', (event) => {
    if (!hasSavedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  const setMenuOpen = (isOpen) => {
    if (!header || !navToggle) return;
    header.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (header && navToggle && navigation) {
    navToggle.addEventListener('click', () => {
      setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) setMenuOpen(false);
    });
  }

  const revealElements = [...document.querySelectorAll('[data-reveal]')];

  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08,
    });

    revealElements.forEach((element) => {
      element.classList.add('reveal-pending');
      revealObserver.observe(element);
    });
  }

  if ('IntersectionObserver' in window && navLinks.length > 0) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          if (isCurrent) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0,
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
