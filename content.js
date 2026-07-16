// Site Notes Overlay
// One note per hostname, stored in chrome.storage.local
// Overlay auto opens on sites where a note exists

(() => {
  const HOST = location.hostname || "local";
  const KEY = "siteNotes:" + HOST;

  let panel = null;
  let textarea = null;
  let saveTimer = null;
  let state = {
    text: "",
    opacity: 0.85,
    x: null,
    y: null,
    w: 300,
    h: 220,
    open: false,
    collapsed: false
  };

  // ---------- storage ----------

  function load() {
    return new Promise((resolve) => {
      chrome.storage.local.get(KEY, (res) => resolve(res[KEY] || null));
    });
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      chrome.storage.local.set({ [KEY]: state });
    }, 300);
  }

  // ---------- UI ----------

  function buildPanel() {
    if (panel) return;

    panel = document.createElement("div");
    panel.id = "site-notes-overlay";
    panel.innerHTML = `
      <div class="sn-header" title="Drag to move">
        <span class="sn-host"></span>
        <div class="sn-controls">
          <input class="sn-opacity" type="range" min="0.15" max="1" step="0.05" title="Transparency">
          <button class="sn-btn sn-collapse" title="Collapse">–</button>
          <button class="sn-btn sn-close" title="Hide (Alt+N to reopen)">×</button>
        </div>
      </div>
      <textarea class="sn-text" placeholder="Notes for this site… saved automatically" spellcheck="false"></textarea>
      <div class="sn-resize" title="Drag to resize"></div>
    `;
    document.documentElement.appendChild(panel);

    panel.querySelector(".sn-host").textContent = HOST;
    textarea = panel.querySelector(".sn-text");
    const opacitySlider = panel.querySelector(".sn-opacity");

    // restore state
    textarea.value = state.text;
    opacitySlider.value = state.opacity;
    applyOpacity();
    applyGeometry();
    if (state.collapsed) panel.classList.add("sn-collapsed");

    // typing
    textarea.addEventListener("input", () => {
      state.text = textarea.value;
      save();
    });

    // opacity
    opacitySlider.addEventListener("input", () => {
      state.opacity = parseFloat(opacitySlider.value);
      applyOpacity();
      save();
    });

    // full opacity while hovering so it is easy to read and edit
    panel.addEventListener("mouseenter", () => {
      panel.style.opacity = "1";
    });
    panel.addEventListener("mouseleave", () => {
      applyOpacity();
    });

    // collapse
    panel.querySelector(".sn-collapse").addEventListener("click", () => {
      state.collapsed = !state.collapsed;
      panel.classList.toggle("sn-collapsed", state.collapsed);
      save();
    });

    // close
    panel.querySelector(".sn-close").addEventListener("click", () => hide());

    // drag
    makeDraggable(panel.querySelector(".sn-header"));

    // resize
    makeResizable(panel.querySelector(".sn-resize"));
  }

  function applyOpacity() {
    if (panel) panel.style.opacity = state.opacity;
  }

  function applyGeometry() {
    if (!panel) return;
    panel.style.width = state.w + "px";
    panel.style.height = state.h + "px";
    if (state.x === null || state.y === null) {
      // default: top right corner
      state.x = window.innerWidth - state.w - 24;
      state.y = 24;
    }
    clampToViewport();
    panel.style.left = state.x + "px";
    panel.style.top = state.y + "px";
  }

  function clampToViewport() {
    state.x = Math.min(Math.max(0, state.x), Math.max(0, window.innerWidth - 60));
    state.y = Math.min(Math.max(0, state.y), Math.max(0, window.innerHeight - 40));
  }

  function makeDraggable(handle) {
    let startX, startY, origX, origY, dragging = false;

    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".sn-btn") || e.target.closest(".sn-opacity")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = state.x;
      origY = state.y;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      state.x = origX + (e.clientX - startX);
      state.y = origY + (e.clientY - startY);
      clampToViewport();
      panel.style.left = state.x + "px";
      panel.style.top = state.y + "px";
    });

    handle.addEventListener("pointerup", () => {
      if (dragging) {
        dragging = false;
        save();
      }
    });
  }

  function makeResizable(grip) {
    let startX, startY, origW, origH, resizing = false;

    grip.addEventListener("pointerdown", (e) => {
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      origW = state.w;
      origH = state.h;
      grip.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    grip.addEventListener("pointermove", (e) => {
      if (!resizing) return;
      state.w = Math.max(220, origW + (e.clientX - startX));
      state.h = Math.max(140, origH + (e.clientY - startY));
      panel.style.width = state.w + "px";
      panel.style.height = state.h + "px";
    });

    grip.addEventListener("pointerup", () => {
      if (resizing) {
        resizing = false;
        save();
      }
    });
  }

  // ---------- show / hide ----------

  function show() {
    buildPanel();
    panel.style.display = "flex";
    state.open = true;
    save();
  }

  function hide() {
    if (panel) panel.style.display = "none";
    state.open = false;
    save();
  }

  function toggle() {
    if (state.open && panel && panel.style.display !== "none") hide();
    else show();
  }

  // ---------- init ----------

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "SITE_NOTES_TOGGLE") toggle();
  });

  load().then((saved) => {
    if (saved) state = { ...state, ...saved };
    // auto open if a note exists for this site, or it was left open
    if ((state.text && state.text.trim()) || state.open) show();
  });
})();
