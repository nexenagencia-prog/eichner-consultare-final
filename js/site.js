(() => {
  const SUPABASE_URL = 'https://bxffghmlxenoylguffih.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Km-c-UKeA5JRz_K2ITaGrQ_nswGBUfm';

  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => [...document.querySelectorAll(selector)];
  const setText = (selector, value) => {
    if (value === undefined || value === null || value === '') return;
    const el = qs(selector);
    if (el) el.textContent = value;
  };
  const setHTML = (selector, value) => {
    if (value === undefined || value === null || value === '') return;
    const el = qs(selector);
    if (el) el.innerHTML = value;
  };
  const setLink = (selector, button) => {
    if (!button) return;
    const el = qs(selector);
    if (!el) return;
    if (button.label) el.textContent = button.label;
    if (button.href) el.href = button.href;
    if (/^https?:\/\//i.test(button.href || '')) {
      el.target = '_blank';
      el.rel = 'noopener';
    }
  };
  const setBg = (selector, url) => {
    if (!url) return;
    const el = qs(selector);
    if (el) el.style.backgroundImage = `url("${String(url).replace(/"/g, '%22')}")`;
  };
  const setLayeredBg = (selector, url, layers) => {
    if (!url) return;
    const el = qs(selector);
    if (el) el.style.backgroundImage = `${layers},url("${String(url).replace(/"/g, '%22')}")`;
  };
  const setHeroBg = (url) => {
    if (!url) return;
    let style = qs('#cms-hero-image');
    if (!style) {
      style = document.createElement('style');
      style.id = 'cms-hero-image';
      document.head.appendChild(style);
    }
    const safe = String(url).replace(/["'\\]/g, encodeURIComponent);
    style.textContent = `.hero:before{background:linear-gradient(90deg,rgba(5,8,9,.68),rgba(5,8,9,.15) 58%,rgba(5,8,9,.1)),url("${safe}") center/cover no-repeat!important}`;
  };

  function bindInteractions() {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      }), { threshold: .12 });
      qsa('.reveal').forEach(el => io.observe(el));
    } else {
      qsa('.reveal').forEach(el => el.classList.add('in'));
    }

    qsa('.accItem').forEach(item => item.addEventListener('click', () => {
      qsa('.accItem').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    }));
    qsa('.faqQ').forEach(button => button.addEventListener('click', () => {
      button.closest('.faqItem')?.classList.toggle('open');
    }));
  }

  function applyCMS(m) {
    const header = m.header || {};
    setText('.brand', header.logo);
    qsa('.menu a').forEach((el, i) => {
      const item = header.items?.[i];
      if (!item) return;
      if (item.label) el.textContent = item.label;
      if (item.href) el.href = item.href;
    });
    setLink('.js-header-cta', header.button);

    const hero = m.hero || {};
    setText('.heroPill', hero.eyebrow);
    setText('.hero h1', hero.title);
    setText('.hero p', hero.text);
    setLink('.js-hero-cta', hero.primaryButton);
    setLink('.heroActions .ghost', hero.secondaryButton);
    setHeroBg(hero.image);

    const trust = m.trust || {};
    setText('.trustin p', trust.label);
    qsa('.trustin .logoFake').forEach((el, i) => {
      if (trust.items?.[i]) el.textContent = trust.items[i];
    });

    const why = m.why || {};
    setHTML('.whyTop .h2', why.title);
    setText('.whyTop .lead', why.text);
    setBg('.whyPhoto .img', why.image);
    if (why.quote) {
      const quote = qs('.quoteCard');
      if (quote) {
        const small = quote.querySelector('small');
        quote.firstChild.textContent = `“${why.quote}”`;
        if (small && why.quoteBy) small.textContent = why.quoteBy;
      }
    }
    qsa('.accItem').forEach((el, i) => {
      const tab = why.tabs?.[i];
      if (!tab) return;
      const p = el.querySelector('p');
      const textNode = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode && tab.title) textNode.textContent = tab.title;
      if (p && tab.text !== undefined) p.textContent = tab.text;
    });

    const services = m.services || {};
    setText('.services .eye', services.eyebrow);
    setText('.servicesHead .h2', services.title);
    setText('.servicesHead .lead', services.text);
    qsa('.serviceGrid .serviceCard').forEach((card, i) => {
      const item = services.items?.[i];
      if (!item) return;
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 && item.title) h3.textContent = item.title;
      if (p && item.text !== undefined) p.textContent = item.text;
    });

    const industries = m.industries || {};
    setText('.industryLeft .tag', industries.eyebrow);
    setText('.industryLeft .h2', industries.title);
    setText('.industryLeft .lead', industries.text);
    setLink('.industryLeft .btn', industries.button);
    qsa('.industryCards .industryCard').forEach((card, i) => {
      const item = industries.items?.[i];
      if (!item) return;
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 && item.title) h3.textContent = item.title;
      if (p && item.text !== undefined) p.textContent = item.text;
    });

    const metrics = m.metrics || {};
    setText('.metricsHeadline', metrics.title);
    setLayeredBg('.metricsVisual', metrics.image,
      'linear-gradient(to top,rgba(18,17,14,.98) 0%,rgba(18,17,14,.66) 27%,rgba(18,17,14,.08) 63%),linear-gradient(90deg,rgba(10,10,10,.12),rgba(10,10,10,.12))');
    qsa('.metricsRow .metric').forEach((card, i) => {
      const item = metrics.items?.[i];
      if (!item) return;
      const strong = card.querySelector('strong');
      const span = card.querySelector('span');
      if (strong && item.value) strong.textContent = item.value;
      if (span && item.label) span.textContent = item.label;
    });

    const strategy = m.strategy || {};
    setText('.strategyLead', strategy.text);
    setBg('.strategyImg', strategy.image);
    setLink('.js-strategy-cta', strategy.button);
    qsa('.strategyGrid .step').forEach((card, i) => {
      const item = strategy.items?.[i];
      if (!item) return;
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 && item.title) h3.textContent = item.title;
      if (p && item.text !== undefined) p.textContent = item.text;
    });

    const testimonials = m.testimonials || {};
    setText('.testimonials .eye', testimonials.eyebrow);
    setText('.testimonials .h2', testimonials.title);
    qsa('.testGrid .testCard').forEach((card, i) => {
      const item = testimonials.items?.[i];
      if (!item) return;
      const q = card.querySelector('q');
      const footer = card.querySelector('footer');
      if (q && item.quote) q.textContent = item.quote;
      if (footer) footer.textContent = [item.name, item.company].filter(Boolean).join(' · ');
    });

    const c = m.case || {};
    setText('.casePanel .tag', c.eyebrow);
    setText('.casePanel h3', c.title);
    setText('.casePanel p', c.text);
    setLink('.casePanel .caseRead', c.button);
    setLayeredBg('.caseHero', c.image, 'linear-gradient(90deg,rgba(7,9,10,.18),rgba(7,9,10,.05))');
    setText('.caseTrust strong', c.trustTitle);
    setText('.caseTrust p', c.trustText);
    setLink('.caseTrust .btn', c.trustButton);

    const about = m.about || {};
    setText('.aboutCopy .tag', about.eyebrow);
    setText('.aboutCopy .h2', about.title);
    setText('.aboutCopy p', about.text);
    setLink('.aboutCopy .btn', about.button);
    setBg('.aboutImg', about.image);

    const faq = m.faq || {};
    setText('.faq .tag', faq.eyebrow);
    setText('.faq .h2', faq.title);
    qsa('.faqList .faqItem').forEach((row, i) => {
      const item = faq.items?.[i];
      if (!item) return;
      const q = row.querySelector('.faqQ');
      const a = row.querySelector('.faqA');
      if (q && item.question) {
        const icon = q.querySelector('span')?.outerHTML || '<span>＋</span>';
        q.innerHTML = `${item.question}${icon}`;
      }
      if (a && item.answer !== undefined) a.textContent = item.answer;
    });

    const insights = m.insights || {};
    setText('.blogHead .tag', insights.eyebrow);
    setText('.blogHead h2', insights.title);
    qsa('.blogGrid .blogCard').forEach((card, i) => {
      const item = insights.items?.[i];
      if (!item) return;
      const img = card.querySelector('.blogImg');
      const h3 = card.querySelector('h3');
      const meta = card.querySelector('.meta');
      if (img && item.image) img.style.backgroundImage = `url("${item.image}")`;
      if (h3 && item.title) h3.textContent = item.title;
      if (meta && item.meta) meta.textContent = item.meta;
    });

    const footer = m.footer || {};
    setText('.cta h2', footer.title);
    setLink('.cta .btn', footer.button);
    qsa('.footerGrid > div').forEach((col, i) => {
      const value = footer.columns?.[i];
      if (!value) return;
      const parts = String(value).split('|');
      if (i === 0) {
        col.innerHTML = `<b>${parts.shift() || ''}</b>${parts.length ? '<br>' + parts.join('<br>') : ''}`;
      } else {
        col.innerHTML = parts.join('<br>');
      }
    });
  }

  async function loadCMS() {
    const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    if (!sb) return;
    const { data, error } = await sb.from('site_content')
      .select('section_key,content')
      .eq('enabled', true)
      .order('sort_order');
    if (error || !data) return;
    const m = Object.fromEntries(data.map(row => [row.section_key, row.content || {}]));
    applyCMS(m);
  }

  bindInteractions();
  loadCMS();
})();
