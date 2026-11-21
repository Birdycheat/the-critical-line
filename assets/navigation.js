"use strict";
const header = document.querySelector(".site-header");
const menu = header.querySelector(".mobile-menu-button");
const panel = header.querySelector(".mobile-navigation-panel");
const heading = header.querySelector(".contents-title");
function showMenu(open, restore = false) {
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "Close" : "Menu";
  panel.hidden = !open;
  heading.hidden = !open;
  header.classList.toggle("is-open", open);
  if (open) panel.querySelector("a").focus();
  else if (restore) menu.focus();
}
menu.hidden = false;
menu.addEventListener("click", () => showMenu(panel.hidden, !panel.hidden));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panel.hidden) showMenu(false, true);
});
document.addEventListener("pointerdown", (e) => {
  if (!panel.hidden && !header.contains(e.target)) showMenu(false);
});
matchMedia("(min-width: 60.01rem)").addEventListener("change", (e) => {
  if (e.matches && !panel.hidden) showMenu(false);
});
const slices = [...document.querySelectorAll("#opening-plot [data-slice]")];
if (slices.length) {
  const button = document.querySelector("#slice-change");
  const label = document.querySelector("#slice-label");
  const selected = [13, 0, 6, 20, 26];
  let step = 0;
  function sliceAt(i) {
    const current = selected[i];
    slices.forEach((s, k) => {
      s.setAttribute("stroke", k === current ? "#9c4121" : "#444b4e");
      s.setAttribute("stroke-width", k === current ? "2.2" : ".78");
    });
    label.textContent =
      "σ = " +
      (current === 13
        ? "½"
        : current === 0
          ? "0"
          : current === 26
            ? "1"
            : current === 6
              ? "3/13"
              : "10/13");
  }
  document.querySelector("#slice-controls").hidden = false;
  label.setAttribute("aria-live", "polite");
  button.addEventListener("click", () => {
    step = (step + 1) % selected.length;
    sliceAt(step);
  });
  document.querySelector("#slice-reset").addEventListener("click", () => {
    step = 0;
    sliceAt(step);
  });
}
