/**
 * AQUAPURE - Premium Auto-Rotating Hero Carousel Controller
 * Centralized, Data-Driven Carousel Engine with Synchronized Dynamic Updates
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. SINGLE RELIABLE SOURCE OF SLIDE DATA (5 Complete Promotional Slides)
  // ==========================================================================
  const SLIDES_DATA = [
    {
      index: 0,
      badge: '100% PURE & HYGIENICALLY PROCESSED',
      badgeIcon: 'bi bi-droplet-fill',
      title: '<span class="aqua-gradient">Pure Water.</span><br>Healthy Life.',
      description: 'Experience refreshing packaged drinking water with a commitment to purity, quality and customer satisfaction.',
      primaryBtn: {
        text: 'Explore Products',
        url: 'products.html',
        icon: 'bi bi-box-seam'
      },
      secondaryBtn: {
        text: 'Become a Distributor',
        url: 'contact.html',
        icon: 'bi bi-truck'
      },
      image: 'assets/images/hero-pure-water-bottle.jpg',
      alt: 'Premium drinking water bottle with a beautiful water splash',
      isProduct: false
    },
    {
      index: 1,
      badge: 'ADVANCED WATER PURIFICATION',
      badgeIcon: 'bi bi-shield-check',
      title: '<span class="aqua-gradient">Advanced Purification.</span><br>Exceptional Quality.',
      description: 'Discover modern multi-stage water purification processes designed to support consistent product quality.',
      primaryBtn: {
        text: 'Our Process',
        url: 'about.html',
        icon: 'bi bi-gear-wide-connected'
      },
      secondaryBtn: {
        text: 'Learn More',
        url: 'quality-reports.html',
        icon: 'bi bi-file-earmark-bar-graph'
      },
      image: 'assets/images/industrial-water-purification-plant.jpg',
      alt: 'Modern water purification equipment and filtration systems',
      isProduct: false
    },
    {
      index: 2,
      badge: 'REFRESHING IN EVERY DROP',
      badgeIcon: 'bi bi-stars',
      title: '<span class="aqua-gradient">Pure Refreshment.</span><br>Wherever You Go.',
      description: 'Explore our packaged drinking water bottle options for everyday refreshment and convenience.',
      primaryBtn: {
        text: 'View Bottles',
        url: 'water-bottles.html',
        icon: 'bi bi-cup-straw'
      },
      secondaryBtn: {
        text: 'Enquire Now',
        url: 'contact.html',
        icon: 'bi bi-envelope-check'
      },
      image: 'assets/images/pet-bottles-group.png',
      alt: 'Premium bottled drinking water photography with elegant lighting',
      isProduct: true
    },
    {
      index: 3,
      badge: 'PACKAGING FOR EVERY NEED',
      badgeIcon: 'bi bi-boxes',
      title: '<span class="aqua-gradient">Convenient Water Solutions</span><br>for Everyone.',
      description: 'Discover our water cans and pouch packaging options for homes, businesses and bulk requirements.',
      primaryBtn: {
        text: 'Explore Water Cans',
        url: 'water-cans.html',
        icon: 'bi bi-bucket'
      },
      secondaryBtn: {
        text: 'Explore Pouches',
        url: 'water-pouches.html',
        icon: 'bi bi-bag-check'
      },
      image: 'assets/images/polycarbonate-20l-bubbletop.png',
      alt: 'Professional water cans and pouch product photography',
      isProduct: true
    },
    {
      index: 4,
      badge: 'GROW WITH US',
      badgeIcon: 'bi bi-graph-up-arrow',
      title: '<span class="aqua-gradient">Let\'s Build</span><br>a Stronger Distribution Network.',
      description: 'Explore business opportunities and connect with our team for distribution and wholesale enquiries.',
      primaryBtn: {
        text: 'Become a Partner',
        url: 'contact.html',
        icon: 'bi bi-person-plus-fill'
      },
      secondaryBtn: {
        text: 'Contact Us',
        url: 'contact.html',
        icon: 'bi bi-telephone-outbound'
      },
      image: 'assets/images/wholesale-distribution-hub.jpg',
      alt: 'Professional packaged water distribution and delivery photography',
      isProduct: false
    }
  ];

  // Preload all 5 slide images immediately to eliminate blank flicker
  SLIDES_DATA.forEach(slide => {
    if (slide.image) {
      const img = new Image();
      img.src = slide.image;
    }
  });

  // ==========================================================================
  // 2. STATE & CONFIGURATION
  // ==========================================================================
  const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds
  let currentIndex = 0;
  let autoplayTimer = null;
  let isPausedByUser = false;
  let isHovered = false;

  // DOM Elements cache
  let carouselSection = null;
  let slides = [];
  let dots = [];
  let prevBtn = null;
  let nextBtn = null;
  let playPauseBtn = null;
  let progressBar = null;

  /**
   * Initialize carousel on DOM Ready
   */
  function initHeroCarousel() {
    carouselSection = document.getElementById('heroCarouselSection');
    if (!carouselSection) return;

    slides = Array.from(carouselSection.querySelectorAll('.hero-slide'));
    dots = Array.from(carouselSection.querySelectorAll('.hero-carousel-dot'));
    prevBtn = document.getElementById('heroCarouselPrevBtn');
    nextBtn = document.getElementById('heroCarouselNextBtn');
    playPauseBtn = document.getElementById('heroCarouselPlayPauseBtn');
    progressBar = document.getElementById('heroCarouselProgressBar');

    // Register UI Events
    bindControls();

    // Start with Slide 0
    showSlide(0);

    // Start Autoplay
    startAutoplay();
  }

  // ==========================================================================
  // 3. CENTRAL WORKING SLIDE FUNCTION (showSlide)
  // ==========================================================================
  /**
   * Synchronously updates all 10 slide elements together from the central data source
   * @param {number} targetIndex - Zero-based slide index (0 to 4)
   */
  function showSlide(targetIndex) {
    if (typeof targetIndex !== 'number' || isNaN(targetIndex)) {
      targetIndex = 0;
    }

    // Wrap around bounds (looping from last to first and vice versa)
    const total = SLIDES_DATA.length;
    const normalizedIndex = ((targetIndex % total) + total) % total;
    currentIndex = normalizedIndex;
    const data = SLIDES_DATA[normalizedIndex];

    // 1. Update each slide element in DOM
    if (slides.length > 0) {
      slides.forEach((slideEl, idx) => {
        const isActive = (idx === normalizedIndex);
        slideEl.classList.toggle('is-active', isActive);
        slideEl.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if (isActive) {
          // Sync content inside this active slide
          applySlideDataToContainer(slideEl, data);

          // Trigger clean staggered entrance animation
          slideEl.classList.remove('is-animating');
          void slideEl.offsetWidth; // Force DOM reflow
          slideEl.classList.add('is-animating');
        } else {
          slideEl.classList.remove('is-animating');
        }
      });
    }

    // 2. Also update central elements directly if single-container pattern is queried
    applyCentralSlideData(data);

    // 3. Update Pagination Dots (Active state & ARIA)
    dots.forEach((dot, idx) => {
      const isActive = (idx === normalizedIndex);
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      dot.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // 4. Update Progress Indicator if present
    if (progressBar) {
      progressBar.style.width = '0%';
    }

    // 5. Reset autoplay timer so every slide displays for a full duration
    resetAutoplay();
  }

  /**
   * Updates all inner elements inside a slide container
   */
  function applySlideDataToContainer(container, data) {
    if (!container || !data) return;

    // 1. Hero image & Alt attribute
    const img = container.querySelector('.hero-img');
    if (img) {
      img.src = data.image;
      img.alt = data.alt;
    }

    // 2. Promotional badge
    const badge = container.querySelector('.badge-pill');
    if (badge) {
      badge.innerHTML = `<i class="${data.badgeIcon}"></i> ${data.badge}`;
    }

    // 3. Main heading
    const title = container.querySelector('.hero-title');
    if (title) {
      title.innerHTML = data.title;
    }

    // 4. Supporting description
    const desc = container.querySelector('.hero-description');
    if (desc) {
      desc.textContent = data.description;
    }

    // 5 & 6. Primary CTA text & URL
    const primaryBtn = container.querySelector('.hero-actions .btn-primary');
    if (primaryBtn) {
      primaryBtn.innerHTML = `<i class="${data.primaryBtn.icon}"></i> <span>${data.primaryBtn.text}</span>`;
      primaryBtn.href = data.primaryBtn.url;
    }

    // 7 & 8. Secondary CTA text & URL
    const secondaryBtn = container.querySelector('.hero-actions .btn-outline');
    if (secondaryBtn) {
      secondaryBtn.innerHTML = `<i class="${data.secondaryBtn.icon}"></i> <span>${data.secondaryBtn.text}</span>`;
      secondaryBtn.href = data.secondaryBtn.url;
    }

    // Product visual card style adjustment (isProduct vs standard)
    const card = container.querySelector('.hero-visual-card');
    if (card) {
      card.classList.toggle('is-product', Boolean(data.isProduct));
    }
  }

  /**
   * Applies slide data directly to elements by ID if present
   */
  function applyCentralSlideData(data) {
    if (!data) return;

    const img = document.getElementById('heroImg');
    if (img) {
      img.src = data.image;
      img.alt = data.alt;
    }

    const badge = document.getElementById('heroBadge');
    if (badge) {
      badge.innerHTML = `<i class="${data.badgeIcon}"></i> ${data.badge}`;
    }

    const title = document.getElementById('heroTitle');
    if (title) {
      title.innerHTML = data.title;
    }

    const desc = document.getElementById('heroDescription');
    if (desc) {
      desc.textContent = data.description;
    }

    const primaryBtn = document.getElementById('heroPrimaryBtn');
    if (primaryBtn) {
      primaryBtn.innerHTML = `<i class="${data.primaryBtn.icon}"></i> <span>${data.primaryBtn.text}</span>`;
      primaryBtn.href = data.primaryBtn.url;
    }

    const secondaryBtn = document.getElementById('heroSecondaryBtn');
    if (secondaryBtn) {
      secondaryBtn.innerHTML = `<i class="${data.secondaryBtn.icon}"></i> <span>${data.secondaryBtn.text}</span>`;
      secondaryBtn.href = data.secondaryBtn.url;
    }
  }

  // ==========================================================================
  // 4. NAVIGATION HANDLERS
  // ==========================================================================
  function nextSlide() {
    showSlide((currentIndex + 1) % SLIDES_DATA.length);
  }

  function prevSlide() {
    showSlide((currentIndex - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  }

  // ==========================================================================
  // 5. AUTOPLAY FUNCTIONALITY (Clean Single-Timer Mechanism)
  // ==========================================================================
  function startAutoplay() {
    clearAutoplay();
    if (isPausedByUser || isHovered) return;

    autoplayTimer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
  }

  function clearAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    clearAutoplay();
    startAutoplay();
  }

  function pauseAutoplay() {
    clearAutoplay();
  }

  function resumeAutoplay() {
    startAutoplay();
  }

  // ==========================================================================
  // 6. EVENT LISTENERS & CONTROLS BINDING
  // ==========================================================================
  function bindControls() {
    // Next Arrow Button
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Previous Arrow Button
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    // Pagination Dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(index);
      });
    });

    // Play / Pause Button
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isPausedByUser = !isPausedByUser;
        if (isPausedByUser) {
          pauseAutoplay();
          playPauseBtn.innerHTML = '<i class="bi bi-play-fill" aria-hidden="true"></i>';
          playPauseBtn.setAttribute('title', 'Resume automatic slide rotation');
          playPauseBtn.setAttribute('aria-label', 'Resume automatic slide rotation');
        } else {
          resumeAutoplay();
          playPauseBtn.innerHTML = '<i class="bi bi-pause-fill" aria-hidden="true"></i>';
          playPauseBtn.setAttribute('title', 'Pause automatic slide rotation');
          playPauseBtn.setAttribute('aria-label', 'Pause automatic slide rotation');
        }
      });
    }

    // Hover Pause and Resume
    if (carouselSection) {
      carouselSection.addEventListener('mouseenter', () => {
        isHovered = true;
        pauseAutoplay();
      });

      carouselSection.addEventListener('mouseleave', () => {
        isHovered = false;
        if (!isPausedByUser) {
          resumeAutoplay();
        }
      });

      // Pause when keyboard focus enters carousel
      carouselSection.addEventListener('focusin', () => {
        isHovered = true;
        pauseAutoplay();
      });

      carouselSection.addEventListener('focusout', (e) => {
        if (!carouselSection.contains(e.relatedTarget)) {
          isHovered = false;
          if (!isPausedByUser) {
            resumeAutoplay();
          }
        }
      });

      // Keyboard Navigation (Left / Right Arrow Keys)
      carouselSection.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        }
      });

      // Touch Swipe Gestures
      let touchStartX = 0;
      let touchStartY = 0;
      let touchDeltaX = 0;
      let touchDeltaY = 0;

      carouselSection.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchDeltaX = 0;
          touchDeltaY = 0;
          pauseAutoplay();
        }
      }, { passive: true });

      carouselSection.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchDeltaX = e.touches[0].clientX - touchStartX;
          touchDeltaY = e.touches[0].clientY - touchStartY;
        }
      }, { passive: true });

      carouselSection.addEventListener('touchend', () => {
        if (Math.abs(touchDeltaX) > 40 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
          if (touchDeltaX < 0) {
            nextSlide(); // Swipe left -> Next
          } else {
            prevSlide(); // Swipe right -> Previous
          }
        }
        if (!isPausedByUser && !isHovered) {
          resumeAutoplay();
        }
      }, { passive: true });
    }

    // Pause when browser tab is hidden, resume when tab is active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAutoplay();
      } else {
        if (!isPausedByUser && !isHovered) {
          resumeAutoplay();
        }
      }
    });
  }

  // ==========================================================================
  // 7. GLOBAL API EXPOSURE (For Browser Testing & External Scripts)
  // ==========================================================================
  window.showSlide = showSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.SLIDES_DATA = SLIDES_DATA;
  window.slidesData = SLIDES_DATA;
  window.heroCarousel = {
    showSlide: showSlide,
    nextSlide: nextSlide,
    prevSlide: prevSlide,
    slides: SLIDES_DATA,
    getCurrentIndex: function () {
      return currentIndex;
    }
  };

  // Kickstart on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCarousel);
  } else {
    initHeroCarousel();
  }
})();
