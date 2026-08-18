// ================================================================
// PIXANITHINGVAULT – COMPLETE FRONTEND JAVASCRIPT
// ================================================================

// ================================================================
// PART 0: CONFIGURATION
// ================================================================

// Backend API Base URL – Local Development ke liye
// Production mein change karna: 'https://your-backend.onrender.com/api'
const API_BASE_URL = 'http://localhost:5000/api';

// ================================================================
// PART 1: MOBILE NAVIGATION TOGGLE
// ================================================================

function toggleNav() {
    const nav = document.getElementById('mainNav');
    if (nav) {
        nav.classList.toggle('open');
    }
}

// ================================================================
// PART 2: HEADER UPDATE (Login/Logout State)
// ================================================================

function updateHeader() {
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');
    const userNameSpan = document.getElementById('headerUserName');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');

    if (token && currentUser) {
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (userNameSpan) {
            userNameSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name || 'User'}`;
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }
}

// ================================================================
// PART 3: SEARCH FUNCTIONALITY
// ================================================================

// Products Database (fallback for local search)
const products = [
    { name: 'Golden Elegance Wedding Template', category: 'Video Template', price: '$49', tags: ['golden', 'wedding'], icon: '🎬' },
    { name: 'Rustic Love Invitation Card', category: 'Graphic', price: '$39', tags: ['rustic', 'invitation'], icon: '🎨' },
    { name: 'Boho Chic Wedding Pack', category: 'Video Template', price: '$59', tags: ['boho', 'wedding'], icon: '🎬' },
    { name: 'Royal Heritage Template', category: 'Video Template', price: '$69', tags: ['royal', 'heritage'], icon: '🎬' },
    { name: 'Elegant Calligraphy Font', category: 'Typography', price: '$29', tags: ['calligraphy', 'font'], icon: '✒️' },
    { name: 'Wedding LUTs Color Pack', category: 'Plugin', price: '$34', tags: ['lut', 'color'], icon: '⚡' },
    { name: 'Rose Gold Wedding Template', category: 'Video Template', price: '$59', tags: ['rose', 'gold'], icon: '🎬' },
    { name: 'Minimalist Wedding Invitation', category: 'Graphic', price: '$29', tags: ['minimalist', 'modern'], icon: '🎨' },
    { name: 'Vintage Love Story Template', category: 'Video Template', price: '$44', tags: ['vintage', 'love'], icon: '🎬' },
    { name: 'Wedding Instagram Stories Pack', category: 'Graphic', price: '$19', tags: ['instagram', 'stories'], icon: '🎨' },
    { name: 'Bridal Makeup LUTs', category: 'Plugin', price: '$24', tags: ['bridal', 'makeup'], icon: '⚡' },
    { name: 'Floral Wedding Invitation', category: 'Graphic', price: '$34', tags: ['floral', 'flowers'], icon: '🎨' }
];

function toggleSearch() {
    const bar = document.getElementById('searchBar');
    if (!bar) return;
    if (bar.style.display === 'none' || bar.style.display === '') {
        bar.style.display = 'block';
        document.getElementById('searchInput').focus();
    } else {
        bar.style.display = 'none';
        document.getElementById('searchResults').innerHTML = '';
    }
}

function closeSearch() {
    const bar = document.getElementById('searchBar');
    if (bar) bar.style.display = 'none';
    document.getElementById('searchResults').innerHTML = '';
}

function liveSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (q === '') { container.innerHTML = ''; return; }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--gray);"><i class="fas fa-search" style="font-size:32px;opacity:0.3;"></i><p style="margin-top:10px;">No results found for "${q}"</p></div>`;
        return;
    }

    let html = '';
    filtered.slice(0, 5).forEach(p => {
        html += `
            <div class="search-result-item" onclick="goToProduct('${p.name}')">
                <span style="font-size:24px;width:40px;text-align:center;">${p.icon}</span>
                <div style="flex:1;">
                    <div style="font-weight:600;font-size:14px;">${p.name}</div>
                    <div style="font-size:12px;color:var(--gray);">${p.category}</div>
                </div>
                <div style="font-weight:700;color:var(--gold);">${p.price}</div>
            </div>
        `;
    });
    if (filtered.length > 5) {
        html += `<div style="text-align:center;padding:10px;color:var(--gray);font-size:13px;">+ ${filtered.length - 5} more results. Press Enter to see all.</div>`;
    }
    container.innerHTML = html;
}

