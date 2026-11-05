const fs = require('fs');

let html = fs.readFileSync('products.html', 'utf8');

// 1. Fix 10L Can
html = html.replace(
  `data-product-key="can-20l">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="can-10l"`,
  `data-product-key="can-10l">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="can-10l"`
);
// Also for LF just in case
html = html.replace(
  `data-product-key="can-20l">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="can-10l"`,
  `data-product-key="can-10l">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="can-10l"`
);

// Fix href for 10L Can
html = html.replace(
  `href="water-cans.html#can20L" class="btn btn-outline btn-sm btn-view-details" data-product-key="can-10l"`,
  `href="water-cans.html#can10L" class="btn btn-outline btn-sm btn-view-details" data-product-key="can-10l"`
);

// 2. Add Full Details to 250ml bottle
html = html.replace(
  `<div class="product-footer">\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-250ml" data-name="250ml Event Bottles (Carton)" data-price="240" data-unit="Carton" data-img="assets/images/bottle-250ml-mini.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\r\n                <a href="water-bottles.html#bottle250ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-250ml">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-250ml" data-name="250ml Event Bottles (Carton)" data-price="240" data-unit="Carton" data-img="assets/images/bottle-250ml-mini.jpg">`
);
html = html.replace(
  `<div class="product-footer">\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-250ml" data-name="250ml Event Bottles (Carton)" data-price="240" data-unit="Carton" data-img="assets/images/bottle-250ml-mini.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\n                <a href="water-bottles.html#bottle250ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-250ml">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-250ml" data-name="250ml Event Bottles (Carton)" data-price="240" data-unit="Carton" data-img="assets/images/bottle-250ml-mini.jpg">`
);

// 3. Add Full Details to 500ml bottle
html = html.replace(
  `<div class="product-footer">\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-500ml" data-name="500ml Daily Bottles (Carton)" data-price="220" data-unit="Carton" data-img="assets/images/bottle-500ml-onthego.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\r\n                <a href="water-bottles.html#bottle500ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-500ml">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-500ml" data-name="500ml Daily Bottles (Carton)" data-price="220" data-unit="Carton" data-img="assets/images/bottle-500ml-onthego.jpg">`
);
html = html.replace(
  `<div class="product-footer">\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-500ml" data-name="500ml Daily Bottles (Carton)" data-price="220" data-unit="Carton" data-img="assets/images/bottle-500ml-onthego.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\n                <a href="water-bottles.html#bottle500ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-500ml">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-500ml" data-name="500ml Daily Bottles (Carton)" data-price="220" data-unit="Carton" data-img="assets/images/bottle-500ml-onthego.jpg">`
);

// 4. Add Full Details to 1L bottle
html = html.replace(
  `<div class="product-footer">\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-1l" data-name="1L Dining Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-1l-standard.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\r\n                <a href="water-bottles.html#bottle1L" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-1l">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-1l" data-name="1L Dining Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-1l-standard.jpg">`
);
html = html.replace(
  `<div class="product-footer">\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-1l" data-name="1L Dining Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-1l-standard.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\n                <a href="water-bottles.html#bottle1L" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-1l">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-1l" data-name="1L Dining Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-1l-standard.jpg">`
);

// 5. Add Full Details to 2L bottle
html = html.replace(
  `<div class="product-footer">\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-2l" data-name="2L Travel Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-2l-family.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\r\n                <a href="water-bottles.html#bottle2L" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-2l">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-2l" data-name="2L Travel Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-2l-family.jpg">`
);
html = html.replace(
  `<div class="product-footer">\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-2l" data-name="2L Travel Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-2l-family.jpg" style="width:100%;">`,
  `<div class="product-footer" style="display:flex; gap:0.5rem; flex-wrap:wrap;">\n                <a href="water-bottles.html#bottle2L" class="btn btn-outline btn-sm btn-view-details" data-product-key="bottle-2l">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="bottle-2l" data-name="2L Travel Bottles (Carton)" data-price="180" data-unit="Carton" data-img="assets/images/bottle-2l-family.jpg">`
);

