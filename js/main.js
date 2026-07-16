// main.js - Home page logic
// Renders the category grid and fetches a handful of "featured" foods.

const CATEGORIES = [
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Biryani', icon: '🍛' },
  { name: 'Drinks', icon: '🥤' },
  { name: 'Desserts', icon: '🍰' },
];

function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(
    (cat) => `
    <a href="menu.html?category=${encodeURIComponent(cat.name)}" class="category-card">
      <div class="icon">${cat.icon}</div>
      <h4>${cat.name}</h4>
    </a>`
  ).join('');
}

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

async function loadFeaturedFoods() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  grid.innerHTML = spinnerHTML();

  try {
    const res = await apiRequest('/foods');
    // Show the top-rated 6 items as "featured"
    const featured = [...res.data].sort((a, b) => b.rating - a.rating).slice(0, 6);

    grid.innerHTML = featured.map(foodCardHTML).join('');
    attachFoodCardEvents(grid, featured);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${err.message}</p></div>`;
  }
}

renderCategories();
loadFeaturedFoods();
