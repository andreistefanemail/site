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
