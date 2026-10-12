/* ZONE 53 — sections 1-2A · one-camera flight + collapse trigger · sections 2-3 native · vanilla JS (ES2022) */
"use strict";

/* ---------- tunables ---------- */
const STAGE_W = 1921;
const MOBILE_MAX_W = 600;     // below this width the mobile layout kicks in
const MOBILE_W = 370;         // mobile design width (mob-1-1 / mob-2-2)
const CAM_END = 10.9;         // house zoom - camera finale (desktop + mobile house cap below)
const CAM_SKY_END = CAM_END;  // desktop sky stays on the shared 10.9x: taming it to 7x
                               // introduced visible sliding between the cutout house (10.9x)
                               // and the baked-in ground beneath it (contact drift grows as
                               // (10.9-7)x distance-from-origin, ~100+ stage px at the end).
                               // Reverted 10.26; desktop FF end-zoom micro-freezes accepted.
const M_CAM_END = 5.2;        // mobile: house & sky capped at 5.2x to fit GPU texture budget
const M_CAM_SKY_END = 5.2;    // mobile sky cap
const FLY_DUR = 2.0;          // exterior flight, seconds
const FLY_EASE = 2.0;         // flight easing exponent: quick response, max speed at the door
const UI_FADE = 0.4;          // hero UI dissolve window before the end of the flight
const UI_LEAD = 0.5;          // user: text+button starts fading 0.5s earlier
const BLACK_T0 = 1.85;        // fullscreen veil seals in the last 0.15s (the spot does the visible work)
const SPOT_T0 = 1.3;          // gradient spot growth start (s) — early and long for a soft dome
const SPOT_T1 = 2.0;          // gradient spot growth end (s) = flight end
const SPOT_S0 = 0.7;          // spot start scale (mockup 1-3 is 0.8x of 1-4)
const SPOT_S1 = 1.2;          // spot end scale (past 1-4 for edge coverage)
const INT_ZOOM = 1.2;         // interior push-in target (visible braking)
const INT_ZOOM_DUR = 1.5;     // interior push-in time (s), ease-out — starts under blackout exit
const BLACK_HOLD = 0.3;       // full-black dwell after the swap
const INT_ZOOM_T0 = 0;        // zoom runs under black — already in progress at blackout exit
const BLACK_MELT = 0.4;       // blackout melt-out (halved: was 0.8) — total black 0.7s
/* two-phase camera origin: A=horizon (house base) holds ZONE53 clear, B=gate centres the dive */
const CAM_OX = 959;           // desktop origin X, stage px
const CAM_OY_HOR = 632;     // desktop origin ABOVE min horizon (min edge 870→637.3; all pts move down, none rises into ZONE53 bottom 615)
const CAM_OY_GATE = 630.3;      // desktop door centre Y
const CAM_BLEND_E0 = 0.995;     // eased-flight progress where origin starts leaving the horizon
const CAM_BLEND_E1 = 1.0;     // ...fully on the gate at flight end (spot-o ≈ 1 there)
const CAM_DROP = 30;          // final horizon drop, stage px (user: -30 at e=1)
const M_CAM_DROP = 6;         // mobile final drop (width-ratio)
const CAM_DROP_E0 = 0.9;      // drop ramp start
const CAM_DROP_E1 = 1.0;      // ...full 30px at flight end

/* ---------- redesign 10.2026 · collapse trigger (trigger 2) ----------
   After the 1→2 flight stops (T_END), the next gesture collapses the interior
   photo between the two headlines (--c2-p 0→1). On finish the scroll lock
   releases (body.native) and sections 2/3 flow natively. Scroll-up at the very
   top of the native page re-locks and reverses the collapse back to full-screen. */
const T_END = FLY_DUR + INT_ZOOM_T0 + INT_ZOOM_DUR + 0.2; // engine stop: zoom parked (3.7)
const C2_DUR = 1.1;           // collapse flight, seconds (each direction)

const root = document.documentElement;
const viewport = document.getElementById("main");
const sceneCollapse = document.getElementById("sceneCollapse");
const sceneContent = document.getElementById("sceneContent");
const s3section = document.getElementById("s3");
const c2Img = document.getElementById("c2Img");
const c2TopEl = document.getElementById("c2Top");
const c2BottomEl = document.getElementById("c2Bottom");
const heroUi = document.getElementById("heroUi");
const mHero = document.getElementById("mHero");
const camSkyEl = document.querySelector('.camera--sky');
const camHouseEl = document.querySelector('.camera--house');
const mCamSkyEl = document.querySelector('.m-camera--sky');
const mCamHouseEl = document.querySelector('.m-camera--house');

// matchMedia is read at trigger time (user setting may change mid-session)
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
const smooth = (x) => x * x * (3 - 2 * x);

/* Direct-to-element transform setters — bypass CSS-variable cascade entirely.
   Private __ct/__co caches on DOM nodes skip redundant style writes. */
function setCamTransform(el, dy, s) {
  if (!el) return;
  const v = 'translateY(' + (+dy).toFixed(1) + 'px) scale(' + (+s).toFixed(4) + ')';
  if (el.__ct === v) return;
  el.__ct = v;
  el.style.transform = v;
}
function setCamOrigin(el, ox, oy) {
  if (!el) return;
  const v = (+ox).toFixed(1) + 'px ' + (+oy).toFixed(1) + 'px';
  if (el.__co === v) return;
  el.__co = v;
  el.style.transformOrigin = v;
}

