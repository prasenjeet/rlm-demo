#!/usr/bin/env node
/**
 * scripts/generate-changelog.js
 * Appends a new release entry to CHANGELOG.md.
 *
 * Usage:  node scripts/generate-changelog.js [version] [--notes "..."]
 * The script reads the current version from package.json if none is provided.
 */

const fs   = require("fs");
const path = require("path");

const PKG_PATH = path.resolve(__dirname, "../package.json");
const CL_PATH  = path.resolve(__dirname, "../CHANGELOG.md");

// ── Parse CLI args ────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const pkg     = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
const version = args[0] && !args[0].startsWith("--") ? args[0] : pkg.version;

const notesIdx = args.indexOf("--notes");
const notes    = notesIdx !== -1 ? args[notesIdx + 1] : "";

// ── Build entry ───────────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];

const entry = `
## [${version}] — ${today}

${notes || "<!-- Add release notes here -->"}

### Changed
- (describe changes)

### Fixed
- (describe fixes)

### Added
- (describe additions)

---
`;

// ── Prepend to CHANGELOG ──────────────────────────────────────────────────────
const existing = fs.existsSync(CL_PATH) ? fs.readFileSync(CL_PATH, "utf8") : "# Changelog\n\n";
const [header, ...rest] = existing.split("\n").reduce(
  ([h, body, inHeader], line) => {
    if (!inHeader && line.startsWith("## ")) inHeader = true;   // first version heading found
    return inHeader ? [h, [...body, line], true] : [[...h, line], body, false];
  },
  [[], [], false]
);

// Re-assemble: original preamble + new entry + old entries
const updated =
  header.join("\n") + "\n" + entry + (rest.length ? rest.join("\n") : "");

fs.writeFileSync(CL_PATH, updated);
console.log(`✅  CHANGELOG.md updated for v${version}`);
