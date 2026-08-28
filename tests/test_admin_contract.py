from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_admin_files_exist_and_are_split_by_responsibility():
    assert (ROOT / 'admin' / 'index.html').exists()
    assert (ROOT / 'admin' / 'admin.css').exists()
    assert (ROOT / 'admin' / 'admin.js').exists()


def test_admin_uses_non_destructive_key_validation():
    js = (ROOT / 'admin' / 'admin.js').read_text(encoding='utf-8')
    assert "rpc('validate_cms_password', { p_key: key })" in js
    assert "x-cms-key" in js
    assert "sessionStorage" in js
    assert ".update({content:data.content})" not in js


def test_admin_edits_all_live_sections_in_site_order():
    js = (ROOT / 'admin' / 'admin.js').read_text(encoding='utf-8')
    for key in [
        'header', 'hero', 'trust', 'why', 'services', 'industries',
        'metrics', 'strategy', 'testimonials', 'case', 'about', 'faq',
        'insights', 'footer'
    ]:
        assert f"'{key}'" in js
    assert "order('sort_order')" in js


def test_admin_supports_buttons_links_and_image_uploads():
    js = (ROOT / 'admin' / 'admin.js').read_text(encoding='utf-8')
    assert "site-media" in js
    assert "type: 'image'" in js
    assert "type: 'button'" in js
    assert "saveSection" in js
    assert "uploadImage" in js


def test_admin_does_not_embed_the_cms_password():
    all_text = ''.join((ROOT / 'admin' / f).read_text(encoding='utf-8') for f in ['index.html','admin.js','admin.css'])
    assert 'ECMS-' not in all_text
