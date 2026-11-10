/**
 * AQUAPURE - Core UI and Interaction Scripts
 * Sticky Header, Mobile Drawer, Form Validation, TDS Calculator, Modals, FAQ
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Sticky Header
       ========================================================================== */
    const siteHeader = document.querySelector('.site-header');
    const backToTopBtn = document.querySelector('.back-to-top');

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (siteHeader) {
        if (scrollY > 15) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollY > 350) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ==========================================================================
       2. Mobile Navigation Drawer
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    const closeDrawerBtn = document.querySelector('.close-drawer-btn');
    const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

    function openMobileMenu() {
      if (mobileDrawer) mobileDrawer.classList.add('open');
      if (drawerOverlay) drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);

    // Escape key closes drawer and modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        closeAllModals();
      }
    });

    // Mobile submenu toggle
    mobileSubmenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = toggle.nextElementSibling;
        if (submenu) {
          submenu.classList.toggle('open');
          const icon = toggle.querySelector('.bi-chevron-down');
          if (icon) {
            icon.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        }
      });
    });

    /* ==========================================================================
       3. Active Navigation Highlighting
       ========================================================================== */
    function highlightActivePage() {
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-submenu-item a');

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
          link.classList.add('active');
          // If in desktop dropdown, also highlight parent toggle
          const parentDropdown = link.closest('.nav-item.dropdown');
          if (parentDropdown) {
            const toggle = parentDropdown.querySelector('.nav-link');
            if (toggle) toggle.classList.add('active');
          }
          // If in mobile submenu, open it
          const parentSubmenu = link.closest('.mobile-submenu');
          if (parentSubmenu) {
            parentSubmenu.classList.add('open');
          }
        }
      });
    }
    highlightActivePage();

    // Desktop/Touch dropdown toggle support
    const desktopDropdownToggles = document.querySelectorAll('.nav-item.dropdown > .dropdown-toggle');
    desktopDropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        // On touch screens or small devices, toggle dropdown
        if (window.innerWidth <= 992 || ('ontouchstart' in window && window.matchMedia('(pointer: coarse)').matches)) {
          e.preventDefault();
          const parent = toggle.closest('.nav-item.dropdown');
          if (parent) {
            const isOpen = parent.classList.contains('show');
            document.querySelectorAll('.nav-item.dropdown').forEach(d => d.classList.remove('show'));
            if (!isOpen) {
              parent.classList.add('show');
              toggle.setAttribute('aria-expanded', 'true');
            } else {
              toggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.dropdown')) {
        document.querySelectorAll('.nav-item.dropdown').forEach(d => {
          d.classList.remove('show');
          const t = d.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    /* ==========================================================================
       4. Modals Management (Quote Modal & Report Previews)
       ========================================================================== */
    const modalTriggers = document.querySelectorAll('[data-modal-open]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

    function openModal(modalId) {
      const modal = document.querySelector(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeAllModals() {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
      document.body.style.overflow = '';
    }

    modalTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-modal-open');
        // Preset product name if provided
        const productName = btn.getAttribute('data-product');
        if (productName) {
          const productInput = document.querySelector('#quoteProductSelect');
          if (productInput) productInput.value = productName;
        }
        openModal(target);
      });
    });

    modalCloseButtons.forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeAllModals();
        }
      });
    });

    /* ==========================================================================
       4b. Product Full Details Modal (Quick View & Comprehensive Specs)
       ========================================================================== */
    const PRODUCTS_CATALOG = {
      'can-20l': {
        id: 'can-20l',
        title: '20L Standard Commercial Water Can',
        badge: 'Most Popular',
        category: 'Water Cans • Bulk Dispenser Solutions',
        capacity: '20 Litres',
        price: '₹90',
        numericPrice: 90,
        unit: 'Can',
        img: 'assets/images/can-20l-commercial.jpg',
        desc: 'Heavy-gauge, unbreakable food-grade polycarbonate and virgin PET container. Rigorously sanitized inside and out through high-pressure hot water, alkaline wash, and ozonated rinse prior to touchless filling.',
        dedicatedUrl: 'water-cans.html#can20L',
        specs: [
          { label: 'Nominal Volume', val: '20.0 Litres (±0.2L)' },
          { label: 'Material Specification', val: '100% Virgin BPA-Free Food Grade Polycarbonate / PET' },
          { label: 'Neck Finish & Cap', val: '55mm Non-Spill Snap-On Cap with Tamper-Evident Heat Shrink' },
          { label: 'Sanitization Protocol', val: '7-Stage Internal High-Pressure Wash with Medical Ozone Rinse' },
          { label: 'Cooler Compatibility', val: 'Fits All Standard Floor & Countertop Water Coolers' },
          { label: 'Quality Standards', val: 'Batch QR Code Traceability, 0 CFU Microbes' }
        ]
      },
      'can-10l': {
        id: 'can-10l',
        title: '10L Compact Easy-Carry Water Can',
        badge: 'Compact & Ergonomic',
        category: 'Water Cans • Domestic Series',
        capacity: '10 Litres',
        price: '₹55',
        numericPrice: 55,
        unit: 'Can',
        img: 'assets/images/can-10l-compact.jpg',
        desc: 'Designed for modern apartments, small executive cabins, clinic suites, and outdoor weekend travel. Lightweight build with integrated molded handle for strain-free lifting and inverted dispenser mounting.',
        dedicatedUrl: 'water-cans.html#can10L',
        specs: [
          { label: 'Nominal Volume', val: '10.0 Litres (±0.1L)' },
          { label: 'Handle Structure', val: 'Integrated Molded Ergonomic Side Handle' },
          { label: 'Material Specification', val: 'Food-Grade Virgin Polymer (BPA & Phthalate-Free)' },
          { label: 'Dispenser Support', val: 'Direct Table-Top Inverted Stand or Hand-Pump' },
          { label: 'Total Filled Weight', val: 'Approx. 10.4 kg (Easy single-person maneuverability)' },
          { label: 'Safety Seal', val: 'Laser-Engraved Batch Cap with Tear-Off Strip' }
        ]
      },
      'bottle-250ml': {
        id: 'bottle-250ml',
        title: '250ml Mini Event Bottle',
        badge: 'Events & Conferences',
        category: 'Water Bottles • Packaged PET Series',
        capacity: '250ml',
        price: '₹240',
        numericPrice: 240,
        unit: 'Carton',
        img: 'assets/images/bottle-250ml-mini.jpg',
        desc: 'Pocket-sized refreshment for board meetings, wedding banquets, aviation catering, and seminars. Zero water wastage with single-serve convenience.',
        dedicatedUrl: 'water-bottles.html#bottle250ml',
        specs: [
          { label: 'Packaging Unit', val: '48 Bottles per Heavy Corrugated Carton' },
          { label: 'Cap Finish', val: '28mm Lightweight Tamper-Evident Screw Cap' },
          { label: 'Bottle Material', val: '100% Recyclable Virgin Food-Grade PET' },
          { label: 'Weight per Bottle', val: '~12.5g Ultra-Light Preform' }
        ]
      },
      'bottle-500ml': {
        id: 'bottle-500ml',
        title: '500ml On-The-Go Bottle',
        badge: 'Everyday Pick',
        category: 'Water Bottles • Daily Hydration',
        capacity: '500ml',
        price: '₹220',
        numericPrice: 220,
        unit: 'Carton',
        img: 'assets/images/bottle-500ml-onthego.jpg',
        desc: 'Ergonomic grip bottle for office commutes, gym hydration, campus backpacks, and retail grocery stores. Designed with ribbed grip grooves to prevent slippage.',
        dedicatedUrl: 'water-bottles.html#bottle500ml',
        specs: [
          { label: 'Packaging Unit', val: '24 Bottles per Heavy Carton / Shrink Wrap' },
          { label: 'Cap Finish', val: '28mm High-Seal Ozonated Closure' },
          { label: 'Bottle Material', val: 'High-Rigidity Virgin PET (BPA-Free)' },
          { label: 'Ideal For', val: 'Retail Stores, Gyms, Commutes, Travel' }
        ]
      },
      'bottle-1l': {
        id: 'bottle-1l',
        title: '1L Standard Table Bottle',
        badge: 'Retail Bestseller',
        category: 'Water Bottles • Hospitality Standard',
        capacity: '1 Litre',
        price: '₹180',
        numericPrice: 180,
        unit: 'Carton',
        img: 'assets/images/bottle-1l-standard.jpg',
        desc: 'The benchmark size for restaurant dining tables, corporate conferences, highway travel, and home refrigerators. Crisp taste with balanced trace minerals.',
        dedicatedUrl: 'water-bottles.html#bottle1L',
        specs: [
          { label: 'Packaging Unit', val: '12 Bottles per Master Carton / LDPE Shrink' },
          { label: 'Cap Finish', val: '28mm Security Breakaway Ring' },
          { label: 'Material', val: 'Virgin Food-Grade PET with Crystal Clarity' },
          { label: 'Ideal For', val: 'Dining Tables, Hotels, Boardrooms, Travel' }
        ]
      },
      'bottle-2l': {
        id: 'bottle-2l',
        title: '2L Family Travel Bottle',
        badge: 'Family Pack',
        category: 'Water Bottles • High-Capacity PET',
        capacity: '2 Litres',
        price: '₹180',
        numericPrice: 180,
        unit: 'Carton',
        img: 'assets/images/bottle-2l-family.jpg',
        desc: 'High-capacity PET bottle for road trips, family outings, and bedside hydration with reinforced base stability to prevent tipping inside moving vehicles.',
        dedicatedUrl: 'water-bottles.html#bottle2L',
        specs: [
          { label: 'Packaging Unit', val: '9 Bottles per Heavy Master Carton' },
          { label: 'Cap Finish', val: 'High-Torque Pressure Resistant Thread' },
          { label: 'Base Design', val: 'Reinforced Octagonal Anti-Topple Base' },
          { label: 'Ideal For', val: 'Highway Travel, Picnics, Family Stocks' }
        ]
      },
      'pouch-200ml': {
        id: 'pouch-200ml',
        title: '200ml Single-Serve Water Pouch',
        badge: 'Single Serve',
        category: 'Water Pouches • Event Series',
        capacity: '200ml',
        price: '₹100',
        numericPrice: 100,
        unit: 'Bag',
        img: 'assets/images/water-pouch-200ml.jpg',
        desc: 'Ultra-compact, sterile-packed drinking water pouch. Form-fill-sealed on automated continuous web packaging lines. Ideal for sports marathons, transit caterers, community feeding, and religious events.',
        dedicatedUrl: 'water-pouches.html#pouch200ml',
        specs: [
          { label: 'Volume Capacity', val: '200ml (±5ml)' },
          { label: 'Film Structure', val: '3-Layer Virgin Food-Grade Co-Extruded Poly Film' },
          { label: 'Film Thickness', val: '55 microns (High burst & puncture resistance)' },
          { label: 'Master Packaging', val: '50 Pouches per Sealed Outer Bag (10 kg total)' },
          { label: 'Ideal Use', val: 'Marathons, Rallies, Feasts, Transit Centers' }
        ]
      },
      'pouch-500ml': {
        id: 'pouch-500ml',
        title: '500ml Large Hydration Pouch',
        badge: 'Catering Standard',
        category: 'Water Pouches • Catering Standard',
        capacity: '500ml',
        price: '₹90',
        numericPrice: 90,
        unit: 'Bag',
        img: 'assets/images/water-pouch-500ml.jpg',
        desc: 'Heavy-duty laminate poly film pouch for long train journeys, outdoor industrial workforces, and event catering. Space-efficient and chills rapidly in ice chests.',
        dedicatedUrl: 'water-pouches.html#pouch500ml',
        specs: [
          { label: 'Volume Capacity', val: '500ml (±10ml)' },
          { label: 'Film Structure', val: 'Reinforced Multi-Layer Laminate Film with UV Barrier' },
          { label: 'Film Thickness', val: '65 microns with ultrasonic perimeter heat seal' },
          { label: 'Master Packaging', val: '25 Pouches per Heavy Outer Bag (12.5 kg total)' },
          { label: 'Ideal Use', val: 'Workforce Camps, Highway Catering, Relief Reserves' }
        ]
      },
      'can-20l-dispenser': {
        id: 'can-20l-dispenser',
        title: '20L Countertop Dispenser Can with Bottom Tap',
        badge: 'Built-In Tap • No Cooler Needed',
        category: 'Water Cans • Self-Dispensing Series',
        capacity: '20 Litres',
        price: '₹120',
        numericPrice: 120,
        unit: 'Can',
        img: 'assets/images/pet-20l-dispenser-jar.png',
        desc: 'Self-contained dispensing can equipped with a food-grade precision push-tap. Stands upright on any kitchen counter, table, or pantry shelf—no heavy inverted lifting or electric water cooler required.',
        dedicatedUrl: 'water-cans.html#can20LDispenser',
        specs: [
          { label: 'Dispenser Mechanism', val: 'Precision Push-Lever Food-Grade Silicone Tap' },
          { label: 'Vent Valve', val: 'Top Air-Release Plug to Prevent Flow Vacuum Locking' },
          { label: 'Material', val: 'Heavy-Gauge Food-Grade Virgin Polymer' },
          { label: 'Ideal For', val: 'Apartments, Clinics, Executive Desks, Pantry Slabs' }
        ]
      },
      'can-20l-polycarbonate': {
        id: 'can-20l-polycarbonate',
        title: '20L Heavy-Duty Polycarbonate Bubble-Top Can',
        badge: 'Industrial Grade • 60+ Trips',
        category: 'Water Cans • Corporate Fleet Series',
        capacity: '20 Litres',
        price: '₹110',
        numericPrice: 110,
        unit: 'Can',
        img: 'assets/images/polycarbonate-20l-bubbletop.png',
        desc: 'Engineered from shatterproof, impact-resistant virgin polycarbonate (PC). Built for rigorous daily rotation across corporate campuses, IT parks, factories, and schools with 60+ wash-and-refill lifecycles.',
        dedicatedUrl: 'water-cans.html#can20LPolycarbonate',
        specs: [
          { label: 'Wall Thickness', val: 'Ultra-Thick 2.2mm Impact-Absorbing Polycarbonate' },
          { label: 'Neck Finish', val: '55mm Universal Non-Spill Seal Neck' },
          { label: 'Thermal Resistance', val: 'Withstands 75°C High-Pressure Industrial Sanitization' },
          { label: 'Traceability', val: 'Batch Laser-Engraved Serialized Barcode & QR Code' }
        ]
      },
      'bottle-custom-hospitality': {
        id: 'bottle-custom-hospitality',
        title: 'Custom Private-Label Branded Bottles (300ml & 500ml)',
        badge: 'Hospitality & Luxury Events',
        category: 'Water Bottles • Private Label Series',
        capacity: '300ml / 500ml',
        price: '₹320',
        numericPrice: 320,
        unit: 'Carton',
        img: 'assets/images/pet-bottles-group.png',
        desc: 'Bespoke branded packaged drinking water for luxury hotels, fine dining restaurants, corporate summits, car dealerships, and grand weddings with metallic foil or gloss custom label branding.',
        dedicatedUrl: 'water-bottles.html#bottleCustomHospitality',
        specs: [
          { label: 'Minimum Order', val: '10 Cartons (300 Bottles Custom Imprint)' },
          { label: 'Label Technology', val: 'Waterproof Metallized BOPP with Gold/Silver Foil Accent' },
          { label: 'Bottle Silhouette', val: 'Designer Premium Ribbed Cylindrical Profile' },
          { label: 'Turnaround Time', val: '48-Hour Dispatch from Automated Bottling Line' }
        ]
      },
      'pouch-bulk-crate': {
        id: 'pouch-bulk-crate',
        title: 'Bulk Event Pouch Crate (200ml x 50 Pouches Master Pack)',
        badge: 'High-Volume Wholesale',
        category: 'Water Pouches • Wholesale Logistics',
        capacity: '10 Litres (50 x 200ml)',
        price: '₹95',
        numericPrice: 95,
        unit: 'Crate',
        img: 'assets/images/water-pouches.png',
        desc: 'Heavy-duty transport master crate packed with 50 sterile, leak-tested 200ml water pouches. Specifically designed for disaster relief, community marathons, political rallies, and summer water camps.',
        dedicatedUrl: 'water-pouches.html#pouchBulkCrate',
        specs: [
          { label: 'Bundle Content', val: '50 Sealed 200ml Pouches in Reinforced Master Bag' },
          { label: 'Film Quality', val: 'Multi-Layer Co-Extruded Food-Grade Polyethylene' },
          { label: 'Impact Rating', val: 'Drop-Tested from 2.5m Without Burst' },
          { label: 'Ideal For', val: 'Marathons, Charitable Rallies, Emergency Relief Stocks' }
        ]
      },
      'dispenser-stand-kit': {
        id: 'dispenser-stand-kit',
        title: 'Manual Countertop Can Stand & Sanitary Hand Pump Kit',
        badge: 'Dispenser Accessory',
        category: 'Accessories • Dispenser Solutions',
        capacity: 'Fits 10L & 20L Cans',
        price: '₹250',
        numericPrice: 250,
        unit: 'Kit',
        img: 'assets/images/hero-pure-water-bottle.jpg',
        desc: 'Heavy-duty stainless steel countertop stand with non-slip rubber feet and food-grade manual siphon hand pump. Easily converts standard 10L or 20L water cans into an instant desktop drinking water station.',
        dedicatedUrl: 'water-cans.html#dispenserStandKit',
        specs: [
          { label: 'Stand Structure', val: 'Heavy-Duty SS Tubular Stand (50kg Weight Capacity)' },
          { label: 'Pump Mechanism', val: 'Manual Air-Pressure Siphon Hand Pump (BPA-Free)' },
          { label: 'Protection Cap', val: 'Spout Sanitary Dust-Protective Plug Included' },
          { label: 'Power Required', val: 'Zero Electricity Required (100% Mechanical Operation)' }
        ]
      }
    };

    function populateProductModal(prodKey) {
      const prod = PRODUCTS_CATALOG[prodKey];
      if (!prod) return false;

      const modal = document.querySelector('#productDetailModal');
      if (!modal) return false;

      const imgEl = modal.querySelector('#modalProdImg');
      const badgeEl = modal.querySelector('#modalProdBadge');
      const capEl = modal.querySelector('#modalProdCapacity');
      const catEl = modal.querySelector('#modalProdCategory');
      const titleEl = modal.querySelector('#modalProdTitle');
      const priceEl = modal.querySelector('#modalProdPrice');
      const descEl = modal.querySelector('#modalProdDesc');
      const specsTableEl = modal.querySelector('#modalProdSpecs');
      const cartBtn = modal.querySelector('#modalAddToCartBtn');
      const dedicatedBtn = modal.querySelector('#modalDedicatedPageBtn');

      if (imgEl) {
        imgEl.src = prod.img;
        imgEl.alt = prod.title;
      }
      if (badgeEl) badgeEl.textContent = prod.badge;
      if (capEl) capEl.textContent = prod.capacity;
      if (catEl) catEl.textContent = prod.category;
      if (titleEl) titleEl.textContent = prod.title;
      if (priceEl) priceEl.textContent = prod.price;
      if (descEl) descEl.textContent = prod.desc;

      if (specsTableEl && prod.specs) {
        specsTableEl.innerHTML = prod.specs.map(s => `
          <tr>
            <td>${s.label}</td>
            <td>${s.val}</td>
          </tr>
        `).join('');
      }

      if (cartBtn) {
        cartBtn.setAttribute('data-id', prod.id);
        cartBtn.setAttribute('data-name', prod.title);
        cartBtn.setAttribute('data-price', prod.numericPrice);
        cartBtn.setAttribute('data-unit', prod.unit);
        cartBtn.setAttribute('data-img', prod.img);
        cartBtn.innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart (${prod.price})`;
      }

      if (dedicatedBtn) {
        dedicatedBtn.href = prod.dedicatedUrl;
      }

      return true;
    }

    // Attach click listeners to all .btn-view-details or [data-product-key]
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-view-details, [data-product-key]');
      if (btn) {
        const prodKey = btn.getAttribute('data-product-key');
        if (prodKey && populateProductModal(prodKey)) {
          e.preventDefault();
          openModal('#productDetailModal');
        }
      }
    });

    /* ==========================================================================
       4c. Hash Anchor Scroll & Target Highlighting
       ========================================================================== */
    function handleHashAnchorScroll() {
      const hash = window.location.hash;
      if (!hash) return;

      const targetEl = document.querySelector(hash);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEl.classList.add('product-anchor-highlight');
          setTimeout(() => {
            targetEl.classList.remove('product-anchor-highlight');
          }, 3200);
        }, 150);
      }
    }

    handleHashAnchorScroll();
    window.addEventListener('hashchange', handleHashAnchorScroll);

    // Enhanced Smooth In-Page Anchor Links with Sticky Nav Offset & Auto-Focus
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]:not([href="#"]):not([data-modal-open])');
      if (anchor) {
        const hash = anchor.getAttribute('href');
        try {
          const target = document.querySelector(hash);
          if (target) {
            e.preventDefault();
            history.pushState(null, '', hash);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.classList.add('product-anchor-highlight');
            setTimeout(() => {
              target.classList.remove('product-anchor-highlight');
            }, 3200);
            const firstInput = target.querySelector('input:not([type="hidden"]), textarea, select');
            if (firstInput) {
              setTimeout(() => firstInput.focus(), 600);
            }
          }
        } catch (err) {
          // Ignore invalid selector
        }
      }
    });

    /* ==========================================================================
       5. Interactive TDS & Mineral Water Quality Calculator Widget
       ========================================================================== */
    const tdsSlider = document.getElementById('tdsRangeInput');
    const tdsValueDisplay = document.getElementById('tdsDisplayVal');
    const tdsCategoryDisplay = document.getElementById('tdsCategoryDisplay');
    const tdsDescription = document.getElementById('tdsDescription');

    if (tdsSlider && tdsValueDisplay) {
      function updateTDS() {
        const val = parseInt(tdsSlider.value, 10);
        tdsValueDisplay.textContent = `${val} PPM`;

        if (val < 50) {
          tdsCategoryDisplay.textContent = 'Ultra Purified (Demineralized)';
          tdsCategoryDisplay.style.color = '#0ea5e9';
          tdsDescription.textContent = 'Extremely low mineral content. Suitable for industrial high-precision machinery, but lacks essential hydration minerals.';
        } else if (val >= 50 && val <= 150) {
          tdsCategoryDisplay.textContent = 'Optimal Packaged Drinking Water Range (AquaPure Standard)';
          tdsCategoryDisplay.style.color = '#10b981';
          tdsDescription.textContent = 'Ideal crisp taste and wholesome hydration with essential balanced minerals (Calcium, Magnesium, Potassium) meeting standard parameters.';
        } else if (val > 150 && val <= 300) {
          tdsCategoryDisplay.textContent = 'Good Natural Mineral Spring Water';
          tdsCategoryDisplay.style.color = '#087CA7';
          tdsDescription.textContent = 'Moderate mineral profile. Good for sports hydration, slightly heavier mineral finish on the palate.';
        } else {
          tdsCategoryDisplay.textContent = 'High TDS (Raw Ground Water)';
          tdsCategoryDisplay.style.color = '#f59e0b';
          tdsDescription.textContent = 'High mineral hardness. Requires multi-stage Reverse Osmosis and micron demineralization before safe human consumption.';
        }
      }

      tdsSlider.addEventListener('input', updateTDS);
      updateTDS();
    }

    /* ==========================================================================
       6. FAQ Accordion
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      if (header) {
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close other items
          faqItems.forEach(i => i.classList.remove('active'));
          // Toggle current
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });

    /* ==========================================================================
       7. Form Validation (Contact, Distributor & Bulk Pouch Inquiry Forms)
       ========================================================================== */
    const forms = document.querySelectorAll('.validated-form');

    // Validation regular expressions
    const REGEX_NAME = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    const REGEX_PHONE = /^[0-9]{10}$/;
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Validates an individual form field and updates inline error feedback.
     * @param {HTMLElement} field - Form input, select, or textarea
     * @param {boolean} isLive - Whether validation is triggered on keystroke
     * @returns {boolean} true if valid, false if invalid
     */
    function validateFormField(field, isLive = false) {
      if (!field || field.type === 'submit' || field.type === 'hidden') return true;

      const val = field.value.trim();
      let errorMsg = '';

      const id = (field.id || '').toLowerCase();
      const name = (field.name || '').toLowerCase();
      const type = (field.type || '').toLowerCase();
      const isRequired = field.hasAttribute('required');

      const isName = ((id.includes('name') || name.includes('name') || (field.placeholder && field.placeholder.toLowerCase().includes('name'))) &&
                      !id.includes('business') && !name.includes('business'));
      const isPhone = id.includes('phone') || name.includes('phone') || type === 'tel' || field.getAttribute('inputmode') === 'numeric';
      const isSelect = field.tagName.toLowerCase() === 'select';
      const isEvent = id.includes('event') || name.includes('event') || id.includes('poucheventdate');
      const isEmail = type === 'email' || id.includes('email') || name.includes('email');

      // 1. Organizer / Contact Name Validation
      if (isName) {
        if (!val) {
          if (isRequired || !isLive) {
            errorMsg = 'Organizer / Contact Name is required.';
          }
        } else if (!REGEX_NAME.test(val)) {
          if (/\d/.test(val)) {
            errorMsg = 'Numbers are not allowed in the name (letters and spaces only).';
          } else if (/[^A-Za-z\s]/.test(val)) {
            errorMsg = 'Special characters are not allowed in the name.';
          } else {
            errorMsg = 'Name must contain only alphabetic characters (A-Z, a-z) and spaces between words.';
          }
        }
      }
      // 2. Phone Number Validation (Exactly 10 numeric digits)
      else if (isPhone) {
        if (!val) {
          if (isRequired || !isLive) {
            errorMsg = 'Phone number is required.';
          }
        } else if (!REGEX_PHONE.test(val)) {
          if (val.length < 10) {
            errorMsg = `Phone number must be exactly 10 digits (currently ${val.length} digits).`;
          } else if (val.length > 10) {
            errorMsg = 'Phone number cannot exceed 10 digits.';
          } else {
            errorMsg = 'Phone number must contain only numeric digits (0–9).';
          }
        }
      }
      // 3. Dropdown Selection Validation (Pouch Variant)
      else if (isSelect) {
        if (isRequired && (!val || field.value === '' || field.selectedIndex === 0)) {
          errorMsg = 'Please select a valid pouch variant.';
        }
      }
      // 4. Event Date & Expected Bags Validation
      else if (isEvent) {
        if (!val) {
          if (isRequired || !isLive) {
            errorMsg = 'Event date and expected bag quantity are required.';
          }
        } else if (val.length < 3) {
          errorMsg = 'Please enter meaningful event date and expected bag quantity details.';
        }
      }
      // 5. Email Validation
      else if (isEmail) {
        if (!val) {
          if (isRequired || !isLive) {
            errorMsg = 'Email address is required.';
          }
        } else if (!REGEX_EMAIL.test(val)) {
          errorMsg = 'Please enter a valid email address.';
        }
      }
      // 6. Generic Required Input / Textarea
      else if (isRequired && !val) {
        if (!isLive) {
          errorMsg = 'This field is required.';
        }
      }

      // Locate corresponding feedback element
      const formGroup = field.closest('.form-group') || field.parentElement;
      let feedback = formGroup ? formGroup.querySelector('.invalid-feedback') : null;

      if (errorMsg) {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        if (feedback) {
          feedback.textContent = errorMsg;
          feedback.style.display = 'block';
        }
        return false;
      } else {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
        if (feedback) {
          feedback.style.display = 'none';
        }
        return true;
      }
    }

    forms.forEach(form => {
      // Setup Real-time & Paste Handlers for Phone Inputs
      const phoneInputs = form.querySelectorAll('input[type="tel"], input[name*="phone"], #pouchPhone');
      phoneInputs.forEach(input => {
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('maxlength', '10');

        const sanitizePhone = () => {
          const clean = input.value.replace(/\D/g, '').slice(0, 10);
          if (input.value !== clean) {
            input.value = clean;
          }
        };

        input.addEventListener('input', () => {
          sanitizePhone();
          validateFormField(input, true);
        });

        input.addEventListener('paste', () => {
          setTimeout(() => {
            sanitizePhone();
            validateFormField(input, true);
          }, 0);
        });

        input.addEventListener('blur', () => {
          sanitizePhone();
          validateFormField(input, false);
        });
      });

      // Helper to identify person name inputs across all forms
      const isPersonNameInput = (input) => {
        const id = (input.id || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        return (id.includes('name') || name.includes('name') || placeholder.includes('name')) &&
               !id.includes('business') && !name.includes('business');
      };

      // Name inputs: strictly disallow digits (0-9), sanitize in real-time and on paste
      const allTextInputs = form.querySelectorAll('input[type="text"], input:not([type]), #pouchName');
      allTextInputs.forEach(input => {
        if (!isPersonNameInput(input)) return;

        // 1. Prevent typing digits (0-9) immediately on keydown
        input.addEventListener('keydown', (e) => {
          // Allow functional and shortcut keys (Backspace, Tab, Enter, Arrows, Delete, Ctrl+A/C/V, etc.)
          if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
            return;
          }
          // Strictly disallow numeric digits (0-9)
          if (/[0-9]/.test(e.key)) {
            e.preventDefault();
            // Show inline error feedback that numbers are not allowed
            const formGroup = input.closest('.form-group') || input.parentElement;
            const feedback = formGroup ? formGroup.querySelector('.invalid-feedback') : null;
            input.classList.add('is-invalid');
            if (feedback) {
              feedback.textContent = 'Numbers are not allowed in the name (letters and spaces only).';
              feedback.style.display = 'block';
            }
          }
        });

        // 2. Prevent digit insertion on beforeinput (virtual keyboards, voice input)
        input.addEventListener('beforeinput', (e) => {
          if (e.data && /[0-9]/.test(e.data)) {
            e.preventDefault();
          }
        });

        // 3. Sanitizer: strips all digits (0-9) immediately
        const sanitizeName = () => {
          const original = input.value;
          const clean = original.replace(/[0-9]/g, '');
          if (original !== clean) {
            input.value = clean;
          }
        };

        input.addEventListener('input', () => {
          sanitizeName();
          validateFormField(input, true);
        });

        input.addEventListener('paste', () => {
          setTimeout(() => {
            sanitizeName();
            validateFormField(input, true);
          }, 0);
        });

        input.addEventListener('blur', () => {
          sanitizeName();
          validateFormField(input, false);
        });
      });

      // Select dropdowns
      const selects = form.querySelectorAll('select');
      selects.forEach(select => {
        select.addEventListener('change', () => {
          validateFormField(select, true);
        });
        select.addEventListener('blur', () => {
          validateFormField(select, false);
        });
      });

      // Other fields (event date, textarea, etc.)
      const otherInputs = form.querySelectorAll('input:not([type="tel"]):not(#pouchName):not([name*="name"]), textarea');
      otherInputs.forEach(input => {
        if (isPersonNameInput(input)) return;
        input.addEventListener('input', () => {
          validateFormField(input, true);
        });
        input.addEventListener('paste', () => {
          setTimeout(() => validateFormField(input, true), 0);
        });
        input.addEventListener('blur', () => {
          validateFormField(input, false);
        });
      });

      // Form submission handler
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const allFields = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;
        let firstInvalidField = null;

        allFields.forEach(field => {
          const fieldValid = validateFormField(field, false);
          if (!fieldValid) {
            isFormValid = false;
            if (!firstInvalidField) {
              firstInvalidField = field;
            }
          }
        });

        const alertSuccess = form.querySelector('.form-alert.success');
        const alertError = form.querySelector('.form-alert.error');

        if (!isFormValid) {
          if (alertSuccess) alertSuccess.style.display = 'none';
          if (alertError) {
            alertError.style.display = 'flex';
            alertError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          if (firstInvalidField) {
            firstInvalidField.focus();
          }
          return;
        }

        // All fields are valid
        if (alertError) alertError.style.display = 'none';

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Processing Enquiry...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          if (alertSuccess) {
            const span = alertSuccess.querySelector('span');
            if (span && !span.textContent.includes('Inquiry submitted successfully')) {
              span.textContent = 'Inquiry submitted successfully! Note: Form is validated and ready, but not yet connected to an active enquiry delivery service.';
            }
            alertSuccess.style.display = 'flex';
            alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          form.reset();
          form.querySelectorAll('select').forEach(sel => {
            sel.selectedIndex = 0;
            sel.classList.remove('is-invalid');
          });
          form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        }, 800);
      });
    });

    /* ==========================================================================
       8. Universal Site Toast & Newsletter Form Submission Handling
       ========================================================================== */
    /**
     * Displays a floating toast notification across the site.
     * @param {string} title - Heading of the notification
     * @param {string} message - Descriptive text
     * @param {'success'|'error'|'info'} type - Notification type
     */
    function showSiteToast(title, message, type = 'success') {
      let toast = document.getElementById('siteToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'siteToast';
        toast.className = 'site-toast';
        document.body.appendChild(toast);
      }

      const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
      toast.className = `site-toast toast-${type}`;
      toast.innerHTML = `
        <div class="site-toast-icon"><i class="bi ${iconClass}"></i></div>
        <div class="site-toast-content">
          <div class="site-toast-title">${title}</div>
          <div class="site-toast-desc">${message}</div>
        </div>
        <button class="site-toast-close" type="button" aria-label="Close notification">&times;</button>
      `;

      const closeBtn = toast.querySelector('.site-toast-close');
      if (closeBtn) {
        closeBtn.onclick = () => {
          toast.classList.remove('show');
        };
      }

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }
    window.AquaPureToast = showSiteToast;

    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
      const container = form.closest('.newsletter-form-container') || form.parentElement;
      const alertSuccess = container ? container.querySelector('.newsletter-alert-success') : null;
      const alertError = container ? container.querySelector('.newsletter-alert-error') : null;
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');

      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          if (alertError) alertError.style.display = 'none';
        });
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = input ? input.value.trim() : '';
        const isValidEmail = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (isValidEmail) {
          if (input) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          }
          if (alertError) alertError.style.display = 'none';
          if (alertSuccess) {
            alertSuccess.style.display = 'flex';
          }

          if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Subscribed!';
            btn.classList.add('btn-success');
            setTimeout(() => {
              btn.innerHTML = originalHTML;
              btn.classList.remove('btn-success');
            }, 3500);
          }

          // Show floating toast notification with success message
          showSiteToast(
            'Subscribed Successfully!',
            `Thank you for subscribing (${email}). You will receive our water quality updates and notices.`,
            'success'
          );

          if (input) {
            input.value = '';
            setTimeout(() => input.classList.remove('is-valid'), 2500);
          }

          setTimeout(() => {
            if (alertSuccess) alertSuccess.style.display = 'none';
          }, 6000);
        } else {
          if (input) {
            input.classList.add('is-invalid');
            input.focus();
          }
          if (alertSuccess) alertSuccess.style.display = 'none';
          if (alertError) {
            alertError.style.display = 'flex';
          }

          showSiteToast(
            'Invalid Email Address',
            'Please enter a valid email address (e.g. name@example.com).',
            'error'
          );
        }
      });
    });

    /* ==========================================================================
       9. Sample Quality Report Preview & Real PDF Download
       ========================================================================== */
    const REPORTS_CATALOG = {
      '20l-can': {
        title: '20L Commercial Can Batch Analysis Certificate',
        subtitle: 'Comprehensive Chemical Assay, 7-Stage Can Sanitization & Ozone Residue Verification',
        certNo: 'AP/QA/CAN-20L-108',
        sampleType: '20L Polycarbonate Multi-Trip Can',
        pdfUrl: 'assets/reports/aquapure-20l-can-batch-analysis.pdf',
        pdfFilename: 'AquaPure-20L-Can-Batch-Analysis.pdf',
        b64: 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgL0YyIDYgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNzEzMSA+PgpzdHJlYW0KMC4wNyAwLjY2IDAuODQgcmcKMCA3NDUgNTk1LjI4IDk3IHJlIGYKMC4wNCAwLjQ1IDAuNjAgcmcKMCA3NDAgNTk1LjI4IDUgcmUgZgpCVCAvRjEgMjAgVGYgMSAxIDEgcmcgNDAgNzk1IFRkIChBUVVBIFBVUkUgUEFDS0FHRUQgRFJJTktJTkcgV0FURVIpIFRqIEVUCkJUIC9GMiA5LjUgVGYgMC45MiAwLjk3IDEgcmcgNDAgNzczIFRkIChDRU5UUkFMIFFVQUxJVFkgQVNTVVJBTkNFICYgVEVTVElORyBMQUJPUkFUT1JZIHwgTkFCTCBBQ0NSRURJVEVEICYgQklTIElTIDE0NTQzKSBUaiBFVApCVCAvRjIgOC41IFRmIDAuODUgMC45NCAwLjk4IHJnIDQwIDc1NSBUZCAoSW5kdXN0cmlhbCBBcmVhIFBoYXNlIElJLCBTSVBDT1QgQ29tcGxleCB8IEZTU0FJIENlbnRyYWwgTGljZW5zZSBOby4gMTAwMTgwNDIwMDAwMDApIFRqIEVUCkJUIC9GMSAxNSBUZiAwLjA2IDAuMTggMC4yNyByZyA0MCA3MDUgVGQgKDIwTCBDb21tZXJjaWFsIENhbiBCYXRjaCBRdWFsaXR5IEFuYWx5c2lzIENlcnRpZmljYXRlKSBUaiBFVApCVCAvRjIgOS41IFRmIDAuMzkgMC40NSAwLjU0IHJnIDQwIDY4OSBUZCAoQ29tcHJlaGVuc2l2ZSBDaGVtaWNhbCBBc3NheSwgNy1TdGFnZSBDYW4gU2FuaXRpemF0aW9uICYgT3pvbmUgUmVzaWR1ZSBWZXJpZmljYXRpb24pIFRqIEVUCjAuOTMgMC45NyAwLjk5IHJnIDQwIDYxNSA1MTUuMjggNjIgcmUgZgowLjc1IDAuODggMC45NCBSRyAxIHcgNDAgNjE1IDUxNS4yOCA2MiByZSBTCkJUIC9GMiA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcKNTUgNjU4IFRkIChDZXJ0aWZpY2F0ZSBObzogQVAvUUEvQVEtMjAyNi1DQU4tMjBMLTEwOCkgVGogMTYwIDAgVGQgKFNhbXBsaW5nIERhdGU6IDA0LU5vdi0yMDI2KSBUaiAxNTAgMCBUZCAoVGVzdGluZyBDb21wbGV0ZWQ6IDA1LU5vdi0yMDI2KSBUaiBFVApCVCAvRjIgOC41IFRmIDAuMDYgMC4xOCAwLjI3IHJnCjU1IDYzOCBUZCAoQmF0Y2ggLyBMb3Q6IEFRLTIwMjYtQ0FOLTIwTC0xMDgpIFRqIDE2MCAwIFRkIChTYW1wbGUgRm9ybWF0OiAyMEwgUG9seWNhcmJvbmF0ZSBNdWx0aS1UcmlwIENhbikgVGogMTUwIDAgVGQgKFN0YXR1czogUEFTUyAvIENPTkZPUk1TKSBUaiBFVApCVCAvRjIgOC41IFRmIDAuMDYgMC4xOCAwLjI3IHJnCjU1IDYyMCBUZCAoVGVzdGluZyBQcm90b2NvbDogSVMgMzAyNSAvIElTIDE0NTQzKSBUaiAxNjAgMCBUZCAoU2FtcGxpbmcgTG9jYXRpb246IEF1dG9tYXRlZCBGaWxsZXIgTGluZSkgVGogMTUwIDAgVGQgKFJlbGVhc2UgQXV0aG9yaXphdGlvbjogRHIuIFMuIFJhbywgQ2hpZWYgQ2hlbWlzdCkgVGogRVQKMC4wNiAwLjE4IDAuMjcgcmcgNDAgNTc1IDUxNS4yOCAyNCByZSBmCkJUIC9GMSA4LjUgVGYgMSAxIDEgcmcgNTAgNTgzIFRkIChQYXJhbWV0ZXIgRXZhbHVhdGVkKSBUaiAxNTUgMCBUZCAoVGVzdCBNZXRob2QpIFRqIDg1IDAgVGQgKE9ic2VydmVkIFZhbHVlKSBUaiAxMTUgMCBUZCAoQklTIElTIDE0NTQzOjIwMTggTGltaXQpIFRqIDgwIDAgVGQgKFN0YXR1cykgVGogRVQKMC45NiAwLjk4IDEgcmcgNDAgNTUwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDU1MCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCA1NTUgVGQgKHBIIFZhbHVlIChhdCAyNSBkZWcgQykpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDExKSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDU1NSBUZCAoNy4yMikgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDU1NSBUZCAoNi41IC0gOC41KSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNTU1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA1MzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNTMwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDUzNSBUZCAoVG90YWwgRGlzc29sdmVkIFNvbGlkcyAoVERTKSkgVGogMTU1IDAgVGQgKElTIDMwMjUgKFBhcnQgMTYpKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNTM1IFRkICg5OC41IG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA1MzUgVGQgKDc1IC0gMTUwIG1nL0wpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCA1MzUgVGQgKFBBU1MpIFRqIEVUCjAuOTYgMC45OCAxIHJnIDQwIDUxMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCA1MTAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgNTE1IFRkIChUdXJiaWRpdHkpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDEwKSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDUxNSBUZCAoMC4wNiBOVFUpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA1MTUgVGQgKE1heCAyLjAgTlRVKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNTE1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0OTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDkwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQ5NSBUZCAoVG90YWwgSGFyZG5lc3MgKGFzIENhQ08zKSkgVGogMTU1IDAgVGQgKElTIDMwMjUgKFBhcnQgMjEpKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNDk1IFRkICg1NC4yIG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0OTUgVGQgKE1heCAyMDAgbWcvTCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDQ5NSBUZCAoUEFTUykgVGogRVQKMC45NiAwLjk4IDEgcmcgNDAgNDcwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDQ3MCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCA0NzUgVGQgKENhbGNpdW0gKGFzIENhKSkgVGogMTU1IDAgVGQgKElTIDMwMjUgKFBhcnQgNDApKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNDc1IFRkICgxOC40IG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0NzUgVGQgKE1heCA3NSBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDc1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0NTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQ1NSBUZCAoTWFnbmVzaXVtIChhcyBNZykpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDQ2KSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDQ1NSBUZCAoOC4yIG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0NTUgVGQgKE1heCAzMCBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDU1IFRkIChQQVNTKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCA0MzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDMwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQzNSBUZCAoQ2hsb3JpZGVzIChhcyBDbCkpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDMyKSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDQzNSBUZCAoMjIuOCBtZy9MKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgNDM1IFRkIChNYXggMjAwIG1nL0wpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCA0MzUgVGQgKFBBU1MpIFRqIEVUCjEgMSAxIHJnIDQwIDQxMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCA0MTAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgNDE1IFRkIChTdWxwaGF0ZXMgKGFzIFNPNCkpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDI0KSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDQxNSBUZCAoMTEuNSBtZy9MKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgNDE1IFRkIChNYXggMjAwIG1nL0wpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCA0MTUgVGQgKFBBU1MpIFRqIEVUCjAuOTYgMC45OCAxIHJnIDQwIDM5MCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCAzOTAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgMzk1IFRkIChSZXNpZHVhbCBPem9uZSBDb25jZW50cmF0aW9uKSBUaiAxNTUgMCBUZCAoRFBEIENvbG9yaW1ldHJpYykgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDM5NSBUZCAoMC4xNCBtZy9MKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgMzk1IFRkICgwLjEwIC0gMC4yMCBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgMzk1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCAzNzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgMzcwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDM3NSBUZCAoQWVyb2JpYyBNaWNyb2JpYWwgQ291bnQpIFRqIDE1NSAwIFRkIChJUyA1NDAyICgzNyBkZWcgQykpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCAzNzUgVGQgKDAgQ0ZVL21sKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgMzc1IFRkIChNYXggMjAgQ0ZVL21sKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgMzc1IFRkIChQQVNTKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCAzNTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgMzUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDM1NSBUZCAoVG90YWwgQ29saWZvcm0gQmFjdGVyaWEpIFRqIDE1NSAwIFRkIChJUyA1NDAxKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgMzU1IFRkIChBYnNlbnQgLyAyNTBtbCkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDM1NSBUZCAoQWJzZW50IGluIDI1MG1sKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgMzU1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCAzMzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgMzMwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDMzNSBUZCAoSW50ZXJuYWwgV2FzaCBBbGthbGluZSBSZXNpZHVlKSBUaiAxNTUgMCBUZCAoQWNpZC1CYXNlIFRpdHJhdGlvbikgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDMzNSBUZCAoTmlsICg8MC4wMDEgcHBtKSkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDMzNSBUZCAoVW5kZXRlY3RhYmxlKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgMzM1IFRkIChQQVNTKSBUaiBFVAowLjk0IDAuOTggMC45NiByZyA0MCAyNTIgNTE1LjI4IDQ4IHJlIGYKMC42NSAwLjg2IDAuNzUgUkcgMSB3IDQwIDI1MiA1MTUuMjggNDggcmUgUwpCVCAvRjEgOSBUZiAwLjA1IDAuNDUgMC4yNSByZyA1NSAyODYgVGQgKFNUQVRVVE9SWSBMQUJPUkFUT1JZIENPTkNMVVNJT04gJiBESVNQQVRDSCBDTEVBUkFOQ0U6KSBUaiBFVApCVCAvRjIgOC41IFRmIDAuMTUgMC4yMiAwLjMwIHJnIDU1IDI3MiBUZCAoVGhpcyBiYXRjaCBzYW1wbGUgY29uZm9ybXMgaW4gYWxsIG1lYXN1cmVkIHBoeXNpY2FsLCBjaGVtaWNhbCwgYW5kIG1pY3JvYmlvbG9naWNhbCBwYXJhbWV0ZXJzIHRvIElTIDE0NTQzOjIwMTgpIFRqIEVUCkJUIC9GMiA4LjUgVGYgMC4xNSAwLjIyIDAuMzAgcmcgNTUgMjYwIFRkIChzcGVjaWZpY2F0aW9ucy4gVGhlIHByb2R1Y3Rpb24gYmF0Y2ggaXMgY2VydGlmaWVkIHNhZmUsIHN0ZXJpbGUsIGFuZCBmb3JtYWxseSByZWxlYXNlZCBmb3IgY29uc3VtZXIgZGlzdHJpYnV0aW9uLikgVGogRVQKMC44OCAwLjkyIDAuOTUgUkcgMSB3IDQwIDIyMCAxNDAgMC4xIHJlIFMKMC44OCAwLjkyIDAuOTUgUkcgMSB3IDIyNSAyMjAgMTQwIDAuMSByZSBTCjAuODggMC45MiAwLjk1IFJHIDEgdyA0MTUgMjIwIDE0MCAwLjEgcmUgUwpCVCAvRjEgOC41IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDQwIDIwOCBUZCAoVC4gTi4gU2hhcm1hLCBNLlNjLikgVGogRVQKQlQgL0YyIDcuNSBUZiAwLjQ1IDAuNTAgMC41OCByZyA0MCAxOTggVGQgKFNlbmlvciBBbmFseXRpY2FsIENoZW1pc3QpIFRqIEVUCkJUIC9GMSA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjI1IDIwOCBUZCAoRHIuIFMuIFJhbywgUGguRC4pIFRqIEVUCkJUIC9GMiA3LjUgVGYgMC40NSAwLjUwIDAuNTggcmcgMjI1IDE5OCBUZCAoQ2hpZWYgUXVhbGl0eSBDb250cm9sbGVyKSBUaiBFVApCVCAvRjEgOC41IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDQxNSAyMDggVGQgKEVyLiBNLiBWZW5rYXRlc2gpIFRqIEVUCkJUIC9GMiA3LjUgVGYgMC40NSAwLjUwIDAuNTggcmcgNDE1IDE5OCBUZCAoUGxhbnQgT3BlcmF0aW9ucyBEaXJlY3RvcikgVGogRVQKMC44NSAwLjkwIDAuOTUgUkcgMSB3IDQwIDQ1IDUxNS4yOCAwLjEgcmUgUwpCVCAvRjIgNy41IFRmIDAuNDUgMC41MCAwLjU4IHJnIDQwIDM0IFRkIChBcXVhUHVyZSBXYXRlciBQbGFudCBQdnQgTHRkIHwgT2ZmaWNpYWwgUXVhbGl0eSBDZXJ0aWZpY2F0ZSB8IFZlcmlmaWFibGUgdmlhIEJhdGNoIFFSIENvZGUgb24gQ29udGFpbmVyKSBUaiBFVApCVCAvRjIgNy41IFRmIDAuNDUgMC41MCAwLjU4IHJnIDQ4MCAzNCBUZCAoUGFnZSAxIG9mIDEpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZCA+PgplbmRvYmoKNiAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDI2MyAwMDAwMCBuIAowMDAwMDA3NDQ2IDAwMDAwIG4gCjAwMDAwMDc1MjEgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA3IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo3NTkxCiUlRU9GCg==',
        parameters: [
          { name: 'pH Value (at 25°C)', method: 'IS 3025 (Part 11)', val: '7.22', limit: '6.5 - 8.5', status: 'PASS' },
          { name: 'Total Dissolved Solids (TDS)', method: 'IS 3025 (Part 16)', val: '98.5 mg/L', limit: '75 - 150 mg/L', status: 'PASS' },
          { name: 'Turbidity', method: 'IS 3025 (Part 10)', val: '0.06 NTU', limit: 'Max 2.0 NTU', status: 'PASS' },
          { name: 'Total Hardness (as CaCO3)', method: 'IS 3025 (Part 21)', val: '54.2 mg/L', limit: 'Max 200 mg/L', status: 'PASS' },
          { name: 'Calcium (as Ca)', method: 'IS 3025 (Part 40)', val: '18.4 mg/L', limit: 'Max 75 mg/L', status: 'PASS' },
          { name: 'Magnesium (as Mg)', method: 'IS 3025 (Part 46)', val: '8.2 mg/L', limit: 'Max 30 mg/L', status: 'PASS' },
          { name: 'Chlorides (as Cl)', method: 'IS 3025 (Part 32)', val: '22.8 mg/L', limit: 'Max 200 mg/L', status: 'PASS' },
          { name: 'Sulphates (as SO4)', method: 'IS 3025 (Part 24)', val: '11.5 mg/L', limit: 'Max 200 mg/L', status: 'PASS' },
          { name: 'Residual Ozone Concentration', method: 'DPD Colorimetric', val: '0.14 mg/L', limit: '0.10 - 0.20 mg/L', status: 'PASS' },
          { name: 'Aerobic Microbial Count', method: 'IS 5402 (37°C)', val: '0 CFU/ml', limit: 'Max 20 CFU/ml', status: 'PASS' },
          { name: 'Total Coliform Bacteria', method: 'IS 5401', val: 'Absent / 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Internal Wash Alkaline Residue', method: 'Acid-Base Titration', val: 'Nil (<0.001 ppm)', limit: 'Undetectable', status: 'PASS' }
        ]
      },
      '1l-bottle': {
        title: '1L PET Bottle Analytical & Mineral Quality Log',
        subtitle: 'Preform Virgin Polymer Certificate, Hermetic Cap Torque & Mineral Balance Log',
        certNo: 'AP/QA/BOT-1L-442',
        sampleType: '1L Food-Grade Virgin PET Bottle',
        pdfUrl: 'assets/reports/aquapure-1l-pet-bottle-quality-log.pdf',
        pdfFilename: 'AquaPure-1L-PET-Bottle-Quality-Log.pdf',
        b64: 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgL0YyIDYgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNzE1MSA+PgpzdHJlYW0KMC4wNyAwLjY2IDAuODQgcmcKMCA3NDUgNTk1LjI4IDk3IHJlIGYKMC4wNCAwLjQ1IDAuNjAgcmcKMCA3NDAgNTk1LjI4IDUgcmUgZgpCVCAvRjEgMjAgVGYgMSAxIDEgcmcgNDAgNzk1IFRkIChBUVVBIFBVUkUgUEFDS0FHRUQgRFJJTktJTkcgV0FURVIpIFRqIEVUCkJUIC9GMiA5LjUgVGYgMC45MiAwLjk3IDEgcmcgNDAgNzczIFRkIChDRU5UUkFMIFFVQUxJVFkgQVNTVVJBTkNFICYgVEVTVElORyBMQUJPUkFUT1JZIHwgTkFCTCBBQ0NSRURJVEVEICYgQklTIElTIDE0NTQzKSBUaiBFVApCVCAvRjIgOC41IFRmIDAuODUgMC45NCAwLjk4IHJnIDQwIDc1NSBUZCAoSW5kdXN0cmlhbCBBcmVhIFBoYXNlIElJLCBTSVBDT1QgQ29tcGxleCB8IEZTU0FJIENlbnRyYWwgTGljZW5zZSBOby4gMTAwMTgwNDIwMDAwMDApIFRqIEVUCkJUIC9GMSAxNSBUZiAwLjA2IDAuMTggMC4yNyByZyA0MCA3MDUgVGQgKDFMIFBFVCBCb3R0bGUgQW5hbHl0aWNhbCAmIE1pbmVyYWwgUXVhbGl0eSBMb2cpIFRqIEVUCkJUIC9GMiA5LjUgVGYgMC4zOSAwLjQ1IDAuNTQgcmcgNDAgNjg5IFRkIChQcmVmb3JtIFZpcmdpbiBQb2x5bWVyIENlcnRpZmljYXRlLCBIZXJtZXRpYyBDYXAgVG9ycXVlICYgTWluZXJhbCBCYWxhbmNlIExvZykgVGogRVQKMC45MyAwLjk3IDAuOTkgcmcgNDAgNjE1IDUxNS4yOCA2MiByZSBmCjAuNzUgMC44OCAwLjk0IFJHIDEgdyA0MCA2MTUgNTE1LjI4IDYyIHJlIFMKQlQgL0YyIDguNSBUZiAwLjA2IDAuMTggMC4yNyByZwo1NSA2NTggVGQgKENlcnRpZmljYXRlIE5vOiBBUC9RQS9BUS0yMDI2LUJPVC0xTC00NDIpIFRqIDE2MCAwIFRkIChTYW1wbGluZyBEYXRlOiAwNC1Ob3YtMjAyNikgVGogMTUwIDAgVGQgKFRlc3RpbmcgQ29tcGxldGVkOiAwNS1Ob3YtMjAyNikgVGogRVQKQlQgL0YyIDguNSBUZiAwLjA2IDAuMTggMC4yNyByZwo1NSA2MzggVGQgKEJhdGNoIC8gTG90OiBBUS0yMDI2LUJPVC0xTC00NDIpIFRqIDE2MCAwIFRkIChTYW1wbGUgRm9ybWF0OiAxTCBGb29kLUdyYWRlIFZpcmdpbiBQRVQgQm90dGxlKSBUaiAxNTAgMCBUZCAoU3RhdHVzOiBQQVNTIC8gQ09ORk9STVMpIFRqIEVUCkJUIC9GMiA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcKNTUgNjIwIFRkIChUZXN0aW5nIFByb3RvY29sOiBJUyAzMDI1IC8gSVMgMTQ1NDMpIFRqIDE2MCAwIFRkIChTYW1wbGluZyBMb2NhdGlvbjogQXV0b21hdGVkIEZpbGxlciBMaW5lKSBUaiAxNTAgMCBUZCAoUmVsZWFzZSBBdXRob3JpemF0aW9uOiBEci4gUy4gUmFvLCBDaGllZiBDaGVtaXN0KSBUaiBFVAowLjA2IDAuMTggMC4yNyByZyA0MCA1NzUgNTE1LjI4IDI0IHJlIGYKQlQgL0YxIDguNSBUZiAxIDEgMSByZyA1MCA1ODMgVGQgKFBhcmFtZXRlciBFdmFsdWF0ZWQpIFRqIDE1NSAwIFRkIChUZXN0IE1ldGhvZCkgVGogODUgMCBUZCAoT2JzZXJ2ZWQgVmFsdWUpIFRqIDExNSAwIFRkIChCSVMgSVMgMTQ1NDM6MjAxOCBMaW1pdCkgVGogODAgMCBUZCAoU3RhdHVzKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCA1NTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNTUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDU1NSBUZCAocEggVmFsdWUgKGF0IDI1IGRlZyBDKSkgVGogMTU1IDAgVGQgKElTIDMwMjUgKFBhcnQgMTEpKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNTU1IFRkICg3LjE4KSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgNTU1IFRkICg2LjUgLSA4LjUpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCA1NTUgVGQgKFBBU1MpIFRqIEVUCjEgMSAxIHJnIDQwIDUzMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCA1MzAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgNTM1IFRkIChUb3RhbCBEaXNzb2x2ZWQgU29saWRzIChURFMpKSBUaiAxNTUgMCBUZCAoSVMgMzAyNSAoUGFydCAxNikpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCA1MzUgVGQgKDEwNC4wIG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA1MzUgVGQgKDc1IC0gMTUwIG1nL0wpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCA1MzUgVGQgKFBBU1MpIFRqIEVUCjAuOTYgMC45OCAxIHJnIDQwIDUxMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCA1MTAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgNTE1IFRkIChUdXJiaWRpdHkpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDEwKSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDUxNSBUZCAoMC4wNSBOVFUpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA1MTUgVGQgKE1heCAyLjAgTlRVKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNTE1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0OTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDkwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQ5NSBUZCAoVG90YWwgSGFyZG5lc3MgKGFzIENhQ08zKSkgVGogMTU1IDAgVGQgKElTIDMwMjUgKFBhcnQgMjEpKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNDk1IFRkICg1Ni4wIG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0OTUgVGQgKE1heCAyMDAgbWcvTCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDQ5NSBUZCAoUEFTUykgVGogRVQKMC45NiAwLjk4IDEgcmcgNDAgNDcwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDQ3MCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCA0NzUgVGQgKENhbGNpdW0gKGFzIENhKSkgVGogMTU1IDAgVGQgKElTIDMwMjUgKFBhcnQgNDApKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNDc1IFRkICgxOS4yIG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0NzUgVGQgKE1heCA3NSBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDc1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0NTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQ1NSBUZCAoTWFnbmVzaXVtIChhcyBNZykpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDQ2KSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDQ1NSBUZCAoOC44IG1nL0wpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0NTUgVGQgKE1heCAzMCBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDU1IFRkIChQQVNTKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCA0MzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDMwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQzNSBUZCAoVG90YWwgQWxrYWxpbml0eSAoYXMgSENPMykpIFRqIDE1NSAwIFRkIChJUyAzMDI1IChQYXJ0IDIzKSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDQzNSBUZCAoNDguMCBtZy9MKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgNDM1IFRkIChNYXggMjAwIG1nL0wpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCA0MzUgVGQgKFBBU1MpIFRqIEVUCjEgMSAxIHJnIDQwIDQxMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCA0MTAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgNDE1IFRkIChGbHVvcmlkZXMgKGFzIEYpKSBUaiAxNTUgMCBUZCAoSVMgMzAyNSAoUGFydCA2MCkpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCA0MTUgVGQgKDAuMTggbWcvTCkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDQxNSBUZCAoTWF4IDEuMCBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDE1IFRkIChQQVNTKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCAzOTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgMzkwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDM5NSBUZCAoSGVhdnkgTWV0YWxzIChMZWFkLCBDYWRtaXVtLCBBcnNlbmljKSkgVGogMTU1IDAgVGQgKElDUC1NUyBBbmFseXNpcykgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDM5NSBUZCAoVW5kZXRlY3RhYmxlICg8MC4wMDEpKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgMzk1IFRkIChNYXggMC4wMSBtZy9MKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgMzk1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCAzNzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgMzcwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDM3NSBUZCAoUHJlZm9ybSBQb2x5bWVyIFZpcmdpbiBQdXJpdHkpIFRqIDE1NSAwIFRkIChGVElSIFNwZWN0cm9tZXRyeSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDM3NSBUZCAoMTAwJSBWaXJnaW4gRm9vZC1HcmFkZSkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDM3NSBUZCAoQ29tcGxpYW50KSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgMzc1IFRkIChQQVNTKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCAzNTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgMzUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDM1NSBUZCAoQ2FwIFJlbW92YWwgVG9ycXVlKSBUaiAxNTUgMCBUZCAoRGlnaXRhbCBUb3JxdWUgR2F1Z2UpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCAzNTUgVGQgKDE0LjUgaW5jaC1sYnMpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSAzNTUgVGQgKDEyIC0gMTggaW5jaC1sYnMpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCAzNTUgVGQgKFBBU1MpIFRqIEVUCjEgMSAxIHJnIDQwIDMzMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCAzMzAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgMzM1IFRkIChUb3RhbCBWaWFibGUgQ29sb255IENvdW50KSBUaiAxNTUgMCBUZCAoQWdhciBQb3VyIFBsYXRlIDQ4aCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDMzNSBUZCAoMCBDRlUvbWwpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSAzMzUgVGQgKE1heCAyMCBDRlUvbWwpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCAzMzUgVGQgKFBBU1MpIFRqIEVUCjAuOTQgMC45OCAwLjk2IHJnIDQwIDI1MiA1MTUuMjggNDggcmUgZgowLjY1IDAuODYgMC43NSBSRyAxIHcgNDAgMjUyIDUxNS4yOCA0OCByZSBTCkJUIC9GMSA5IFRmIDAuMDUgMC40NSAwLjI1IHJnIDU1IDI4NiBUZCAoU1RBVFVUT1JZIExBQk9SQVRPUlkgQ09OQ0xVU0lPTiAmIERJU1BBVENIIENMRUFSQU5DRTopIFRqIEVUCkJUIC9GMiA4LjUgVGYgMC4xNSAwLjIyIDAuMzAgcmcgNTUgMjcyIFRkIChUaGlzIGJhdGNoIHNhbXBsZSBjb25mb3JtcyBpbiBhbGwgbWVhc3VyZWQgcGh5c2ljYWwsIGNoZW1pY2FsLCBhbmQgbWljcm9iaW9sb2dpY2FsIHBhcmFtZXRlcnMgdG8gSVMgMTQ1NDM6MjAxOCkgVGogRVQKQlQgL0YyIDguNSBUZiAwLjE1IDAuMjIgMC4zMCByZyA1NSAyNjAgVGQgKHNwZWNpZmljYXRpb25zLiBUaGUgcHJvZHVjdGlvbiBiYXRjaCBpcyBjZXJ0aWZpZWQgc2FmZSwgc3RlcmlsZSwgYW5kIGZvcm1hbGx5IHJlbGVhc2VkIGZvciBjb25zdW1lciBkaXN0cmlidXRpb24uKSBUaiBFVAowLjg4IDAuOTIgMC45NSBSRyAxIHcgNDAgMjIwIDE0MCAwLjEgcmUgUwowLjg4IDAuOTIgMC45NSBSRyAxIHcgMjI1IDIyMCAxNDAgMC4xIHJlIFMKMC44OCAwLjkyIDAuOTUgUkcgMSB3IDQxNSAyMjAgMTQwIDAuMSByZSBTCkJUIC9GMSA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcgNDAgMjA4IFRkIChULiBOLiBTaGFybWEsIE0uU2MuKSBUaiBFVApCVCAvRjIgNy41IFRmIDAuNDUgMC41MCAwLjU4IHJnIDQwIDE5OCBUZCAoU2VuaW9yIEFuYWx5dGljYWwgQ2hlbWlzdCkgVGogRVQKQlQgL0YxIDguNSBUZiAwLjA2IDAuMTggMC4yNyByZyAyMjUgMjA4IFRkIChEci4gUy4gUmFvLCBQaC5ELikgVGogRVQKQlQgL0YyIDcuNSBUZiAwLjQ1IDAuNTAgMC41OCByZyAyMjUgMTk4IFRkIChDaGllZiBRdWFsaXR5IENvbnRyb2xsZXIpIFRqIEVUCkJUIC9GMSA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcgNDE1IDIwOCBUZCAoRXIuIE0uIFZlbmthdGVzaCkgVGogRVQKQlQgL0YyIDcuNSBUZiAwLjQ1IDAuNTAgMC41OCByZyA0MTUgMTk4IFRkIChQbGFudCBPcGVyYXRpb25zIERpcmVjdG9yKSBUaiBFVAowLjg1IDAuOTAgMC45NSBSRyAxIHcgNDAgNDUgNTE1LjI4IDAuMSByZSBTCkJUIC9GMiA3LjUgVGYgMC40NSAwLjUwIDAuNTggcmcgNDAgMzQgVGQgKEFxdWFQdXJlIFdhdGVyIFBsYW50IFB2dCBMdGQgfCBPZmZpY2lhbCBRdWFsaXR5IENlcnRpZmljYXRlIHwgVmVyaWZpYWJsZSB2aWEgQmF0Y2ggUVIgQ29kZSBvbiBDb250YWluZXIpIFRqIEVUCkJUIC9GMiA3LjUgVGYgMC40NSAwLjUwIDAuNTggcmcgNDgwIDM0IFRkIChQYWdlIDEgb2YgMSkgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkID4+CmVuZG9iago2IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjQgMDAwMDAgbiAKMDAwMDAwMDEyMSAwMDAwMCBuIAowMDAwMDAwMjYzIDAwMDAwIG4gCjAwMDAwMDc0NjYgMDAwMDAgbiAKMDAwMDAwNzU0MSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDcgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjc2MTEKJSVFT0YK',
        parameters: [
          { name: 'pH Value (at 25°C)', method: 'IS 3025 (Part 11)', val: '7.18', limit: '6.5 - 8.5', status: 'PASS' },
          { name: 'Total Dissolved Solids (TDS)', method: 'IS 3025 (Part 16)', val: '104.0 mg/L', limit: '75 - 150 mg/L', status: 'PASS' },
          { name: 'Turbidity', method: 'IS 3025 (Part 10)', val: '0.05 NTU', limit: 'Max 2.0 NTU', status: 'PASS' },
          { name: 'Total Hardness (as CaCO3)', method: 'IS 3025 (Part 21)', val: '56.0 mg/L', limit: 'Max 200 mg/L', status: 'PASS' },
          { name: 'Calcium (as Ca)', method: 'IS 3025 (Part 40)', val: '19.2 mg/L', limit: 'Max 75 mg/L', status: 'PASS' },
          { name: 'Magnesium (as Mg)', method: 'IS 3025 (Part 46)', val: '8.8 mg/L', limit: 'Max 30 mg/L', status: 'PASS' },
          { name: 'Total Alkalinity (as HCO3)', method: 'IS 3025 (Part 23)', val: '48.0 mg/L', limit: 'Max 200 mg/L', status: 'PASS' },
          { name: 'Fluorides (as F)', method: 'IS 3025 (Part 60)', val: '0.18 mg/L', limit: 'Max 1.0 mg/L', status: 'PASS' },
          { name: 'Heavy Metals (Lead, Cadmium, Arsenic)', method: 'ICP-MS Analysis', val: 'Undetectable (<0.001)', limit: 'Max 0.01 mg/L', status: 'PASS' },
          { name: 'Preform Polymer Virgin Purity', method: 'FTIR Spectrometry', val: '100% Virgin Food-Grade', limit: 'Compliant', status: 'PASS' },
          { name: 'Cap Removal Torque', method: 'Digital Torque Gauge', val: '14.5 inch-lbs', limit: '12 - 18 inch-lbs', status: 'PASS' },
          { name: 'Total Viable Colony Count', method: 'Agar Pour Plate 48h', val: '0 CFU/ml', limit: 'Max 20 CFU/ml', status: 'PASS' }
        ]
      },
      'microbiological-sterility': {
        title: 'Microbiological Sterility & Pathogen Cleared Test Certificate',
        subtitle: 'Certified 48-Hour Agar Plate Incubation, Coliform, Yeast & Mold Analysis',
        certNo: 'AP/QA/MIC-STER-901',
        sampleType: 'Finished Goods Multi-Format Random Composite',
        pdfUrl: 'assets/reports/aquapure-microbiological-sterility-report.pdf',
        pdfFilename: 'AquaPure-Microbiological-Sterility-Report.pdf',
        b64: 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgL0YyIDYgMCBSID4+ID4+ID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNzMzOSA+PgpzdHJlYW0KMC4wNyAwLjY2IDAuODQgcmcKMCA3NDUgNTk1LjI4IDk3IHJlIGYKMC4wNCAwLjQ1IDAuNjAgcmcKMCA3NDAgNTk1LjI4IDUgcmUgZgpCVCAvRjEgMjAgVGYgMSAxIDEgcmcgNDAgNzk1IFRkIChBUVVBIFBVUkUgUEFDS0FHRUQgRFJJTktJTkcgV0FURVIpIFRqIEVUCkJUIC9GMiA5LjUgVGYgMC45MiAwLjk3IDEgcmcgNDAgNzczIFRkIChDRU5UUkFMIFFVQUxJVFkgQVNTVVJBTkNFICYgVEVTVElORyBMQUJPUkFUT1JZIHwgTkFCTCBBQ0NSRURJVEVEICYgQklTIElTIDE0NTQzKSBUaiBFVApCVCAvRjIgOC41IFRmIDAuODUgMC45NCAwLjk4IHJnIDQwIDc1NSBUZCAoSW5kdXN0cmlhbCBBcmVhIFBoYXNlIElJLCBTSVBDT1QgQ29tcGxleCB8IEZTU0FJIENlbnRyYWwgTGljZW5zZSBOby4gMTAwMTgwNDIwMDAwMDApIFRqIEVUCkJUIC9GMSAxNSBUZiAwLjA2IDAuMTggMC4yNyByZyA0MCA3MDUgVGQgKE1pY3JvYmlvbG9naWNhbCBTdGVyaWxpdHkgJiBQYXRob2dlbiBDbGVhcmVkIFRlc3QgQ2VydGlmaWNhdGUpIFRqIEVUCkJUIC9GMiA5LjUgVGYgMC4zOSAwLjQ1IDAuNTQgcmcgNDAgNjg5IFRkIChDZXJ0aWZpZWQgNDgtSG91ciBBZ2FyIFBsYXRlIEluY3ViYXRpb24sIENvbGlmb3JtLCBZZWFzdCAmIE1vbGQgQW5hbHlzaXMpIFRqIEVUCjAuOTMgMC45NyAwLjk5IHJnIDQwIDYxNSA1MTUuMjggNjIgcmUgZgowLjc1IDAuODggMC45NCBSRyAxIHcgNDAgNjE1IDUxNS4yOCA2MiByZSBTCkJUIC9GMiA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcKNTUgNjU4IFRkIChDZXJ0aWZpY2F0ZSBObzogQVAvUUEvQVEtMjAyNi1NSUMtU1RFUi05MDEpIFRqIDE2MCAwIFRkIChTYW1wbGluZyBEYXRlOiAwNC1Ob3YtMjAyNikgVGogMTUwIDAgVGQgKFRlc3RpbmcgQ29tcGxldGVkOiAwNS1Ob3YtMjAyNikgVGogRVQKQlQgL0YyIDguNSBUZiAwLjA2IDAuMTggMC4yNyByZwo1NSA2MzggVGQgKEJhdGNoIC8gTG90OiBBUS0yMDI2LU1JQy1TVEVSLTkwMSkgVGogMTYwIDAgVGQgKFNhbXBsZSBGb3JtYXQ6IEZpbmlzaGVkIEdvb2RzIE11bHRpLUZvcm1hdCBSYW5kb20gQ29tcG9zaXRlKSBUaiAxNTAgMCBUZCAoU3RhdHVzOiBQQVNTIC8gQ09ORk9STVMpIFRqIEVUCkJUIC9GMiA4LjUgVGYgMC4wNiAwLjE4IDAuMjcgcmcKNTUgNjIwIFRkIChUZXN0aW5nIFByb3RvY29sOiBJUyAzMDI1IC8gSVMgMTQ1NDMpIFRqIDE2MCAwIFRkIChTYW1wbGluZyBMb2NhdGlvbjogQXV0b21hdGVkIEZpbGxlciBMaW5lKSBUaiAxNTAgMCBUZCAoUmVsZWFzZSBBdXRob3JpemF0aW9uOiBEci4gUy4gUmFvLCBDaGllZiBDaGVtaXN0KSBUaiBFVAowLjA2IDAuMTggMC4yNyByZyA0MCA1NzUgNTE1LjI4IDI0IHJlIGYKQlQgL0YxIDguNSBUZiAxIDEgMSByZyA1MCA1ODMgVGQgKFBhcmFtZXRlciBFdmFsdWF0ZWQpIFRqIDE1NSAwIFRkIChUZXN0IE1ldGhvZCkgVGogODUgMCBUZCAoT2JzZXJ2ZWQgVmFsdWUpIFRqIDExNSAwIFRkIChCSVMgSVMgMTQ1NDM6MjAxOCBMaW1pdCkgVGogODAgMCBUZCAoU3RhdHVzKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCA1NTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNTUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDU1NSBUZCAoQWVyb2JpYyBNaWNyb2JpYWwgQ291bnQgKDIwLTIyIGRlZyBDKSkgVGogMTU1IDAgVGQgKElTIDU0MDIgLyA3MmggUGxhdGUpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCA1NTUgVGQgKDAgQ0ZVL21sKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgNTU1IFRkIChNYXggMTAwIENGVS9tbCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDU1NSBUZCAoUEFTUykgVGogRVQKMSAxIDEgcmcgNDAgNTMwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDUzMCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCA1MzUgVGQgKEFlcm9iaWMgTWljcm9iaWFsIENvdW50ICgzNyBkZWcgQykpIFRqIDE1NSAwIFRkIChJUyA1NDAyIC8gMjRoIFBsYXRlKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNTM1IFRkICgwIENGVS9tbCkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDUzNSBUZCAoTWF4IDIwIENGVS9tbCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDUzNSBUZCAoUEFTUykgVGogRVQKMC45NiAwLjk4IDEgcmcgNDAgNTEwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDUxMCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCA1MTUgVGQgKFRvdGFsIENvbGlmb3JtIEJhY3RlcmlhKSBUaiAxNTUgMCBUZCAoSVMgNTQwMSBNZW1icmFuZSBGaWx0ZXIpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCA1MTUgVGQgKEFic2VudCBpbiAyNTBtbCkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDUxNSBUZCAoQWJzZW50IGluIDI1MG1sKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNTE1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0OTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDkwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQ5NSBUZCAoRmFlY2FsIFN0cmVwdG9jb2NjaSkgVGogMTU1IDAgVGQgKElTIDU4ODcgTWVtYnJhbmUgRmlsdGVyKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNDk1IFRkIChBYnNlbnQgaW4gMjUwbWwpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0OTUgVGQgKEFic2VudCBpbiAyNTBtbCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDQ5NSBUZCAoUEFTUykgVGogRVQKMC45NiAwLjk4IDEgcmcgNDAgNDcwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDQ3MCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCA0NzUgVGQgKFN0YXBoeWxvY29jY3VzIEF1cmV1cykgVGogMTU1IDAgVGQgKElTIDU4ODcgKFBhcnQgMikpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCA0NzUgVGQgKEFic2VudCBpbiAyNTBtbCkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDQ3NSBUZCAoQWJzZW50IGluIDI1MG1sKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDc1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0NTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDUwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQ1NSBUZCAoUHNldWRvbW9uYXMgQWVydWdpbm9zYSkgVGogMTU1IDAgVGQgKElTIDEzNDI4IEFubmV4IEQpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCA0NTUgVGQgKEFic2VudCBpbiAyNTBtbCkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDQ1NSBUZCAoQWJzZW50IGluIDI1MG1sKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDU1IFRkIChQQVNTKSBUaiBFVAowLjk2IDAuOTggMSByZyA0MCA0MzAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDMwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQzNSBUZCAoU3VscGhpdGUtUmVkdWNpbmcgQW5hZXJvYmVzKSBUaiAxNTUgMCBUZCAoSVMgMTM0MjggQW5uZXggQykgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDQzNSBUZCAoQWJzZW50IGluIDUwbWwpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0MzUgVGQgKEFic2VudCBpbiA1MG1sKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA1IDAuNTggMC4zNSByZyA0OTAgNDM1IFRkIChQQVNTKSBUaiBFVAoxIDEgMSByZyA0MCA0MTAgNTE1LjI4IDIwIHJlIGYKMC44NSAwLjkwIDAuOTQgUkcgMC41IHcgNDAgNDEwIDUxNS4yOCAyMCByZSBTCkJUIC9GMiA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDUwIDQxNSBUZCAoVmlicmlvIENob2xlcmFlICYgU2FsbW9uZWxsYSkgVGogMTU1IDAgVGQgKElTIDU4ODcgKFBhcnQgMSAmIDMpKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgNDE1IFRkIChBYnNlbnQgaW4gMjUwbWwpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSA0MTUgVGQgKEFic2VudCBpbiAyNTBtbCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDQxNSBUZCAoUEFTUykgVGogRVQKMC45NiAwLjk4IDEgcmcgNDAgMzkwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDM5MCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCAzOTUgVGQgKFllYXN0IGFuZCBNb3VsZCBDb3VudCkgVGogMTU1IDAgVGQgKElTIDU0MDMgU2Fib3VyYXVkIERleHRyb3NlKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgMzk1IFRkIChBYnNlbnQgaW4gMjUwbWwpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSAzOTUgVGQgKEFic2VudCBpbiAyNTBtbCkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDM5NSBUZCAoUEFTUykgVGogRVQKMSAxIDEgcmcgNDAgMzcwIDUxNS4yOCAyMCByZSBmCjAuODUgMC45MCAwLjk0IFJHIDAuNSB3IDQwIDM3MCA1MTUuMjggMjAgcmUgUwpCVCAvRjIgOCBUZiAwLjA2IDAuMTggMC4yNyByZyA1MCAzNzUgVGQgKENsZWFucm9vbSBMYW1pbmFyIEFpciBQYXJ0aWNsZSBDb3VudCkgVGogMTU1IDAgVGQgKElTTyBDbGFzcyA1IExhc2VyIENvdW50ZXIpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDI5MCAzNzUgVGQgKDAgcGFydGljbGVzID4gMC41IHVtKSBUaiBFVApCVCAvRjIgOCBUZiAwLjM1IDAuNDAgMC40OCByZyAzNzUgMzc1IFRkIChNYXggMyw1MjAvbTMpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCAzNzUgVGQgKFBBU1MpIFRqIEVUCjAuOTYgMC45OCAxIHJnIDQwIDM1MCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCAzNTAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgMzU1IFRkIChDYXBwaW5nIEhlYWQgU3RlcmlsaXR5IFN3YWIpIFRqIDE1NSAwIFRkIChBVFAgQmlvbHVtaW5lc2NlbmNlKSBUaiBFVApCVCAvRjEgOCBUZiAwLjA2IDAuMTggMC4yNyByZyAyOTAgMzU1IFRkICgwIFJMVSAoU3RlcmlsZSkpIFRqIEVUCkJUIC9GMiA4IFRmIDAuMzUgMC40MCAwLjQ4IHJnIDM3NSAzNTUgVGQgKE1heCAxMCBSTFUpIFRqIEVUCkJUIC9GMSA4IFRmIDAuMDUgMC41OCAwLjM1IHJnIDQ5MCAzNTUgVGQgKFBBU1MpIFRqIEVUCjEgMSAxIHJnIDQwIDMzMCA1MTUuMjggMjAgcmUgZgowLjg1IDAuOTAgMC45NCBSRyAwLjUgdyA0MCAzMzAgNTE1LjI4IDIwIHJlIFMKQlQgL0YyIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgNTAgMzM1IFRkIChJbmN1YmF0aW9uIFZlcmRpY3QpIFRqIDE1NSAwIFRkIChDZXJ0aWZpZWQgUGF0aG9nZW4tRnJlZSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNiAwLjE4IDAuMjcgcmcgMjkwIDMzNSBUZCAoU3RlcmlsZSAvIE5vbi1SZWFjdGl2ZSkgVGogRVQKQlQgL0YyIDggVGYgMC4zNSAwLjQwIDAuNDggcmcgMzc1IDMzNSBUZCAoQ2xlYXJlZCBmb3IgUmVsZWFzZSkgVGogRVQKQlQgL0YxIDggVGYgMC4wNSAwLjU4IDAuMzUgcmcgNDkwIDMzNSBUZCAoUEFTUykgVGogRVQKMC45NCAwLjk4IDAuOTYgcmcgNDAgMjUyIDUxNS4yOCA0OCByZSBmCjAuNjUgMC44NiAwLjc1IFJHIDEgdyA0MCAyNTIgNTE1LjI4IDQ4IHJlIFMKQlQgL0YxIDkgVGYgMC4wNSAwLjQ1IDAuMjUgcmcgNTUgMjg2IFRkIChTVEFUVVRPUlkgTEFCT1JBVE9SWSBDT05DTFVTSU9OICYgRElTUEFUQ0ggQ0xFQVJBTkNFOikgVGogRVQKQlQgL0YyIDguNSBUZiAwLjE1IDAuMjIgMC4zMCByZyA1NSAyNzIgVGQgKFRoaXMgYmF0Y2ggc2FtcGxlIGNvbmZvcm1zIGluIGFsbCBtZWFzdXJlZCBwaHlzaWNhbCwgY2hlbWljYWwsIGFuZCBtaWNyb2Jpb2xvZ2ljYWwgcGFyYW1ldGVycyB0byBJUyAxNDU0MzoyMDE4KSBUaiBFVApCVCAvRjIgOC41IFRmIDAuMTUgMC4yMiAwLjMwIHJnIDU1IDI2MCBUZCAoc3BlY2lmaWNhdGlvbnMuIFRoZSBwcm9kdWN0aW9uIGJhdGNoIGlzIGNlcnRpZmllZCBzYWZlLCBzdGVyaWxlLCBhbmQgZm9ybWFsbHkgcmVsZWFzZWQgZm9yIGNvbnN1bWVyIGRpc3RyaWJ1dGlvbi4pIFRqIEVUCjAuODggMC45MiAwLjk1IFJHIDEgdyA0MCAyMjAgMTQwIDAuMSByZSBTCjAuODggMC45MiAwLjk1IFJHIDEgdyAyMjUgMjIwIDE0MCAwLjEgcmUgUwowLjg4IDAuOTIgMC45NSBSRyAxIHcgNDE1IDIyMCAxNDAgMC4xIHJlIFMKQlQgL0YxIDguNSBUZiAwLjA2IDAuMTggMC4yNyByZyA0MCAyMDggVGQgKFQuIE4uIFNoYXJtYSwgTS5TYy4pIFRqIEVUCkJUIC9GMiA3LjUgVGYgMC40NSAwLjUwIDAuNTggcmcgNDAgMTk4IFRkIChTZW5pb3IgQW5hbHl0aWNhbCBDaGVtaXN0KSBUaiBFVApCVCAvRjEgOC41IFRmIDAuMDYgMC4xOCAwLjI3IHJnIDIyNSAyMDggVGQgKERyLiBTLiBSYW8sIFBoLkQuKSBUaiBFVApCVCAvRjIgNy41IFRmIDAuNDUgMC41MCAwLjU4IHJnIDIyNSAxOTggVGQgKENoaWVmIFF1YWxpdHkgQ29udHJvbGxlcikgVGogRVQKQlQgL0YxIDguNSBUZiAwLjA2IDAuMTggMC4yNyByZyA0MTUgMjA4IFRkIChFci4gTS4gVmVua2F0ZXNoKSBUaiBFVApCVCAvRjIgNy41IFRmIDAuNDUgMC41MCAwLjU4IHJnIDQxNSAxOTggVGQgKFBsYW50IE9wZXJhdGlvbnMgRGlyZWN0b3IpIFRqIEVUCjAuODUgMC45MCAwLjk1IFJHIDEgdyA0MCA0NSA1MTUuMjggMC4xIHJlIFMKQlQgL0YyIDcuNSBUZiAwLjQ1IDAuNTAgMC41OCByZyA0MCAzNCBUZCAoQXF1YVB1cmUgV2F0ZXIgUGxhbnQgUHZ0IEx0ZCB8IE9mZmljaWFsIFF1YWxpdHkgQ2VydGlmaWNhdGUgfCBWZXJpZmlhYmxlIHZpYSBCYXRjaCBRUiBDb2RlIG9uIENvbnRhaW5lcikgVGogRVQKQlQgL0YyIDcuNSBUZiAwLjQ1IDAuNTAgMC41OCByZyA0ODAgMzQgVGQgKFBhZ2UgMSBvZiAxKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgPj4KZW5kb2JqCjYgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCjAwMDAwMDAyNjMgMDAwMDAgbiAKMDAwMDAwNzY1NCAwMDAwMCBuIAowMDAwMDA3NzI5IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNyAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNzc5OQolJUVPRgo=',
        parameters: [
          { name: 'Aerobic Microbial Count (20-22°C)', method: 'IS 5402 / 72h Plate', val: '0 CFU/ml', limit: 'Max 100 CFU/ml', status: 'PASS' },
          { name: 'Aerobic Microbial Count (37°C)', method: 'IS 5402 / 24h Plate', val: '0 CFU/ml', limit: 'Max 20 CFU/ml', status: 'PASS' },
          { name: 'Total Coliform Bacteria', method: 'IS 5401 Membrane Filter', val: 'Absent in 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Faecal Streptococci', method: 'IS 5887 Membrane Filter', val: 'Absent in 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Staphylococcus Aureus', method: 'IS 5887 (Part 2)', val: 'Absent in 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Pseudomonas Aeruginosa', method: 'IS 13428 Annex D', val: 'Absent in 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Sulphite-Reducing Anaerobes', method: 'IS 13428 Annex C', val: 'Absent in 50ml', limit: 'Absent in 50ml', status: 'PASS' },
          { name: 'Vibrio Cholerae & Salmonella', method: 'IS 5887 (Part 1 & 3)', val: 'Absent in 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Yeast and Mould Count', method: 'IS 5403 Sabouraud Dextrose', val: 'Absent in 250ml', limit: 'Absent in 250ml', status: 'PASS' },
          { name: 'Cleanroom Laminar Air Particle Count', method: 'ISO Class 5 Laser Counter', val: '0 particles > 0.5 µm', limit: 'Max 3,520/m³', status: 'PASS' },
          { name: 'Capping Head Sterility Swab', method: 'ATP Bioluminescence', val: '0 RLU (Sterile)', limit: 'Max 10 RLU', status: 'PASS' },
          { name: 'Incubation Verdict', method: 'Certified Pathogen-Free', val: 'Sterile / Non-Reactive', limit: 'Cleared for Release', status: 'PASS' }
        ]
      }
    };

    let currentOpenReportKey = '20l-can';

    function base64ToBlob(base64, mimeType) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType || 'application/pdf' });
    }

    function downloadReportFile(repKey) {
      const rep = REPORTS_CATALOG[repKey] || REPORTS_CATALOG['20l-can'];
      if (!rep) return;
      const filename = rep.pdfFilename || 'AquaPure-Quality-Report.pdf';

      if (rep.b64) {
        try {
          const blob = base64ToBlob(rep.b64, 'application/pdf');
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            if (link.parentNode) link.parentNode.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 400);
          return;
        } catch (err) {
          console.warn('Blob download fallback:', err);
          const link = document.createElement('a');
          link.href = 'data:application/pdf;base64,' + rep.b64;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            if (link.parentNode) link.parentNode.removeChild(link);
          }, 200);
          return;
        }
      }

      const link = document.createElement('a');
      link.href = rep.pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 150);
    }

    function populateAndOpenReportModal(repKey) {
      const rep = REPORTS_CATALOG[repKey];
      if (!rep) return;
      currentOpenReportKey = repKey;

      const modal = document.querySelector('#reportPreviewModal');
      if (!modal) return;

      const titleEl = modal.querySelector('#modalReportTitle');
      const subEl = modal.querySelector('#modalReportSubtitle');
      const certEl = modal.querySelector('#modalReportCertNo');
      const sampleEl = modal.querySelector('#modalReportSampleType');
      const dlLink = modal.querySelector('#modalReportDownloadLink');
      const tbody = modal.querySelector('#modalReportTableBody');

      if (titleEl) titleEl.textContent = rep.title;
      if (subEl) subEl.textContent = rep.subtitle;
      if (certEl) certEl.textContent = rep.certNo;
      if (sampleEl) sampleEl.textContent = rep.sampleType;

      if (dlLink) {
        dlLink.setAttribute('data-report', repKey);
        dlLink.href = rep.b64 ? ('data:application/pdf;base64,' + rep.b64) : rep.pdfUrl;
        dlLink.setAttribute('download', rep.pdfFilename);
      }

      if (tbody) {
        tbody.innerHTML = rep.parameters.map((p, idx) => `
          <tr style="background:${idx % 2 === 0 ? 'rgba(36, 189, 232, 0.03)' : 'transparent'};">
            <td style="padding:0.5rem 0.8rem; font-weight:600; color:var(--heading);">${p.name}</td>
            <td style="padding:0.5rem 0.8rem; color:var(--body-text); font-size:0.78rem;">${p.method}</td>
            <td style="padding:0.5rem 0.8rem; font-weight:700; color:var(--primary-blue);">${p.val}</td>
            <td style="padding:0.5rem 0.8rem; color:var(--body-text); font-size:0.78rem;">${p.limit}</td>
            <td style="padding:0.5rem 0.8rem;">
              <span style="background:rgba(13, 148, 136, 0.15); color:#0D9488; font-weight:700; font-size:0.75rem; padding:0.18rem 0.5rem; border-radius:10px; display:inline-flex; align-items:center; gap:0.25rem;">
                <i class="bi bi-check-circle-fill"></i> ${p.status}
              </span>
            </td>
          </tr>
        `).join('');
      }

      openModal('#reportPreviewModal');
    }

    const downloadReportBtns = document.querySelectorAll('.download-sample-report-btn');
    downloadReportBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const repKey = btn.getAttribute('data-report');
        if (repKey && REPORTS_CATALOG[repKey]) {
          populateAndOpenReportModal(repKey);
        } else {
          const keyMap = {
            '20L Water Can Batch Sample Report': '20l-can',
            '1L PET Bottle Quality Log Sample': '1l-bottle',
            'Microbiological Sterility Test Certificate Sample': 'microbiological-sterility'
          };
          const mappedKey = keyMap[repKey] || '20l-can';
          populateAndOpenReportModal(mappedKey);
        }
      });
    });

    // Direct Instant PDF Download Listeners
    const modalDlBtn = document.querySelector('#modalReportDownloadLink');
    if (modalDlBtn) {
      modalDlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadReportFile(currentOpenReportKey);
      });
    }

    const cardDlBtns = document.querySelectorAll('.download-report-file-btn');
    cardDlBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const repKey = btn.getAttribute('data-report');
        downloadReportFile(repKey);
      });
    });

    const heroDlBtn = document.querySelector('.hero-download-reports-btn');
    if (heroDlBtn) {
      heroDlBtn.addEventListener('click', () => {
        downloadReportFile('20l-can');
      });
    }

    const printReportBtn = document.querySelector('#modalReportPrintBtn');
    if (printReportBtn) {
      printReportBtn.addEventListener('click', () => {
        window.print();
      });
    }
  });
})();
