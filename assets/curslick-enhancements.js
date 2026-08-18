(() => {
  const CSS_HREF = "/assets/curslick-enhancements.css";
  const VIEW_KEY = "morningstar-curslick-view-mode";
  const BUILD_DATE = "18 Aug 2026";

  function ensureCss() {
    if (document.querySelector(`link[href="${CSS_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  function makeButton(className, label, ariaLabel) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    return button;
  }

  function compactCopy(text, max = 240) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
  }

  function createCompactIntro(kicker, title, summary) {
    const section = document.createElement("section");
    section.className = "curslick-compact-intro";

    const eyebrow = document.createElement("p");
    eyebrow.className = "curslick-compact-kicker";
    eyebrow.textContent = kicker;

    const heading = document.createElement("h1");
    heading.textContent = title;

    const copy = document.createElement("p");
    copy.className = "curslick-compact-copy";
    copy.textContent = compactCopy(summary);

    section.append(eyebrow, heading, copy);
    return section;
  }

  function renameMethodToMe2() {
    document.querySelectorAll("button").forEach((button) => {
      if (button.textContent.trim() !== "Method") return;
      button.textContent = "ME2";
      button.title = "Methods and Everything Else";
      button.setAttribute("aria-label", "Methods and Everything Else (ME2)");
    });

    const methodPage = document.querySelector("main.method-view");
    if (!methodPage || methodPage.dataset.me2Labelled === "true") return;
    methodPage.dataset.me2Labelled = "true";
    const hero = methodPage.querySelector(".method-hero");
    if (!hero) return;

    const label = document.createElement("div");
    label.className = "me2-page-label";
    label.innerHTML = "<b>ME2</b><span>Methods and Everything Else</span>";
    methodPage.insertBefore(label, hero);
  }

  function enhanceHub(main) {
    if (!main) return;

    if (main.dataset.curslickHubEnhanced !== "true") {
      main.dataset.curslickHubEnhanced = "true";
      main.classList.add("curslick-hub-overview-collapsed");

      const hero = main.querySelector(":scope > .clk-hub-hero");
      const principles = main.querySelector(":scope > .clk-principles");
      const heading = main.querySelector(":scope > .clk-library-heading");

      const title = hero?.querySelector("h1")?.textContent?.trim() || "Curslick";
      const summary = hero?.querySelector("div > p:last-child")?.textContent?.trim() ||
        "Editorial discovery lists, ranked for closeness, quality and the exact feeling you want next.";

      const compact = createCompactIntro("CURSLICK · EDITORIAL LISTS", title, summary);
      const overviewToggle = makeButton(
        "curslick-collapse-toggle curslick-overview-toggle",
        "Show Curslick intro & method ▾",
        "Show Curslick introduction and method",
      );
      overviewToggle.setAttribute("aria-expanded", "false");
      overviewToggle.addEventListener("click", () => {
        const collapsed = main.classList.toggle("curslick-hub-overview-collapsed");
        overviewToggle.textContent = collapsed
          ? "Show Curslick intro & method ▾"
          : "Hide Curslick intro & method ▴";
        overviewToggle.setAttribute("aria-expanded", String(!collapsed));
      });

      if (hero) {
        main.insertBefore(compact, hero);
        main.insertBefore(overviewToggle, hero);
      } else {
        main.prepend(overviewToggle);
        main.prepend(compact);
      }

      if (heading && !main.querySelector(".curslick-collections-toggle")) {
        const listToggle = makeButton(
          "curslick-collapse-toggle curslick-collections-toggle",
          "Curslick lists · expanded ▴",
          "Collapse or expand the Curslick collection lists",
        );
        listToggle.setAttribute("aria-expanded", "true");
        listToggle.addEventListener("click", () => {
          const collapsed = main.classList.toggle("curslick-hub-lists-collapsed");
          listToggle.textContent = collapsed
            ? "Curslick lists · collapsed ▾"
            : "Curslick lists · expanded ▴";
          listToggle.setAttribute("aria-expanded", String(!collapsed));
        });
        heading.parentNode.insertBefore(listToggle, heading);
      }

      if (principles) principles.setAttribute("data-curslick-overview", "true");
      if (hero) hero.setAttribute("data-curslick-overview", "true");
    }
  }

  function createProvenanceRule() {
    const panel = document.createElement("section");
    panel.className = "curslick-provenance-rule";
    panel.setAttribute("data-curslick-overview", "true");
    panel.innerHTML = `
      <p>FUTURE CURSLICK RULE · ${BUILD_DATE}</p>
      <h2>Every Curslick must record how it was made.</h2>
      <span>Required metadata: creation/update date, AI provider, exact AI model, methodology, methodology date, source/research basis, inclusion/exclusion rules, ranking logic and verification steps. If provenance is unknown, say “not recorded” — never guess it.</span>
    `;
    return panel;
  }

  function applyViewMode(main, mode) {
    const list = main.querySelector(".curslick-story-list");
    if (!list) return;
    const safeMode = ["current", "list", "short"].includes(mode) ? mode : "current";
    list.classList.remove("curslick-mode-current", "curslick-mode-list", "curslick-mode-short");
    list.classList.add(`curslick-mode-${safeMode}`);

    const controls = main.querySelector(".curslick-view-modes");
    controls?.querySelectorAll("button[data-mode]").forEach((button) => {
      const active = button.dataset.mode === safeMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function ensureViewControls(main) {
    const storyList = main.querySelector(".curslick-story-list");
    if (!storyList) return;

    let controls = main.querySelector(".curslick-view-modes");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "curslick-view-modes";
      controls.innerHTML = `
        <span><b>Display</b><small>Current view stays the default.</small></span>
        <div>
          <button type="button" data-mode="current">Current</button>
          <button type="button" data-mode="list">List</button>
          <button type="button" data-mode="short">Short list</button>
        </div>
      `;
      controls.querySelectorAll("button[data-mode]").forEach((button) => {
        button.addEventListener("click", () => {
          const mode = button.dataset.mode || "current";
          try { localStorage.setItem(VIEW_KEY, mode); } catch (_) {}
          applyViewMode(main, mode);
        });
      });
      storyList.parentNode.insertBefore(controls, storyList);
    }

    let mode = "current";
    try { mode = localStorage.getItem(VIEW_KEY) || "current"; } catch (_) {}
    applyViewMode(main, mode);
  }

  function enhanceCollection(main) {
    if (!main) return;

    if (main.dataset.curslickCollectionEnhanced !== "true") {
      main.dataset.curslickCollectionEnhanced = "true";
      main.classList.add("curslick-detail-overview-collapsed");

      const back = main.querySelector(":scope > .clk-back");
      const hero = main.querySelector(":scope > .curslick-hero");
      const title = hero?.querySelector("h1")?.textContent?.trim() || "Curslick collection";
      const summary = hero?.querySelector(".curslick-hero-copy > p:last-child")?.textContent?.trim() || "Ranked series selected for this exact Curslick route.";
      const kicker = hero?.querySelector(".eyebrow")?.textContent?.trim() || "CURSLICK · EDITORIAL DISCOVERY";

      const compact = createCompactIntro(kicker, title, summary);
      const toggle = makeButton(
        "curslick-collapse-toggle curslick-detail-toggle",
        "Show collection intro, method & provenance ▾",
        "Show the full Curslick collection introduction and methodology",
      );
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", () => {
        const collapsed = main.classList.toggle("curslick-detail-overview-collapsed");
        toggle.textContent = collapsed
          ? "Show collection intro, method & provenance ▾"
          : "Hide collection intro, method & provenance ▴";
        toggle.setAttribute("aria-expanded", String(!collapsed));
      });

      if (back?.nextSibling) {
        main.insertBefore(compact, back.nextSibling);
        main.insertBefore(toggle, compact.nextSibling);
      } else {
        main.prepend(toggle);
        main.prepend(compact);
      }

      const provenance = createProvenanceRule();
      const heroNode = main.querySelector(":scope > .curslick-hero");
      if (heroNode) main.insertBefore(provenance, heroNode);
      else main.appendChild(provenance);

      [
        ".curslick-hero",
        ".curslick-library",
        ".curslick-editorial-grid",
        ".curslick-research-strip",
      ].forEach((selector) => {
        main.querySelectorAll(selector).forEach((node) => node.setAttribute("data-curslick-overview", "true"));
      });
    }

    ensureViewControls(main);
  }

  function scan() {
    ensureCss();
    renameMethodToMe2();
    document.querySelectorAll("main.clk-hub").forEach(enhanceHub);
    document.querySelectorAll("main.curslick-view").forEach(enhanceCollection);
  }

  let queued = false;
  function queueScan() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan, { once: true });
  } else {
    scan();
  }

  new MutationObserver(queueScan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
