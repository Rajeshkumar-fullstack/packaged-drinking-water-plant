/**
 * AQUAPURE - Premium Interactive Animation Engine
 * Ultra-Smooth Momentum Scrolling, 3D Parallax Tilt, Staggered Reveals & Magnetic Interactions
 */

(function () {
  'use strict';

  // Accessibility check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  /**
   * 1. Responsive Zero-Lag Native Anchor Navigation
   */
  function initSmoothScroll() {
    function scrollToElement(targetEl) {
      if (!targetEl) return;
      const header = document.querySelector('.site-header');
      const headerOffset = header ? header.offsetHeight + 18 : 88;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    // Intercept clicks on links that contain an anchor hash
    document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || anchor.hasAttribute('data-modal-open')) return;

        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;

        const pathPart = href.substring(0, hashIndex);
        const hashPart = href.substring(hashIndex);

        // Determine if target is on the current page
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isCurrentPage = !pathPart || pathPart === currentPath || (pathPart === '' && (currentPath === 'index.html' || currentPath === ''));

        if (isCurrentPage) {
          const targetEl = document.querySelector(hashPart);
          if (targetEl) {
            e.preventDefault();
            if (history.pushState) {
              history.pushState(null, null, hashPart);
            } else {
              window.location.hash = hashPart;
            }
            scrollToElement(targetEl);
          }
        }
      });
    });

    // Handle deep-link direct page load with hash (e.g. water-cans.html#can20L)
    if (window.location.hash) {
      const hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        setTimeout(() => {
          scrollToElement(hashTarget);
        }, 120);
      }
    }
  }

  /**
   * 2. Interactive Ambient Cursor Spotlight (Desktop Only)
   */
  function initAmbientSpotlight() {
    if (prefersReducedMotion || isTouchDevice) return;

    let spotlight = document.querySelector('.cursor-spotlight');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.className = 'cursor-spotlight';
      spotlight.setAttribute('aria-hidden', 'true');
      document.body.appendChild(spotlight);
    }

    let mouseX = -200, mouseY = -200;
    let spotX = -200, spotY = -200;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        spotlight.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
      isMoving = false;
    });

    function updateSpotlight() {
      // Smooth lerp for silky trailing spotlight
      spotX += (mouseX - spotX) * 0.12;
      spotY += (mouseY - spotY) * 0.12;
      spotlight.style.transform = `translate3d(${spotX}px, ${spotY}px, 0)`;
      requestAnimationFrame(updateSpotlight);
    }
    requestAnimationFrame(updateSpotlight);
  }

  /**
   * 3. Magnetic Hover Physics on Interactive Buttons
   */
  function initMagneticButtons() {
    if (prefersReducedMotion || isTouchDevice) return;

    const magneticTargets = document.querySelectorAll('.hero-actions .btn, .btn-primary, .theme-toggle-btn, .cart-btn');
    magneticTargets.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        btn.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0) scale(1.03)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          btn.style.transition = '';
        }, 450);
      });
    });
  }

  /**
   * 4. 3D Card Tilt with Dynamic Specular Glare
   */
  function init3DCardTilt() {
    if (prefersReducedMotion || isTouchDevice) return;

    const tiltCards = document.querySelectorAll('.hero-visual-card, .img-glow-card, .product-card, .testimonial-card, .card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width - 0.5);
        const yPct = (y / rect.height - 0.5);

        const rotateX = -yPct * 6.5; // degrees
        const rotateY = xPct * 6.5;  // degrees

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 550);
      });
    });
  }

  /**
   * 5. Progressive Staggered Scroll Reveals
   */
  function initScrollReveals() {
    if (prefersReducedMotion) return;

    // Distribute stagger indices among sibling cards
    document.querySelectorAll('.grid-2, .grid-3, .grid-4, .process-grid, .stats-strip').forEach((parent) => {
      Array.from(parent.children).forEach((child, idx) => {
        child.style.setProperty('--stagger-index', idx);
      });
    });

    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .process-card, .product-card, .img-glow-card, .card, .testimonial-card, .stat-item, .interactive-widget-box');
    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add('reveal-up');
      }
      revealObserver.observe(el);
    });
  }

  /**
   * 6. Fluid Animated Number Counters
   */
  function initStatCounters() {
    const counterElements = document.querySelectorAll('.stat-number[data-count]');
    if (!counterElements.length) return;

    counterElements.forEach(el => {
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = `${prefix}0${suffix}`;
    });

    const activeAnimations = new Map();

    function startAnimation(el) {
      if (activeAnimations.has(el)) {
        cancelAnimationFrame(activeAnimations.get(el));
        activeAnimations.delete(el);
      }

      const targetValue = parseInt(el.getAttribute('data-count'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2200; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out expo deceleration for realistic physics
        const easeOutProgress = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutProgress * targetValue);

        el.textContent = `${prefix}${currentCount.toLocaleString('en-US')}${suffix}`;

        if (progress < 1) {
          activeAnimations.set(el, requestAnimationFrame(updateCounter));
        } else {
          el.textContent = `${prefix}${targetValue.toLocaleString('en-US')}${suffix}`;
          activeAnimations.delete(el);
        }
      }

      if (prefersReducedMotion) {
        el.textContent = `${prefix}${targetValue.toLocaleString('en-US')}${suffix}`;
      } else {
        activeAnimations.set(el, requestAnimationFrame(updateCounter));
      }
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          startAnimation(el);
        } else {
          if (activeAnimations.has(el)) {
            cancelAnimationFrame(activeAnimations.get(el));
            activeAnimations.delete(el);
          }
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          el.textContent = `${prefix}0${suffix}`;
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.2
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  /**
   * 7. Interactive Parallax Floating Water Droplets
   */
  function initDropletParallax() {
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero-section');
    const droplets = document.querySelectorAll('.droplet');
    if (!hero || !droplets.length) return;

    let ticking = false;

    hero.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPos = (clientX / innerWidth - 0.5) * 35;
          const yPos = (clientY / innerHeight - 0.5) * 35;

          droplets.forEach((drop, idx) => {
            const factor = (idx + 1) * 0.45;
            drop.style.transform = `translate3d(${(xPos * factor).toFixed(2)}px, ${(yPos * factor).toFixed(2)}px, 0)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      droplets.forEach(drop => {
        drop.style.transform = 'translate3d(0px, 0px, 0)';
      });
    });
  }

  /**
   * 8. Button Click Wave Ripple Feedback
   */
  function initClickRipples() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .newsletter-btn, .cart-btn, .theme-toggle-btn');
      if (!btn) return;

      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.className = 'btn-ripple-wave';
      circle.setAttribute('aria-hidden', 'true');

      const existing = btn.querySelector('.btn-ripple-wave');
      if (existing) existing.remove();

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  /**
   * 9. Word-by-Word Reveal Generator for Hero Headings
   */
  function initHeroWordSplits() {
    // Disabled to preserve native responsive typography and prevent duplicate text artifacts
    return;
  }

  /**
   * Initialization
   */
  function init() {
    initSmoothScroll();
    initAmbientSpotlight();
    initMagneticButtons();
    init3DCardTilt();
    initScrollReveals();
    initStatCounters();
    initDropletParallax();
    initClickRipples();
    initHeroWordSplits();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
