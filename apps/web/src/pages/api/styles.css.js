---
/**
 * Serves the combined CSS file for the public site.
 * Route: GET /api/styles.css
 * IMPORTANT: Must be a .js file (not .astro) to return raw content-type.
 */
import fs from "node:fs";
import path from "node:path";

const stylesDir = path.resolve(process.cwd(), "src/styles");
let css = "";
try {
  const tokens = fs.readFileSync(path.join(stylesDir, "tokens.css"), "utf-8");
  const global = fs.readFileSync(path.join(stylesDir, "global.css"), "utf-8");
  css = tokens + global;
} catch {
  // Fallback: minimal reset
  css = `:root{--bg:#0b0b0d;--text:#f4f1ea}body{margin:0;background:var(--bg);color:var(--text)}`;
}

export function GET({ request }: { request: Request }) {
  return new Response(css, {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
