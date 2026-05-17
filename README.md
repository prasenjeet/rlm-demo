# rlm-demo

A minimal Node.js project for testing and demonstrating a **Release Lifecycle Management (RLM)** workflow end-to-end.

---

## What's Included

| Path | Purpose |
|------|---------|
| `src/app.js` | Express REST API (the "product" being released) |
| `scripts/release.js` | Full RLM pipeline orchestrator |
| `scripts/bump-version.js` | Semver version bumping |
| `scripts/generate-changelog.js` | Appends changelog entries |
| `tests/app.test.js` | Jest + Supertest integration tests |
| `.github/workflows/release.yml` | GitHub Actions CI/CD pipeline |
| `config/{dev,staging,prod}.json` | Per-environment configuration |
| `CHANGELOG.md` | Auto-generated release history |
| `RELEASE_CHECKLIST.md` | Pre/post release checklist |

---

## RLM Pipeline Stages

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ PLAN     │──▶│  BUILD   │──▶│   TEST   │──▶│ STAGING  │──▶│   PROD   │
│          │   │  bump    │   │  jest    │   │  smoke   │   │  deploy  │
│ backlog  │   │  version │   │  lint    │   │  tests   │   │  tag     │
│ issues   │   │  compile │   │  audit   │   │  sign-off│   │  notify  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## Quick Start

```bash
# Install
npm install

# Run the app (dev)
npm run dev            # http://localhost:3000

# Run tests
npm test

# Trigger a release
npm run release:patch  # 1.0.0 → 1.0.1
npm run release:minor  # 1.0.0 → 1.1.0
npm run release:major  # 1.0.0 → 2.0.0
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check + version info |
| GET | `/version` | Package version |
| GET | `/items` | List all items |
| GET | `/items/:id` | Get single item |
| POST | `/items` | Create item `{ name, status? }` |
| PATCH | `/items/:id` | Update item |
| DELETE | `/items/:id` | Delete item |

---

## Extending for Real Projects

1. **Build step** — Add transpilation (TypeScript), Docker build, or Lambda packaging in `scripts/release.js` Step 5.
2. **Deploy step** — Replace placeholder comments in `.github/workflows/release.yml` with your actual deploy commands (Fly.io, ECS, k8s, etc.).
3. **Notifications** — Uncomment the Slack webhook in the `notify` job and add `SLACK_WEBHOOK` to GitHub Secrets.
4. **Environment secrets** — Add `STAGING_DEPLOY_KEY` and `PROD_DEPLOY_KEY` in GitHub → Settings → Secrets.

---

## License

MIT
