/**
 * Contact API endpoint — Handles form submissions.
 * @type {import('astro').APIRoute}
 */

/** @type {import('astro').APIRoute} */
export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message, consent } = body;

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

    // Process the message
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