function fitStage() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw <= MOBILE_MAX_W;
  viewport.dataset.mode = mobile ? "mobile" : "desktop";
  // batch all DOM reads before writes (avoids force-layout on resize)
  const s4inner = document.querySelector(".s4__inner");
  const s4h = s4inner ? Math.max(1, s4inner.scrollHeight) : 1318;
  const s2cScale0 = document.querySelector(".s2c__scale");
  const s2cH = s2cScale0 ? s2cScale0.scrollHeight : 0;
  const c2sz = measureC2raw(vw);
  const k4v = Math.min(vw / 1920, vh / s4h); // s4 stage 1920 (CSS .s4__scale), not STAGE_W 1921
  setVar("--k", vw / STAGE_W);
  setVar("--k2", vw / MOBILE_W);
  // stable collapse height: only on width change (toolbar/keyboard leave height alone)
  if (vw !== __lastW) { __lastW = vw; setVar("--c2vh", vh + "px"); }
  // s4: full-fit to real content (perks wrap — height floats, 1318 fallback only)
  const s4scale = document.querySelector(".s4__scale");
  if (s4scale) s4scale.style.height = s4h + "px";
  setVar("--k4", k4v);
  // s4 in flow: section height = content x scale; in overlay/locked — auto (fixed rules)
  const s4p = document.getElementById("s4panel");
  if (s4p) {
    s4p.style.height = (nativeMode && !document.body.classList.contains("s4force"))
      ? Math.max(1, Math.round(s4h * (mobile ? vw / MOBILE_W : k4v))) + "px"
      : "";
  }
  // s2c: section height = 1921-stage height x k (desktop); mobile — auto height
  const s2cEl = document.getElementById("sceneContent");
  if (s2cEl && s2cScale0) {
    if (mobile) s2cEl.style.height = "";
    else s2cEl.style.height = Math.max(1, Math.round(s2cH * (vw / STAGE_W))) + "px";
  }
  if (c2sz.h1) setVar("--h1h", c2sz.h1 + "px");
  if (c2sz.h2) setVar("--h2h", c2sz.h2 + "px");
  const mT = document.querySelector(".m-s4title");
  if (mT) mT.setAttribute("aria-hidden", mobile ? "false" : "true");
  ribbonsCheck(); // resize can pull ribbons into frame (or drop them — in is one-way)
  revealsCheck(); // resize can pull content into frame
  applyFrame(displayTime); // re-apply camera transforms for current mode on resize
}

const __varCache = Object.create(null);
let __lastW = 0;
function setVar(name, value) {
  const v = typeof value === "number" ? value.toFixed(4) : value;
  if (__varCache[name] === v) return;
  __varCache[name] = v;
  root.style.setProperty(name, v);
}

/* ---------- collapse trigger engine + photo preload (redesign 10.2026) ---------- */
/* ---------- preload + GPU decode the collapse photo ---------- */
let interiorReady = false;
function markInteriorReady() {
  if (interiorReady) return;
  interiorReady = true;
}
try {
  const probe = new Image();
  probe.decoding = "async";
  probe.src = c2Img.currentSrc || c2Img.src;
  if (probe.decode) {
    probe.decode().then(markInteriorReady).catch(markInteriorReady);
  } else {
    probe.onload = markInteriorReady;
    probe.onerror = markInteriorReady;
  }
} catch (err) {
  interiorReady = true;
}
if (c2Img.complete && c2Img.naturalWidth > 0) interiorReady = true;

/* ---------- trigger engine ----------
   Scroll is a trigger, not a scrub: a decisive wheel / swipe / key gesture
   starts an uninterrupted playback to the other end (down = through the
   1→2 reveal, up = back to section 1). Input stays locked until it lands.
   T_END (tunables above) = parking stop with the interior reveal done. */
const PLAY_RATE = 1;        // timeline-sec per real second, 1:1, never rushed
// Lock only for the flight duration. Do NOT swallow the gesture tail after landing:
// inertia always keeps its sign, and at the ends it is a no-op anyway (at-end/at-start).
// Swallowing until pause caused a permanent lock under continuous spinning — removed.

let displayTime = 0;
let playing = 0;            // 0 = idle, +1 = forward, -1 = backward
let target = 0;             // rest stop: 0 (section 1), T_END (collapse block)
let lastStamp = 0;
let rafId = 0;
let lastPhase = "";

function fire(dir) {
  if (playing || c2playing) return;              // mid-flight: locked, no interruption
  if (dir > 0) {
    if (displayTime >= T_END - 1e-4) {
      // at the parking stop: the next down-gesture fires the collapse trigger
      // (in native mode the page scrolls on its own instead — caller routes)
      if (nativeMode) return;
      if (c2p >= 1 - 1e-4) return;
      c2fire(1);
      return;
    }
    target = T_END;                              // next stop ahead
  } else {
    if (displayTime <= 1e-4 && c2p <= 1e-4) return; // already at the very start
    if (c2p > 1e-4) { c2fire(-1); return; }         // un-collapse first
    target = 0;                                     // next stop behind
  }
  if (prefersReducedMotion()) {
    displayTime = target;
    applyFrame(displayTime);
    if (dir > 0 && target === T_END && !nativeMode) { applyC2(1); enterNative(); }
    return;
  }
  playing = dir;
  lastStamp = performance.now();
  if (!rafId) rafId = requestAnimationFrame(loop);
}

function loop(stamp) {
  const dt = Math.min(Math.max((stamp - lastStamp) / 1000, 0), 0.05);
  lastStamp = stamp;
  let t = displayTime + playing * PLAY_RATE * dt;
  if (!interiorReady && playing > 0 && t > FLY_DUR) t = FLY_DUR; // hold black until decoded
  if ((playing > 0 && t >= target) || (playing < 0 && t <= target)) {
    const fwd = playing > 0;
    displayTime = target;
    applyFrame(displayTime);
    playing = 0;
    rafId = 0;
    if (fwd && target === T_END && !nativeMode) c2fire(1); // chain into native: flight -> collapse -> native without stopping
    return;
  }
  displayTime = t;
  applyFrame(displayTime);
  rafId = requestAnimationFrame(loop);
}

