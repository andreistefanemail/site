// ========== Stack Studio — site script ==========

// Texts used by the script, per language (the page's <html lang="..."> decides)
const TEXT = {
  ro: {
    sending: "Se trimite…",
    success: "Mulțumim! Îți răspundem în cel mult 24 de ore.",
    error: "A apărut o problemă la trimitere. Te rugăm să încerci din nou peste câteva minute.",
    menuOpen: "Deschide meniul",
    menuClose: "Închide meniul",
  },
  en: {
    sending: "Sending…",
    success: "Thanks! We'll get back to you within 24 hours.",
    error: "Something went wrong while sending. Please try again in a few minutes.",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
};
const t = TEXT[document.documentElement.lang] || TEXT.ro;

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
function setMenu(open) {
  links.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? t.menuClose : t.menuOpen);
}
toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && links.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
});

// ---------- Header border once the page scrolls ----------
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Reveal on scroll (CSS skips the effect for reduced motion) ----------
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ---------- Portfolio filters (state kept in ?filter=…) ----------
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
  if (updateUrl && window.history && history.replaceState) {
    const url = new URL(location.href);
    if (f === "all") url.searchParams.delete("filter"); else url.searchParams.set("filter", f);
    history.replaceState(null, "", url);
  }
}
filters.forEach((btn) => btn.addEventListener("click", () => applyFilter(btn.dataset.filter, true)));
const startFilter = new URLSearchParams(location.search).get("filter");
if (startFilter && [...filters].some((b) => b.dataset.filter === startFilter)) applyFilter(startFilter, false);

// ---------- Contact form: sends through Formspree without leaving the page ----------
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

// ---------- Falling leaves in the background (with a pause button) ----------
(function () {
  var canvas = document.createElement("canvas");
  if (!canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  canvas.className = "leaves";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var lang = document.documentElement.lang === "en" ? "en" : "ro";
  var LABELS = { ro: ["Oprește frunzele", "Pornește frunzele"], en: ["Pause leaves", "Play leaves"] }[lang];
  var COLORS = ["#1f5c45", "#2e7a5c", "#5e9a7c", "#9dbba9", "#3f6b52", "#f07158", "#e88b5c"];
  var COUNT_DESKTOP = 26, COUNT_MOBILE = 14;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var paused = false;
  try { paused = localStorage.getItem("ss-leaves") === "paused"; } catch (e) {}

  function rand(a, b) { return a + Math.random() * (b - a); }
  var w = 0, h = 0, dpr = 1, leaves = [];

  function makeLeaf(anywhere) {
    var size = rand(14, 34);
    return {
      x: rand(-40, w + 40),
      y: anywhere ? rand(-h * 0.1, h) : rand(-120, -30),
      size: size,
      fall: rand(14, 34) * (size / 26),       // px per second, bigger leaves fall a bit faster
      swayAmp: rand(18, 55),
      swayFreq: rand(0.25, 0.6),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.6, 0.6),
      flipFreq: rand(0.4, 1.1),
      color: COLORS[Math.random() < 0.18 ? 5 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 5)],
      alpha: rand(0.38, 0.7),
      baseX: 0
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = w < 700 ? COUNT_MOBILE : COUNT_DESKTOP;
    while (leaves.length < count) { var l = makeLeaf(true); l.baseX = l.x; leaves.push(l); }
    leaves.length = count;
  }

  // One leaf: pointed oval with a midrib and a short stem
  function drawLeaf(l, t) {
    var s = l.size;
    var flip = Math.cos(t * l.flipFreq + l.phase);     // -1..1, makes the leaf "tumble"
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.scale(0.35 + 0.65 * Math.abs(flip), 1);
    ctx.globalAlpha = l.alpha;
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.moveTo(0, -s / 2);
    ctx.bezierCurveTo(s * 0.42, -s * 0.28, s * 0.42, s * 0.24, 0, s / 2);
    ctx.bezierCurveTo(-s * 0.42, s * 0.24, -s * 0.42, -s * 0.28, 0, -s / 2);
    ctx.fill();
    ctx.globalAlpha = l.alpha * 0.55;
    ctx.strokeStyle = "#f6f4ee";
    ctx.lineWidth = Math.max(0.8, s / 22);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.38);
    ctx.lineTo(0, s * 0.62);
    ctx.stroke();
    ctx.restore();
  }

  var last = null, t = 0;
  function step(now) {
    if (!paused && !document.hidden) {
      var dt = last === null ? 0 : Math.min((now - last) / 1000, 0.05);
      t += dt;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < leaves.length; i++) {
        var l = leaves[i];
        l.y += l.fall * dt;
        l.x = l.baseX + Math.sin(t * l.swayFreq + l.phase) * l.swayAmp;
        l.baseX += 6 * dt;                            // a light breeze to the right
        l.rot += l.spin * dt;
        if (l.y - l.size > h || l.baseX - l.swayAmp > w + 60) {
          var n = makeLeaf(false); n.baseX = n.x; leaves[i] = n;
        }
        drawLeaf(leaves[i], t);
      }
      last = now;
    } else {
      last = null;
    }
    requestAnimationFrame(step);
  }

  function drawStill() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < leaves.length; i++) drawLeaf(leaves[i], 0);
  }

  resize();
  window.addEventListener("resize", function () { resize(); if (reduceMotion || paused) drawStill(); });

  // Visitors who prefer less motion get still leaves and no button
  if (reduceMotion) { drawStill(); return; }

  // Pause / play button
  var LEAF_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 2.5C7 2.5 3 5.5 3 10c0 1.3.4 2.4 1 3.3M13.5 2.5c0 6.5-3 10.5-7.5 10.5-.9 0-1.7-.2-2.5-.7M13.5 2.5L4 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "leaves-toggle";
  function paint() {
    btn.innerHTML = LEAF_ICON;
    btn.setAttribute("aria-label", LABELS[paused ? 1 : 0]);
    btn.title = LABELS[paused ? 1 : 0];
    btn.classList.toggle("is-paused", paused);
  }
  btn.addEventListener("click", function () {
    paused = !paused;
    try { localStorage.setItem("ss-leaves", paused ? "paused" : "playing"); } catch (e) {}
    paint();
  });
  paint();
  document.body.appendChild(btn);

  if (paused) drawStill();
  requestAnimationFrame(step);
})();
