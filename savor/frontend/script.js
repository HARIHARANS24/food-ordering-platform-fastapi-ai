const API_BASE_URL = '';

// ─── DOM ───────────────────────────────────────────────────────────────────
const cartIcon = document.getElementById('cartIcon');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElem = document.getElementById('cartCount');
const cartTotalElem = document.getElementById('cartTotal');
const notification = document.getElementById('notification');
const mainHeader = document.getElementById('mainHeader');

const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const closeChatBtn = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChat');

// ─── STATE ─────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('savor_cart')) || [];
let allItems = [];
let viewMode = 'grid';
let wishlist = JSON.parse(localStorage.getItem('savor_wishlist')) || [];

// ─── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupIntersectionObserver();
    setupScrollHeader();

    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', () => {
        if (cartDrawer?.classList.contains('open')) toggleCart();
    });

    if (chatFab) chatFab.addEventListener('click', toggleChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);
    if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    const path = window.location.pathname;

    if (path.endsWith('index.html') || path === '/' || path.endsWith('/') || path.endsWith('savor/frontend/')) {
        initMenuPage();
    } else if (path.endsWith('checkout.html')) {
        loadCheckout();
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
});

// ─── SCROLL HEADER ─────────────────────────────────────────────────────────
function setupScrollHeader() {
    if (!mainHeader) return;
    window.addEventListener('scroll', () => {
        mainHeader.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ─── INTERSECTION OBSERVER ─────────────────────────────────────────────────
function setupIntersectionObserver() {
    const targets = document.querySelectorAll('.fade-in-target');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${i * 0.06}s`;
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => observer.observe(t));
}

// ─── NOTIFICATION ──────────────────────────────────────────────────────────
function showNotification(msg, emoji = '✓') {
    if (!notification) return;
    notification.innerHTML = `<span>${emoji}</span> ${msg}`;
    notification.classList.add('show');
    clearTimeout(notification._timer);
    notification._timer = setTimeout(() => notification.classList.remove('show'), 2800);
}

// ─── MENU PAGE INIT ────────────────────────────────────────────────────────
function initMenuPage() {
    loadMenu();

    // Filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderMenu();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchClear?.classList.toggle('visible', searchInput.value.length > 0);
            renderMenu();
        });
    }
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.classList.remove('visible');
            renderMenu();
        });
    }

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', renderMenu);

    // View toggle
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    if (gridBtn) gridBtn.addEventListener('click', () => { viewMode = 'grid'; gridBtn.classList.add('active'); listBtn?.classList.remove('active'); renderMenu(); });
    if (listBtn) listBtn.addEventListener('click', () => { viewMode = 'list'; listBtn.classList.add('active'); gridBtn?.classList.remove('active'); renderMenu(); });
}

// ─── LOAD MENU ─────────────────────────────────────────────────────────────
async function loadMenu() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;

    try {
        const res = await fetch(`${API_BASE_URL}/menu`);
        if (!res.ok) throw new Error();
        allItems = await res.json();
        renderMenu();
    } catch {
        menuContainer.innerHTML = `
            <div style="text-align:center; padding:5rem 2rem; color:var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:1rem;">🔌</div>
                <h3 style="font-family:'Playfair Display',serif; margin-bottom:0.5rem;">Backend not connected</h3>
                <p style="font-size:0.9rem;">Start the FastAPI server to load the menu.</p>
            </div>`;
    }
}

// ─── RENDER MENU ───────────────────────────────────────────────────────────
function renderMenu() {
    const menuContainer = document.getElementById('menuContainer');
    const resultsInfo = document.getElementById('resultsInfo');
    if (!menuContainer) return;

    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
    const sortValue = document.getElementById('sortSelect')?.value || 'default';

    // Filter
    let filtered = allItems.filter(item => {
        const matchCat = activeFilter === 'all' || item.category === activeFilter;
        const matchSearch = !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
        return matchCat && matchSearch;
    });

    // Sort
    switch (sortValue) {
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    // Results info
    if (resultsInfo) {
        if (query || activeFilter !== 'all') {
            resultsInfo.innerHTML = `Showing <strong>${filtered.length}</strong> result${filtered.length !== 1 ? 's' : ''}${query ? ` for "<strong>${query}</strong>"` : ''}`;
        } else {
            resultsInfo.innerHTML = '';
        }
    }

    if (filtered.length === 0) {
        menuContainer.innerHTML = `
            <div class="menu-section">
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No dishes found</h3>
                    <p>Try a different search or filter.</p>
                </div>
            </div>`;
        return;
    }

    // When sorted, show flat grid; otherwise group by category
    if (sortValue !== 'default' || query) {
        const gridClass = viewMode === 'list' ? 'menu-grid list-view' : 'menu-grid';
        let html = `<div class="menu-section"><div class="${gridClass}">`;
        filtered.forEach((item, i) => { html += buildCard(item, i); });
        html += `</div></div>`;
        menuContainer.innerHTML = html;
    } else {
        // Group by category
        const categoryMeta = {
            'healthy foods': { icon: '🥗' },
            'fast foods': { icon: '🍔' },
            'foods': { icon: '🍽️' },
            'beverages': { icon: '🥤' },
            'desserts': { icon: '🍰' },
            'snacks': { icon: '🍟' },
        };
        const categorized = {};
        filtered.forEach(item => {
            if (!categorized[item.category]) categorized[item.category] = [];
            categorized[item.category].push(item);
        });

        let html = '<div class="menu-section">';
        let cardIndex = 0;
        for (const [cat, items] of Object.entries(categorized)) {
            const meta = categoryMeta[cat] || { icon: '🍴' };
            const gridClass = viewMode === 'list' ? 'menu-grid list-view' : 'menu-grid';
            html += `
                <div class="menu-category-section">
                    <div class="category-header">
                        <span class="category-icon">${meta.icon}</span>
                        <h2 class="category-title">${cat}</h2>
                        <div class="category-line"></div>
                        <span class="category-count">${items.length}</span>
                    </div>
                    <div class="${gridClass}">`;
            items.forEach(item => { html += buildCard(item, cardIndex++); });
            html += `</div></div>`;
        }
        html += '</div>';
        menuContainer.innerHTML = html;
    }

    setupIntersectionObserver();
}

// ─── BUILD CARD ────────────────────────────────────────────────────────────
function buildCard(item, index) {
    const isLiked = wishlist.includes(item.id);
    const delay = Math.min(index * 0.05, 0.6);
    const badges = { 'healthy foods': '🌿 Healthy', 'desserts': '🍰 Sweet', 'fast foods': '⚡ Fast' };
    const badge = badges[item.category] || '';

    return `
        <div class="menu-item fade-in-target" style="animation-delay:${delay}s;">
            <div class="menu-item-img-wrap">
                <img 
                    src="${item.imageURL}" 
                    alt="${item.name}" 
                    loading="lazy"
                    onerror="this.src='https://placehold.co/400x280/1a1a1a/555?text=${encodeURIComponent(item.name)}'"
                >
                <div class="img-overlay"></div>
                ${badge ? `<span class="item-badge">${badge}</span>` : ''}
                <button 
                    class="wishlist-btn ${isLiked ? 'liked' : ''}" 
                    onclick="toggleWishlist(${item.id}, this)" 
                    title="${isLiked ? 'Remove from wishlist' : 'Add to wishlist'}"
                >${isLiked ? '❤️' : '🤍'}</button>
            </div>
            <div class="menu-content">
                <div class="menu-content-left">
                    <div class="menu-category-tag">${item.category}</div>
                    <h3 class="menu-title">${item.name}</h3>
                    <div class="menu-bottom">
                        <span class="menu-price">$${item.price.toFixed(2)}</span>
                        <button 
                            class="add-to-cart-btn" 
                            id="addBtn-${item.id}"
                            onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, this)"
                        >+ Add</button>
                    </div>
                </div>
            </div>
        </div>`;
}

// ─── WISHLIST ──────────────────────────────────────────────────────────────
function toggleWishlist(id, btn) {
    const idx = wishlist.indexOf(id);
    if (idx === -1) {
        wishlist.push(id);
        btn.textContent = '❤️';
        btn.classList.add('liked');
        showNotification('Added to wishlist', '❤️');
    } else {
        wishlist.splice(idx, 1);
        btn.textContent = '🤍';
        btn.classList.remove('liked');
    }
    localStorage.setItem('savor_wishlist', JSON.stringify(wishlist));
}

// ─── CART ──────────────────────────────────────────────────────────────────
function addToCart(id, name, price, btnEl) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    showNotification(`${name} added!`, '🛒');

    if (btnEl) {
        btnEl.textContent = '✓ Added';
        btnEl.classList.add('added');
        setTimeout(() => {
            btnEl.textContent = '+ Add';
            btnEl.classList.remove('added');
        }, 1500);
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
    const path = window.location.pathname;
    if (path.endsWith('checkout.html')) loadCheckout();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else { saveCart(); updateCartUI(); }
}

function saveCart() {
    localStorage.setItem('savor_cart', JSON.stringify(cart));
}

function toggleCart() {
    if (!cartDrawer || !overlay) return;
    cartDrawer.classList.toggle('open');
    overlay.classList.toggle('active');
}

function updateCartUI() {
    if (!cartCountElem) return;

    let total = 0, count = 0;

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="btn btn-primary btn-sm" onclick="toggleCart()">Browse Menu</a>
                </div>`;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                count += item.quantity;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                        </div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                            <span class="qty-num">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">🗑</button>
                    </div>`;
            }).join('');
            cart.forEach(i => { if (!cartItemsContainer.innerHTML.includes(i.id)) { /* already counted */ } });
            // Recalculate
            total = 0; count = 0;
            cart.forEach(i => { total += i.price * i.quantity; count += i.quantity; });
        }
    }

    cartCountElem.textContent = count;
    if (cartTotalElem) cartTotalElem.textContent = `$${total.toFixed(2)}`;
}

// ─── CHAT ──────────────────────────────────────────────────────────────────
function toggleChat() {
    if (!chatWindow) return;
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatMessages?.children.length === 0) {
        addMessage('bot', "Hello! I'm your SAVOR Culinary Assistant 🍽️ Ask me about healthy options, spicy dishes, or anything on our menu!");
    }
}

async function sendMessage() {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'msg bot typing';
    typingDiv.innerHTML = '<div class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        typingDiv.remove();
        addMessage('bot', data.response);
    } catch {
        typingDiv.remove();
        addMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again!");
    }
}

function addMessage(sender, text) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ─── CHECKOUT ──────────────────────────────────────────────────────────────
function loadCheckout() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const paymentForm = document.getElementById('paymentForm');
    const paymentSection = document.getElementById('paymentSection');
    const subtotalVal = document.getElementById('subtotalVal');
    const taxVal = document.getElementById('taxVal');

    if (!checkoutItems || !checkoutTotal) return;

    if (cart.length === 0) {
        checkoutItems.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:2rem 0;">Your cart is empty. <a href="index.html" style="color:var(--primary);">Go back to menu →</a></p>`;
        checkoutTotal.textContent = '$0.00';
        if (paymentSection) paymentSection.style.display = 'none';
        return;
    }

    let total = 0;
    checkoutItems.innerHTML = cart.map(item => {
        const t = item.price * item.quantity;
        total += t;
        return `
            <div class="checkout-item">
                <div>
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-qty">× ${item.quantity}</div>
                </div>
                <div style="display:flex;align-items:center;gap:0.75rem;">
                    <span class="checkout-item-price">$${t.toFixed(2)}</span>
                    <button class="checkout-remove-btn" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            </div>`;
    }).join('');

    const tax = total * 0.05;
    checkoutTotal.textContent = `$${(total + tax).toFixed(2)}`;
    if (subtotalVal) subtotalVal.textContent = `$${total.toFixed(2)}`;
    if (taxVal) taxVal.textContent = `$${tax.toFixed(2)}`;

    if (paymentForm) {
        paymentForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = paymentForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<div class="loader" style="width:20px;height:20px;margin:0;border-width:3px;display:inline-block;vertical-align:middle;margin-right:0.5rem;"></div> Processing...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_BASE_URL}/process-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cart, total })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    const successEl = document.getElementById('paymentSuccess');
                    if (paymentSection) paymentSection.style.display = 'none';
                    if (successEl) successEl.innerHTML = `
                        <div class="checkout-form-card payment-success">
                            <div class="success-icon">🎉</div>
                            <h2>Payment Successful!</h2>
                            <p style="color:var(--text-muted);margin:0.5rem 0 2rem;">Your order is confirmed. Estimated delivery: 25–35 minutes.</p>
                            <a href="index.html" class="btn btn-primary">Order More Food →</a>
                        </div>`;
                    cart = [];
                    saveCart();
                    updateCartUI();
                }
            } catch {
                btn.innerHTML = 'Pay Now 🔐';
                btn.disabled = false;
                showNotification('Payment failed. Please try again.', '⚠️');
            }
        };
    }
}

// ─── CONTACT FORM ──────────────────────────────────────────────────────────
async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    const formData = {
        name: form.name?.value || '',
        email: form.email?.value || '',
        message: form.message?.value || ''
    };

    try {
        const res = await fetch(`${API_BASE_URL}/contact-submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.status === 'success') {
            const status = document.getElementById('formStatus');
            form.style.display = 'none';
            if (status) status.innerHTML = `
                <div style="text-align:center;padding:2rem;">
                    <div style="font-size:3rem;margin-bottom:1rem;">✉️</div>
                    <h3 style="font-family:'Playfair Display',serif;color:var(--secondary);margin-bottom:0.5rem;">Message Sent!</h3>
                    <p style="color:var(--text-muted);">Thanks for reaching out. We'll get back to you within 2 hours.</p>
                </div>`;
        }
    } catch {
        showNotification('Failed to send message. Please try again.', '⚠️');
        btn.innerHTML = orig;
        btn.disabled = false;
    }
}