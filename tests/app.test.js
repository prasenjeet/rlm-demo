/**
 * tests/app.test.js
 * Integration tests covering all API endpoints.
 * Run with:  npm test
 */

const request = require("supertest");
const app     = require("../src/app");

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.version).toBeDefined();
  });
});

describe("GET /version", () => {
  it("returns version string", async () => {
    const res = await request(app).get("/version");
    expect(res.status).toBe(200);
    expect(res.body.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe("GET /items", () => {
  it("returns an array of items", async () => {
    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /items/:id", () => {
  it("returns a single item", async () => {
    const res = await request(app).get("/items/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/items/9999");
    expect(res.status).toBe(404);
  });
});

describe("POST /items", () => {
  it("creates a new item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Test Widget" });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Widget");
    expect(res.body.status).toBe("active");
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.status).toBe(400);
  });
});

describe("PATCH /items/:id", () => {
  it("updates an existing item", async () => {
    const res = await request(app)
      .patch("/items/1")
      .send({ status: "inactive" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("inactive");
  });
});

describe("DELETE /items/:id", () => {
  it("deletes an item and returns 204", async () => {
    const res = await request(app).delete("/items/1");
    expect(res.status).toBe(204);
  });
});
