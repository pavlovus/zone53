<div align="center">

# ⚠️ ZONE 53 // CLASSIFIED PROVING GROUNDS
### Europe's Flagship Robotics & AR Hangar Laboratory // Warsaw, Poland

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Express](https://img.shields.io/badge/Express-5.0-black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

<p align="center">
  <b>"The robot is the next personal computer, and AR is its keyboard and mouse."</b><br/>
  <i>1,200 m² physical proving grounds for unreleased autonomous hardware, neural perception, and spatial robotics.</i>
</p>

[Quickstart](#-quickstart--local-development) • [Mission](#-project-essence--mission) • [Architecture](#-system-architecture) • [Directory Structure](#-repository-directory-structure) • [Tech Stack](#-technology-stack) • [API & Telegram](#-data-contracts--api-pipeline) • [Security](#-security--anti-abuse) • [Deployment](#-deployment--docker)

---

</div>

## 🚀 Quickstart & Local Development

### 1. Prerequisites
* **Node.js**: `v22.x` or higher (LTS recommended)
* **npm**: `v10.x` or higher
* **Docker & Docker Compose** (optional, for containerized local execution)

### 2. Clone Repository
```bash
git clone https://github.com/pavlovus/zone53.git
cd zone53
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create local environment config
cp .env.example .env
```

Edit `backend/.env` with your Telegram credentials:
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173,http://localhost:3000

# Telegram Bot Setup
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID=-1001234567890
```

Start backend development server:
```bash
npm run dev
# Server running at http://localhost:4000
```

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install

# Start Vite dev server with HMR and /api proxy
npm run dev
# Frontend running at http://localhost:5173
```

> **Note on Local Proxying**: During development, `frontend/vite.config.ts` automatically proxies all requests matching `/api/*` to `http://localhost:4000`, matching production architecture with zero CORS complications.

---

## 📌 Project Essence & Mission

**ZONE 53** is the world's first **Robotics & AR proving hangar**, situated near **Warsaw, Poland**.

* **Ecosystem Provenance**: ZONE 53 is the flagship initiative of **Epikor** ([epikor.eu](https://epikor.eu/)) and the permanent physical realization of the **Alien Bazaar** hardware movement ([alienbazaar.com](https://www.alienbazaar.com/)).
* **Core Paradigm**: Traditional computers act behind glass screens. In ZONE 53, computers interact physically with the real world, directed through spatial augmented reality, voice, and multimodal neural interfaces.
* **World Lore**: Serving as the classified skunkworks lab where breakthrough technologies are forged, the Warsaw hangar grounds represent ground zero for resident robotics startups and institutional partners.
* **Target Audience**: Venture capital syndicates, angel networks, deep-tech investors, and industrial corporate partners seeking direct residency, physical proving grounds, and strategic co-development.

---

## 🏗 System Architecture

The project is structured as a **strictly decoupled, high-performance monorepo**:

```
                                  ┌──────────────────────────────┐
                                  │   Browser / Mobile Client    │
                                  └──────────────┬───────────────┘
                                                 │
                                                 │ HTTPS / Web Traffic
                                                 ▼
                  ┌─────────────────────────────────────────────────────────────┐
                  │                 Reverse Proxy / Cloud Edge                  │
                  │             (Nginx / Caddy / Cloudflare / Docker)           │
                  └──────────────┬───────────────────────────────┬──────────────┘
                                 │                               │
                      /* (SSR / SSG HTML & Assets)      /api/* (Forwarded)
                                 │                               │
                                 ▼                               ▼
                 ┌───────────────────────────────┐ ┌───────────────────────────┐
                 │     Frontend Service (3000)   │ │   Backend API Service (4000)│
                 │ ───────────────────────────── │ │ ───────────────────────── │
                 │ • React 19 + RRv7 (Vite 6)    │ │ • Express 5 (Stateless)   │
                 │ • Tailwind CSS v4             │ │ • Zod Schema Validation   │
                 │ • WebGL Wavy Grid Shader      │ │ • IP Rate Limiting (5/15m)│
                 │ • SSG Pre-render (0ms TTFB)   │ │ • Bot Honeypot Detection  │
                 │ • Production SSR server.js    │ │ • Error/Security Handlers │
                 └───────────────────────────────┘ └─────────────┬─────────────┘
                                                                 │
                                                                 │ Telegram Bot API (HTTPS)
                                                                 ▼
                                                  ┌────────────────────────────┐
                                                  │ Private Telegram Channel   │
                                                  │ (Investor Lead Telemetry)  │
                                                  └────────────────────────────┘
```

### Architectural Principles:
1. **Zero Database Dependencies**: The backend operates as a **strictly stateless** telemetry gateway. Inquiries are validated, anti-abuse checks are performed, and leads are immediately dispatched via the Telegram Bot API.
2. **Credential Isolation**: Telegram bot secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) exist **only** within the backend environment and are never leaked to client bundles.
3. **Decoupled Boundary**: Frontend and backend run independently in Docker containers and communicate via standardized HTTP JSON contracts.

---

## 📂 Repository Directory Structure

```
zone53/
├── frontend/                     # High-performance client & SSR service
│   ├── app/
│   │   ├── components/
│   │   │   ├── dossier/          # Top-Secret Investor Clearance modal
│   │   │   ├── sections/         # Hero, Manifesto, Facility, Privileges, Ecosystem, Footer
│   │   │   ├── ui/               # Tactical buttons, telemetry badges, status HUDs
│   │   │   └── webgl/            # Interactive Three.js/WebGL background shader
│   │   ├── routes/
│   │   │   └── home.tsx          # Landing page, SEO meta, JSON-LD structured data
│   │   ├── root.tsx              # HTML shell, preloaded typography, manifests, favicons
│   │   └── app.css               # Tailwind CSS v4 directives & custom tactical styling
│   ├── public/
│   │   ├── fonts/                # Druk Heavy & Helvetica Neue subsets (WOFF2)
│   │   ├── media/                # Warsaw sky/hangar renders (WebP) & audio assets
│   │   ├── robots.txt            # Search engine directives & sitemap reference
│   │   ├── sitemap.xml           # XML sitemap with Google Image Schema extensions
│   │   └── site.webmanifest      # PWA application manifest
│   ├── react-router.config.ts    # SSG config (prerenders "/" into static HTML)
│   ├── vite.config.ts            # Vite 6 config with /api proxy to backend (port 4000)
│   ├── server.js                 # Express 5 production SSR server & /api relay
│   ├── Dockerfile                # Multi-stage production container build
│   └── package.json
│
├── backend/                      # Stateless telemetry API service
│   ├── src/
│   │   ├── config/env.ts         # Zod-validated environment config
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts   # Express 5 error handling & payload size limits
│   │   │   ├── rateLimiter.ts    # Strict IP rate limiting (5 req / 15 min)
│   │   │   └── security.ts       # Content-Type verification & request sanitizer
│   │   ├── routes/
│   │   │   ├── health.route.ts   # GET /health liveness probe
│   │   │   └── lead.route.ts     # POST /api/lead inquiry processor
│   │   ├── schemas/lead.schema.ts# Strict Zod validation & honeypot trapping
│   │   ├── services/
│   │   │   └── telegram.service.ts# HTML telemetry message formatting & Telegram relay
│   │   ├── app.ts                # Express application factory & CORS configuration
│   │   └── index.ts              # Server lifecycle & graceful shutdown
│   ├── tests/
│   │   ├── health.test.ts        # Health check integration tests
│   │   └── lead.test.ts          # Lead pipeline integration tests (11 assertions)
│   ├── Dockerfile                # Lightweight multi-stage Node 22 Alpine container
│   ├── tsconfig.json             # TypeScript NodeNext strict configuration
│   └── package.json
│
├── docker-compose.yml            # Multi-container orchestration (Frontend + Backend)
├── FULL_CONTEXT.md               # Architecture Context & Single Source of Truth
└── README.md                     # Comprehensive project documentation (this file)
```

---

## ⚡️ Technology Stack

| Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | [React](https://react.dev/) | 19.2+ | Modern reactive component architecture |
| **Framework** | [React Router](https://reactrouter.com/) | v7.4+ | Framework mode with Vite and SSG pre-rendering |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | v4.2+ | Modern utility styling via `@tailwindcss/vite` |
| **Graphics** | [Three.js](https://threejs.org/) | 0.186+ | Custom WebGL interactive wavy grid shader |
| **Frontend SSR** | [Express](https://expressjs.com/) | 5.3+ | Hybrid SSR server + static file delivery |
| **Backend API** | [Express](https://expressjs.com/) | 5.0+ | Lightweight, stateless Node.js HTTP server |
| **Validation** | [Zod](https://zod.dev/) | 4.6+ | Runtime type validation for API payloads & env vars |
| **Rate Limiter** | [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | 8.7+ | IP-based request throttling against abuse |
| **Testing** | [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest) | 5.0+ | Fast integration & unit testing |
| **DevOps** | [Docker](https://www.docker.com/) & Compose | Multi-stage | Isolated Alpine Linux containerization |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.8+ | End-to-end type safety across the monorepo |

---

## 📡 Data Contracts & API Pipeline

### 1. Lead Submission: `POST /api/lead`

* **Endpoint**: `/api/lead`
* **Content-Type**: `application/json; charset=utf-8`
* **Body Size Limit**: `10 KB`

#### Request Payload:
```json
{
  "name": "Alexander Vance",
  "email": "a.vance@blackmesa-ventures.com",
  "phone": "+48 22 555 0199",
  "investment_amount": "$500,000 — Strategic Partner",
  "website": "https://blackmesa-ventures.com",
  "comment": "Interested in 24/7 hangar residency and robotics testing grounds.",
  "company_tax_id": ""
}
```

#### Field Specifications:
| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | 2–100 chars | Sanitized investor / representative name |
| `email` | `string` | **Yes** | Valid email | Official contact email address |
| `phone` | `string` | **Yes** | 7–50 chars | International format or contact handle |
| `investment_amount` | `string` | **Yes** | Non-empty | Target capital ticket or investment scope |
| `website` | `string` | No | URL (max 150) | Optional fund / corporate website URL |
| `comment` | `string` | No | Max 1000 chars | Additional context or inquiries |
| `company_tax_id` | `string` | No | Must be empty | **Honeypot field**. Triggers silent fake 200 if filled |

#### Response Codes:
| Status | Code | Description |
| :--- | :--- | :--- |
| `200 OK` | `inquiry_received` | Lead successfully validated and dispatched |
| `400 Bad Request` | `validation_error` | Zod validation failure (returns details array) |
| `413 Payload Too Large` | `payload_too_large` | Request payload exceeds 10 KB limit |
| `415 Unsupported Media` | `unsupported_media_type`| Content-Type is not `application/json` |
| `429 Too Many Requests` | `rate_limit_exceeded` | IP sent > 5 requests within 15 minutes |
| `500 Server Error` | `server_misconfigured` | Telegram credentials missing on server |
| `502 Bad Gateway` | `telegram_dispatch_failed` | Telegram Bot API rejected or timed out |

---

### 2. Telegram Telemetry Notification Preview

Upon receiving a valid lead, the backend dispatches formatted, injection-safe HTML directly to the private Telegram channel:

```
🚀 NEW INVESTOR INQUIRY — ZONE 53

👤 Name: Alexander Vance
✉️ Email: a.vance@blackmesa-ventures.com
📞 Phone: +48 22 555 0199
🌐 Website: https://blackmesa-ventures.com
💰 Investment Amount: $500,000 — Strategic Partner
📝 Comment: Interested in 24/7 hangar residency and robotics testing grounds.

————————————
⏱ Timestamp: 2026-10-13 02:45:12 UTC
🌐 Client IP: 194.29.130.4
🖥 User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...
Source: zone53.com
```

### 3. Health Check: `GET /health`
* **Response**:
```json
{
  "status": "healthy",
  "uptime": 1420.5,
  "timestamp": "2026-10-13T02:45:12.000Z",
  "environment": "production"
}
```

---

## 🔒 Security & Anti-Abuse

1. **Runtime Type Verification**: Every incoming payload is parsed strictly through **Zod schemas**. Malformed data and unrecognized fields are rejected immediately.
2. **IP Rate Limiting**: Managed by `express-rate-limit`. Restricted to **5 submissions per 15-minute window per IP**.
3. **Bot Honeypot Trapping**: Forms contain concealed fields (`company_tax_id`, `trap_website`). Bots that blindly fill inputs trigger an immediate silent `200 OK` without wasting Telegram API quotas.
4. **HTML Escape Protection**: All fields are strictly sanitized (`&`, `<`, `>`, `"`) before building Telegram payloads to eliminate HTML injection attacks.
5. **Secure Reverse Proxy IP Resolution**: Native Express `req.ip` coupled with `app.set("trust proxy", 1)` prevents client IP spoofing via crafted headers.
6. **Graceful Shutdown**: The backend listens for `SIGTERM` and `SIGINT`, terminating keep-alive connections cleanly before exiting.

---

## 🔍 SEO, Discoverability & PWA

ZONE 53 features an **institutional-grade SEO suite**:

* **Schema.org Structured Data (JSON-LD)**:
  * `ResearchOrganization`: Establishes the ZONE 53 brand, logo, and links to Epikor (`epikor.eu`) and Alien Bazaar.
  * `Place`: Registers physical Warsaw hangar facility coordinates (`52.2297°N, 21.0122°E`) and 1,200 m² scale to boost local Polish and European search indexing.
  * `WebSite`: Canonical search context mapping.
* **Social Previews (Open Graph & Twitter Cards)**:
  * Full-resolution 1080p preview graphics (`og:image:width: 1920`, `og:image:height: 1080`).
  * Absolute URLs for reliable link rendering in Telegram, WhatsApp, LinkedIn, and Twitter/X.
* **Search Engine Controls**:
  * `<link rel="canonical" href="https://zone53.com/" />` to avoid duplicate content penalties.
  * `max-image-preview:large` and `max-snippet:-1` to optimize for **Google Discover** and Rich Snippets.
* **Image-Enriched Sitemap**:
  * [`frontend/public/sitemap.xml`](file:///Users/pavlovus/Desktop/zone53/frontend/public/sitemap.xml) includes official `<image:image>` tags for indexing facility photographs in Google Images.
* **Progressive Web App**:
  * Validated [`site.webmanifest`](file:///Users/pavlovus/Desktop/zone53/frontend/public/site.webmanifest) with theme color `#FFCC00`, background `#000000`, maskable icons, and Apple touch icons for home-screen bookmarking.

---

## 🐳 Deployment & Docker

### 1. Full-Stack Docker Compose (Recommended)

To launch both frontend and backend on any VPS or cloud server:

```bash
# Set your environment variables
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
export FRONTEND_URL="https://zone53.com"

# Build and start containers in detached mode
docker compose up -d --build
```

Services will be accessible at:
* **Frontend**: `http://localhost:3000`
* **Backend**: `http://localhost:4000`

### 2. Standalone Container Builds

#### Backend:
```bash
cd backend
docker build -t zone53-backend .
docker run -d -p 4000:4000 \
  -e TELEGRAM_BOT_TOKEN="your_token" \
  -e TELEGRAM_CHAT_ID="your_chat_id" \
  zone53-backend
```

#### Frontend:
```bash
cd frontend
docker build -t zone53-frontend .
docker run -d -p 3000:3000 \
  -e BACKEND_URL="http://host.docker.internal:4000" \
  zone53-frontend
```

---

## 🧪 Testing & Validation

### Run Backend Tests (Vitest)
```bash
cd backend
npm test
```
Executes 12 automated integration tests covering:
* `GET /health` liveness checks
* Successful lead submission & Telegram dispatch
* Missing required fields & invalid email formats
* Honeypot silent mitigation
* IP rate limit enforcement (429)
* Payload size limits (413)
* Unsupported media types (415)
* Telegram API failure resilience (502)

### Run Frontend Typecheck & Build
```bash
cd frontend
npm run typecheck
npm run build
```
Ensures strict TypeScript compilation, React Router manifest generation, and SSG pre-rendering of `/` into static HTML.

---

## 📜 Legal & Attribution

* **ZONE 53** is a registered skunkworks initiative operated by **Epikor** ([epikor.eu](https://epikor.eu/)).
* Physical facility located in Warsaw, Poland.
* All hardware designs, neural perception models, and hangar telemetry are classified intellectual property.
* © 2026 ZONE 53. All rights reserved.