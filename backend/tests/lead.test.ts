import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("POST /api/lead", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = {
      ...originalEnv,
      TELEGRAM_BOT_TOKEN: "mock_bot_token_123",
      TELEGRAM_CHAT_ID: "mock_chat_id_456",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  const validLead = {
    name: "Alex Vance",
    email: "alex@blackmesa.tech",
    phone: "+48 500 123 456",
    investment_amount: "€500,000",
    website: "https://blackmesa.tech",
    comment: "Interested in robotics testing bay access.",
  };

  it("should accept a valid lead and send to Telegram", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, result: { message_id: 999 } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.1")
      .set("Content-Type", "application/json")
      .send(validLead);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, message: "Inquiry received" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("https://api.telegram.org/botmock_bot_token_123/sendMessage");
  });

  it("should silently succeed without calling Telegram if honeypot trap_website is triggered", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.2")
      .set("Content-Type", "application/json")
      .send({
        ...validLead,
        trap_website: "http://spambot-link.com",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, message: "Inquiry received" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should silently succeed if hp_field is filled", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.3")
      .set("Content-Type", "application/json")
      .send({
        ...validLead,
        hp_field: "bot_filled_value",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, message: "Inquiry received" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should silently succeed if honeypot is passed as non-string (boolean/number)", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.33")
      .set("Content-Type", "application/json")
      .send({
        ...validLead,
        hp_field: true,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, message: "Inquiry received" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.4")
      .set("Content-Type", "application/json")
      .send({
        name: "Only Name",
      });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBe("validation_error");
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it("should return 400 when email format is invalid", async () => {
    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.5")
      .set("Content-Type", "application/json")
      .send({
        ...validLead,
        email: "not-an-email",
      });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBe("validation_error");
  });

  it("should return 415 when Content-Type is not application/json", async () => {
    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.6")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("name=Alex");

    expect(res.status).toBe(415);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBe("unsupported_media_type");
  });

  it("should return 413 when payload exceeds 10 KB limit", async () => {
    const hugeComment = "A".repeat(15 * 1024); // 15 KB
    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.7")
      .set("Content-Type", "application/json")
      .send({
        ...validLead,
        comment: hugeComment,
      });

    expect(res.status).toBe(413);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBe("payload_too_large");
  });

  it("should return 500 server_misconfigured when Telegram tokens are missing", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;

    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.8")
      .set("Content-Type", "application/json")
      .send(validLead);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ ok: false, error: "server_misconfigured" });
  });

  it("should return 502 telegram_dispatch_failed when Telegram API returns error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, description: "Bad Request: chat not found" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", "198.51.100.9")
      .set("Content-Type", "application/json")
      .send(validLead);

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ ok: false, error: "telegram_dispatch_failed" });
  });

  it("should enforce rate limit of 5 requests per 15 minutes per IP", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const testIp = "203.0.113.42";

    // First 5 requests should succeed (200 OK)
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/api/lead")
        .set("X-Forwarded-For", testIp)
        .set("Content-Type", "application/json")
        .send(validLead);

      expect(res.status).toBe(200);
    }

    // 6th request from the same IP must be rejected with 429
    const limitedRes = await request(app)
      .post("/api/lead")
      .set("X-Forwarded-For", testIp)
      .set("Content-Type", "application/json")
      .send(validLead);

    expect(limitedRes.status).toBe(429);
    expect(limitedRes.body).toMatchObject({
      ok: false,
      error: "rate_limit_exceeded",
    });
  });
});
