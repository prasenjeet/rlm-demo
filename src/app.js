/**
 * RLM Demo App — a lightweight REST API used as the release target.
 * Exposes /health, /version, and /items endpoints to simulate a real service.
 */

const express = require("express");
const { name, version, description } = require("../package.json");

const app = express();
app.use(express.json());

// In-memory store (simulating a DB)
let items = [
  { id: 1, name: "Widget A", status: "active" },
  { id: 2, name: "Widget B", status: "inactive" },
];

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: name,
    version,
    env: process.env.APP_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Version ───────────────────────────────────────────────────────────────────
app.get("/version", (req, res) => {
  res.json({ version, description });
});

// ── Items (CRUD) ──────────────────────────────────────────────────────────────
app.get("/items", (req, res) => res.json(items));

app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.post("/items", (req, res) => {
  const { name, status = "active" } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const item = { id: items.length + 1, name, status };
  items.push(item);
  res.status(201).json(item);
});

app.patch("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });
  Object.assign(item, req.body);
  res.json(item);
});

app.delete("/items/:id", (req, res) => {
  const idx = items.findIndex((i) => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  items.splice(idx, 1);
  res.status(204).send();
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀  ${name} v${version} on :${PORT}`));
}

module.exports = app;
