// ========== PRODUCT DATA ==========
const PRODUCTS = [
  // Fruits
  { id: 1, emoji: '🍎', name: 'Red Apples', unit: '1 kg', price: 120, mrp: 150, category: 'fruit', badge: 'Fresh', badgeClass: '' },
  { id: 2, emoji: '🍌', name: 'Bananas', unit: '1 dozen', price: 55, mrp: 70, category: 'fruit', badge: 'Popular', badgeClass: '' },
  { id: 3, emoji: '🍊', name: 'Oranges', unit: '1 kg', price: 90, mrp: 110, category: 'fruit', badge: 'Fresh', badgeClass: '' },
  { id: 4, emoji: '🍇', name: 'Green Grapes', unit: '500 g', price: 110, mrp: 130, category: 'fruit', badge: 'Seasonal', badgeClass: '' },
  { id: 5, emoji: '🥭', name: 'Alphonso Mango', unit: '1 kg', price: 220, mrp: 280, category: 'fruit', badge: 'Premium', badgeClass: '' },
  { id: 6, emoji: '🍓', name: 'Strawberries', unit: '250 g', price: 80, mrp: 100, category: 'fruit', badge: 'Fresh', badgeClass: '' },
  { id: 7, emoji: '🍋', name: 'Lemons', unit: '6 pcs', price: 35, mrp: 45, category: 'fruit', badge: 'Fresh', badgeClass: '' },
  { id: 8, emoji: '🍑', name: 'Peaches', unit: '500 g', price: 95, mrp: 120, category: 'fruit', badge: 'Seasonal', badgeClass: '' },
  // Vegetables
  { id: 9,  emoji: '🥦', name: 'Broccoli', unit: '500 g', price: 65, mrp: 80, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 10, emoji: '🥕', name: 'Carrots', unit: '1 kg', price: 45, mrp: 60, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 11, emoji: '🍅', name: 'Tomatoes', unit: '1 kg', price: 40, mrp: 55, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 12, emoji: '🥒', name: 'Cucumbers', unit: '500 g', price: 30, mrp: 40, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 13, emoji: '🧅', name: 'Red Onions', unit: '1 kg', price: 35, mrp: 50, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 14, emoji: '🥔', name: 'Potatoes', unit: '2 kg', price: 60, mrp: 75, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 15, emoji: '🌽', name: 'Sweet Corn', unit: '3 pcs', price: 50, mrp: 65, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  { id: 16, emoji: '🥬', name: 'Spinach', unit: '250 g', price: 28, mrp: 38, category: 'vegetable', badge: 'Fresh', badgeClass: '' },
  // Organic
  { id: 17, emoji: '🥑', name: 'Organic Avocado', unit: '2 pcs', price: 180, mrp: 220, category: 'organic', badge: 'Organic', badgeClass: 'organic' },
  { id: 18, emoji: '🫑', name: 'Organic Bell Pepper', unit: '3 pcs', price: 95, mrp: 120, category: 'organic', badge: 'Organic', badgeClass: 'organic' },
  { id: 19, emoji: '🥝', name: 'Kiwi Fruits', unit: '4 pcs', price: 140, mrp: 170, category: 'organic', badge: 'Organic', badgeClass: 'organic' },
  { id: 20, emoji: '🫐', name: 'Blueberries', unit: '150 g', price: 175, mrp: 210, category: 'organic', badge: 'Organic', badgeClass: 'organic' },
  { id: 21, emoji: '🌿', name: 'Fresh Basil', unit: '50 g', price: 45, mrp: 60, category: 'organic', badge: 'Organic', badgeClass: 'organic' },
  { id: 22, emoji: '🧄', name: 'Organic Garlic', unit: '200 g', price: 55, mrp: 70, category: 'organic', badge: 'Organic', badgeClass: 'organic' },
];

// ========== STATE ==========
let cart = JSON.parse(localStorage.getItem('ee_cart') || '[]');
let quantities = {}; // { productId: qty }
let currentFilter = 'all';
let lastOrder = null;

// Initialize quantities
PRODUCTS.forEach(p => { quantities[p.id] = 1; });

// ========== CART UTILITIES ==========
function saveCart() {
  localStorage.setItem('ee_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-badge').textContent = total;
  document.getElementById('cart-badge').style.display = total > 0 ? 'grid' : 'none';
}

function getCartTotals() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(sub * 0.1);
  const total = sub - discount;
  return { sub, discount, total };
}

// ========== PAGE NAVIGATION ==========
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  if (page === 'cart')     renderCart();
  if (page === 'checkout') renderCheckout();

  // Close mobile nav
  document.getElementById('nav').classList.remove('open');
}

function showSection(id) {
  showPage('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
}

function toggleMenu() {
  document.getElementById('nav').classList.toggle('open');
}

// ========== PRODUCTS ==========
function filterProducts(cat) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === cat);
  });
  renderProducts();
  showSection('products');
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const filtered = currentFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentFilter);

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal" style="animation-delay:${i * 0.05}s">
      <div class="product-img">
        <span class="product-badge ${p.badgeClass}">${p.badge}</span>
        <span class="emoji">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-unit">${p.unit}</div>
        <div class="product-price-row">
          <span class="product-price">₹${p.price}</span>
          <span class="product-mrp">₹${p.mrp}</span>
        </div>
        <div class="qty-selector">
          <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
          <span class="qty-num" id="qty-${p.id}">${quantities[p.id] || 1}</span>
          <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
        </div>
        <button class="add-cart-btn" id="atc-${p.id}" onclick="addToCart(${p.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Trigger reveal animations
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 50);
}