function goToProduct(name) {
    sessionStorage.setItem('selectedProduct', name);
    window.location.href = 'product-detail.html';
}

function performSearch() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) { alert('⚠️ Please enter a search term!'); return; }
    sessionStorage.setItem('searchQuery', q);
    window.location.href = 'search.html?q=' + encodeURIComponent(q);
}

// ================================================================
// PART 4: USER AUTHENTICATION (Backend API)
// ================================================================

// ----- Open / Close Modal -----
function openUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
}

function closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
}

function openLoginModal() { openUserModal(); setTimeout(() => switchTab('login'), 100); }
function openRegisterModal() { openUserModal(); setTimeout(() => switchTab('register'), 100); }

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    if (!loginForm || !registerForm || !loginTab || !registerTab) return;

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.className = 'active';
        registerTab.className = '';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerTab.className = 'active';
        loginTab.className = '';
    }
}

// ----- Login (Email/Password) – Modal Version -----
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            closeUserModal();
            updateHeader();
            showNotification('🎉 Welcome Back!', `Hello ${data.user.name}`);
            setTimeout(() => window.location.href = 'account.html', 1000);
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (err) {
        alert('Network error. Please make sure the backend is running.\n(Backend URL: ' + API_BASE_URL + ')');
    }
}

// ----- Register – Modal Version -----
async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirm = document.getElementById('registerConfirmPassword').value.trim();

    if (password !== confirm) { alert('Passwords do not match'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return; }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            closeUserModal();
            updateHeader();
            showNotification('🎉 Account Created!', `Welcome ${data.user.name}`);
            setTimeout(() => window.location.href = 'account.html', 1500);
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (err) {
        alert('Network error. Please make sure the backend is running.\n(Backend URL: ' + API_BASE_URL + ')');
    }
}

// ----- Google Sign-In (Global – used by Modal) -----
function handleGoogleSignIn(response) {
    const idToken = response.credential;
    fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            closeUserModal();
            updateHeader();
            showNotification('🎉 Welcome!', `Hello ${data.user.name}`);
            setTimeout(() => window.location.href = 'account.html', 1000);
        } else {
            alert('Google sign-in failed: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Network error. Please make sure the backend is running.\n(Backend URL: ' + API_BASE_URL + ')'));
}

// ----- Logout -----
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    updateHeader();
    showNotification('👋 Logged Out', 'See you soon!');
    if (window.location.pathname.includes('account.html')) {
        setTimeout(() => window.location.href = 'index.html', 500);
    }
    // Also trigger auth view on homepage if login section exists
    if (typeof window.showAuthView === 'function') {
        window.showAuthView();
    }
}

// ================================================================
// PART 5: CART FUNCTIONALITY (Backend API)
// ================================================================

// Fetch cart from backend and update badge
async function fetchCartAndUpdateBadge() {
    const token = localStorage.getItem('token');
    if (!token) {
        document.querySelectorAll('.cart-badge').forEach(b => b.textContent = '0');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            const total = data.items ? data.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            document.querySelectorAll('.cart-badge').forEach(b => b.textContent = total);
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            updateHeader();
            document.querySelectorAll('.cart-badge').forEach(b => b.textContent = '0');
        }
    } catch (err) {
        console.warn('Could not fetch cart:', err);
    }
}

// Add item to cart (POST /api/cart)
async function addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to your cart');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });
        const data = await response.json();
        if (response.ok) {
            showNotification('✅ Added to Cart!', data.message || 'Item added');
            await fetchCartAndUpdateBadge();
        } else {
            alert(data.error || 'Failed to add item');
        }
    } catch (err) {
        alert('Network error. Please make sure the backend is running.');
    }
}

// Update cart badge (fallback)
function updateCartBadge() {
    fetchCartAndUpdateBadge();
}

// ================================================================
// PART 6: NOTIFICATIONS
// ================================================================

