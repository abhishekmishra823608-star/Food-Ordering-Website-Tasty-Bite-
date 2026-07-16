// cart.js - Cart page logic
// Renders cart items from localStorage, handles quantity +/-, removal,
// a simple promo code, and dynamic total calculation.

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05; // 5% GST
let appliedDiscount = 0;

function cartItemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" onerror="${imgFallback()}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Unit price: ${formatPrice(item.price)}</p>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="dec">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" data-action="inc">+</button>
        <button class="remove-btn" data-action="remove" title="Remove item">🗑️</button>
      </div>
    </div>`;
}

function renderCart() {
  const layout = document.getElementById('cartLayout');
  const cart = getCart();

  if (cart.length === 0) {
    layout.innerHTML = `
      <div class="empty-cart" style="grid-column:1/-1;">
        <div class="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="color:var(--color-gray); margin: 10px 0 20px;">Looks like you haven't added anything yet.</p>
        <a href="menu.html" class="btn btn-primary">Browse Menu</a>
      </div>`;
    document.getElementById('cartSubtitle').textContent = 'Your cart is currently empty';
    return;
  }

  document.getElementById('cartSubtitle').textContent = `${getCartCount()} item(s) in your cart`;

  const subtotal = getCartTotal();
  const tax = subtotal * TAX_RATE;
  const total = Math.max(subtotal + tax + DELIVERY_FEE - appliedDiscount, 0);

  layout.innerHTML = `
    <div class="cart-items">
      ${cart.map(cartItemHTML).join('')}
    </div>
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Delivery Fee</span><span>${formatPrice(DELIVERY_FEE)}</span></div>
      <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(tax)}</span></div>
      ${appliedDiscount > 0 ? `<div class="summary-row"><span>Discount</span><span>-${formatPrice(appliedDiscount)}</span></div>` : ''}
      <div class="promo-box">
        <input type="text" id="promoInput" placeholder="Promo code (try TASTY20)" />
        <button class="btn btn-dark" id="applyPromoBtn">Apply</button>
      </div>
      <div class="summary-row total"><span>Total</span><span id="cartGrandTotal">${formatPrice(total)}</span></div>
      <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:16px;">Proceed to Checkout</a>
    </div>
  `;

  attachCartEvents();
}

function attachCartEvents() {
  document.querySelectorAll('.cart-item').forEach((el) => {
    const id = Number(el.dataset.id);
    const cart = getCart();
    const item = cart.find((i) => i.id === id);

    el.querySelector('[data-action="inc"]').addEventListener('click', () => {
      updateCartQty(id, item.qty + 1);
      renderCart();
    });

    el.querySelector('[data-action="dec"]').addEventListener('click', () => {
      updateCartQty(id, item.qty - 1);
      renderCart();
    });

    el.querySelector('[data-action="remove"]').addEventListener('click', () => {
      removeFromCart(id);
      renderCart();
    });
  });

  document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    if (code === 'TASTY20') {
      appliedDiscount = getCartTotal() * 0.2;
      showToast('Promo code applied! 20% off', 'success');
    } else {
      appliedDiscount = 0;
      showToast('Invalid promo code', 'error');
    }
    renderCart();
  });
}

renderCart();
