/**
 * AQUAPURE - Premium Cinematic Hero Animation Engine
 * Word-by-Word Text Reveals, 3D Perspective Tilt, Ambient Water Physics & Scroll Parallax
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  /**
   * 1. Water Background Decorative Elements Injection
   * Injects bubbles, ripples, and glowing ambient circles if not already present in HTML
   */
  function initWaterDecorations() {
    const bgContainer = document.querySelector('.hero-droplets-bg');
    if (!bgContainer) return;

    if (!bgContainer.querySelector('.hero-bubble')) {
      const decorativeHtml = `
        <div class="hero-bubble bubble-1" aria-hidden="true"></div>
        <div class="hero-bubble bubble-2" aria-hidden="true"></div>
        <div class="hero-bubble bubble-3" aria-hidden="true"></div>
        <div class="hero-bubble bubble-4" aria-hidden="true"></div>
        <div class="hero-bubble bubble-5" aria-hidden="true"></div>
        <div class="hero-glow-circle circle-1" aria-hidden="true"></div>
        <div class="hero-glow-circle circle-2" aria-hidden="true"></div>
        <div class="hero-ripple ripple-1" aria-hidden="true"></div>
        <div class="hero-ripple ripple-2" aria-hidden="true"></div>
      `;
      bgContainer.insertAdjacentHTML('beforeend', decorativeHtml);
    }
  }

  /**
   * 2. Mask-Based Word-by-Word Heading Reveal
   * Splits heading text into overflow-masked words and reveals them sequentially with blur-to-sharp easing
   */
  /**
   * 2. Cinematic Heading Reveal
   * Smooth blur-to-sharp entrance with fluid typography and zero DOM corruption
   */
  function initWordByWordHeading() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    title.classList.add('hero-title-animated');
  }

  /**
   * 3. Staggered Hero Sequence Timings
   */
  function initHeroSequence() {
    if (prefersReducedMotion) return;

    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual-card');
    if (!heroContent) return;

    const badge = heroContent.querySelector('.badge-pill');
    const desc = heroContent.querySelector('.hero-description');
    const btnPrimary = heroContent.querySelector('.hero-actions .btn-primary');
    const btnOutline = heroContent.querySelector('.hero-actions .btn-outline');
    const badgesRow = heroContent.querySelector('.hero-badges-row');

    if (badge) badge.style.animationDelay = '0.05s';
    if (desc) desc.style.animationDelay = '0.48s';
    if (btnPrimary) btnPrimary.style.animationDelay = '0.65s';
    if (btnOutline) btnOutline.style.animationDelay = '0.78s';

    if (badgesRow) {
      const badgeItems = badgesRow.querySelectorAll('.hero-badge-item');
      badgeItems.forEach((item, idx) => {
        item.style.animationDelay = `${0.90 + idx * 0.12}s`;
      });
    }

    if (heroVisual) {
      const img = heroVisual.querySelector('.hero-img');
      if (img) {
        img.style.animationDelay = '0.2s';
      }
    }
  }

  /**
   * 4. 3D Card Tilt with Dynamic Specular Glare on Hero Visual
   */
  function initHeroVisualTilt() {
    if (prefersReducedMotion || isTouchDevice) return;

    const visualCard = document.querySelector('.hero-visual-card');
    if (!visualCard) return;

    let isHovering = false;

    visualCard.addEventListener('mouseenter', () => {
      isHovering = true;
      visualCard.style.animationPlayState = 'paused';
      visualCard.style.transition = 'transform 0.15s ease-out, box-shadow 0.35s ease';
    });

    visualCard.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = visualCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPct = (x / rect.width - 0.5);
      const yPct = (y / rect.height - 0.5);

      const rotateX = -yPct * 9; // degrees
      const rotateY = xPct * 9;  // degrees

      visualCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
    });

    visualCard.addEventListener('mouseleave', () => {
      isHovering = false;
      visualCard.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.65s ease';
      visualCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      setTimeout(() => {
        if (!isHovering) {
          visualCard.style.animationPlayState = 'running';
        }
      }, 650);
    });
  }

  /**
   * 5. Scroll-Based Cinematic Parallax & Image Scale
   */
  function initHeroScrollParallax() {
    if (prefersReducedMotion) return;

    const heroSection = document.querySelector('.hero-section');
    const heroVisual = document.querySelector('.hero-visual-card');
    const heroContent = document.querySelector('.hero-content');
    const droplets = document.querySelectorAll('.droplet');
    const bubbles = document.querySelectorAll('.hero-bubble');
    if (!heroSection) return;

    let ticking = false;

    function onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = heroSection.offsetHeight;

      // Only calculate while within or near hero view
      if (scrollY <= heroHeight * 1.35) {
        const progress = Math.min(scrollY / heroHeight, 1);

        // Subtle scale down on hero card as user scrolls
        if (heroVisual) {
          const scale = 1 - progress * 0.06; // from 1.0 to 0.94
          const translateY = progress * 40; // gentle downward drift
          heroVisual.style.transform = `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(1)}px)`;
        }

        // Hero text subtle upward drift
        if (heroContent && scrollY > 0) {
          const textDrift = -progress * 18;
          heroContent.style.transform = `translate3d(0, ${textDrift.toFixed(1)}px, 0)`;
        }

        // Multiplane parallax depth on floating droplets & bubbles
        droplets.forEach((drop, idx) => {
          const speed = (idx + 1) * 0.16;
          drop.style.transform = `translate3d(0, ${(-scrollY * speed).toFixed(1)}px, 0)`;
        });

        bubbles.forEach((bubble, idx) => {
          const speed = (idx % 3 + 1) * 0.12;
          bubble.style.transform = `translate3d(0, ${(-scrollY * speed).toFixed(1)}px, 0)`;
        });
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * 6. Magnetic Pull on Hero Action Buttons
   */
  function initHeroMagneticButtons() {
    if (prefersReducedMotion || isTouchDevice) return;

    const buttons = document.querySelectorAll('.hero-actions .btn');
    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        btn.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0) translateY(-3px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0px, 0px, 0) translateY(0px)';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          btn.style.transition = '';
        }, 450);
      });
    });
  }

  /**
   * Initialization Orchestrator
   */
  function init() {
    initWaterDecorations();
    initWordByWordHeading();
    initHeroSequence();
    initHeroVisualTilt();
    initHeroScrollParallax();
    initHeroMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