function applyFrame(elapsed) {
  const inTwo = elapsed >= FLY_DUR;
  if (inTwo && lastPhase !== "two") {
    lastPhase = "two";
    viewport.dataset.phase = "two";
    sceneCollapse.setAttribute("aria-hidden", "false");
    heroUi.setAttribute("inert", "");
    mHero.setAttribute("inert", "");
  } else if (!inTwo && lastPhase !== "one") {
    lastPhase = "one";
    viewport.dataset.phase = "one";
    sceneCollapse.setAttribute("aria-hidden", "true");
    heroUi.removeAttribute("inert");
    mHero.removeAttribute("inert");
  }

  if (!inTwo) {
    // ——— phase 1 · exterior flight, accelerating ———
    const isMobile = viewport.dataset.mode === "mobile";
    const skyEnd = isMobile ? M_CAM_SKY_END : CAM_SKY_END;
    const houseEnd = isMobile ? M_CAM_END : CAM_END;
    // On mobile, clamp camera progression at BLACK_T0 (1.85s) so the camera stops scaling
    // under the 100% black curtain, and starts smoothly without an allocation spike on reverse
    const flightT = isMobile ? clamp01(Math.min(elapsed, BLACK_T0) / BLACK_T0) : clamp01(elapsed / FLY_DUR);
    const e = Math.pow(flightT, FLY_EASE);
    // two-phase origin: pin the horizon under ZONE53 until the house covers the
    // inscription (e > 0.8 ≈ spot-o > 0.7), then dive toward the gate centre
    const camSky = Math.pow(skyEnd, e);
    const camHouse = Math.pow(houseEnd, e);
    const blend = smooth(clamp01((e - CAM_BLEND_E0) / (CAM_BLEND_E1 - CAM_BLEND_E0)));
    const drop = smooth(clamp01((e - CAM_DROP_E0) / (CAM_DROP_E1 - CAM_DROP_E0)));

    if (isMobile) {
      const dy = +(M_CAM_DROP * drop).toFixed(1);
      setCamTransform(mCamSkyEl, dy, camSky);
      setCamTransform(mCamHouseEl, dy, camHouse);
    } else {
      const dy = +(CAM_DROP * drop).toFixed(1);
      const oy = +(CAM_OY_HOR + (CAM_OY_GATE - CAM_OY_HOR) * blend).toFixed(1);
      setCamTransform(camSkyEl, dy, camSky);
      setCamTransform(camHouseEl, dy, camHouse);
      setCamOrigin(camSkyEl, CAM_OX, oy);
      setCamOrigin(camHouseEl, CAM_OX, oy);
    }

    const fade = clamp01((elapsed - (FLY_DUR - UI_FADE - UI_LEAD)) / UI_FADE);
    setVar("--ui-o", 1 - fade);
    setVar("--z53-o", 1); // ZONE 53 stays visible until the house covers it (no dissolve)
    const spotP = smooth(clamp01((elapsed - SPOT_T0) / (SPOT_T1 - SPOT_T0)));
    setVar("--spot-o", spotP * 0.85); // soft cap in phase 1; full 1.0 only under the blackout (phase 2)
    setVar("--spot-s", SPOT_S0 + (SPOT_S1 - SPOT_S0) * spotP);
    setVar("--black", clamp01((elapsed - BLACK_T0) / (FLY_DUR - BLACK_T0)));
    // park phase-2 vars so scrubbing back is clean (spot stays driven above)
  setVar("--c2-zoom", 1);
    return;
  }

  // ——— phase 2 · interior reveal: black holds, melts, the zoom parks (redesign 10.2026:
  //    no typewriter, no autoplay blocks — the collapse trigger and all motion below
  //    are gesture/native-scroll driven) ———
  const t = elapsed - FLY_DUR;
  const zoomT0 = INT_ZOOM_T0; // 0 — zoom already runs under black, visible right at blackout exit
  setVar("--black", t < BLACK_HOLD ? 1 : 1 - clamp01((t - BLACK_HOLD) / BLACK_MELT));
  // c2-zoom mirrors the reveal-phase zoom until collapse starts (applyC2 drives it after)
  if (c2p <= 1e-4) setVar("--c2-zoom", 1 + (INT_ZOOM - 1) * easeOutCubic(clamp01((t - zoomT0) / INT_ZOOM_DUR)));
  // keep the exterior parked at its end state under the swap
  if (viewport.dataset.mode === "mobile") {
    setCamTransform(mCamSkyEl, M_CAM_DROP, M_CAM_SKY_END);
    setCamTransform(mCamHouseEl, M_CAM_DROP, M_CAM_END);
  } else {
    setCamTransform(camSkyEl, CAM_DROP, CAM_SKY_END);
    setCamTransform(camHouseEl, CAM_DROP, CAM_END);
    setCamOrigin(camSkyEl, CAM_OX, CAM_OY_GATE);
    setCamOrigin(camHouseEl, CAM_OX, CAM_OY_GATE);
  }
  setVar("--ui-o", 0);
  setVar("--z53-o", 1);
  setVar("--spot-o", 1);
  setVar("--spot-s", SPOT_S1);
}

/* ---------- redesign 10.2026 · collapse trigger (trigger 2) ----------
   At the T_END stop the next down-gesture collapses the interior photo between
   the two headlines: --c2-p 0→1 shrinks the photo height to the gap between
   them (CSS), headlines slide in, H2 overlaps the photo. On completion the lock
   releases (body.native) and sections 2/3 flow natively. Scroll-up at the very
   top of the native page re-locks and reverses the collapse. */
let nativeMode = false;
let c2p = 0;               // collapse progress 0..1 (drives --c2-p)
let c2playing = 0;          // 0 = idle, +1 = collapsing, -1 = un-collapsing
let c2Raf = 0;
let c2Stamp = 0;

function pageScrollTop() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function atDocTop() { return pageScrollTop() <= 1; }

function applyC2(p) {
  c2p = p;
  // ease-out quart: sharp start, long ease into finish (10.2026)
  const e = easeOutQuart(clamp01(p));
  setVar("--c2-p", e.toFixed(4));
  // photo pulls back with the frame: INT_ZOOM -> 1, fit-to-width at finish
  setVar("--c2-zoom", (INT_ZOOM - (INT_ZOOM - 1) * e).toFixed(4));
  const h2o = smooth(clamp01(e * 3));
  setVar("--h2-o", h2o.toFixed(3));
}