function changeQty(id, delta) {
  quantities[id] = Math.max(1, (quantities[id] || 1) + delta);
  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = quantities[id];
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const qty = quantities[id] || 1;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  saveCart();

  // Visual feedback
  const btn = document.getElementById('atc-' + id);
  if (btn) {
    btn.classList.add('pop');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    setTimeout(() => {
      btn.classList.remove('pop');
      btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
      btn.style.background = '';
    }, 1200);
  }

  // Reset qty to 1
  quantities[id] = 1;
  const qtyEl = document.getElementById('qty-' + id);
  if (qtyEl) qtyEl.textContent = 1;

  showToast(`${product.emoji} ${product.name} added to cart!`, 'success');
}

// ========== CART RENDER ==========
function renderCart() {
  const list = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cart.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
    updateCartSummary('cart');
    return;
  }

  empty.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;

  list.innerHTML = cart.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-unit">${item.unit}</div>
        <div class="ci-price">₹${item.price * item.qty} <small style="color:#9ca3af;font-weight:400">(₹${item.price} × ${item.qty})</small></div>
      </div>
      <div class="ci-controls">
        <div class="ci-qty">
          <button class="ci-qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
          <span class="ci-qty-num">${item.qty}</span>
          <button class="ci-qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
        <button class="ci-remove" onclick="removeFromCart(${item.id})" title="Remove">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');

  updateCartSummary('cart');
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  const el = document.getElementById('ci-' + id);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all .25s ease';
    setTimeout(() => {
      cart = cart.filter(i => i.id !== id);
      saveCart();
      renderCart();
    }, 250);
  }
  const product = PRODUCTS.find(p => p.id === id);
  if (product) showToast(`${product.name} removed from cart`);
}

function updateCartSummary(context) {
  const { sub, discount, total } = getCartTotals();
  const prefix = context === 'cart' ? 'cart' : 'co';
  const subEl = document.getElementById(`${prefix}-subtotal`);
  const discEl = document.getElementById(`${prefix}-discount`);
  const totEl  = document.getElementById(`${prefix}-total`);
  if (subEl) subEl.textContent = `₹${sub}`;
  if (discEl) discEl.textContent = `-₹${discount}`;
  if (totEl)  totEl.textContent  = `₹${total}`;
}

// ========== CHECKOUT ==========
function renderCheckout() {
  const list = document.getElementById('checkout-items-list');
  if (list) {
    list.innerHTML = cart.map(item => `
      <div class="co-item">
        <span class="co-item-name">${item.emoji} ${item.name} × ${item.qty}</span>
        <span class="co-item-price">₹${item.price * item.qty}</span>
      </div>
    `).join('') || '<p style="color:#9ca3af;text-align:center;padding:16px">No items</p>';
  }
  updateCartSummary('co');

  // Handle payment option UI
  document.querySelectorAll('.payment-option input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(l => l.classList.remove('active'));
      radio.closest('.payment-option').classList.add('active');
    });
  });
}

function placeOrder(e) {
  e.preventDefault();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  // Show loading
  const overlay = document.getElementById('loading-overlay');
  overlay.style.display = 'grid';

  const fname   = document.getElementById('fname').value;
  const phone   = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const city    = document.getElementById('city').value;
  const pincode = document.getElementById('pincode').value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
  const { total } = getCartTotals();

  lastOrder = {
    id: 'EE' + Date.now().toString().slice(-6),
    name: fname, phone, city, pincode, payment,
    address, total,
    items: [...cart],
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
  };

  setTimeout(() => {
    overlay.style.display = 'none';
    cart = [];
    saveCart();
    renderSuccessPage();
    showPage('success');
  }, 2200);
}

function renderSuccessPage() {
  if (!lastOrder) return;
  const details = document.getElementById('success-details');
  const payMap = { cod: 'Cash on Delivery', upi: 'UPI / QR', card: 'Credit/Debit Card' };
  details.innerHTML = `
    <div class="success-detail-row"><span>Order ID</span><span>#${lastOrder.id}</span></div>
    <div class="success-detail-row"><span>Name</span><span>${lastOrder.name}</span></div>
    <div class="success-detail-row"><span>Phone</span><span>${lastOrder.phone}</span></div>
    <div class="success-detail-row"><span>Delivering to</span><span>${lastOrder.city}, ${lastOrder.pincode}</span></div>
    <div class="success-detail-row"><span>Payment</span><span>${payMap[lastOrder.payment] || lastOrder.payment}</span></div>
    <div class="success-detail-row"><span>Total Paid</span><span>₹${lastOrder.total}</span></div>
    <div class="success-detail-row"><span>Order Date</span><span>${lastOrder.date}</span></div>
  `;
}

function continueShopping() {
  lastOrder = null;
  document.getElementById('checkout-form')?.reset();
  showPage('home');
  setTimeout(() => showSection('products'), 200);
}

// ========== CONTACT ==========
function submitContact(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon 🌿', 'success');
  e.target.reset();
}

// ========== TOAST ==========
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ========== SCROLL EFFECTS ==========
function onScroll() {
  const header = document.getElementById('header');
  header.classList.toggle('scrolled', window.scrollY > 20);

  // Reveal elements
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartBadge();

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Add reveal classes to sections
  document.querySelectorAll('.section-head, .cat-card, .why-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
