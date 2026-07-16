// checkout.js - Checkout page logic
// Renders the delivery/payment form + order review, validates input,
// and submits the order to POST /api/orders.

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05; // 5% GST
let selectedPayment = 'cod';

function orderReviewItemHTML(item) {
  return `<div class="order-review-item"><span>${item.name} × ${item.qty}</span><span>${formatPrice(item.price * item.qty)}</span></div>`;
}

function renderCheckout() {
  const grid = document.getElementById('checkoutGrid');
  const cart = getCart();

  if (cart.length === 0) {
    grid.innerHTML = `
      <div class="empty-cart" style="grid-column:1/-1;">
        <div class="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="color:var(--color-gray); margin:10px 0 20px;">Add some delicious food before checking out.</p>
        <a href="menu.html" class="btn btn-primary">Browse Menu</a>
      </div>`;
    return;
  }

  const user = getUser();
  if (!user) {
    grid.innerHTML = `
      <div class="empty-cart" style="grid-column:1/-1;">
        <div class="icon">🔒</div>
        <h3>Please login to continue</h3>
        <p style="color:var(--color-gray); margin:10px 0 20px;">You need to be logged in before placing an order.</p>
        <a href="login.html?redirect=checkout.html" class="btn btn-primary">Login to Checkout</a>
        <p style="margin-top:14px; color:var(--color-gray); font-size:0.9rem;">
          New here? <a href="register.html?redirect=checkout.html" style="color:var(--color-primary); font-weight:600;">Create an account</a>
        </p>
      </div>`;
    return;
  }

  const subtotal = getCartTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + DELIVERY_FEE;

  grid.innerHTML = `
    <form class="form-card wide" id="checkoutForm" novalidate>
      <h2>Delivery Details</h2>
      <p class="sub">We'll send order updates to this contact info</p>

      <div class="form-row two">
        <div class="form-group" id="group-name">
          <label>Full Name</label>
          <input type="text" id="name" value="${user?.name || ''}" placeholder="John Doe" />
          <span class="error-text">Please enter your full name</span>
        </div>
        <div class="form-group" id="group-email">
          <label>Email</label>
          <input type="email" id="email" value="${user?.email || ''}" placeholder="john@example.com" />
          <span class="error-text">Please enter a valid email</span>
        </div>
      </div>

      <div class="form-row two">
        <div class="form-group" id="group-phone">
          <label>Phone Number</label>
          <input type="tel" id="phone" placeholder="+91 98765 43210" />
          <span class="error-text">Please enter a valid phone number</span>
        </div>
        <div class="form-group" id="group-zip">
          <label>PIN Code</label>
          <input type="text" id="zip" placeholder="400001" />
          <span class="error-text">Please enter a valid PIN code</span>
        </div>
      </div>

      <div class="form-group" id="group-address">
        <label>Delivery Address</label>
        <textarea id="address" rows="3" placeholder="Street, apartment, city..."></textarea>
        <span class="error-text">Please enter your delivery address</span>
      </div>

      <div class="form-group">
        <label>Order Notes (optional)</label>
        <textarea id="notes" rows="2" placeholder="Ring the doorbell, leave at the door, etc."></textarea>
      </div>

      <h2 style="margin-top:10px;">Payment Method</h2>
      <div class="payment-options">
        <div class="payment-option active" data-pay="cod">
          <div class="icon">💵</div>
          <p>Cash on Delivery</p>
        </div>
        <div class="payment-option" data-pay="card">
          <div class="icon">💳</div>
          <p>Credit / Debit Card</p>
        </div>
        <div class="payment-option" data-pay="wallet">
          <div class="icon">📱</div>
          <p>Digital Wallet</p>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-block" id="placeOrderBtn">Place Order — ${formatPrice(total)}</button>
    </form>

    <div class="order-review">
      <h3>Order Review</h3>
      ${cart.map(orderReviewItemHTML).join('')}
      <div class="summary-row" style="margin-top:14px;"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Delivery Fee</span><span>${formatPrice(DELIVERY_FEE)}</span></div>
      <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(tax)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    </div>
  `;

  attachCheckoutEvents(cart, total);
}

function setFieldError(id, hasError) {
  document.getElementById(`group-${id}`).classList.toggle('invalid', hasError);
}

function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const zip = document.getElementById('zip').value.trim();
  const address = document.getElementById('address').value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{7,}$/;

  let valid = true;

  setFieldError('name', name.length < 2);
  if (name.length < 2) valid = false;

  setFieldError('email', !emailRegex.test(email));
  if (!emailRegex.test(email)) valid = false;

  setFieldError('phone', !phoneRegex.test(phone));
  if (!phoneRegex.test(phone)) valid = false;

  setFieldError('zip', zip.length < 3);
  if (zip.length < 3) valid = false;

  setFieldError('address', address.length < 8);
  if (address.length < 8) valid = false;

  return valid ? { name, email, phone, zip, address } : null;
}

function attachCheckoutEvents(cart, total) {
  document.querySelectorAll('.payment-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      selectedPayment = opt.dataset.pay;
    });
  });

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const customerBase = validateForm();
    if (!customerBase) {
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    const notes = document.getElementById('notes').value.trim();
    const paymentLabels = { cod: 'Cash on Delivery', card: 'Credit/Debit Card', wallet: 'Digital Wallet' };

    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    try {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer: {
            name: customerBase.name,
            email: customerBase.email,
            phone: customerBase.phone,
            address: `${customerBase.address}, ${customerBase.zip}`,
            notes,
          },
          items: cart,
          total,
          paymentMethod: paymentLabels[selectedPayment],
        }),
      });

      // Save for the confirmation page, then clear the cart.
      localStorage.setItem('lastOrder', JSON.stringify(res.data));
      clearCart();
      window.location.href = 'order-success.html';
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = `Place Order — ${formatPrice(total)}`;
    }
  });
}

renderCheckout();
