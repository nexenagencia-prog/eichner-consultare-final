# Eichner CMS Design

## Goal
Preserve the approved Eichner visual design exactly while making its content editable through a standalone CMS backed by Supabase.

## Non-negotiable visual constraint
The approved `index.html` structure and `style.css` are the visual source of truth. CMS integration may add selectors, data hooks, or JavaScript behavior, but must not alter grids, spacing, typography, section order, or CTA styling.

## Architecture
The public site remains a static Vercel site. It loads public content from `public.site_content` with the Supabase publishable key and applies values to existing DOM elements. The CMS lives under `/admin/`, authenticates with a CMS access key validated by Postgres RLS, edits section JSON, and uploads media into the existing public `site-media` storage bucket.

## Editable scope
Header/menu, hero, trust logos, why section, services, industries, metrics, strategy, testimonials, highlighted case, about section, FAQ, insights, footer, CTA labels/links, and all section images currently represented in the database.

## Security
The CMS key is not embedded in client code. It is supplied by the administrator and stored only in `sessionStorage`. A SHA-256 hash is stored in Supabase. Postgres checks the `x-cms-key` request header and RLS permits writes only to a valid CMS key or an existing authenticated CMS admin. Public reads remain available.

## Deployment/versioning
The approved visual baseline is committed to `main`. CMS work is isolated on branch `cms-v1`. Vercel preview is used for validation before production. The repository is structured for GitHub, but pushing requires an available GitHub connection/network.
