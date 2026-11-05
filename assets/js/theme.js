/**
 * AQUAPURE - Theme and Direction Controller
 * Manages Light/Dark Mode, RTL/LTR Direction, and LocalStorage State
 */

(function () {
  'use strict';

  const THEME_KEY = 'aquapure_theme';
  const DIR_KEY = 'aquapure_dir';

  /**
   * Apply Theme
   * @param {string} theme - 'light' or 'dark'
   */
  function applyTheme(theme) {
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update toggle button icons
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('aria-label', 'Switch to Light Mode');
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });
  }

  /**
   * Toggle between light and dark
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  /**
   * Apply Direction (RTL / LTR)
   * @param {string} dir - 'rtl' or 'ltr'
   */
  function applyDirection(dir) {
    if (dir !== 'rtl' && dir !== 'ltr') dir = 'ltr';
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);

    // Update all RTL toggle buttons
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn, .lang-btn');
    rtlBtns.forEach(btn => {
      const icon = btn.querySelector('.dir-icon, .lang-icon, i');
      const label = btn.querySelector('.dir-label, .lang-current-label');

      if (dir === 'rtl') {
        if (icon) icon.className = 'bi bi-text-left dir-icon';
        if (label) label.textContent = 'LTR';
        btn.setAttribute('title', 'RTL layout active — Click to switch to LTR');
        btn.setAttribute('aria-label', 'RTL layout active — Click to switch to LTR');
        btn.setAttribute('data-current-dir', 'rtl');
        btn.classList.add('active');
      } else {
        if (icon) icon.className = 'bi bi-text-right dir-icon';
        if (label) label.textContent = 'RTL';
        btn.setAttribute('title', 'LTR layout active — Click to switch to RTL');
        btn.setAttribute('aria-label', 'LTR layout active — Click to switch to RTL');
        btn.setAttribute('data-current-dir', 'ltr');
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Toggle direction between RTL and LTR
   */
  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(nextDir);
  }

  // Initialize immediately on load
  function init() {
    // Determine initial theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Determine initial direction (Defaults to document dir or 'ltr')
    let savedDir = localStorage.getItem(DIR_KEY);
    if (!savedDir) {
      // Check legacy key if present
      const legacyLang = localStorage.getItem('aquapure_lang');
      if (legacyLang === 'rtl' || legacyLang === 'ar' || legacyLang === 'he') {
        savedDir = 'rtl';
      } else if (legacyLang === 'ltr' || legacyLang === 'en') {
        savedDir = 'ltr';
      } else {
        savedDir = document.documentElement.getAttribute('dir') || 'ltr';
      }
    }
    applyDirection(savedDir);

    // Attach listeners on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      // Theme toggle buttons
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
      });

      // RTL / Direction toggle buttons
      document.querySelectorAll('.rtl-toggle-btn, .lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleDirection();
        });
      });
    });
  }

  init();

  // Expose helpers globally
  window.AquaPureTheme = {
    toggleTheme,
    toggleDirection,
    applyTheme,
    applyDirection,
    applyLanguage: (code) => {
      const dir = (code === 'rtl' || code === 'ar' || code === 'he') ? 'rtl' : 'ltr';
      applyDirection(dir);
    }
  };
})();
