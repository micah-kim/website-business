const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  const closeMobileNav = () => {
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = !mobileNav.hidden;
    mobileNav.hidden = isOpen;
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("click", (event) => {
    if (mobileNav.hidden) return;
    if (mobileNav.contains(event.target) || navToggle.contains(event.target)) return;
    closeMobileNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      closeMobileNav();
      navToggle.focus();
    }
  });
}

/* Work section previews.

   Each concept card frames the real page from /work/ inside an iframe
   rendered at desktop width, then scaled down to fit the card. That
   keeps a thumbnail from ever drifting away from the page it
   advertises. Two jobs here:

   1. hold the scale exact while the card resizes, and
   2. reveal the frame only once it has rendered, so the static mock
      underneath stands in when the frame cannot load (a plain
      file:// open, for one). */

const PREVIEW_PAGE_WIDTH = 1200;

document.querySelectorAll(".preview").forEach((preview) => {
  const frame = preview.querySelector(".preview-frame");
  if (!frame) return;

  const fitToCard = () => {
    const width = preview.clientWidth;
    if (width) {
      preview.style.setProperty("--preview-scale", width / PREVIEW_PAGE_WIDTH);
    }
  };

  const reveal = () => {
    preview.dataset.loaded = "true";
  };

  fitToCard();

  if (window.ResizeObserver) {
    new ResizeObserver(fitToCard).observe(preview);
  } else {
    window.addEventListener("resize", fitToCard);
  }

  frame.addEventListener("load", reveal);

  // The frame can finish before this script runs when it is cached.
  // Reading into it throws on an opaque origin, so failing here just
  // means we wait for the load event instead.
  try {
    if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
      reveal();
    }
  } catch (error) {
    /* leave the fallback showing until the load event fires */
  }
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const business = contactForm.business.value.trim();
    const message = contactForm.message.value.trim();

    const subject = `Website inquiry from ${name || "your site"}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      business ? `Sells: ${business}` : null,
      "",
      message,
    ].filter((line) => line !== null);

    const mailto = `mailto:hello@foundry.example?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
  });
}
