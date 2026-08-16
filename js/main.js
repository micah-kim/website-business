const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  const closeMobileNav = () => {
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = !mobileNav.hidden;
    mobileNav.hidden = isOpen;
    navToggle.setAttribute("aria-expanded", String(!isOpen));
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
