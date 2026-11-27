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
function applyFilter(f, updateUrl) {
  filters.forEach((b) => {
    const on = b.dataset.filter === f;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  items.forEach((it) => {
    const show = f === "all" || it.dataset.cat === f;
    it.classList.toggle("is-hidden", !show);
    if (show) it.classList.add("is-visible");
  });
  // Keep the chosen filter in the address (?filter=…) so it can be shared
  if (updateUrl && window.history && history.replaceState) {
    const url = new URL(location.href);
    if (f === "all") url.searchParams.delete("filter"); else url.searchParams.set("filter", f);
    history.replaceState(null, "", url);
  }
}
filters.forEach((btn) => btn.addEventListener("click", () => applyFilter(btn.dataset.filter, true)));
const startFilter = new URLSearchParams(location.search).get("filter");
if (startFilter && [...filters].some((b) => b.dataset.filter === startFilter)) applyFilter(startFilter, false);

// Contact form: sends through Formspree without leaving the page
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const submitBtn = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitBtn.disabled) return; // already sending: no double submit
  const data = new FormData(form);

  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
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
  } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
  }
});

// Shared "pause animations" switch for the hero animation and the background dots.
// The choice is remembered on this device.
var ssMotionPaused = false;
try { ssMotionPaused = localStorage.getItem("ss-motion") === "paused"; } catch (e) {}

