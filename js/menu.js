// menu.js - Menu page logic
// Fetches all foods from the API, then filters/searches/sorts entirely client-side
// for instant feedback (a real large-scale app might push these to the backend query).

let allFoods = [];
let activeCategory = 'All';

function foodCardHTML(food) {
  const wished = isWishlisted(food.id);
  return `
    <div class="food-card">
      <div class="food-card-img">
        <img src="${food.image}" alt="${food.name}" loading="lazy" onerror="${imgFallback()}" />
        ${food.rating >= 4.7 ? '<span class="food-card-badge">Top Rated</span>' : ''}
        <button class="wishlist-btn ${wished ? 'active' : ''}" data-wish="${food.id}">${wished ? '❤️' : '🤍'}</button>
      </div>
      <div class="food-card-body">
        <h3 onclick="window.location.href='food-details.html?id=${food.id}'">${food.name}</h3>
        <p>${food.description}</p>
        <div class="food-rating">⭐ ${food.rating} <span>(${food.category})</span></div>
        <div class="food-card-footer">
          <span class="food-price">${formatPrice(food.price)}</span>
          <button class="add-cart-btn" data-add="${food.id}" title="Add to cart">+</button>
        </div>
      </div>
    </div>`;
}

function attachFoodCardEvents(container, foods) {
  container.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const food = foods.find((f) => f.id === Number(btn.dataset.add));
      if (food) addToCart(food, 1);
    });
  });

  container.querySelectorAll('[data-wish]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.wish);
      toggleWishlist(id);
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';
    });
  });
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const sortValue = document.getElementById('sortSelect').value;

  let filtered = allFoods.filter((f) => {
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      f.name.toLowerCase().includes(searchTerm) ||
      f.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortValue === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="icon">🍽️</div>
      <h3>No dishes found</h3>
      <p>Try a different search term or category.</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(foodCardHTML).join('');
  attachFoodCardEvents(grid, filtered);
}

async function loadMenu() {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = spinnerHTML();

  try {
    const res = await apiRequest('/foods');
    allFoods = res.data;
    renderMenu();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

// ---- Event wiring ----
document.getElementById('searchInput').addEventListener('input', renderMenu);
document.getElementById('sortSelect').addEventListener('change', renderMenu);

document.querySelectorAll('.pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.cat;
    renderMenu();
  });
});

// ---- Support ?category=Pizza deep-links from the home page ----
(function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat) {
    activeCategory = cat;
    document.querySelectorAll('.pill').forEach((p) => {
      p.classList.toggle('active', p.dataset.cat === cat);
    });
  }
})();

loadMenu();
