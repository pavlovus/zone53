import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, website, phone, package: pkg } = body;

    if (!name || !email || !phone) {
      return Response.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
    }

    const cleanName = String(name || "").trim().slice(0, 100);
    const cleanEmail = String(email || "").trim().slice(0, 150);
    const cleanPhone = String(phone || "").trim().slice(0, 60);
    const cleanWebsite = String(website || "").trim().slice(0, 120);
    const cleanPkg = String(pkg || "").trim().slice(0, 1000);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;

    if (token && chat) {
      try {
        const esc = (s: string) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const text =
          `🚨 <b>NEW ZONE 53 CLEARANCE DOSSIER</b>\n` +
          `<b>Callsign:</b> ${esc(cleanName)}\n` +
          `<b>Email:</b> ${esc(cleanEmail)}\n` +
          `<b>Phone/Signal:</b> ${esc(cleanPhone)}\n` +
          `<b>Website:</b> ${esc(cleanWebsite || "N/A")}\n` +
          `<b>Scope:</b> ${esc(cleanPkg)}\n` +
          `<i>Time: ${new Date().toISOString()}</i>`;

        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
        });
        if (!tgRes.ok) {
          console.error("[Telegram Relay Non-OK]", await tgRes.text());
        }
      } catch (err) {
        console.error("[Telegram Satellite Relay Error]", err);
      }
    } else {
      console.log("[Zone 53 Telemetry Dossier Received via React Router Action]", {
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanWebsite,
        cleanPkg,
      });
    }

    return Response.json({ ok: true, status: "authorized" });
  } catch (error) {
    console.error("[Lead Action Error]", error);
    return Response.json({ ok: true, status: "authorized_offline_fallback" });
  }
}
