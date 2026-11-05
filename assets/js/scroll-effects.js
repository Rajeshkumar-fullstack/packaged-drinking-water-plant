/**
 * AQUAPURE - Premium Scroll Effects & Glowing Image Engine
 * Process Step Illumination, Header Glassmorphism, Cursor Specular Sheen & Scroll-Triggered Reveals
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * 1. Header Glassmorphism Scroll Tracker
   */
  function initHeaderScrollState() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;
    function updateHeader() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 15) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  /**
   * 2. Process Timeline Sequential Step Illumination
   */
  function initProcessTimelineScroll() {
    const processCards = document.querySelectorAll('.process-card, .process-step-item');
    if (!processCards.length || prefersReducedMotion) return;

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('step-illuminated');
          const stepNum = entry.target.querySelector('.process-step-num');
          if (stepNum) {
            stepNum.style.transform = 'scale(1.15)';
            stepNum.style.boxShadow = '0 0 20px rgba(36, 189, 232, 0.55)';
            setTimeout(() => {
              stepNum.style.transform = '';
            }, 450);
          }
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.25
    });

    processCards.forEach(card => stepObserver.observe(card));
  }

  /**
   * 3. Scroll-Based Glowing Image Reveal System
   */
  function initGlowingImageScrollReveals() {
    const glowingTargets = document.querySelectorAll(
      '.hero-visual-card, .img-glow-card, .product-card, .product-img-wrap, .reveal-right img, .reveal-left img'
    );
    if (!glowingTargets.length) return;

    if (prefersReducedMotion) {
      glowingTargets.forEach(el => {
        el.classList.add('img-in-view', 'img-glow-active');
      });
      return;
    }

    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('img-in-view', 'img-glow-active');
          
          // If the target is inside an img-glow-card or product-card, ensure the parent is activated
          const parentCard = entry.target.closest('.img-glow-card, .product-card, .hero-visual-card');
          if (parentCard) {
            parentCard.classList.add('img-in-view', 'img-glow-active');
          }
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    glowingTargets.forEach(target => imgObserver.observe(target));
  }

  /**
   * 4. Interactive Specular Sheen & Cursor-Following Aqua Reflection
   */
  function initCardSpecularTracking() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.hero-visual-card, .img-glow-card, .product-card, .card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }

  /**
   * 5. Subtle Water Parallax on Hero Visual Card
   */
  function initHeroParallax() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollY < 900) {
            heroVisual.style.transform = `translateY(${scrollY * 0.04}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function init() {
    initHeaderScrollState();
    initProcessTimelineScroll();
    initGlowingImageScrollReveals();
    initCardSpecularTracking();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
