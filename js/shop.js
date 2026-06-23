// shop.js – Shop page filtering, search, sorting
// New Life Laptops

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productGrid')) {
    initShop();
  }
});

function initShop() {
  const productGrid = document.getElementById('productGrid');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sortSelect');
  const resultCount = document.getElementById('resultCount');

  let currentCategory = 'all';
  let currentSort = 'default';
  let searchQuery = '';

  // Check URL params for category pre-selection
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  if (urlCategory) {
    currentCategory = urlCategory;
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === urlCategory) btn.classList.add('active');
    });
  }

  renderProducts();

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  function getFilteredProducts() {
    let filtered = getProductsByCategory(currentCategory);
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.brand.toLowerCase().includes(searchQuery) ||
        p.model.toLowerCase().includes(searchQuery) ||
        p.processor.toLowerCase().includes(searchQuery) ||
        p.os.toLowerCase().includes(searchQuery) ||
        p.ram.toLowerCase().includes(searchQuery) ||
        p.storage.toLowerCase().includes(searchQuery)
      );
    }
    switch (currentSort) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return filtered;
  }

  function renderProducts() {
    if (!productGrid) return;
    const filtered = getFilteredProducts();
    if (resultCount) {
      resultCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
    }
    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>`;
      return;
    }
    productGrid.innerHTML = filtered.map(p => createProductCard(p)).join('');
    // Stagger-animate cards in
    productGrid.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });
  }
}

function createProductCard(product) {
  const availClass = product.availability === 'in-stock' ? 'available' : 'sold-out';
  const availText = product.availability === 'in-stock' ? 'In Stock' : 'Sold Out';
  const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
  const contactLink = `contact.html?product=${encodeURIComponent(product.name)}`;
  return `
    <div class="product-card" data-id="${product.id}">
      ${badgeHTML}
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-img"
             onerror="this.src='images/products/placeholder.svg'; this.onerror=null;">
        <div class="product-overlay">
          <a href="product.html?id=${product.id}" class="btn-overlay">View Details</a>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-specs">
          <span><i class="fas fa-microchip"></i> ${product.processor.split('(')[0].trim()}</span>
          <span><i class="fas fa-memory"></i> ${product.ram}</span>
          <span><i class="fas fa-hard-drive"></i> ${product.storage}</span>
          <span><i class="fab fa-windows"></i> ${product.os}</span>
        </div>
        <div class="product-meta">
          <span class="product-condition">${product.condition}</span>
          <span class="availability-badge ${availClass}">${availText}</span>
        </div>
        <div class="product-footer">
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-actions">
            <a href="product.html?id=${product.id}" class="btn-secondary btn-sm">Details</a>
            <a href="${contactLink}" class="btn-primary btn-sm">
              ${product.availability === 'in-stock' ? 'Contact to Buy' : 'Join Waitlist'}
            </a>
          </div>
        </div>
      </div>
    </div>`;
}
