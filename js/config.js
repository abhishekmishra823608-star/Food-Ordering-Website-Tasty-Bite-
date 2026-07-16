// config.js
// FRONTEND-ONLY VERSION
// ----------------------------------------------------------------
// This file replaces what used to be a real Express backend call.
// It exposes the same `apiRequest(endpoint, options)` function that
// every page's JS already calls, so main.js / menu.js / food-details.js /
// checkout.js / auth.js / order-history.js did NOT need to change at all.
//
// Under the hood it "fakes" a REST API using:
//   - FOODS_DATA (js/foods-data.js)  -> for /foods and /foods/:id
//   - localStorage "mockUsers"        -> for /auth/register and /auth/login
//   - localStorage "mockOrders"       -> for /orders
//
// NOTE: Password "hashing" here uses the browser's built-in SubtleCrypto
// (SHA-256) purely so plaintext passwords aren't sitting in localStorage.
// This is still NOT secure storage -- it's a demo. A real app must
// authenticate against a real backend (see the full-stack version of
// this project, which uses bcrypt + JWT on a Node/Express server).
// ----------------------------------------------------------------

const USERS_KEY = 'mockUsers';
const ORDERS_KEY = 'mockOrders';

function readStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function writeStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Simulates network latency so loading spinners are visible, like a real API call.
function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apiError(message) {
  throw new Error(message);
}

/**
 * Drop-in replacement for the real apiRequest() used against the Express backend.
 * Same signature: apiRequest('/foods'), apiRequest('/auth/login', { method: 'POST', body: '...' })
 */
async function apiRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  await delay();

  // ---------- GET /foods ----------
  if (method === 'GET' && path === '/foods') {
    let foods = [...FOODS_DATA];
    const category = params.get('category');
    const search = params.get('search');

    if (category && category.toLowerCase() !== 'all') {
      foods = foods.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      foods = foods.filter(
        (f) => f.name.toLowerCase().includes(term) || f.description.toLowerCase().includes(term)
      );
    }
    return { success: true, count: foods.length, data: foods };
  }

  // ---------- GET /foods/:id ----------
  if (method === 'GET' && /^\/foods\/\d+$/.test(path)) {
    const id = Number(path.split('/')[2]);
    const food = FOODS_DATA.find((f) => f.id === id);
    if (!food) apiError('Food item not found');
    return { success: true, data: food };
  }

  // ---------- POST /auth/register ----------
  if (method === 'POST' && path === '/auth/register') {
    const { name, email, password, phone } = body || {};

    if (!name || !email || !password) apiError('Name, email and password are required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) apiError('Please provide a valid email address');
    if (password.length < 6) apiError('Password must be at least 6 characters');

    const users = readStore(USERS_KEY);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) apiError('An account with this email already exists');

    const hashed = await hashPassword(password);
    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name,
      email,
      phone: phone || '',
      password: hashed,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeStore(USERS_KEY, users);

    return {
      success: true,
      message: 'Registration successful',
      token: 'mock-token-' + newUser.id,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  }

  // ---------- POST /auth/login ----------
  if (method === 'POST' && path === '/auth/login') {
    const { email, password } = body || {};
    if (!email || !password) apiError('Email and password are required');

    const users = readStore(USERS_KEY);
    const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) apiError('Invalid email or password');

    const hashed = await hashPassword(password);
    if (hashed !== user.password) apiError('Invalid email or password');

    return {
      success: true,
      message: 'Login successful',
      token: 'mock-token-' + user.id,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  // ---------- POST /orders ----------
  if (method === 'POST' && path === '/orders') {
    const { customer, items, total, paymentMethod } = body || {};

    if (!customer || !customer.name || !customer.email || !customer.address) {
      apiError('Customer name, email and address are required');
    }
    if (!items || !Array.isArray(items) || items.length === 0) apiError('Cart is empty');
    if (!total || total <= 0) apiError('Invalid order total');

    const orders = readStore(ORDERS_KEY);
    const newOrder = {
      id: 'ORD' + Date.now(),
      customer,
      items,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    writeStore(ORDERS_KEY, orders);

    return { success: true, message: 'Order placed successfully', data: newOrder };
  }

  // ---------- GET /orders?email= ----------
  if (method === 'GET' && path === '/orders') {
    const email = params.get('email');
    let orders = readStore(ORDERS_KEY);
    if (email) {
      orders = orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
    }
    return { success: true, count: orders.length, data: orders };
  }

  apiError('Unknown API route: ' + endpoint);
}
