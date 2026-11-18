import { describe, it, expect } from "vitest";

describe("API Health", () => {
  it("should return 200 for health endpoint", async () => {
    const res = await fetch("http://localhost:3000/api/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body.status).toBe("ok");
  });
});

describe("Media CRUD", () => {
  it("should list media (empty)", async () => {
    const res = await fetch("http://localhost:3000/api/media");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("should support pagination", async () => {
    const res = await fetch("http://localhost:3000/api/media?page=1&limit=10");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("pagination");
    expect(body.pagination).toHaveProperty("page", 1);
    expect(body.pagination).toHaveProperty("limit", 10);
  });
});