function c2fire(dir) {
  if (c2playing) return;
  if (dir > 0 && c2p >= 1 - 1e-4) return;
  if (dir < 0 && c2p <= 1e-4) return;
  if (dir > 0) autoBack = false;
  if (prefersReducedMotion()) {
    applyC2(dir > 0 ? 1 : 0);
    if (dir > 0) enterNative();
    else if (autoBack) { autoBack = false; fire(-1); }
    return;
  }
  c2playing = dir;
  c2Stamp = performance.now();
  if (!rafId && !c2Raf) c2Raf = requestAnimationFrame(c2loop);
}

function c2loop(stamp) {
  const dt = Math.min(Math.max((stamp - c2Stamp) / 1000, 0), 0.05);
  c2Stamp = stamp;
  let p = c2p + c2playing * dt / C2_DUR;
  if ((c2playing > 0 && p >= 1) || (c2playing < 0 && p <= 0)) {
    applyC2(c2playing > 0 ? 1 : 0);
    c2playing = 0;
    c2Raf = 0;
    if (c2p >= 1) enterNative();
    else if (c2p <= 0 && autoBack) { autoBack = false; fire(-1); } // transit reverse back to hero
    return;
  }
  applyC2(p);
  c2Raf = requestAnimationFrame(c2loop);
}

function enterNative() {
  if (nativeMode) return;
  nativeMode = true;
  document.body.classList.add("native");
  sceneContent.removeAttribute("aria-hidden");
  sceneContent.removeAttribute("inert");
  s3section.removeAttribute("aria-hidden");
  s4panel.removeAttribute("inert");
  s4panel.setAttribute("aria-hidden", "false");
  applyC2(1); // pin final geometry (no transition vars involved — pure values)
  fitStage(); // inside: ribbonsCheck+revealsCheck (section may have opened already in view)
}

let autoBack = false; // transit reverse: right after un-collapse, flight back
function engageReverse() {
  if (!nativeMode || c2playing) return;
  autoBack = true;
  nativeMode = false;
  // mute the s4-flow transition while removing native, otherwise the panel flashes a slide
  s4panel.style.transition = "none";
  document.body.classList.remove("native");
  void s4panel.offsetHeight;
  s4panel.style.transition = "";
  window.scrollTo(0, 0);
  sceneContent.setAttribute("aria-hidden", "true");
  sceneContent.setAttribute("inert", "");
  s3section.setAttribute("aria-hidden", "true");
  c2fire(-1);
}

/* ---------- ribbons: fly in once fully inside the viewport ----------
   Bands are wider than any viewport, so a ratio threshold can never reach 1 —
   and headless test rigs don't deliver IO callbacks at all. Deterministic
   scroll-driven check instead: on every scroll (plus enterNative/resize) each
   not-yet-fired ribbon is tested for full HEIGHT containment (layout box via
   offsetTop/Height — rotated corners don't inflate it) and gets .in once.
   "Fully visible" = the band's full height is on screen; fast scroll to the
   bottom still staggers them via the CSS transition-delays. */
const ribbonEls = Array.from(document.querySelectorAll(".ribbon"));
const s3stage = document.querySelector(".s3__stage");
function ribbonPos(el) {
  if (!s3stage) return null;
  const st = s3stage.getBoundingClientRect();
  const dw = viewport.dataset.mode === "mobile" ? 370 : 1921;
  if (st.width <= 0) return null;
  const k = st.width / dw;
  const top = st.top + el.offsetTop * k;
  return { top: top, bot: top + el.offsetHeight * k };
}
function ribbonsCheck() {
  // fly-in only on full entry; fly-out only on exit
  // down (reverse scroll); above the frame (scrolled past) — no change
  const vh = window.innerHeight;
  ribbonEls.forEach((r) => {
    const p = ribbonPos(r);
    if (!p) return;
    if (p.top >= -2 && p.bot <= vh + 2) r.classList.add("in");
    else if (p.bot > vh + 2) r.classList.remove("in"); // edge touched the viewport bottom — early reverse fly-out
  });
}
window.addEventListener("scroll", ribbonsCheck, { passive: true });

/* ---------- reveals: content reveals once (fade + 40px rise, 0.8s) ----------
   Trigger — 40px of the block top edge entered the frame. One-way (never fades back).
   Zero box of a hidden section yields false. */
const revealEls = Array.from(document.querySelectorAll(".rv"));
function revealsCheck() {
  const vh = window.innerHeight;
  revealEls.forEach((el) => {
    if (el.classList.contains("in")) return;
    const b = el.getBoundingClientRect();
    if (b.width <= 0 && b.height <= 0) return;
    if (b.top <= vh - 40) el.classList.add("in");
  });
}
window.addEventListener("scroll", revealsCheck, { passive: true });

/* ---------- video: poster + play -> inline playback (no auto-fullscreen) ---------- */
const videoBlock = document.getElementById("videoBlock");
const videoPlayBtn = document.getElementById("videoPlay");
if (videoPlayBtn) videoPlayBtn.addEventListener("click", () => {
  if (!videoBlock) return;
  videoBlock.classList.add("video--playing");
  const v = document.createElement("video");
  v.src = "assets/video.mp4";
  v.controls = true;
  v.autoplay = true;
  v.playsInline = true;
  v.preload = "auto";
  const frame = videoBlock.querySelector(".video__frame");
  frame.appendChild(v);
  v.play().catch(() => {}); // user gesture — sound allowed
  if (v.focus) v.focus({ preventScroll: true }); // keyboard stays with the video controls
  // inline: auto-fullscreen removed; manual fullscreen — native controls button / double-click
});

/* ---------- SPONSOR buttons: section 4 slides out immediately ---------- */
const sponsorBtn = document.getElementById("sponsorBtn");
if (sponsorBtn) sponsorBtn.addEventListener("click", () => s4openPanel());
const mSponsorBtn = document.getElementById("mSponsorBtn");
if (mSponsorBtn) mSponsorBtn.addEventListener("click", () => s4openPanel());

