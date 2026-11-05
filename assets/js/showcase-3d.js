/**
 * AQUAPURE - High-Performance 3D Scroll Animation Engine
 * Section 1: Complete Your Water Collection (3D Zigzag Camera Showcase)
 * Section 2: Why Choose Our Water? (3D Interactive Orbital Experience)
 * Optimized for 60 FPS / 120 FPS Native Compositor Scrolling with Zero Latency
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. COMPLETE YOUR WATER COLLECTION (3D ZIGZAG PRODUCT SHOWCASE)
     ========================================================================== */

  const PRODUCTS_DATA = [
    {
      id: 'bottle-250ml',
      name: '250ml Mini Event Bottle',
      badge: 'Conference & Event Special',
      capacity: '250ml (0.25L)',
      desc: 'Pocket-sized crystal clear refreshment tailored for corporate board meetings, wedding banquets, aviation, and hospitality seminars with zero water wastage.',
      packaging: 'Carton of 48 Bottles • 28mm Short Cap • Virgin Ultra-Clear PET',
      price: 240,
      unit: 'Carton',
      img: 'assets/images/bottle-250ml-mini.jpg',
      alt: '250ml mini event packaged drinking water bottle'
    },
    {
      id: 'bottle-500ml',
      name: '500ml On-The-Go Bottle',
      badge: 'Everyday Hydration',
      capacity: '500ml (0.5L)',
      desc: 'Ergonomic contoured grip bottle built for gym hydration, daily campus commutes, backpacks, vehicle cup-holders, and retail grocery racks.',
      packaging: 'Carton of 24 Bottles • High-Rigidity Ribs • Hermetic Security Ring',
      price: 240,
      unit: 'Carton',
      img: 'assets/images/bottle-500ml-onthego.jpg',
      alt: '500ml mineral water bottle during workout active fitness hydration'
    },
    {
      id: 'bottle-1l',
      name: '1L Standard Table Bottle',
      badge: 'Retail & Hospitality Bestseller',
      capacity: '1 Litre (1.0L)',
      desc: 'The benchmark size for fine dining restaurants, corporate conferences, highway journey hydration, and home refrigerators.',
      packaging: 'Carton of 12 Bottles • Tamper-Proof Cap • Food-Grade Virgin PET',
      price: 180,
      unit: 'Carton',
      img: 'assets/images/bottle-1l-standard.jpg',
      alt: '1 Litre standard packaged drinking water bottle on dining restaurant table'
    },
    {
      id: 'bottle-2l',
      name: '2L Family Travel Bottle',
      badge: 'Family & Long Distance Pack',
      capacity: '2 Litres (2.0L)',
      desc: 'High-capacity family hydration pack designed for road trips, picnics, outdoor sports treks, and bedside hydration with reinforced base stability.',
      packaging: 'Carton of 9 Bottles • Heavy-Gauge Wall • Reinforced Base Ring',
      price: 225,
      unit: 'Carton',
      img: 'assets/images/bottle-2l-family.jpg',
      alt: '2 Litre family travel packaged drinking water bottle'
    },
    {
      id: 'can-10l',
      name: '10L Compact Dispenser Can',
      badge: 'Modern Kitchenette Pack',
      capacity: '10 Litres (10.0L)',
      desc: 'Compact easy-carry dispenser jar engineered for contemporary kitchenettes, compact apartments, and small offices without lifting fatigue.',
      packaging: 'Virgin Food-Grade PET Jar • Integrated Carry Handle • Sanitary Dust Cap',
      price: 65,
      unit: 'Can',
      img: 'assets/images/can-10l-compact.jpg',
      alt: '10L compact easy-carry water dispenser can'
    },
    {
      id: 'can-20l',
      name: '20L Commercial Polycarbonate Can',
      badge: 'Enterprise & Industrial Standard',
      capacity: '20 Litres (20.0L)',
      desc: 'Heavy-duty multi-trip dispenser bubbletop can engineered for IT corporate parks, hospital wards, residential towers, and factories.',
      packaging: 'Multi-Trip Food-Grade Polycarbonate • 7-Stage CIP Sanitized • Tamper Seal',
      price: 90,
      unit: 'Can',
      img: 'assets/images/can-20l-commercial.jpg',
      alt: '20-litre commercial polycarbonate water dispenser can'
    }
  ];

  function initProductShowcase3D() {
    const container = document.getElementById('productShowcase3D');
    const world = document.getElementById('showcase3DWorld');
    if (!container || !world) return;

    // Render 3D Products in the World
    world.innerHTML = PRODUCTS_DATA.map((p, idx) => `
      <div class="showcase-3d-product ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" id="showcaseProduct-${idx}">
        <div class="showcase-product-visual">
          <div class="showcase-product-pedestal"></div>
          <img src="${p.img}" alt="${p.alt}" class="showcase-product-img" decoding="async" onerror="this.onerror=null; this.src='assets/images/can-20l-commercial.jpg';">
          <div class="showcase-product-reflection">
            <img src="${p.img}" alt="" aria-hidden="true" decoding="async">
          </div>
        </div>
      </div>
    `).join('');

    const productElements = world.querySelectorAll('.showcase-3d-product');

    // Dynamic Info Elements
    const badgeEl = document.getElementById('showcaseInfoBadge');
    const titleEl = document.getElementById('showcaseInfoTitle');
    const capEl = document.getElementById('showcaseInfoCapacity');
    const descEl = document.getElementById('showcaseInfoDesc');
    const packEl = document.getElementById('showcaseInfoPackaging');
    const addCartBtn = document.getElementById('showcaseAddCartBtn');
    const currentIdxEl = document.getElementById('showcaseCurrentIdx');
    const progressFillEl = document.getElementById('showcaseProgressFill');

    let currentActiveIdx = -1;
    let targetProgress = 0;
    let currentProgress = 0;
    let isShowcaseInView = false;
    let isShowcaseAnimating = false;

    function updateProductInfo(index) {
      if (index === currentActiveIdx || index < 0 || index >= PRODUCTS_DATA.length) return;
      currentActiveIdx = index;
      const data = PRODUCTS_DATA[index];

      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.name;
      if (capEl) capEl.innerHTML = `<i class="bi bi-droplet-half"></i> Capacity: <span>${data.capacity}</span>`;
      if (descEl) descEl.textContent = data.desc;
      if (packEl) packEl.innerHTML = `<i class="bi bi-box-seam"></i> Packaging: <span>${data.packaging}</span>`;
      if (addCartBtn) {
        addCartBtn.setAttribute('data-id', data.id);
        addCartBtn.setAttribute('data-name', data.name);
        addCartBtn.setAttribute('data-price', data.price);
        addCartBtn.setAttribute('data-unit', data.unit);
        addCartBtn.setAttribute('data-img', data.img);
      }
      if (currentIdxEl) currentIdxEl.textContent = `0${index + 1}`;
      if (progressFillEl) {
        progressFillEl.style.width = `${((index + 1) / PRODUCTS_DATA.length) * 100}%`;
      }
    }

    // High-performance conditional 3D render loop
    function render3DShowcase() {
      if (prefersReducedMotion || !isShowcaseInView) {
        isShowcaseAnimating = false;
        return;
      }

      // Smooth inertia lerp
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.0008) {
        currentProgress = targetProgress;
      } else {
        currentProgress += diff * 0.12; // Fast, snappy response without sluggish lag
      }

      const activeFloatingIndex = currentProgress * (PRODUCTS_DATA.length - 1);
      const activeInt = Math.round(activeFloatingIndex);
      updateProductInfo(Math.min(PRODUCTS_DATA.length - 1, Math.max(0, activeInt)));

      productElements.forEach((el, i) => {
        const offset = i - activeFloatingIndex;

        // Skip calculations for off-screen distant elements to preserve 60/120 FPS
        if (Math.abs(offset) > 2.4) {
          el.style.display = 'none';
          return;
        } else {
          el.style.display = 'flex';
        }
        
        // Responsive 3D depth and spacing
        const isMobile = window.innerWidth <= 768;
        const zSpacing = isMobile ? 300 : 420;
        const zPos = -offset * zSpacing;
        
        // Zigzag X-position calibrated to prevent off-screen clipping on mobile
        const sideSign = i % 2 === 0 ? -1 : 1;
        const xMultiplier = isMobile ? 65 : 160;
        const xOffsetSpread = isMobile ? 18 : 40;
        const xPos = offset === 0 ? 0 : sideSign * (xMultiplier + Math.abs(offset) * xOffsetSpread);
        const rotY = offset === 0 ? 0 : -sideSign * Math.min(22, Math.abs(offset) * (isMobile ? 10 : 14));

        let opacity = 1;
        let scale = 1;

        if (offset < -0.4) {
          opacity = Math.max(0, 1 - Math.abs(offset) * 0.85);
          scale = Math.max(0.72, 1 - Math.abs(offset) * 0.14);
        } else if (offset > 0.4) {
          opacity = Math.max(0.2, 1 - offset * 0.32);
          scale = Math.max(0.65, 1 - offset * 0.12);
        } else {
          opacity = 1;
          scale = 1 + (1 - Math.abs(offset) * 2.5) * 0.05;
        }

        const isFocused = Math.abs(offset) < 0.4;
        if (isFocused) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }

        el.style.transform = `translate3d(${xPos.toFixed(1)}px, 0px, ${zPos.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(2);
        el.style.zIndex = Math.round(100 - Math.abs(offset) * 15);
      });

      // Continue animating only while interpolating
      if (Math.abs(targetProgress - currentProgress) > 0.0008) {
        requestAnimationFrame(render3DShowcase);
        isShowcaseAnimating = true;
      } else {
        isShowcaseAnimating = false;
      }
    }

    function triggerShowcaseRender() {
      if (!isShowcaseAnimating && isShowcaseInView) {
        isShowcaseAnimating = true;
        requestAnimationFrame(render3DShowcase);
      }
    }

    // Scroll Tracking with Immediate Response
    function onScroll() {
      if (!isShowcaseInView) return;
      const rect = container.getBoundingClientRect();
      const totalDist = container.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalDist));
      targetProgress = progress;
      triggerShowcaseRender();
    }

    // IntersectionObserver: Only compute 3D calculations when in or near viewport
    const viewportObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isShowcaseInView = entry.isIntersecting;
        if (isShowcaseInView) {
          onScroll();
          triggerShowcaseRender();
        }
      });
    }, {
      rootMargin: '120px 0px 120px 0px',
      threshold: 0
    });

    viewportObserver.observe(container);

    // Passive Scroll Listener
    window.addEventListener('scroll', onScroll, { passive: true });
    updateProductInfo(0);

    // Arrow Buttons Navigation
    const prevBtn = document.getElementById('showcasePrevBtn');
    const nextBtn = document.getElementById('showcaseNextBtn');

    function scrollToProduct(idx) {
      const totalDist = container.offsetHeight - window.innerHeight;
      const targetP = idx / (PRODUCTS_DATA.length - 1);
      const containerTop = window.pageYOffset + container.getBoundingClientRect().top;
      const targetScroll = containerTop + targetP * totalDist;
      window.scrollTo({
        top: targetScroll,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        scrollToProduct(Math.max(0, currentActiveIdx - 1));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        scrollToProduct(Math.min(PRODUCTS_DATA.length - 1, currentActiveIdx + 1));
      });
    }

    // Direct click on product item focuses it
    productElements.forEach((el, idx) => {
      el.addEventListener('click', () => scrollToProduct(idx));
    });

    // Mobile Touch Swipe Navigation on 3D Stage
    let touchStartX = 0;
    let touchStartY = 0;
    const stageEl = container.querySelector('.showcase-3d-stage');
    if (stageEl) {
      stageEl.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      stageEl.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;
          // Trigger when horizontal swipe is > 40px and predominantly horizontal
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              scrollToProduct(Math.min(PRODUCTS_DATA.length - 1, currentActiveIdx + 1));
            } else {
              scrollToProduct(Math.max(0, currentActiveIdx - 1));
            }
          }
        }
      }, { passive: true });
    }

    // Hook up Add to Cart Button
    if (addCartBtn) {
      addCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = PRODUCTS_DATA[currentActiveIdx];
        if (window.AquaPureCart && window.AquaPureCart.addToCart) {
          window.AquaPureCart.addToCart({
            id: data.id,
            name: data.name,
            price: data.price,
            unit: data.unit,
            img: data.img,
            quantity: 1
          });
          window.AquaPureCart.openDrawer();
        }
      });
    }

    // Hook up Enquire Now Button
    const enquireBtn = document.getElementById('showcaseEnquireBtn');
    if (enquireBtn) {
      enquireBtn.addEventListener('click', () => {
        const data = PRODUCTS_DATA[currentActiveIdx];
        const modal = document.querySelector('#quoteModal');
        if (modal) {
          const productSelect = modal.querySelector('select[name="product"], #quoteProduct');
          if (productSelect) {
            for (let opt of productSelect.options) {
              if (opt.text.toLowerCase().includes(data.name.toLowerCase().split(' ')[0])) {
                opt.selected = true;
                break;
              }
            }
          }
        }
      });
    }
  }


  /* ==========================================================================
     2. WHY CHOOSE OUR WATER? (3D ORBITAL EXPERIENCE)
     ========================================================================== */

  const ORBIT_BENEFITS = [
    {
      num: '01',
      icon: 'bi-shield-check',
      title: 'Advanced Purification',
      desc: 'Multi-stage water purification processes including dual-stage RO, UV sterilisation, and medical-grade 0.2-micron filtration.'
    },
    {
      num: '02',
      icon: 'bi-patch-check-fill',
      title: 'Quality Assurance',
      desc: 'Careful quality monitoring throughout production with round-the-clock testing of TDS, pH, and microbiological benchmarks.'
    },
    {
      num: '03',
      icon: 'bi-stars',
      title: 'Hygienic Manufacturing',
      desc: 'Clean and controlled packaging environments featuring ISO Class-100 positive-pressure laminar airflow cleanroom capping.'
    },
    {
      num: '04',
      icon: 'bi-gear-wide-connected',
      title: 'Modern Technology',
      desc: 'Advanced purification and packaging equipment with electro-polished SS316 food-grade piping and zero human contact.'
    },
    {
      num: '05',
      icon: 'bi-truck',
      title: 'Reliable Distribution',
      desc: 'Organized supply for retail and bulk requirements backed by scheduled temperature-controlled delivery fleet logistics.'
    },
    {
      num: '06',
      icon: 'bi-headset',
      title: 'Customer Commitment',
      desc: 'Dedicated service and customer satisfaction with transparent batch QR traceability, flexible billing, and priority support.'
    }
  ];

  function initWhyChooseOrbit3D() {
    const container = document.getElementById('whyChoose3D');
    const world = document.getElementById('orbit3DWorld');
    const dotsContainer = document.getElementById('orbitNavDots');
    if (!container || !world || !dotsContainer) return;

    // Render Benefit Cards in Orbit World
    const cardsHtml = ORBIT_BENEFITS.map((b, i) => `
      <div class="orbit-card ${i === 0 ? 'is-active' : ''}" data-index="${i}" id="orbitCard-${i}" role="tabpanel">
        <div class="orbit-card-header">
          <div class="orbit-card-icon"><i class="bi ${b.icon}"></i></div>
          <div>
            <div class="orbit-card-step-num">PILLAR ${b.num}</div>
            <h3 class="orbit-card-title">${b.title}</h3>
          </div>
        </div>
        <p class="orbit-card-desc">${b.desc}</p>
      </div>
    `).join('');

    world.insertAdjacentHTML('beforeend', cardsHtml);
    const cardElements = world.querySelectorAll('.orbit-card');

    // Render 6 Navigation Dots
    dotsContainer.innerHTML = ORBIT_BENEFITS.map((b, i) => `
      <button type="button" class="orbit-dot ${i === 0 ? 'active' : ''}" data-index="${i}" data-label="${b.title}" aria-label="Navigate to ${b.title}" role="tab"></button>
    `).join('');
    const dotElements = dotsContainer.querySelectorAll('.orbit-dot');

    let targetAngle = 0;
    let currentAngle = 0;
    let activeCardIndex = 0;
    let isOrbitInView = false;
    let isOrbitAnimating = false;

    function getOrbitRadius() {
      const w = window.innerWidth;
      if (w <= 480) return 150;
      if (w <= 768) return 200;
      if (w <= 992) return 260;
      return 330;
    }

    function renderOrbit() {
      if (prefersReducedMotion || !isOrbitInView) {
        isOrbitAnimating = false;
        return;
      }

      const diff = targetAngle - currentAngle;
      if (Math.abs(diff) < 0.1) {
        currentAngle = targetAngle;
      } else {
        currentAngle += diff * 0.12; // Fast, snappy response
      }

      const R = getOrbitRadius();
      const numCards = ORBIT_BENEFITS.length;
      let closestCardIdx = 0;
      let maxZ = -9999;

      cardElements.forEach((card, i) => {
        const baseDeg = (i * 360) / numCards;
        const rad = ((baseDeg - currentAngle) * Math.PI) / 180;

        const x = R * Math.sin(rad);
        const z = R * Math.cos(rad);
        const y = 30 * Math.sin(rad * 2);

        if (z > maxZ) {
          maxZ = z;
          closestCardIdx = i;
        }

        const normZ = (z + R) / (2 * R);
        const scale = 0.78 + normZ * 0.3;
        const opacity = 0.35 + normZ * 0.65;

        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(2);
        card.style.zIndex = Math.round(50 + z);
      });

      if (closestCardIdx !== activeCardIndex) {
        activeCardIndex = closestCardIdx;
        cardElements.forEach((c, idx) => {
          if (idx === activeCardIndex) c.classList.add('is-active');
          else c.classList.remove('is-active');
        });
        dotElements.forEach((d, idx) => {
          if (idx === activeCardIndex) {
            d.classList.add('active');
            d.setAttribute('aria-selected', 'true');
          } else {
            d.classList.remove('active');
            d.setAttribute('aria-selected', 'false');
          }
        });
      }

      if (Math.abs(targetAngle - currentAngle) > 0.1) {
        requestAnimationFrame(renderOrbit);
        isOrbitAnimating = true;
      } else {
        isOrbitAnimating = false;
      }
    }

    function triggerOrbitRender() {
      if (!isOrbitAnimating && isOrbitInView) {
        isOrbitAnimating = true;
        requestAnimationFrame(renderOrbit);
      }
    }

    function onScroll() {
      if (!isOrbitInView) return;
      const rect = container.getBoundingClientRect();
      const totalDist = container.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalDist));
      targetAngle = progress * 360;
      triggerOrbitRender();
    }

    const orbitObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isOrbitInView = entry.isIntersecting;
        if (isOrbitInView) {
          onScroll();
          triggerOrbitRender();
        }
      });
    }, {
      rootMargin: '120px 0px 120px 0px',
      threshold: 0
    });

    orbitObserver.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Click on progress dots
    function rotateToCard(idx) {
      const totalDist = container.offsetHeight - window.innerHeight;
      const targetP = idx / ORBIT_BENEFITS.length;
      const containerTop = window.pageYOffset + container.getBoundingClientRect().top;
      const targetScroll = containerTop + targetP * totalDist;
      window.scrollTo({
        top: targetScroll,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    dotElements.forEach((dot, idx) => {
      dot.addEventListener('click', () => rotateToCard(idx));
    });

    cardElements.forEach((card, idx) => {
      card.addEventListener('click', () => rotateToCard(idx));
    });
  }

  function init() {
    initProductShowcase3D();
    initWhyChooseOrbit3D();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
