import compression from "compression";
import express from "express";
import { createRequestHandler } from "@react-router/express";

const isProduction = process.env.NODE_ENV === "production";
const app = express();

app.disable("x-powered-by");
app.use(compression());
app.use(express.json());

// Tactical Dossier Clearance Lead Endpoint
app.post("/api/lead", async (req, res) => {
  const { name, email, website, phone, package: pkg } = req.body || {};
  if (!name || !email || !phone) {
    return res.status(400).json({ ok: false, error: "missing_required_fields" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;

  if (token && chat) {
    try {
      const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const text =
        `🚨 <b>NEW ZONE 53 CLEARANCE DOSSIER</b>\n` +
        `<b>Callsign:</b> ${esc(name)}\n` +
        `<b>Email:</b> ${esc(email)}\n` +
        `<b>Phone/Signal:</b> ${esc(phone)}\n` +
        `<b>Website:</b> ${esc(website)}\n` +
        `<b>Scope:</b> ${esc(pkg)}\n` +
        `<i>Time: ${new Date().toISOString()}</i>`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
      });
    } catch (err) {
      console.error("[Telegram Satellite Error]", err);
    }
  } else {
    console.log("[Zone 53 Telemetry Dossier Received]", { name, email, phone, website, pkg });
  }

  return res.json({ ok: true, status: "authorized" });
});

if (isProduction) {
  // Immutable cache for built assets
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
  // Static pre-rendered (SSG) HTML and client files
  app.use(express.static("build/client", { maxAge: "1h" }));

  // Dynamic routes and authenticated SSR sessions (Express 5 compatible)
  app.use(
    createRequestHandler({
      build: () => import("./build/server/index.js"),
      mode: "production",
    })
  );
} else {
  // Development mode: Vite HMR middleware
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );

  app.use(viteDevServer.middlewares);

  // Express 5 compatible handler
  app.use(
    createRequestHandler({
      build: () =>
        viteDevServer.ssrLoadModule("virtual:react-router/server-build"),
      mode: "development",
    })
  );
}

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`[Zone53] Express server running at http://localhost:${port} (${isProduction ? "production" : "development"})`);
});