/* ---------- collapse geometry measurement ----------
   Headlines are scaled by the section stage factor (--k desktop 1921 stage,
   --k2 mobile 370 stage), so the measured layout height must be multiplied
   by it to feed viewport-px geometry (photo height = 100dvh - H1s - H2s + 8). */
function measureC2raw(vw) {
  const mobile = viewport.dataset.mode === "mobile";
  const k = mobile ? vw / MOBILE_W : vw / STAGE_W;
  const h1 = Math.round((c2TopEl.offsetHeight || 0) * k);
  const h2 = Math.round((c2BottomEl.offsetHeight || 0) * k);
  return { h1: h1, h2: h2 };
}

function onWheel(event) {
  var d = event.deltaY !== 0 ? event.deltaY : event.deltaX; // tilt/trackball may drive horizontally
  // NB: do NOT filter ctrlKey: some drivers/Chrome send every scroll as
  // Ctrl+wheel (pinch emulation), and the filter ate all ticks in Chrome.
  // Page is fixed art with no scroll, so every tick = history trigger.
  if (d === 0) return;
  if (s4Wheel(d > 0 ? 1 : -1)) return; // section 4: routing above the engine
  if (nativeMode) {
    if (d < 0 && atDocTop()) engageReverse(); // up at the very top re-locks the engine
    return;                                    // otherwise the page scrolls natively
  }
  // first non-zero tick fires, no thresholds
  fire(d > 0 ? 1 : -1);
}

let lastTouchY = null;
let touchAcc = 0;
function onTouchStart(event) {
  if (event.touches.length > 0) {
    lastTouchY = event.touches[0].clientY;
    touchAcc = 0;
  }
}
function onTouchMove(event) {
  if (playing || c2playing) return;
  if (lastTouchY === null || event.touches.length === 0) return;
  const y = event.touches[0].clientY;
  touchAcc += lastTouchY - y; // swipe up = forward
  lastTouchY = y;
  if (touchAcc >= 10) { touchAcc = 0; if (s4Touch(1)) return; if (nativeMode) return; fire(1); }
  else if (touchAcc <= -10) {
    touchAcc = 0; if (s4Touch(-1)) return;
    if (nativeMode) { if (atDocTop()) engageReverse(); return; } // swipe at the very top
    fire(-1);
  }
}
function onTouchEnd() { lastTouchY = null; touchAcc = 0; }

// Legacy IE/Chromium wheel: wheelDelta>0 = up. Duplicate in case someone
// cuts the wheel event itself — at least one of the two reaches the engine;
// repeat call is safe: fire() is locked by playing.
function onMouseWheel(event) {
  var wd = event.wheelDelta !== 0 ? event.wheelDelta : event.wheelDeltaX; // axis checked too
  if (!wd) return;
  if (s4Wheel(wd < 0 ? 1 : -1)) return; // section 4: same route for the legacy duplicate
  if (nativeMode) {
    if (wd > 0 && atDocTop()) engageReverse(); // wheelDelta>0 = up, like d<0 in onWheel
    return; // native page scrolls itself; fire/c2fire without engageReverse forbidden
  }
  fire(wd < 0 ? 1 : -1);
}

function onKey(event) {
  if (s4Key(event)) return; // section 4: Escape/End interception above the engine
  var tk = event.target;
  if (tk && tk.closest && tk.closest("button,a")) return; // focus on button/link: Enter/Space click on their own, engine stays quiet (no fire+click double)
  if (nativeMode) {
    // native scroll handles the rest; only Home/PageUp/ArrowUp at the very top
    // re-locks the engine for the reverse collapse (after the native jump lands)
    if (["ArrowUp", "PageUp", "Home"].includes(event.key)) {
      requestAnimationFrame(() => { if (atDocTop()) engageReverse(); });
    }
    return;
  }
  if (["ArrowDown", "PageDown", " ", "Enter", "End"].includes(event.key)) fire(1);
  else if (["ArrowUp", "PageUp", "Home"].includes(event.key)) fire(-1);
}

