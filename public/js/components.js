// components.js – Shared navigation and footer injection
// New Life Laptops

const LOGO_SRC = '/images/NLL%20LOGO%20TRANS.png';

const navHTML = `
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="/" class="nav-logo">
      <img src="${LOGO_SRC}" alt="New Life Laptops" class="logo-img">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="/" class="nav-link">Home</a></li>
      <li class="nav-dropdown">
        <a href="/shop/" class="nav-link">Shop <i class="fas fa-chevron-down"></i></a>
        <ul class="dropdown-menu">
          <li><a href="/shop/">All Products</a></li>
          <li><a href="/shop/?category=budget">Budget Laptops</a></li>
          <li><a href="/shop/?category=business">Business Laptops</a></li>
          <li><a href="/shop/?category=student">Student Laptops</a></li>
          <li><a href="/shop/?category=gaming">Gaming / Performance</a></li>
          <li><a href="/shop/?category=desktop">Desktops</a></li>
        </ul>
      </li>
      <li><a href="/about/" class="nav-link">About</a></li>
      <li><a href="/contact/" class="nav-link">Contact</a></li>
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
      <img src="${LOGO_SRC}" alt="New Life Laptops" class="footer-logo">
      <p class="footer-tagline">We rebuild computers,<br><em>God rebuilds lives.</em></p>
      <div class="footer-social">
        <a href="https://www.facebook.com/newlifelaptops" class="social-link" aria-label="Facebook" target="_blank" rel="noopener"><i class="fab fa-facebook-f"></i></a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/shop/">Shop</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Categories</h4>
      <ul>
        <li><a href="/shop/?category=budget">Budget Laptops</a></li>
        <li><a href="/shop/?category=business">Business Laptops</a></li>
        <li><a href="/shop/?category=student">Student Laptops</a></li>
        <li><a href="/shop/?category=gaming">Gaming / Performance</a></li>
        <li><a href="/shop/?category=desktop">Desktops</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul class="footer-contact">
        <li><i class="fas fa-envelope"></i> <a href="mailto:neservicewv@gmail.com">neservicewv@gmail.com</a></li>
        <li><i class="fas fa-phone"></i> <a href="tel:+13043602188">(304) 360-2188</a></li>
        <li><i class="fas fa-map-marker-alt"></i> <span>West Virginia, USA</span></li>
      </ul>
      <div class="footer-legal">
        <a href="/terms/">Terms of Service</a>
        <a href="/refund/">Refund Policy</a>
        <a href="/privacy/">Privacy Policy</a>
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

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === '/' && (path === '/' || path === '/index.html')) {
      link.classList.add('active');
    } else if (href !== '/' && path.startsWith(href)) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    });
  });

  document.querySelectorAll('.nav-dropdown').forEach(function(dd) {
    var timer;
    var menu = dd.querySelector('.dropdown-menu');
    if (!menu) return;
    var show = function() { clearTimeout(timer); dd.classList.add('dd-open'); };
    var hide = function() { timer = setTimeout(function() { dd.classList.remove('dd-open'); }, 120); };
    dd.addEventListener('mouseenter', show);
    dd.addEventListener('mouseleave', hide);
    menu.addEventListener('mouseenter', show);
    menu.addEventListener('mouseleave', hide);
  });
}
