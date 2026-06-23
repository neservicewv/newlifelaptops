// main.js – General site functionality
// New Life Laptops

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initContactForm();
  initProcessSteps();
  initSmoothScroll();
});

// Intersection Observer for scroll-reveal animations
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
    observer.observe(el);
  });
}

// Process steps stagger animation
function initProcessSteps() {
  const stepsContainer = document.querySelector('.process-track');
  if (!stepsContainer) return;
  const steps = stepsContainer.querySelectorAll('.process-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 180);
      });
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(stepsContainer);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Contact form handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Pre-fill message from URL param (e.g. from "Contact to Buy" button)
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('product');
  if (productName) {
    const msgField = form.querySelector('#message, [name="message"]');
    const subjectField = form.querySelector('#subject, [name="subject"]');
    if (msgField) {
      msgField.value = `Hi, I'm interested in purchasing the ${productName}. Please contact me with availability, pricing, and payment options. Thank you!`;
    }
    if (subjectField) subjectField.value = 'purchase';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate form submission (replace with Formspree, Netlify Forms, etc.)
    setTimeout(() => {
      showFormSuccess(form);
      form.reset();
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1500);
  });
}

function showFormSuccess(form) {
  const existing = document.getElementById('formSuccess');
  if (existing) existing.remove();
  const msg = document.createElement('div');
  msg.id = 'formSuccess';
  msg.className = 'form-success';
  msg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent! We\'ll be in touch soon.';
  form.after(msg);
  setTimeout(() => {
    msg.style.opacity = '0';
    setTimeout(() => msg.remove(), 500);
  }, 5000);
}

// Product detail page initializer
function initProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  if (!productId) { window.location.href = 'shop.html'; return; }

  const product = getProductById(productId);
  if (!product) { window.location.href = 'shop.html'; return; }

  document.title = `${product.name} – New Life Laptops`;

  const detailContainer = document.getElementById('productDetail');
  if (!detailContainer) return;

  const availClass = product.availability === 'in-stock' ? 'text-available' : 'text-sold';
  const availText = product.availability === 'in-stock' ? '✓ In Stock' : '✗ Sold Out';
  const badgeHTML = product.badge ? `<span class="product-badge mb-2" style="position:static;display:inline-block;margin-bottom:12px;">${product.badge}</span><br>` : '';
  const featuresHTML = product.features.length
    ? `<div class="detail-features">
        <h3>Key Features</h3>
        <ul>${product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
       </div>`
    : '';

  detailContainer.innerHTML = `
    <div class="detail-gallery">
      <img src="${product.image}" alt="${product.name}" class="detail-main-img"
           onerror="this.src='images/products/placeholder.svg'; this.onerror=null;">
    </div>
    <div class="detail-info">
      ${badgeHTML}
      <div class="detail-brand">${product.brand}</div>
      <h1 class="detail-name">${product.name}</h1>
      <div class="detail-price">$${product.price.toFixed(2)}</div>
      <p class="detail-description">${product.description}</p>
      <div class="detail-specs-grid">
        <div class="spec-item"><span class="spec-label">Processor</span><span class="spec-value">${product.processor}</span></div>
        <div class="spec-item"><span class="spec-label">RAM</span><span class="spec-value">${product.ram}</span></div>
        <div class="spec-item"><span class="spec-label">Storage</span><span class="spec-value">${product.storage}</span></div>
        <div class="spec-item"><span class="spec-label">Display</span><span class="spec-value">${product.display}</span></div>
        <div class="spec-item"><span class="spec-label">Operating System</span><span class="spec-value">${product.os}</span></div>
        <div class="spec-item"><span class="spec-label">Condition</span><span class="spec-value">${product.condition}</span></div>
        <div class="spec-item"><span class="spec-label">Battery</span><span class="spec-value">${product.battery}</span></div>
        <div class="spec-item"><span class="spec-label">Availability</span><span class="spec-value ${availClass}">${availText}</span></div>
      </div>
      ${featuresHTML}
      <div class="detail-actions">
        <a href="contact.html?product=${encodeURIComponent(product.name)}" class="btn-primary btn-lg">
          <i class="fas fa-envelope"></i> Contact to Buy
        </a>
        <a href="shop.html" class="btn-secondary btn-lg">
          <i class="fas fa-arrow-left"></i> Back to Shop
        </a>
      </div>
      <div class="detail-trust">
        <span><i class="fas fa-shield-halved"></i> Quality Inspected</span>
        <span><i class="fas fa-screwdriver-wrench"></i> Professionally Restored</span>
        <span><i class="fas fa-heart"></i> Faith-Based Business</span>
      </div>
    </div>`;

  // Related products
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  const relatedGrid = document.getElementById('relatedProducts');
  if (relatedGrid && related.length) {
    relatedGrid.innerHTML = related.map(p => createProductCard(p)).join('');
  } else if (relatedGrid) {
    relatedGrid.parentElement.style.display = 'none';
  }
}