fitStage();
applyFrame(0);
let fitRaf = 0; // resize throttling: one fitStage per frame
window.addEventListener("resize", () => {
  if (fitRaf) return;
  fitRaf = requestAnimationFrame(() => { fitRaf = 0; fitStage(); });
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitStage()); // web fonts change wrapping — re-measure s4
window.addEventListener("wheel", onWheel, { passive: true, capture: true }); // capture: before bubble interceptors of extensions
window.addEventListener("mousewheel", onMouseWheel, { passive: true, capture: true }); // legacy duplicate: muting the wrong type does not mute both
window.addEventListener("touchstart", onTouchStart, { passive: true });
window.addEventListener("touchmove", onTouchMove, { passive: true });
window.addEventListener("touchend", onTouchEnd, { passive: true });
window.addEventListener("keydown", onKey);

/* ---------- section 4 · sponsor panel (fixed sheet over the viewport) ----------
   Lives beside the trigger engine: fire/loop/applyFrame untouched.
   Wheel/touch/key handlers route through s4Wheel/s4Touch/s4Key first: the panel
   opens from the SPONSOR button or at the bottom of the ribbons section (native
   mode), and closes on an up-gesture at its own top.
   The window wheel listener stays passive, so the panel's own overflow-y:auto
   scroll is never blocked — routing only swallows the engine trigger. */
const s4panel = document.getElementById("s4panel");
const s4cardsBox = document.getElementById("s4cards");
const s4pop = document.getElementById("s4pop");
const s4popX = document.getElementById("s4popX");
const s4mini = document.getElementById("s4mini");
const s4popForm = document.getElementById("s4popForm");
const s4selectBtns = Array.from(document.querySelectorAll("[data-select]"));
const S4_DATA = [
  { name: "For Founders", price: '$1,500<span class="per">/month</span>', perks: ["access to chat with all startups", "24/7 access to hangar"] },
  { name: "For Investors", price: '$3,000<span class="per">/month</span>', perks: ["access to chat with all startups + partners chat", "24/7 access to hangar", "access to all events", "access to closed media channels"] },
  { name: "For Companies", price: '$7,500<span class="per">/month</span>', perks: ["access to chat with all startups + partners chat", "24/7 access to hangar", "access to all events", "ability to organise your event with us", "access to closed media channels", "search for top engineers fot your team", "consulting and help to integrate or develop robotics/AR in your business", "support with GTM in Poland"] },
];
let s4open = false;
let s4popOpen = false;
let s4opener = null; // focus return on panel close
let s4sel = -1;
let s4sending = false; // lead submit in flight
let s4sent = false; // success replaces form contents until next open
const s4formHTML = s4popForm.innerHTML; // clean form snapshot for post-success restore
let s4lastBtn = null;
let s4lastW = window.innerWidth;
let s4quietUntil = 0; // quarantine after panel close: momentum tail dies here, not on section 2
let s4prepTimer = 0; // staged open: card settles 350ms, then the popup flies
let s4glideTimer = 0; // mini-glide delay cleanup (stagger behind the frame flight)
let s4ghostTimer = 0; // shared-element flight timers (open clone)
let s4ghostEl = null;

/* s4 is an in-flow content section: no auto-enter from below anymore, button only.
   s4Wheel/s4Touch/s4Key open branches remain as dead guard code. */
function s4atEnd() {
  return false;
}

function s4openPanel() {
  if (s4open) return;
  s4open = true;
  s4opener = document.activeElement;
  document.body.classList.add("s4force"); // overlay mode above the flow
  document.body.classList.add("s4open");
  sceneContent.setAttribute("inert", ""); // s2c/s3 background — inert under the dialog
  s3section.setAttribute("inert", "");
  s4panel.setAttribute("aria-hidden", "false");
  s4panel.removeAttribute("inert");
}

function s4closePanel() {
  if (!s4open) return;
  if (s4popOpen) s4closePop(false);
  s4open = false;
  s4quietUntil = performance.now() + 900; // fresh up-gesture required to go back
  document.body.classList.remove("s4open");
  document.body.classList.remove("s4force");
  if (nativeMode) { // in flow the background is live again; in locked phase sections stay hidden
    sceneContent.removeAttribute("inert");
    s3section.removeAttribute("inert");
  }
  s4panel.setAttribute("aria-hidden", "true");
  s4panel.setAttribute("inert", "");
  if (s4opener && s4opener.focus) { try { s4opener.focus({ preventScroll: true }); } catch (e) {} }
  s4opener = null;
}

// Up-navigation guard: while filling (popup open / input focused) or inside the
// post-close quarantine, upward gestures die here — no lost data, no double jump.
function s4backBlocked() {
  if (performance.now() < s4quietUntil) return true;
  if (s4popOpen) return true;
  const a = document.activeElement;
  return !!(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
}

// dir: +1 = down/forward, -1 = up/back. Returns true when consumed.
function s4Wheel(dir) {
  if (dir < 0 && s4backBlocked()) return true;
  if (s4open) {
    if (dir < 0 && s4panel.scrollTop <= 0) s4closePanel();
    return true; // panel open: engine quiet, panel scroll is native
  }
  if (dir > 0 && s4atEnd()) { s4openPanel(); return true; }
  return false;
}

function s4Touch(dir) {
  if (dir < 0 && s4backBlocked()) return true;
  if (s4open) {
    if (dir < 0 && s4panel.scrollTop <= 0) s4closePanel();
    return true;
  }
  if (dir > 0 && s4atEnd()) { s4openPanel(); return true; }
  return false;
}

function s4Key(event) {
  const k = event.key;
  if (k === "Escape") {
    if (s4popOpen) { s4closePop(true); return true; }
    if (s4open) { s4closePanel(); return true; }
    return false;
  }
  if (s4open) return true; // panel open: engine quiet
  if ((k === "ArrowUp" || k === "PageUp" || k === "Home") && s4backBlocked()) return true;
  const t = event.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return true;
  if ((k === "End" || k === "PageDown") && s4atEnd()) { s4openPanel(); return true; }
  return false;
}

function s4cardEl(i) { return s4cardsBox.querySelector('[data-card="' + i + '"]'); }

function s4isMobile() { return viewport.dataset.mode === "mobile"; }

function s4renderMini(i) {
  const d = S4_DATA[i];
  let lis = "";
  for (const p of d.perks) lis += "<li>" + p + "</li>";
  s4mini.innerHTML =
    '<div class="s4-card__head"><h3 class="s4-card__name">' + d.name + "</h3>" +
    '<p class="s4-card__price">' + d.price + "</p></div>" +
    '<ul class="s4-card__perks">' + lis + "</ul>";
}

function s4ghostCleanup() {
  clearTimeout(s4ghostTimer);
  s4ghostTimer = 0;
  if (s4ghostEl) { s4ghostEl.remove(); s4ghostEl = null; }
  s4mini.style.visibility = "";
}

function s4flyClone(delayMs, slot) {
  // shared-element flight card -> mini slot for the OPEN path. No pre-offset, no
  // return trip: the ghost waits visibly at the source card (where the eye already
  // is), starts only after the frame has opened a gap (delayMs), travels once and
  // lands exactly on the mini box, then swaps with the real mini. The real mini
  // stays hidden until the swap, so nothing ever pops or jumps.
  s4ghostCleanup();
  if (prefersReducedMotion() || !slot || !slot.width) return;
  var src = s4cardEl(s4sel);
  src = src && src.querySelector(".s4-card__head");
  var r1 = src ? src.getBoundingClientRect() : null; // Element: never throws, zeros if detached
  if (!r1 || !r1.width || typeof document.createElement("div").animate !== "function") return;
  var dx = (r1.left + r1.width / 2) - (slot.left + slot.width / 2);
  var dy = (r1.top + r1.height / 2) - (slot.top + slot.height / 2);
  if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return; // already home: nothing to fly
  s4mini.style.visibility = "hidden";
  var g = document.createElement("div");
  g.className = "s4-fly-ghost";
  g.setAttribute("aria-hidden", "true");
  g.innerHTML = s4mini.innerHTML;
  g.style.left = Math.round(slot.left) + "px";
  g.style.top = Math.round(slot.top) + "px";
  g.style.width = Math.round(slot.width) + "px";
  g.style.paddingTop = (s4isMobile() ? 0 : 90) + "px";
  document.body.appendChild(g);
  s4ghostEl = g;
  var landed = false;
  var land = () => { if (landed) return; landed = true; s4ghostCleanup(); };
  try {
    var fly = g.animate(
      [{ transform: "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)" }, { transform: "none" }],
      { duration: 550, delay: delayMs || 0, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "backwards" }
    );
    if (fly && fly.finished) fly.finished.then(land).catch(() => {});
  } catch (e) { land(); return; }
  s4ghostTimer = window.setTimeout(land, (delayMs || 0) + 750); // safety if WAAPI stalls
}

function s4glideMini(dx, delayMs) {
  // switch-while-open only: short directional slide, opacity stays 1.
  // (The open path uses s4flyClone instead — a true shared-element flight.)
  clearTimeout(s4glideTimer);
  s4mini.style.transitionDelay = "";
  dx = Math.max(-160, Math.min(160, Math.round(dx || 0)));
  if (!dx) { s4mini.style.transform = ""; return; }
  s4mini.style.transition = "none";
  s4mini.style.transform = "translateX(" + dx + "px)";
  void s4mini.offsetWidth;
  s4mini.style.transition = "";
  s4mini.style.transitionDelay = (delayMs || 0) + "ms";
  s4mini.style.transform = "";
  s4glideTimer = window.setTimeout(() => { s4mini.style.transitionDelay = ""; }, (delayMs || 0) + 850);
}




function s4ensurePop() {
  if (s4pop.parentElement !== s4cardsBox) s4cardsBox.appendChild(s4pop);
}
function s4focusFirst() {
  const first = s4popForm.querySelector("input");
  if (first) first.focus({ preventScroll: true });
}
function s4openPop(i, btn) {
  var prevSel = s4sel;
  s4ghostCleanup(); // stale flight from an interrupted open, if any
  if (s4sent && s4formHTML) { s4popForm.innerHTML = s4formHTML; s4sent = false; } // next open: clean form again
  s4sel = i;
  s4lastBtn = btn || null;
  s4selectBtns.forEach((b, j) => b.setAttribute("aria-expanded", j === i ? "true" : "false"));
  s4renderMini(i);
  if (s4popOpen) s4glideMini(i > prevSel ? 120 : -120); // switch while open: slide along card order
  const card = s4cardEl(i);
  if (s4isMobile()) {
    // MOB-4-2 overlay: parked over the tapped card slot, covers siblings below.
    s4ensurePop();
    if (s4popOpen) { s4focusFirst(); return; }
    s4popOpen = true;
    s4pop.style.transition = "none";
    s4pop.style.left = "0px";
    s4pop.style.top = "0px"; // across the full cards zone
    s4pop.hidden = false;
    void s4pop.offsetWidth;
    s4pop.style.transition = "";
    // mobile geometry is already final: measure the slot, fly after a beat
    var mslot = null;
    if (!prefersReducedMotion()) {
      var mmr = s4mini.getBoundingClientRect();
      if (mmr.width) mslot = { left: mmr.left, top: mmr.top, width: mmr.width };
    }
    s4flyClone(100, mslot);
    requestAnimationFrame(() => s4pop.classList.add("is-open"));
    s4focusFirst();
    return;
  }
  // DESKTOP-4-2 overlay: block starts from the source card geometry, then expands
  // over the cards zone (nearest positioned ancestor .s4__cards is the
  // containing block, so 0/0/100%/100% land exactly on it).
  s4ensurePop();
  if (s4popOpen) { s4focusFirst(); return; }
  s4popOpen = true;
  const startL = card ? card.offsetLeft : 0;
  const startT = card ? card.offsetTop : 0;
  const startW = card ? card.offsetWidth : 0;
  const startH = card ? card.offsetHeight : 0;
  s4pop.style.transition = "none";
  s4pop.style.left = startL + "px";
  s4pop.style.top = startT + "px";
  s4pop.style.width = startW + "px";
  s4pop.style.height = startH + "px";
  s4pop.hidden = false;
  void s4pop.offsetWidth; // reflow: pin the start geometry
  // final slot rect for the ghost flight: jump to end geometry with transitions off
  // (no paint in between), measure, jump back — all pre-paint, invisible.
  var dslot = null;
  if (!prefersReducedMotion()) {
    s4pop.style.left = "0px";
    s4pop.style.top = "0px";
    s4pop.style.width = "100%";
    s4pop.style.height = "100%";
    void s4pop.offsetWidth;
    var dmr = s4mini.getBoundingClientRect();
    if (dmr.width) dslot = { left: dmr.left, top: dmr.top, width: dmr.width };
    s4pop.style.left = startL + "px";
    s4pop.style.top = startT + "px";
    s4pop.style.width = startW + "px";
    s4pop.style.height = startH + "px";
    void s4pop.offsetWidth;
  }
  s4pop.style.transition = "";
  s4pop.style.left = "0px";
  s4pop.style.top = "0px";
  s4pop.style.width = "100%";
  s4pop.style.height = "100%";
  s4flyClone(650, dslot);
  requestAnimationFrame(() => s4pop.classList.add("is-open")); // form stagger: delay i*0.08s in CSS
  s4focusFirst();
}

function s4closePop(restoreFocus) {
  if (!s4popOpen) return;
  s4popOpen = false;
  s4ghostCleanup(); // kill a mid-flight ghost, if the user closed early
  s4selectBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));
  s4pop.classList.remove("is-open");
  const card = s4cardEl(s4sel);
  if (card && !s4isMobile()) {
    // desktop reverse: collapse back to its own card
    s4pop.style.left = card.offsetLeft + "px";
    s4pop.style.top = card.offsetTop + "px";
    s4pop.style.width = card.offsetWidth + "px";
    s4pop.style.height = card.offsetHeight + "px";
  }
  if (card) card.classList.remove("is-open");
  s4sel = -1;
  // reverse of the staged open: the card restores only after the 0.8s collapse flight
  clearTimeout(s4prepTimer);
  if (card) {
    if (prefersReducedMotion()) card.classList.remove("is-leaving");
    else s4prepTimer = window.setTimeout(() => card.classList.remove("is-leaving"), 800);
  }
  window.setTimeout(() => {
    if (s4popOpen) return;
    s4pop.hidden = true;
    s4pop.style.left = "";
    s4pop.style.top = "";
    s4pop.style.width = "";
    s4pop.style.height = "";
    if (s4pop.parentElement !== s4cardsBox) s4cardsBox.appendChild(s4pop);
  }, 820); // matches the 0.8s FLIP flight in CSS (was 500 for the old 0.5s flight)
  if (restoreFocus && s4lastBtn) s4lastBtn.focus({ preventScroll: true });
  s4lastBtn = null;
}

