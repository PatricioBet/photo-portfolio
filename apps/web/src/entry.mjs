/**
 * Custom server entry point — wraps Astro handler to inject inline CSS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "../../src/styles/tokens.css");
const globalCssPath = path.resolve(__dirname, "../../src/styles/global.css");

let cssContent = "";
let globalCssContent = "";
try {
  cssContent = fs.readFileSync(cssPath, "utf-8");
  globalCssContent = fs.readFileSync(globalCssPath, "utf-8");
} catch {
  // Fallback: no inline CSS
}

const cssBlock = `<style>${cssContent}${globalCssContent}</style>`;

// Import the auto-generated Astro entry point
const { handler, options, startServer, pageMap } = await import("./_astro-entry.mjs");

/**
 * Wrap the Astro handler to inject CSS into HTML responses.
 */
const wrappedHandler = async (request) => {
  const response = await handler(request);

  // Only inject into HTML responses
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html") && cssContent) {
    const body = await response.text();
    // Inject before </head>
    const injected = body.replace("</head>", `${cssBlock}\n</head>`);
    return new Response(injected, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  return response;
};

export { wrappedHandler as handler, options, startServer, pageMap };
