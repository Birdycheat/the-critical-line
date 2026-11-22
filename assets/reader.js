"use strict";
document.documentElement.classList.add("js");

const AUDIT_STORAGE_KEY = "criticalLine.formalAudit";
function readAuditPref() {
  try {
    return localStorage.getItem(AUDIT_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
function writeAuditPref(enabled) {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // Ignore storage restrictions in private or file:// contexts.
  }
}

const correspondencePanels = [...document.querySelectorAll("details.correspondence")];
const auditButtons = [...document.querySelectorAll("[data-correspondence-toggle]")];
function applyAuditMode(enabled, togglePanels = true) {
  if (togglePanels) {
    for (const panel of correspondencePanels) {
      panel.open = enabled;
      delete panel.dataset.autoOpened;
    }
  }
  for (const btn of auditButtons) {
    btn.hidden = false;
    btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    const isFr = document.documentElement.lang === "fr" || btn.dataset.lang === "fr";
    btn.textContent = enabled
      ? (isFr ? "Mode audit formel : ACTIF (replier les correspondances)" : "Formal audit mode: ON (hide correspondences)")
      : (isFr ? "Mode audit formel : afficher toutes les correspondances" : "Formal audit mode: show all correspondences");
  }
}
if (auditButtons.length) {
  const initialAudit = readAuditPref();
  applyAuditMode(initialAudit, initialAudit);
  for (const btn of auditButtons) {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("aria-pressed") !== "true";
      writeAuditPref(next);
      applyAuditMode(next, true);
    });
  }
}

function revealProof(hash, align) {
  if (!hash || hash.length < 2) return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  let opened = false;
  for (let panel = target.closest("details"); panel; panel = panel.parentElement?.closest("details")) {
    if (!panel.open) {
      panel.open = true;
      opened = true;
    }
  }
  if (align && opened) target.scrollIntoView();
}
if (document.querySelector("details")) {
  revealProof(location.hash, true);
  window.addEventListener("hashchange", () => revealProof(location.hash, true));
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey)
      revealProof(link.hash, false);
  });
}

const filter = document.querySelector("[data-filter]");
if (filter) {
  const items = [...document.querySelectorAll("[data-search]")],
    count = document.querySelector("[data-count]"),
    roleSelect = document.querySelector("[data-role-filter]"),
    statusSelect = document.querySelector("[data-status-filter]"),
    areaSelect = document.querySelector("[data-area-filter]");
  filter.closest(".filters").hidden = false;

  const urlParams = new URLSearchParams(location.search);
  if (urlParams.has("q")) filter.value = urlParams.get("q");
  if (roleSelect && urlParams.has("role")) {
    const v = urlParams.get("role");
    if ([...roleSelect.options].some(o => o.value === v)) roleSelect.value = v;
  }
  if (statusSelect && urlParams.has("status")) {
    const v = urlParams.get("status");
    if ([...statusSelect.options].some(o => o.value === v)) statusSelect.value = v;
  }
  if (areaSelect && urlParams.has("area")) {
    const v = urlParams.get("area");
    if ([...areaSelect.options].some(o => o.value === v)) areaSelect.value = v;
  }

  const update = (linkedItem = null) => {
    const needle = filter.value.toLowerCase().trim();
    const roleVal = roleSelect ? roleSelect.value : "";
    const statusVal = statusSelect ? statusSelect.value : "";
    const areaVal = areaSelect ? areaSelect.value : "";
    const auditActive = readAuditPref();
    let n = 0;
    let extra = false;
    for (const item of items) {
      const roleOk = !roleVal || item.dataset.role === roleVal;
      const statusOk = !statusVal || item.dataset.status === statusVal;
      const areaOk = !areaVal || item.dataset.area === areaVal;
      const textOk = !needle || item.textContent.toLowerCase().includes(needle);
      const matches = roleOk && statusOk && areaOk && textOk;
      item.hidden = !matches && item !== linkedItem;
      if (matches) {
        n++;
        const panel = item.querySelector("details.correspondence");
        if (panel && !auditActive) {
          if (needle.length >= 2 && panel.textContent.toLowerCase().includes(needle)) {
            if (!panel.open) {
              panel.open = true;
              panel.dataset.autoOpened = "1";
            }
          } else if (panel.dataset.autoOpened === "1") {
            panel.open = false;
            delete panel.dataset.autoOpened;
          }
        }
      } else if (item === linkedItem) {
        extra = true;
      }
    }
    count.textContent = n + " " + (n === 1 ? "entry" : "entries");
    if (extra) count.textContent += " + 1 linked entry";
  };
  const itemAt = hash => (hash && hash.length > 1 ? document.getElementById(hash.slice(1))?.closest("[data-search]") : null);
  filter.addEventListener("input", () => update());
  if (roleSelect) roleSelect.addEventListener("change", () => update());
  if (statusSelect) statusSelect.addEventListener("change", () => update());
  if (areaSelect) areaSelect.addEventListener("change", () => update());
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
  update(itemAt(location.hash));
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
    const announcement = result.querySelector("[data-announcement]") && document.createElement("span");
    if (announcement) {
      announcement.className = "visually-hidden";
      announcement.setAttribute("role", "status");
      result.after(announcement);
    }
    function draw() {
      const old = result.querySelector("details")?.open;
      result.innerHTML = api.render(id, state);
      if (announcement && el.classList.contains("ready"))
        announcement.textContent = result.querySelector("[data-announcement]").dataset.announcement;
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
