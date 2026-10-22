/* Gael Aprende — Dojo de Judo: las palabras en japonés que usa el sensei
   Cómo aprende:
   - Pocas palabras a la vez: cada cinta es un grupo de ~12 palabras con el mismo tema, de lo más usado en clase a lo más técnico.
   - Palabra nueva = dibujo + voz japonesa + significado + un truco para recordarla + decirla en voz alta.
     Se pregunta enseguida y vuelve a salir unos ejercicios después (recuperación expandida).
   - Repaso espaciado por palabra (Leitner): 1, 3, 7, 14, 30 y 60 días. "Sabida" = la recordó en días distintos o en el examen.
   - Recordar en varias direcciones: japonés → significado, escuchar → significado, significado → japonés y armarla por sílabas.
   - El sensei dice: órdenes del dojo con posturas; hacerlas con el cuerpo ayuda a recordarlas (respuesta física total).
   - Examen de cinta: todas las palabras de la cinta, sin pistas. Con 80% gana la cinta. */
(function () {
  'use strict';
  const { h } = GA;
  const ui = GA.ui;
  const E = GA.engine;
  const J = GA.JUDO;
  const D = () => GA.store.data;
  const AREA = 'judo';
  const INT = [0, 1, 3, 7, 14, 30, 60];
  const KNOWN = 3; // caja a partir de la cual la palabra cuenta como sabida
  const PASS = 0.8;
  const today = () => GA.dayKey();

  // ---------- Estado por palabra ----------
  const jd = () => {
    const d = D();
    if (!d.judo || typeof d.judo !== 'object') d.judo = {};
    d.judo.w = d.judo.w || {}; d.judo.belts = d.judo.belts || {};
    return d.judo;
  };
  const ws = (id) => jd().w[id] || null;
  const STATUS = {
    new: { label: 'Nueva', color: '#94A3B8' },
    learning: { label: 'Aprendiendo', color: '#FFB020' },
    almost: { label: 'Casi', color: '#7BC96F' },
    known: { label: '¡Sabida!', color: '#12A876' },
  };
  function status(id) {
    const s = ws(id);
    if (!s) return 'new';
    return s.box >= KNOWN ? 'known' : s.box >= 2 ? 'almost' : 'learning';
  }
  function touch(id) {
    if (!jd().w[id]) jd().w[id] = { box: 0, due: today(), ok: 0, bad: 0, last: 0 };
    return jd().w[id];
  }
  // score 1 = a la primera; 0 = error. Sube de caja sólo si ya le tocaba (así "sabida" = recordada en días distintos)
  function mark(id, score) {
    const s = touch(id);
    s.last = Date.now();
    if (score === 1) {
      s.ok++;
      if (s.due <= today()) { s.box = Math.min(INT.length - 1, s.box + 1); s.due = GA.addDays(today(), INT[s.box]); }
    } else { s.bad++; s.box = 0; s.due = today(); }
    GA.store.save();
  }
  const dueWords = () => J.WORDS.filter((w) => { const s = ws(w.id); return s && s.box >= 1 && s.due <= today(); });
  const knownCount = (words = J.WORDS) => words.filter((w) => status(w.id) === 'known').length;
  const beltOf = (w) => J.BELTS[w.belt];
  const passed = (b) => !!jd().belts[b.id];
  // Cinta que lleva puesta Gael: la última que ganó en examen
  function currentBelt() {
    const got = J.BELTS.filter((b) => !b.bonus && passed(b));
    return got.length ? got[got.length - 1] : null;
  }
  const beltColor = () => (D() && currentBelt() ? currentBelt().color : '#DDE3EC');

  // ---------- Voz ----------
  const sp = (w) => w.p.replace(/-/g, '');
  const hasJa = () => !!GA.voice.vJa;
  const canHear = () => !!(GA.settings().voice && 'speechSynthesis' in window);
  const ttsJp = (w, rate) => (hasJa() ? GA.say(w.k, { lang: 'ja', rate: rate || 0.75 }) : GA.say(sp(w), { rate: rate ? rate + 0.1 : 0.8 }));
  // Grabaciones con voz japonesa (audio_judo.py): suenan igual en cualquier dispositivo. Si falta alguna, se usa la voz del dispositivo.
  // Un solo reproductor, desbloqueado con el primer toque (iPad/iPhone no dejan sonar audio que no empezó con un toque).
  const clipSrc = (id) => { const p = `audio/judo/${id}.mp3`; return (window.GA_AUDIO && window.GA_AUDIO[p]) || (window.GA_AUDIO ? null : p); };
  const player = new Audio();
  player.preload = 'auto';
  document.addEventListener('pointerdown', () => { const s = clipSrc('_silencio'); if (s && !player.src) { player.src = s; player.play().catch(() => {}); } }, { once: true });
  let clipEnd = null;
  function stopClip() { if (!player.paused) player.pause(); if (clipEnd) clipEnd(true); }
  function playClip(id, rate = 1) {
    const src = clipSrc(id);
    if (!src) return Promise.resolve(false);
    stopClip();
    return new Promise((res) => {
      let done = false;
      const fin = (ok) => { if (done) return; done = true; clipEnd = null; player.onended = player.onerror = null; res(ok); };
      clipEnd = fin;
      player.onended = () => fin(true);
      player.onerror = () => fin(false);
      player.src = src;
      player.playbackRate = rate;
      try { player.preservesPitch = true; } catch (e) { /* navegador viejo */ }
      player.play().catch(() => fin(false));
      setTimeout(() => fin(true), 5000);
    });
  }
  const origStop = GA.voice.stop.bind(GA.voice);
  GA.voice.stop = () => { stopClip(); origStop(); };
  function sayJp(w, rate) {
    if (!GA.settings().voice) return Promise.resolve();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    return playClip(w.id, rate ? 0.62 : 1).then((ok) => (ok ? null : ttsJp(w, rate)));
  }
  const sayOmedeto = () => playClip('_omedeto').then((ok) => (ok ? null : hasJa() ? GA.say('おめでとう', { lang: 'ja', rate: 0.8 }) : GA.say('omedetó')));
  // Cómo se escribe en japonés y cómo se pronuncia, para mostrar junto a cada palabra
  const kana = (w) => w.kd || w.k;
  const jpLine = (w, cls = '') => h('div', { class: 'jd-jp ' + cls }, h('span', { class: 'jd-kana', lang: 'ja' }, kana(w)), h('span', { class: 'jd-pron' }, '🗣️ ', w.p));
  const jpHtml = (w) => `<span class="jd-kana" lang="ja">${kana(w)}</span> <span class="jd-pron">🗣️ ${w.p}</span>`;
  const mini = (w, art) => `<div class="jd-mini">${art || pic(w, 70)}<b>${w.w}</b> ${jpHtml(w)} = ${w.m}</div>`;
  // Frases en cadena que se cancelan si empieza otra o si la pantalla ya cambió
  let SEQ = 0;
  function talk(el, ...steps) {
    const my = ++SEQ;
    let p = Promise.resolve();
    steps.forEach((fn) => { p = p.then(() => (my === SEQ && (!el || el.isConnected) ? fn() : null)); });
    return p;
  }
  const hush = () => { SEQ++; };
  const earBtn = (w, label = '🔊') => h('button', { class: 'btn btn-white jd-ear', 'aria-label': 'Escuchar en japonés', onclick: (e) => { e.stopPropagation(); hush(); sayJp(w); } }, label);
  const slowBtn = (w) => h('button', { class: 'btn btn-white btn-sm', onclick: (e) => { e.stopPropagation(); hush(); sayJp(w, 0.5); } }, '🐢 Despacio');

  // ---------- El judoka (dibujo con posturas) ----------
  const SKIN = '#F1C27D', HAIR = '#2B2118', GI = '#FFFFFF', GI2 = '#E3E9F3', LINE = '#33415C';
  // f = de frente, s = de lado (mirando a la derecha). arms/legs: [atrás, adelante], cada uno [inicio, codo/rodilla, mano/pie]
  const POSES = {
    kiotsuke: { v: 'f', head: [70, 24], neck: [70, 40], hip: [70, 84], arms: [[[59, 44], [57, 64], [58, 84]], [[81, 44], [83, 64], [82, 84]]], legs: [[[66, 84], [66, 108], [66, 130]], [[74, 84], [74, 108], [74, 130]]],
      extra: `<g fill="#C7343F" font-family="Baloo 2, sans-serif" font-weight="800" font-size="22"><text x="98" y="32">!</text><text x="34" y="32">!</text></g>` },
    tadase: { v: 'f', head: [70, 22], neck: [70, 38], hip: [70, 84], arms: [[[59, 42], [57, 63], [58, 84]], [[81, 42], [83, 63], [82, 84]]], legs: [[[66, 84], [66, 108], [66, 130]], [[74, 84], [74, 108], [74, 130]]],
      extra: `<g stroke="#2F7DE1" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M36 110 V30 M28 40 L36 28 L44 40"/><path d="M104 110 V30 M96 40 L104 28 L112 40"/></g>` },
    shizentai: { v: 'f', head: [70, 24], neck: [70, 40], hip: [70, 84], arms: [[[59, 44], [53, 64], [51, 84]], [[81, 44], [87, 64], [89, 84]]], legs: [[[65, 84], [58, 108], [55, 130]], [[75, 84], [82, 108], [85, 130]]] },
    jigotai: { v: 'f', head: [70, 40], neck: [70, 56], hip: [70, 98], arms: [[[59, 60], [47, 76], [54, 92]], [[81, 60], [93, 76], [86, 92]]], legs: [[[64, 98], [42, 108], [36, 130]], [[76, 98], [98, 108], [104, 130]]] },
    ippon: { v: 'f', head: [70, 30], neck: [70, 46], hip: [70, 88], arms: [[[59, 50], [57, 70], [58, 88]], [[81, 50], [86, 30], [89, 8]]], legs: [[[66, 88], [66, 110], [66, 130]], [[74, 88], [74, 110], [74, 130]]] },
    wazaari: { v: 'f', head: [62, 26], neck: [62, 42], hip: [62, 86], arms: [[[51, 46], [49, 66], [50, 86]], [[73, 46], [96, 48], [120, 50]]], legs: [[[58, 86], [58, 108], [58, 130]], [[66, 86], [66, 108], [66, 130]]] },
    matte: { v: 'f', head: [64, 26], neck: [64, 42], hip: [64, 86], arms: [[[53, 46], [51, 66], [52, 86]], [[75, 46], [94, 44], [98, 24]]], legs: [[[60, 86], [60, 108], [60, 130]], [[68, 86], [68, 108], [68, 130]]], palm: true },
    agura: { v: 'f', head: [70, 54], neck: [70, 70], hip: [70, 112], arms: [[[59, 74], [50, 94], [44, 112]], [[81, 74], [90, 94], [96, 112]]], legs: [[[64, 112], [36, 116], [74, 128]], [[76, 112], [104, 116], [66, 128]]] },
    rei: { v: 's', head: [92, 34], neck: [84, 47], hip: [62, 84], arms: [[[83, 48], [79, 70], [75, 92]], [[85, 49], [83, 71], [79, 93]]], legs: [[[60, 84], [60, 108], [60, 130]], [[64, 84], [65, 108], [66, 130]]] },
    seiza: { v: 's', head: [62, 52], neck: [60, 68], hip: [56, 112], arms: [[[59, 70], [63, 92], [78, 106]], [[61, 70], [66, 92], [82, 108]]], legs: [[[54, 112], [84, 120], [52, 128]], [[58, 112], [88, 122], [56, 130]]] },
    mokuso: { v: 's', head: [62, 52], neck: [60, 68], hip: [56, 112], arms: [[[59, 70], [62, 92], [72, 106]], [[61, 70], [65, 93], [74, 107]]], legs: [[[54, 112], [84, 120], [52, 128]], [[58, 112], [88, 122], [56, 130]]], closed: true,
      extra: `<g stroke="#7656F5" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"><path d="M84 40 q6 -4 12 0 M88 30 q6 -4 12 0"/></g>` },
    zarei: { v: 's', head: [108, 92], neck: [94, 96], hip: [54, 112], arms: [[[93, 97], [100, 112], [110, 128]], [[95, 98], [104, 114], [116, 129]]], legs: [[[52, 112], [82, 120], [50, 128]], [[56, 112], [86, 122], [54, 130]]] },
    kiritsu: { v: 's', head: [64, 40], neck: [62, 56], hip: [58, 96], arms: [[[61, 58], [66, 78], [74, 96]], [[63, 58], [72, 78], [84, 94]]], legs: [[[56, 96], [56, 126], [34, 130]], [[60, 96], [86, 98], [86, 130]]],
      extra: `<g stroke="#12A876" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M112 108 V34 M100 48 L112 32 L124 48"/></g>` },
    ukemi: { v: 's', head: [112, 112], neck: [98, 116], hip: [56, 118], arms: [[[96, 116], [84, 126], [70, 131]], [[98, 117], [90, 127], [80, 132]]], legs: [[[54, 118], [42, 96], [26, 102]], [[58, 118], [46, 92], [32, 92]]],
      extra: `<g stroke="#FF922B" stroke-width="3" stroke-linecap="round"><path d="M64 122 l-8 -8 M70 120 l-2 -10 M58 128 l-10 -2"/></g>` },
    hajime: { v: 's', head: [74, 30], neck: [70, 45], hip: [62, 86], arms: [[[69, 46], [86, 58], [102, 52]], [[71, 48], [86, 66], [102, 66]]], legs: [[[60, 86], [50, 108], [42, 130]], [[64, 86], [78, 108], [86, 130]]],
      extra: `<g stroke="#C7343F" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M112 44 h12 M114 58 h14 M112 72 h12"/></g>` },
  };
  function limb(pts, back) {
    const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
    return `<path d="${d}" stroke="${LINE}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${back ? GI2 : GI}" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const dot = ([x, y], r = 4.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}" stroke="${LINE}" stroke-width="1.6"/>`;
  function judoka(pose, o = {}) {
    const P = POSES[pose] || POSES.shizentai;
    const size = o.size || 120;
    const belt = o.belt || beltColor();
    const [hx, hy] = P.head, [nx, ny] = P.neck, [px, py] = P.hip;
    const front = P.v === 'f';
    // cinta: segmento perpendicular al tronco, cerca de la cadera
    const tx = px - nx, ty = py - ny, L = Math.hypot(tx, ty) || 1;
    const bx = nx + tx * 0.86, by = ny + ty * 0.86, qx = (-ty / L) * 12, qy = (tx / L) * 12;
    const beltStroke = belt.toUpperCase() === '#1F1F1F' ? '#000' : LINE;
    let s = `<svg class="judoka" viewBox="0 0 140 140" width="${size}" height="${size}" aria-hidden="true"><ellipse cx="70" cy="133" rx="46" ry="5" fill="rgba(0,0,0,.1)"/>`;
    s += limb(P.arms[0], true) + dot(P.arms[0][2]) + limb(P.legs[0], true) + dot(P.legs[0][2], 5);
    s += `<path d="M${nx} ${ny} L${px} ${py}" stroke="${LINE}" stroke-width="25" stroke-linecap="round"/><path d="M${nx} ${ny} L${px} ${py}" stroke="${GI}" stroke-width="20.5" stroke-linecap="round"/>`;
    if (front) s += `<path d="M${nx - 7} ${ny + 1} L${nx + 3} ${ny + 22} M${nx + 7} ${ny + 1} L${nx - 1} ${ny + 15}" stroke="#B9C4D6" stroke-width="2.4" stroke-linecap="round"/>`;
    s += limb(P.legs[1]) + dot(P.legs[1][2], 5);
    s += `<path d="M${bx - qx} ${by - qy} L${bx + qx} ${by + qy}" stroke="${beltStroke}" stroke-width="8.5" stroke-linecap="round"/><path d="M${bx - qx} ${by - qy} L${bx + qx} ${by + qy}" stroke="${belt}" stroke-width="5.5" stroke-linecap="round"/>`;
    if (front) s += `<path d="M${bx - 2} ${by} l-5 12 M${bx + 2} ${by} l5 12" stroke="${beltStroke}" stroke-width="6" stroke-linecap="round"/><path d="M${bx - 2} ${by} l-5 12 M${bx + 2} ${by} l5 12" stroke="${belt}" stroke-width="3.4" stroke-linecap="round"/>`;
    s += limb(P.arms[1]) + dot(P.arms[1][2], P.palm ? 7 : 4.6);
    s += `<circle cx="${hx}" cy="${hy}" r="11.5" fill="${SKIN}" stroke="${LINE}" stroke-width="2"/>`;
    if (front) {
      s += `<path d="M${hx - 11.5} ${hy - 1} A11.5 11.5 0 0 1 ${hx + 11.5} ${hy - 1} Q${hx + 4} ${hy - 7} ${hx - 2} ${hy - 4} Q${hx - 7} ${hy - 6} ${hx - 11.5} ${hy - 1}Z" fill="${HAIR}"/>`;
      s += P.closed ? `<path d="M${hx - 6} ${hy + 1} q2 2 4 0 M${hx + 2} ${hy + 1} q2 2 4 0" stroke="${LINE}" stroke-width="1.6" fill="none"/>` : `<circle cx="${hx - 4}" cy="${hy + 1}" r="1.7" fill="${LINE}"/><circle cx="${hx + 4}" cy="${hy + 1}" r="1.7" fill="${LINE}"/>`;
      s += `<path d="M${hx - 3} ${hy + 6} Q${hx} ${hy + 8.5} ${hx + 3} ${hy + 6}" stroke="${LINE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    } else {
      s += `<path d="M${hx - 11.5} ${hy + 3} A11.5 11.5 0 0 1 ${hx + 9} ${hy - 7} Q${hx + 1} ${hy - 6} ${hx - 3} ${hy + 1} Q${hx - 6} ${hy + 6} ${hx - 11.5} ${hy + 3}Z" fill="${HAIR}"/>`;
      s += P.closed ? `<path d="M${hx + 3} ${hy + 1} q2 2 4 0" stroke="${LINE}" stroke-width="1.6" fill="none"/>` : `<circle cx="${hx + 5}" cy="${hy + 1}" r="1.7" fill="${LINE}"/>`;
      s += `<path d="M${hx + 5} ${hy + 6} Q${hx + 7} ${hy + 7.5} ${hx + 9} ${hy + 5.5}" stroke="${LINE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
    return s + (P.extra || '') + '</svg>';
  }
  function obiSvg(color, size = 90) {
    const st = color.toUpperCase() === '#1F1F1F' ? '#000' : LINE;
    return `<svg class="obi" viewBox="0 0 100 70" width="${size}" height="${Math.round(size * 0.7)}" aria-hidden="true">
      <rect x="4" y="18" width="92" height="16" rx="5" fill="${color}" stroke="${st}" stroke-width="3"/>
      <path d="M48 28 L30 62 L42 65 L54 34Z M52 28 L70 62 L58 65 L46 34Z" fill="${color}" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="39" y="13" width="22" height="26" rx="7" fill="${color}" stroke="${st}" stroke-width="3"/></svg>`;
  }
  const graphemes = (s) => (window.Intl && Intl.Segmenter ? [...new Intl.Segmenter().segment(s)].length : [...s].length);
  // Dibujo de una palabra: postura, cinta o emoji
  function pic(w, size = 110) {
    if (w.pose) return judoka(w.pose, { size });
    if (w.a === 'obi') return obiSvg(beltColor() === '#DDE3EC' ? '#FFFFFF' : beltColor(), size);
    const n = graphemes(w.e) > 1 ? 0.42 : 0.62;
    return `<span class="jd-emoji" style="font-size:${Math.round(size * n)}px">${w.e}</span>`;
  }

  // ---------- Opciones ----------
  const clash = (a, b) => a.id === b.id || a.m === b.m || (a.x && a.x.includes(b.id)) || (b.x && b.x.includes(a.id)) || (a.pose && a.pose === b.pose);
  function distract(w, n, pool, filter = () => true) {
    const out = [];
    const add = (list) => { for (const c of GA.shuffle(list)) { if (out.length >= n) return; if (filter(c) && !clash(c, w) && out.every((o) => !clash(o, c))) out.push(c); } };
    add(pool);
    add(J.WORDS);
    return out;
  }
  // Palabras de la misma cinta y las ya vistas: distractores conocidos
  const poolFor = (belt) => [...belt.words, ...J.WORDS.filter((w) => w.belt !== belt.n && ws(w.id))];
  // Lee las opciones en voz alta, una por una (para quien todavía lee despacio)
  function readOptsBtn(wrap, opts) {
    return h('button', { class: 'btn btn-white btn-sm', onclick: () => {
      const btns = GA.$$('.choice', wrap);
      talk(wrap, ...opts.flatMap((o, i) => [() => { btns.forEach((b, j) => b.classList.toggle('jd-reading', j === i)); return GA.say(`${i + 1}: ${o.m}`); }]), () => btns.forEach((b) => b.classList.remove('jd-reading')));
    } }, '🔊 Leer opciones');
  }
  const meaningOpt = (o, i) => ({ html: `<span class="jd-num">${i + 1}</span><span class="jd-opt-pic">${pic(o, 64)}</span><span class="jd-opt-txt">${o.m}</span>`, ok: false, w: o, cls: 'jd-opt' });

  // ---------- Formatos de pregunta ----------
  // Cada formato devuelve un item para el corredor; la voz la maneja el propio formato (noAutoRead)
  const autoRead = () => GA.settings().autoRead;
  const head = (w, showWord) => h('div', { class: 'jd-q' },
    showWord ? h('div', { class: 'jd-word' }, w.w) : null,
    showWord ? jpLine(w) : null,
    showWord && w.alt ? h('div', { class: 'jd-alt' }, `También se escribe: ${w.alt}`) : null);

  // A) japonés → significado (con la palabra escrita o sólo escuchando)
  function meaningQ(w, pool, n, listen) {
    const opts = GA.shuffle([w, ...distract(w, n - 1, pool)]);
    return {
      text: listen ? 'Escucha al sensei: ¿qué significa?' : `¿Qué significa “${w.w}”?`,
      say: listen ? 'Escucha al sensei. ¿Qué significa?' : `¿Qué significa ${sp(w)}?`,
      render(stage, api) {
        const top = listen
          ? h('div', { class: 'jd-listen' }, h('button', { class: 'jd-big-ear', 'aria-label': 'Escuchar otra vez', onclick: () => { hush(); sayJp(w); } }, '🔊'), slowBtn(w))
          : h('div', { class: 'jd-q' }, head(w, true), h('div', { class: 'row' }, earBtn(w), slowBtn(w)));
        const ch = ui.answerChoices(opts.map((o, i) => Object.assign(meaningOpt(o, i), { ok: o === w })), api, { wrapCls: 'jd-choices' });
        stage.append(top, ch, readOptsBtn(ch, opts));
        if (listen) talk(stage, () => (autoRead() ? GA.say('Escucha al sensei.') : null), () => sayJp(w));
        else if (autoRead()) talk(stage, () => GA.say('¿Qué significa'), () => sayJp(w));
      },
      hint: w.t,
      explain: { text: `${w.w} significa: ${w.m}. ${w.t}`, html: mini(w) },
      fact: `${w.w} (se dice ${w.p}): ${w.m}.`,
    };
  }

  // B) significado → palabra en japonés (escrita)
  function wordQ(w, pool) {
    const opts = GA.shuffle([w, ...distract(w, 3, pool)]);
    return {
      text: `¿Cómo se dice “${w.m}” en japonés?`, say: `¿Cómo se dice ${w.m}, en japonés?`,
      render(stage, api) {
        stage.append(h('div', { class: 'jd-q' }, h('div', { class: 'jd-pic', html: pic(w, 130) }), h('div', { class: 'jd-meaning' }, w.m)));
        stage.append(ui.answerChoices(opts.map((o) => ({ html: `<span>${o.w}</span><small class="jd-opt-jp">${jpHtml(o)}</small>`, aria: o.w, ok: o === w, cls: 'txt jd-wopt' })), api, { after: (o, r) => { if (o.ok || r === 'done') sayJp(w); } }));
        if (autoRead()) talk(stage, () => GA.say(`¿Cómo se dice ${w.m}, en japonés?`));
      },
      hint: `Empieza con “${w.w.slice(0, 2)}”. ${w.t}`,
      explain: { text: `${w.m} se dice ${w.w}. ${w.t}`, html: mini(w) },
      fact: `${w.w} (se dice ${w.p}): ${w.m}.`,
    };
  }

  // C) significado → escoger entre tres palabras que se escuchan
  function listenPickQ(w, pool) {
    const opts = GA.shuffle([w, ...distract(w, 2, pool)]);
    return {
      text: `¿Cuál dice “${w.m}”?`, say: `Escucha las tres palabras. ¿Cuál quiere decir ${w.m}?`,
      render(stage, api) {
        let locked = false;
        const rows = opts.map((o, i) => {
          const row = h('div', { class: 'g-sound jd-sound' },
            h('button', { class: 'btn btn-white', onclick: () => { hush(); sayJp(o); } }, `🔊 ${i + 1}`),
            h('button', { class: 'btn btn-sm', onclick: () => {
              if (locked) return;
              GA.sfx.play('tap');
              const r = api.answer(o === w);
              if (o === w) { row.classList.add('right'); locked = true; }
              else { row.classList.add('wrong'); if (r === 'done') { locked = true; rows[opts.indexOf(w)].classList.add('right'); } }
            } }, '✔ Es esta'));
          return row;
        });
        stage.append(h('div', { class: 'jd-q' }, h('div', { class: 'jd-pic', html: pic(w, 120) }), h('div', { class: 'jd-meaning' }, w.m)), h('div', { class: 'g-sounds' }, rows));
        talk(stage, () => (autoRead() ? GA.say(`¿Cuál quiere decir ${w.m}?`) : null), ...opts.flatMap((o) => [() => GA.sleep(250), () => sayJp(o)]));
      },
      hint: w.t,
      explain: { text: `${w.m} se dice ${w.w}.`, html: mini(w) },
      fact: `${w.w} (se dice ${w.p}): ${w.m}.`,
    };
  }

  // D) armar la palabra con sus sílabas
  const sylls = (w) => {
    const s = w.w.toLowerCase().replace(/[^a-z]/g, '');
    const parts = s.match(/[^aeiou]*(?:ai|ei|ui|oi|[aeiou])(?:[nm](?![aeiou]))?/g) || [s];
    const rest = s.slice(parts.join('').length);
    if (rest) parts[parts.length - 1] += rest;
    return parts;
  };
  const canBuild = (w) => { const n = sylls(w).length; return n >= 2 && n <= 6; };
  function buildQ(w) {
    const syl = sylls(w);
    const others = GA.shuffle(J.WORDS.filter((o) => o !== w).flatMap(sylls).filter((x) => !syl.includes(x)));
    const tiles = GA.shuffle([...syl, ...others.slice(0, syl.length > 3 ? 1 : 2)]).map((x, i) => ({ label: x, value: x, key: i }));
    return {
      text: `Arma la palabra: “${w.m}”`, say: `Arma la palabra en japonés que quiere decir ${w.m}.`,
      render(stage, api) {
        stage.append(h('div', { class: 'jd-q' }, h('div', { class: 'jd-pic', html: pic(w, 110) }), h('div', { class: 'jd-meaning' }, w.m), h('div', { class: 'row' }, earBtn(w, '🔊 Escuchar'))));
        const sl = ui.slots({ n: syl.length, tiles, tileCls: 'jd-tile', slotCls: 'jd-slot', onFull: (vals, s) => {
          const ok = vals.join('') === syl.join('');
          const r = api.answer(ok);
          if (ok) { s.mark(syl.map(() => true)); s.lock(); sayJp(w); }
          else if (r === 'done') { s.solve(syl); s.lock(); }
          else { const marks = vals.map((v, i) => v === syl[i]); s.mark(marks); s.returnWrong(marks); }
        } });
        stage.append(sl.el);
        if (autoRead()) talk(stage, () => GA.say(`Arma la palabra que quiere decir ${w.m}.`));
      },
      hint: `Escúchala y ve sílaba por sílaba: ${syl[0]}…`,
      explain: { text: `Se escribe ${w.w}: ${syl.join(' - ')}.`, html: `<div class="jd-mini"><b>${syl.join(' · ')}</b> ${jpHtml(w)}</div>` },
      fact: `${w.w} (se dice ${w.p}): ${w.m}.`,
    };
  }

  // E) el sensei da la orden → escoger la postura
  function poseQ(w, listen, n = 4) {
    const opts = GA.shuffle([w, ...distract(w, n - 1, J.WORDS.filter((o) => o.pose), (o) => !!o.pose)]);
    return {
      text: listen ? 'El sensei dice… ¡escucha y haz la postura!' : `El sensei dice: ¡${w.w}!`,
      say: listen ? 'El sensei dice' : `El sensei dice: ${sp(w)}`,
      render(stage, api) {
        stage.append(listen
          ? h('div', { class: 'jd-listen' }, h('button', { class: 'jd-big-ear', 'aria-label': 'Escuchar otra vez', onclick: () => { hush(); sayJp(w); } }, '🔊'))
          : h('div', { class: 'jd-q' }, h('div', { class: 'jd-word jd-cmd' }, `¡${w.w}!`), jpLine(w), h('div', { class: 'row' }, earBtn(w))));
        stage.append(h('p', { class: 'muted jd-do' }, '🥋 ¡Hazlo tú también con tu cuerpo! Luego toca el dibujo.'));
        stage.append(ui.answerChoices(opts.map((o) => ({ html: judoka(o.pose, { size: 120 }), ok: o === w, cls: 'jd-pose', aria: o.m })), api, { wrapCls: 'jd-poses' }));
        talk(stage, () => GA.say('El sensei dice:'), () => sayJp(w));
      },
      hint: w.t,
      explain: { text: `${w.w} es: ${w.m}. ${w.t}`, html: mini(w, judoka(w.pose, { size: 80 })) },
      fact: `${w.w} (se dice ${w.p}): ${w.m}.`,
    };
  }

  // ---------- Tarjeta de palabra (presentación y libreta) ----------
  function wordCard(w, o = {}) {
    const st = STATUS[status(w.id)];
    return h('div', { class: 'jd-card' },
      h('div', { class: 'jd-pic', html: pic(w, o.size || 140) }),
      h('div', { class: 'jd-word' }, w.w),
      jpLine(w, 'big'),
      w.alt ? h('div', { class: 'jd-alt' }, `También se escribe: ${w.alt}`) : null,
      h('div', { class: 'row' }, earBtn(w, '🔊 Escuchar en japonés'), slowBtn(w)),
      h('div', { class: 'jd-meaning' }, w.m),
      w.d && !w.d.toLowerCase().startsWith(w.m.toLowerCase()) ? h('div', { class: 'jd-def' }, `📝 En la lista del sensei: ${w.d}`) : null,
      h('div', { class: 'jd-tip' }, '💡 ', w.t),
      o.status ? h('span', { class: 'jd-status', style: { background: st.color } }, st.label) : null);
  }
  // Presenta una palabra nueva y luego hace la pregunta
  function withIntro(w, item, ctx) {
    const render = item.render;
    return Object.assign({}, item, {
      text: '¡Palabra nueva!', say: `Palabra nueva: ${sp(w)}. Significa ${w.m}.`,
      render(stage, api) {
        let n = 0;
        const bubbles = h('div', { class: 'jd-bubbles' }, [1, 2, 3].map(() => h('button', { class: 'jd-bubble', 'aria-label': 'Lo dije', onclick: (e) => {
          if (e.currentTarget.classList.contains('on')) return;
          e.currentTarget.classList.add('on'); GA.sfx.play('pop'); n++;
          if (n === 3) { GA.sfx.play('star'); go.classList.add('pop'); }
        } }, '🗣️')));
        const go = h('button', { class: 'btn btn-big btn-ok', onclick: () => {
          hush(); GA.voice.stop(); GA.sfx.play('tap');
          stage.innerHTML = '';
          api.setText(item.text);
          render(stage, api);
        } }, '¡Ya me la sé! ➜');
        stage.append(h('div', { class: 'chip jd-new' }, '✨ Palabra nueva'), wordCard(w),
          h('div', { class: 'jd-repeat' }, h('span', null, 'Dila en voz alta 3 veces:'), bubbles), go);
        talk(stage, () => GA.say('Palabra nueva.'), () => sayJp(w), () => GA.sleep(300), () => GA.say(`Significa: ${w.m}.`), () => GA.say(w.t), () => GA.say('Ahora dila tú, en voz alta, tres veces.'));
        ctx.introduced = ctx.introduced || {};
        ctx.introduced[w.id] = 1;
      },
    });
  }

  // Registra el resultado por palabra (sólo el primer intento) y en examen no da segunda oportunidad
  function track(api, w, ctx, exam) {
    let first = true;
    return Object.assign({}, api, {
      answer(ok, o = {}) {
        hush();
        if (first) {
          if (!api.test) mark(w.id, ok ? 1 : 0);
          if (exam && EXAM) EXAM.res[w.id] = !!ok;
          if (!ok && !exam) ctx.again.push({ id: w.id, at: ctx.n + 2 });
        }
        first = false;
        return api.answer(ok, exam ? Object.assign({}, o, { final: true }) : o);
      },
    });
  }

  // ---------- Elegir la siguiente palabra ----------
  function pickWord(belt, ctx) {
    const last = ctx.lastId;
    const okW = (w) => w.id !== last;
    const ag = ctx.again.findIndex((a) => a.at <= ctx.n && a.id !== last);
    if (ag >= 0) return J.byId[ctx.again.splice(ag, 1)[0].id];
    const words = belt.words;
    const due = words.filter((w) => okW(w) && ws(w.id) && ws(w.id).due <= today()).sort((a, b) => ws(a.id).box - ws(b.id).box);
    if (due.length && Math.random() < 0.75) return GA.pick(due.slice(0, 3));
    const prev = J.WORDS.filter((w) => w.belt < belt.n && okW(w) && ws(w.id) && ws(w.id).box >= 1 && ws(w.id).due <= today());
    if (prev.length && Math.random() < 0.3) return GA.pick(prev);
    const fresh = words.filter((w) => okW(w) && !ws(w.id) && !(ctx.introduced || {})[w.id]);
    if (fresh.length && (ctx.newN || 0) < 3) { ctx.newN = (ctx.newN || 0) + 1; return fresh[0]; }
    const seenW = words.filter((w) => okW(w) && (ws(w.id) || (ctx.introduced || {})[w.id]));
    if (!seenW.length) return fresh[0] || GA.pick(words.filter(okW));
    // las que menos se sabe salen más seguido
    return GA.pick(seenW.flatMap((w) => Array(Math.max(1, 4 - (ws(w.id) ? ws(w.id).box : 0))).fill(w)));
  }
  function chooseKind(w, L) {
    const r = Math.random();
    if (L >= 2 && r < 0.15) return 'meaning'; // de vez en cuando, un formato más fácil (práctica intercalada)
    if (L === 1) return 'meaning';
    if (L === 2) return !canHear() ? 'meaning4' : w.pose && r < 0.6 ? 'pose' : 'listen';
    if (r < 0.35) return 'word';
    if (r < 0.6 && canHear()) return 'listenPick';
    if (r < 0.85 && canBuild(w)) return 'build';
    return canHear() ? 'listen' : 'word';
  }
  function examKind(w, i) {
    if (w.pose && canHear() && i % 2) return 'pose';
    return ['word', canHear() ? 'listen' : 'meaning4', 'word', canHear() ? 'listenPick' : 'meaning4'][i % 4];
  }
  function buildItem(kind, w, pool) {
    switch (kind) {
      case 'listen': return meaningQ(w, pool, 4, true);
      case 'meaning4': return meaningQ(w, pool, 4, false);
      case 'word': return wordQ(w, pool);
      case 'listenPick': return listenPickQ(w, pool);
      case 'build': return buildQ(w);
      case 'pose': return poseQ(w, true);
      default: return meaningQ(w, pool, 3, false);
    }
  }
  function makeFor(belt, L, ctx, entry, kindFn) {
    ctx.n = (ctx.n || 0) + 1;
    ctx.again = ctx.again || [];
    const exam = !!(entry && entry.mode === 'exam');
    const w = entry && entry.word ? J.byId[entry.word] : pickWord(belt, ctx);
    ctx.lastId = w.id;
    const isNew = !exam && !ws(w.id) && !(ctx.introduced || {})[w.id];
    const kind = isNew ? 'meaning' : exam ? examKind(w, entry.i || 0) : kindFn(w, L);
    let item = buildItem(kind, w, poolFor(belt));
    if (isNew) { item = withIntro(w, item, ctx); ctx.again.push({ id: w.id, at: ctx.n + 2 }); }
    const render = item.render;
    return Object.assign(item, {
      noAutoRead: true,
      tag: 'jw:' + w.id,
      hint: exam ? '' : item.hint,
      render: (stage, api) => render(stage, track(api, w, ctx, exam)),
    });
  }

  // ---------- Habilidades: una por cinta ----------
  J.BELTS.forEach((b, n) => {
    GA.skill({
      id: b.id, area: AREA, title: b.bonus ? b.name : `${b.name}: ${b.theme}`, icon: b.icon,
      desc: b.bonus ? 'Las palabras que dice el árbitro en un torneo: hajime, matte, ippon…' : `${b.words.length} palabras de “${b.theme}”: ${b.words.slice(0, 4).map((w) => w.w).join(', ')}…`,
      levels: ['Conoce las palabras', 'Escucha al sensei', '¿Cómo se dice en japonés?'],
      prereq: b.bonus ? [['judo2', 2]] : n ? [[J.BELTS[n - 1].id, 3]] : [],
      roundLen: () => 8,
      lessons: n === 0 ? { 1: [
        { say: '¡Bienvenido al Dojo de Judo! Aquí vas a aprender las palabras en japonés que usa tu sensei.', html: `<div class="jd-lesson">${judoka('rei', { size: 150 })}</div>` },
        { say: 'Cada palabra nueva tiene un dibujo, cómo suena en japonés, qué significa y un truco para recordarla. ¡Dila en voz alta!', html: '<div class="lx-ex">👀 🔊 🗣️ 💡</div>' },
        { say: 'Cuando te sepas todas las palabras de una cinta, presenta el examen y ¡gana tu cinta!', html: `<div class="jd-lesson">${obiSvg('#FFFFFF', 110)}${obiSvg('#FFD43B', 110)}${obiSvg('#FF922B', 110)}</div>` },
      ] } : undefined,
      make: (L, ctx, entry) => makeFor(b, L, ctx, entry, chooseKind),
    });
  });

  // ---------- El sensei dice ----------
  const CMDS = () => J.WORDS.filter((w) => w.pose && !J.BELTS[w.belt].bonus && E.isUnlocked(J.BELTS[w.belt].id));
  const REF = () => J.BELTS.find((b) => b.bonus).words;
  GA.skill({
    id: 'jsensei', area: AREA, title: 'El sensei dice', icon: '🗣️',
    desc: 'El sensei da una orden en japonés: ¡hazla con tu cuerpo y toca el dibujo correcto!',
    levels: ['Lee y escucha la orden', 'Sólo escucha', 'Dos órdenes seguidas', 'Órdenes del árbitro'],
    prereq: [['judo1', 2]],
    lessons: { 1: [{ say: '¡Vamos a jugar El sensei dice! El sensei da una orden en japonés. Tú la haces con tu cuerpo, de verdad, y luego tocas el dibujo correcto.', html: `<div class="jd-lesson">${judoka('seiza', { size: 130 })}${judoka('rei', { size: 130 })}</div>` }] },
    make(L, ctx, entry) {
      ctx.n = (ctx.n || 0) + 1;
      ctx.again = ctx.again || [];
      const pool = L === 4 ? REF() : CMDS();
      const w = GA.fresh(ctx, pool.filter((x) => x.id !== ctx.lastId), (x) => x.id);
      ctx.lastId = w.id;
      if (L === 3) return twoOrders(w, pool, ctx);
      const isNew = !ws(w.id) && !(ctx.introduced || {})[w.id];
      let item = w.pose ? poseQ(w, L !== 1 && canHear(), L === 1 ? 3 : 4) : meaningQ(w, pool, 4, canHear());
      if (isNew) item = withIntro(w, item, ctx);
      const render = item.render;
      return Object.assign(item, { noAutoRead: true, tag: 'jw:' + w.id, render: (stage, api) => render(stage, track(api, w, ctx, false)) });
    },
  });
  // Dos órdenes seguidas: memoria de trabajo + vocabulario
  function twoOrders(a, pool, ctx) {
    const b = GA.pick(pool.filter((x) => !clash(x, a))) || a;
    const seq = [a, b];
    const opts = GA.shuffle([a, b, ...distract(a, 2, pool.filter((x) => !clash(x, b)), (o) => !!o.pose && !clash(o, b))]);
    const play = (el) => talk(el, () => GA.say('El sensei dice:'), () => sayJp(a), () => GA.sleep(500), () => sayJp(b));
    return {
      text: 'Dos órdenes: toca las posturas en orden', say: 'Escucha dos órdenes y toca las posturas en orden.', noAutoRead: true, tag: 'jw:' + b.id,
      render(stage, api) {
        let k = 0, first = true, locked = false;
        const btns = opts.map((o) => {
          const bt = h('button', { class: 'choice jd-pose', 'aria-label': o.m, html: judoka(o.pose, { size: 110 }) });
          bt.addEventListener('click', () => {
            if (locked || bt.classList.contains('right')) return;
            GA.sfx.play('tap');
            if (o === seq[k]) {
              bt.classList.add('right'); bt.append(h('span', { class: 'jd-order' }, k + 1)); k++;
              if (k === 2) { locked = true; if (first && !api.test) { mark(a.id, 1); mark(b.id, 1); } hush(); api.answer(true); }
              return;
            }
            if (first && !api.test) mark(seq[k].id, 0);
            first = false;
            hush();
            const r = api.answer(false);
            if (r === 'done') { locked = true; btns.forEach((x, i) => { const j = seq.indexOf(opts[i]); if (j >= 0 && !x.classList.contains('right')) { x.classList.add('right'); x.append(h('span', { class: 'jd-order' }, j + 1)); } }); return; }
            k = 0; btns.forEach((x) => { x.classList.remove('right'); const s = x.querySelector('.jd-order'); if (s) s.remove(); });
            setTimeout(() => play(stage), 1200);
          });
          return bt;
        });
        stage.append(h('div', { class: 'jd-listen' }, h('button', { class: 'jd-big-ear', 'aria-label': 'Escuchar otra vez', onclick: () => play(stage) }, '🔊')),
          h('p', { class: 'muted jd-do' }, '🥋 Haz las dos posturas con tu cuerpo y luego tócalas en orden: 1 y 2.'),
          h('div', { class: 'choices jd-poses' }, btns));
        if (!canHear()) stage.prepend(h('div', { class: 'jd-word jd-cmd' }, `¡${a.w}! … ¡${b.w}!`));
        play(stage);
      },
      hint: `Primero ${a.w} (${a.m}) y luego ${b.w} (${b.m}).`,
      explain: { text: `Primero ${a.w}: ${a.m}. Luego ${b.w}: ${b.m}.`, html: `<div class="jd-mini">${judoka(a.pose, { size: 70 })}➜${judoka(b.pose, { size: 70 })}</div>` },
    };
  }

  // ---------- Examen de cinta ----------
  let EXAM = null;
  function examAsk(b) {
    const need = Math.ceil(b.words.length * PASS);
    GA.ui.modal({
      title: `🥋 Examen: ${b.name}`, body: h('div', { class: 'jd-exam-ask', html: obiSvg(b.color, 120) }),
      text: `Son ${b.words.length} palabras, una por una y <b>sin pistas</b>. Para ganar la cinta necesitas ${need} correctas. ¡Respira hondo como en mokuso!`,
      say: `Examen de ${b.name}. Son ${b.words.length} palabras, sin pistas. Necesitas ${need} correctas. ¡Tú puedes!`,
      actions: [{ label: '¡Hajime! ▶', cls: 'btn-ok', onClick: () => startExam(b) }, { label: 'Todavía no', cls: 'btn-white' }],
    });
  }
  function startExam(b) {
    EXAM = { belt: b, res: {} };
    E.startSkill(b.id);
    GA.run(GA.shuffle(b.words).map((w, i) => ({ skill: b.id, mode: 'exam', lvl: 3, word: w.id, i })), { title: 'Examen: ' + b.name, back: GA.screens.dojo, backLabel: '🥋 Dojo', onDone: examDone });
  }
  function examDone() {
    const b = EXAM.belt, res = EXAM.res;
    const okW = b.words.filter((w) => res[w.id]), bad = b.words.filter((w) => res[w.id] === false);
    const need = Math.ceil(b.words.length * PASS), pass = okW.length >= need;
    // Lo que respondió bien en el examen cuenta como sabido; lo que falló vuelve a practicarse
    okW.forEach((w) => { const s = touch(w.id); if (s.box < KNOWN) { s.box = KNOWN; s.due = GA.addDays(today(), INT[KNOWN]); } });
    const wasNew = !passed(b);
    if (pass) {
      if (wasNew) jd().belts[b.id] = today();
      const st = E.st(b.id);
      st.mastered = true; st.placing = false; st.lvl = 3; st.best = 3;
      if (!D().medals.includes(b.id)) D().medals.push(b.id);
    }
    GA.store.save();
    EXAM = null;
    GA.screens.clear();
    const list = (arr) => h('div', { class: 'jd-chips' }, arr.map((w) => h('button', { class: 'jd-chip', onclick: () => cardModal(w) }, h('span', { html: pic(w, 34) }), `${w.w} (${w.p}) = ${w.m}`)));
    document.getElementById('app').append(h('div', { class: 'wrap summary area-judo' },
      pass ? h('div', { class: 'jd-ceremony' }, h('div', { class: 'grand-rays' }), h('div', { class: 'jd-ceremony-fig', html: judoka(b.bonus ? 'ippon' : 'shizentai', { size: 220, belt: b.bonus ? beltColor() : b.color }) }))
        : h('div', { html: GA.mascot('calm', 120) }),
      h('h1', null, pass ? (b.bonus ? '🥇 ¡Ippon! Ya sabes las palabras del árbitro' : `🥋 ¡Ganaste la ${b.name.toLowerCase()}!`) : '¡Buen intento, judoka!'),
      h('div', { class: 'chip', style: { fontSize: '1.3rem' } }, `${okW.length} de ${b.words.length} correctas · necesitabas ${need}`),
      pass ? h('p', { class: 'muted', style: { fontSize: '1.15rem' } }, 'Omedetō (おめでとう) quiere decir “¡felicidades!” en japonés.')
        : h('p', { class: 'muted', style: { fontSize: '1.15rem' } }, `Te faltaron ${need - okW.length}. Practica estas palabras y vuelve a presentar el examen:`),
      bad.length ? h('div', { class: 'card' }, h('h3', null, pass ? 'Para repasar' : 'Estas palabras te faltan'), list(bad)) : null,
      h('div', { class: 'actions', style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' } },
        bad.length ? h('button', { class: 'btn btn-big btn-ok', onclick: () => GA.run(GA.shuffle([...bad, ...bad]).slice(0, 8).map((w) => ({ skill: b.id, mode: 'learn', word: w.id })), { title: b.name, back: GA.screens.dojo, backLabel: '🥋 Dojo' }) }, '▶ Practicar estas') : null,
        h('button', { class: 'btn btn-big btn-white', onclick: () => GA.screens.dojo() }, '🥋 Volver al dojo'))));
    if (pass) {
      GA.sfx.play('level'); GA.confetti(260); setTimeout(() => GA.confetti(200), 800);
      talk(null, () => GA.say(b.bonus ? '¡Ippon! Ya sabes las palabras del árbitro.' : `¡Felicidades! ¡Ganaste la ${b.name}!`), sayOmedeto);
    } else GA.say(`¡Buen intento! Tuviste ${okW.length} correctas. Practica las que faltan y vuelve a intentarlo.`);
  }

  // ---------- Pantallas ----------
  function cardModal(w) {
    GA.sfx.play('tap');
    GA.ui.modal({ body: wordCard(w, { status: true }), actions: [{ label: 'Cerrar', cls: 'btn-white' }], dismissable: true, cls: 'area-judo jd-modal' });
    talk(document.querySelector('.jd-modal'), () => sayJp(w), () => GA.sleep(250), () => GA.say(w.m));
  }
  const wordsBar = (words) => {
    const k = knownCount(words), seenN = words.filter((w) => ws(w.id)).length;
    return h('div', { class: 'jd-bar', title: `${k} sabidas, ${seenN} vistas` },
      h('i', { class: 'k', style: { width: (k / words.length) * 100 + '%' } }), h('i', { class: 's', style: { width: ((seenN - k) / words.length) * 100 + '%' } }));
  };
  function beltSheet(b) {
    GA.sfx.play('tap');
    const open = E.isUnlocked(b.id);
    const st = E.st(b.id);
    const actions = [];
    if (open) {
      actions.push({ label: '▶ ¡Entrenar!', cls: 'btn-big', onClick: () => GA.run(E.skillRound(b.id), { title: b.name, back: GA.screens.dojo, backLabel: '🥋 Dojo' }) });
    }
    // El examen siempre se puede presentar: si ya se sabe las palabras, gana la cinta y se abre la siguiente
    actions.push({ label: passed(b) ? '🥋 Repetir examen' : open ? '🥋 Examen de cinta' : '🥋 ¿Ya te las sabes? Examen', cls: 'btn-sun', onClick: () => examAsk(b) });
    actions.push({ label: 'Cerrar', cls: 'btn-white' });
    GA.ui.modal({
      title: `${b.icon} ${b.name}`,
      text: (b.bonus ? 'Extra: las palabras que dice el árbitro en un torneo. ' : `Tema: <b>${b.theme}</b>. `) + (open ? (st.hist.length || passed(b) ? '' : '¿Ya te las sabes? ¡Puedes presentar el examen directo!') : `<br>🔒 Para entrenarla, primero avanza en <b>${E.lockText(b.id)}</b>. Si ya te sabes estas palabras, ¡presenta el examen!`),
      body: h('div', { class: 'jd-sheet' }, h('div', { html: obiSvg(b.color, 110) }), wordsBar(b.words),
        h('div', { class: 'jd-chips' }, b.words.map((w) => h('button', { class: 'jd-chip st-' + status(w.id), onclick: () => cardModal(w) }, w.w)))),
      actions, dismissable: true, cls: 'area-judo',
      say: open ? `${b.name}. ${b.bonus ? 'Las palabras del árbitro.' : b.theme}.` : `Esta cinta se abre cuando avances en ${E.lockText(b.id)}.`,
    });
  }

  GA.screens.dojo = function () {
    GA.screens.clear();
    hush();
    const a = GA.AREAS[AREA];
    const cur = currentBelt();
    const total = J.WORDS.length, known = knownCount();
    const due = dueWords();
    const next = J.BELTS.find((b) => !b.bonus && E.isUnlocked(b.id) && !passed(b)) || J.BELTS.find((b) => E.isUnlocked(b.id) && !passed(b)) || J.BELTS[0];
    const sensei = GA.skills.jsensei;
    const msg = cur ? `¡Hola, judoka de ${cur.name.toLowerCase()}! Ya sabes ${known} de ${total} palabras.` : `¡Bienvenido al dojo! Aprende las palabras de tu sensei y gana tu primera cinta.`;
    const belts = J.BELTS.map((b) => {
      const open = E.isUnlocked(b.id), got = passed(b);
      return h('button', { class: 'jd-belt' + (open ? '' : ' locked') + (got ? ' got' : '') + (b === next ? ' next' : ''), onclick: () => beltSheet(b) },
        got ? h('span', { class: 'badge' }, '🏅') : !open ? h('span', { class: 'badge' }, '🔒') : null,
        h('div', { html: obiSvg(b.color, 96) }),
        h('h3', null, b.name), h('div', { class: 'sub' }, b.theme),
        wordsBar(b.words),
        h('div', { class: 'sub' }, got ? '¡Cinta ganada!' : `${knownCount(b.words)} de ${b.words.length} sabidas`));
    });
    const sOpen = E.isUnlocked('jsensei');
    document.getElementById('app').append(h('div', { class: a.cls },
      h('div', { class: 'world-head' }, h('div', { class: 'row' },
        h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => GA.screens.home() }, '⬅'),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('h1', null, `${a.icon} ${a.world}`), h('p', null, a.blurb)),
        h('span', { class: 'chip', style: { color: 'var(--c-d)' } }, `${known}/${total} 🥋`))),
      h('div', { class: 'wrap' },
        h('div', { class: 'jd-hero' },
          h('div', { class: 'jd-hero-fig', html: judoka(cur ? 'shizentai' : 'rei', { size: 170 }) }),
          h('div', { class: 'jd-hero-info' },
            h('div', { class: 'bubble', onclick: () => GA.say(msg) }, msg, ' ', h('span', { style: { opacity: 0.6 } }, '🔊')),
            h('div', { class: 'jd-count' }, h('b', null, known), ` de ${total} palabras sabidas`), wordsBar(J.WORDS),
            h('div', { class: 'jd-actions' },
              h('button', { class: 'btn btn-big', onclick: () => { GA.sfx.play('tap'); GA.run(E.skillRound(next.id), { title: next.name, back: GA.screens.dojo, backLabel: '🥋 Dojo' }); } }, `▶ Entrenar: ${next.name.replace('Cinta ', '')}`),
              due.length ? h('button', { class: 'btn btn-info', onclick: () => GA.run(GA.shuffle(due).slice(0, 10).map((w) => ({ skill: beltOf(w).id, mode: 'learn', word: w.id })), { title: 'Repaso', back: GA.screens.dojo, backLabel: '🥋 Dojo' }) }, `🔁 Repasar ${Math.min(10, due.length)} ${due.length === 1 ? 'palabra' : 'palabras'}`) : null,
              h('button', { class: 'btn btn-sun', onclick: () => GA.screens.jlibreta() }, '📖 Mi libreta'),
              h('button', { class: 'btn btn-white' + (sOpen ? '' : ' jd-locked'), onclick: () => (sOpen ? GA.run(E.skillRound('jsensei'), { title: sensei.title, back: GA.screens.dojo, backLabel: '🥋 Dojo' }) : GA.ui.modal({ title: '🗣️ El sensei dice', text: `Se abre cuando avances en <b>${E.lockText('jsensei')}</b>.`, actions: [{ label: 'Ok', cls: 'btn-white' }], dismissable: true })) }, sOpen ? '🗣️ El sensei dice' : '🔒 El sensei dice')))),
        GA.judo.scenesSection ? GA.judo.scenesSection() : null,
        h('h2', { class: 'section-title' }, 'Tus cintas'),
        h('div', { class: 'jd-belts' }, belts),
        !hasJa() && canHear() ? h('p', { class: 'muted jd-note' }, '💡 Para oír las palabras con acento japonés, instala una voz japonesa en el dispositivo (en iPad/Mac: Ajustes → Accesibilidad → Contenido leído → Voces → Japonés → Kyoko).') : null)));
    GA.say(msg);
  };
  GA.AREAS[AREA].screen = GA.screens.dojo;
  GA.AREAS[AREA].art = () => `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#C7343F"/>
    <circle cx="160" cy="84" r="64" fill="#E85A64"/><path d="M0 160 H320 V200 H0Z" fill="#E9C46A"/><path d="M0 160 H320 M107 160 V200 M213 160 V200" stroke="#B9902F" stroke-width="3"/>
    <g transform="translate(96 40)">${judoka('shizentai', { size: 128, belt: '#1F1F1F' }).replace('<svg ', '<svg x="0" y="0" ')}</g>
    <g font-family="Baloo 2, sans-serif" font-weight="800" fill="#fff"><text x="22" y="56" font-size="30">Rei</text><text x="216" y="58" font-size="26">Hajime</text><text x="26" y="132" font-size="22" opacity=".85">Seiza</text><text x="244" y="130" font-size="22" opacity=".85">Obi</text></g></svg>`;

  GA.screens.jlibreta = function (sel = 0) {
    GA.screens.clear();
    const b = J.BELTS[sel];
    const tabs = h('div', { class: 'jd-tabs' }, J.BELTS.map((x, i) => h('button', { class: 'jd-tab' + (i === sel ? ' on' : ''), onclick: () => GA.screens.jlibreta(i) }, h('span', { html: obiSvg(x.color, 34) }), x.bonus ? 'Árbitro' : x.name.replace('Cinta ', ''))));
    const grid = h('div', { class: 'jd-grid' }, b.words.map((w) => {
      const st = STATUS[status(w.id)];
      return h('button', { class: 'jd-tile-card', onclick: () => cardModal(w) },
        h('span', { class: 'jd-dot', style: { background: st.color }, title: st.label }),
        h('div', { class: 'jd-tile-pic', html: pic(w, 70) }), h('b', null, w.w), jpLine(w, 'sm'), h('small', null, w.m));
    }));
    document.getElementById('app').append(h('div', { class: 'wrap area-judo' },
      h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => GA.screens.dojo() }, '⬅'), h('h1', { style: { marginRight: 'auto' } }, '📖 Mi libreta de judo'), h('span', { class: 'chip' }, `${knownCount()}/${J.WORDS.length} ✅`)),
      tabs,
      h('p', { class: 'muted jd-legend' }, Object.values(STATUS).map((s) => h('span', null, h('i', { class: 'jd-dot', style: { background: s.color } }), s.label))),
      h('h2', { class: 'section-title' }, `${b.icon} ${b.name} · ${b.theme}`),
      grid));
  };

  // ---------- Para el panel de padres ----------
  GA.judo = {
    judoka, status, STATUS, knownCount, dueWords,
    // para las escenas (act-judo-escenas.js)
    pic, sayJp, sp, talk, kana, jpLine, jpHtml, mini, hush, track, wordCard, earBtn, slowBtn, ws, canHear, beltColor, cardModal, obiSvg,
    parentsCard(card, stat) {
      const seenN = J.WORDS.filter((w) => ws(w.id)).length, known = knownCount();
      const hard = J.WORDS.filter((w) => ws(w.id) && ws(w.id).bad > 0 && status(w.id) !== 'known').sort((a, b) => (ws(b.id).bad - ws(b.id).ok / 3) - (ws(a.id).bad - ws(a.id).ok / 3)).slice(0, 8);
      const got = J.BELTS.filter(passed);
      return card('🥋 Dojo de Judo (japonés)',
        h('div', { class: 'pp-stats' },
          stat('Palabras sabidas', `${known}/${J.WORDS.length}`, 'recordadas en días distintos o en examen'),
          stat('En práctica', seenN - known, 'ya las vio, todavía no son firmes'),
          stat('Sin ver', J.WORDS.length - seenN),
          stat('Cintas ganadas', got.length, got.map((b) => b.name.replace('Cinta ', '')).join(' · ') || 'ninguna todavía'),
          stat('Para repasar hoy', dueWords().length)),
        h('div', { class: 'pp-scroll' }, h('table', { class: 'pp-table area-judo' },
          h('thead', null, h('tr', null, ['Cinta', 'Sabidas', 'Palabras'].map((x) => h('th', null, x)))),
          h('tbody', null, J.BELTS.map((b) => h('tr', null,
            h('td', null, `${b.icon} ${b.name}${passed(b) ? ' 🏅' : ''}`),
            h('td', { class: 'num' }, `${knownCount(b.words)}/${b.words.length}`),
            h('td', null, h('div', { class: 'jd-chips' }, b.words.map((w) => h('span', { class: 'jd-chip sm st-' + status(w.id), title: `${w.m} · ${STATUS[status(w.id)].label}${ws(w.id) ? ` · ✔${ws(w.id).ok} ✘${ws(w.id).bad}` : ''}` }, w.w))))))))),
        hard.length ? h('p', null, h('b', null, 'Le cuestan más: '), hard.map((w) => `${w.w} (${w.m})`).join(', ')) : null,
        h('p', { class: 'muted' }, '🟢 sabida · 🟡 aprendiendo · ⚪ sin ver. Una palabra es “sabida” cuando la recuerda en días distintos (repaso espaciado) o la contesta bien en el examen de cinta. Idea: en el coche, díganle la palabra en japonés y que haga la postura o diga qué significa; y pídanle que les “enseñe” las palabras: explicar es de las mejores formas de aprender.'),
        h('p', { class: 'muted' }, hasJa() ? `🔊 Voz japonesa: ${GA.voice.vJa.name}.` : '🔊 No hay voz japonesa instalada: las palabras se leen con la voz en español. Para el acento japonés: Ajustes → Accesibilidad → Contenido leído → Voces → Japonés (Kyoko).'));
    },
  };
})();
