/* Gael Aprende — Dojo de Judo: escenas para explorar
   Las palabras se aprenden mejor en su contexto que sueltas: aquí se ven sobre un dibujo
   (el judogui, el dojo visto desde arriba, la clase paso a paso, las direcciones, el árbitro…).
   - Explorar: toca una etiqueta, escucha cómo se dice en japonés y qué significa.
   - Ocultar nombres: el dibujo se queda con "?" para ponerse a prueba solo.
   - Juego ¿Dónde está?: Lumi dice la palabra y hay que tocar el lugar correcto (cuenta para el repaso de cada palabra). */
(function () {
  'use strict';
  const { h } = GA;
  const E = GA.engine;
  const J = GA.JUDO;
  const K = GA.judo;
  const W = (id) => J.byId[id];
  const LINE = '#33415C';

  // ---------- Dibujos ----------
  // Persona vista desde arriba (para el mapa del dojo)
  function person(x, y, belt = '#FFFFFF', face = 'down', s = 1) {
    const rot = { down: 0, up: 180, left: 90, right: -90 }[face];
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <ellipse cx="0" cy="0" rx="18" ry="11" fill="#fff" stroke="${LINE}" stroke-width="2.5"/>
      <rect x="-11" y="4" width="22" height="5" rx="2" fill="${belt}" stroke="${LINE}" stroke-width="1.2"/>
      <circle cx="0" cy="-1" r="9.5" fill="#F1C27D" stroke="${LINE}" stroke-width="2"/>
      <path d="M-9.5 -1 A9.5 9.5 0 0 1 9.5 -1 Q0 -6 -9.5 -1Z" fill="#2B2118" transform="rotate(180)"/></g>`;
  }
  const nested = (svg, x, y) => svg.replace('<svg ', `<svg x="${x}" y="${y}" `);
  const emo = (e, x, y, size) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${e}</text>`;

  const ART = {
    judogui() {
      const S = 470, x0 = 165, y0 = 18, k = S / 140;
      const P = (px, py) => [x0 + px * k, y0 + py * k];
      const [kx, ky] = P(58, 108);
      return `<rect width="800" height="500" fill="#FFF6F6"/><circle cx="400" cy="230" r="215" fill="#FDE7E9"/>
        <rect y="440" width="800" height="60" fill="#E9C46A"/><path d="M0 440 H800 M200 440 V500 M400 440 V500 M600 440 V500" stroke="#B9902F" stroke-width="3"/>
        ${nested(K.judoka('shizentai', { size: S, belt: K.beltColor() === '#DDE3EC' ? '#FFFFFF' : K.beltColor() }), x0, y0)}
        <g transform="translate(${kx} ${ky}) rotate(-20)"><rect x="-17" y="-8" width="34" height="16" rx="7" fill="#F7D9B5" stroke="${LINE}" stroke-width="2"/><path d="M-4 -4 V4 M4 -4 V4" stroke="#C99A6B" stroke-width="2"/></g>
        <g stroke="#C7343F" stroke-width="4" stroke-linecap="round"><path d="M${P(80, 26)[0]} ${P(80, 26)[1]} l18 -10 M${P(81, 31)[0]} ${P(81, 31)[1]} l22 0 M${P(80, 36)[0]} ${P(80, 36)[1]} l18 10"/></g>`;
    },
    dojo() {
      let s = `<rect width="800" height="500" fill="#F5EBDD"/><rect x="24" y="24" width="752" height="452" rx="18" fill="#E9CFA5" stroke="#B98B55" stroke-width="6"/>`;
      for (let y = 54; y < 470; y += 30) s += `<path d="M30 ${y} H770" stroke="#D8B88A" stroke-width="2"/>`;
      s += `<rect x="285" y="30" width="230" height="40" rx="8" fill="#8B5A2B"/>${emo('⛩️', 400, 50, 28)}`;
      s += `<rect x="560" y="34" width="150" height="34" rx="6" fill="#fff" stroke="#8B5A2B" stroke-width="3"/>${emo('⚫🥋⚫🥋', 635, 52, 18)}`;
      s += `<rect x="160" y="120" width="480" height="280" fill="#E03131"/><rect x="192" y="146" width="416" height="228" fill="#2FB344"/>`;
      for (let x = 192 + 52; x < 608; x += 52) s += `<path d="M${x} 146 V374" stroke="rgba(255,255,255,.28)" stroke-width="2"/>`;
      for (let y = 146 + 57; y < 374; y += 57) s += `<path d="M192 ${y} H608" stroke="rgba(255,255,255,.28)" stroke-width="2"/>`;
      s += `<rect x="50" y="160" width="62" height="160" rx="10" fill="#C9A273"/>`;
      s += person(400, 98, '#1F1F1F', 'down', 1.25) + person(81, 205, '#1F1F1F', 'right') + person(81, 270, '#8B5A2B', 'right');
      ['#FF922B', '#2FB344', '#FFD43B', '#2F7DE1', '#FF922B', '#FFFFFF'].forEach((b, i) => { s += person(250 + i * 60, 438, b, 'up'); });
      ['#FFD43B', '#2FB344', '#8E44AD'].forEach((b, i) => { s += person(718, 180 + i * 62, b, 'left'); });
      s += `<path d="M300 300 Q260 380 312 420" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="10 8" stroke-linecap="round"/><path d="M296 412 l16 10 l2 -18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += person(300, 290, '#FF922B', 'down');
      s += emo('🐣', 572, 468, 18);
      return s;
    },
    saludos() {
      const bg = ['#FFE29A', '#BFE7FF', '#7A68C8', '#1E2356'];
      let s = bg.map((c, i) => `<rect x="${i * 200}" width="200" height="500" fill="${c}"/>`).join('');
      s += `<rect y="400" width="800" height="100" fill="#7BC96F"/><rect x="400" y="400" width="400" height="100" fill="#3E7A3A"/>`;
      s += emo('🌅', 100, 150, 110) + emo('🧒', 100, 340, 80) + emo('☀️', 300, 110, 100) + emo('🏫', 300, 320, 110);
      s += emo('🌙', 500, 100, 80) + emo('🏯', 500, 320, 120) + emo('🛏️', 700, 330, 110) + emo('😴', 700, 220, 70);
      s += [[620, 60], [760, 120], [680, 140], [740, 40]].map(([x, y]) => emo('✨', x, y, 26)).join('');
      return s;
    },
    direcciones() {
      let s = `<rect width="800" height="500" fill="#EAF6FF"/><rect y="330" width="800" height="170" fill="#BFE3B0"/>`;
      s += `<path d="M30 470 L140 300 L250 470Z" fill="#8C9AA8"/><path d="M140 300 L112 343 L128 336 L140 350 L153 336 L168 343Z" fill="#fff"/>`;
      s += `<path d="M560 330 Q620 330 650 430 Q680 470 710 430 Q740 330 800 330 V500 H560Z" fill="#7BC96F"/><path d="M640 420 Q680 480 720 420" stroke="#4FB7F2" stroke-width="10" fill="none" stroke-linecap="round"/>`;
      s += `<circle cx="400" cy="250" r="118" fill="none" stroke="#8E44AD" stroke-width="7" stroke-dasharray="560 200" stroke-linecap="round"/><path d="M509 205 l16 -8 l2 18" stroke="#8E44AD" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      const arrow = (x1, y1, x2, y2, c) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 18; return `<path d="M${x1} ${y1} L${x2} ${y2} M${x2 - L * Math.cos(a - 0.5)} ${y2 - L * Math.sin(a - 0.5)} L${x2} ${y2} L${x2 - L * Math.cos(a + 0.5)} ${y2 - L * Math.sin(a + 0.5)}" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; };
      s += arrow(400, 205, 400, 90, '#12A876') + arrow(400, 295, 400, 400, '#E03131') + arrow(445, 250, 560, 250, '#2F7DE1') + arrow(355, 250, 240, 250, '#2F7DE1');
      s += person(400, 250, '#FFD43B', 'up', 2.2);
      s += `<g transform="translate(90 90)"><circle r="46" fill="#fff" stroke="${LINE}" stroke-width="3"/><path d="M0 -38 L9 0 L0 38 L-9 0Z" fill="#E03131"/><path d="M0 0 L9 0 L0 38 L-9 0Z" fill="#94A3B8"/></g>`;
      s += emo('🐘', 690, 95, 100) + emo('🐭', 700, 205, 34);
      return s;
    },
  };

  // ---------- Escenas ----------
  // pic: dibujo con etiquetas (x,y = punto señalado; lx,ly = etiqueta) · path: pasos en orden · board: grupos de tarjetas
  const SCENES = [
    { id: 'judogui', title: 'Mi judogui', icon: '🥋', type: 'pic', art: ART.judogui,
      intro: 'Este es tu judogui. Toca cada nombre para escuchar cómo se dice en japonés.',
      pins: [
        { w: 'judogui', x: 372, y: 175, lx: 130, ly: 110 }, { w: 'obi', x: 370, y: 284, lx: 120, ly: 230 },
        { w: 'kumikata', x: 333, y: 305, lx: 130, ly: 320 }, { w: 'shitabaki', x: 364, y: 340, lx: 140, ly: 400 },
        { w: 'itai', x: 356, y: 382, lx: 230, ly: 470 }, { w: 'kiai', x: 445, y: 118, lx: 640, ly: 60 },
        { w: 'uwagi', x: 425, y: 210, lx: 660, ly: 150 }, { w: 'morote', x: 460, y: 232, lx: 670, ly: 235 },
        { w: 'kotekubiwaza', x: 463, y: 285, lx: 660, ly: 320 }, { w: 'hizazume', x: 440, y: 375, lx: 640, ly: 410 },
      ] },
    { id: 'dojo', title: 'El dojo desde arriba', icon: '🏯', type: 'pic', art: ART.dojo,
      intro: 'Así se ve el dojo desde arriba. ¿Dónde se sienta el sensei? ¿Dónde se forman los alumnos?',
      pins: [
        { w: 'dojo', x: 760, y: 470, lx: 735, ly: 476 }, { w: 'kamiza', x: 330, y: 50, lx: 205, ly: 38 },
        { w: 'sensei', x: 412, y: 104, lx: 520, ly: 100 }, { w: 'yudanshakai', x: 635, y: 52, lx: 660, ly: 95 },
        { w: 'joseki', x: 81, y: 238, lx: 85, ly: 135 }, { w: 'shiaijo', x: 400, y: 210, lx: 400, ly: 210 },
        { w: 'yionai', x: 520, y: 320, lx: 520, ly: 320 }, { w: 'yiogai', x: 176, y: 380, lx: 120, ly: 420 },
        { w: 'naute', x: 285, y: 370, lx: 225, ly: 360 }, { w: 'shimoza', x: 430, y: 438, lx: 430, ly: 476 },
        { w: 'soito', x: 370, y: 438, lx: 330, ly: 476 }, { w: 'shoshinsha', x: 550, y: 438, lx: 600, ly: 476 },
        { w: 'shimozeki', x: 718, y: 242, lx: 700, ly: 370 },
      ] },
    { id: 'clase', title: 'La clase paso a paso', icon: '🕐', type: 'path',
      intro: 'Así es una clase de judo, desde que llegas hasta que te vas. Toca ver la clase y sigue los pasos.',
      steps: () => [greeting(), 'reiho', 'kiotsuke', 'seiza', 'mokuso', 'mokusoyame', 'shomennirei', 'senseinirei', 'kiritsu', 'junbiundo', 'kihondosa', 'ukemi', 'tandakuwaza', 'uke', 'uchikomi', 'kata', 'randori', 'seiritaiso', 'zarei', 'otagainirei', 'onegaimas', 'sayonara'] },
    { id: 'saludos', title: 'Saludos del día', icon: '🌅', type: 'pic', art: ART.saludos,
      intro: 'En la mañana, en la tarde, en la noche al llegar y al irte a dormir: cada momento tiene su saludo.',
      pins: [
        { w: 'ohaio', x: 100, y: 200, lx: 100, ly: 440 }, { w: 'konichiwa', x: 300, y: 160, lx: 300, ly: 440 },
        { w: 'kombanwa', x: 500, y: 250, lx: 500, ly: 430 }, { w: 'sayonara', x: 545, y: 330, lx: 500, ly: 475 },
        { w: 'oyasuminasai', x: 700, y: 300, lx: 700, ly: 440 },
      ] },
    { id: 'posturas', title: 'Posturas', icon: '🧍', type: 'board',
      intro: 'Así se para y se sienta un judoka. Haz cada postura con tu cuerpo.',
      groups: [
        { title: 'De pie', words: ['kiotsuke', 'tadase', 'shisentai', 'jigotai', 'rei', 'ritzurei', 'kiritsu'] },
        { title: 'En el piso', words: ['seiza', 'mokuso', 'zarei', 'agura'] },
        { title: 'Cómo te paras', words: ['shisei', 'shisen'] },
      ] },
    { id: 'direcciones', title: 'Direcciones y tamaños', icon: '🧭', type: 'pic', art: ART.direcciones,
      intro: 'Hacia adelante, hacia atrás, de lado, grande, pequeño, montaña y valle: estas palabras están dentro de los nombres de muchas técnicas.',
      pins: [
        { w: 'mae', x: 400, y: 100, lx: 470, ly: 75 }, { w: 'ushiro', x: 400, y: 395, lx: 470, ly: 410 },
        { w: 'yoko', x: 550, y: 250, lx: 620, ly: 290 }, { w: 'mawari', x: 300, y: 165, lx: 250, ly: 120 },
        { w: 'ho', x: 90, y: 90, lx: 90, ly: 160 }, { w: 'o', x: 690, y: 95, lx: 600, ly: 60 },
        { w: 'ko', x: 700, y: 205, lx: 620, ly: 205 }, { w: 'yama', x: 140, y: 330, lx: 260, ly: 330 },
        { w: 'tani', x: 680, y: 440, lx: 680, ly: 360 },
      ] },
    { id: 'tecnica', title: 'Cómo se hace una técnica', icon: '🤾', type: 'board',
      intro: 'Toda técnica tiene tres pasos: desequilibrar, acomodarse y lanzar. Y los nombres de las técnicas están hechos de pedacitos.',
      groups: [
        { title: 'Los 3 pasos de toda técnica', words: ['kusuhi', 'tsukuri', 'kake'], arrows: true },
        { title: 'Cómo te mueves', words: ['sabaki', 'tsurikomi'] },
        { title: 'Pedacitos de los nombres', words: ['barai', 'harai', 'guruma', 'otoshi', 'garami', 'gatame', 'osae', 'tomoe', 'hadaka'] },
        { title: 'Más palabras', words: ['judo', 'ku'] },
      ],
      ex: { barai: 'De-ashi-<b>barai</b>', harai: '<b>Harai</b>-goshi', guruma: 'Kata-<b>guruma</b>', otoshi: 'Tai-<b>otoshi</b>', garami: 'Ude-<b>garami</b>', gatame: 'Kesa-<b>gatame</b>',
        osae: '<b>Osae</b>-komi', tomoe: '<b>Tomoe</b>-nage', hadaka: '<b>Hadaka</b>-jime', tsurikomi: '<b>Tsurikomi</b>-goshi', judo: '<b>Ju</b> + <b>do</b>' } },
    { id: 'waza', title: 'La familia waza', icon: '🌳', type: 'board',
      intro: 'Waza quiere decir técnica. Cuando oigas waza al final de una palabra, ya sabes que es un tipo de técnica.',
      groups: [
        { title: 'Lanzar y contraatacar', words: ['nagewaza', 'kaeshiwaza', 'renrakuwaza', 'urawaza'] },
        { title: 'Defenderse', words: ['fusegiwaza', 'gonosenwaza', 'jukado'] },
        { title: 'Tus técnicas', words: ['tokuiwaza', 'tsukuriwaza', 'tandakuwaza', 'tureiwaza'] },
        { title: 'En el piso y más', words: ['nogarekata', 'kotekubiwaza', 'kusure', 'kappo', 'kata', 'kihondosa'] },
      ] },
    { id: 'arbitro', title: 'El torneo y el árbitro', icon: '🧑‍⚖️', type: 'board',
      intro: 'En un torneo el árbitro habla en japonés. ¡Así vas a entender todo lo que dice!',
      groups: [
        { title: 'El torneo', words: ['shiai', 'shiaijo', 'otagainirei', 'randori', 'kiai'] },
        { title: 'El árbitro dice', words: ['hajime', 'matte', 'osaekomi', 'toketa', 'soremade'], arrows: true },
        { title: 'Puntos y faltas', words: ['ippon', 'wazaari', 'shido'] },
      ] },
  ];
  function greeting() { const hr = new Date().getHours(); return hr < 12 ? 'ohaio' : hr < 19 ? 'konichiwa' : 'kombanwa'; }
  // Muestra el nombre en una etiqueta o tarjeta que estaba en "?"
  const pinLabel = (el, w) => { el.innerHTML = ''; if (w) el.append(h('span', null, w.w), h('small', null, w.p)); else el.textContent = '?'; };
  const reveal = (el, w) => { if (el.classList.contains('jx-pin')) pinLabel(el, w); else if (!el.querySelector('.jd-jp')) { el.querySelector('b').textContent = w.w; el.querySelector('b').after(K.jpLine(w, 'sm')); } };
  const sceneWords = (sc) => [...new Set(sc.type === 'pic' ? sc.pins.map((p) => p.w) : sc.type === 'path' ? sc.steps() : sc.groups.flatMap((g) => g.words))].map(W);

  // ---------- Dibujar una escena ----------
  // o.game: oculta los nombres; o.hide: nombres ocultos al explorar; o.onPick(word, el)
  function renderScene(sc, o = {}) {
    const hidden = o.game || o.hide;
    const pick = (w, el) => o.onPick && o.onPick(w, el);
    if (sc.type === 'pic') {
      const lines = sc.pins.map((p) => (p.x === p.lx && p.y === p.ly ? '' : `<path d="M${p.x} ${p.y} L${p.lx} ${p.ly}" stroke="${LINE}" stroke-width="2.5" stroke-dasharray="5 4"/>`) + `<circle cx="${p.x}" cy="${p.y}" r="6" fill="#fff" stroke="${LINE}" stroke-width="3"/>`).join('');
      const box = h('div', { class: 'jx-pic' }, h('div', { class: 'jx-art', html: `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">${sc.art()}${lines}</svg>` }));
      sc.pins.forEach((p) => {
        const w = W(p.w);
        const el = h('button', { class: 'jx-pin', 'data-w': w.id, style: { left: (p.lx / 8) + '%', top: (p.ly / 5) + '%' }, 'aria-label': hidden ? 'Lugar' : w.w, onclick: () => pick(w, el) });
        pinLabel(el, hidden ? null : w);
        box.append(el);
      });
      return box;
    }
    const card = (w, i, ex) => {
      const el = h('button', { class: 'jx-card', 'data-w': w.id, 'aria-label': hidden ? w.m : w.w, onclick: () => pick(w, el) },
        i != null ? h('span', { class: 'jx-n' }, i + 1) : null,
        h('div', { class: 'jx-card-pic', html: K.pic(w, 78) }),
        h('b', null, hidden ? '?' : w.w),
        hidden ? null : K.jpLine(w, 'sm'),
        ex && !hidden ? h('small', { html: ex }) : null);
      return el;
    };
    if (sc.type === 'path') return h('div', { class: 'jx-path' }, sc.steps().map((id, i) => card(W(id), i)));
    return h('div', { class: 'jx-board' }, sc.groups.map((g) => h('section', { class: 'jx-group' + (g.arrows ? ' arrows' : '') },
      h('h3', null, g.title), h('div', { class: 'jx-cards' }, g.words.map((id) => card(W(id), null, sc.ex && sc.ex[id]))))));
  }

  // ---------- Pantalla de exploración ----------
  GA.screens.jscene = function (id, hide = false) {
    GA.screens.clear();
    K.hush();
    const sc = SCENES.find((x) => x.id === id);
    const info = h('div', { class: 'jx-info' }, h('p', { class: 'muted' }, hide ? '¿Te acuerdas? Toca un “?” para ver qué es.' : '👆 Toca un nombre para escucharlo en japonés.'));
    let cur = null;
    const show = (w, el) => {
      GA.sfx.play('tap');
      if (cur) cur.classList.remove('on');
      cur = el; el.classList.add('on');
      if (hide) reveal(el, w);
      const st = K.STATUS[K.status(w.id)];
      info.innerHTML = '';
      info.append(h('div', { class: 'jx-info-pic', html: K.pic(w, 84) }),
        h('div', { class: 'jx-info-txt' },
          h('div', { class: 'jx-info-w' }, w.w, ' ', h('span', { class: 'jd-status', style: { background: st.color } }, st.label)),
          K.jpLine(w),
          h('div', { class: 'jx-info-m' }, w.m),
          h('div', { class: 'jd-tip' }, '💡 ', w.t)),
        h('div', { class: 'jx-info-btns' }, K.earBtn(w, '🔊 Escuchar'), K.slowBtn(w)));
      K.talk(info, () => K.sayJp(w), () => GA.sleep(200), () => GA.say(w.m));
    };
    const words = sceneWords(sc);
    const autoplay = sc.type === 'path' ? h('button', { class: 'btn btn-sun', onclick: () => {
      const cards = GA.$$('.jx-card', view);
      K.talk(view, ...cards.flatMap((c, i) => [() => { c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); show(W(c.dataset.w), c); return GA.say(`Paso ${i + 1}.`); }, () => K.sayJp(W(c.dataset.w)), () => GA.say(W(c.dataset.w).m), () => GA.sleep(500)]));
    } }, '▶ Ver la clase') : null;
    const view = renderScene(sc, { hide, onPick: show });
    document.getElementById('app').append(h('div', { class: 'area-judo' },
      h('div', { class: 'world-head' }, h('div', { class: 'row' },
        h('button', { class: 'icon-btn', 'aria-label': 'Volver al dojo', onclick: () => GA.screens.dojo() }, '⬅'),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('h1', null, `${sc.icon} ${sc.title}`), h('p', null, `${words.length} palabras · toca y escucha`)))),
      h('div', { class: 'wrap jx-wrap' },
        h('div', { class: 'jx-bar' },
          h('div', { class: 'bubble jx-intro', onclick: () => GA.say(sc.intro) }, sc.intro, ' 🔊'),
          h('div', { class: 'jx-tools' }, autoplay,
            h('button', { class: 'btn btn-white', onclick: () => GA.screens.jscene(id, !hide) }, hide ? '🏷️ Mostrar nombres' : '🙈 Ocultar nombres'),
            h('button', { class: 'btn btn-ok', onclick: () => playScene(sc) }, '🎮 ¿Dónde está?'))),
        view, info)));
    GA.say(sc.intro);
  };

  // ---------- Juego ¿Dónde está? (en el corredor: estrellas, dragones y repaso por palabra) ----------
  function playScene(sc) {
    const words = sceneWords(sc);
    const ws = K.ws;
    // primero las que menos se sabe
    const order = GA.shuffle(words).sort((a, b) => (ws(a.id) ? ws(a.id).box : -1) - (ws(b.id) ? ws(b.id).box : -1));
    const list = GA.shuffle(order.slice(0, Math.min(8, words.length)));
    GA.run(list.map((w) => ({ skill: 'jexplora', mode: 'learn', scene: sc.id, word: w.id })), { title: sc.title, back: () => GA.screens.jscene(sc.id), backLabel: `${sc.icon} Escena` });
  }
  GA.skill({
    id: 'jexplora', area: 'judo', title: 'Explora el dojo', icon: '🗺️',
    desc: 'Busca en el dibujo la palabra que dice Lumi: el judogui, el dojo, la clase, las direcciones y el árbitro.',
    levels: ['Encuéntralo leyendo', 'Encuéntralo escuchando'],
    roundLen: () => 8,
    make(L, ctx, entry) {
      ctx.n = (ctx.n || 0) + 1;
      ctx.again = ctx.again || [];
      const sc = SCENES.find((x) => x.id === (entry && entry.scene)) || GA.pick(SCENES);
      const words = sceneWords(sc);
      const w = (entry && entry.word && W(entry.word)) || GA.fresh(ctx, words.filter((x) => x.id !== ctx.lastId), (x) => x.id);
      ctx.lastId = w.id;
      const listen = L >= 2 && K.canHear();
      return {
        text: listen ? 'Escucha: ¿dónde está?' : `¿Dónde está “${w.w}”?`,
        say: listen ? 'Escucha. ¿Dónde está?' : `¿Dónde está ${K.sp(w)}?`,
        noAutoRead: true, tag: 'jw:' + w.id,
        render(stage, api0) {
          const api = K.track(api0, w, ctx, false);
          let done = false;
          const view = renderScene(sc, { game: true, onPick: (x, el) => {
            if (done || el.classList.contains('wrong')) return;
            GA.sfx.play('tap');
            const ok = x === w;
            const r = api.answer(ok);
            if (ok) { done = true; el.classList.add('right'); reveal(el, w); K.sayJp(w); }
            else {
              el.classList.add('wrong');
              if (r === 'done') { done = true; const t = view.querySelector(`[data-w="${w.id}"]`); if (t) { t.classList.add('right'); reveal(t, w); } }
            }
          } });
          stage.append(h('div', { class: 'jx-target' }, listen
            ? h('button', { class: 'jd-big-ear jx-ear', 'aria-label': 'Escuchar otra vez', onclick: () => { K.hush(); K.sayJp(w); } }, '🔊')
            : h('div', { class: 'jd-q' }, h('div', { class: 'jd-word' }, w.w), K.jpLine(w)), listen ? null : K.earBtn(w)), view);
          K.talk(stage, () => GA.say(listen ? '¿Dónde está?' : '¿Dónde está'), () => K.sayJp(w));
        },
        hint: `${w.w} quiere decir: ${w.m}.`,
        explain: { text: `${w.w} es: ${w.m}. ${w.t}`, html: K.mini(w) },
        fact: `${w.w} (se dice ${w.p}): ${w.m}.`,
      };
    },
  });

  // ---------- Sección en el dojo ----------
  K.SCENES = SCENES;
  K.scenesSection = () => h('section', { class: 'jx-section' },
    h('h2', { class: 'section-title' }, '🗺️ Explora y aprende'),
    h('p', { class: 'muted jx-sub' }, 'Toca los dibujos para ver dónde va cada palabra y escuchar cómo se dice en japonés.'),
    h('div', { class: 'jx-scenes' }, SCENES.map((sc) => {
      const words = sceneWords(sc), k = K.knownCount(words);
      return h('button', { class: 'jx-scene', onclick: () => { GA.sfx.play('tap'); GA.screens.jscene(sc.id); } },
        h('span', { class: 'jx-scene-ic' }, sc.icon), h('b', null, sc.title), h('small', null, `${k} de ${words.length} sabidas`));
    })));
})();
