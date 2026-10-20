/* Gael Aprende — motor de aprendizaje adaptativo
   - Ubicación inicial: al empezar una habilidad, cada acierto al primer intento sube un nivel (hasta el 3)
     para no aburrir a quien ya sabe.
   - Dominio: sube de nivel con al menos 4 puntos en los últimos 5 intentos del nivel (acierto = 1, con pista = 0.5).
   - Apoyo: baja un nivel si en los últimos 4 intentos suma 1 punto o menos.
   - Repaso espaciado (sistema Leitner): cada nivel superado se repasa a los 1, 3, 7, 14, 30 y 60 días. */
(function () {
  'use strict';

  GA.AREAS = {
    math: { id: 'math', name: 'Matemáticas y Lógica', short: 'Números', world: 'Isla de los Números', icon: '🔢', cls: 'area-math', color: '#7656F5',
      blurb: 'Contar, sumar, descubrir patrones y resolver acertijos.' },
    ciencia: { id: 'ciencia', name: 'Ciencias y Experimentación', short: 'Ciencia', world: 'Bosque de la Ciencia', icon: '🔬', cls: 'area-ciencia', color: '#12A876',
      blurb: 'Experimentos, animales, plantas, agua y el espacio.' },
    lengua: { id: 'lengua', name: 'Lectura y Lenguaje', short: 'Letras', world: 'Castillo de las Letras', icon: '📚', cls: 'area-lengua', color: '#FF7433',
      blurb: 'Sonidos, sílabas, palabras, rimas y cuentos.' },
    lector: { id: 'lector', name: 'Aprender a leer', short: 'Lectura', world: 'Camino del Lector', icon: '📖', cls: 'area-lector', color: '#E2457F',
      blurb: 'De las primeras sílabas a leer libros completos, paso a paso.' },
    gimnasio: { id: 'gimnasio', name: 'Gimnasio de Lectura', short: 'Gimnasio', world: 'Gimnasio de Lectura', icon: '🏋️', cls: 'area-gimnasio', color: '#0F9BA8',
      blurb: 'Sílaba por sílaba, b y d, es y se, trabadas y lectura veloz.' },
    hyrule: { id: 'hyrule', name: 'Hyrule en español', short: 'Hyrule', world: 'Hyrule en español', icon: '🗡️', cls: 'area-hyrule', color: '#2E8B57',
      blurb: 'Aprende a leer con las aventuras de Zelda: Breath of the Wild.' },
    ingles: { id: 'ingles', name: 'Inglés', short: 'Inglés', world: 'Hyrule in English', icon: '🇺🇸', cls: 'area-ingles', color: '#2F6FE0',
      blurb: 'Practica inglés leyendo las aventuras de Zelda.' },
  };

  let order = 0;
  GA.skill = function (def) {
    def.order = order++;
    def.prereq = def.prereq || [];
    GA.skills[def.id] = def;
    GA.skillList.push(def);
  };
  GA.areaSkills = (area) => GA.skillList.filter((s) => s.area === area);

  GA.STICKERS = ['🦖', '🦕', '🐙', '🦄', '🐉', '🦋', '🐢', '🦊', '🐼', '🦁', '🐯', '🐨', '🐸', '🦉', '🐧', '🐬', '🐳', '🦈', '🦜', '🦩',
    '🚀', '🛸', '🪐', '🌋', '🌈', '⚡', '🌟', '☄️', '🔭', '🧪', '🧲', '🔬', '🎨', '🎸', '🥁', '🎻', '🏰', '🗺️', '🧭', '⛵',
    '🏆', '👑', '💎', '🍀', '🌻', '🍉', '🧁', '🎈'];
  const STARS_PER_STICKER = 8;
  const INTERVALS = [1, 3, 7, 14, 30, 60];

  const E = (GA.engine = {});
  const D = () => GA.store.data;
  const today = () => GA.dayKey();

  E.st = function (id) {
    const all = D().skills;
    if (!all[id]) all[id] = { lvl: 1, best: 1, hist: [], placing: null, mastered: false, rev: null, downs: 0, err: {}, last: 0 };
    return all[id];
  };
  E.levels = (id) => GA.skills[id].levels.length;
  E.levelName = (id, l) => GA.skills[id].levels[GA.clamp(l, 1, E.levels(id)) - 1];

  E.isUnlocked = function (id) {
    if (GA.settings().unlockAll) return true;
    const s = GA.skills[id];
    return s.prereq.every(([pid, lvl]) => { const p = E.st(pid); return p.mastered || p.best >= lvl; });
  };
  E.lockText = function (id) {
    const s = GA.skills[id];
    const miss = s.prereq.filter(([pid, lvl]) => { const p = E.st(pid); return !(p.mastered || p.best >= lvl); });
    return miss.map(([pid, lvl]) => `${GA.skills[pid].title} (nivel ${lvl})`).join(' y ');
  };
  // Progreso 0..1 dentro de la habilidad
  E.progress = function (id) {
    const st = E.st(id), n = E.levels(id);
    if (st.mastered) return 1;
    const atL = st.hist.filter((x) => x.l === st.lvl && !x.r).slice(-5);
    const part = Math.min(1, atL.reduce((a, x) => a + x.s, 0) / 4);
    return GA.clamp((st.lvl - 1 + part * 0.9) / n, 0, 0.99);
  };
  E.areaProgress = (area) => {
    const sk = GA.areaSkills(area);
    return sk.reduce((a, s) => a + E.progress(s.id), 0) / sk.length;
  };
  E.accuracy = function (id, n = 20) {
    const h = E.st(id).hist.slice(-n);
    if (!h.length) return null;
    return h.reduce((a, x) => a + x.s, 0) / h.length;
  };

  function dayRec() {
    const k = today();
    const d = D().days;
    if (!d[k]) d[k] = { items: 0, ok: 0, ms: 0, skills: {} };
    return d[k];
  }
  E.addTime = (ms) => { dayRec().ms += Math.min(ms, 10 * 60 * 1000); GA.store.save(); };

  // Registra una respuesta y devuelve eventos (subir nivel, bajar nivel, dominio, sticker)
  E.record = function (id, lvl, score, ms, mode = 'learn', tag = null) {
    const st = E.st(id), n = E.levels(id), events = [];
    st.hist.push({ l: lvl, s: score, t: Date.now(), ms: Math.round(ms), r: mode === 'review' ? 1 : 0 });
    if (st.hist.length > 80) st.hist.splice(0, st.hist.length - 80);
    st.last = Date.now();
    D().lastSkill = id;
    if (score < 1 && tag) st.err[tag] = (st.err[tag] || 0) + 1;

    const day = dayRec();
    day.items++; if (score === 1) day.ok++;
    day.skills[id] = (day.skills[id] || 0) + 1;

    if (score > 0) {
      const before = Math.floor(D().stars / STARS_PER_STICKER);
      D().stars += 1;
      if (Math.floor(D().stars / STARS_PER_STICKER) > before) {
        const free = GA.STICKERS.filter((s) => !D().stickers.includes(s));
        if (free.length) { const s = GA.pick(free); D().stickers.push(s); events.push({ type: 'sticker', sticker: s }); }
      }
    }

    if (mode === 'review') {
      const rv = st.rev;
      if (rv) {
        if (score === 1) { if (rv.due <= today()) { rv.box = Math.min(INTERVALS.length - 1, rv.box + 1); rv.due = GA.addDays(today(), INTERVALS[rv.box]); } }
        else { rv.box = 0; rv.due = GA.addDays(today(), 1); rv.slips = (rv.slips || 0) + 1; }
      }
      GA.store.save();
      return events;
    }

    if (st.placing) {
      const cap = Math.min(n, 3);
      if (score === 1 && lvl === st.lvl && st.lvl < cap) {
        scheduleReview(st, st.lvl);
        st.lvl++; st.best = Math.max(st.best, st.lvl);
        events.push({ type: 'placement', to: st.lvl });
      } else if (score < 1) st.placing = false;
      if (st.lvl >= cap) st.placing = false;
      GA.store.save();
      return events;
    }

    if (lvl !== st.lvl) { GA.store.save(); return events; }
    const atL = st.hist.filter((x) => x.l === lvl && !x.r);
    const last5 = atL.slice(-5), sum5 = last5.reduce((a, x) => a + x.s, 0);
    const last4 = atL.slice(-4), sum4 = last4.reduce((a, x) => a + x.s, 0);
    if (last5.length >= 5 && sum5 >= 4 && last5[last5.length - 1].s > 0) {
      scheduleReview(st, lvl);
      if (lvl >= n) {
        if (!st.mastered) {
          st.mastered = true;
          if (!D().medals.includes(id)) D().medals.push(id);
          events.push({ type: 'mastered' });
        }
      } else {
        st.lvl = lvl + 1; st.best = Math.max(st.best, st.lvl);
        events.push({ type: 'levelup', from: lvl, to: st.lvl });
        // ¿Se desbloquearon habilidades nuevas?
        GA.skillList.forEach((s) => {
          if (s.prereq.some(([pid, l]) => pid === id && l === st.lvl) && E.isUnlocked(s.id)) events.push({ type: 'unlock', skill: s.id });
        });
      }
    } else if (last4.length === 4 && sum4 <= 1 && lvl > 1) {
      st.lvl = lvl - 1; st.downs++;
      events.push({ type: 'leveldown', to: st.lvl });
    }
    GA.store.save();
    return events;
  };
  function scheduleReview(st, lvl) {
    if (!st.rev) st.rev = { l: lvl, box: 0, due: GA.addDays(today(), 1), slips: 0 };
    else if (lvl >= st.rev.l) { st.rev.l = lvl; st.rev.due = st.rev.due < GA.addDays(today(), 1) ? st.rev.due : GA.addDays(today(), 1); }
  }
  E.startSkill = function (id) {
    const st = E.st(id);
    if (st.placing === null) st.placing = st.hist.length === 0 && E.levels(id) > 2;
    GA.store.save();
  };
  E.setLevel = function (id, l) {
    const st = E.st(id);
    st.lvl = GA.clamp(l, 1, E.levels(id)); st.best = Math.max(st.best, st.lvl); st.placing = false;
    GA.store.save();
  };

  E.dueReviews = () => GA.skillList.filter((s) => { const st = E.st(s.id); return st.rev && st.rev.due <= today() && E.isUnlocked(s.id); });

  // Habilidad recomendada en un área: continúa la que está en curso; si no, la siguiente desbloqueada
  E.recommend = function (area) {
    const cands = GA.areaSkills(area).filter((s) => E.isUnlocked(s.id) && !E.st(s.id).mastered);
    if (!cands.length) return null;
    const started = cands.filter((s) => E.st(s.id).hist.length > 0);
    const playedToday = (s) => (D().days[today()] && D().days[today()].skills[s.id]) || 0;
    const fresh = cands.filter((s) => !E.st(s.id).hist.length);
    const pool = started.filter((s) => playedToday(s) < 12);
    if (pool.length && (Math.random() < 0.7 || !fresh.length)) return pool.sort((a, b) => E.progress(a.id) - E.progress(b.id))[0];
    return fresh[0] || cands[0];
  };

  // Misión del día: repasos espaciados + práctica intercalada de todas las áreas
  E.dailyMission = function () {
    const len = GA.settings().roundLen + 2;
    const reviews = E.dueReviews().slice(0, 4).map((s) => ({ skill: s.id, mode: 'review', lvl: E.st(s.id).rev.l }));
    const learn = [];
    const recs = Object.keys(GA.AREAS).map(E.recommend).filter(Boolean);
    recs.forEach((s) => E.startSkill(s.id));
    let i = 0;
    while (recs.length && learn.length + reviews.length < len) { learn.push({ skill: recs[i % recs.length].id, mode: 'learn' }); i++; }
    // intercalar: repasos repartidos entre la práctica
    const q = [];
    while (learn.length || reviews.length) {
      if (learn.length) q.push(learn.shift());
      if (reviews.length) q.push(reviews.shift());
    }
    return q;
  };
  E.missionInfo = function () {
    const rv = E.dueReviews().length;
    const recs = Object.keys(GA.AREAS).map(E.recommend).filter(Boolean);
    return { reviews: rv, skills: recs };
  };
  E.skillRound = function (id) {
    E.startSkill(id);
    const s = GA.skills[id];
    const n = s.roundLen ? s.roundLen(E.st(id).lvl) : GA.settings().roundLen;
    return GA.range(1, n).map(() => ({ skill: id, mode: 'learn' }));
  };
  E.streak = function () {
    let n = 0, k = today();
    if (!D().days[k] || !D().days[k].items) k = GA.addDays(k, -1);
    while (D().days[k] && D().days[k].items) { n++; k = GA.addDays(k, -1); }
    return n;
  };

  // Resumen para el panel de padres
  E.skillStatus = function (id) {
    const st = E.st(id);
    if (!st.hist.length) return { key: 'new', label: 'Sin empezar', color: '#94A3B8' };
    if (st.rev && st.rev.due <= today()) return { key: 'review', label: 'Repaso pendiente', color: '#3D8BFF' };
    const acc = E.accuracy(id, 10);
    if (st.mastered) return { key: 'mastered', label: 'Dominado', color: '#12A876' };
    if (acc !== null && acc < 0.55 && st.hist.length >= 5) return { key: 'support', label: 'Necesita apoyo', color: '#FF6B6B' };
    return { key: 'learning', label: 'Aprendiendo', color: '#FFB020' };
  };
})();
