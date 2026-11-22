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
