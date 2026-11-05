/**
 * AQUAPURE - Shopping Cart System
 * Supports Add to Cart, Quantity Management, LocalStorage Persistence, Slide Drawer, Checkout, and RTL/LTR
 */

(function () {
  'use strict';

  const CART_KEY = 'aquapure_cart';

  // Initial cart state from localStorage
  let cart = [];
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
    updateCartBadge();
    renderCartDrawer();
  }

  function getCartCount() {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        img: product.img || 'assets/images/can-20l-commercial.jpg',
        unit: product.unit || '',
        quantity: product.quantity || 1
      });
    }
    saveCart();
    showToast(`Added <strong>${product.name}</strong> to your cart!`);
    animateCartBadge();

    // Close any open product detail modal if active
    const prodModal = document.getElementById('productDetailModal');
    if (prodModal && prodModal.classList.contains('open')) {
      prodModal.classList.remove('open');
    }

    // Open the cart drawer immediately so the user can see their added item
    openCartDrawer();
  }

  function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity = (item.quantity || 1) + delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
    }
  }

  function removeFromCart(id) {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    if (item) {
      showToast(`Removed <strong>${item.name}</strong> from cart.`);
    }
  }

  function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    saveCart();
    showToast('Cart cleared.');
  }

  function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  function animateCartBadge() {
    document.querySelectorAll('.cart-btn').forEach(btn => {
      btn.classList.add('bounce');
      setTimeout(() => btn.classList.remove('bounce'), 400);
    });
  }

  function showToast(message) {
    let toast = document.getElementById('cartToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cartToast';
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill"></i> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* Cart Drawer Injection & Rendering */
  function injectCartDrawerHTML() {
    if (document.getElementById('cartDrawerOverlay')) return;

    const drawerHTML = `
      <div class="cart-drawer-overlay" id="cartDrawerOverlay"></div>
      <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <div class="cart-drawer-header">
          <div class="cart-drawer-title">
            <i class="bi bi-cart3"></i>
            <h3>Your Cart</h3>
            <span class="cart-items-count badge-pill" id="cartHeaderCount">0 items</span>
          </div>
          <button type="button" class="cart-close-btn" id="cartCloseBtn" aria-label="Close Cart">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="cart-drawer-body" id="cartItemsList">
          <!-- Injected items or empty state -->
        </div>

        <div class="cart-drawer-footer" id="cartDrawerFooter">
          <div class="cart-summary-line">
            <span>Subtotal</span>
            <span class="cart-total-amount" id="cartSubtotalAmount">₹0.00</span>
          </div>
          <div class="cart-summary-line delivery-note">
            <span><i class="bi bi-truck"></i> Hygienic Delivery</span>
            <span class="text-success font-weight-bold">Free over ₹200</span>
          </div>
          <div class="cart-summary-line total-line">
            <span>Estimated Total</span>
            <span class="cart-grand-total" id="cartGrandTotal">₹0.00</span>
          </div>

          <div class="cart-action-buttons">
            <button type="button" class="btn btn-primary btn-block checkout-btn" id="cartCheckoutBtn">
              <i class="bi bi-shield-check"></i> Proceed to Order
            </button>
            <button type="button" class="btn btn-outline btn-sm btn-block" id="cartClearBtn">
              <i class="bi bi-trash3"></i> Clear Cart
            </button>
          </div>
        </div>
      </aside>

      <!-- Cart Checkout Quick Modal -->
      <div class="modal-overlay" id="cartCheckoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutModalTitle">
        <div class="modal-card modal-md">
          <button type="button" class="modal-close-btn" id="checkoutModalClose" aria-label="Close dialog">
            <i class="bi bi-x-lg"></i>
          </button>
          <div class="modal-header">
            <div class="badge-pill" style="margin-bottom:0.5rem;"><i class="bi bi-bag-check-fill"></i> Delivery Checkout</div>
            <h3 class="modal-title" id="checkoutModalTitle">Confirm Your Order</h3>
            <p class="modal-subtitle" style="font-size:0.88rem; color:var(--body-text); margin:0;">Direct from AquaPure automated packaging plant.</p>
          </div>
          <div class="modal-body">
            <div id="checkoutSummaryBox" class="checkout-summary-box"></div>
            <form id="cartCheckoutForm" class="validated-form" novalidate>
              <div class="form-group">
                <label class="form-label" for="custName">Full Name *</label>
                <input type="text" id="custName" class="form-control" placeholder="e.g. Rajesh Kumar" required autocomplete="name">
                <div class="invalid-feedback" id="custNameError">Please enter your full name (letters only, minimum 2 characters).</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="custPhone">Phone Number *</label>
                <input type="tel" id="custPhone" class="form-control" placeholder="10-digit mobile number (e.g. 9876543210)" required maxlength="10" autocomplete="tel">
                <div class="invalid-feedback" id="custPhoneError">Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="custAddress">Delivery Address *</label>
                <textarea id="custAddress" class="form-control" rows="2" placeholder="Building, Street, Landmark, Area" required minlength="8"></textarea>
                <div class="invalid-feedback" id="custAddressError">Please enter a complete delivery address (minimum 8 characters).</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="custPayment">Payment Preference</label>
                <select id="custPayment" class="form-control">
                  <option value="Cash on Delivery / UPI">Cash on Delivery / Doorstep UPI QR</option>
                  <option value="Online Payment">Online Bank Transfer / Pre-pay</option>
                  <option value="Corporate Monthly Invoice">Corporate Monthly Invoice Account</option>
                </select>
              </div>
              <div class="modal-footer" style="padding:0; margin-top:1.5rem;">
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="cartSubmitOrderBtn">
                  <i class="bi bi-check2-circle"></i> Confirm &amp; Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);

    // Bind drawer events
    const closeBtn = document.getElementById('cartCloseBtn');
    const overlay = document.getElementById('cartDrawerOverlay');
    const clearBtn = document.getElementById('cartClearBtn');
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    const checkoutClose = document.getElementById('checkoutModalClose');

    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);
    if (clearBtn) clearBtn.addEventListener('click', clearCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckoutModal);

    const checkoutModal = document.getElementById('cartCheckoutModal');
    if (checkoutModal) {
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
          closeCheckoutModal();
        }
      });
    }

    // Setup input validation for Checkout Form
    setupCheckoutValidation();
  }

  function setupCheckoutValidation() {
    const form = document.getElementById('cartCheckoutForm');
    if (!form) return;

    const nameInput = document.getElementById('custName');
    const phoneInput = document.getElementById('custPhone');
    const addressInput = document.getElementById('custAddress');
    const nameError = document.getElementById('custNameError');
    const phoneError = document.getElementById('custPhoneError');
    const addressError = document.getElementById('custAddressError');

    function validateName() {
      if (!nameInput) return false;
      const val = nameInput.value.trim();

      // Block digits or pure numbers
      if (/\d/.test(val)) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        if (nameError) {
          nameError.textContent = 'Numbers are not allowed in name. Letters only.';
          nameError.classList.add('show');
        }
        return false;
      }

      if (val.length < 2) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        if (nameError) {
          nameError.textContent = 'Full name must contain at least 2 letters.';
          nameError.classList.add('show');
        }
        return false;
      }

      if (!/^[a-zA-Z\s.'’-]{2,50}$/.test(val)) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        if (nameError) {
          nameError.textContent = 'Letters and spaces only (e.g. Rajesh Kumar).';
          nameError.classList.add('show');
        }
        return false;
      }

      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
      if (nameError) {
        nameError.textContent = '';
        nameError.classList.remove('show');
      }
      return true;
    }

    function validatePhone() {
      if (!phoneInput) return false;
      // Filter out non-digits in real time so letters cannot be entered
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      const val = phoneInput.value;

      if (!val) {
        phoneInput.classList.add('is-invalid');
        phoneInput.classList.remove('is-valid');
        if (phoneError) {
          phoneError.textContent = '10-digit mobile number is required.';
          phoneError.classList.add('show');
        }
        return false;
      }

      if (val.length < 10) {
        phoneInput.classList.add('is-invalid');
        phoneInput.classList.remove('is-valid');
        if (phoneError) {
          phoneError.textContent = `Must be 10 digits (${val.length}/10 entered).`;
          phoneError.classList.add('show');
        }
        return false;
      }

      if (!/^[6-9]\d{9}$/.test(val)) {
        phoneInput.classList.add('is-invalid');
        phoneInput.classList.remove('is-valid');
        if (phoneError) {
          phoneError.textContent = 'Mobile number must start with 6, 7, 8, or 9.';
          phoneError.classList.add('show');
        }
        return false;
      }

      phoneInput.classList.remove('is-invalid');
      phoneInput.classList.add('is-valid');
      if (phoneError) {
        phoneError.textContent = '';
        phoneError.classList.remove('show');
      }
      return true;
    }

    function validateAddress() {
      if (!addressInput) return false;
      const val = addressInput.value.trim();

      if (val.length < 8) {
        addressInput.classList.add('is-invalid');
        addressInput.classList.remove('is-valid');
        if (addressError) {
          addressError.textContent = 'Please enter a complete delivery address (minimum 8 characters).';
          addressError.classList.add('show');
        }
        return false;
      }

      addressInput.classList.remove('is-invalid');
      addressInput.classList.add('is-valid');
      if (addressError) {
        addressError.textContent = '';
        addressError.classList.remove('show');
      }
      return true;
    }

    // Real-time input listeners
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (/\d/.test(nameInput.value)) {
          nameInput.value = nameInput.value.replace(/\d/g, '');
        }
        validateName();
      });
      nameInput.addEventListener('blur', validateName);
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', validatePhone);
      phoneInput.addEventListener('blur', validatePhone);
    }

    if (addressInput) {
      addressInput.addEventListener('input', validateAddress);
      addressInput.addEventListener('blur', validateAddress);
    }

    // Submit handler with strict validation
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const isNameValid = validateName();
      const isPhoneValid = validatePhone();
      const isAddrValid = validateAddress();

      if (!isNameValid) {
        nameInput.focus();
        return;
      }
      if (!isPhoneValid) {
        phoneInput.focus();
        return;
      }
      if (!isAddrValid) {
        addressInput.focus();
        return;
      }

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const address = addressInput.value.trim();
      const payment = document.getElementById('custPayment').value;
      const total = getCartTotal();

      const itemsSummary = cart.map(i => `${i.quantity}x ${i.name} (₹${(i.price * i.quantity).toFixed(2)})`).join(', ');

      alert(`✅ Order Confirmed Successfully!\n\nOrder Ref: AP-${Math.floor(100000 + Math.random() * 900000)}\nCustomer: ${name} (${phone})\nDelivery Address: ${address}\nItems: ${itemsSummary}\nTotal: ₹${total.toFixed(2)}\nPayment: ${payment}\n\nOur automated packaging dispatch fleet has received your request and will deliver your order shortly!`);

      cart = [];
      saveCart();
      closeCheckoutModal();
      closeCartDrawer();
      form.reset();
      [nameInput, phoneInput, addressInput].forEach(inp => inp && inp.classList.remove('is-valid', 'is-invalid'));
    });
  }

  function renderCartDrawer() {
    const list = document.getElementById('cartItemsList');
    const headerCount = document.getElementById('cartHeaderCount');
    const subtotalEl = document.getElementById('cartSubtotalAmount');
    const grandTotalEl = document.getElementById('cartGrandTotal');
    const footer = document.getElementById('cartDrawerFooter');

    if (!list) return;

    const count = getCartCount();
    const total = getCartTotal();

    if (headerCount) headerCount.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    if (subtotalEl) subtotalEl.textContent = `₹${total.toFixed(2)}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${total.toFixed(2)}`;

    if (cart.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon"><i class="bi bi-cart-x"></i></div>
          <h4>Your Cart is Empty</h4>
          <p>Explore our fresh 20L cans, bottled water packs, and sterile pouches to get started.</p>
          <a href="products.html" class="btn btn-outline btn-sm" onclick="window.AquaPureCart.closeDrawer()">
            Browse Products <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    let html = '<div class="cart-items-wrapper">';
    cart.forEach(item => {
      const itemSubtotal = (item.price * item.quantity).toFixed(2);
      const itemImg = item.img || 'assets/images/can-20l-commercial.jpg';
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-img">
            <img src="${itemImg}" alt="${item.name}" onerror="this.onerror=null; this.src='assets/images/can-20l-commercial.jpg';">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name" title="${item.name}">${item.name}</div>
            <div class="cart-item-price">₹${item.price.toFixed(2)} ${item.unit ? '/ ' + item.unit : ''}</div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" class="qty-btn minus" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn plus" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">&plus;</button>
              </div>
              <span class="cart-item-subtotal">₹${itemSubtotal}</span>
              <button type="button" class="item-remove-btn" data-action="remove" data-id="${item.id}" title="Remove item" aria-label="Remove item">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    list.innerHTML = html;

    // Attach row listeners
    list.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        updateQuantity(id, action === 'increase' ? 1 : -1);
      });
    });

    list.querySelectorAll('.item-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }

  function openCartDrawer() {
    injectCartDrawerHTML();
    renderCartDrawer();

    // Close mobile drawer if active
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');

    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay) overlay.classList.add('open');
    if (drawer) drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay) overlay.classList.remove('open');
    if (drawer) drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openCheckoutModal() {
    if (cart.length === 0) return;
    const modal = document.getElementById('cartCheckoutModal');
    const summaryBox = document.getElementById('checkoutSummaryBox');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div class="order-preview-list">
          ${cart.map(i => `
            <div class="preview-item" style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.92rem;">
              <span>${i.name} &times; ${i.quantity}</span>
              <strong>₹${(i.price * i.quantity).toFixed(2)}</strong>
            </div>
          `).join('')}
          <div class="preview-total" style="display:flex; justify-content:space-between; border-top:1px dashed var(--border-color); padding-top:0.6rem; margin-top:0.6rem; font-weight:700; color:var(--primary-blue);">
            <span>Total Payable:</span>
            <span>₹${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      `;
    }
    if (modal) {
      modal.classList.add('open');
      closeCartDrawer();
      document.body.style.overflow = 'hidden';

      // Clear any prior validation alerts when opening modal
      const form = document.getElementById('cartCheckoutForm');
      if (form) {
        form.querySelectorAll('.form-control').forEach(inp => inp.classList.remove('is-valid', 'is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach(fb => {
          fb.textContent = '';
          fb.classList.remove('show');
        });
      }
    }
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('cartCheckoutModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function handleCartToggleClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    openCartDrawer();
  }

  // Bind Cart Toggle Buttons (Header and any trigger buttons)
  function attachCartToggleListeners() {
    document.querySelectorAll('.cart-btn, #cartToggleBtn, [data-cart-toggle], .open-cart-btn').forEach(btn => {
      btn.removeEventListener('click', handleCartToggleClick);
      btn.addEventListener('click', handleCartToggleClick);
    });
  }

  // Ensure cart button exists in nav and binds click
  function ensureHeaderCartButton() {
    const navActions = document.querySelectorAll('.nav-actions');
    navActions.forEach(actions => {
      let cartBtn = actions.querySelector('.cart-btn');
      if (!cartBtn) {
        cartBtn = document.createElement('button');
        cartBtn.type = 'button';
        cartBtn.className = 'cart-btn';
        cartBtn.id = 'cartToggleBtn';
        cartBtn.setAttribute('aria-label', 'View Shopping Cart');
        cartBtn.setAttribute('title', 'Shopping Cart');
        cartBtn.innerHTML = `
          <i class="bi bi-cart3"></i>
          <span class="cart-badge">${getCartCount()}</span>
        `;
        const themeBtn = actions.querySelector('.theme-toggle-btn');
        if (themeBtn) {
          actions.insertBefore(cartBtn, themeBtn);
        } else {
          actions.appendChild(cartBtn);
        }
      }
      cartBtn.removeEventListener('click', handleCartToggleClick);
      cartBtn.addEventListener('click', handleCartToggleClick);
    });
  }

  // Global document-level event delegation (guarantees dynamic and existing buttons always trigger)
  document.addEventListener('click', function (e) {
    // 1. Cart Toggle Button click (including icon, badge, or button wrapper)
    const cartToggle = e.target.closest('.cart-btn, #cartToggleBtn, [data-cart-toggle], .open-cart-btn');
    if (cartToggle) {
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer();
      return;
    }

    // 2. Add to Cart button click
    const addBtn = e.target.closest('.btn-add-cart, [data-add-cart], #modalAddToCartBtn, #showcaseAddCartBtn');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();

      const id = addBtn.getAttribute('data-id') || addBtn.getAttribute('data-product') || 'can-20l';
      const name = addBtn.getAttribute('data-name') || addBtn.getAttribute('data-product') || '20L Commercial Water Can';
      const price = parseFloat(addBtn.getAttribute('data-price')) || 90;
      const img = addBtn.getAttribute('data-img') || 'assets/images/can-20l-commercial.jpg';
      const unit = addBtn.getAttribute('data-unit') || '';

      addToCart({ id, name, price, img, unit, quantity: 1 });
      return;
    }
  });

  // Keyboard accessibility: Escape key closes active cart drawer or checkout modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('cartDrawer');
      const checkoutModal = document.getElementById('cartCheckoutModal');
      if (drawer && drawer.classList.contains('open')) {
        closeCartDrawer();
      }
      if (checkoutModal && checkoutModal.classList.contains('open')) {
        closeCheckoutModal();
      }
    }
  });

  // Listen to multi-tab localStorage updates
  window.addEventListener('storage', function (e) {
    if (e.key === CART_KEY) {
      try {
        cart = e.newValue ? JSON.parse(e.newValue) : [];
      } catch (err) {
        cart = [];
      }
      updateCartBadge();
      renderCartDrawer();
    }
  });

  // Initialize
  function init() {
    injectCartDrawerHTML();
    ensureHeaderCartButton();
    attachCartToggleListeners();
    updateCartBadge();
    renderCartDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global Cart API
  window.AquaPureCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openDrawer: openCartDrawer,
    closeDrawer: closeCartDrawer,
    getCartCount,
    getCartTotal
  };
})();
