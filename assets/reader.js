"use strict";
document.documentElement.classList.add("js");
const sourceMode = document.getElementById("source-mode");
function revealProof(hash, align) {
  const target = document.getElementById(hash.slice(1));
  if (!target?.closest(".chapter")) return;
  let opened = false;
  for (let panel = target.closest("details"); panel; panel = panel.parentElement?.closest("details")) {
    if (!panel.open) {
      panel.open = true;
      opened = true;
    }
  }
  if (align && opened) target.scrollIntoView();
}
if (document.querySelector(".chapter")) {
  revealProof(location.hash, true);
  window.addEventListener("hashchange", () => revealProof(location.hash, true));
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey)
      revealProof(link.hash, false);
  });
}
if (sourceMode) {
  document.documentElement.classList.add("compact-citations");
  sourceMode.hidden = false;
  sourceMode.addEventListener("click", () => {
    const compact = document.documentElement.classList.toggle("compact-citations");
    sourceMode.setAttribute("aria-pressed", String(!compact));
    sourceMode.textContent = compact ? "Show source titles" : "Hide source titles";
  });
}
const filter = document.querySelector("[data-filter]");
if (filter) {
  const items = [...document.querySelectorAll("[data-search]")],
    count = document.querySelector("[data-count]");
  filter.closest(".filters").hidden = false;
  const update = (linkedItem = null) => {
    const needle = filter.value.toLowerCase().trim();
    let n = 0;
    let extra = false;
    for (const item of items) {
      const matches = !needle || item.textContent.toLowerCase().includes(needle);
      item.hidden = !matches && item !== linkedItem;
      if (matches) n++;
      else if (item === linkedItem) extra = true;
    }
    count.textContent = n + " " + (n === 1 ? "entry" : "entries");
    if (extra) count.textContent += " + 1 linked entry";
  };
  const itemAt = hash => document.getElementById(hash.slice(1))?.closest("[data-search]");
  filter.addEventListener("input", () => update());
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      const target = itemAt(link.hash);
      if (target?.hidden) update(target);
    }
  });
  window.addEventListener("hashchange", () => {
    const target = itemAt(location.hash);
    const needsScroll = target?.hidden;
    update(target);
    if (needsScroll) target.scrollIntoView();
  });
  update();
}
const labs = [...document.querySelectorAll("[data-lab]")];
if (labs.length) {
  let loading;
  function library() {
    if (!loading)
      loading = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "assets/labs.js";
        s.onload = () => resolve(globalThis.BookLabs);
        s.onerror = reject;
        document.head.append(s);
      });
    return loading;
  }
  const params = new URLSearchParams(location.search);
  async function activate(el) {
    if (el.dataset.active) return;
    el.dataset.active = "1";
    let api;
    try {
      api = await library();
    } catch {
      return;
    }
    const id = el.dataset.lab,
      spec = api.configs[id],
      state = api.defaults(id),
      result = el.querySelector("[data-result]");
    const controls = [...el.querySelectorAll("input, select")];
    function draw() {
      const old = result.querySelector("details")?.open;
      result.innerHTML = api.render(id, state);
      if (old && result.querySelector("details"))
        result.querySelector("details").open = true;
      for (const field of controls) {
        const p = field.name;
        field.value = state[p];
        const out = el.querySelector('[data-value="' + p + '"]');
        if (out) out.textContent = state[p];
      }
      const share = new URL("book.html", location.href);
      const qs = new URLSearchParams();
      for (const p of spec.params)
        if (state[p.key] !== p.value) qs.set(id + "." + p.key, state[p.key]);
      share.search = qs.toString();
      share.hash = "fig-" + id;
      el.querySelector("[data-share]").href = share.href;
    }
    for (const p of spec.params) {
      const k = id + "." + p.key;
      if (params.has(k)) state[p.key] = api.normal(p, params.get(k));
    }
    for (const field of controls) {
      field.addEventListener("input", () => {
        const p = spec.params.find((p) => p.key === field.name);
        state[p.key] = api.normal(p, field.value);
        draw();
      });
    }
    el.querySelector(".reset").addEventListener("click", () => {
      Object.assign(state, api.defaults(id));
      draw();
    });
    draw();
    el.classList.add("ready");
  }
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            obs.unobserve(e.target);
            activate(e.target);
          }
      },
      { rootMargin: "320px" },
    );
    labs.forEach((el) => obs.observe(el));
  } else labs.forEach(activate);
}
