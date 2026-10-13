import { getTelegramCredentials } from "../config/env.js";
import type { LeadInput } from "../schemas/lead.schema.js";

export function escapeHtml(str: string): string {
  // Strip null bytes and dangerous unprintable control characters
  const sanitized = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  return sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface LeadMetadata {
  ip: string;
  userAgent: string;
  timestamp?: string;
}

export function formatTelegramMessage(lead: LeadInput, meta: LeadMetadata): string {
  const time = meta.timestamp || new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
  const name = escapeHtml(lead.name);
  const email = escapeHtml(lead.email);
  const phone = escapeHtml(lead.phone);
  const website = lead.website ? escapeHtml(lead.website) : "Not provided";
  const investment = escapeHtml(lead.investment_amount);
  const comment = lead.comment ? escapeHtml(lead.comment) : "None provided";

  return (
    `🚀 <b>NEW INVESTOR INQUIRY — ZONE 53</b>\n\n` +
    `👤 <b>Name:</b> ${name}\n` +
    `✉️ <b>Email:</b> ${email}\n` +
    `📞 <b>Phone:</b> ${phone}\n` +
    `🌐 <b>Website:</b> ${website}\n` +
    `💰 <b>Investment Amount:</b> ${investment}\n` +
    `📝 <b>Comment:</b> ${comment}\n\n` +
    `————————————\n` +
    `⏱ <b>Timestamp:</b> ${escapeHtml(time)}\n` +
    `🌐 <b>Client IP:</b> ${escapeHtml(meta.ip)}\n` +
    `🖥 <b>User-Agent:</b> ${escapeHtml(meta.userAgent)}\n` +
    `<i>Source: zone53.eu</i>`
  );
}

export async function sendTelegramLead(lead: LeadInput, meta: LeadMetadata): Promise<void> {
  const { token, chatId } = getTelegramCredentials();
  const text = formatTelegramMessage(lead, meta);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    const body = (await response.json().catch(() => ({}))) as { ok?: boolean; description?: string };

    if (!response.ok || body.ok !== true) {
      const errMsg = body.description || `HTTP ${response.status}`;
      console.error("[Telegram Service Error]", errMsg);
      throw new Error(`TELEGRAM_DISPATCH_FAILED: ${errMsg}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[Telegram Service Error] Request timed out after 10s");
      throw new Error("TELEGRAM_DISPATCH_FAILED: Request timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