s4selectBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const i = parseInt(btn.getAttribute("data-select"), 10) || 0;
    if (s4popOpen && s4sel === i) return; // repeat click — no-op, close only via ✕/Escape
    if (s4popOpen || prefersReducedMotion()) { s4openPop(i, btn); return; } // switch + RM: no staged pause
    // staged open: 1) card settles (button fades, info slides down),
    // 2) popup flies after 350ms. Repeat click cancels the previous staging.
    clearTimeout(s4prepTimer);
    Array.from(s4cardsBox.querySelectorAll(".s4-card.is-leaving")).forEach((c) => c.classList.remove("is-leaving"));
    const card = s4cardEl(i);
    if (card) card.classList.add("is-leaving");
    s4prepTimer = window.setTimeout(() => {
      // in the in-flow world there is nowhere to leave: staging always plays out
      s4openPop(i, btn);
    }, 350);
  });
});
s4popX.addEventListener("click", () => s4closePop(true));
// Click outside the popup does NOT close — no document listener by design.
s4popForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (s4sent || s4sending) return;
  const bad = s4markForm();
  if (bad) { bad.focus({ preventScroll: true }); return; }
  const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const payload = {
    name: val("s4p-name"),
    email: val("s4p-email"),
    website: val("s4p-website"),
    phone: val("s4p-phone"),
    package: (() => { const d = S4_DATA[s4sel]; return d ? (d.name + " - " + String(d.price).replace(/<[^>]*>/g, "")).slice(0, 200) : ""; })(),
  };
  const btn = s4popForm.querySelector(".s4-form__submit");
  const prevLabel = btn ? btn.textContent : "";
  if (btn) { btn.disabled = true; btn.classList.add("is-sending"); btn.textContent = "SENDING..."; }
  const oldErr = s4popForm.querySelector(".s4-form__error");
  if (oldErr) oldErr.remove();
  s4sending = true;
  fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then(async (r) => {
      let j = null;
      try { j = await r.json(); } catch (err) {}
      if (!r.ok || !j || j.ok !== true) throw new Error("lead");
      s4sending = false;
      s4sent = true;
      s4popForm.innerHTML = '<p class="s4-form__ok">Your request has been sent, we will contact you</p><button class="s4-form__submit" type="button" id="s4okClose">Close</button>';
      const cb = document.getElementById("s4okClose");
      if (cb) {
        cb.addEventListener("click", () => { s4closePanel(); s4closePop(true); }); // panel guard no-ops when s4open=false — pop must still close
        cb.focus({ preventScroll: true });
      }
    })
    .catch(() => {
      s4sending = false;
      if (btn && btn.isConnected) { btn.disabled = false; btn.classList.remove("is-sending"); btn.textContent = prevLabel || "BECOME A SPONSOR"; }
      if (!s4popForm.querySelector(".s4-form__error")) {
        const p = document.createElement("p");
        p.className = "s4-form__error";
        p.setAttribute("role", "alert");
        p.textContent = "Something went wrong, please try again";
        const nb = s4popForm.querySelector(".s4-form__submit");
        if (nb && nb.parentNode) nb.parentNode.insertBefore(p, nb.nextSibling);
        else s4popForm.appendChild(p);
      }
    });
});
function s4fieldBad(el) {
  const v = el.value.trim();
  if (!v) return true;
  if (el.type === "email") return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return false;
}
function s4markForm() {
  const inputs = Array.from(s4popForm.querySelectorAll("input"));
  let firstBad = null;
  inputs.forEach((el) => {
    const bad = s4fieldBad(el);
    el.classList.toggle("is-err", bad);
    el.setAttribute("aria-invalid", bad);
    if (!el.hasAttribute("aria-describedby")) { // no error text in the design: describe via the existing label
      const lb = s4popForm.querySelector('label[for="' + el.id + '"]');
      if (lb) {
        if (!lb.id) lb.id = el.id + "-lbl";
        el.setAttribute("aria-describedby", lb.id);
      }
    }
    if (bad && !firstBad) firstBad = el;
  });
  return firstBad;
}
s4popForm.addEventListener("input", (e) => {
  if (e.target && e.target.matches("input")) {
    const bad = s4fieldBad(e.target);
    e.target.classList.toggle("is-err", bad);
    e.target.setAttribute("aria-invalid", bad);
  }
});
s4popForm.addEventListener("focusout", (e) => {
  if (e.target && e.target.matches("input") && e.target.value.trim() !== "") {
    const bad = s4fieldBad(e.target);
    e.target.classList.toggle("is-err", bad);
    e.target.setAttribute("aria-invalid", bad);
  }
});
// Popup survives the keyboard: close only on width/mode change
// (rotation, resize) — keyboard height ignored.
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  if (s4popOpen && w !== s4lastW) s4closePop(false);
  s4lastW = w;
});
