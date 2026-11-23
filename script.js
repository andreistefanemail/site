// ========== Stack Studio — site script ==========

// Texts used by the script, per language (the page's <html lang="..."> decides)
const TEXT = {
  ro: {
    sending: "Se trimite…",
    success: "Mulțumim! Îți răspundem în cel mult 24 de ore.",
    error: "A apărut o problemă la trimitere. Te rugăm să încerci din nou peste câteva minute.",
  },
  en: {
    sending: "Sending…",
    success: "Thanks! We'll get back to you within 24 hours.",
    error: "Something went wrong while sending. Please try again in a few minutes.",
  },
};
const t = TEXT[document.documentElement.lang] || TEXT.ro;

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Nav border on scroll
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Portfolio filters
const filters = document.querySelectorAll(".filter");
const items = document.querySelectorAll(".work__item");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    items.forEach((it) => {
      const show = f === "all" || it.dataset.cat === f;
      it.classList.toggle("is-hidden", !show);
      if (show) it.classList.add("is-visible");
    });
  })
);

// Contact form: sends through Formspree without leaving the page
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  status.textContent = t.sending;
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error();
    form.reset();
    status.textContent = t.success;
  } catch {
    status.textContent = t.error;
  }
});

// ========== Hero "site builder" animation ==========
(function () {
  var root = document.querySelector('.sbh');
  if (!root) return;

  var SPEED = 1; // 0.5 = slower, 2 = faster
  var lang = document.documentElement.lang === 'en' ? 'en' : 'ro';

  // Colors come from the Stack Studio palette (mist, sea, stone, slate, purple, lavender)
  var LOOKS = [
    { bg: '#F3EEFB', ink: '#2A2140', soft: '#5B4D75', accent: '#7A6593', accentInk: '#FFFFFF', card: '#E6DDF4',
      font: "'Fraunces', Georgia, serif", panel: '#D6CAEB',
      shapes: [{ l: 66, t: 12, w: 16, h: 20, r: '50%', c: '#B8A7D9' }, { l: 12, t: 34, w: 76, h: 48, r: '50%', c: '#7A6593' }, { l: 30, t: 52, w: 40, h: 6, r: '99px', c: '#F3EEFB' }] },
    { bg: '#EEF7F9', ink: '#16303A', soft: '#3F5F6E', accent: '#4D7A86', accentInk: '#FFFFFF', card: '#DCEDF0',
      font: "'Plus Jakarta Sans', sans-serif", panel: '#B5D8DE',
      shapes: [{ l: 18, t: 16, w: 60, h: 66, r: '22px', c: '#FFFFFF' }, { l: 34, t: 32, w: 28, h: 34, r: '50%', c: '#6B929C' }, { l: 64, t: 62, w: 22, h: 26, r: '50%', c: '#93B9C1' }] },
    { bg: '#F1F4F5', ink: '#16252C', soft: '#3F5F6E', accent: '#3F5F6E', accentInk: '#FFFFFF', card: '#E2EAEC',
      font: "'Syne', sans-serif", panel: '#C9D8DC',
      shapes: [{ l: 14, t: 34, w: 26, h: 54, r: '0', c: '#16252C' }, { l: 44, t: 14, w: 22, h: 74, r: '0', c: '#3F5F6E' }, { l: 70, t: 46, w: 16, h: 42, r: '0', c: '#93B9C1' }] }
  ];

  var CONTENT = {
    en: [
      { name: 'Hearth & Crumb', kind: 'Neighborhood bakery', url: 'hearthandcrumb.com',
        nav: ['Menu', 'Order', 'Visit'], navCta: 'Order ahead',
        h1: 'Bread baked before sunrise.', sub: 'Sourdough, pastries and coffee on Elm Street, every morning from 7.',
        cta: "See today's menu", cards: [{ t: 'Daily loaves', d: 'Fresh at 7am' }, { t: 'Custom cakes', d: 'Order 48h ahead' }, { t: 'Catering', d: 'Office mornings' }] },
      { name: 'Brightside Dental', kind: 'Family dental clinic', url: 'brightsidedental.com',
        nav: ['Services', 'Team', 'Insurance'], navCta: 'Book a visit',
        h1: 'Calm, careful dentistry for the whole family.', sub: 'Checkups, cleanings and same-week appointments, with evening hours on Thursdays.',
        cta: 'Book online', cards: [{ t: 'Checkups', d: 'Every six months' }, { t: 'Whitening', d: 'In one visit' }, { t: 'Emergencies', d: 'Same-day slots' }] },
      { name: 'Kessler Studio', kind: 'Architecture practice', url: 'kessler.studio',
        nav: ['Projects', 'Practice', 'Contact'], navCta: 'Start a project',
        h1: 'Buildings that fit their street.', sub: 'Residential and civic architecture, from first sketch to final inspection.',
        cta: 'View projects', cards: [{ t: 'Residential', d: 'Homes & extensions' }, { t: 'Civic', d: 'Libraries, schools' }, { t: 'Interiors', d: 'Fit-outs & refits' }] }
    ],
    ro: [
      { name: 'Brutăria Zori', kind: 'Brutărie de cartier', url: 'brutariazori.ro',
        nav: ['Meniu', 'Comenzi', 'Vizită'], navCta: 'Comandă acum',
        h1: 'Pâine coaptă înainte de răsărit.', sub: 'Pâine cu maia, patiserie și cafea, în fiecare dimineață de la 7.',
        cta: 'Vezi meniul de azi', cards: [{ t: 'Pâine zilnică', d: 'Proaspătă la 7' }, { t: 'Torturi', d: 'Comandă cu 48h înainte' }, { t: 'Catering', d: 'Pentru birouri' }] },
      { name: 'Zâmbet Dental', kind: 'Clinică stomatologică', url: 'zambetdental.ro',
        nav: ['Servicii', 'Echipa', 'Prețuri'], navCta: 'Programează-te',
        h1: 'Stomatologie atentă pentru toată familia.', sub: 'Controale, igienizări și programări în aceeași săptămână, cu program prelungit joia.',
        cta: 'Programare online', cards: [{ t: 'Controale', d: 'La fiecare 6 luni' }, { t: 'Albire', d: 'Într-o singură vizită' }, { t: 'Urgențe', d: 'În aceeași zi' }] },
      { name: 'Studio Kessler', kind: 'Birou de arhitectură', url: 'kessler.studio',
        nav: ['Proiecte', 'Studio', 'Contact'], navCta: 'Începe un proiect',
        h1: 'Clădiri potrivite străzii lor.', sub: 'Arhitectură rezidențială și publică, de la prima schiță la recepție.',
        cta: 'Vezi proiectele', cards: [{ t: 'Rezidențial', d: 'Case și extinderi' }, { t: 'Public', d: 'Biblioteci, școli' }, { t: 'Interioare', d: 'Amenajări' }] }
    ]
  };

  var BRANDS = CONTENT[lang].map(function (c, k) {
    var o = {}, a;
    for (a in LOOKS[k]) o[a] = LOOKS[k][a];
    for (a in c) o[a] = c[a];
    return o;
  });

  // Timeline (in "ticks", ~60ms each at speed 1)
  var BRAND = 68, IMG = 80, LIVE = 94, OUT = 124, END = 132;
  var SKEL = '#DFE7E9', NONE = 'transparent', INTER = "'Inter', sans-serif";
  var PLAIN = { ink: '#16252C', soft: '#50636B' };
  var CURSORS = [[30, 38], [22, 30], [74, 10], [22, 50]];

  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var texts = $$('[data-k]'), steps = $$('.sbh-step'), cards = $$('[data-card]'), shapes = $$('.sbh-shape');
  var urlEl = $('[data-url]'), caret = $('[data-caret]'), live = $('[data-live]'), page = $('[data-page]'),
      panel = $('[data-panel]'), cursor = $('[data-cursor]'), progress = $('[data-progress]'),
      kindEl = $('[data-kind]'), numEl = $('[data-num]'), ctaEl = $('[data-cta]');

  function get(obj, path) { return path.split('.').reduce(function (o, p) { return o[p]; }, obj); }
  function set(el, prop, val) { if (el.style[prop] !== val) el.style[prop] = val; }

  var i = 0, t = 0, b;

  function loadBrand() {
    b = BRANDS[i];
    texts.forEach(function (el) { el.textContent = get(b, el.dataset.k); });
    shapes.forEach(function (el, k) {
      var s = b.shapes[k];
      el.style.left = s.l + '%'; el.style.top = s.t + '%';
      el.style.width = s.w + '%'; el.style.height = s.h + '%';
      el.style.borderRadius = s.r; el.style.backgroundColor = s.c;
      el.style.transitionDelay = (k * 0.14) + 's';
    });
    kindEl.textContent = b.kind;
    numEl.textContent = i + 1;
  }

  function render() {
    var on = function (x) { return t >= x; };
    var brand = on(BRAND);

    texts.forEach(function (el) {
      var w = +el.dataset.w, x = +el.dataset.x;
      if (el.hasAttribute('data-btn')) {
        set(el, 'color', on(x) ? (brand ? b.accentInk : '#FFFFFF') : NONE);
        set(el, 'backgroundColor', on(w) ? (on(x) ? (brand ? b.accent : '#3F5F6E') : SKEL) : NONE);
      } else {
        var r = el.dataset.r;
        set(el, 'color', on(x) ? (brand ? b[r] : PLAIN[r]) : NONE);
        set(el, 'backgroundColor', on(w) && !on(x) ? SKEL : NONE);
      }
      if (el.hasAttribute('data-head')) set(el, 'fontFamily', brand ? b.font : INTER);
    });

    cards.forEach(function (el) {
      var w = +el.dataset.card;
      set(el, 'borderColor', on(w) && !brand ? '#DFE7E9' : NONE);
      set(el, 'backgroundColor', brand ? b.card : NONE);
      set(el.firstElementChild, 'backgroundColor', on(w) ? (brand ? b.accent : SKEL) : NONE);
    });

    shapes.forEach(function (el) {
      set(el, 'opacity', on(IMG) ? '1' : '0');
      set(el, 'transform', on(IMG) ? 'translateY(0) scale(1)' : 'translateY(12%) scale(0.85)');
    });

    var chars = Math.max(0, Math.min(b.url.length, Math.floor((t - 4) / 1.1)));
    if (urlEl.textContent.length !== chars) urlEl.textContent = b.url.slice(0, chars);
    set(caret, 'display', chars < b.url.length ? 'inline-block' : 'none');
    set(live, 'opacity', on(LIVE) ? '1' : '0');
    ctaEl.classList.toggle('sbh-pulse', on(LIVE));

    set(page, 'backgroundColor', brand ? b.bg : '#FFFFFF');
    set(page, 'opacity', on(OUT) ? '0' : '1');
    set(panel, 'backgroundColor', on(31) ? (on(IMG) ? b.panel : SKEL) : NONE);

    var stage = t < 46 ? 0 : t < BRAND ? 1 : t < LIVE ? 2 : 3;
    steps.forEach(function (el, k) {
      el.classList.toggle('active', k === stage);
      el.classList.toggle('done', k < stage);
    });
    set(cursor, 'left', CURSORS[stage][0] + '%');
    set(cursor, 'top', CURSORS[stage][1] + '%');
    set(progress, 'width', Math.min(100, t / OUT * 100) + '%');
  }

  loadBrand();

  // First frame without transitions, so nothing flashes on page load
  root.classList.add('sbh-init');
  render();
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('sbh-init'); }); });

  // Reduced motion: show one finished site, no animation
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    t = LIVE + 1; render(); return;
  }

  var visible = true, last = null;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; last = null; }).observe(root);
  }

  function frame(now) {
    if (visible && !document.hidden) {
      if (last !== null) t += (now - last) / 60 * SPEED;
      last = now;
      if (t >= END) { t = 0; i = (i + 1) % BRANDS.length; loadBrand(); }
      render();
    } else { last = null; }
    requestAnimationFrame(frame);
  }
  render();
  requestAnimationFrame(frame);
})();
