/* Gael Aprende — panel para padres: progreso, fortalezas, áreas de mejora, ajustes y respaldo */
(function () {
  'use strict';
  const { h } = GA;
  const E = GA.engine;
  const D = () => GA.store.data;

  const TAGS = {
    'contar-hasta-10': 'Contar hasta 10', 'contar-mas-de-10': 'Contar más de 10 objetos', 'comparar-grupos': 'Comparar cantidades', 'comparar-numeros': 'Comparar números',
    'comparar-decenas': 'Comparar usando decenas', signos: 'Signos mayor/menor que', 'recta-10': 'Ubicar números del 0 al 10', 'recta-20': 'Ubicar números del 0 al 20', 'estimar-100': 'Estimar en la recta del 0 al 100',
    'suma-hasta-10': 'Sumas hasta 10', 'suma-pasando-10': 'Sumas que pasan de 10 (hacer 10)', 'suma-dos-cifras': 'Sumas de dos cifras', 'suma-llevando': 'Sumas llevando', 'problema-suma': 'Problemas de suma con texto',
    'resta-hasta-10': 'Restas hasta 10', 'resta-pasando-10': 'Restas que cruzan el 10', 'resta-dos-cifras': 'Restas de dos cifras', 'problema-resta': 'Problemas de resta con texto',
    'valor-posicional': 'Decenas y unidades', 'patron-figuras': 'Patrones de figuras', 'patron-numerico': 'Patrones numéricos', figuras: 'Reconocer figuras', 'lados-vertices': 'Lados y vértices', 'cuerpos-3d': 'Cuerpos geométricos',
    equilibrio: 'Igualdad en la balanza', algebra: 'Valor desconocido (pre-álgebra)', 'grupos-iguales': 'Grupos iguales', arreglos: 'Multiplicación en arreglos',
    'partes-iguales': 'Partes iguales', 'mitad-cuarto': 'Mitades y cuartos', 'representar-fraccion': 'Representar fracciones', 'leer-fraccion': 'Leer fracciones', 'comparar-fracciones': 'Comparar fracciones',
    'poner-hora': 'Poner la hora', 'leer-hora': 'Leer el reloj', logica: 'Razonamiento lógico (sudoku)',
    densidad: 'Explicar por qué flotan las cosas', flotar: 'Predecir si flota', 'flotar-sorpresas': 'Flotación con objetos sorpresa', 'clasificar-densidad': 'Clasificar por densidad',
    'mezcla-inversa': 'Qué colores forman otro', 'predecir-mezcla': 'Predecir mezclas de color', tonos: 'Colores claros y oscuros', 'mezclar-colores': 'Mezclar colores',
    estados: 'Estados del agua', 'cambios-estado': 'Cambios de estado', 'cambios-vida-diaria': 'Cambios de estado en la vida diaria',
    'clasificar-hab': 'Hábitat de los animales', 'clasificar-diet': 'Alimentación de los animales', 'clasificar-cls': 'Grupos de animales', 'ciclo-siguiente': 'Etapas de ciclos de vida',
    'necesidades-plantas': 'Necesidades de las plantas', 'experimento-plantas': 'Experimento de plantas', 'predecir-plantas': 'Predecir el crecimiento', 'partes-planta': 'Partes de la planta', 'funciones-planta': 'Funciones de la planta',
    sentidos: 'Los sentidos', 'organos-lugar': 'Ubicar órganos', 'organos-funcion': 'Función de los órganos', alimentacion: 'Alimentación saludable',
    'dia-noche': 'Día y noche', 'orden-planetas': 'Orden de los planetas', 'datos-planetas': 'Datos de planetas', 'datos-espacio': 'Conceptos del espacio', 'fases-luna': 'Fases de la Luna',
    polos: 'Polos de los imanes', 'materiales-magneticos': 'Materiales magnéticos', magnetismo: 'Qué atrae un imán',
    vocales: 'Sonido de las vocales', 'primer-sonido': 'Sonido inicial', 'ultimo-sonido': 'Sonido final', 'letra-sonido': 'Relación letra-sonido', 'letras-espejo': 'Letras espejo (b, d, p, q)', 'mayus-minus': 'Mayúsculas y minúsculas',
    silabas: 'Formar palabras con sílabas', 'silabas-trabadas': 'Sílabas trabadas', deletrear: 'Escribir palabras', dictado: 'Dictado', 'contar-silabas': 'Contar sílabas', rimas: 'Rimas',
    'leer-palabras': 'Leer palabras', 'leer-precision': 'Leer con precisión palabras parecidas', 'leer-frases': 'Leer frases', sintaxis: 'Ordenar oraciones', 'comprension-literal': 'Comprensión literal',
    secuencia: 'Secuencia de un cuento', 'lx-silabas': 'Leer sílabas', 'lx-palabras': 'Leer palabras nuevas', 'lx-precision': 'Leer con precisión (todas las letras)', 'lx-oraciones': 'Leer y entender oraciones', 'lx-relampago': 'Reconocer palabras de un vistazo', 'hy-palabras': 'Leer palabras de Hyrule', 'g-silabas': 'Leer sílaba por sílaba (palabras nuevas e inventadas)', 'g-bd': 'Distinguir b y d', 'g-espejo': 'Palabras espejo (es/se, la/al, el/le…)', 'g-trabadas': 'Sílabas trabadas', 'g-tren': 'Reconocer sílabas rápido', 'g-fluidez': 'Leer oraciones con ritmo y entenderlas', 'hy-frases': 'Leer frases de Hyrule', 'hy-verdad': 'Entender preguntas de Hyrule', inferencia: 'Inferencias', vocabulario: 'Vocabulario', opuestos: 'Opuestos', categorias: 'Categorías', sinonimos: 'Sinónimos',
  };
  const tagName = (t) => TAGS[t] || (t.startsWith('jw:') && GA.JUDO.byId[t.slice(3)] ? `Judo: “${GA.JUDO.byId[t.slice(3)].w}” (${GA.JUDO.byId[t.slice(3)].m})` : null) || (t.startsWith('ciclo-') ? 'Ciclo de vida: ' + t.slice(6) : t.startsWith('tabla-') ? 'Tabla del ' + t.slice(6) : t);

  GA.screens.parentsGate = function () {
    const a = GA.rand(6, 9), b = GA.rand(6, 9);
    const input = h('input', { class: 'name-input', id: 'gate-answer', inputmode: 'numeric', 'aria-label': 'Respuesta', style: { width: '160px' } });
    const err = h('div', { class: 'muted' }, '');
    const check = () => { if (parseInt(input.value, 10) === a * b) { document.getElementById('overlay').innerHTML = ''; GA.screens.parents(); } else { err.textContent = 'Respuesta incorrecta.'; input.value = ''; } };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    GA.ui.modal({
      title: '👪 Zona para adultos', text: `Para entrar, resuelve: <b>${a} × ${b}</b>`, body: h('div', { style: { display: 'grid', gap: '8px', justifyItems: 'center' } }, input, err),
      actions: [{ label: 'Entrar', cls: 'btn-ok', keep: true, onClick: check }, { label: 'Cancelar', cls: 'btn-white' }], dismissable: true,
    });
    setTimeout(() => input.focus(), 100);
  };

  function card(title, ...kids) { return h('section', { class: 'pp-card' }, title ? h('h2', null, title) : null, ...kids); }
  function stat(label, value, sub) { return h('div', { class: 'pp-stat' }, h('div', { class: 'v' }, value), h('div', { class: 'l' }, label), sub ? h('div', { class: 's' }, sub) : null); }

  function activityChart() {
    const days = GA.range(0, 13).map((i) => GA.addDays(GA.dayKey(), i - 13));
    const vals = days.map((k) => Math.round(((D().days[k] || {}).ms || 0) / 60000));
    const items = days.map((k) => (D().days[k] || {}).items || 0);
    const max = Math.max(10, ...vals);
    const W = 700, H = 220, L = 40, B = 34, T = 14, bw = (W - L - 10) / 14;
    const y = (v) => H - B - ((H - B - T) * v) / max;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="pp-chart" role="img" aria-label="Minutos de práctica de los últimos 14 días">`;
    const ticks = [0, Math.round(max / 2), max];
    ticks.forEach((t) => { s += `<line x1="${L}" x2="${W - 6}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="var(--ink-soft)">${t}</text>`; });
    vals.forEach((v, i) => {
      const x = L + i * bw + 6, isToday = i === 13;
      s += `<rect x="${x}" y="${y(v)}" width="${bw - 12}" height="${Math.max(0, H - B - y(v))}" rx="6" fill="${isToday ? 'var(--math)' : '#A99BF8'}"><title>${days[i]}: ${v} min, ${items[i]} ejercicios</title></rect>`;
      if (v) s += `<text x="${x + (bw - 12) / 2}" y="${y(v) - 5}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">${v}</text>`;
      const dd = days[i].slice(8);
      s += `<text x="${x + (bw - 12) / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="var(--ink-soft)">${dd}</text>`;
    });
    s += `<text x="${L}" y="11" font-size="12" fill="var(--ink-soft)">minutos</text></svg>`;
    return h('div', { class: 'pp-scroll', html: s });
  }

  function voicePicker() {
    const sel = h('select', { id: 'set-voicename', 'aria-label': 'Voz' });
    const tip = h('div', { class: 'pp-tip' });
    const fill = () => {
      const vs = GA.voice.list();
      sel.innerHTML = '';
      if (!vs.length) { sel.append(h('option', null, 'No hay voces en español en este navegador')); return; }
      vs.forEach((v) => {
        const q = GA.voice.quality(v);
        const icon = { natural: '⭐ Natural', buena: '👍 Buena', 'básica': '🤖 Básica', divertida: '🎭 Divertida' }[q];
        sel.append(h('option', { value: v.name, selected: GA.voice.v && GA.voice.v.name === v.name }, `${icon} · ${v.name} (${v.lang})`));
      });
      const best = GA.voice.quality(vs[0]);
      tip.innerHTML = best === 'natural' ? '✅ Tienes una voz natural instalada.'
        : `💡 <b>Para una voz mucho más natural</b> en Mac o iPad: Ajustes del Sistema → Accesibilidad → Contenido leído → Voz del sistema → <b>Administrar voces…</b> → Español (México) → descarga <b>Paulina (Premium)</b>. Después recarga esta página y elígela aquí.${/Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent) ? ' En Chrome también puedes usar la voz <b>Google español</b> (necesita internet).' : ''}`;
    };
    sel.addEventListener('change', () => { GA.settings().voiceName = sel.value; GA.store.save(); GA.voice.choose(); GA.say('¡Hola! Así voy a sonar cuando juegues.'); });
    GA.voice.onchange = () => { if (sel.isConnected) fill(); };
    fill();
    return h('div', { class: 'pp-voice' },
      h('div', { class: 'pp-row' }, h('label', { for: 'set-voicename' }, 'Voz:'), sel,
        h('button', { class: 'btn btn-sm btn-info', onclick: () => GA.say(`¡Hola ${D().name}! Vamos a contar: uno, dos, tres. ¿Flota o se hunde? ¡Muy bien pensado!`) }, '▶ Probar')),
      tip);
  }

  // Progreso lector: letras aprendidas, libritos leídos y palabras por minuto
  function readingCard() {
    const all = D().reading || [];
    const reads = all.filter((r) => !r.lang);
    const enReads = all.filter((r) => r.lang === 'en');
    const sil = E.st('lsil');
    const G = GA.LECTOR.GROUPS;
    const learned = sil.mastered ? G.length : sil.lvl - 1;
    const books = new Set(reads.map((r) => r.id)).size;
    const timed = reads.filter((r) => r.wpm).slice(-12);
    const last = timed.slice(-3);
    const avg = last.length ? Math.round(last.reduce((a, r) => a + r.wpm, 0) / last.length) : null;
    const max = Math.max(60, ...timed.map((r) => r.wpm));
    const byId = {}; [...Object.values(GA.LECTOR.BOOKS), ...Object.values(GA.HYRULE.TEXTS), ...Object.values(GA.HYRULE_EN.TEXTS)].flat().forEach((b) => { byId[b.id] = b; });
    const chart = timed.length ? h('div', { class: 'lx-wpm', role: 'img', 'aria-label': 'Palabras por minuto en las últimas lecturas' },
      timed.map((r) => h('div', { class: 'col', title: `${byId[r.id] ? byId[r.id].t : r.id}: ${r.wpm} ppm` },
        h('div', { class: 'bar', style: { height: Math.max(4, (r.wpm / max) * 100) + '%', background: 'var(--read)' } }), h('small', null, r.wpm)))) : null;
    return card('📖 Camino del lector',
      h('div', { class: 'pp-stats' },
        stat('Letras y sílabas', learned ? `${learned}/${G.length}` : '—', learned ? 'Ya domina: ' + G.slice(0, learned).map((g) => g.n).join(' · ') : 'Empezando: ' + G[0].n),
        stat('Libritos leídos', books, `${reads.length} ${reads.length === 1 ? 'lectura' : 'lecturas'} en total`),
        stat('Velocidad lectora', avg ? `${avg} ppm` : '—', avg ? 'promedio de las últimas 3 lecturas sin ayuda' : 'aparece al leer un librito sin “Leer conmigo”'),
        stat('Ritmo en el Gimnasio', `${(D().gym || {}).pace || 30} ppm`, `ritmo de “Oraciones veloces”; récord ${(D().gym || {}).max || 30} ppm`)),
      chart ? h('h3', { class: 'pp-h3' }, 'Palabras por minuto (últimas lecturas)') : null, chart,
      enReads.length ? h('p', null, `🇺🇸 Lecturas en inglés (Legends of Hyrule): ${enReads.length}, de ${new Set(enReads.map((r) => r.id)).size} textos distintos. No se mezclan con la velocidad en español.`) : null,
      h('p', { class: 'muted' }, 'Referencia de la SEP (México) para lectura en voz alta: 1º de primaria 35–59 ppm, 2º 60–84, 3º 85–99, 4º 100–114. Más importante que la velocidad es que lea con precisión, con expresión y que entienda.'),
      h('p', { class: 'muted' }, `💡 Para que la medición sea fiel, siéntense con ${D().name || 'Gael'} y pídanle que lea el librito en voz alta. Volver a leer los libritos de su “Biblioteca” (lectura repetida) es una de las mejores formas de ganar fluidez.`));
  }

  GA.screens.parents = function () {
    GA.voice.stop();
    const app = document.getElementById('app');
    app.innerHTML = '';
    window.scrollTo(0, 0);
    const d = D();
    const allDays = Object.entries(d.days).filter(([, v]) => v.items > 0);
    const last7 = GA.range(0, 6).map((i) => d.days[GA.addDays(GA.dayKey(), -i)]).filter(Boolean);
    const min7 = Math.round(last7.reduce((a, x) => a + (x.ms || 0), 0) / 60000);
    const items7 = last7.reduce((a, x) => a + x.items, 0), ok7 = last7.reduce((a, x) => a + x.ok, 0);
    const totalItems = allDays.reduce((a, [, v]) => a + v.items, 0);

    // Fortalezas y áreas de mejora
    const played = GA.skillList.filter((s) => E.st(s.id).hist.length > 0);
    const strengths = played.filter((s) => { const acc = E.accuracy(s.id, 12); return E.st(s.id).mastered || (acc >= 0.85 && E.st(s.id).hist.length >= 6); })
      .sort((a, b) => E.progress(b.id) - E.progress(a.id)).slice(0, 6);
    const support = played.filter((s) => { const st = E.st(s.id), acc = E.accuracy(s.id, 10); return (acc !== null && acc < 0.6 && st.hist.length >= 5) || st.downs > 0 || (st.rev && st.rev.slips >= 2); });
    const errTags = {};
    played.forEach((s) => Object.entries(E.st(s.id).err).forEach(([t, n]) => { errTags[t] = (errTags[t] || 0) + n; }));
    const topErr = Object.entries(errTags).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const due = E.dueReviews();

    // Recomendaciones
    const recs = [];
    if (!allDays.length) recs.push('Empiecen con la Misión del día: combina todos los mundos (incluido el Camino del Lector) y la app ubica automáticamente el nivel de inicio de cada habilidad.');
    if (min7 < 60 && allDays.length) recs.push('La investigación sobre práctica espaciada sugiere sesiones cortas y frecuentes: 15 a 20 minutos, 4 o 5 días por semana, funcionan mejor que una sesión larga.');
    if (due.length) recs.push(`Hay ${due.length} ${due.length === 1 ? 'habilidad' : 'habilidades'} con repaso pendiente (${due.map((s) => s.title).join(', ')}). La Misión del día los incluye automáticamente.`);
    support.slice(0, 3).forEach((s) => recs.push(`${s.icon} ${s.title}: está costando trabajo. Jueguen juntos una ronda y pídanle que explique en voz alta cómo lo piensa; usen objetos reales (fichas, monedas, juguetes) para practicar el mismo concepto.`));
    if (topErr.length) recs.push(`El error más frecuente es en “${tagName(topErr[0][0])}”. Una idea: busquen ejemplos de esto en la vida diaria (en la cocina, el súper o un paseo).`);
    const areaP = Object.keys(GA.AREAS).map((a) => [a, E.areaProgress(a)]).sort((a, b) => a[1] - b[1]);
    if (allDays.length && areaP[areaP.length - 1][1] - areaP[0][1] > 0.15) recs.push(`Ha avanzado más en ${GA.AREAS[areaP[areaP.length - 1][0]].short} que en ${GA.AREAS[areaP[0][0]].short}. Pueden entrar directamente a ${GA.AREAS[areaP[0][0]].world} para equilibrar.`);
    if (strengths.length) recs.push(`Celebren el esfuerzo, no sólo el resultado: “Te esforzaste mucho en ${strengths[0].title}” refuerza la mentalidad de crecimiento.`);

    const statusPill = (st) => h('span', { class: 'pp-pill', style: { background: st.color } }, st.label);
    const areaTables = Object.values(GA.AREAS).map((a) => card(`${a.icon} ${a.name} · ${Math.round(E.areaProgress(a.id) * 100)}%`,
      h('div', { class: 'pp-scroll' }, h('table', { class: 'pp-table ' + a.cls },
        h('thead', null, h('tr', null, ['Habilidad', 'Nivel', 'Progreso', 'Precisión', 'Estado', 'Próx. repaso', 'Ajustar nivel'].map((x) => h('th', null, x)))),
        h('tbody', null, GA.areaSkills(a.id).map((s) => {
          const st = E.st(s.id), acc = E.accuracy(s.id, 10), p = Math.round(E.progress(s.id) * 100);
          const sel = h('select', { id: 'lvl-' + s.id, 'aria-label': 'Nivel de ' + s.title, onchange: (e) => { E.setLevel(s.id, +e.target.value); GA.screens.parents(); } }, s.levels.map((l, i) => h('option', { value: i + 1, selected: st.lvl === i + 1 }, `${i + 1}. ${l}`)));
          return h('tr', null,
            h('td', null, `${s.icon} ${s.title}`, E.isUnlocked(s.id) ? '' : ' 🔒'),
            h('td', { class: 'num' }, st.mastered ? `${s.levels.length}/${s.levels.length} 🏅` : `${st.lvl}/${s.levels.length}`),
            h('td', null, h('div', { class: 'bar', style: { width: '110px' } }, h('i', { style: { width: Math.max(2, p) + '%' } }))),
            h('td', { class: 'num' }, acc === null ? '—' : Math.round(acc * 100) + '%'),
            h('td', null, statusPill(E.skillStatus(s.id))),
            h('td', { class: 'num' }, st.rev ? st.rev.due : '—'),
            h('td', null, sel));
        }))))));

    const S = GA.settings();
    const set = (k, v) => { S[k] = v; GA.store.save(); };
    const toggle = (k, label) => h('label', { class: 'pp-row' }, h('input', { type: 'checkbox', id: 'set-' + k, checked: !!S[k], onchange: (e) => set(k, e.target.checked) }), label);
    const nameIn = h('input', { id: 'set-name', class: 'pp-input', value: d.name, maxlength: 16, onchange: (e) => { d.name = e.target.value.trim() || 'Gael'; GA.store.save(); } });
    const exportTa = h('textarea', { id: 'export-data', class: 'pp-input', rows: 3, readonly: true }, GA.store.exportText());
    const importTa = h('textarea', { id: 'import-data', class: 'pp-input', rows: 3, placeholder: 'Pega aquí un respaldo para restaurarlo' });
    const msg = h('div', { class: 'muted', 'aria-live': 'polite' });
    const resetZone = h('div');
    const askReset = () => {
      resetZone.innerHTML = '';
      resetZone.append(h('div', { class: 'pp-warn' }, '¿Seguro? Se borrará todo el progreso, estrellas y estampas. Esto no se puede deshacer.',
        h('div', { class: 'pp-actions' }, h('button', { class: 'btn btn-sm', style: { '--b': 'var(--bad)', '--bd': 'var(--bad-d)' }, onclick: () => { GA.store.reset(); GA.screens.welcome(); } }, 'Sí, borrar todo'),
          h('button', { class: 'btn btn-sm btn-white', onclick: () => { resetZone.innerHTML = ''; } }, 'Cancelar'))));
    };

    app.append(h('div', { class: 'wrap pp' },
      h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => GA.screens.home() }, '⬅'), h('h1', { style: { marginRight: 'auto' } }, `Panel para padres · ${d.name}`)),
      h('div', { class: 'pp-stats' },
        stat('Minutos esta semana', min7), stat('Ejercicios esta semana', items7, items7 ? `${Math.round((ok7 / items7) * 100)}% correctos a la primera` : ''),
        stat('Días activos', allDays.length, `Racha actual: ${E.streak()}`), stat('Ejercicios totales', totalItems),
        stat('Aventuras dominadas', `${d.medals.length}/${GA.skillList.length}`), stat('Estrellas y estampas', `${d.stars} ⭐`, `${d.stickers.length} estampas`), stat('Dragones y figuras', `${GA.dragons.count()}/${GA.dragons.total()} 🐉`)),
      card('🧪 Modo prueba',
        h('p', { class: 'muted' }, 'Entra a cualquier aventura y nivel para probarlo tú. No cuenta en estadísticas ni da estrellas, dragones o Milkeritos.'),
        h('button', { class: 'btn', onclick: () => GA.screens.testLab() }, '🧪 Abrir modo prueba')),
      card('Actividad de los últimos 14 días', activityChart()),
      readingCard(),
      GA.judo.parentsCard(card, stat),
      h('div', { class: 'pp-grid' },
        card('💪 Fortalezas', strengths.length ? h('ul', null, strengths.map((s) => h('li', null, `${s.icon} ${s.title} — ${E.st(s.id).mastered ? 'dominado' : `nivel ${E.st(s.id).lvl}, ${Math.round(E.accuracy(s.id, 12) * 100)}% de precisión`}`))) : h('p', { class: 'muted' }, 'Aparecerán cuando haya más práctica.')),
        card('🌱 Áreas de mejora', support.length || topErr.length ? h('div', null,
          support.length ? h('ul', null, support.map((s) => h('li', null, `${s.icon} ${s.title}${E.st(s.id).downs ? ` — bajó de nivel ${E.st(s.id).downs} ${E.st(s.id).downs === 1 ? 'vez' : 'veces'} para reforzar` : ''}${E.st(s.id).rev && E.st(s.id).rev.slips >= 2 ? ' — se le olvida en los repasos' : ''}`))) : null,
          topErr.length ? h('div', null, h('h3', { class: 'pp-h3' }, 'Errores más frecuentes'), h('ul', null, topErr.map(([t, n]) => h('li', null, `${tagName(t)} (${n})`)))) : null)
          : h('p', { class: 'muted' }, 'Todavía no se detectan dificultades.'))),
      card('🧭 Recomendaciones', recs.length ? h('ul', null, recs.map((r) => h('li', null, r))) : h('p', { class: 'muted' }, '¡Todo va muy bien! Sigan con la Misión del día.')),
      areaTables,
      card('⚙️ Ajustes',
        h('div', { class: 'pp-row' }, h('label', { for: 'set-name' }, 'Nombre del niño:'), nameIn),
        toggle('voice', 'Voz en español (lee las instrucciones en voz alta)'),
        voicePicker(),
        toggle('autoRead', 'Leer cada instrucción automáticamente'),
        toggle('sfx', 'Efectos de sonido'),
        h('div', { class: 'pp-row' }, h('label', { for: 'set-rate' }, 'Velocidad de la voz:'), h('input', { type: 'range', id: 'set-rate', min: 0.6, max: 1.2, step: 0.05, value: S.rate, onchange: (e) => { set('rate', +e.target.value); GA.say('Así sueno ahora.'); } })),
        h('div', { class: 'pp-row' }, h('label', { for: 'set-round' }, 'Ejercicios por ronda:'), h('select', { id: 'set-round', onchange: (e) => set('roundLen', +e.target.value) }, [4, 5, 6, 8, 10].map((n) => h('option', { value: n, selected: S.roundLen === n }, n)))),
        toggle('unlockAll', 'Desbloquear todas las aventuras (sin límites de nivel ni edad)'),
        h('p', { class: 'muted' }, 'También puedes cambiar el nivel de cualquier habilidad en las tablas de arriba. La app sigue ajustando sola el nivel según sus respuestas.')),
      card('💾 Respaldo del progreso',
        h('p', { class: 'muted' }, 'El progreso se guarda en este navegador. Para pasarlo a otro dispositivo, copia este texto y pégalo en el otro.'),
        exportTa,
        h('div', { class: 'pp-actions' }, h('button', { class: 'btn btn-sm btn-info', onclick: () => {
          exportTa.select();
          (navigator.clipboard ? navigator.clipboard.writeText(exportTa.value) : Promise.reject()).then(() => { msg.textContent = 'Copiado.'; }).catch(() => { msg.textContent = 'Selecciona el texto y cópialo manualmente.'; });
        } }, 'Copiar respaldo')),
        importTa,
        h('div', { class: 'pp-actions' }, h('button', { class: 'btn btn-sm btn-white', onclick: () => {
          try { GA.store.importText(importTa.value); msg.textContent = 'Progreso restaurado.'; setTimeout(() => GA.screens.parents(), 600); }
          catch (e) { msg.textContent = 'Ese texto no es un respaldo válido. Copia el texto completo del otro dispositivo.'; }
        } }, 'Restaurar respaldo')),
        msg,
        h('div', { class: 'pp-actions' }, h('button', { class: 'btn btn-sm btn-white', onclick: askReset }, '🗑️ Borrar todo el progreso')), resetZone),
      card('🔬 Cómo aprende la app',
        h('ul', null,
          h('li', null, h('b', null, 'Nivel inicial automático: '), 'la primera vez que juega una habilidad, cada respuesta correcta lo sube un nivel, para no aburrirlo con lo que ya sabe.'),
          h('li', null, h('b', null, 'Dominio antes de avanzar: '), 'sube de nivel cuando acierta 4 de los últimos 5 ejercicios. Si se equivoca 3 de 4, baja un nivel y repasa con explicaciones.'),
          h('li', null, h('b', null, 'Repaso espaciado: '), 'cada nivel superado regresa en 1, 3, 7, 14, 30 y 60 días. Si se le olvida, el intervalo vuelve a empezar.'),
          h('li', null, h('b', null, 'Práctica intercalada: '), 'la Misión del día mezcla áreas y habilidades, lo que mejora la retención a largo plazo.'),
          h('li', null, h('b', null, 'Concreto → dibujo → símbolo: '), 'en matemáticas primero manipula objetos (bloques, marcos de diez, balanza) y después usa números.'),
          h('li', null, h('b', null, 'Predice, observa, explica: '), 'en ciencias hace una hipótesis antes de cada experimento virtual y siempre recibe la explicación.'),
          h('li', null, h('b', null, 'Lectura paso a paso: '), 'sonidos y rimas → sílabas → letras → palabras → frases → comprensión de cuentos.'),
          h('li', null, h('b', null, 'Error como aprendizaje: '), 'después de un error recibe una pista y otro intento; si vuelve a fallar, ve la solución explicada. Los elogios premian el esfuerzo y la estrategia.')))));
  };
})();
