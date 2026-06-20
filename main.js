// === MAIN.JS — Shared functionality across all pages ===

// Language management
let currentLang = localStorage.getItem('wanderwise-lang') || 'en';
document.documentElement.setAttribute('data-lang', currentLang);

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('wanderwise-lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  if (lang === 'hi') document.body.classList.add('hindi');
  else document.body.classList.remove('hindi');
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  updatePageText();
}

function updatePageText() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const translated = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile hamburger
function initHamburger() {
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!ham || !links) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('active');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

// Custom cursor
function initCursor() {
  if (window.innerWidth < 768) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animate() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    dot.style.left = mx - 4 + 'px';
    dot.style.top = my - 4 + 'px';
    ring.style.left = cx - 18 + 'px';
    ring.style.top = cy - 18 + 'px';
    requestAnimationFrame(animate);
  })();
  document.querySelectorAll('a, button, .card, .dest-card, .interest-chip, .pill').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.transform = 'scale(1.5)'; ring.style.borderColor = 'var(--accent-cyan)'; });
    el.addEventListener('mouseleave', () => { ring.style.transform = 'scale(1)'; ring.style.borderColor = 'var(--primary)'; });
  });
}

// Scroll reveal
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Particles
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 2 + 0.5;
      this.o = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,107,53,${this.o})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,107,53,${0.08 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// Animated counter
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const suffix = el.dataset.suffix || '';
  function update() {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString() + suffix; return; }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    requestAnimationFrame(update);
  }
  update();
}

// Toast notification
function showToast(title, msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<div class="toast-title"></div><div class="toast-msg"></div>';
    document.body.appendChild(toast);
  }
  toast.classList.remove('error');
  if (type === 'error') toast.classList.add('error');
  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// Generate navbar HTML
function getNavHTML(activePage) {
  const pages = [
    { key: 'home', href: 'index.html' },
    { key: 'destinations', href: 'destinations.html' },
    { key: 'planner', href: 'planner.html' },
    { key: 'budget', href: 'budget.html' },
    { key: 'weather', href: 'weather.html' },
    { key: 'culture', href: 'culture.html' },
    { key: 'itinerary', href: 'itinerary.html' },
    { key: 'blog', href: 'blog.html' },
    { key: 'gallery', href: 'gallery.html' },
    { key: 'contact', href: 'contact.html' },
    { key: 'tips', href: 'tips.html' }
  ];
  let links = pages.map(p =>
    `<li><a href="${p.href}" class="${p.key === activePage ? 'active' : ''}" data-t="nav.${p.key}">${t('nav.' + p.key)}</a></li>`
  ).join('');
  return `
    <a href="index.html" class="nav-logo"><span>✈️</span> WanderWise</a>
    <ul class="nav-links">${links}</ul>
    <div style="display:flex;align-items:center;gap:0.5rem;">
      <div class="lang-toggle">
        <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="setLanguage('en')">EN</button>
        <button class="lang-btn ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi" onclick="setLanguage('hi')">हि</button>
      </div>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  `;
}

// Generate footer HTML
function getFooterHTML() {
  return `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo"><span>✈️</span> WanderWise</a>
        <p data-t="footer.about">${t('footer.about')}</p>
        <div class="social-links" style="margin-top:1rem;">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="YouTube">▶️</a>
        </div>
      </div>
      <div>
        <h4 data-t="footer.quickLinks">${t('footer.quickLinks')}</h4>
        <ul class="footer-links">
          <li><a href="index.html" data-t="nav.home">${t('nav.home')}</a></li>
          <li><a href="destinations.html" data-t="nav.destinations">${t('nav.destinations')}</a></li>
          <li><a href="planner.html" data-t="nav.planner">${t('nav.planner')}</a></li>
          <li><a href="budget.html" data-t="nav.budget">${t('nav.budget')}</a></li>
        </ul>
      </div>
      <div>
        <h4 data-t="footer.explore">${t('footer.explore')}</h4>
        <ul class="footer-links">
          <li><a href="weather.html" data-t="nav.weather">${t('nav.weather')}</a></li>
          <li><a href="culture.html" data-t="nav.culture">${t('nav.culture')}</a></li>
          <li><a href="blog.html" data-t="nav.blog">${t('nav.blog')}</a></li>
          <li><a href="gallery.html" data-t="nav.gallery">${t('nav.gallery')}</a></li>
        </ul>
      </div>
      <div>
        <h4 data-t="footer.support">${t('footer.support')}</h4>
        <ul class="footer-links">
          <li><a href="contact.html" data-t="nav.contact">${t('nav.contact')}</a></li>
          <li><a href="tips.html" data-t="nav.tips">${t('nav.tips')}</a></li>
          <li><a href="#" data-t="footer.privacy">${t('footer.privacy')}</a></li>
          <li><a href="#" data-t="footer.terms">${t('footer.terms')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span data-t="footer.copyright">${t('footer.copyright')}</span>
      <span>Made with ❤️ for travelers</span>
    </div>
  `;
}

// Initialize common elements
function initPage(activePage) {
  // Set lang
  if (currentLang === 'hi') document.body.classList.add('hindi');
  // Render nav
  const nav = document.querySelector('.navbar');
  if (nav) nav.innerHTML = getNavHTML(activePage);
  // Render footer
  const footer = document.querySelector('.footer');
  if (footer) footer.innerHTML = getFooterHTML();
  // Init features
  initHamburger();
  initCursor();
  initReveal();
  updatePageText();
  // Mark active nav
  setActiveNav(activePage);
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('data-t') === `nav.${page}`) a.classList.add('active');
  });
}

// Accordion helper
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all in same group
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// Tab helper
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// Slider helper
function initSlider(trackSelector, prevBtn, nextBtn, itemWidth) {
  const track = document.querySelector(trackSelector);
  if (!track) return;
  let pos = 0;
  const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
  document.querySelector(prevBtn)?.addEventListener('click', () => {
    pos = Math.max(0, pos - itemWidth);
    track.style.transform = `translateX(-${pos}px)`;
  });
  document.querySelector(nextBtn)?.addEventListener('click', () => {
    pos = Math.min(maxScroll, pos + itemWidth);
    track.style.transform = `translateX(-${pos}px)`;
  });
}

// Lightbox
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('img');
  const items = document.querySelectorAll('.masonry-item');
  let current = 0;
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      current = i;
      img.src = item.querySelector('img').src;
      lb.classList.add('open');
    });
  });
  lb.querySelector('.lightbox-close')?.addEventListener('click', () => lb.classList.remove('open'));
  lb.querySelector('.lightbox-prev')?.addEventListener('click', () => {
    current = (current - 1 + items.length) % items.length;
    img.src = items[current].querySelector('img').src;
  });
  lb.querySelector('.lightbox-next')?.addEventListener('click', () => {
    current = (current + 1) % items.length;
    img.src = items[current].querySelector('img').src;
  });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Page-specific init is handled by each page
});
