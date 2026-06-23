// components.js – Shared navigation and footer injection
// New Life Laptops

const navHTML = `
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <img src="images/logo.png" alt="New Life Laptops" class="logo-img"
           onerror="this.style.display='none'">
      <span class="logo-text">New Life <span class="accent">Laptops</span></span>
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" class="nav-link">Home</a></li>
      <li class="nav-dropdown">
        <a href="shop.html" class="nav-link">Shop <i class="fas fa-chevron-down"></i></a>
        <ul class="dropdown-menu">
          <li><a href="shop.html">All Products</a></li>
          <li><a href="shop.html?category=budget">Budget Laptops</a></li>
          <li><a href="shop.html?category=business">Business Laptops</a></li>
          <li><a href="shop.html?category=student">Student Laptops</a></li>
          <li><a href="shop.html?category=gaming">Gaming / Performance</a></li>
          <li><a href="shop.html?category=desktop">Desktops</a></li>
        </ul>
      </li>
      <li><a href="about.html" class="nav-link">About</a></li>
      <li><a href="contact.html" class="nav-link">Contact</a></li>
    </ul>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
`;

const footerHTML = `
<footer class="footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="images/logo.png" alt="New Life Laptops" class="footer-logo"
           onerror="this.style.display='none'">
      <p class="footer-tagline">We rebuild computers,<br><em>God rebuilds lives.</em></p>
      <div class="footer-social">
        <a href="#" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Categories</h4>
      <ul>
        <li><a href="shop.html?category=budget">Budget Laptops</a></li>
        <li><a href="shop.html?category=business">Business Laptops</a></li>
        <li><a href="shop.html?category=student">Student Laptops</a></li>
        <li><a href="shop.html?category=gaming">Gaming / Performance</a></li>
        <li><a href="shop.html?category=desktop">Desktops</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul class="footer-contact">
        <li><i class="fas fa-envelope"></i> <a href="mailto:info@newlifelaptops.com">info@newlifelaptops.com</a></li>
        <li><i class="fas fa-phone"></i> <span>(000) 000-0000</span></li>
        <li><i class="fas fa-map-marker-alt"></i> <span>West Virginia, USA</span></li>
      </ul>
      <div class="footer-legal">
        <a href="terms.html">Terms of Service</a>
        <a href="refund.html">Refund Policy</a>
        <a href="privacy.html">Privacy Policy</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${new Date().getFullYear()} New Life Laptops. All rights reserved.</p>
    <p class="footer-verse">"We rebuild computers, God rebuilds lives."</p>
  </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.innerHTML = navHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;
  initNavbar();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll effect
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const page = href.split('?')[0];
    if (page === currentPage || (currentPage === '' && page === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    });
  });
}
