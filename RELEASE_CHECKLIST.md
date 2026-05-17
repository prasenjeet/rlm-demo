# Release Checklist

Use this checklist before every production release. Copy it into the release PR or GitHub Release notes.

---

## Release: v______  |  Date: __________

### 1. Pre-Release (Dev Environment)
- [ ] All feature branches merged to `main`
- [ ] `npm test` passes with no failures
- [ ] No critical linting errors (`npm run lint`)
- [ ] All open blocking issues closed or deferred
- [ ] `package.json` version bumped (`npm run release:patch|minor|major`)
- [ ] `CHANGELOG.md` updated with this release's notes

### 2. Staging Validation
- [ ] Deployed to **staging** environment
- [ ] Smoke tests pass (`GET /health` returns `200 ok`)
- [ ] Regression test suite executed
- [ ] Performance baseline within ±10 % of previous release
- [ ] Third-party integrations verified (DB, cache, external APIs)
- [ ] Security scan completed (SAST / dependency audit: `npm audit`)

### 3. Go/No-Go Decision
- [ ] QA sign-off obtained
- [ ] Product Owner approval
- [ ] On-call engineer notified and available during rollout
- [ ] Rollback plan documented (see below)

### 4. Production Deployment
- [ ] Deployment window confirmed (avoid peak traffic hours)
- [ ] Feature flags configured correctly (`config/prod.json`)
- [ ] Git tag pushed: `git push origin v______`
- [ ] GitHub Actions deployment pipeline green
- [ ] Production health check verified: `GET /health`
- [ ] Monitoring dashboards reviewed post-deploy (error rate, p99 latency)

### 5. Post-Release
- [ ] Release notes published (GitHub Release / internal wiki)
- [ ] Stakeholders notified via Slack / email
- [ ] Previous release artefacts archived
- [ ] Retrospective action items captured (if any)

---

## Rollback Plan

| Trigger | Action |
|---------|--------|
| Error rate > 1 % within 15 min | Redeploy previous image tag |
| Health check fails | Activate maintenance page; redeploy |
| Data corruption detected | Stop deployment; engage DBA; restore from snapshot |

**Previous stable version:** v______
**Rollback command:** `git checkout v______ && npm run start`

---

## Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Engineer | | | |
| QA Lead | | | |
| Product Owner | | | |
