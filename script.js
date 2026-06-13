/* ============================================
   PRINCE DESIGN — script.js
============================================ */

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
  });
});

// ---- Burger menu ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Reveal on scroll ----
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bars
      const bar = entry.target.querySelector?.('.skill-bar');
      if (bar) animateBar(bar);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// Animate all bars inside revealed card
function animateBar(barWrap) {
  const progress = barWrap.querySelector('.skill-progress');
  if (!progress) return;
  const w = barWrap.getAttribute('data-width');
  progress.style.width = w + '%';
}

// Also observe skill cards directly for bar animation
document.querySelectorAll('.skill-card').forEach(card => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target.querySelector('.skill-bar');
        if (bar) animateBar(bar);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  obs.observe(card);
});

// ---- Counter animation ----
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(current);
  }, 16);
}
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => counterObserver.observe(n));

// ---- Lightbox ----
const portfolioItems = document.querySelectorAll('.portfolio-item');
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lightboxImg');
const lbClose   = document.getElementById('lightboxClose');
const lbPrev    = document.getElementById('lightboxPrev');
const lbNext    = document.getElementById('lightboxNext');
let currentIndex = 0;
const images = [];

portfolioItems.forEach((item, i) => {
  const img = item.querySelector('img');
  images.push({ src: img.src, alt: img.alt });
  item.addEventListener('click', () => openLightbox(i));
});

function openLightbox(i) {
  currentIndex = i;
  lbImg.src = images[i].src;
  lbImg.alt = images[i].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  lbImg.src = images[currentIndex].src;
  lbImg.alt = images[currentIndex].alt;
}
function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lbImg.src = images[currentIndex].src;
  lbImg.alt = images[currentIndex].alt;
}

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', showNext);
lbPrev.addEventListener('click', showPrev);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft')  showPrev();
});

// ---- Contact form ----
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"] span');
  btn.textContent = 'Envoi en cours...';
  setTimeout(() => {
    form.reset();
    btn.textContent = 'Envoyer le message';
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 4000);
  }, 1200);
});

// ---- Back to top ----
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Cursor glow effect (desktop only) ----
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9990;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(108,99,255,.12) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:left .1s,top .1s;
    left:-999px;top:-999px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
