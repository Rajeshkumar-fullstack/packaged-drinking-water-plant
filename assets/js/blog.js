/**
 * AquaPure - Blog & Industry Insights Interactive Logic (blog.js)
 * Real-time search, category filtering, reader modal & social share
 */

(function () {
  'use strict';

  // Comprehensive Article Knowledge Database for Modal Reader
  const ARTICLES_DATA = {
    'article-1': {
      title: 'The 11-Stage Automated Water Purification Protocol: From Protected Aquifer to Sterile Bottling',
      category: 'Plant Technology',
      date: 'Nov 08, 2026',
      readTime: '7 min read',
      author: 'Dr. Rajesh Varma',
      authorRole: 'Chief Chemical Engineer & Plant Director',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/modern-water-processing-facility.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          In modern beverage processing, producing biologically pristine yet organically balanced packaged drinking water demands rigorous multi-barrier engineering. At AquaPure, our fully automated 11-stage purification pipeline is designed to eliminate chemical, particulate, and microbiological impurities without depleting essential minerals.
        </p>
        
        <h3>1. Deep Borehole Hydro-Geological Extraction & Coarse Screening</h3>
        <p>
          Raw water is sourced exclusively from certified deep underground aquifers shielded by impervious clay stratigraphy. Submersible multi-stage stainless steel turbine pumps transfer water through high-capacity disc filtration to remove silt, sand, and particulate matter exceeding 50 microns.
        </p>

        <h3>2. Dual Sand & Activated Carbon Adsorption Towers</h3>
        <p>
          Next, pressure sand filters eliminate turbidity and suspended colloids. The water then cascades into food-grade acid-washed activated carbon vessels boasting an iodine value > 1050 mg/g. This stage captures chlorine, trihalomethanes (THMs), volatile organic compounds (VOCs), and unexpected aroma notes.
        </p>

        <h3>3. Dual-Pass Thin Film Composite (TFC) Reverse Osmosis</h3>
        <p>
          Operated under calibrated booster pressure of 14–18 Bar, dual-stage cross-flow polyamide TFC membranes feature pore matrices as fine as 0.0001 microns. This mechanical separation eliminates dissolved heavy metals (lead, arsenic, mercury, fluoride), microplastics, pesticides, and bacterial pyrogens.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-check2-circle" style="color:var(--primary-blue);"></i> Engineering Takeaways</h4>
          <ul>
            <li><strong>Cross-Flow Membrane Efficiency:</strong> Rejection rates exceed 99.4% for multivalent ionic contaminants.</li>
            <li><strong>Automated Dosing:</strong> Food-grade ionic Calcium and Magnesium are reintroduced at 100–120 PPM TDS.</li>
            <li><strong>Residual Ozone Barrier:</strong> Micro-bubble ozone dissolution (0.2–0.4 ppm) provides prolonged hermetic sterility.</li>
          </ul>
        </div>

        <h3>4. Controlled Ionic Remineralization & Equilibrium</h3>
        <p>
          Purified pure permeate is routed through proportionate pharmaceutical-grade metering injectors. Bioavailable Calcium (Ca²⁺) and Magnesium (Mg²⁺) ions are reintroduced in a 3:1 ionic ratio to achieve crisp taste, slight alkalinity (pH 7.2–7.6), and biological assimilation.
        </p>

        <h3>5. Ozone Retention & Sub-Second 254nm UV Chamber</h3>
        <p>
          Finally, water circulates through a Venturi ozone contact tower maintaining 0.2 to 0.4 ppm dissolved ozone, followed by germicidal ultraviolet irradiation at 254nm. Bottled inside Class 100 laminar cleanrooms, our water is laser-sealed in under four seconds.
        </p>
      `
    },
    'article-2': {
      title: 'Understanding TDS: Why 100–150 PPM Delivers Optimal Hydration and Biological Equilibrium',
      category: 'Water Science',
      date: 'Nov 04, 2026',
      readTime: '5 min read',
      author: 'Meera Sen, M.Sc.',
      authorRole: 'Senior Hydration & Quality Chemist',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/laboratory-water-quality-verification.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          Total Dissolved Solids (TDS) is often the most misunderstood metric in packaged drinking water. Many consumers mistakenly assume that the lower the TDS, the purer the water. In clinical reality, drinking near-zero TDS water can cause cellular osmotic shock and mineral leaching.
        </p>

        <h3>What Does TDS Truly Measure?</h3>
        <p>
          TDS refers to the cumulative inorganic salts and small amounts of organic matter dissolved in water. The primary constituents are calcium, magnesium, potassium, sodium, bicarbonates, chlorides, and sulfates.
        </p>

        <h3>The Perils of Aggressive De-mineralization</h3>
        <p>
          Distilled or demineralized water with TDS below 30 PPM is hyper-hypotonic. When ingested, it accelerates the secretion of electrolytes into the gastrointestinal lumen to rebalance osmotic pressure, potentially causing headaches, fatigue, and muscular cramps.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-shield-check" style="color:var(--primary-blue);"></i> BIS & WHO TDS Spectrum</h4>
          <ul>
            <li><strong>< 50 PPM:</strong> Over-stripped; lacks vital mineral micronutrients and has flat, acidic taste.</li>
            <li><strong>75 – 150 PPM:</strong> Optimal equilibrium; crisp mouthfeel, rapid cellular absorption, neutral pH.</li>
            <li><strong>> 500 PPM:</strong> Heavy mineral load; potential scaling and mineral taste.</li>
          </ul>
        </div>

        <h3>Why AquaPure Calibrates at 100–120 PPM</h3>
        <p>
          Through controlled re-mineralization post-reverse osmosis, AquaPure locks TDS between 100 and 120 PPM. This delivers a silky mouthfeel, optimal cellular hydration kinetics, and compliance with Bureau of Indian Standards IS 14543:2018.
        </p>
      `
    },
    'article-3': {
      title: 'Robotic Monobloc Bottling in ISO Class 7 Cleanrooms: The Touchless Revolution',
      category: 'Plant Technology',
      date: 'Oct 29, 2026',
      readTime: '6 min read',
      author: 'Karthik Sundaram',
      authorRole: 'Robotics & Automation Operations Lead',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/robotic-cleanroom-bottling.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          Traditional manual water packaging is vulnerable to airborne bacterial inoculation and particulate contamination. Discover how robotic rotary monobloc enclosures transform food-grade beverage sanitation.
        </p>

        <h3>Positive Air Pressure & HEPA Air Showers</h3>
        <p>
          Our bottling hall operates under an uninterrupted positive atmospheric pressure gradient with H14 HEPA filtration ensuring < 352,000 particles (≥0.5µm) per cubic meter. Personnel enter exclusively through motorized air showers and hermetic ante-rooms.
        </p>

        <h3>High-Speed Rotary Inversion & Ozonated Rinse</h3>
        <p>
          Bottles fed via air-conveyors are gripped by pneumatic sanitized mechanical fingers, inverted 180 degrees, and blast-rinsed with 0.5 ppm ozonated pure water before being drained and returned upright.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-cpu" style="color:var(--primary-blue);"></i> Automation Metrics</h4>
          <ul>
            <li><strong>Cycle Time:</strong> Rinse, fill, and cap executed in 3.8 seconds per bottle.</li>
            <li><strong>Fill Accuracy:</strong> Electronic flowmeters guarantee ±1.5 ml volumetric accuracy.</li>
            <li><strong>Torque Integrity:</strong> Magnetic clutch capping applies consistent 14–18 Nm torque.</li>
          </ul>
        </div>

        <h3>Hermetic Laser Capping & Tamper Seal</h3>
        <p>
          Caps are sterilized via UV-C chutes immediately prior to seating. Laser sensors verify proper thread engagement, reject misaligned caps, and apply tamper-evident shrink bands automatically.
        </p>
      `
    },
    'article-4': {
      title: 'BIS IS:14543 vs. Municipal Water: Deciphering the 36 Mandatory Compliance Assays',
      category: 'Quality & Standards',
      date: 'Oct 22, 2026',
      readTime: '5 min read',
      author: 'Siddharth Patel',
      authorRole: 'Lead Regulatory & Procurement Auditor',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/bis-is14543-compliance-laboratory.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          How does certified packaged drinking water differ from ordinary municipal supply? The answer lies in statutory multi-stage chemical, microbiological, and radiological batch analysis.
        </p>

        <h3>Statutory Testing Parameters under IS 14543</h3>
        <p>
          Every production shift at AquaPure is subject to 36 laboratory assays conducted on calibrated analytical instruments:
        </p>
        <ul>
          <li><strong>Microbiology:</strong> Zero detection of E. coli, Coliforms, Faecal Streptococci, Pseudomonas aeruginosa, and yeast/mould spores.</li>
          <li><strong>Toxic Heavy Metals:</strong> ICP-MS spectrometry verifying Lead (< 0.01 mg/L), Cadmium (< 0.003 mg/L), Arsenic (< 0.01 mg/L), and Mercury (< 0.001 mg/L).</li>
          <li><strong>Pesticide Residues:</strong> GC-MS chromatography screening across 20 individual organochlorine, organophosphorus, and synthetic pyrethroid pesticides.</li>
        </ul>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-award" style="color:var(--primary-blue);"></i> Audit Takeaways</h4>
          <ul>
            <li>Batch sample incubation for 48 hours before logistics clearance.</li>
            <li>Tamper-evident QR code traceability printed directly on labels.</li>
            <li>Third-party NABL laboratory cross-validation performed quarterly.</li>
          </ul>
        </div>
      `
    },
    'article-5': {
      title: 'The Circular Lifecycle of 20L Water Cans: 7-Stage Sanitization & Eco-Stewardship',
      category: 'Eco Packaging',
      date: 'Oct 15, 2026',
      readTime: '4 min read',
      author: 'Pooja Deshmukh',
      authorRole: 'Sustainable Supply Chain Specialist',
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/can-20l-commercial.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          20-Litre dispenser cans are the backbone of commercial and residential hydration. When maintained through closed-loop circularity, a single virgin polycarbonate can displaces over 800 single-use plastic bottles.
        </p>

        <h3>7-Stage Automated Internal Sanitization Protocol</h3>
        <p>
          Upon return to our logistics depot, each can undergoes a rigorous mechanized hygiene journey:
        </p>
        <ol>
          <li><strong>Automated Pre-Wash & De-capping:</strong> Removes existing caps and exterior logistics grime.</li>
          <li><strong>Alkaline Detergent Jetting:</strong> Heated food-grade chemical wash at 60°C strips scale.</li>
          <li><strong>Sanitizer Inversion Wash:</strong> Peracetic acid and food-grade disinfectant rinse.</li>
          <li><strong>Pure Permeate Rinse:</strong> Flushes all chemical traces using RO water.</li>
          <li><strong>Ozonated Sterilization:</strong> Dissolved ozone eliminates remaining pathogens.</li>
          <li><strong>Touchless Filling:</strong> Volumetric filling inside HEPA cleanroom enclosure.</li>
          <li><strong>Heat-Shrink Neck Seal:</strong> Holographic tamper-evident closure applied.</li>
        </ol>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-recycle" style="color:var(--primary-blue);"></i> Sustainability Metrics</h4>
          <ul>
            <li>Each can is rated for 60+ safe return cycles.</li>
            <li>100% recyclable into secondary industrial polymers at end of service life.</li>
            <li>Reduces single-use municipal packaging waste by 92%.</li>
          </ul>
        </div>
      `
    },
    'article-6': {
      title: 'Cellular Hydration & Athletic Recovery: The Vital Role of Ionic Calcium and Magnesium',
      category: 'Health & Hydration',
      date: 'Oct 09, 2026',
      readTime: '5 min read',
      author: 'Dr. Ananya Sharma',
      authorRole: 'Clinical Nutritionist & Sports Hydration Consultant',
      authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/hero-pure-water-bottle.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          Water is the physiological solvent of all human biochemistry. Yet drinking large volumes of completely demineralized water can fail to rehydrate muscles efficiently. Discover how bio-available electrolytes accelerate recovery.
        </p>

        <h3>The Science of Cellular Osmolality</h3>
        <p>
          Water enters human cells through specialized aquaporin channels. For water to remain inside the intracellular space rather than being quickly excreted by the kidneys, a delicate sodium-potassium-magnesium balance is mandatory.
        </p>

        <h3>Calcium for Muscular Contraction, Magnesium for Relaxation</h3>
        <p>
          During physical exertion or intense work, calcium ions trigger muscle sarcomere contractions, while magnesium ions facilitate muscular relaxation. Deficiencies in dissolved drinking magnesium correlate directly with nocturnal cramps and mental fatigue.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-heart-pulse" style="color:var(--primary-blue);"></i> Hydration Benefits</h4>
          <ul>
            <li>Faster glycogen synthesis post-exercise.</li>
            <li>Prevention of hyponatremia during sustained cardiovascular activity.</li>
            <li>Optimal blood viscosity and blood pressure regulation.</li>
          </ul>
        </div>
      `
    },
    'article-7': {
      title: 'Microplastics Elimination in Drinking Water: Sub-Micron Absolute Filtration Realities',
      category: 'Water Science',
      date: 'Sep 30, 2026',
      readTime: '6 min read',
      author: 'Meera Sen, M.Sc.',
      authorRole: 'Senior Hydration & Quality Chemist',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/ss316-sanitary-fluid-network.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          Microplastics and nanoplastics have emerged as primary global concerns in surface and groundwater supplies. Here is how advanced sub-micron absolute membrane technology guarantees zero microparticulate passage.
        </p>

        <h3>Size Domains: Microplastics vs Nanoplastics</h3>
        <p>
          Microplastics range from 5mm down to 1 micrometer, whereas nanoplastics can be smaller than 0.1 microns. Traditional gravity sand filters capture coarse particles but let nanoplastics slip through.
        </p>

        <h3>Our Triple Barrier Defense Strategy</h3>
        <p>
          At AquaPure, water traverses 5-micron spun polypropylene sediment cartridges, followed by 0.2-micron absolute ceramic pleated filters, and ultimately 0.0001-micron RO membranes. This physical barrier ensures absolute containment.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-check-all" style="color:var(--primary-blue);"></i> Lab Verification</h4>
          <ul>
            <li>Laser diffraction particle counter monitors effluent in real-time.</li>
            <li>All piping built from electro-polished 316L sanitary stainless steel.</li>
            <li>No plastic transfer conduits inside high-pressure purification loops.</li>
          </ul>
        </div>
      `
    },
    'article-8': {
      title: 'Wholesale Corporate Can & Bottled Water Logistics: Guaranteeing On-Time Purity',
      category: 'Plant Technology',
      date: 'Sep 24, 2026',
      readTime: '4 min read',
      author: 'Vikram Malhotra',
      authorRole: 'Director of Supply Chain & Distribution',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/wholesale-distribution-hub.jpg',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          Supplying over 50,000 units of pure packaged drinking water daily across tech parks, corporate campuses, hospitals, and educational institutions requires military-grade logistics orchestration.
        </p>

        <h3>GPS Fleet Telemetry & Temperature Monitoring</h3>
        <p>
          Every logistics vehicle in our dispatch fleet is outfitted with GPS tracking and ambient cargo temperature monitors, protecting bottled inventory from thermal stress and UV solar degradation during transit.
        </p>

        <h3>Automated ERP Subscription Synchronization</h3>
        <p>
          Commercial accounts enjoy seamless recurring delivery schedules managed by our central ERP system. Real-time empty can collection reconciliation ensures steady, uninterrupted supply.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-truck" style="color:var(--primary-blue);"></i> Logistics Highlights</h4>
          <ul>
            <li>Same-day emergency replenishment available across city hubs.</li>
            <li>Palletized shrink-wrapped deliveries for large institutional buyers.</li>
            <li>Automated digital invoices and batch laboratory quality certificate links.</li>
          </ul>
        </div>
      `
    },
    'article-9': {
      title: 'Smart Countertop Dispensers & Gravity Faucets: The Next Generation of Workplace Hydration',
      category: 'Plant Technology',
      date: 'Sep 18, 2026',
      readTime: '5 min read',
      author: 'Pooja Hegde',
      authorRole: 'Head of Product Design & Quality Control',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/pet-20l-dispenser-jar.png',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          In modern corporate environments and commercial pantries, hydration equipment must reconcile two competing priorities: effortless ergonomic access and stringent microbial security.
        </p>

        <h3>The Ergonomic Challenge of Heavy Inversion</h3>
        <p>
          Standard 20-litre water cans weigh upwards of 21 kg when filled. Traditional floor-standing hot/cold water dispensers require users or facility teams to invert this heavy jar upside down, creating risks of lumbar strain and workplace injury.
        </p>

        <h3>Upright Gravity Flow & Integrated Sanitary Faucets</h3>
        <p>
          AquaPure's 20L Countertop Dispenser Jar solves this through an upright form factor equipped with a food-grade silicone-sealed push tap located at the base. Water flows freely through laminar gravity discharge without needing lifting or power outlets.
        </p>

        <h3>Microbial Barrier & Anti-Vortex Venting</h3>
        <p>
          The bottle features a top sanitary air vent fitted with a 0.2-micron hydrophobic breathable membrane. As water dispenses, incoming air is scrubbed of airborne dust, aerosols, and microbial particulates, preventing reservoir stagnation.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-droplet-half" style="color:var(--primary-blue);"></i> Engineering Innovations</h4>
          <ul>
            <li>Food-contact polypropylene push tap tested for over 50,000 smooth cycles.</li>
            <li>Eliminates electricity dependency and motorized compressor maintenance.</li>
            <li>Compact footprint tailored for pantry counter depths and executive meeting suites.</li>
          </ul>
        </div>
      `
    },
    'article-10': {
      title: 'From Virgin Preforms to 100% Circularity: The Sustainable Engineering of Modern Bottled Products',
      category: 'Eco Packaging',
      date: 'Sep 10, 2026',
      readTime: '6 min read',
      author: 'Karan Singhania',
      authorRole: 'VP of Sustainable Packaging & Environmental Engineering',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      image: 'assets/images/pet-bottles-group.png',
      content: `
        <p class="lead" style="font-size:1.15rem; font-weight:500; color:var(--heading);">
          Sustainable beverage delivery is not just about using recyclable polymer resins; it requires rethinking the full lifecycle from resin pellet synthesis to mechanical bottle blowing and closed-loop reclamation.
        </p>

        <h3>Precision Lightweighting Without Sacrificing Structural Rigidity</h3>
        <p>
          By employing Finite Element Analysis (FEA) in our preform mold design, AquaPure reduced bottle wall thickness while integrating patented structural geometric ribbing. This achieved a 28% resin mass reduction across our 500ml and 1L bottle ranges while maintaining top-load stacking strength of over 45 kg.
        </p>

        <h3>Food-Grade rPET Integration & Carbon Abatement</h3>
        <p>
          Our bottling line incorporates up to 50% post-consumer recycled food-grade PET (rPET) vetted under stringent FDA and FSSAI migration guidelines. Transitioning virgin polymer to circular resins cuts cradle-to-gate greenhouse gas emissions by up to 42%.
        </p>

        <h3>Washable Alkaline-Soluble Label Inks & Tethered Caps</h3>
        <p>
          Traditional adhesives contaminate recycling wash-baths. AquaPure uses hot-water-releasable label adhesives and non-toxic organic inks that detach cleanly during standard municipal recycling float-sink separations.
        </p>

        <div class="modal-key-takeaways">
          <h4><i class="bi bi-recycle" style="color:var(--primary-blue);"></i> Circularity Benchmarks</h4>
          <ul>
            <li>100% recyclable virgin PET preforms meeting BIS IS 15410 standards.</li>
            <li>Tethered tamper-evident caps complying with marine litter reduction guidelines.</li>
            <li>Zero-landfill plant recycling policy diverting 98.4% of industrial scrap.</li>
          </ul>
        </div>
      `
    }
  };

  // DOM Elements
  const searchInput = document.getElementById('blogSearchInput');
  const searchClear = document.getElementById('blogSearchClear');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  const emptyState = document.getElementById('blogEmptyState');
  const modal = document.getElementById('blogArticleModal');
  const newsletterForm = document.getElementById('blogNewsletterForm');
  const newsletterFeedback = document.getElementById('blogNewsletterFeedback');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  /**
   * Filter and Search Evaluation
   */
  function applyFilterAndSearch() {
    let visibleCount = 0;
    const query = currentSearchQuery.toLowerCase().trim();

    blogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = (card.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
      const cardExcerpt = (card.querySelector('.blog-card-excerpt')?.textContent || '').toLowerCase();
      const cardAuthor = (card.querySelector('.blog-author-name')?.textContent || '').toLowerCase();

      const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesSearch = !query || 
        cardTitle.includes(query) || 
        cardExcerpt.includes(query) || 
        cardAuthor.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.classList.add('active');
        card.style.opacity = '1';
        card.style.transform = 'none';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle Featured Spotlight Post Section Visibility
    const featuredSection = document.querySelector('.featured-post-section');
    if (featuredSection) {
      const fTitle = (featuredSection.querySelector('.featured-post-title')?.textContent || '').toLowerCase();
      const fExcerpt = (featuredSection.querySelector('.featured-post-excerpt')?.textContent || '').toLowerCase();
      const fCategory = 'Plant Technology';

      const fMatchesCategory = currentCategory === 'all' || currentCategory === fCategory;
      const fMatchesSearch = !query || fTitle.includes(query) || fExcerpt.includes(query);

      if (fMatchesCategory && fMatchesSearch) {
        featuredSection.style.display = '';
        visibleCount++;
      } else {
        featuredSection.style.display = 'none';
      }
    }

    // Handle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('active');
      } else {
        emptyState.classList.remove('active');
      }
    }
  }

  // Category Filter Pill Click Handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.getAttribute('data-filter') || 'all';
      applyFilterAndSearch();
    });
  });

  // Search Input Handler (Debounced)
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const val = this.value;
      if (searchClear) {
        if (val.trim()) {
          searchClear.classList.add('active');
        } else {
          searchClear.classList.remove('active');
        }
      }
      debounceTimer = setTimeout(() => {
        currentSearchQuery = val;
        applyFilterAndSearch();
      }, 200);
    });
  }

  // Clear Search Button
  if (searchClear) {
    searchClear.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
        currentSearchQuery = '';
        this.classList.remove('active');
        searchInput.focus();
        applyFilterAndSearch();
      }
    });
  }

  /**
   * Open Article Reader Modal
   */
  function openArticleModal(articleId) {
    const data = ARTICLES_DATA[articleId];
    if (!data || !modal) return;

    // Populate Modal Elements
    const imgEl = modal.querySelector('#modalArticleImg');
    const badgeEl = modal.querySelector('#modalArticleBadge');
    const titleEl = modal.querySelector('#modalArticleTitle');
    const authorImgEl = modal.querySelector('#modalArticleAuthorImg');
    const authorNameEl = modal.querySelector('#modalArticleAuthorName');
    const authorRoleEl = modal.querySelector('#modalArticleAuthorRole');
    const dateEl = modal.querySelector('#modalArticleDate');
    const readTimeEl = modal.querySelector('#modalArticleReadTime');
    const bodyEl = modal.querySelector('#modalArticleBody');

    if (imgEl) imgEl.src = data.image;
    if (imgEl) imgEl.alt = data.title;
    if (badgeEl) badgeEl.textContent = data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (authorImgEl) authorImgEl.src = data.authorAvatar;
    if (authorNameEl) authorNameEl.textContent = data.author;
    if (authorRoleEl) authorRoleEl.textContent = data.authorRole;
    if (dateEl) dateEl.textContent = data.date;
    if (readTimeEl) readTimeEl.textContent = data.readTime;
    if (bodyEl) bodyEl.innerHTML = data.content;

    // Open Modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Close Article Modal
  function closeArticleModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Listen to read button clicks across page
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-article-id]');
    if (trigger) {
      e.preventDefault();
      const articleId = trigger.getAttribute('data-article-id');
      openArticleModal(articleId);
    }
  });

  // Modal Close Button & Overlay Click
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeArticleModal);
    }
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeArticleModal();
      }
    });
  }

  // Keyboard Escape Key Handler
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeArticleModal();
    }
  });

  // Social Sharing Handlers
  document.addEventListener('click', function (e) {
    const shareBtn = e.target.closest('[data-share]');
    if (!shareBtn) return;
    e.preventDefault();
    const network = shareBtn.getAttribute('data-share');
    const currentUrl = window.location.href;
    const title = (modal?.querySelector('#modalArticleTitle')?.textContent || 'AquaPure Water Purity Insights');

    if (network === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
    } else if (network === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=500');
    } else if (network === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + currentUrl)}`, '_blank');
    } else if (network === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(currentUrl).then(() => {
          const originalTitle = shareBtn.getAttribute('title') || 'Copy Link';
          shareBtn.innerHTML = '<i class="bi bi-check2"></i>';
          setTimeout(() => {
            shareBtn.innerHTML = '<i class="bi bi-link-45deg"></i>';
            shareBtn.setAttribute('title', originalTitle);
          }, 2000);
        });
      }
    }
  });

  // Blog Newsletter Submission Handler
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const email = input?.value?.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (newsletterFeedback) {
          newsletterFeedback.className = 'newsletter-feedback error';
          newsletterFeedback.textContent = 'Please enter a valid business or personal email address.';
        }
        return;
      }

      // Simulate success
      if (newsletterFeedback) {
        newsletterFeedback.className = 'newsletter-feedback success';
        newsletterFeedback.textContent = 'Thank you! You are now subscribed to AquaPure Industry Insights.';
      }
      if (input) input.value = '';

      setTimeout(() => {
        if (newsletterFeedback) newsletterFeedback.style.display = 'none';
      }, 5000);
    });
  }

})();
