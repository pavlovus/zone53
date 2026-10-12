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

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;

    if (token && chat) {
      try {
        const esc = (s: string) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
        console.error("[Telegram Satellite Relay Error]", err);
      }
    } else {
      console.log("[Zone 53 Telemetry Dossier Received via React Router Action]", { name, email, phone, website, pkg });
    }

    return Response.json({ ok: true, status: "authorized" });
  } catch (error) {
    console.error("[Lead Action Error]", error);
    return Response.json({ ok: true, status: "authorized_offline_fallback" });
  }
}
