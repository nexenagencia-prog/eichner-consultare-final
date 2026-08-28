from pathlib import Path
html=Path('index.html').read_text()
css=Path('style.css').read_text()
assert 'class="btn btn-contact"' in html
assert html.count('https://wa.me/5551998154479') >= 4
assert 'color:#fff!important' in css
assert '.btn:hover' in css
assert 'target="_blank" rel="noopener"' in html
print('button regression checks: PASS')
