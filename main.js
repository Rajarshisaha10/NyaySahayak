/**
 * NyaySahayak — Full-Bleed Video Background Scrolling Landing Page JS
 * 
 * Features:
 * 1. IntersectionObserver-triggered easeOutCubic Count-up Stats
 * 2. Active Nav Link Highlighting on Scroll
 * 3. Mobile Menu Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  initStatsCountUp();
  initMobileMenu();
  initScrollNavObserver();
});

/**
 * Animated Stat Counter using easeOutCubic
 */
function initStatsCountUp() {
  const statsContainer = document.querySelector(".stats-footer");
  if (!statsContainer) return;

  const statItems = [
    { elId: "stat-val-1", target: 120, suffix: "ms", decimals: 0 },
    { elId: "stat-val-2", target: 99.9, suffix: "%", decimals: 1 },
    { elId: "stat-val-3", target: 6, suffix: "+", decimals: 0 },
    { elId: "stat-val-4", target: 50, suffix: "K+", decimals: 0 }
  ];

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statItems.forEach((item, index) => {
            animateSingleStat(item, index);
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(statsContainer);
}

function animateSingleStat(item, index) {
  const el = document.getElementById(item.elId);
  if (!el) return;

  const duration = 1500 + index * 80;
  const startOffset = 480 + index * 90;
  const startTime = performance.now() + startOffset;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(now) {
    if (now < startTime) {
      requestAnimationFrame(update);
      return;
    }

    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const currentValue = item.target * eased;

    if (item.decimals > 0) {
      el.textContent = currentValue.toFixed(item.decimals) + item.suffix;
    } else {
      el.textContent = Math.round(currentValue).toLocaleString() + item.suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (item.decimals > 0) {
        el.textContent = item.target.toFixed(item.decimals) + item.suffix;
      } else {
        el.textContent = Math.round(item.target).toLocaleString() + item.suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

/**
 * Active Nav Link Highlighting on Scroll
 */
function initScrollNavObserver() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/**
 * Mobile Menu Controller
 */
function initMobileMenu() {
  const burgerBtn = document.getElementById("burger-btn");
  const overlay = document.getElementById("mobile-overlay");
  if (!burgerBtn || !overlay) return;

  function openMenu() {
    burgerBtn.setAttribute("aria-expanded", "true");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    burgerBtn.setAttribute("aria-expanded", "false");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  burgerBtn.addEventListener("click", () => {
    const isOpen = burgerBtn.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burgerBtn.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-sign-in-btn");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && burgerBtn.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
}
