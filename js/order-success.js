// order-success.js
// Reads the last placed order from localStorage (saved by checkout.js)
// and shows a friendly confirmation screen.

function renderSuccess() {
  const wrap = document.getElementById('successPage');
  let order = null;

  try {
    order = JSON.parse(localStorage.getItem('lastOrder'));
  } catch {
    order = null;
  }

  if (!order) {
    wrap.innerHTML = `
      <div class="success-card">
        <div class="success-icon">🍽️</div>
        <h1>No recent order found</h1>
        <p>Looks like you haven't placed an order yet.</p>
        <div class="success-actions">
          <a href="menu.html" class="btn btn-primary">Browse Menu</a>
        </div>
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="success-card">
      <div class="success-icon">✅</div>
      <h1>Order Confirmed!</h1>
      <p>Thanks, ${order.customer.name.split(' ')[0]}! Your order has been placed successfully.</p>
      <p>We'll deliver it to <b>${order.customer.address}</b> soon.</p>
      <div class="order-id-box">Order ID: ${order.id}</div>
      <p>Total Paid: <b>${formatPrice(order.total)}</b> · ${order.paymentMethod}</p>
      <div class="success-actions">
        <a href="order-history.html" class="btn btn-outline">View Order History</a>
        <a href="menu.html" class="btn btn-primary">Order Again</a>
      </div>
    </div>`;
}

renderSuccess();
