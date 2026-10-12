import compression from "compression";
import express from "express";
import { createRequestHandler } from "@react-router/express";

const isProduction = process.env.NODE_ENV === "production";
const app = express();

app.disable("x-powered-by");
app.use(compression());

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
