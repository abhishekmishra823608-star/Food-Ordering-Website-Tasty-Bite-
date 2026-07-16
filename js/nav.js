// nav.js
// Handles the responsive hamburger menu, cart badge, and swapping
// Login/Logout links based on auth state. Included on every page.

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      overlay?.classList.toggle('show');
    });

    overlay?.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      overlay.classList.remove('show');
    });

    // Close menu when a link is tapped (mobile UX)
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay?.classList.remove('show');
      });
    });
  }

  // ---- Cart badge ----
  updateCartBadge();

  // ---- Auth-aware nav link ----
  const authLink = document.getElementById('authLink');
  const user = getUser();
  if (authLink && user) {
    authLink.textContent = 'Logout';
    authLink.href = '#';
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // ---- Highlight the active nav link based on current page ----
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    if (link.dataset.page === current) link.classList.add('active');
  });
});
