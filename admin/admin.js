(() => {
  const SUPABASE_URL = 'https://bxffghmlxenoylguffih.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Km-c-UKeA5JRz_K2ITaGrQ_nswGBUfm';
  const STORAGE_BUCKET = 'site-media';
  const SESSION_KEY = 'eichnerCmsKey';
  const LIVE_ORDER = ['header','hero','trust','why','services','industries','metrics','strategy','testimonials','case','about','faq','insights','footer'];

  const SCHEMAS = {
    header: [
      {path:'logo',label:'Logo / nome',type:'text'},
      {path:'items',label:'Menu',type:'array',itemFields:[{key:'label',label:'Texto',type:'text'},{key:'href',label:'Link',type:'text'}]},
      {path:'button',label:'Botão do menu',type: 'button'}
    ],
    hero: [
      {path:'eyebrow',label:'Linha superior',type:'text'},
      {path:'title',label:'Título principal',type:'textarea'},
      {path:'text',label:'Texto',type:'textarea'},
      {path:'image',label:'Imagem de fundo',type: 'image'},
      {path:'primaryButton',label:'Botão principal',type: 'button'},
      {path:'secondaryButton',label:'Botão secundário',type: 'button'}
    ],
    trust: [
      {path:'label',label:'Texto da faixa',type:'text'},
      {path:'items',label:'Empresas / logos em texto',type:'stringArray'}
    ],
    why: [
      {path:'title',label:'Título',type:'textarea',hint:'Use <br> para manter a quebra de linha.'},
      {path:'text',label:'Texto de apoio',type:'textarea'},
      {path:'image',label:'Imagem',type: 'image'},
      {path:'quote',label:'Frase de destaque',type:'textarea'},
      {path:'quoteBy',label:'Assinatura da frase',type:'text'},
      {path:'tabs',label:'Pilares',type:'array',itemFields:[{key:'title',label:'Título',type:'text'},{key:'text',label:'Descrição',type:'textarea'}]}
    ],
    services: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'text',label:'Texto de apoio',type:'textarea'},
      {path:'items',label:'Soluções',type:'array',itemFields:[{key:'title',label:'Título',type:'text'},{key:'text',label:'Descrição',type:'textarea'}]}
    ],
    industries: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'text',label:'Texto de apoio',type:'textarea'},
      {path:'button',label:'Botão',type: 'button'},
      {path:'items',label:'Segmentos',type:'array',itemFields:[{key:'title',label:'Título',type:'text'},{key:'text',label:'Descrição',type:'text'}]}
    ],
    metrics: [
      {path:'title',label:'Título',type:'textarea'},
      {path:'image',label:'Imagem de fundo',type: 'image'},
      {path:'items',label:'Métricas',type:'array',itemFields:[{key:'value',label:'Número / valor',type:'text'},{key:'label',label:'Legenda',type:'text'}]}
    ],
    strategy: [
      {path:'text',label:'Texto de introdução',type:'textarea'},
      {path:'image',label:'Imagem',type: 'image'},
      {path:'button',label:'Botão',type: 'button'},
      {path:'items',label:'Etapas',type:'array',itemFields:[{key:'title',label:'Título',type:'text'},{key:'text',label:'Descrição',type:'textarea'}]}
    ],
    testimonials: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'items',label:'Depoimentos',type:'array',itemFields:[{key:'quote',label:'Depoimento',type:'textarea'},{key:'name',label:'Nome',type:'text'},{key:'company',label:'Empresa',type:'text'}]}
    ],
    case: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'text',label:'Texto',type:'textarea'},
      {path:'image',label:'Imagem de fundo',type: 'image'},
      {path:'button',label:'Botão do case',type: 'button'},
      {path:'trustTitle',label:'Título de confiança',type:'text'},
      {path:'trustText',label:'Texto de confiança',type:'textarea'},
      {path:'trustButton',label:'Botão abaixo do case',type: 'button'}
    ],
    about: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'text',label:'Texto',type:'textarea'},
      {path:'image',label:'Imagem',type: 'image'},
      {path:'button',label:'Botão',type: 'button'}
    ],
    faq: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'items',label:'Perguntas e respostas',type:'array',itemFields:[{key:'question',label:'Pergunta',type:'text'},{key:'answer',label:'Resposta',type:'textarea'}]}
    ],
    insights: [
      {path:'eyebrow',label:'Etiqueta',type:'text'},
      {path:'title',label:'Título',type:'textarea'},
      {path:'items',label:'Artigos',type:'array',itemFields:[{key:'title',label:'Título',type:'textarea'},{key:'meta',label:'Data / tempo de leitura',type:'text'},{key:'image',label:'Imagem',type: 'image'}]}
    ],
    footer: [
      {path:'title',label:'Título final',type:'textarea'},
      {path:'button',label:'Botão final',type: 'button'},
      {path:'columns',label:'Colunas do rodapé',type:'stringArray',hint:'Use | para separar linhas dentro de cada coluna.'}
    ]
  };

  const loginView = document.querySelector('#loginView');
  const editorView = document.querySelector('#editorView');
  const keyInput = document.querySelector('#cmsKey');
  const loginStatus = document.querySelector('#loginStatus');
  const sectionsEl = document.querySelector('#sections');
  const sectionNav = document.querySelector('#sectionNav');
  const globalStatus = document.querySelector('#globalStatus');
  let cmsKey = sessionStorage.getItem(SESSION_KEY) || '';
  let rows = [];

  function apiHeaders(extra={}) {
    return {
      'apikey': SUPABASE_KEY,
      'x-cms-key': cmsKey,
      ...extra
    };
  }

  async function fetchWithTimeout(url, options={}, timeoutMs=12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {...options, signal: controller.signal});
    } finally {
      clearTimeout(timer);
    }
  }

  async function validateKey(key) {
    const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/rpc/validate_cms_password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({p_key:key})
    });
    if (!response.ok) throw new Error(`Falha de conexão com o CMS (${response.status}).`);
    return (await response.json()) === true;
  }

  async function enterCMS(key) {
    const clean = String(key || '').trim();
    if (!clean) return setLoginStatus('Digite a senha.', true);
    setLoginStatus('Verificando…');
    try {
      const ok = await validateKey(clean);
      if (!ok) return setLoginStatus('Senha incorreta.', true);
      cmsKey = clean;
      sessionStorage.setItem(SESSION_KEY, clean);
      loginView.hidden = true;
      editorView.hidden = false;
      setLoginStatus('');
      await loadSections();
    } catch (error) {
      console.error(error);
      const message = error?.name === 'AbortError'
        ? 'A conexão demorou demais. Tente novamente.'
        : (error?.message || 'Não foi possível conectar ao CMS.');
      setLoginStatus(message, true);
    }
  }

  function setLoginStatus(text, error=false) {
    loginStatus.textContent = text;
    loginStatus.classList.toggle('error', error);
  }

  function showGlobal(text) {
    globalStatus.textContent = text;
    globalStatus.hidden = false;
    clearTimeout(showGlobal.timer);
    showGlobal.timer = setTimeout(() => { globalStatus.hidden = true; }, 3200);
  }

  async function loadSections() {
    sectionsEl.innerHTML = '<div class="loading">Carregando conteúdo…</div>';
    try {
      const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/site_content?select=*&order=sort_order.asc`, {headers:apiHeaders()});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      rows = (data || []).filter(row => row.enabled && LIVE_ORDER.includes(row.section_key));
    } catch (error) {
      sectionsEl.innerHTML = `<div class="loading">Erro ao carregar: ${escapeHTML(error.message)}</div>`;
      return;
    }
    rows.sort((a,b) => LIVE_ORDER.indexOf(a.section_key) - LIVE_ORDER.indexOf(b.section_key));
    renderAll();
  }

  function renderAll() {
    sectionsEl.innerHTML = '';
    sectionNav.innerHTML = '';
    rows.forEach(row => {
      sectionNav.appendChild(navLink(row));
      sectionsEl.appendChild(renderSection(row));
    });
  }

  function navLink(row) {
    const a = document.createElement('a');
    a.href = `#section-${row.section_key}`;
    a.textContent = row.label || row.section_key;
    return a;
  }

  function renderSection(row) {
    const card = document.createElement('section');
    card.className = 'section-card';
    card.id = `section-${row.section_key}`;
    card.dataset.sectionKey = row.section_key;
    const fields = SCHEMAS[row.section_key] || [];
    card.innerHTML = `<div class="section-head"><div><h2 class="section-title">${escapeHTML(row.label || row.section_key)}</h2><div class="section-key">${escapeHTML(row.section_key)}</div></div><div class="danger-note">Layout protegido</div></div><div class="section-body"></div><div class="section-footer"><span class="save-status"></span><button class="primary save-button">Salvar seção</button></div>`;
    const body = card.querySelector('.section-body');
    fields.forEach(field => body.appendChild(renderField(row, field)));
    card.querySelector('.save-button').addEventListener('click', () => saveSection(row, card));
    return card;
  }

  function renderField(row, field, basePath='') {
    const path = basePath ? `${basePath}.${field.path || field.key}` : (field.path || field.key);
    const value = getPath(row.content || {}, path);
    if (field.type === 'button') return renderButtonGroup(field, path, value || {});
    if (field.type === 'array') return renderArray(row, field, path, value || []);
    if (field.type === 'stringArray') return renderStringArray(field, path, value || []);
    if (field.type === 'image') return renderImage(row, field, path, value || '');
    return renderBasic(field, path, value ?? '');
  }

  function renderBasic(field, path, value) {
    const label = document.createElement('label');
    label.className = `field ${field.type === 'textarea' ? 'full-grid' : ''}`;
    const control = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    if (control.tagName === 'INPUT') control.type = 'text';
    control.value = value;
    control.dataset.path = path;
    label.innerHTML = `<span>${escapeHTML(field.label)}</span>`;
    label.appendChild(control);
    if (field.hint) label.appendChild(hint(field.hint));
    return label;
  }

  function renderButtonGroup(field, path, value) {
    const box = document.createElement('div');
    box.className = 'group';
    box.innerHTML = `<div class="group-title">${escapeHTML(field.label)}</div><div class="group-grid"></div>`;
    const grid = box.querySelector('.group-grid');
    grid.appendChild(renderBasic({label:'Texto do botão',type:'text'}, `${path}.label`, value.label || ''));
    grid.appendChild(renderBasic({label:'Link',type:'text'}, `${path}.href`, value.href || ''));
    box.dataset.fieldType = 'button';
    return box;
  }

  function renderArray(row, field, path, values) {
    const box = document.createElement('div');
    box.className = 'array-group';
    box.innerHTML = `<div class="group-title">${escapeHTML(field.label)}</div>`;
    values.forEach((item, index) => {
      const itemBox = document.createElement('div');
      itemBox.className = 'array-item';
      itemBox.innerHTML = `<div class="array-label">Item ${index + 1}</div>`;
      (field.itemFields || []).forEach(sub => {
        const subPath = `${path}.${index}.${sub.key}`;
        const subValue = item?.[sub.key] ?? '';
        if (sub.type === 'image') itemBox.appendChild(renderImage(row, {...sub,label:sub.label}, subPath, subValue));
        else itemBox.appendChild(renderBasic({label:sub.label,type:sub.type}, subPath, subValue));
      });
      box.appendChild(itemBox);
    });
    return box;
  }

  function renderStringArray(field, path, values) {
    const box = document.createElement('div');
    box.className = 'array-group';
    box.innerHTML = `<div class="group-title">${escapeHTML(field.label)}</div>`;
    values.forEach((value, index) => {
      box.appendChild(renderBasic({label:`Item ${index + 1}`,type:'text'}, `${path}.${index}`, value));
    });
    if (field.hint) box.appendChild(hint(field.hint));
    return box;
  }

  function renderImage(row, field, path, value) {
    const box = document.createElement('div');
    box.className = 'image-field';
    const unique = `${row.section_key}-${path.replace(/[^a-z0-9]/gi,'-')}`;
    box.innerHTML = `<div class="field-label">${escapeHTML(field.label)}</div><div class="image-preview"></div><div class="image-controls"><label class="field"><span>URL da imagem</span><input class="image-url" type="text" data-path="${escapeAttr(path)}"></label><label class="upload-label" for="file-${escapeAttr(unique)}">Enviar imagem</label><input id="file-${escapeAttr(unique)}" class="image-file" type="file" accept="image/*"></div><div class="upload-status"></div>`;
    const urlInput = box.querySelector('.image-url');
    const preview = box.querySelector('.image-preview');
    const file = box.querySelector('.image-file');
    urlInput.value = value || '';
    if (value) preview.style.backgroundImage = `url("${value}")`;
    urlInput.addEventListener('input', () => { preview.style.backgroundImage = urlInput.value ? `url("${urlInput.value}")` : ''; });
    file.addEventListener('change', () => {
      if (file.files?.[0]) uploadImage(row, path, file.files[0], urlInput, preview, box.querySelector('.upload-status'));
    });
    return box;
  }

  async function uploadImage(row, path, file, urlInput, preview, status) {
    status.textContent = 'Enviando imagem…';
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const storagePath = `${row.section_key}/${Date.now()}-${cleanName}`;
    let response;
    try {
      response = await fetchWithTimeout(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${storagePath}`, {
        method:'POST',
        headers:apiHeaders({'Content-Type':file.type || 'application/octet-stream','x-upsert':'false'}),
        body:file
      }, 30000);
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `HTTP ${response.status}`);
      }
    } catch (error) {
      status.textContent = `Erro: ${error.message}`;
      status.className = 'upload-status status error';
      return;
    }
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;
    urlInput.value = publicUrl;
    preview.style.backgroundImage = `url("${publicUrl}")`;
    status.textContent = 'Imagem enviada. Salvando seção…';
    const card = urlInput.closest('.section-card');
    await saveSection(row, card, { quiet:true });
    status.textContent = 'Imagem enviada e salva.';
    status.className = 'upload-status status success';
  }

  async function saveSection(row, card, options={}) {
    const status = card.querySelector('.save-status');
    if (!options.quiet) status.textContent = 'Salvando…';
    const next = structuredClone(row.content || {});
    card.querySelectorAll('[data-path]').forEach(control => setPath(next, control.dataset.path, control.value));
    let response;
    try {
      response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/site_content?id=eq.${encodeURIComponent(row.id)}`, {
        method:'PATCH',
        headers:apiHeaders({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({content:next,updated_at:new Date().toISOString()})
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `HTTP ${response.status}`);
      }
    } catch (error) {
      status.textContent = `Erro: ${error.message}`;
      status.className = 'save-status status error';
      if (options.quiet) throw error;
      return false;
    }
    row.content = next;
    status.textContent = 'Salvo.';
    status.className = 'save-status status success';
    if (!options.quiet) showGlobal(`${row.label || row.section_key} atualizado.`);
    return true;
  }

  function getPath(obj, path) {
    return String(path).split('.').reduce((acc, key) => acc == null ? undefined : acc[key], obj);
  }

  function setPath(obj, path, value) {
    const parts = String(path).split('.');
    let cursor = obj;
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const nextPart = parts[index + 1];
      if (isLast) {
        cursor[part] = value;
      } else {
        const shouldArray = /^\d+$/.test(nextPart);
        if (cursor[part] == null) cursor[part] = shouldArray ? [] : {};
        cursor = cursor[part];
      }
    });
  }

  function hint(text) {
    const p = document.createElement('div');
    p.className = 'hint';
    p.textContent = text;
    return p;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }
  function escapeAttr(value) { return escapeHTML(value); }

  document.querySelector('#loginButton').addEventListener('click', () => enterCMS(keyInput.value));
  keyInput.addEventListener('keydown', event => { if (event.key === 'Enter') enterCMS(keyInput.value); });
  document.querySelector('#logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  if (cmsKey) enterCMS(cmsKey);
})();
