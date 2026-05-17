#!/usr/bin/env node
/**
 * scripts/bump-version.js
 * Bumps the semver in package.json by patch | minor | major.
 * Usage:  node scripts/bump-version.js [patch|minor|major]
 */

const fs   = require("fs");
const path = require("path");

const PKG_PATH = path.resolve(__dirname, "../package.json");

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split(".").map(Number);
  switch (type) {
    case "major": return `${major + 1}.0.0`;
    case "minor": return `${major}.${minor + 1}.0`;
    case "patch": return `${major}.${minor}.${patch + 1}`;
    default:      throw new Error(`Unknown bump type: ${type}`);
  }
}

function main() {
  const type = process.argv[2] || "patch";
  const pkg  = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
  const prev = pkg.version;
  const next = bumpVersion(prev, type);

  pkg.version = next;
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n");

  console.log(`✅  Version bumped: ${prev} → ${next}  (${type})`);
  return next;
}

main();
