#!/usr/bin/env node
/**
 * scripts/release.js
 * Full Release Lifecycle Management (RLM) orchestrator.
 *
 * Stages:
 *   1. Pre-flight checks  — env, git status, Node version
 *   2. Version bump       — semver patch / minor / major
 *   3. Run tests          — must be green before proceeding
 *   4. Changelog update   — appends new section to CHANGELOG.md
 *   5. Build artefacts    — placeholder; extend for real builds
 *   6. Tag & summary      — prints a release summary card
 *
 * Usage:  node scripts/release.js [patch|minor|major]
 */

const { execSync } = require("child_process");
const fs           = require("fs");
const path         = require("path");

const PKG_PATH = path.resolve(__dirname, "../package.json");
const TYPE     = process.argv[2] || "patch";

// ── Helpers ───────────────────────────────────────────────────────────────────
const run = (cmd, opts = {}) => execSync(cmd, { stdio: "pipe", ...opts }).toString().trim();
const log = (icon, msg) => console.log(`${icon}  ${msg}`);
const hr  = () => console.log("─".repeat(55));

function step(n, title, fn) {
  hr();
  console.log(`\nSTEP ${n}: ${title}\n`);
  try {
    fn();
    log("✅", "Done\n");
  } catch (err) {
    log("❌", `FAILED — ${err.message}`);
    process.exit(1);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("\n🚀  RLM RELEASE PIPELINE  🚀");
console.log(`    Bump type: ${TYPE.toUpperCase()}`);

// ── 1. Pre-flight ─────────────────────────────────────────────────────────────
step(1, "PRE-FLIGHT CHECKS", () => {
  // Node version
  const [major] = process.version.replace("v", "").split(".").map(Number);
  if (major < 18) throw new Error(`Node ≥ 18 required (found ${process.version})`);
  log("✓", `Node ${process.version}`);

  // package.json readable
  if (!fs.existsSync(PKG_PATH)) throw new Error("package.json not found");
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
  log("✓", `Current version: ${pkg.version}`);

  // Check npm deps installed
  if (!fs.existsSync(path.resolve(__dirname, "../node_modules"))) {
    log("⚠", "node_modules missing — running npm install ...");
    run("npm install", { stdio: "inherit" });
  } else {
    log("✓", "Dependencies installed");
  }

  // Git check (optional — skip gracefully if git isn't configured)
  try {
    const dirty = run("git status --porcelain");
    if (dirty) log("⚠", "Uncommitted changes detected (proceeding anyway)");
    else        log("✓", "Working tree clean");
  } catch {
    log("⚠", "Git not configured — skipping VCS checks");
  }
});

// ── 2. Version bump ───────────────────────────────────────────────────────────
let newVersion;
step(2, "VERSION BUMP", () => {
  const output = run(`node scripts/bump-version.js ${TYPE}`);
  console.log("  " + output);
  newVersion = JSON.parse(fs.readFileSync(PKG_PATH, "utf8")).version;
});

// ── 3. Run tests ──────────────────────────────────────────────────────────────
step(3, "TEST SUITE", () => {
  try {
    const result = run("npm test -- --passWithNoTests 2>&1");
    const lines  = result.split("\n").filter((l) => /passed|failed|suites/i.test(l));
    lines.forEach((l) => log("✓", l.trim()));
  } catch (err) {
    throw new Error("Tests failed — release aborted");
  }
});

// ── 4. Changelog ──────────────────────────────────────────────────────────────
step(4, "CHANGELOG UPDATE", () => {
  run(`node scripts/generate-changelog.js ${newVersion}`);
  log("✓", `CHANGELOG.md updated for v${newVersion}`);
});

// ── 5. Build artefacts ────────────────────────────────────────────────────────
step(5, "BUILD ARTEFACTS", () => {
  // Placeholder — extend this for transpilation, Docker builds, etc.
  log("✓", "No build step configured (extend here for real artefacts)");
  log("✓", "Simulating 0.5s build ...");
  const start = Date.now();
  while (Date.now() - start < 500) {} // busy-wait for demo
  log("✓", "Build complete");
});

// ── 6. Tag & Summary ──────────────────────────────────────────────────────────
step(6, "RELEASE SUMMARY", () => {
  try {
    run(`git tag -a "v${newVersion}" -m "Release v${newVersion}"`);
    log("✓", `Git tag v${newVersion} created`);
  } catch {
    log("⚠", "Git tag skipped (not a git repo or tag already exists)");
  }
});

hr();
console.log(`
╔══════════════════════════════════════════════╗
║            RELEASE COMPLETE  🎉              ║
╠══════════════════════════════════════════════╣
║  Version   : ${("v" + newVersion).padEnd(31)}║
║  Bump type : ${TYPE.padEnd(31)}║
║  Date      : ${new Date().toISOString().split("T")[0].padEnd(31)}║
║  Status    : ALL STAGES PASSED              ║
╚══════════════════════════════════════════════╝
`);