// 6. Fix 200ml and 500ml pouch links
html = html.replace(
  `<a href="water-pouches.html" class="btn btn-outline btn-sm">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-200ml"`,
  `<a href="water-pouches.html#pouch200ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="pouch-200ml">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-200ml"`
);
html = html.replace(
  `<a href="water-pouches.html" class="btn btn-outline btn-sm">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-200ml"`,
  `<a href="water-pouches.html#pouch200ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="pouch-200ml">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-200ml"`
);

html = html.replace(
  `<a href="water-pouches.html" class="btn btn-outline btn-sm">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-500ml"`,
  `<a href="water-pouches.html#pouch500ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="pouch-500ml">Full Details <i class="bi bi-arrow-right"></i></a>\r\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-500ml"`
);
html = html.replace(
  `<a href="water-pouches.html" class="btn btn-outline btn-sm">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-500ml"`,
  `<a href="water-pouches.html#pouch500ml" class="btn btn-outline btn-sm btn-view-details" data-product-key="pouch-500ml">Full Details <i class="bi bi-arrow-right"></i></a>\n                <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="pouch-500ml"`
);

// 7. Inject Product Full Details Modal right above Quote Modal
const productModalHtml = `  <!-- Product Full Details Modal (Quick View & Exact Specifications) -->
  <div class="modal-overlay" id="productDetailModal" role="dialog" aria-modal="true" aria-labelledby="modalProdTitle">
    <div class="modal-card modal-product-detail">
      <button type="button" class="modal-close-btn" data-modal-close aria-label="Close Modal"><i class="bi bi-x-lg"></i></button>
      
      <div class="product-detail-grid">
        <div class="product-detail-visual">
          <span class="product-detail-badge" id="modalProdBadge">Most Popular</span>
          <img src="assets/images/polycarbonate-20l-bubbletop.png" alt="Product Image" id="modalProdImg">
          <span class="product-detail-capacity" id="modalProdCapacity">20 Litres</span>
        </div>

        <div class="product-detail-info">
          <span class="category-tag" id="modalProdCategory">Water Cans • Bulk Dispenser Solutions</span>
          <h2 class="detail-title" id="modalProdTitle">20L Standard Commercial Water Can</h2>
          
          <div class="detail-price-wrap">
            <span class="detail-price" id="modalProdPrice">₹90</span>
            <span class="detail-tax">(Inclusive of all applicable GST & delivery)</span>
          </div>

          <p class="detail-desc" id="modalProdDesc">
            Heavy-gauge, unbreakable food-grade polycarbonate and virgin PET container. Rigorously sanitized inside and out through high-pressure hot water, alkaline wash, and ozonated rinse prior to touchless filling.
          </p>

          <table class="product-detail-specs-table">
            <tbody id="modalProdSpecs">
              <!-- Dynamically populated -->
            </tbody>
          </table>

          <div class="product-detail-actions">
            <button type="button" class="btn btn-primary btn-sm btn-add-cart" id="modalAddToCartBtn" data-id="can-20l" data-name="20L Commercial Water Can" data-price="90" data-unit="Can" data-img="assets/images/polycarbonate-20l-bubbletop.png">
              <i class="bi bi-cart-plus"></i> Add to Cart (₹90)
            </button>
            <a href="water-cans.html#can20L" class="btn btn-outline btn-sm" id="modalDedicatedPageBtn">
              <i class="bi bi-box-arrow-up-right"></i> Dedicated Product Page
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>\n\n`;

if (!html.includes('id="productDetailModal"')) {
  html = html.replace('<!-- Quote Request Modal -->', productModalHtml + '  <!-- Quote Request Modal -->');
}

fs.writeFileSync('products.html', html, 'utf8');
console.log('Successfully updated products.html!');