function showNotification(title, message) {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
        <div style="background:var(--primary);color:white;padding:15px 25px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.3);position:fixed;bottom:30px;right:30px;z-index:9999;animation:slideDown 0.3s ease;max-width:350px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:24px;">${title.split(' ')[0]}</span>
                <div><div style="font-weight:600;">${title}</div><div style="font-size:14px;opacity:0.9;">${message}</div></div>
            </div>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ================================================================
// PART 7: SAMPLE DATA (For Account Page – Fallback)
// ================================================================

function addSampleData() {
    if (!localStorage.getItem('userOrders')) {
        localStorage.setItem('userOrders', JSON.stringify([
            { id: 'ORD-001', product: 'Golden Elegance Wedding Template', date: 'Dec 15, 2025', items: '1 item', total: '$49.00', status: 'completed' },
            { id: 'ORD-002', product: 'Rustic Love Invitation Card', date: 'Dec 10, 2025', items: '2 items', total: '$78.00', status: 'processing' }
        ]));
    }
    if (!localStorage.getItem('userDownloads')) {
        localStorage.setItem('userDownloads', JSON.stringify([
            { name: 'Golden Elegance Wedding Template', date: 'Dec 15, 2025', size: '15 MB' },
            { name: 'Rustic Love Invitation Card', date: 'Dec 10, 2025', size: '8 MB' }
        ]));
    }
    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([
            { id: '1', name: 'Rose Gold Wedding Template', category: 'Video Template', price: '$59.00' },
            { id: '2', name: 'Elegant Calligraphy Font', category: 'Typography', price: '$29.00' }
        ]));
    }
}

// ================================================================
// PART 8: 3D FLIP CAROUSEL – INFINITE LOOP
// ================================================================

function initCarousel() {
    const wrapper = document.getElementById('categoryCarousel');
    if (!wrapper) {
        console.log('ℹ️ Carousel not found on this page');
        return;
    }

    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.carousel-card');
    if (cards.length === 0) return;

    let pauseTimeout = null;

    function pauseCarousel() {
        wrapper.classList.add('paused');
        if (pauseTimeout) {
            clearTimeout(pauseTimeout);
            pauseTimeout = null;
        }
    }

    function resumeCarousel() {
        if (pauseTimeout) {
            clearTimeout(pauseTimeout);
        }
        pauseTimeout = setTimeout(function() {
            wrapper.classList.remove('paused');
            pauseTimeout = null;
        }, 400);
    }

    function flipCard(card) {
        card.classList.toggle('flipped');
    }

    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            pauseCarousel();
            card.classList.add('flipped');
        });

        card.addEventListener('mouseleave', function() {
            card.classList.remove('flipped');
            resumeCarousel();
        });

        card.addEventListener('click', function(e) {
            pauseCarousel();
            flipCard(card);

            if (pauseTimeout) {
                clearTimeout(pauseTimeout);
            }
            pauseTimeout = setTimeout(function() {
                wrapper.classList.remove('paused');
                card.classList.remove('flipped');
                pauseTimeout = null;
            }, 2000);
        });

        card.addEventListener('touchstart', function() {
            pauseCarousel();
        }, { passive: true });

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                pauseCarousel();
                flipCard(card);
                setTimeout(function() {
                    card.classList.remove('flipped');
                    resumeCarousel();
                }, 2000);
            }
        });
    });

    let scrollTimeout = null;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            const anyHovered = document.querySelector('.carousel-card:hover');
            if (!anyHovered) {
                wrapper.classList.remove('paused');
            }
            scrollTimeout = null;
        }, 300);
    }, { passive: true });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            wrapper.classList.add('paused');
        } else {
            setTimeout(function() {
                wrapper.classList.remove('paused');
            }, 500);
        }
    });

    console.log('✅ 3D Flip Carousel initialized');
}

// ================================================================
// PART 9: DOM INITIALIZATION
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PixanithingVault - DOM Loaded');
    console.log(`🔗 Backend API URL: ${API_BASE_URL}`);

    // Initialize sample data for account page
    addSampleData();

    // Update header (login/logout state)
    updateHeader();

    // Update cart badge from backend
    fetchCartAndUpdateBadge();

    // Initialize 3D Flip Carousel
    initCarousel();

    // Search input - live search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', liveSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Close search on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
            closeUserModal();
        }
    });

    // Click outside to close search
    document.addEventListener('click', function(e) {
        const searchBar = document.getElementById('searchBar');
        const searchIcon = document.querySelector('.nav-icons a[onclick*="toggleSearch"]');
        if (searchBar && searchBar.style.display !== 'none') {
            if (!searchBar.contains(e.target) && !searchIcon?.contains(e.target)) {
                closeSearch();
            }
        }
    });

    // Click outside to close user modal
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('userModal');
        if (modal && modal.style.display === 'block') {
            const modalContent = modal.querySelector('div');
            if (!modalContent.contains(event.target) && event.target !== modal) {
                closeUserModal();
            }
        }
    });

    // Quantity buttons in cart (if present)
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            let value = parseInt(input.value);
            if (this.textContent === '+') {
                value++;
            } else if (this.textContent === '-' && value > 1) {
                value--;
            }
            input.value = value;
        });
    });

    // Check if the login section exists on the page
    const authView = document.getElementById('authView');
    if (authView) {
        const token = localStorage.getItem('token');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (token && currentUser) {
            if (typeof window.renderDashboard === 'function') {
                window.renderDashboard(currentUser);
            }
        } else {
            if (typeof window.showAuthView === 'function') {
                window.showAuthView();
            }
        }
    }

    console.log('✅ All systems ready!');
});

