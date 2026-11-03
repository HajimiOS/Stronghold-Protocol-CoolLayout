(() => {
  const PLUGIN_ID = "coollayout";
  const UI_KEY = "sp.pref.ui-plugins";
  const SEED_KEY = "sp.pref.hajimi-ui-seeded";
  const DEFAULT_IDS = ["coollayout", "spdj"];
  const SEL = [".hub-center__mark", ".hub-center__en", ".hub-center__title", ".hub-center__ver", ".mf-radar"];
  const EXPAND = "M3 3h7v2H5v5H3zm11 0h7v7h-2V5h-5zM3 14h2v5h5v2H3zm16 0h2v7h-7v-2h5z";
  const COLLAPSE = "M8 3h2v7H3V8h5zm6 0h2v5h5v2h-7zM3 14h7v7H8v-5H3zm11 0h7v2h-5v5h-2z";
  const FS = {
    zh: ["全屏", "退出全屏"],
    "zh-CN": ["全屏", "退出全屏"],
    "zh-TW": ["全螢幕", "退出全螢幕"],
    en: ["Fullscreen", "Exit Fullscreen"],
    ja: ["全画面", "全画面を終了"],
    ko: ["전체 화면", "전체 화면 종료"]
  };
  function seedUiDefaults() {
    try {
      if (localStorage.getItem(SEED_KEY)) return;
      let ids = [];
      const raw = localStorage.getItem(UI_KEY);
      if (raw) {
        try { ids = JSON.parse(raw); } catch {}
        if (!Array.isArray(ids)) ids = [];
      }
      for (const id of DEFAULT_IDS) if (!ids.includes(id)) ids.push(id);
      localStorage.setItem(UI_KEY, JSON.stringify(ids.sort()));
      localStorage.setItem(SEED_KEY, "1");
    } catch {}
  }
  seedUiDefaults();
  function uiPluginOn() {
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (!raw) return false;
      const v = JSON.parse(raw);
      return Array.isArray(v) && v.includes(PLUGIN_ID);
    } catch {
      return false;
    }
  }
  const style = document.createElement("style");
  style.textContent = [
    "@media (max-height:520px){.hub-center__mark .hub-radar{display:block;width:2.6rem;height:2.6rem}}",
    ".rseat--empty .rseat__strip i{width:3px;background:rgba(255,255,255,.22);box-shadow:5px 0 0 rgba(255,255,255,.22),10px 0 0 rgba(255,255,255,.22),15px 0 0 rgba(255,255,255,.22);animation:none}",
    "html[data-rseat=\"0\"] .rseat--empty .rseat__strip i{background:#fff}",
    "html[data-rseat=\"1\"] .rseat--empty .rseat__strip i{box-shadow:5px 0 0 #fff,10px 0 0 rgba(255,255,255,.22),15px 0 0 rgba(255,255,255,.22)}",
    "html[data-rseat=\"2\"] .rseat--empty .rseat__strip i{box-shadow:5px 0 0 rgba(255,255,255,.22),10px 0 0 #fff,15px 0 0 rgba(255,255,255,.22)}",
    "html[data-rseat=\"3\"] .rseat--empty .rseat__strip i{box-shadow:5px 0 0 rgba(255,255,255,.22),10px 0 0 rgba(255,255,255,.22),15px 0 0 #fff}",
    "@media (prefers-reduced-motion:reduce){.rseat--empty .rseat__strip i{width:.5rem;background:repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 3px,transparent 3px 5px);box-shadow:none}}",
    "html .coollayout-fs.btn{padding:0;line-height:0;box-sizing:border-box}",
    "html .coollayout-fs .btn__icon{width:50% !important;height:50% !important;display:block !important;margin:0 !important;position:static !important;transform:none !important;flex:none}",
    "html .coollayout-fs.screen-fs{position:fixed;z-index:40;top:calc(8px + var(--sa-t));right:calc(8px + var(--sa-r))}",
    ".topbar__tools>.coollayout-fs,.stephead__right>.coollayout-fs,.st-top__right>.coollayout-fs,.guide__head>.coollayout-fs,.modal__actions>.coollayout-fs{position:relative;z-index:auto}",
    ".rs-tools > .fsbtn{width:.36rem;height:.36rem;flex:none}",
    ".rs-tools > .fsbtn .icon{width:50%;height:50%}",
    ".sp-coarse .rs-tools{gap:max(.1rem,8px)}",
    ".sp-coarse .topbar__tools .btn--square.btn--sm,.sp-coarse .rs-tools>.btn--square,.sp-coarse .rs-tools>.fsbtn,.sp-coarse .topbar__tools>.coollayout-fs,.sp-coarse .rs-tools>.coollayout-fs{--sq:32px;width:32px;height:32px;min-width:32px;min-height:32px;flex:none;box-sizing:border-box}",
    ".sp-coarse .rs .rs-top{padding-bottom:max(14px,.32rem)}",
    ".bpop{overflow-x:hidden;overflow-y:auto}",
    "html .bpop__close,html .dpanel__close,html .edrawer__close,html .combat-metrics__close{display:inline-flex!important;align-items:center;justify-content:center;padding:0!important;margin:0;line-height:1;box-sizing:border-box;font-size:0}",
    "html .bpop__close .icon,html .dpanel__close .icon,html .edrawer__close .icon,html .combat-metrics__close .icon,html .bpop__close svg,html .dpanel__close svg,html .edrawer__close svg,html .combat-metrics__close svg{display:block!important;margin:0!important;position:static!important;inset:auto!important;transform:none!important;flex:none;vertical-align:0;max-width:none}",
    "html .bpop__close .icon,html .bpop__close svg{width:.18rem!important;height:.18rem!important}",
    "html .dpanel__close .icon,html .dpanel__close svg{width:.2rem!important;height:.2rem!important}",
    "html .edrawer__close .icon,html .edrawer__close svg{width:.18rem!important;height:.18rem!important}",
    ".bpop__facts{flex-wrap:wrap;min-width:0}",
    ".bpop__tiers{flex-wrap:wrap;min-width:0}",
    ".bpop__harmony{min-width:0;max-width:100%}",
    ".bstrip-scroll{position:relative;display:flex;align-items:center;width:100%;min-width:0}",
    ".gm__bonds .bstrip-scroll .bstrip{flex:1;min-width:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.55) transparent}",
    ".gm__bonds .bstrip-scroll .bstrip::-webkit-scrollbar{height:8px}",
    ".gm__bonds .bstrip-scroll .bstrip::-webkit-scrollbar-thumb{background:rgba(255,255,255,.55)}",
    ".gm__bonds .bstrip-scroll .bstrip::-webkit-scrollbar-track{background:transparent}",
    "@media (max-height:600px) and (pointer:coarse),(max-height:600px) and (any-pointer:coarse){.gm__bonds{right:3.2rem}}",
    ".gm__bonds .bstrip-scroll__arrow{position:absolute;top:0;z-index:2;width:44px;height:44px;padding:0;background:transparent;color:var(--mint);border:1px solid transparent}",
    ".bstrip-scroll__arrow:first-child{left:0}",
    ".bstrip-scroll__arrow:last-child{right:0}",
    ".bstrip-scroll__arrow:disabled{opacity:.3;cursor:default;pointer-events:none}",
    ".lobby-hub .hub-plate{background:linear-gradient(var(--pl-ink),var(--pl-ink)) left .07rem center / 2px 54% no-repeat,linear-gradient(var(--pl-ink),var(--pl-ink)) left .07rem top 23% / .06rem 2px no-repeat,linear-gradient(var(--pl-ink),var(--pl-ink)) left .07rem bottom 23% / .06rem 2px no-repeat,linear-gradient(var(--pl-ink),var(--pl-ink)) right .07rem center / 2px 54% no-repeat,linear-gradient(var(--pl-ink),var(--pl-ink)) right .07rem top 23% / .06rem 2px no-repeat,linear-gradient(var(--pl-ink),var(--pl-ink)) right .07rem bottom 23% / .06rem 2px no-repeat,linear-gradient(180deg,rgba(232,237,234,.55),rgba(198,207,203,.55))}",
    ".rseat--empty .rseat__art{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;min-height:0;padding-bottom:.5rem;overflow-x:clip;overflow-y:auto;overscroll-behavior-y:contain;touch-action:pan-x pan-y;scrollbar-width:thin;background:linear-gradient(135deg,transparent 47%,rgba(255,255,255,.06) 50%,transparent 53%),#141616}",
    ".rseat--empty .rseat__invite,.rseat--empty .rseat__wait{align-self:center;flex:none;margin-top:auto}",
    ".rseat--empty .rseat__add{flex:none}",
    ".rseat__add{display:grid;grid-template-columns:1fr;gap:8px;width:calc(100% - 16px);margin-inline:8px;padding:0;box-sizing:border-box}",
    ".rseat__add .btn{height:auto;min-height:max(44px,.72rem);white-space:normal;line-height:1.25;padding:8px}",
    ".elite-recruit__menu{position:fixed;z-index:80;left:50%;top:50%;transform:translate(-50%,-50%);width:min(360px,calc(100vw - 16px));max-width:calc(100vw - 16px);max-height:min(70vh,520px);display:flex;flex-direction:column;gap:8px;padding:8px;box-sizing:border-box;overflow:clip;touch-action:pan-y;overscroll-behavior:none;border:1px solid var(--line-2);background:var(--bg-1,#0b0e0d)}",
    ".elite-recruit__find{flex:none;width:100%;min-width:0;max-width:100%;height:36px;margin:0;padding:0 8px;box-sizing:border-box;border:1px solid var(--line-2);background:transparent;color:inherit;appearance:none;-webkit-appearance:none}",
    ".elite-recruit__list{display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;min-height:0;overflow-x:clip;overflow-y:auto;touch-action:pan-y;overscroll-behavior:contain}",
    ".elite-recruit__list .btn{width:100%;max-width:100%;min-width:0;height:auto;min-height:44px;aspect-ratio:auto;justify-content:flex-start;white-space:normal;overflow-wrap:anywhere;overflow:hidden;line-height:1.2;padding:0 10px;box-sizing:border-box}",
    ".sp-coarse .elite-recruit__list .btn::before,.elite-recruit__list .btn::after{inset:0;width:auto;height:auto;transform:none}",
    ".elite-recruit__empty{padding:8px;color:var(--text-dim);font-size:13px}",
    "@media (max-height:520px){.rs-tools{display:flex}}",
    ".ping__value{font-variant-numeric:tabular-nums}",
    "@media (pointer:fine){.rs .rs-top{padding-bottom:.28rem}}",
    ".ui-slot__frame[data-plugin=\"coollayout\"],.ui-slot__frame[data-plugin=\"spdj\"]{display:none!important}",
    "[data-ui-slot=\"hud.right\"]{display:none!important}",
    ""
  ].join("");

  let alive = false;
  let raf = 0;
  const el = document.documentElement;
  const fsOk = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled)
    && (typeof el.requestFullscreen === "function" || typeof el.webkitRequestFullscreen === "function");

  function active() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  async function enter() {
    try {
      if (typeof el.requestFullscreen === "function") await el.requestFullscreen({ navigationUI: "hide" });
      else if (typeof el.webkitRequestFullscreen === "function") el.webkitRequestFullscreen();
      else return;
    } catch { return; }
    try { await screen.orientation?.lock?.("landscape"); } catch {}
  }
  async function exit() {
    try {
      if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    } catch {}
    try { screen.orientation?.unlock?.(); } catch {}
  }
  function labels() {
    const pair = FS[document.documentElement.dataset.lang] || FS.zh;
    return active() ? pair[1] : pair[0];
  }
  function paint(btn) {
    const label = labels();
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.setAttribute("aria-pressed", active() ? "true" : "false");
    const path = btn.querySelector("path");
    if (path) path.setAttribute("d", active() ? COLLAPSE : EXPAND);
  }
  function makeBtn(cls) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--secondary btn--square tapx coollayout-fs " + cls;
    btn.innerHTML = '<svg class="icon btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor"></path></svg>';
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (active()) exit();
      else enter();
    });
    paint(btn);
    btn.style.display = "none";
    document.body.appendChild(btn);
    return btn;
  }
  const screenBtn = fsOk ? makeBtn("screen-fs") : null;
  const slots = fsOk ? [
    makeBtn(""),
    makeBtn("fs-step"),
    makeBtn(""),
    makeBtn(""),
    makeBtn("")
  ] : [];
  const anchors = [
    [".lobby-guide", "after"],
    [".stephead__guide", "after"],
    ['[data-testid="stats-export"]', "before"],
    [".guide__close", "before"],
    [".modal__actions .set-guide", "before"]
  ];
  let syncing = false;
  function fitSquare(btn, node) {
    const h = node.offsetHeight;
    const w = node.offsetWidth;
    if (h < 2) return;
    let side = w > h * 1.4 ? h : w;
    if (matchMedia("(pointer: coarse)").matches) side = Math.min(side, 32);
    btn.style.width = side + "px";
    btn.style.height = (matchMedia("(pointer: coarse)").matches ? side : h) + "px";
  }
  function dock(btn, node, side) {
    const parent = node && node.parentElement;
    if (!parent || node === btn || node.classList?.contains("coollayout-fs") || node.offsetWidth < 1 || node.offsetHeight < 1) {
      btn.style.display = "none";
      return;
    }
    const before = side === "before" ? node : node.nextSibling;
    if (btn.parentElement !== parent || (side === "after" ? node.nextSibling !== btn : btn.nextSibling !== node)) {
      parent.insertBefore(btn, before);
    }
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.padding = "0";
    btn.style.left = "";
    btn.style.top = "";
    btn.style.right = "";
    btn.style.position = "relative";
    fitSquare(btn, node);
  }
  function syncButtons() {
    if (!alive || !fsOk || syncing) return;
    syncing = true;
    const screen = document.querySelector(".gload, .settle, .st--replay, .awayov");
    if (screen) {
      if (screenBtn.parentElement !== document.body) document.body.appendChild(screenBtn);
      screenBtn.style.display = "inline-flex";
      screenBtn.style.alignItems = "center";
      screenBtn.style.justifyContent = "center";
      screenBtn.style.padding = "0";
      screenBtn.style.left = "";
      screenBtn.style.top = "";
      screenBtn.style.position = "fixed";
      const sample = document.querySelector(".lobby-guide, .stephead__guide, .guide__close");
      if (sample) fitSquare(screenBtn, sample);
      screenBtn.style.zIndex = document.querySelector(".awayov") ? "80" : "40";
    } else screenBtn.style.display = "none";
    for (let i = 0; i < slots.length; i++) {
      const node = document.querySelector(anchors[i][0]);
      if (!node) slots[i].style.display = "none";
      else dock(slots[i], node, anchors[i][1]);
    }
    paint(screenBtn);
    for (const btn of slots) paint(btn);
    syncing = false;
  }
  document.addEventListener("fullscreenchange", syncButtons);
  document.addEventListener("webkitfullscreenchange", syncButtons);
  let mo = null;

  let tx = 0, ty = 0, cx = 0, cy = 0, on = false;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const MAX = coarse ? 10 : 18;
  const lerp = coarse ? 0.16 : 0.12;
  function fromPoint(x, y) {
    tx = (x / innerWidth - 0.5) * 2;
    ty = (y / innerHeight - 0.5) * 2;
  }
  if (coarse) {
    addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") fromPoint(e.clientX, e.clientY); }, { passive: true });
    addEventListener("pointermove", (e) => { if (e.pointerType === "touch") fromPoint(e.clientX, e.clientY); }, { passive: true });
    const back = (e) => { if (!e || e.pointerType === "touch") { tx = 0; ty = 0; } };
    addEventListener("pointerup", back, { passive: true });
    addEventListener("pointercancel", back, { passive: true });
  } else {
    addEventListener("mousemove", (e) => fromPoint(e.clientX, e.clientY), { passive: true });
  }
  let seatStep = -1;
  function syncSeats() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const step = Math.floor(Date.now() / 1500) % 4;
    if (step === seatStep) return;
    seatStep = step;
    document.documentElement.dataset.rseat = String(step);
  }
  function nodes() { return SEL.map((s) => document.querySelector(s)).filter(Boolean); }
  let pingKey = "";
  let pingW = 0;
  function lockPings() {
    const nodes = document.querySelectorAll(".ping__value");
    if (!nodes.length) return;
    const s = getComputedStyle(nodes[0]);
    const key = s.font + "|" + s.letterSpacing;
    if (key !== pingKey) {
      pingKey = key;
      const probe = document.createElement("span");
      probe.textContent = "000";
      probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;font:" + s.font + ";letter-spacing:" + s.letterSpacing + ";font-variant-numeric:tabular-nums";
      document.body.appendChild(probe);
      pingW = Math.ceil(probe.getBoundingClientRect().width);
      probe.remove();
    }
    if (!pingW) return;
    const w = pingW + "px";
    for (const el of nodes) {
      if (el.style.minWidth === w) continue;
      el.style.display = "inline-block";
      el.style.textAlign = "right";
      el.style.minWidth = w;
    }
  }
  function tick() {
    if (!alive) return;
    syncSeats();
    syncButtons();
    lockPings();
    const list = nodes();
    if (!list.length) {
      if (on) { cx = 0; cy = 0; on = false; }
    } else {
      on = true;
      cx += (-tx * MAX - cx) * lerp;
      cy += (-ty * MAX - cy) * lerp;
      const v = "translate(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px)";
      for (const node of list) node.style.transform = v;
      const logo = document.querySelector(".hub-center__logo");
      if (logo) logo.style.transform = "";
      const bg = document.querySelector(".hub-bg");
      if (bg) bg.style.transform = "translate(" + (cx * 0.35).toFixed(2) + "px," + (cy * 0.35).toFixed(2) + "px) scale(1.03)";
    }
    raf = requestAnimationFrame(tick);
  }
  function enable() {
    if (alive) return;
    alive = true;
    if (!style.isConnected) document.documentElement.appendChild(style);
    if (document.body && !mo) {
      mo = new MutationObserver(() => syncButtons());
      mo.observe(document.body, { childList: true, subtree: true });
    }
    raf = requestAnimationFrame(tick);
  }
  function disable() {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(raf);
    raf = 0;
    try { mo && mo.disconnect(); } catch {}
    mo = null;
    style.remove();
    for (const btn of [screenBtn, ...slots].filter(Boolean)) {
      btn.style.display = "none";
      if (btn.parentElement !== document.body) document.body.appendChild(btn);
    }
    delete document.documentElement.dataset.rseat;
    for (const node of nodes()) node.style.transform = "";
    const bg = document.querySelector(".hub-bg");
    if (bg) bg.style.transform = "";
    cx = 0; cy = 0; on = false;
  }
  function syncPref() {
    if (uiPluginOn()) enable();
    else disable();
  }
  function watchPref() {
    let cur = uiPluginOn();
    const check = () => {
      const next = uiPluginOn();
      if (next === cur) return;
      cur = next;
      syncPref();
    };
    try {
      const proto = Storage.prototype;
      if (!proto.__spUiPluginHook) {
        const raw = proto.setItem;
        proto.setItem = function (k, v) {
          raw.call(this, k, v);
          if (k === "sp.pref.ui-plugins") check();
        };
        proto.__spUiPluginHook = 1;
      }
    } catch {}
    window.addEventListener("storage", check);
    setInterval(check, 800);
  }
  watchPref();
  if (document.body) syncPref();
  else document.addEventListener("DOMContentLoaded", syncPref, { once: true });
})();
