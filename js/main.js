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

/* ---------- Contact form ----------
   Posts to Web3Forms, which forwards the message to the inbox. If the
   access key is blank, or the request fails, we drop back to a prefilled
   mailto link so a visitor is never left with a dead button. */

const CONTACT_EMAIL = "micah.kim.hj@gmail.com";
const CONTACT_ENDPOINT = "https://api.web3forms.com/submit";
const CONTACT_TIMEOUT_MS = 15000;

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const statusEl = document.getElementById("contactStatus");
  const submitEl = document.getElementById("contactSubmit");
  const noteLeadEl = document.getElementById("contactNoteLead");
  const submitLabel = submitEl ? submitEl.textContent : "";

  /* form.name is the form's own attribute, not the field, so always go
     through elements */
  const fieldValue = (name) => {
    const el = contactForm.elements.namedItem(name);
    return el && typeof el.value === "string" ? el.value.trim() : "";
  };

  const accessKey = fieldValue("access_key");

  if (!accessKey && noteLeadEl) {
    noteLeadEl.textContent =
      "This opens your email app with the details filled in.";
  }

  const setStatus = (state, text) => {
    if (!statusEl) return;
    statusEl.className = state ? `form-status is-${state}` : "form-status";
    statusEl.textContent = text || "";
  };

  const setBusy = (busy) => {
    if (!submitEl) return;
    submitEl.disabled = busy;
    submitEl.textContent = busy ? "Sending..." : submitLabel;
  };

  const mailtoLink = () => {
    const name = fieldValue("name");
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${fieldValue("email")}`,
      fieldValue("business") ? `Sells: ${fieldValue("business")}` : null,
      "",
      fieldValue("message"),
    ].filter((line) => line !== null);

    const subject = `Website inquiry from ${name || "your site"}`;

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!accessKey) {
      window.location.href = mailtoLink();
      return;
    }

    const payload = new FormData(contactForm);
    payload.set("subject", `Website inquiry from ${fieldValue("name") || "your site"}`);

    setBusy(true);
    setStatus("pending", "Sending...");

    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      CONTACT_TIMEOUT_MS
    );

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: payload,
        signal: controller.signal,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Send failed");
      }

      contactForm.reset();
      setStatus(
        "success",
        "Thanks, that's in. I'll reply to your email within a day."
      );
    } catch (error) {
      setStatus(
        "error",
        `That didn't send. Opening your email app instead - or write to ${CONTACT_EMAIL} directly.`
      );
      window.location.href = mailtoLink();
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
    }
  });
}
