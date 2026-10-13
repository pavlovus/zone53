# ZONE 53 — Full Architecture Context & Single Source of Truth (SSOT)

> **Document Status**: Active / Single Source of Truth for AI Agents and Developers  
> **Target Audience**: AI Coding Assistants, Core Engineers, DevOps  
> **Scope**: Essence, System Architecture, Monorepo Boundaries, Data Flow, Security, and Engineering Standards. (UI design specs and styling minutiae are deliberately excluded).

---

## 1. Project Essence & Business Domain

### 1.1 What is ZONE 53?
**ZONE 53** is the world's first **AR-Robotics lab and hardware startup hangar**, physically located near **Warsaw, Poland**.

* **Ecosystem Provenance**: ZONE 53 is the flagship initiative of **Epikor** ([epikor.eu](https://epikor.eu/)) and the permanent physical continuation of the **Alien Bazaar** hardware hackathon movement ([alienbazaar.com](https://www.alienbazaar.com/)).
* **Core Philosophy**:
  > *"The robot is the next personal computer, and AR is its keyboard and mouse. Instead of a screen and a cursor, the computer acts in the physical world, directed by gesture or voice."*
* **World Lore & Narrative Foundation**:
  * In the Epikor universe, Zone 53 is the classified skunkworks lab where breakthrough technologies are born (including the iconic *Mask* and integrated robot clusters).
  * Historically and narratively, this single physical hangar in the fields near Warsaw serves as the genesis ground zero for the future development of the city of **Herma**.
* **Atmospheric Tone & Identity**:
  * **Classified Skunkworks Persona**: High-clearance, secretive, exclusive atmosphere where cutting-edge technology is forged behind closed hangar doors, balanced with clear, compelling vision for qualified sponsors.
  * **Visual Anchors**: The actual physical hangar photograph (`house.webp`) is a mandatory, non-negotiable core visual artifact representing real-world hardware reality.
  * **Color Symbolism**: Dominant Deep Black represents the classified, uncharted frontier; High-contrast White denotes structural precision; Epikor Signature Yellow (`#ffcc01`) signals the technological pulse and catalyst.

ZONE 53 gathers global deep-tech founders, engineers, and robotics teams under one roof with state-of-the-art testing grounds, prototyping equipment, and shared infrastructure.

### 1.2 Target Audience & Value Proposition
The primary target audience is **technology investors, venture capital funds, angel syndicates, and strategic industrial corporate partners**.

#### Replaced Tariff Model
* **Old legacy tariffs** (monthly SaaS subscriptions: $1,500 / $3,000 / $7,500) **are deprecated and excluded**.
* **New core focus**: Direct investment, strategic partnerships, and hangar residency.
* **Investor & Partner Benefits** (standardized from the enterprise tier):
  1. **Direct Access to Founders**: Exclusive communications with all resident hardware/robotics startups.
  2. **24/7 Physical Hangar Access**: Dedicated access to the lab facility, prototyping areas, and testing zones near Warsaw.
  3. **Closed Deep-Tech Events**: High-profile demos, invite-only showcases, unreleased technology previews.
  4. **Co-Hosting Events**: Right to host and organise specialized technology/partner events on-site.
  5. **Closed Media Channels**: Proprietary updates, investment decks, progress metrics, and insider reports.
  6. **Talent Pipeline**: Scouting and recruiting top hardware and robotics engineers.
  7. **R&D & Business Integration**: Direct advisory and engineering support to implement AR and robotics into corporate operations.
  8. **GTM & EU Expansion**: Comprehensive go-to-market and regulatory support across Poland and the European Union.

---

## 2. System Architecture & Monorepo Structure

The repository is structured as a clean, decoupled monorepo:

```
zone53/
├── frontend/             # React 19 + React Router v7 (Vite) + Tailwind CSS v4
│   ├── app/
│   │   ├── routes/       # File-based / config-based route definitions
│   │   ├── root.tsx      # Root document, HTML shell, meta tags, fonts
│   │   └── app.css       # Tailwind v4 import & theme tokens
│   ├── public/           # Static assets, fonts, icons, robots.txt, sitemap.xml
│   ├── server.js         # Production Express SSR server + static file server
│   ├── react-router.config.ts  # Hybrid config: ssr: true, prerender: ["/"]
│   ├── vite.config.ts    # Vite 6 config with @tailwindcss/vite
│   └── package.json
│
├── backend/              # Stateless Node.js / Express 5 API Service
│   ├── src/
│   │   └── index.ts      # Server harness, rate limiter, validation, routes
│   ├── .env.example      # Environment variables template
│   ├── tsconfig.json     # NodeNext TypeScript config
│   └── package.json
│
├── legacy/               # Deprecated handoff code (READ-ONLY REFERENCE)
│   ├── assets/           # Source brand assets (SVG logo, webp renders, video)
│   └── README.md         # Reference documentation
│
└── FULL_CONTEXT.md       # THIS DOCUMENT (SSOT)
```

---

## 3. Frontend Architecture (`frontend/`)

### 3.1 Technology Stack
* **Framework**: React 19, React Router v7 in Framework Mode (powered by Vite 6).
* **Language**: TypeScript 5.8+ (strict mode).
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`).
* **Runtime / SSR**: Node.js via custom lightweight Express server (`server.js`).
* **Language**: **English (`en`) only**. No multi-language i18n overhead.

### 3.2 Hybrid Rendering Model (SSG + SSR)
1. **Static Site Generation (SSG)**:
   * Configured via `react-router.config.ts`:
     ```ts
     export default {
       ssr: true,
       async prerender() {
         return ["/", "/privacy", "/terms"];
       },
     } satisfies Config;
     ```
   * Build output emits fully pre-rendered HTML to `build/client/index.html`.
   * **SEO Benefits**: Search crawlers (Google, Bing) and social preview bots (LinkedIn, X, Telegram) receive complete semantic HTML with $0\text{ ms}$ rendering delay.
2. **Server-Side Rendering (SSR)**:
   * Managed by `frontend/server.js` using `@react-router/express`.
   * Serves static pre-rendered pages with high cache headers, while gracefully routing any dynamic queries or runtime server actions through React Router's request handler.

### 3.3 Routing Inventory
* `/` — Comprehensive investor landing page (Hero, Lab Mission, Hangar Infrastructure, Resident Ecosystem, Partner Benefits, Video showcase, and Investment Modal).
* `/privacy` — Privacy Policy (SSG pre-rendered).
* `/terms` — Terms of Collaboration (SSG pre-rendered).

---

## 4. Backend Architecture (`backend/`)

### 4.1 Responsibility & Stateless Principle
* **Stateless API Gateway**: The backend has **zero database dependencies**.
* **Primary Responsibility**:
  1. Receive incoming investment and partnership inquiries.
  2. Enforce strict schema validation and sanitization.
  3. Apply IP-based rate limiting and bot honeypot filtering.
  4. Format and dispatch notifications to the team's private Telegram channel/group via the Telegram Bot API.

### 4.2 Technology Stack
* **Runtime**: Node.js 22+ (ES Modules, `"type": "module"`).
* **Framework**: Express 5.
* **Language**: TypeScript 5.8+ with NodeNext module resolution.
* **Dev Runtime**: `tsx watch` for instant compilation.

---

## 5. Data Contracts & Lead Submission Pipeline

### 5.1 Endpoint Specification
* **Path**: `POST /api/lead`
* **Content-Type**: `application/json; charset=utf-8`
* **Payload Constraints**: Maximum request body size: 10 KB.

### 5.2 Lead Data Model
| Field | Type | Required | Constraints & Description |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | 2–100 characters. Sanitized text. |
| `email` | string | **Yes** | Valid RFC 5322 email format. |
| `phone` | string | **Yes** | 7–50 characters, international format or handle. |
| `investment_amount` | string | **Yes** | Planned investment ticket or capital range. |
| `website` | string | No | Optional company / fund / personal profile URL (max 150 chars). |
| `comment` | string | No | Optional notes, questions, or collaboration goals (max 1000 chars). |
| `hp_field` / `trap_website` | string | No | **Honeypot field**. Must be completely empty. If present, silently accept with fake 200 without triggering Telegram. |

### 5.3 Response Codes
* `200 OK`: `{ "ok": true, "message": "Inquiry received" }`
* `400 Bad Request`: `{ "ok": false, "error": "validation_error", "details": [...] }`
* `413 Payload Too Large`: `{ "ok": false, "error": "payload_too_large" }`
* `415 Unsupported Media Type`: `{ "ok": false, "error": "unsupported_media_type" }`
* `429 Too Many Requests`: `{ "ok": false, "error": "rate_limit_exceeded" }`
* `500 Internal Server Error`: `{ "ok": false, "error": "server_misconfigured" }`
* `502 Bad Gateway`: `{ "ok": false, "error": "telegram_dispatch_failed" }`

### 5.4 Telegram Notification Format
Incoming leads are dispatched to the configured Telegram chat as formatted HTML:

```html
🚀 <b>NEW INVESTOR INQUIRY — ZONE 53</b>

👤 <b>Name:</b> {name}
✉️ <b>Email:</b> {email}
📞 <b>Phone:</b> {phone}
🌐 <b>Website:</b> {website || "Not provided"}
💰 <b>Investment Amount:</b> {investment_amount}
📝 <b>Comment:</b> {comment || "None provided"}

————————————
⏱ <b>Timestamp:</b> {2026-10-13 02:15:00 UTC}
🌐 <b>Client IP:</b> {ip}
🖥 <b>User-Agent:</b> {userAgent}
<i>Source: zone53.eu</i>
```

All dynamic values MUST be strictly HTML-escaped (`&`, `<`, `>`, `"`) prior to payload construction to prevent injection.

---

## 6. Security, Anti-Abuse & Robustness

1. **Schema Validation**:
   * Powered by **Zod** on the backend. No untyped or unverified properties pass into execution.
2. **Rate Limiting**:
   * Implemented via `express-rate-limit`: max 5 requests per 15-minute window per IP for `/api/lead`.
3. **Honeypot Technique**:
   * Frontend includes a hidden form input (`name="company_tax_id"` or `hp_field`) visually concealed via CSS (`opacity: 0; pointer-events: none; position: absolute;`).
   * Automated bots filling all fields will populate this input; backend drops or mocks a fake 200 without triggering Telegram.
4. **CORS Restrictions**:
   * Backend restricts `Access-Control-Allow-Origin` strictly to the verified frontend domain (`FRONTEND_URL`).
5. **Environment Variable Isolation**:
   * Telegram credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) remain exclusively on the backend. They are NEVER exposed to client bundles.

---

## 7. Deployment & Hosting Strategy

The system is designed to be **hosting-agnostic and cloud-ready**:

* **Containerization**:
  * Frontend and Backend each maintain minimal, production-ready `Dockerfile` configurations.
  * Can be orchestrated via `docker-compose` on any standard VPS (Hetzner, DigitalOcean, AWS EC2) behind an Nginx or Caddy reverse proxy.
* **PaaS Option**:
  * Frontend can be deployed as an SSR Web Service (e.g. Render, Railway, Fly.io).
  * Backend can be deployed as a decoupled Node.js API Service.
* **Static Edge Option**:
  * Since the frontend pre-renders all primary routes (`/`, `/privacy`, `/terms`) into `build/client`, the static directory can alternatively be deployed directly to Cloudflare Pages or Vercel, with `/api/lead` pointing to the backend host.

---

## 8. Development & Contribution Rules for AI Agents

1. **Single Source of Truth**:
   * Whenever architectural decisions, route names, or API contracts are modified, `FULL_CONTEXT.md` MUST be updated first.
2. **Monorepo Boundary Integrity**:
   * `frontend/` must never directly import files from `backend/` or `legacy/`.
   * Asset migrations from `legacy/assets/` must be copied into `frontend/public/` or `frontend/app/assets/`.
3. **TypeScript Strictness**:
   * No `any` types in data models or API handlers.
   * `npm run typecheck` and `npm run build` must succeed without errors in both `frontend` and `backend`.
4. **Preserve Legacy Immutability**:
   * Directory `legacy/` is an archived reference. Do NOT alter, refactor, or delete files inside `legacy/`.
