// order-history.js
// Fetches past orders for the logged-in user's email via GET /api/orders?email=...

function historyItemHTML(order) {
  const date = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const itemsSummary = order.items.map((i) => `${i.name} ×${i.qty}`).join(', ');

  return `
    <div class="history-item">
      <div class="history-item-head">
        <div><b>${order.id}</b> · ${date}</div>
        <span class="status-tag">${order.status}</span>
      </div>
      <p style="color:var(--color-gray); font-size:0.9rem; margin-bottom:8px;">${itemsSummary}</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:var(--color-primary);">${formatPrice(order.total)}</span>
        <span style="font-size:0.85rem; color:var(--color-gray);">${order.paymentMethod}</span>
      </div>
    </div>`;
}

async function loadHistory() {
  const list = document.getElementById('historyList');
  const user = getUser();

  if (!user) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔒</div>
        <h3>Please login to view your orders</h3>
        <p style="margin: 10px 0 20px;">Your order history is tied to your account.</p>
        <a href="login.html" class="btn btn-primary">Login</a>
      </div>`;
    return;
  }

  list.innerHTML = spinnerHTML();

  try {
    const res = await apiRequest(`/orders?email=${encodeURIComponent(user.email)}`);
    if (res.data.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="icon">📦</div>
          <h3>No orders yet</h3>
          <p style="margin: 10px 0 20px;">Once you place an order, it'll show up here.</p>
          <a href="menu.html" class="btn btn-primary">Browse Menu</a>
        </div>`;
      return;
    }

    const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    list.innerHTML = sorted.map(historyItemHTML).join('');
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

loadHistory();