// ========== Hero "site builder" animation ==========
(function () {
  var root = document.querySelector('.sbh');
  if (!root) return;

  var SPEED = 1; // 0.5 = slower, 2 = faster
  var lang = document.documentElement.lang === 'en' ? 'en' : 'ro';

  // Colors come from the Stack Studio petrol, ivory and saffron palette
  var LOOKS = [
    { bg: '#F8F3E6', ink: '#13323D', soft: '#4E6266', accent: '#E8A33D', accentInk: '#0B2F3B', card: '#EFE6CF',
      font: "'Fraunces', Georgia, serif", panel: '#E9D9B5',
      shapes: [{ l: 66, t: 12, w: 16, h: 20, r: '50%', c: '#F2B654' }, { l: 12, t: 34, w: 76, h: 48, r: '50%', c: '#134B5F' }, { l: 30, t: 52, w: 40, h: 6, r: '99px', c: '#F8F3E6' }] },
    { bg: '#EEF4F4', ink: '#0B2F3B', soft: '#3E5A61', accent: '#134B5F', accentInk: '#F8F3E6', card: '#DCE8E9',
      font: "'Plus Jakarta Sans', sans-serif", panel: '#C9D8D9',
      shapes: [{ l: 18, t: 16, w: 60, h: 66, r: '22px', c: '#FFFFFF' }, { l: 34, t: 32, w: 28, h: 34, r: '50%', c: '#134B5F' }, { l: 64, t: 62, w: 22, h: 26, r: '50%', c: '#7FA3AC' }] },
    { bg: '#F3EFE6', ink: '#13323D', soft: '#4E6266', accent: '#0D3A49', accentInk: '#F8F3E6', card: '#E5DFD1',
      font: "'Syne', sans-serif", panel: '#D5CDBB',
      shapes: [{ l: 14, t: 34, w: 26, h: 54, r: '0', c: '#0D3A49' }, { l: 44, t: 14, w: 22, h: 74, r: '0', c: '#134B5F' }, { l: 70, t: 46, w: 16, h: 42, r: '0', c: '#E8A33D' }] }
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
  var SKEL = '#E6E1D3', NONE = 'transparent', INTER = "'Manrope', sans-serif";
  var PLAIN = { ink: '#13323D', soft: '#4E6266' };
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
        set(el, 'backgroundColor', on(w) ? (on(x) ? (brand ? b.accent : '#134B5F') : SKEL) : NONE);
      } else {
        var r = el.dataset.r;
        set(el, 'color', on(x) ? (brand ? b[r] : PLAIN[r]) : NONE);
        set(el, 'backgroundColor', on(w) && !on(x) ? SKEL : NONE);
      }
      if (el.hasAttribute('data-head')) set(el, 'fontFamily', brand ? b.font : INTER);
    });

    cards.forEach(function (el) {
      var w = +el.dataset.card;
      set(el, 'borderColor', on(w) && !brand ? '#E6E1D3' : NONE);
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
    // Move with transform (smooth, no layout work). The page is 100cqw wide and 62cqw tall.
    set(cursor, 'transform', 'translate(' + CURSORS[stage][0] + 'cqw, ' + (CURSORS[stage][1] * 0.62).toFixed(2) + 'cqw)');
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

  // Pause / play button (the animation loops, so visitors must be able to stop it)
  var LABELS = { ro: ['Oprește animațiile', 'Pornește animațiile'], en: ['Pause animations', 'Play animations'] }[lang];
  var PAUSE_ICON = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.5" width="2.6" height="9" rx=".6" fill="currentColor"/><rect x="7.4" y="1.5" width="2.6" height="9" rx=".6" fill="currentColor"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
  var statusBar = root.querySelector('.sbh-status');
  var pauseBtn = document.createElement('button');
  pauseBtn.type = 'button';
  pauseBtn.className = 'sbh-pause';
  function paintPause() {
    pauseBtn.innerHTML = (ssMotionPaused ? PLAY_ICON : PAUSE_ICON) + '<span>' + LABELS[ssMotionPaused ? 1 : 0] + '</span>';
  }
  pauseBtn.addEventListener('click', function () {
    ssMotionPaused = !ssMotionPaused;
    try { localStorage.setItem('ss-motion', ssMotionPaused ? 'paused' : 'playing'); } catch (e) {}
    last = null;
    paintPause();
  });
  paintPause();
  if (statusBar) statusBar.appendChild(pauseBtn);

  function frame(now) {
    if (visible && !document.hidden && !ssMotionPaused) {
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

// ========== Background dots that grow and shrink in random waves ==========
(function () {
  var canvas = document.createElement('canvas');
  if (!canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  canvas.className = 'dot-waves';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  document.documentElement.classList.add('has-dot-waves');

  var GAP = 26;            // distance between dots (px), same as the old grid
  var MIN_R = 0.3;         // smallest dot radius (px)
  var MAX_R = 2.9;         // biggest dot radius (px)
  var COLOR = 'rgba(248, 243, 230, .2)'; // ivory on petrol
  var FPS = 30;

  // A few waves with random direction, size, speed and starting point (new on every load)
  function rand(a, b) { return a + Math.random() * (b - a); }
  var waves = [];
  for (var n = 0; n < 3; n++) {
    var angle = rand(0, Math.PI * 2), length = rand(260, 720);
    waves.push({
      kx: Math.cos(angle) * 2 * Math.PI / length,
      ky: Math.sin(angle) * 2 * Math.PI / length,
      speed: rand(0.25, 0.7) * (Math.random() < 0.5 ? -1 : 1),
      phase: rand(0, Math.PI * 2)
    });
  }
  // One slow ripple spreading out from a random point
  var ripple = { x: rand(0.15, 0.85), y: rand(0.1, 0.6), k: 2 * Math.PI / rand(320, 520), speed: rand(0.4, 0.8) };

  var w = 0, h = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time) {
    var t = time / 1000;
    var rx = ripple.x * w, ry = ripple.y * h;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLOR;
    ctx.beginPath();
    for (var y = 1; y < h + GAP; y += GAP) {
      for (var x = 1; x < w + GAP; x += GAP) {
        var s = 0;
        for (var k = 0; k < waves.length; k++) {
          var v = waves[k];
          s += Math.sin(v.kx * x + v.ky * y + v.speed * t + v.phase);
        }
        var dx = x - rx, dy = y - ry;
        s += Math.sin(Math.sqrt(dx * dx + dy * dy) * ripple.k - ripple.speed * t);
        s = s / (waves.length + 1) * 2.1;         // stretch so crests and troughs stand out
        if (s > 1) s = 1; else if (s < -1) s = -1;
        var e = (s + 1) / 2;                      //  0 … 1
        var r = MIN_R + (MAX_R - MIN_R) * Math.pow(e, 1.6);
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
  }

  resize();
  window.addEventListener('resize', function () { resize(); draw(performance.now()); });

  // Visitors who prefer less motion get one still frame
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw(0);
    return;
  }

  var lastDraw = 0;
  function loop(now) {
    if (!document.hidden && !ssMotionPaused && now - lastDraw >= 1000 / FPS) { draw(now); lastDraw = now; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
