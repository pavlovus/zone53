import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/lead", "routes/api.lead.ts"),
] satisfies RouteConfig;
