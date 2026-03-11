// ── THEME TOGGLE ──
const html = document.documentElement;
let isDark = localStorage.getItem('theme') === 'dark';
if (isDark) html.classList.add('dark');
updateThemeIcons();

function toggleTheme() {
  isDark = !isDark;
  html.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcons();
}

function updateThemeIcons() {
  document.querySelectorAll('.dark-hidden').forEach(el => {
    el.style.display = isDark ? 'none' : 'block';
  });
  document.querySelectorAll('.light-hidden').forEach(el => {
    el.style.display = isDark ? 'block' : 'none';
  });
}

// ── MEGA MENU ──
let megaOpen = false;
const megaPanel = document.getElementById('megaPanel');
const megaBtn   = document.getElementById('megaBtn');
const overlay   = document.getElementById('menuOverlay');

function updateMegaPos() {
  const nav = document.getElementById('mainNav');
  const rect = nav.getBoundingClientRect();
  megaPanel.style.top = (rect.bottom) + 'px';
}

function toggleMega() {
  megaOpen = !megaOpen;
  megaPanel.classList.toggle('open', megaOpen);
  megaBtn.classList.toggle('active', megaOpen);
  overlay.classList.toggle('show', megaOpen);
  if (megaOpen) {
    updateMegaPos();
    closeAllDrops();
  }
}

// ── SIMPLE DROPDOWNS ──
let openDropId = null;
function toggleDrop(id) {
  if (megaOpen) { megaOpen = false; megaPanel.classList.remove('open'); megaBtn.classList.remove('active'); }
  const panel = document.getElementById(id);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  closeAllDrops();
  if (!isOpen) {
    panel.classList.add('open');
    overlay.classList.add('show');
    openDropId = id;
  } else {
    overlay.classList.remove('show');
    openDropId = null;
  }
}

function closeAllDrops() {
  document.querySelectorAll('.drop-panel, .apps-panel').forEach(p => p.classList.remove('open'));
  overlay.classList.remove('show');
  openDropId = null;
}

function closeAll() {
  megaOpen = false;
  megaPanel.classList.remove('open');
  megaBtn && megaBtn.classList.remove('active');
  closeAllDrops();
}

// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

// ── MOBILE DRAWER ──
function openMobile() {
  document.getElementById('mobileDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  document.getElementById('mobileDrawer').classList.remove('open');
  document.body.style.overflow = '';
}
function toggleMobAccordion(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
}

// ── SCROLL EVENTS ──
const nav = document.getElementById('mainNav');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 50);
  backToTop.classList.toggle('show', y > 500);
  if (megaOpen) updateMegaPos();
});

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ══════════════════════════════════════
//  HERO SWIPER  — fade + autoplay + progress bar
// ══════════════════════════════════════
const HERO_DELAY = 6000;
const heroProgressBar   = document.getElementById('heroProgress');
const heroCurrentEl     = document.getElementById('heroCurrentSlide');
const heroTotalEl       = document.getElementById('heroTotalSlides');

function resetHeroBar() {
  heroProgressBar.style.transition = 'none';
  heroProgressBar.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    heroProgressBar.style.transition = `width ${HERO_DELAY}ms linear`;
    heroProgressBar.style.width = '100%';
  }));
}

const heroSwiper = new Swiper('#heroSwiper', {
  loop: true,
  speed: 900,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  autoplay: { delay: HERO_DELAY, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
  navigation: {
    prevEl: '.hero-swiper .swiper-button-prev',
    nextEl: '.hero-swiper .swiper-button-next',
  },
  on: {
    init(s)  { heroTotalEl.textContent = s.slides.length - 2; heroCurrentEl.textContent = 1; resetHeroBar(); },
    slideChangeTransitionStart(s) { heroCurrentEl.textContent = s.realIndex + 1; resetHeroBar(); },
  },
});

// ══════════════════════════════════════
//  TESTIMONIALS SWIPER
// ══════════════════════════════════════
const testiSwiper = new Swiper('#testiSwiper', {
  loop: false,
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 24,
  autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: { el: '#testiPagination', clickable: true, dynamicBullets: true },
  navigation: { prevEl: '#testiPrev', nextEl: '#testiNext' },
  breakpoints: {
    600:  { slidesPerView: 1.15, spaceBetween: 20 },
    768:  { slidesPerView: 2,    spaceBetween: 24 },
    1024: { slidesPerView: 2.5,  spaceBetween: 28 },
    1280: { slidesPerView: 3,    spaceBetween: 32 },
  },
  on: {
    slideChange(s) {
      document.getElementById('testiFraction').textContent =
        `${s.realIndex + 1} / ${s.slides.length}`;
    },
  },
});
