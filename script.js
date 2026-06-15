document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuButton = document.querySelector("[data-menu-button]");
const progress = document.querySelector("[data-scroll-progress]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const revealItems = document.querySelectorAll("[data-reveal], [data-stagger]");
const journeyPanels = document.querySelectorAll(".journey-panel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const setScrollProgress = () => {
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.setProperty("--scroll-progress", value.toFixed(4));
};

const setParallax = () => {
  if (reduceMotion.matches) return;

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = (center - viewportCenter) / window.innerHeight;
    item.style.setProperty("--parallax", Math.max(-1, Math.min(1, distance)).toFixed(3));
  });
};

const revealVisibleItems = () => {
  if (reduceMotion.matches) return;

  revealItems.forEach((item) => {
    if (item.classList.contains("is-visible")) return;

    const rect = item.getBoundingClientRect();
    const entersViewport = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.08;
    if (entersViewport) item.classList.add("is-visible");
  });
};

const tick = () => {
  setHeaderState();
  setScrollProgress();
  setParallax();
  revealVisibleItems();
};

setHeaderState();
setScrollProgress();
setParallax();
revealVisibleItems();
window.addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true });
window.addEventListener("resize", () => requestAnimationFrame(tick));

if (reduceMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.04, rootMargin: "0px 0px -4% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

journeyPanels.forEach((panel) => {
  const activate = () => {
    journeyPanels.forEach((item) => item.classList.toggle("is-active", item === panel));
  };

  panel.addEventListener("pointerenter", activate);
  panel.addEventListener("focus", activate);
});

menuButton?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});
