/* Gael Aprende — pantallas: bienvenida, inicio, mundos, actividades, resumen y álbum */
(function () {
  'use strict';
  const { h } = GA;
  const E = GA.engine;
  const D = () => GA.store.data;
  const app = () => document.getElementById('app');

  const PRAISE = ['¡Excelente razonamiento!', '¡Lo pensaste muy bien!', '¡Tu cerebro está creciendo!', '¡Lo descubriste!', '¡Eres un gran científico!', '¡Qué buena idea!', '¡Muy bien pensado!', '¡Fantástico!', '¡Así se hace!', '¡Lo lograste!'];
  const PRAISE_RETRY = ['¡Lo lograste con esfuerzo!', '¡Bien! Intentar otra vez es de valientes.', '¡Muy bien! Aprendiste de tu error.'];

  function clear() { GA.voice.stop(); document.getElementById('overlay').innerHTML = ''; const fb = document.querySelector('.feedback'); if (fb) fb.remove(); app().innerHTML = ''; window.scrollTo(0, 0); }

  // ---------- Arte de los mundos ----------
  const ART = {
    math: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#7656F5"/><circle cx="270" cy="40" r="26" fill="#FFC233"/>
      <path d="M0 140 Q80 120 160 140 T320 140 V200 H0Z" fill="#5A8DFF"/><path d="M0 160 Q80 145 160 162 T320 158 V200 H0Z" fill="#3D6FE8"/>
      <ellipse cx="150" cy="148" rx="90" ry="22" fill="#FFD98A"/><path d="M150 146 q-4 -50 8 -78" stroke="#8C6A4A" stroke-width="7" fill="none"/>
      <path d="M158 68 q-30 -10 -48 8 q24 -4 48 -8 q-8 -26 -36 -30 q22 12 36 30 q20 -22 46 -18 q-26 6 -46 18 q32 -2 44 20 q-22 -14 -44 -20" fill="#26BF63"/>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff"><text x="40" y="70" font-size="44" opacity=".95">3</text><text x="78" y="44" font-size="30" opacity=".8">+</text><text x="224" y="110" font-size="40">7</text><text x="196" y="60" font-size="28" opacity=".8">×</text><text x="262" y="132" font-size="26" opacity=".7">=</text></g></svg>`,
    ciencia: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#12A876"/><circle cx="60" cy="44" r="18" fill="#E8F5FF" opacity=".9"/><circle cx="54" cy="40" r="18" fill="#12A876"/>
      <path d="M0 150 Q60 120 120 150 T240 145 T320 140 V200 H0Z" fill="#0E8A60"/>
      <g fill="#0B6B4A"><path d="M30 160 l22 -70 l22 70z"/><path d="M262 156 l20 -64 l20 64z"/><path d="M230 160 l16 -48 l16 48z"/></g>
      <path d="M140 70 h40 M146 70 v34 l-26 50 a8 8 0 0 0 7 12 h66 a8 8 0 0 0 7 -12 l-26 -50 v-34" fill="#E9FBFF" stroke="#fff" stroke-width="5"/>
      <path d="M128 140 l-6 12 a8 8 0 0 0 7 12 h62 a8 8 0 0 0 7 -12 l-6 -12z" fill="#FF7AC6"/>
      <g fill="#FF7AC6"><circle cx="160" cy="54" r="7"/><circle cx="174" cy="36" r="5"/><circle cx="152" cy="26" r="4"/></g>
      <circle cx="250" cy="52" r="16" fill="#FFC233"/><ellipse cx="250" cy="52" rx="28" ry="7" fill="none" stroke="#FFE7A3" stroke-width="4" transform="rotate(-18 250 52)"/></svg>`,
    lengua: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#FF7433"/><path d="M0 160 Q90 140 180 160 T320 155 V200 H0Z" fill="#E05A1C"/>
      <g fill="#FFE3CF"><rect x="110" y="80" width="100" height="90"/><rect x="96" y="60" width="30" height="110"/><rect x="194" y="60" width="30" height="110"/>
      <path d="M96 60 l15 -26 l15 26z M194 60 l15 -26 l15 26z" fill="#7656F5"/><rect x="146" y="124" width="28" height="46" rx="14" fill="#8C4A2F"/></g>
      <g fill="#E05A1C"><rect x="110" y="72" width="10" height="10"/><rect x="130" y="72" width="10" height="10"/><rect x="150" y="72" width="10" height="10"/><rect x="170" y="72" width="10" height="10"/><rect x="190" y="72" width="10" height="10"/></g>
      <path d="M111 34 v-14 l14 6z M209 34 v-14 l14 6z" fill="#FFC233"/>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff"><text x="30" y="80" font-size="46">A</text><text x="250" y="70" font-size="40">b</text><text x="62" y="130" font-size="30" opacity=".8">c</text><text x="262" y="128" font-size="34" opacity=".85">Ñ</text></g></svg>`,
    lector: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#E2457F"/>
      <path d="M0 165 Q90 140 170 160 T320 150 V200 H0Z" fill="#C2306A"/>
      <g fill="#FFD6E6" opacity=".9"><rect x="40" y="150" width="34" height="14" rx="4"/><rect x="88" y="132" width="34" height="14" rx="4"/><rect x="136" y="114" width="34" height="14" rx="4"/><rect x="184" y="96" width="34" height="14" rx="4"/><rect x="232" y="78" width="34" height="14" rx="4"/></g>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#C2306A" font-size="12" text-anchor="middle"><text x="57" y="161">ma</text><text x="105" y="143">sol</text><text x="153" y="125">luna</text><text x="201" y="107">frase</text><text x="249" y="89">libro</text></g>
      <g transform="translate(249 50)"><path d="M0 -26 L7 -8 L26 -8 L11 3 L17 22 L0 10 L-17 22 L-11 3 L-26 -8 L-7 -8Z" fill="#FFC233"/></g>
      <g transform="translate(92 70)"><path d="M-48 -26 Q-24 -36 0 -24 Q24 -36 48 -26 V30 Q24 20 0 32 Q-24 20 -48 30Z" fill="#fff"/><path d="M0 -24 V32" stroke="#E2457F" stroke-width="3"/>
      <g stroke="#F5A3C2" stroke-width="3" stroke-linecap="round"><path d="M-38 -12 H-10 M-38 -2 H-10 M-38 8 H-14 M10 -12 H38 M10 -2 H38 M10 8 H32"/></g></g>
      <g fill="#fff" font-family="Baloo 2, sans-serif" font-weight="800"><text x="22" y="40" font-size="30" opacity=".85">a</text><text x="170" y="44" font-size="26" opacity=".7">ñ</text><text x="292" y="140" font-size="28" opacity=".8">e</text></g></svg>`,
    hyrule: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#2E8B57"/>
      <path d="M0 160 Q90 136 180 158 T320 150 V200 H0Z" fill="#1E6B41"/>
      <g transform="translate(160 92)"><path d="M0 -58 L34 0 H-34Z M-34 0 L0 58 H-68Z M34 0 L68 58 H0Z" fill="#FFD54A" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/></g>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff"><text x="20" y="62" font-size="36">¡Hola!</text><text x="240" y="58" font-size="30" opacity=".9">ABC</text>
      <text x="30" y="132" font-size="22" opacity=".8">espada</text><text x="244" y="126" font-size="22" opacity=".8">arco</text></g></svg>`,
    ingles: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#2F6FE0"/>
      <path d="M0 160 Q90 136 180 158 T320 150 V200 H0Z" fill="#1F4FB0"/>
      <g transform="translate(160 92)"><path d="M0 -58 L34 0 H-34Z M-34 0 L0 58 H-68Z M34 0 L68 58 H0Z" fill="#FFD54A" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/></g>
      <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff"><text x="26" y="62" font-size="40">Hi!</text><text x="236" y="58" font-size="30" opacity=".9">ABC</text>
      <text x="40" y="132" font-size="22" opacity=".8">sword</text><text x="238" y="126" font-size="22" opacity=".8">bow</text></g></svg>`,
  };

  // ---------- Bienvenida ----------
  GA.screens.welcome = function () {
    clear();
    const avatars = ['🦊', '🐼', '🦁', '🐯', '🐸', '🦄', '🐙', '🐵', '🦖', '🚀', '🦉', '🐬'];
    let av = D().avatar || '🦊';
    const input = h('input', { class: 'name-input', id: 'child-name', value: D().name || 'Gael', maxlength: 16, 'aria-label': 'Nombre' });
    const avs = h('div', { class: 'avatars' }, avatars.map((a) => h('button', { class: 'avatar-opt' + (a === av ? ' sel' : ''), onclick: (e) => { av = a; GA.$$('.avatar-opt').forEach((x) => x.classList.remove('sel')); e.currentTarget.classList.add('sel'); GA.sfx.play('pop'); } }, a)));
    app().append(h('div', { class: 'wrap welcome' }, h('div', { class: 'welcome-card' },
      h('div', { html: GA.mascot('happy', 130) }),
      h('h1', null, '¡Hola! Soy Lumi'),
      h('p', { class: 'muted', style: { fontSize: '1.2rem', margin: 0 } }, 'Vamos a explorar números, experimentos y cuentos. ¿Cómo te llamas?'),
      input, h('div', { class: 'muted' }, 'Elige tu compañero:'), avs,
      h('button', { class: 'btn btn-big btn-ok', onclick: () => {
        D().name = (input.value || 'Gael').trim().slice(0, 16); D().avatar = av; GA.store.save();
        GA.sfx.play('level'); GA.say(`¡Hola ${D().name}! ¡Vamos a aprender jugando!`);
        GA.screens.home();
      } }, '¡Empezar la aventura! 🚀'))));
  };

  // ---------- Inicio ----------
  function greeting() {
    const n = D().name, info = E.missionInfo(), hr = new Date().getHours();
    const hola = hr < 12 ? 'Buenos días' : hr < 19 ? 'Buenas tardes' : 'Buenas noches';
    if (info.reviews) return `${hola}, ${n}. Hoy tengo ${info.reviews} ${info.reviews === 1 ? 'repaso' : 'repasos'} para que nada se te olvide. ¿Empezamos la misión?`;
    if (!Object.keys(D().days).length) return `¡Hola, ${n}! Toca la misión del día o elige un mundo para explorar.`;
    return `${hola}, ${n}. ¡Tu cerebro es como un músculo: cada día que practicas se hace más fuerte!`;
  }
  function caveCard() {
    const owned = GA.dragons.ALL.filter((x) => (D().dragons || {})[x.id]);
    const rank = { comun: 0, raro: 1, epico: 2, legendario: 3 };
    const best = owned.slice().sort((x, y) => rank[y.e.r] - rank[x.e.r] || D().dragons[y.id].n - D().dragons[x.id].n).filter((x, i, arr) => arr.findIndex((z) => z.e.id === x.e.id) === i);
    const sp = GA.dragons.SPECIAL.filter((f) => (D().dragons || {})[f.id]);
    const show = owned.length ? best.slice(0, 3) : GA.dragons.ALL.filter((x) => ['fuego-chispa', 'hielo-pluma', 'galaxia-rey'].includes(x.id));
    const arts = [...sp.slice(-2).map((f) => h('div', { class: 'cave-banner-sp', html: GA.dragons.specialArt(f, 96) })),
      ...show.slice(0, 3 - Math.min(2, sp.length)).map((x) => h('div', { html: GA.dragons.svg(x, owned.length ? GA.dragons.stageOf(D().dragons[x.id].n) : 1, { size: 110, sil: !owned.length }) }))];
    const n = GA.dragons.count();
    return h('button', { class: 'cave-banner', onclick: () => { GA.sfx.play('tap'); GA.screens.dragons(); } },
      h('div', { class: 'cave-banner-dr' }, arts),
      h('div', null, h('h2', null, '🐉 Mi cueva de dragones'),
        h('p', null, n ? `Tienes ${n} de ${GA.dragons.total()} dragones y figuras. ¡Cada respuesta correcta hace nacer un huevo!` : '¡Responde bien en cualquier juego y nacerá tu primer dragón! A veces sale un huevo dorado con Chimuelo o un Milkerito.')),
      h('span', { class: 'btn btn-sun' }, 'Ver ➜'));
  }
  GA.screens.home = function () {
    clear();
    const d = D();
    const info = E.missionInfo();
    const msg = greeting();
    const worlds = Object.values(GA.AREAS).map((a) => {
      const sk = GA.areaSkills(a.id);
      const mastered = sk.filter((s) => E.st(s.id).mastered).length;
      const p = Math.round(E.areaProgress(a.id) * 100);
      return h('button', { class: 'world-card ' + a.cls, onclick: () => { GA.sfx.play('tap'); GA.screens.world(a.id); } },
        h('div', { class: 'art', html: ART[a.id] }),
        h('div', { class: 'info' }, h('h3', null, a.world), h('div', { class: 'sub' }, a.blurb), h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': p }, h('i', { style: { width: Math.max(3, p) + '%' } })),
          h('div', { class: 'sub' }, `${mastered} de ${sk.length} aventuras dominadas`)));
    });
    app().append(h('div', { class: 'wrap' },
      h('div', { class: 'topbar' },
        h('div', { class: 'who' }, h('div', { class: 'avatar' }, d.avatar), h('div', { class: 'hello' }, d.name)),
        h('span', { class: 'chip', title: 'Estrellas' }, '⭐ ', d.stars),
        h('span', { class: 'chip', title: 'Días seguidos' }, '🔥 ', E.streak()),
        h('button', { class: 'chip chip-btn', 'aria-label': 'Mi cueva de dragones', onclick: () => GA.screens.dragons() }, '🐉 ', GA.dragons.count()),
        h('button', { class: 'icon-btn', 'aria-label': 'Mi álbum', onclick: () => GA.screens.album() }, '📒'),
        h('button', { class: 'icon-btn', 'aria-label': 'Panel para padres', onclick: () => GA.screens.parentsGate() }, '👪')),
      h('div', { class: 'home-hero' }, h('div', { html: GA.mascot('happy', 100) }), h('div', { class: 'bubble', onclick: () => GA.say(msg) }, msg, ' ', h('span', { style: { opacity: 0.6 } }, '🔊'))),
      h('div', { class: 'mission' },
        h('div', null, h('h2', null, '🎯 Misión del día'),
          h('p', null, 'Un poquito de todo, mezclado como les gusta a los cerebros curiosos.'),
          h('div', { class: 'pills' }, info.reviews ? h('span', { class: 'pill' }, `🔁 ${info.reviews} ${info.reviews === 1 ? 'repaso' : 'repasos'}`) : null,
            info.skills.map((s) => h('span', { class: 'pill' }, `${s.icon} ${s.title}`)))),
        h('button', { class: 'btn btn-big btn-white', onclick: () => { GA.sfx.play('tap'); GA.run(E.dailyMission(), { title: 'Misión del día', mission: true }); } }, '¡Jugar! ▶')),
      h('h2', { class: 'section-title' }, 'Elige un mundo'),
      h('div', { class: 'worlds' }, worlds),
      caveCard()));
  };

  // ---------- Mundo ----------
  GA.screens.world = function (areaId) {
    clear();
    const a = GA.AREAS[areaId];
    const nodes = GA.areaSkills(areaId).map((s) => {
      const st = E.st(s.id), open = E.isUnlocked(s.id), n = s.levels.length;
      const due = st.rev && st.rev.due <= GA.dayKey();
      const p = Math.round(E.progress(s.id) * 100);
      return h('button', { class: 'node' + (open ? '' : ' locked'), onclick: () => skillSheet(s) },
        st.mastered ? h('span', { class: 'badge' }, '🏅') : !open ? h('span', { class: 'badge' }, '🔒') : null,
        due && open ? h('span', { class: 'tag' }, '🔁 Repaso') : open && !st.hist.length ? h('span', { class: 'tag' }, '✨ Nuevo') : null,
        h('div', { class: 'ring', style: { '--p': p } }, h('span', null, s.icon)),
        h('h3', null, s.title),
        h('div', { class: 'dots' }, GA.range(1, n).map((i) => h('i', { class: st.mastered || i < st.lvl ? 'on' : '' }))),
        h('div', { class: 'lvl' }, open ? (st.mastered ? '¡Dominado!' : `Nivel ${st.lvl}: ${s.levels[st.lvl - 1]}`) : 'Bloqueado'));
    });
    app().append(h('div', { class: a.cls },
      h('div', { class: 'world-head' }, h('div', { class: 'row' },
        h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => GA.screens.home() }, '⬅'),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('h1', null, `${a.icon} ${a.world}`), h('p', null, a.name + ' · ' + a.blurb)),
        h('span', { class: 'chip', style: { color: 'var(--c-d)' } }, `${Math.round(E.areaProgress(areaId) * 100)}%`))),
      h('div', { class: 'wrap' }, h('div', { class: 'trail' }, nodes))));
  };

  function skillSheet(s) {
    GA.sfx.play('tap');
    const st = E.st(s.id), open = E.isUnlocked(s.id);
    const due = st.rev && st.rev.due <= GA.dayKey();
    const levels = h('div', { style: { display: 'grid', gap: '6px', width: '100%', textAlign: 'left' } }, s.levels.map((l, i) => h('div', { class: 'chip', style: { justifyContent: 'space-between', background: i + 1 === st.lvl && !st.mastered ? 'var(--c-l)' : '#fff' } }, h('span', null, `Nivel ${i + 1}: ${l}`), h('span', null, st.mastered || i + 1 < st.lvl ? '⭐' : i + 1 === st.lvl ? '👉' : ''))));
    const actions = [];
    if (open) {
      actions.push({ label: st.mastered ? '▶ Practicar' : '▶ ¡Jugar!', cls: 'btn-big', onClick: () => GA.run(E.skillRound(s.id), { title: s.title }) });
      if (due) actions.push({ label: '🔁 Repasar', cls: 'btn-info', onClick: () => GA.run(GA.range(1, 4).map(() => ({ skill: s.id, mode: 'review', lvl: st.rev.l })), { title: 'Repaso: ' + s.title }) });
      if (s.sandbox) actions.push({ label: s.sandboxLabel || '🧪 Explorar libre', cls: 'btn-sun', onClick: () => GA.screens.sandbox(s) });
    }
    actions.push({ label: 'Cerrar', cls: 'btn-white' });
    GA.ui.modal({
      title: `${s.icon} ${s.title}`, text: s.desc + (open ? '' : `<br><br>🔒 Para abrirla, primero juega: <b>${E.lockText(s.id)}</b>.`),
      body: levels, actions, dismissable: true, say: open ? `${s.title}. ${s.desc}` : `Esta aventura se abre cuando avances en ${E.lockText(s.id)}.`,
    });
    const m = document.querySelector('.modal');
    if (m) m.classList.add(GA.AREAS[s.area].cls);
  }

  // ---------- Exploración libre ----------
  GA.screens.sandbox = function (s, back, opts) {
    clear();
    const a = GA.AREAS[s.area];
    const stage = h('div', { class: 'stage' });
    app().append(h('div', { class: 'wrap run ' + a.cls },
      h('div', { class: 'run-top' }, h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => (back ? back() : GA.screens.world(s.area)) }, '⬅'), h('h2', null, s.sandboxLabel ? `${s.sandboxLabel}` : `🧪 ${s.title}: explorar libre`)),
      stage));
    s.sandbox(stage, opts || {});
    GA.say(s.sandboxLabel ? '¡Bienvenido a tu biblioteca! Escoge un librito.' : 'Modo explorar. ¡Experimenta todo lo que quieras!');
  };

  // ---------- Corredor de actividades ----------
  GA.run = function (queue, opts = {}) {
    clear();
    if (!queue.length) { GA.screens.home(); return; }
    const test = !!opts.test; // modo prueba para papás: no guarda nada ni da premios
    const S = { queue, i: 0, results: [], ctx: {}, t0: Date.now(), stars0: D().stars, events: [], startLv: {}, seen: {} };
    queue.forEach((q) => { if (!(q.skill in S.startLv)) S.startLv[q.skill] = E.st(q.skill).lvl; });
    const dots = h('div', { class: 'dots' }, queue.map(() => h('i')));
    const starChip = h('span', { class: 'chip' }, '⭐ ', h('b', null, D().stars));
    const dragonChip = h('span', { class: 'chip', title: 'Dragones' }, '🐉 ', h('b', null, GA.dragons.count()));
    const lumi = h('div', { class: 'lumi-mini', html: GA.mascot('happy', 58) });
    const txt = h('div', { class: 'txt' });
    let curSay = '', curLang;
    const sayBtn = h('button', { class: 'icon-btn say', 'aria-label': 'Escuchar la instrucción', onclick: () => GA.say(curSay, { lang: curLang }) }, '🔊');
    const tagLine = h('div', { class: 'skill-tag' });
    const stage = h('div', { class: 'stage' });
    const root = h('div', { class: 'wrap run' },
      h('div', { class: 'run-top' },
        h('button', { class: 'icon-btn', 'aria-label': 'Salir', onclick: exitAsk }, '✖'), dots, ...(test ? [h('span', { class: 'chip test-chip' }, '🧪 Prueba')] : [dragonChip, starChip])),
      h('div', { class: 'prompt' }, lumi, txt, sayBtn), tagLine, stage);
    const fb = h('div', { class: 'feedback' });
    app().append(root);
    document.body.append(fb);

    const setMood = (m) => { lumi.innerHTML = GA.mascot(m, 58); };
    const setText = (t, say, lang) => { txt.textContent = t; curSay = say || t; curLang = lang; };

    function exitAsk() {
      GA.ui.modal({ mascot: 'calm', title: '¿Terminar por ahora?', text: test ? 'Modo prueba: nada de esto se guarda.' : 'Tu avance ya está guardado.', actions: [
        { label: 'Seguir jugando', cls: 'btn-ok' },
        { label: 'Salir', cls: 'btn-white', onClick: () => (test ? GA.screens.testLab() : GA.screens.home()) },
      ] });
    }

    function next() {
      fb.classList.remove('show');
      document.body.style.paddingBottom = '';
      if (S.i >= queue.length) return summary();
      const entry = queue[S.i];
      const skill = GA.skills[entry.skill];
      const lvl = entry.mode === 'review' || test ? entry.lvl : E.st(skill.id).lvl;
      root.className = 'wrap run ' + GA.AREAS[skill.area].cls;
      GA.$$('i', dots).forEach((d, k) => d.classList.toggle('cur', k === S.i));
      tagLine.innerHTML = '';
      tagLine.append(`${skill.icon} ${skill.title} · Nivel ${lvl}: ${skill.levels[lvl - 1]}`);
      if (test) tagLine.append(h('span', { class: 'chip test-chip', style: { marginLeft: '8px', fontSize: '.85rem' } }, '🧪 Modo prueba'));
      else if (entry.mode === 'review') tagLine.append(h('span', { class: 'chip', style: { marginLeft: '8px', fontSize: '.85rem' } }, '🔁 Repaso'));
      const lkey = skill.id + ':' + lvl;
      if (test && skill.lessons && skill.lessons[lvl] && !S.seen[lkey]) return lesson(skill, lvl, () => { S.seen[lkey] = 1; next(); });
      if (!test && entry.mode !== 'review' && skill.lessons && skill.lessons[lvl] && !D().lessons[lkey]) return lesson(skill, lvl, () => { D().lessons[lkey] = 1; GA.store.save(); next(); });
      S.ctx[skill.id] = S.ctx[skill.id] || {};
      let item;
      try { item = skill.make(lvl, S.ctx[skill.id]); }
      catch (err) { console.error('Error creando actividad', skill.id, lvl, err); S.i++; return next(); }
      present(entry, skill, lvl, item);
    }

    function lesson(skill, lvl, done) {
      const steps = skill.lessons[lvl];
      let k = 0;
      setMood('wow');
      const show = () => {
        const st = steps[k];
        setText(`Aprende: ${skill.title}`, st.say);
        stage.innerHTML = '';
        stage.append(
          h('div', { class: 'chip', style: { background: 'var(--c)', color: '#fff' } }, '💡 ¡Aprende algo nuevo!'),
          h('div', { class: 'lesson-viz', html: st.html || '' }),
          h('div', { class: 'word-problem', style: { fontSize: '1.35rem' } }, st.say),
          h('div', { class: 'lesson-steps' }, steps.map((_, j) => h('i', { class: j <= k ? 'on' : '' }))),
          h('div', { class: 'actions' }, h('button', { class: 'btn btn-white', onclick: () => GA.say(st.say) }, '🔊 Otra vez'),
            h('button', { class: 'btn btn-big', onclick: () => { GA.sfx.play('tap'); k++; if (k < steps.length) show(); else { setMood('happy'); done(); } } }, k < steps.length - 1 ? 'Siguiente ➜' : '¡A practicar! ➜')));
        GA.say(st.say);
      };
      show();
    }

    function present(entry, skill, lvl, item) {
      let tries = 0, hint = false, done = false;
      const t = Date.now();
      setMood('happy');
      setText(item.text, item.say || item.text, item.sayLang);
      stage.innerHTML = '';
      const api = {
        answer(ok, o = {}) {
          if (done) return 'done';
          if (ok) { done = true; finish(tries === 0 && !hint ? 1 : 0.5); return 'ok'; }
          tries++;
          if (tries < 2 && !o.final) {
            GA.sfx.play('bad'); setMood('think');
            const tip = item.hint || 'Mira con calma y vuelve a intentarlo.';
            showFb('retry', GA.pick(['¡Casi!', '¡Uy, casi!', 'Mmm… piénsalo otra vez']), '💡 ' + tip, null);
            GA.say('Casi. ' + tip);
            clearTimeout(api._t); api._t = setTimeout(() => { if (!done) { fb.classList.remove('show'); setMood('happy'); } }, 3200);
            return 'retry';
          }
          done = true; GA.sfx.play('bad'); finish(0); return 'done';
        },
        hintUsed() { hint = true; },
        setText: (tx, lang) => setText(tx, tx, lang),
        test,
        say: GA.say,
      };
      function finish(score) {
        clearTimeout(api._t);
        const ev = test ? [] : E.record(skill.id, lvl, score, Date.now() - t, entry.mode, item.tag);
        if (!test) E.addTime(Date.now() - t);
        S.events.push(...ev.map((e) => Object.assign({ skill: skill.id }, e)));
        S.results.push({ skill: skill.id, score });
        const dot = GA.$$('i', dots)[S.i];
        dot.classList.remove('cur'); dot.classList.add(score === 1 ? 'ok' : score > 0 ? 'half' : 'no');
        starChip.querySelector('b').textContent = D().stars;
        S.i++;
        const go = () => showEvents(ev, next);
        if (score > 0) {
          GA.sfx.play('ok'); setMood('wow');
          if (score === 1) GA.confetti(50, 0.5);
          const title = score === 1 ? GA.pick(PRAISE) : GA.pick(PRAISE_RETRY);
          if (test) {
            showFb('good', title, item.fact || '', null, go, null, '🧪 Modo prueba: sin premios ni estadísticas.');
            GA.say(title + (item.fact ? ' ' + item.fact : ''));
            return;
          }
          GA.flyStar(stage, starChip);
          const dr = GA.dragons.award();
          dragonChip.querySelector('b').textContent = GA.dragons.count();
          const dmsg = GA.dragons.message(dr);
          if ((dr.isNew && (dr.special || dr.d.e.r === 'epico' || dr.d.e.r === 'legendario')) || dr.grew) ev.unshift({ type: 'dragon', r: dr });
          showFb('good', title, (item.fact ? item.fact + ' ' : ''), null, go, GA.dragons.hatchEl(dr, innerWidth < 560 ? 110 : 140), '🐉 ' + dmsg);
          if (dr.isNew || dr.grew) setTimeout(() => GA.sfx.play('level'), 900); else setTimeout(() => GA.sfx.play('pop'), 900);
          GA.say(title + (item.fact ? ' ' + item.fact : '') + ' ' + dmsg);
        } else {
          setMood('calm');
          const ex = item.explain || { text: '' };
          showFb('explain', '¡Así se resuelve!', ex.text, ex.html, go);
          if (item.lang === 'en') GA.say('Mira cómo se resuelve.').then(() => GA.say(ex.text, { lang: 'en' }));
          else GA.say('Mira cómo se resuelve. ' + ex.text);
        }
      }
      try { item.render(stage, api); }
      catch (err) { console.error('Error en actividad', skill.id, err); stage.innerHTML = ''; S.i++; next(); return; }
      if (GA.settings().autoRead) setTimeout(() => GA.say(item.say || item.text, { lang: item.sayLang }), 250);
    }

    function showFb(kind, title, text, html, onContinue, iconEl, extra) {
      fb.className = 'feedback ' + kind;
      fb.innerHTML = '';
      const icon = { good: '🎉', retry: '🤔', explain: '💡' }[kind];
      fb.append(h('div', { class: 'in' },
        iconEl || h('div', { style: { fontSize: '3rem' } }, icon),
        h('div', null, h('h3', null, title), text ? h('p', null, text) : null, extra ? h('p', { class: 'dragon-msg' }, extra) : null),
        onContinue ? h('button', { class: 'btn btn-big ' + (kind === 'good' ? 'btn-ok' : 'btn-info'), onclick: () => { GA.sfx.play('tap'); GA.voice.stop(); onContinue(); } }, kind === 'good' ? 'Continuar ➜' : 'Entendido ➜') : null,
        html ? h('div', { class: 'explain-viz', html }) : null));
      requestAnimationFrame(() => fb.classList.add('show'));
      if (onContinue) document.body.style.paddingBottom = fb.offsetHeight + 20 + 'px';
    }

    function showEvents(evs, done) {
      fb.classList.remove('show');
      const list = evs.slice();
      const step = () => {
        const e = list.shift();
        if (!e) return done();
        const s = GA.skills[e.skill || queue[Math.max(0, S.i - 1)].skill];
        const sk = e.skill ? GA.skills[e.skill] : s;
        if (e.type === 'levelup') {
          GA.sfx.play('level'); GA.confetti(140);
          GA.ui.modal({ mascot: 'wow', title: '¡Subiste de nivel! 🚀', text: `<b>${sk.title}</b><br>Nivel ${e.to}: ${sk.levels[e.to - 1]}`, say: `¡Subiste de nivel! Ahora: ${sk.levels[e.to - 1]}.`, actions: [{ label: '¡Genial! ➜', cls: 'btn-ok', onClick: step }] });
        } else if (e.type === 'placement') {
          GA.sfx.play('star');
          GA.ui.modal({ mascot: 'wow', title: '¡Ya sabes esto!', text: `Saltamos al nivel ${e.to}: ${sk.levels[e.to - 1]}`, say: `¡Ya sabes esto! Saltamos al nivel ${e.to}.`, actions: [{ label: '¡Vamos! ➜', cls: 'btn-ok', onClick: step }] });
        } else if (e.type === 'leveldown') {
          GA.ui.modal({ mascot: 'calm', title: 'Vamos a practicar un poquito más', text: `Volvemos al nivel ${e.to}: ${sk.levels[e.to - 1]}. ¡Practicar es lo que hace crecer al cerebro!`, say: 'Vamos a practicar un poquito más. ¡Así es como el cerebro aprende!', actions: [{ label: '¡De acuerdo! ➜', cls: 'btn-ok', onClick: step }] });
        } else if (e.type === 'mastered') {
          GA.sfx.play('level'); GA.confetti(200);
          GA.ui.modal({ mascot: 'wow', title: '🏅 ¡Lo dominaste!', text: `Completaste todos los niveles de <b>${sk.title}</b>. Lo repasaremos de vez en cuando para que nunca se te olvide.`, say: `¡Increíble! Dominaste ${sk.title}.`, actions: [{ label: '¡Sí! ➜', cls: 'btn-ok', onClick: step }] });
        } else if (e.type === 'sticker') {
          GA.sfx.play('star');
          GA.ui.modal({ title: '¡Nueva estampa!', body: h('div', { class: 'levelup-burst' }, e.sticker), text: 'Ya está en tu álbum.', say: '¡Ganaste una estampa nueva para tu álbum!', actions: [{ label: 'Guardar ➜', cls: 'btn-ok', onClick: step }] });
        } else if (e.type === 'dragon') {
          const r = e.r, R = GA.dragons.RARITY[r.d.e.r];
          GA.sfx.play('level'); GA.confetti(160);
          GA.ui.modal({
            title: r.special ? '🥚✨ ¡Huevo dorado!' : r.grew ? `¡${r.d.name} creció!` : (r.d.kind === 'milk' ? `¡Milkerito ${R.n.toLowerCase()}!` : `¡Dragón ${R.n.toLowerCase()}!`),
            body: h('div', { style: { display: 'grid', justifyItems: 'center', gap: '8px' } },
              r.special ? h('div', { class: 'sp-big', style: { '--glow': r.f.color }, html: GA.dragons.specialArt(r.f, 280) })
                : h('div', { class: 'dragon-stage-bg', html: GA.dragons.svg(r.d, r.stage, { size: r.d.kind === 'milk' ? 230 : 300 }) }),
              h('div', { class: 'chip', style: { background: R.color, color: '#fff' } }, r.special ? `${r.f.name} · ${R.n}` : `${r.d.name} · ${GA.dragons.stageName(r.d, r.stage)}`)),
            text: r.special ? `¡Encontraste una figura especial! ${r.f.fact}` : r.grew ? `Ahora es ${GA.dragons.stageName(r.d, r.stage)}. ¡Mira qué grande y poderoso está!` : 'Es muy difícil de encontrar. ¡Ya vive en tu cueva!',
            say: r.special ? `¡Huevo dorado! ¡Encontraste a ${r.f.name}!` : r.grew ? `¡${r.d.name} creció! Ahora es ${GA.dragons.stageName(r.d, r.stage)}.` : `¡Increíble! Encontraste a ${r.d.name}, ${R.n.toLowerCase()}.`,
            actions: [{ label: '¡Wow! ➜', cls: 'btn-ok', onClick: step }],
          });
        } else if (e.type === 'unlock') {
          const target = GA.skills[e.skill];
          GA.ui.modal({ mascot: 'wow', title: '🔓 ¡Nueva aventura!', text: `Se abrió: <b>${target.icon} ${target.title}</b>`, say: `¡Se abrió una nueva aventura: ${target.title}!`, actions: [{ label: '¡Genial! ➜', cls: 'btn-ok', onClick: step }] });
        } else step();
      };
      step();
    }

    function summary() {
      fb.remove();
      document.body.style.paddingBottom = '';
      if (test) return testSummary();
      const got = D().stars - S.stars0;
      const okN = S.results.filter((r) => r.score === 1).length;
      const skills = [...new Set(queue.map((q) => q.skill))];
      const rows = skills.map((id) => {
        const s = GA.skills[id], st = E.st(id), p = Math.round(E.progress(id) * 100);
        const up = st.lvl > S.startLv[id] || st.mastered;
        return h('div', { class: 'skill-row ' + GA.AREAS[s.area].cls },
          h('span', { class: 'ic' }, s.icon),
          h('div', null, h('div', null, s.title, up ? ' 🚀' : ''), h('div', { class: 'bar' }, h('i', { style: { width: Math.max(4, p) + '%' } })), h('small', { class: 'muted' }, st.mastered ? '¡Dominado!' : `Nivel ${st.lvl}: ${s.levels[st.lvl - 1]}`)),
          h('span', { class: 'chip' }, `${p}%`));
      });
      const ratio = S.results.length ? okN / S.results.length : 0;
      const msg = ratio >= 0.85 ? '¡Misión cumplida como un experto!' : ratio >= 0.5 ? '¡Muy buen trabajo! Cada error te enseñó algo nuevo.' : '¡Qué esfuerzo! Los retos difíciles son los que más hacen crecer al cerebro.';
      const stage2 = h('div', { class: 'wrap summary' },
        h('div', { html: GA.mascot('wow', 130) }),
        h('h1', { style: { fontSize: '2.4rem' } }, msg),
        h('div', { class: 'stars-big' }, '⭐'.repeat(Math.min(got, 10)) || '💪'),
        h('div', { class: 'chip', style: { fontSize: '1.3rem' } }, `+${got} estrellas · ${okN} de ${S.results.length} a la primera`),
        h('div', { class: 'card' }, h('h3', null, 'Tu progreso'), rows),
        h('div', { class: 'actions', style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' } },
          h('button', { class: 'btn btn-big btn-ok', onclick: () => (opts.mission ? GA.run(E.dailyMission(), opts) : GA.run(E.skillRound(skills[0]), opts)) }, opts.mission ? '🎯 Otra misión' : '▶ Seguir practicando'),
          h('button', { class: 'btn btn-big btn-white', onclick: () => GA.screens.home() }, '🏠 Inicio')));
      app().innerHTML = '';
      app().append(stage2);
      GA.confetti(120);
      GA.sfx.play('level');
      GA.say(`${msg} Ganaste ${got} estrellas.`);
    }

    function testSummary() {
      const okN = S.results.filter((r) => r.score === 1).length;
      app().innerHTML = '';
      app().append(h('div', { class: 'wrap summary' },
        h('div', { html: GA.mascot('happy', 110) }),
        h('h1', null, '🧪 Prueba terminada'),
        h('div', { class: 'chip', style: { fontSize: '1.2rem' } }, `${okN} de ${S.results.length} a la primera`),
        h('p', { class: 'muted' }, 'Nada de esta ronda se guardó: no cuenta en estadísticas, niveles, repasos, estrellas ni dragones.'),
        h('div', { class: 'actions', style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' } },
          h('button', { class: 'btn btn-big btn-ok', onclick: () => GA.run(queue.map((q) => Object.assign({}, q)), opts) }, '🔁 Otra vez'),
          h('button', { class: 'btn btn-big btn-white', onclick: () => GA.screens.testLab() }, '🧪 Modo prueba'))));
    }

    next();
  };

  // ---------- Modo prueba (papás) ----------
  GA.screens.testLab = function () {
    clear();
    const play = (s, lvl) => { GA.sfx.play('tap'); GA.run(GA.range(1, s.roundLen ? s.roundLen(lvl) : GA.settings().roundLen || 6).map(() => ({ skill: s.id, lvl, mode: 'test' })), { title: s.title, test: true }); };
    const areas = Object.values(GA.AREAS).map((a) => h('section', { class: 'test-area ' + a.cls },
      h('h2', { class: 'section-title' }, `${a.icon} ${a.name}`),
      h('div', { class: 'test-grid' }, GA.areaSkills(a.id).map((s) => h('div', { class: 'test-skill' },
        h('h3', null, `${s.icon} ${s.title}`),
        h('div', { class: 'test-lvls' },
          s.levels.map((l, i) => h('button', { class: 'btn btn-sm', title: l, onclick: () => play(s, i + 1) }, h('b', null, `Nivel ${i + 1}`), h('small', null, l))),
          s.sandbox ? h('button', { class: 'btn btn-sm btn-sun', onclick: () => GA.screens.sandbox(s, GA.screens.testLab, { test: true }) }, s.sandboxLabel || '🧪 Explorar libre') : null))))));
    app().append(h('div', { class: 'wrap' },
      h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', 'aria-label': 'Volver al panel', onclick: () => GA.screens.parents() }, '⬅'), h('h1', { style: { marginRight: 'auto' } }, '🧪 Modo prueba')),
      h('div', { class: 'test-note' }, 'Entra a cualquier aventura y cualquier nivel. Nada de lo que hagas aquí se guarda: no cuenta en estadísticas, niveles, repasos, estrellas ni dragones.'),
      areas));
  };

  // ---------- Álbum ----------
  GA.screens.album = function () {
    clear();
    const d = D();
    const toNext = 8 - (d.stars % 8);
    app().append(h('div', { class: 'wrap area-math' },
      h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => GA.screens.home() }, '⬅'), h('h1', { style: { marginRight: 'auto' } }, '📒 Mi álbum'), h('span', { class: 'chip' }, '⭐ ', d.stars)),
      h('p', { class: 'muted', style: { fontSize: '1.15rem' } }, `Cada 8 estrellas ganas una estampa. ¡Te faltan ${toNext}!`),
      h('h2', { class: 'section-title' }, `Estampas (${d.stickers.length} de ${GA.STICKERS.length})`),
      h('div', { class: 'album' }, GA.STICKERS.map((s) => h('div', { class: 'sticker' + (d.stickers.includes(s) ? '' : ' locked') }, s))),
      h('h2', { class: 'section-title', style: { marginTop: '24px' } }, '🏅 Medallas de aventuras dominadas'),
      d.medals.length ? h('div', { class: 'medals' }, d.medals.filter((id) => GA.skills[id]).map((id) => { const s = GA.skills[id]; return h('div', { class: 'medal ' + GA.AREAS[s.area].cls }, h('b', null, s.icon), s.title); }))
        : h('p', { class: 'muted' }, 'Cuando completes todos los niveles de una aventura, aquí aparecerá su medalla.')));
  };

  // ---------- Arranque ----------
  GA.start = function () {
    GA.store.load();
    GA.voice.init();
    // desbloquear audio en iPad/iPhone con el primer toque
    document.addEventListener('pointerdown', () => GA.sfx.ensure(), { once: true });
    if (!GA.store.data.name) GA.screens.welcome(); else GA.screens.home();
  };
})();
