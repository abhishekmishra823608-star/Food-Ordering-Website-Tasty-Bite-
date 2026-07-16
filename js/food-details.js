// food-details.js
// Reads the food ID from the URL (?id=3), fetches its details from the API,
// and lets the user pick a quantity and add it to the cart.

let currentFood = null;
let currentQty = 1;

function getFoodIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderDetails(food) {
  const wished = isWishlisted(food.id);
  const wrap = document.getElementById('detailsWrap');

  wrap.innerHTML = `
    <div class="details-img">
      <img src="${food.image}" alt="${food.name}" onerror="${imgFallback()}" />
    </div>
    <div class="details-info">
      <h1>${food.name}</h1>
      <div class="food-rating">⭐ ${food.rating} <span>(120+ reviews) · ${food.category}</span></div>
      <div class="price">${formatPrice(food.price)}</div>
      <p class="desc">${food.description}</p>

      <div class="qty-selector">
        <button class="qty-btn" id="qtyMinus">−</button>
        <span class="qty-value" id="qtyValue">1</span>
        <button class="qty-btn" id="qtyPlus">+</button>
      </div>

      <div class="details-actions">
        <button class="btn btn-primary" id="addToCartBtn">🛒 Add to Cart — <span id="addPrice">${formatPrice(food.price)}</span></button>
        <button class="btn btn-outline" id="wishBtn">${wished ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}</button>
      </div>

      <div class="details-meta">
        <div><div class="icon">🚴</div><p>30 min delivery</p></div>
        <div><div class="icon">${food.veg ? '🥦' : '🍗'}</div><p>${food.veg ? 'Vegetarian' : 'Non-Vegetarian'}</p></div>
        <div><div class="icon">🔥</div><p>Freshly made</p></div>
      </div>
    </div>
  `;

  // Quantity controls
  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (currentQty > 1) currentQty--;
    updateQtyUI(food);
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    currentQty++;
    updateQtyUI(food);
  });

  document.getElementById('addToCartBtn').addEventListener('click', () => {
    addToCart(food, currentQty);
  });

  document.getElementById('wishBtn').addEventListener('click', (e) => {
    toggleWishlist(food.id);
    const nowWished = isWishlisted(food.id);
    e.target.textContent = nowWished ? '❤️ Wishlisted' : '🤍 Add to Wishlist';
  });
}

function updateQtyUI(food) {
  document.getElementById('qtyValue').textContent = currentQty;
  document.getElementById('addPrice').textContent = formatPrice(food.price * currentQty);
}

function relatedCardHTML(food) {
  return `
    <div class="food-card">
      <div class="food-card-img">
        <img src="${food.image}" alt="${food.name}" loading="lazy" onerror="${imgFallback()}" />
      </div>
      <div class="food-card-body">
        <h3 onclick="window.location.href='food-details.html?id=${food.id}'">${food.name}</h3>
        <p>${food.description}</p>
        <div class="food-rating">⭐ ${food.rating} <span>(${food.category})</span></div>
        <div class="food-card-footer">
          <span class="food-price">${formatPrice(food.price)}</span>
          <button class="add-cart-btn" data-add="${food.id}">+</button>
        </div>
      </div>
    </div>`;
}

async function loadRelated(category, excludeId) {
  const grid = document.getElementById('relatedGrid');
  try {
    const res = await apiRequest(`/foods?category=${encodeURIComponent(category)}`);
    const related = res.data.filter((f) => f.id !== Number(excludeId)).slice(0, 4);
    grid.innerHTML = related.map(relatedCardHTML).join('');

    grid.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const food = related.find((f) => f.id === Number(btn.dataset.add));
        if (food) addToCart(food, 1);
      });
    });
  } catch {
    grid.innerHTML = '';
  }
}

async function init() {
  const id = getFoodIdFromURL();
  const wrap = document.getElementById('detailsWrap');

  if (!id) {
    wrap.innerHTML = `<div class="empty-state"><div class="icon">🍽️</div><p>No food selected. <a href="menu.html">Browse the menu</a></p></div>`;
    return;
  }

  wrap.innerHTML = spinnerHTML();

  try {
    const res = await apiRequest(`/foods/${id}`);
    currentFood = res.data;
    renderDetails(currentFood);
    loadRelated(currentFood.category, currentFood.id);
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

init();
