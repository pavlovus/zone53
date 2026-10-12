import { app } from "./app.js";
import { env } from "./config/env.js";

const port = env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`[Zone53 Backend] Server running at http://localhost:${port} in ${env.NODE_ENV} mode`);
});

// Production reverse proxy timeout alignment (prevents 502 connection reset races)
server.keepAliveTimeout = 61000;
server.headersTimeout = 65000;

// Graceful shutdown handling
function shutdown(signal: string) {
  console.log(`[Zone53 Backend] Received ${signal}. Initiating graceful shutdown...`);

  server.close((err) => {
    if (err) {
      console.error("[Zone53 Backend] Error during server close:", err);
      process.exit(1);
    }
    console.log("[Zone53 Backend] HTTP server closed cleanly. Exiting process.");
    process.exit(0);
  });

  // Force close after 10s if connections linger
  setTimeout(() => {
    console.error("[Zone53 Backend] Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
