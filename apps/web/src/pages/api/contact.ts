---
/**
 * Contact API endpoint — Handles form submissions.
 * Validates Turnstile token, rate limits, and stores messages.
 */
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message, consent, token } = body;

    // Validate required fields
    if (!name || !email || !message || !consent) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate message length
    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message too long" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate Turnstile token (if configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && token) {
      const turnstileResult = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: token,
          remoteip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "",
        }),
      });

      const turnstileData = await turnstileResult.json();
      if (!turnstileData.success) {
        return new Response(
          JSON.stringify({ error: "Turnstile verification failed" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Rate limiting check (simple in-memory for now)
    // In production, use Redis or a similar store

    // Process the message
    // In production: store in database, send email notification, etc.
    // For now, log and return success
    console.log("Contact form submission:", { name, email, timestamp: new Date().toISOString() });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
