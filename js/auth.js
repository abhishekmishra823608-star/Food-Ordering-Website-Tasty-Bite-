// auth.js
// Shared script for login.html and register.html.
// Detects which form is present on the page and wires up validation + API calls.

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,}$/;

function toggleFieldError(id, hasError) {
  document.getElementById(`group-${id}`)?.classList.toggle('invalid', hasError);
}

// If the user was sent here from checkout.html (?redirect=checkout.html),
// send them back there after a successful login/register. Defaults to home.
function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect') || 'index.html';
}

// If we arrived here with a ?redirect= param, carry it over to the
// "Don't have an account? / Already have an account?" link too.
(function preserveRedirectLink() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (!redirect) return;

  document.querySelectorAll('.form-footer-text a').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set('redirect', redirect);
    link.href = url.pathname.split('/').pop() + url.search;
  });
})();

/* ---------------- LOGIN ---------------- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let valid = true;
    toggleFieldError('email', !emailRegex.test(email));
    if (!emailRegex.test(email)) valid = false;

    toggleFieldError('password', password.length < 6);
    if (password.length < 6) valid = false;

    if (!valid) {
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser({ ...res.user, token: res.token });
      showToast('Login successful! Welcome back.', 'success');
      setTimeout(() => (window.location.href = getRedirectTarget()), 800);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Login';
    }
  });
}

/* ---------------- REGISTER ---------------- */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let valid = true;

    toggleFieldError('name', name.length < 2);
    if (name.length < 2) valid = false;

    toggleFieldError('email', !emailRegex.test(email));
    if (!emailRegex.test(email)) valid = false;

    toggleFieldError('phone', !phoneRegex.test(phone));
    if (!phoneRegex.test(phone)) valid = false;

    toggleFieldError('password', password.length < 6);
    if (password.length < 6) valid = false;

    toggleFieldError('confirmPassword', confirmPassword !== password);
    if (confirmPassword !== password) valid = false;

    if (!valid) {
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      });

      setUser({ ...res.user, token: res.token });
      showToast('Account created! Welcome to TastyBite.', 'success');
      setTimeout(() => (window.location.href = getRedirectTarget()), 800);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
  });
}
