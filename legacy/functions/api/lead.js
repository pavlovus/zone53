export async function onRequestPost({ request, env }) {
  const json = (obj, status) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  const ct = request.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "bad_content_type" }, 415);
  }
  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: "bad_body" }, 400);
  }
  if (!raw) return json({ ok: false, error: "empty" }, 400);
  if (raw.length > 4096) return json({ ok: false, error: "too_large" }, 413);
  let b = null;
  try {
    b = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  if (!b || typeof b !== "object") return json({ ok: false, error: "bad_json" }, 400);
  const pick = (v) => (typeof v === "string" ? v.trim() : "");
  const fields = {
    name: pick(b.name),
    email: pick(b.email),
    website: pick(b.website),
    phone: pick(b.phone),
    package: pick(b.package),
  };
  for (const k of ["name", "email", "website", "phone", "package"]) {
    if (!fields[k]) return json({ ok: false, error: "bad_" + k }, 400);
    if (fields[k].length > 200) return json({ ok: false, error: "too_long_" + k }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return json({ ok: false, error: "bad_email" }, 400);
  }
  const token = env ? env.TELEGRAM_BOT_TOKEN : "";
  const chat = env ? env.TELEGRAM_CHAT_ID : "";
  if (!token || !chat) return json({ ok: false, error: "not_configured" }, 500);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const text =
    "You have a new lead from the website\nTariff: " + esc(fields.package) +
    "\nName: " + esc(fields.name) +
    "\nEmail: " + esc(fields.email) +
    "\nWebsite: " + esc(fields.website) +
    "\nPhone: " + esc(fields.phone);
  let tg = null;
  try {
    tg = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
    });
  } catch {
    return json({ ok: false, error: "telegram_unreachable" }, 502);
  }
  if (!tg.ok) {
    let why = "telegram_error";
    try {
      const tj = await tg.json();
      const d = tj && typeof tj.description === "string" ? tj.description.trim() : "";
      if (d) why = "telegram:" + d.slice(0, 120);
    } catch {
      /* non-JSON error: keep default */
    }
    return json({ ok: false, error: why }, tg.status || 502);
  }
  try {
    const tj = await tg.json();
    if (!tj || tj.ok !== true) return json({ ok: false, error: "telegram_error" }, 502);
  } catch {
    /* non-JSON 200: treat as delivered */
  }
  return json({ ok: true }, 200);
}
