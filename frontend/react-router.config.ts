import type { Config } from "@react-router/dev/config";

export default {
  // SSR enabled for dynamic routes and authenticated sessions
  ssr: true,

  // Static Site Generation (SSG) pre-rendering for public and SEO-critical routes
  async prerender() {
    return ["/"];
  },
} satisfies Config;
