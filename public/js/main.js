// main.js – General site functionality
// New Life Laptops

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initContactForm();
  initProcessSteps();
  initSmoothScroll();
});

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

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

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
}
