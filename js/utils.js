// utils.js
// Shared helper functions used across every page:
// toast notifications, cart storage, wishlist storage, and formatting helpers.

/* ---------------- Image fallback ---------------- */
// If a food photo URL ever fails to load (broken link, hotlink block, etc.),
// this local SVG data URI is shown instead — no external dependency, always works.
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f7f7f9'/%3E%3Ctext x='50%25' y='50%25' font-size='64' text-anchor='middle' dominant-baseline='middle'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E";

// Attach this to any <img> tag: onerror="${imgFallback()}"
function imgFallback() {
  return `this.onerror=null;this.src='${FALLBACK_IMG}'`;
}

/* ---------------- Toast Notifications ---------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '⚠️', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

/* ---------------- Formatting ---------------- */
function formatPrice(value) {
  // Indian Rupee formatting, e.g. ₹1,249
  return `₹${Math.round(Number(value)).toLocaleString('en-IN')}`;
}

/* ---------------- Cart (Local Storage) ---------------- */
const CART_KEY = 'foodCart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(food, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === food.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      qty,
    });
  }

  saveCart(cart);
  showToast(`${food.name} added to cart`, 'success');
}

function updateCartQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((item) => item.id !== id);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  showToast('Item removed from cart', 'info');
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
}

/* ---------------- Wishlist (Local Storage) ---------------- */
const WISHLIST_KEY = 'foodWishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter((i) => i !== id);
    showToast('Removed from wishlist', 'info');
  } else {
    list.push(id);
    showToast('Added to wishlist', 'success');
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return list;
}

function isWishlisted(id) {
  return getWishlist().includes(id);
}

/* ---------------- Auth (Local Storage) ---------------- */
const USER_KEY = 'foodUser';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(USER_KEY);
  showToast('Logged out successfully', 'info');
  setTimeout(() => (window.location.href = 'index.html'), 800);
}

/* ---------------- Loading Spinner ---------------- */
function spinnerHTML() {
  return `<div class="spinner-wrap"><div class="spinner"></div></div>`;
}
