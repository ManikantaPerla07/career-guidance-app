document.addEventListener('DOMContentLoaded', function () {
  console.log('✓ CareerAI loaded successfully');

  // === Highlight active navigation link ===
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // === Smooth scroll for in-page anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // === Mobile navbar toggle (if applicable) ===
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }

  // === Fade-in on scroll for animations ===
  const fadeElements = document.querySelectorAll('.fade-in, .animated-slide');
  const revealOnScroll = () => {
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
      }
    });
  };
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
