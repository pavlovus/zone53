# Zone53 — static landing (handoff package)

Static single-page landing. No build step, no framework, no backend except one serverless lead endpoint. Open `index.html` from any static host.

## Structure

```
index.html            markup, content, ?v= pinned asset URLs
styles.css            all styles (current ?v=166)
main.js               scroll engine, collapse trigger, reveals, forms, video (current ?v=99)
assets/               webp images (desktop + -m mobile), video.mp4, video-poster.webp, fonts/
assets/fonts/         Druk-Heavy-subset.woff2 (?v=7), HelveticaNeueCyr {Bold,Roman,Light,Italic} woff2+ttf
functions/api/lead.js Cloudflare Pages Function, POST /api/lead
```

## Hosting neutrality

The site is plain static and runs on any static host. Exception: `functions/api/lead.js` is a Cloudflare Pages Function.

- Contract: `POST /api/lead` with JSON body `{name, email, website, phone, package}` (all strings, required, max 200 chars each, body max 4096 bytes, content-type must be `application/json`).
- Success: `{ok:true}` (200). Errors: `{ok:false, error:<code>}` (`bad_content_type` 415, `bad_json`/`empty`/`bad_<field>` 400, `too_long_<field>` 400, `too_large` 413, `not_configured` 500, `telegram_unreachable`/`telegram_error` 502).
- Server forwards the lead via Telegram `sendMessage` (parse_mode HTML, field values HTML-escaped). Required env vars (names only): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- On any other stack, implement `POST /api/lead` with the same contract yourself; the frontend (`main.js`, `fetch("/api/lead", ...)`) expects exactly this shape.

## Locked scroll engine (do not "fix")

- Sequence: hero flight (scenes 1-2A, one-camera) -> fullscreen blackout veil -> interior photo push-in (1.2x over 1.5 s, runs under the blackout) -> collapse trigger (C2, 1.1 s each direction) -> `body.native`, sections 2-3 flow natively.
- After collapse finishes the scroll lock releases (`body.native`). Scroll-up at the very top of the native page re-locks and reverses the collapse (`autoBack` flag); any downward scroll cancels `autoBack`.
- Scroll math is driven by explicit scroll-position checks in `main.js`. This is intentional. Do not replace with IntersectionObserver, do not "simplify" the phase gating.
- `data-phase` on `.viewport`: hero is hidden until the first `applyFrame` sets it (first-paint anti-flash, see quirks). `data-phase="two"` swaps scene one out and the collapse scene in.

## C2 collapse geometry

- Live-measured custom properties on `.c2`: `--h1h` / `--h2h` (headline heights, refit by JS), `--gapT` / `--gapB` (photo-to-headline gaps; 20 px desktop, 14 px mobile).
- `--c2vh` is set once per width change (JS) and frozen against toolbar/keyboard height changes.
- Collapse progress `--c2-p` (0->1) drives: top headline `top: calc((var(--h1h) + var(--gapT)) * var(--c2-p))`, photo height `calc(var(--c2vh) - (var(--h1h) + var(--h2h) + var(--gapT) + var(--gapB)) * var(--c2-p))`, bottom headline pinned to the viewport bottom minus `--h2h * --c2-p`.
- Preload + GPU-decode the interior photo before the collapse is allowed (`interiorReady` gate in `main.js`).

## Breakpoint

- 600 px, in both CSS (`@media (max-width:600px)`, preload `media="(max-width:600px)"` / `(min-width:601px)`) and JS (`MOBILE_MAX_W = 600`). Mobile uses dedicated `-m` compositions (house-m, sky-m, interior-m). Keep the two in sync.

## Anti-stale rule (?v=)

- Every cacheable URL carries `?v=<n>` (css, js, fonts, images, poster). Current pins: `styles.css?v=166`, `main.js?v=99`, `Druk-Heavy-subset.woff2?v=7`, Helvetica woff2 `?v=1`, house/sky/interior `?v=12` (desktop), house-m `?v=1`, sky-m `?v=2`, interior-m `?v=3`, video-poster `?v=1`. `video.mp4` is loaded from JS without a pin.
- Bump the pin on EVERY css/js/font/image edit, otherwise returning visitors get stale assets.

## Video

- `assets/video.mp4` (faststart required for progressive playback) with `assets/video-poster.webp` poster. Click on `#videoPlay` creates a `<video>` element inline (`playsInline = true`), adds `.video--playing`, focuses the element (preventScroll). No auto-fullscreen; fullscreen is manual only (native controls / double-click).

## Forms

- Lead popup `#s4pop`: fields name/email/website/phone + package from the selected tariff card (`S4_DATA`, `data-select`). Client validation marks `aria-invalid`, blocks submit while a request is in flight (`s4sending`), restores a clean form snapshot on next open. On success the form contents are replaced by the success state until next open (`s4sent`); network/validation errors surface inline without navigation.

## Known quirks

- First paint: `.viewport:not([data-phase]) .scene--one` is `visibility:hidden` until the first `applyFrame`. A no-JS client sees no hero. Intentional anti-flash.
- Ribbon baseline: `.ribbon > span` carries a `translateY(4px)` tuning (desktop) / `translateY(-2px)` at 54 px; do not "center" it without visual sign-off.
- `body.native .scene--collapse` becomes `position:relative; height:var(--c2vh)` — it stays in normal flow after unlock.
- `overflow:hidden` on the tariff grid clips the FLIP stagger; reveal animations (`.rv`, one-way `ribbonsCheck`/`revealsCheck`) re-fire on resize but never un-reveal.
