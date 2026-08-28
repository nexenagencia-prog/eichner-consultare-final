# Eichner CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a safe editable CMS for the approved Eichner site without changing its visual design.

**Architecture:** Keep the approved static HTML/CSS intact, move content application logic into a dedicated public-site script, and create a separate `/admin` application that reads/writes `site_content` through Supabase. Protect writes with a hashed CMS key checked by RLS and support image uploads through `site-media`.

**Tech Stack:** Static HTML/CSS/JavaScript, Supabase Postgres/Storage, Vercel, Git.

**Spec:** `docs/superpowers/specs/2026-08-28-eichner-cms-design.md`

## Global Constraints
- Preserve the approved visual structure and CSS.
- Do not redesign or reorder sections.
- Keep the corrected white/black CTA treatment unchanged.
- CMS key must not be hardcoded in browser source.
- Every editable database field must have a corresponding public-site mapping or intentionally remain disabled.

---

### Task 1: Freeze approved visual baseline
**Files:** `index.html`, `style.css`
- [ ] Add structural tests that assert approved section order and CTA fix hooks.
- [ ] Run tests and confirm the baseline passes.
- [ ] Commit baseline on `main`.

### Task 2: Public CMS loader
**Files:** `js/site.js`, `index.html`, `tests/test_site_contract.py`
- [ ] Write failing tests for complete section mappings and unchanged structure.
- [ ] Implement DOM mapping for all enabled `site_content` sections.
- [ ] Run tests and verify pass.
- [ ] Commit.

### Task 3: Admin editor
**Files:** `admin/index.html`, `admin/admin.css`, `admin/admin.js`, `tests/test_admin_contract.py`
- [ ] Write failing tests for key login, section editor, button fields, image upload, and save behavior.
- [ ] Implement generic section editors with human-readable field groups.
- [ ] Add image upload for all image fields and insight cards.
- [ ] Run tests and verify pass.
- [ ] Commit.

### Task 4: Security and rollback readiness
**Files:** Supabase migration, `README.md`
- [ ] Validate CMS-key RPC and RLS behavior.
- [ ] Verify public reads still work.
- [ ] Document CMS password handling, preview workflow, and Git branch strategy.
- [ ] Commit docs.

### Task 5: Preview verification
**Files:** deployment only
- [ ] Deploy `cms-v1` to Vercel preview.
- [ ] Verify deployment reaches READY.
- [ ] Verify `/style.css`, `/js/site.js`, and `/admin/` are deployed.
- [ ] Confirm no production promotion until preview is validated.
