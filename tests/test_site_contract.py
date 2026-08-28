from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "style.css").read_text(encoding="utf-8")


def test_approved_section_order_is_preserved():
    markers = [
        'class="hero"', 'class="trust"', 'class="section why"',
        'class="section services"', 'class="section industry"',
        'class="metricsVisual"', 'class="section strategy"',
        'class="section testimonials"', 'class="section caseSec"',
        'class="section aboutSec"', 'class="section faq"',
        'class="section blogs"', 'class="footer"'
    ]
    positions = [HTML.index(m) for m in markers]
    assert positions == sorted(positions)


def test_corrected_cta_hooks_are_present():
    assert 'js-header-cta' in HTML
    assert 'js-hero-cta' in HTML
    assert '#cta-fix' not in CSS
    assert 'background:#fff!important' in HTML
    assert 'color:#111!important' in HTML


def test_original_design_css_is_present():
    assert '.hero{height:930px' in CSS
    assert '.serviceGrid{display:grid;grid-template-columns:repeat(3,1fr)' in CSS
    assert '.caseHero{position:relative;height:710px' in CSS


def test_public_cms_loader_maps_all_enabled_sections():
    site_js = (ROOT / "js" / "site.js").read_text(encoding="utf-8")
    for key in [
        "header", "hero", "trust", "why", "services", "industries",
        "metrics", "strategy", "testimonials", "case", "about", "faq",
        "insights", "footer"
    ]:
        assert f"m.{key}" in site_js or f"m['{key}']" in site_js
    for selector in [
        ".js-header-cta", ".js-hero-cta", ".trustin", ".whyTop",
        ".serviceGrid", ".industryCards", ".metricsRow", ".strategyGrid",
        ".testGrid", ".casePanel", ".aboutCopy", ".faqList", ".blogGrid",
        ".footerGrid"
    ]:
        assert selector in site_js


def test_public_loader_is_external_and_design_markup_stays_intact():
    assert '<script src="/js/site.js"></script>' in HTML
    assert "SUPABASE_URL" not in HTML
