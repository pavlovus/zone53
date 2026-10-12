import compression from "compression";
import express from "express";
import { createRequestHandler } from "@react-router/express";

const isProduction = process.env.NODE_ENV === "production";
const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

// Standard security & privacy headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(compression());
app.use(express.json());

const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

// Forward /api/* requests to decoupled stateless backend service
app.all("/api/*", async (req, res) => {
  try {
    const targetUrl = new URL(req.originalUrl, backendUrl);
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val && key.toLowerCase() !== "host") {
        headers.set(key, Array.isArray(val) ? val.join(", ") : val);
      }
    }
    const forwarded = req.headers["x-forwarded-for"];
    const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : req.ip;
    if (clientIp) headers.set("x-forwarded-for", clientIp);

    const init = {
      method: req.method,
      headers,
    };
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      init.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl.toString(), init);
    res.status(response.status);
    response.headers.forEach((value, name) => {
      if (name.toLowerCase() !== "transfer-encoding") {
        res.setHeader(name, value);
      }
    });
    const body = await response.text();
    return res.send(body);
  } catch (err) {
    console.error("[SSR Server API Forward Error]", err);
    return res.status(502).json({ ok: false, error: "backend_unreachable" });
  }
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