// ================================================================
// PART 10: SCROLL EFFECTS (Header Shadow)
// ================================================================

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        }
    }
});

// ================================================================
// PART 11: CONSOLE WELCOME
// ================================================================

console.log('🎬 Welcome to PixanithingVault!');
console.log('✨ Premium Wedding Design Resources');
console.log('📧 For support: support@pixanithingvault.com');
console.log('❤️ Thanks for visiting!');
console.log(`📦 ${products.length} products available for local search`);
console.log(`🔗 API Base URL: ${API_BASE_URL}`);
console.log('⚠️ Make sure the backend server is running on port 5000.');
console.log('🔑 Login/Register system is ready.');
console.log('👤 updateHeader() and renderDashboard() are available.');

// ================================================================
// PART 12: EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ================================================================

window.toggleNav = toggleNav;
window.toggleSearch = toggleSearch;
window.closeSearch = closeSearch;
window.liveSearch = liveSearch;
window.goToProduct = goToProduct;
window.performSearch = performSearch;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.openLoginModal = openLoginModal;
window.openRegisterModal = openRegisterModal;
window.switchTab = switchTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleGoogleSignIn = handleGoogleSignIn;
window.logoutUser = logoutUser;
window.addToCart = addToCart;
window.updateCartBadge = updateCartBadge;
window.fetchCartAndUpdateBadge = fetchCartAndUpdateBadge;
window.showNotification = showNotification;
window.updateHeader = updateHeader;
window.API_BASE_URL = API_BASE_URL;

// Dashboard functions (for homepage login section)
window.renderDashboard = function(user) {
    const authView = document.getElementById('authView');
    const dashView = document.getElementById('dashboardView');

    if (!authView || !dashView) return;

    authView.style.display = 'none';
    dashView.classList.add('active');

    const avatarInitial = document.getElementById('avatarInitial');
    if (avatarInitial) {
        const initial = (user.name || 'U').charAt(0).toUpperCase();
        if (user.picture) {
            avatarInitial.innerHTML = `<img src="${user.picture}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`;
        } else {
            avatarInitial.textContent = initial;
        }
    }

    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.name || 'User';

    const userEmail = document.getElementById('userEmail');
    if (userEmail) userEmail.textContent = user.email || '';

    const userProvider = document.getElementById('userProvider');
    if (userProvider) {
        userProvider.textContent = user.googleId ? '🌐 Google Account' : '🔐 Local Account';
    }

    const memberSince = document.getElementById('memberSince');
    if (memberSince) {
        if (user.createdAt) {
            const d = new Date(user.createdAt);
            memberSince.textContent = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
            memberSince.textContent = '—';
        }
    }
};

window.showAuthView = function() {
    const authView = document.getElementById('authView');
    const dashView = document.getElementById('dashboardView');

    if (!authView || !dashView) return;

    authView.style.display = 'block';
    dashView.classList.remove('active');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();

    const tabs = document.querySelectorAll('#tabContainer button');
    if (tabs.length) {
        tabs.forEach(b => b.classList.remove('active'));
        const loginTab = document.querySelector('[data-tab="login"]');
        if (loginTab) {
            loginTab.classList.add('active');
            if (loginForm) loginForm.classList.add('active');
            const regForm = document.getElementById('registerForm');
            if (regForm) regForm.classList.remove('active');
        }
    }

    const alertEl = document.getElementById('alert');
    if (alertEl) {
        alertEl.className = 'alert';
    }
};