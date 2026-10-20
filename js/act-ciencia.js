/* Gael Aprende — Ciencias y Experimentación
   Ciclo Predice → Observa → Explica: primero el niño hace una hipótesis, luego el experimento
   virtual muestra qué pasa y al final se explica el porqué (acierte o no). */
(function () {
  'use strict';
  const { h } = GA;
  const ui = GA.ui;

  // Predicción + experimento: el niño elige, se corre la simulación, se evalúa
  function predictTest(stage, api, { options, actual, run }) {
    const wrap = ui.choices(options.map((o) => ({ label: o.label, value: o.value, cls: 'txt' })), async (opt, b, w) => {
      w.dataset.locked = '1';
      b.classList.add('sel');
      await run();
      const ok = opt.value === actual;
      b.classList.remove('sel');
      b.classList.add(ok ? 'right' : 'wrong');
      api.answer(ok, { final: true });
    }, { cls: 'txt' });
    stage.append(wrap);
  }

  // ======================= FLOTA O SE HUNDE =======================
  const FLOAT = [
    { e: '🪵', n: 'un trozo de madera', f: 1, why: 'La madera es ligera para su tamaño: tiene muchísimos huequitos con aire.', lv: 1 },
    { e: '🪨', n: 'una piedra', f: 0, why: 'La piedra es muy pesada para su tamaño. Decimos que es densa.', lv: 1 },
    { e: '🪙', n: 'una moneda', f: 0, why: 'Aunque es pequeñita, el metal está muy apretado y es más denso que el agua.', lv: 1 },
    { e: '🍃', n: 'una hoja', f: 1, why: 'La hoja es delgada y ligera, y se apoya sobre mucha agua.', lv: 1 },
    { e: '🦆', n: 'un patito de hule', f: 1, why: 'Está hueco y lleno de aire. El aire es mucho más ligero que el agua.', lv: 1 },
    { e: '🔑', n: 'una llave', f: 0, why: 'Es de metal macizo, más denso que el agua.', lv: 1 },
    { e: '⚓', n: 'un ancla', f: 0, why: '¡Las anclas están hechas para hundirse y detener a los barcos!', lv: 1 },
    { e: '🏐', n: 'una pelota', f: 1, why: 'Está llena de aire, por eso flota.', lv: 1 },
    { e: '🔩', n: 'un tornillo', f: 0, why: 'El metal macizo es más denso que el agua.', lv: 1 },
    { e: '🧽', n: 'una esponja seca', f: 1, why: 'Tiene muchos agujeritos llenos de aire.', lv: 1 },
    { e: '🍎', n: 'una manzana', f: 1, why: '¡Sorpresa! Una cuarta parte de la manzana es aire escondido entre sus células.', lv: 2 },
    { e: '🧊', n: 'un cubo de hielo', f: 1, why: 'Cuando el agua se congela se estira y ocupa más espacio, así que el hielo es más ligero que el agua líquida.', lv: 2 },
    { e: '🚢', n: 'un barco de acero', f: 1, why: 'Aunque es de metal, tiene forma de cuenco lleno de aire y empuja muchísima agua. ¡La forma importa!', lv: 2 },
    { e: '🥚', n: 'un huevo fresco', f: 0, why: 'Un huevo fresco se hunde en agua normal. ¡Pero flota si el agua tiene mucha sal!', lv: 2 },
    { e: '🍊', n: 'una naranja con cáscara', f: 1, why: 'La cáscara tiene burbujitas de aire, como un chaleco salvavidas. Sin cáscara, ¡se hunde!', lv: 2 },
    { e: '🍇', n: 'una uva', f: 0, why: 'La uva tiene mucha agua y azúcar, y casi nada de aire. Es un poquito más densa que el agua.', lv: 2 },
    { e: '✏️', n: 'un lápiz de madera', f: 1, why: 'Es casi todo madera, que es ligera.', lv: 2 },
    { e: '🥕', n: 'una zanahoria', f: 0, why: 'La zanahoria es firme y apretada, un poco más densa que el agua.', lv: 2 },
    { e: '🌲', n: 'un tronco enorme', f: 1, why: 'Aunque pesa muchísimo, la madera es menos densa que el agua. ¡Lo que importa no es el peso sino la densidad!', lv: 2 },
  ];
  const WHY_Q = [
    { t: '¿Por qué flota un barco de acero tan pesado?', o: ['Por su forma hueca llena de aire', 'Porque el acero es ligero', 'Porque el agua es mágica'], a: 0, e: '🚢' },
    { t: '¿Por qué se hunde una moneda tan pequeña?', o: ['Porque el metal es muy denso', 'Porque es redonda', 'Porque es brillante'], a: 0, e: '🪙' },
    { t: '¿Por qué flota el hielo?', o: ['Porque al congelarse el agua ocupa más espacio y es más ligera', 'Porque está frío', 'Porque es cuadrado'], a: 0, e: '🧊' },
    { t: '¿Qué ayuda a que las cosas floten?', o: ['Tener aire dentro', 'Ser de color azul', 'Ser muy pesadas'], a: 0, e: '🛟' },
    { t: 'Un tronco enorme flota y un clavo pequeño se hunde. ¿Qué importa más?', o: ['De qué está hecho (su densidad)', 'Su tamaño', 'Su peso total'], a: 0, e: '🪵' },
    { t: 'Si le pones mucha sal al agua, un huevo…', o: ['Flota', 'Se rompe', 'Se cocina'], a: 0, e: '🥚' },
  ];
  function tank(e) {
    const t = h('div', { class: 'tank' }, h('div', { class: 'water' }), h('div', { class: 'splash' }, '💦'), h('div', { class: 'thing' }, e));
    t.drop = (floats) => new Promise((res) => {
      const th = t.querySelector('.thing');
      GA.sfx.play('whoosh');
      th.style.top = floats ? '62px' : 'calc(100% - 82px)';
      setTimeout(() => { GA.sfx.play('splash'); t.querySelector('.splash').classList.add('go'); }, 450);
      setTimeout(() => { if (floats) th.classList.add('float'); res(); }, 1500);
    });
    return t;
  }
  GA.skill({
    id: 'flotar', area: 'ciencia', title: '¿Flota o se hunde?', icon: '🛟', desc: 'Predice, lanza al agua y descubre por qué.',
    levels: ['Objetos de casa', 'Sorpresas', '¿Por qué pasa?', 'Gran experimento'],
    lessons: {
      1: [
        { say: '¡Hora de experimentar! Primero piensa: ¿flotará o se hundirá? Eso se llama hacer una predicción.', html: '🤔 ➜ 🧪 ➜ 💡' },
        { say: 'Luego lo lanzamos al agua para comprobarlo. Los científicos aprenden mucho cuando sus predicciones fallan.', html: '🛟 🌊 ⚓' },
      ],
      3: [{ say: 'Las cosas flotan cuando son más ligeras que el agua para su tamaño. Eso se llama densidad. ¡El aire ayuda mucho a flotar!', html: '🪵🛟 vs 🪨⚓' }],
    },
    make(L, ctx) {
      if (L === 3) {
        const q = GA.fresh(ctx, WHY_Q, (x) => x.t);
        return {
          text: q.t, say: q.t,
          render(stage, api) { stage.append(h('div', { class: 'big-pic' }, q.e), ui.answerChoices(GA.shuffle(q.o.map((o, i) => ({ label: o, ok: i === q.a, cls: 'wide', say: o }))), api, { speakOnTap: true })); },
          hint: 'Piensa en el aire y en qué tan apretado está el material.',
          explain: { text: `${q.o[q.a]}.` },
          tag: 'densidad',
        };
      }
      if (L === 4) {
        const objs = GA.sample(FLOAT, 5);
        return {
          text: 'Gran experimento: ordena qué flota y qué se hunde, ¡y luego pruébalo!', say: 'Arrastra cada objeto al grupo que crees. Luego comprueba.',
          render(stage, api) {
            const s = ui.sorter({
              items: objs.map((o) => ({ html: o.e, label: o.n.replace(/^una? /, ''), cat: o.f ? 'f' : 's', say: o.n })),
              bins: [{ id: 'f', title: 'Flota', icon: '🛟' }, { id: 's', title: 'Se hunde', icon: '⚓' }],
              checkLabel: '🧪 ¡Probar en el agua!',
              onCheck(res, sapi) {
                sapi.mark(res);
                const ok = res.every((r) => r.ok);
                const r = api.answer(ok);
                if (!ok && r === 'retry') sapi.returnWrong(res);
                if (ok || r === 'done') sapi.solve();
              },
            });
            stage.append(s.el);
          },
          hint: '¿Tiene aire dentro? ¿Es de metal o piedra?',
          explain: { text: objs.map((o) => `${o.e} ${o.f ? 'flota' : 'se hunde'}`).join(' · ') + '. ' + GA.pick(objs).why },
          tag: 'clasificar-densidad',
        };
      }
      const o = GA.fresh(ctx, FLOAT.filter((x) => x.lv === L), (x) => x.e);
      return {
        text: `¿${o.n[0].toUpperCase() + o.n.slice(1)} flota o se hunde?`, say: `Predice: ¿${o.n} flota o se hunde?`,
        render(stage, api) {
          const t = tank(o.e);
          stage.append(t);
          predictTest(stage, api, { options: [{ label: '🛟 Flota', value: 1 }, { label: '⚓ Se hunde', value: 0 }], actual: o.f, run: () => t.drop(!!o.f) });
        },
        explain: { text: `${o.n[0].toUpperCase() + o.n.slice(1)} ${o.f ? 'flota' : 'se hunde'}. ${o.why}` },
        fact: o.why,
        tag: L === 2 ? 'flotar-sorpresas' : 'flotar',
      };
    },
  });

  // ======================= LABORATORIO DE COLORES =======================
  const PAINT = { rojo: '#E53935', amarillo: '#FDD835', azul: '#1E63D6', blanco: '#FFFFFF', negro: '#2B2B2B' };
  const RESULT = {
    'amarillo+rojo': ['naranja', '#FB8C00'], 'amarillo+azul': ['verde', '#43A047'], 'azul+rojo': ['morado', '#7B3FA0'],
    'blanco+rojo': ['rosa', '#F48FB1'], 'azul+blanco': ['celeste', '#81D4FA'], 'blanco+negro': ['gris', '#9E9E9E'],
    'amarillo+azul+rojo': ['café', '#795548'], 'amarillo+blanco': ['amarillo claro', '#FFF59D'], 'negro+rojo': ['rojo oscuro', '#7F1D1D'],
    'azul+negro': ['azul marino', '#1A2A5E'], 'amarillo+negro': ['verde oliva', '#6B6B1E'],
  };
  const mixOf = (set) => {
    const arr = [...set].sort();
    if (!arr.length) return null;
    if (arr.length === 1) return [arr[0], PAINT[arr[0]]];
    const k = arr.join('+');
    if (RESULT[k]) return RESULT[k];
    const rgb = arr.map((c) => PAINT[c].match(/\w\w/g).map((x) => parseInt(x, 16)));
    const avg = [0, 1, 2].map((i) => Math.round(rgb.reduce((a, c) => a + c[i], 0) / rgb.length * 0.8));
    return ['una mezcla oscura', '#' + avg.map((v) => v.toString(16).padStart(2, '0')).join('')];
  };
  function jarSVG(color) {
    return `<svg viewBox="0 0 72 82"><rect x="14" y="2" width="44" height="12" rx="4" fill="#B0BEC5"/><path d="M10 16 h52 v54 a10 10 0 0 1 -10 10 h-32 a10 10 0 0 1 -10 -10z" fill="${color}" stroke="rgba(0,0,0,.2)" stroke-width="3"/><rect x="18" y="28" width="10" height="34" rx="5" fill="#fff" opacity=".35"/></svg>`;
  }
  function colorLab(stage, colors, onMix) {
    const set = new Set();
    const beaker = GA.html(`<svg class="beaker" viewBox="0 0 170 200"><defs><clipPath id="bk"><path d="M35 20 v130 a30 30 0 0 0 30 30 h40 a30 30 0 0 0 30 -30 v-130z"/></clipPath></defs>
      <g clip-path="url(#bk)"><rect class="liquid" x="0" y="200" width="170" height="200" fill="#ccc"/></g>
      <path d="M28 14 h114 M35 20 v130 a30 30 0 0 0 30 30 h40 a30 30 0 0 0 30 -30 v-130" fill="none" stroke="#9FB3C8" stroke-width="6" stroke-linecap="round"/>
      <rect x="48" y="40" width="10" height="100" rx="5" fill="#fff" opacity=".5"/></svg>`);
    const label = h('div', { class: 'state-label' }, 'Vaso vacío');
    const draw = () => {
      const r = mixOf(set);
      const liq = beaker.querySelector('.liquid');
      const lvl = set.size === 0 ? 200 : 170 - set.size * 40;
      liq.setAttribute('y', lvl);
      if (r) liq.setAttribute('fill', r[1]);
      label.textContent = r ? (set.size > 1 ? '¡' + r[0][0].toUpperCase() + r[0].slice(1) + '!' : r[0]) : 'Vaso vacío';
    };
    const jars = h('div', { class: 'jars' }, colors.map((c) => h('button', { class: 'jar', 'aria-label': c, onclick: () => {
      if (set.has(c) || set.size >= 3) return;
      set.add(c); GA.sfx.play('pop'); draw();
      const r = mixOf(set); GA.say(set.size > 1 ? r[0] : c);
      onMix && onMix(set);
    } }, h('span', { html: jarSVG(PAINT[c]) }), c)));
    const empty = h('button', { class: 'btn btn-white btn-sm', onclick: () => { set.clear(); GA.sfx.play('whoosh'); draw(); onMix && onMix(set); } }, '🚰 Vaciar');
    stage.append(h('div', { class: 'lab' }, jars, h('div', { class: 'beaker-wrap' }, beaker, label, empty)));
    draw();
    return { set, empty: () => { set.clear(); draw(); }, setTo: (arr) => { set.clear(); arr.forEach((x) => set.add(x)); draw(); } };
  }
  const recipeOf = (name) => Object.keys(RESULT).find((k) => RESULT[k][0] === name).split('+');
  GA.skill({
    id: 'colores', area: 'ciencia', title: 'Laboratorio de colores', icon: '🎨', desc: 'Mezcla pinturas y descubre colores nuevos.',
    levels: ['Colores secundarios', 'Predice la mezcla', 'Claros y oscuros', 'Mezclas expertas'],
    lessons: {
      1: [{ say: 'Rojo, amarillo y azul son los colores primarios. ¡Con ellos podemos crear muchos colores nuevos!', html: `<span class="swatch" style="background:${PAINT.rojo}"></span><span class="swatch" style="background:${PAINT.amarillo}"></span><span class="swatch" style="background:${PAINT.azul}"></span>` }],
      3: [{ say: 'El blanco hace los colores más claros y el negro los hace más oscuros.', html: `<span class="swatch" style="background:#E53935"></span> + <span class="swatch" style="background:#fff"></span> = <span class="swatch" style="background:#F48FB1"></span>` }],
    },
    sandbox(stage) {
      stage.append(h('div', { class: 'muted center' }, 'Laboratorio libre: mezcla hasta 3 colores. ¿Cuántos colores nuevos descubres?'));
      colorLab(stage, Object.keys(PAINT));
    },
    make(L, ctx) {
      if (L === 2 || (L === 4 && Math.random() < 0.5)) {
        if (L === 4) {
          const target = GA.pick(['naranja', 'verde', 'morado']);
          const rec = recipeOf(target);
          const pairs = GA.shuffle([rec, ...GA.sample([['rojo', 'azul'], ['amarillo', 'azul'], ['rojo', 'amarillo'], ['rojo', 'blanco'], ['azul', 'blanco']].filter((p) => p.sort().join() !== [...rec].sort().join()), 2)]);
          return {
            text: `¿Qué dos colores forman el ${target}?`, say: `¿Qué dos colores hay que mezclar para obtener ${target}?`,
            render(stage, api) {
              stage.append(h('span', { class: 'swatch', style: { background: RESULT[rec.slice().sort().join('+')][1], width: '110px', height: '110px' } }));
              stage.append(ui.answerChoices(pairs.map((p) => ({ html: `<div class="row" style="gap:6px"><span class="swatch" style="background:${PAINT[p[0]]};width:56px;height:56px"></span>+<span class="swatch" style="background:${PAINT[p[1]]};width:56px;height:56px"></span></div>`, ok: p.slice().sort().join() === rec.slice().sort().join(), say: p.join(' y ') })), api, { speakOnTap: true }));
            },
            hint: 'Piensa en el arcoíris: ¿qué colores están a cada lado?',
            explain: { text: `${rec.join(' + ')} = ${target}.` },
            tag: 'mezcla-inversa',
          };
        }
        const pair = GA.fresh(ctx, [['amarillo', 'rojo'], ['amarillo', 'azul'], ['azul', 'rojo']], (x) => x.join());
        const res = RESULT[pair.join('+')];
        const opts = GA.shuffle([res, ...GA.sample(Object.values(RESULT).filter((r) => r[0] !== res[0] && !/oscuro|marino|oliva|claro/.test(r[0])), 2)]);
        return {
          text: `Predice: ¿qué color sale al mezclar ${pair[0]} y ${pair[1]}?`, say: `Si mezclamos ${pair[0]} y ${pair[1]}, ¿qué color crees que sale?`,
          render(stage, api) {
            const labBox = h('div', { style: { display: 'none', width: '100%' } });
            const lab = colorLab(labBox, pair);
            stage.append(h('div', { class: 'row' }, h('span', { class: 'swatch', style: { background: PAINT[pair[0]] } }), h('span', { class: 'big-expr' }, '+'), h('span', { class: 'swatch', style: { background: PAINT[pair[1]] } }), h('span', { class: 'big-expr' }, '='), h('span', { class: 'big-expr q' }, '?')));
            stage.append(ui.answerChoices(opts.map((r) => ({ html: `<div style="display:grid;justify-items:center;gap:4px"><span class="swatch" style="background:${r[1]}"></span><span style="font-size:1.1rem">${r[0]}</span></div>`, ok: r[0] === res[0] })), api, { after: (opt, r) => { if (opt.ok || r === 'done') { labBox.style.display = 'block'; lab.setTo(pair); } } }), labBox);
          },
          hint: 'Imagina pintar con las dos pinturas al mismo tiempo.',
          explain: { text: `${pair[0]} + ${pair[1]} = ${res[0]}.`, html: `<span class="swatch" style="background:${res[1]}"></span>` },
          fact: `¡Sí! ${pair[0]} y ${pair[1]} forman ${res[0]}.`,
          tag: 'predecir-mezcla',
        };
      }
      const target = L === 1 ? GA.fresh(ctx, ['naranja', 'verde', 'morado']) : L === 3 ? GA.fresh(ctx, ['rosa', 'celeste', 'gris']) : 'café';
      const rec = recipeOf(target);
      const colors = L === 1 ? ['rojo', 'amarillo', 'azul'] : Object.keys(PAINT);
      return {
        text: `Crea el color ${target.toUpperCase()}`, say: `Toca los frascos para mezclar y crear el color ${target}. Cuando lo tengas, toca listo.`,
        render(stage, api) {
          stage.append(h('div', { class: 'row' }, h('span', null, 'Meta:'), h('span', { class: 'swatch', style: { background: RESULT[rec.slice().sort().join('+')][1] } })));
          const lab = colorLab(stage, colors);
          stage.append(h('button', { class: 'btn btn-ok btn-big', onclick: () => {
            if (!lab.set.size) return;
            const ok = [...lab.set].sort().join('+') === rec.slice().sort().join('+');
            const r = api.answer(ok);
            if (r === 'retry') setTimeout(() => lab.empty(), 900);
            if (r === 'done') lab.setTo(rec);
          } }, '¡Listo!'));
        },
        hint: target === 'café' ? '¡Prueba mezclar los tres colores primarios!' : L === 3 ? 'El blanco aclara y el negro oscurece.' : 'Necesitas dos colores primarios.',
        explain: { text: `${rec.join(' + ')} = ${target}.` },
        tag: L === 3 ? 'tonos' : 'mezclar-colores',
      };
    },
  });

  // ======================= ESTADOS DEL AGUA =======================
  function matterSim(canvas, getT) {
    const ctx = canvas.getContext('2d');
    const W = 320, H = 240, N = 42, R = 12;
    canvas.width = W * 2; canvas.height = H * 2; ctx.scale(2, 2);
    const lattice = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) lattice.push([W / 2 - 3 * 2 * R * 1.05 + c * 2 * R * 1.05, H - R - 8 - r * 2 * R * 0.95]);
    const ps = lattice.map(([x, y]) => ({ x, y, vx: 0, vy: 0 }));
    let alive = true;
    const step = () => {
      if (!alive || !canvas.isConnected) return;
      const T = getT();
      const st = T < 0 ? 's' : T < 100 ? 'l' : 'g';
      for (let i = 0; i < N; i++) {
        const p = ps[i];
        if (st === 's') {
          const [lx, ly] = lattice[i];
          const jit = 0.3 + (T + 30) / 30;
          p.vx += (lx - p.x) * 0.08 + (Math.random() - 0.5) * jit; p.vy += (ly - p.y) * 0.08 + (Math.random() - 0.5) * jit;
          p.vx *= 0.7; p.vy *= 0.7;
        } else {
          const kick = st === 'l' ? 0.25 + T / 200 : 1.2 + (T - 100) / 40;
          p.vx += (Math.random() - 0.5) * kick; p.vy += (Math.random() - 0.5) * kick;
          if (st === 'l') { p.vy += 0.18; p.vx *= 0.97; p.vy *= 0.94; }
          else { const sp = Math.hypot(p.vx, p.vy), want = 3 + (T - 100) / 15; if (sp > 0) { p.vx *= 0.98 + 0.02 * want / sp; p.vy *= 0.98 + 0.02 * want / sp; } }
          for (let j = i + 1; j < N; j++) {
            const q = ps[j], dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
            if (d > 0 && d < 2 * R) { const f = (2 * R - d) * (st === 'l' ? 0.45 : 0.25) / d; p.vx -= dx * f; p.vy -= dy * f; q.vx += dx * f; q.vy += dy * f; }
          }
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < R) { p.x = R; p.vx = Math.abs(p.vx); } if (p.x > W - R) { p.x = W - R; p.vx = -Math.abs(p.vx); }
        if (p.y < R) { p.y = R; p.vy = Math.abs(p.vy); } if (p.y > H - R) { p.y = H - R; p.vy = -Math.abs(p.vy) * (st === 'g' ? 1 : 0.3); }
      }
      ctx.clearRect(0, 0, W, H);
      const col = st === 's' ? '#8FD8FF' : st === 'l' ? '#2E8CF0' : '#B9C7D9';
      if (st === 's') {
        ctx.strokeStyle = 'rgba(80,160,220,.5)'; ctx.lineWidth = 2;
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y); if (d < 2.3 * R) { ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); } }
      }
      for (const p of ps) {
        ctx.beginPath(); ctx.arc(p.x, p.y, R - 1, 0, 6.3); ctx.fillStyle = col; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x - 3, p.y - 3, 2.5, 0, 6.3); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
      }
      requestAnimationFrame(step);
    };
    step();
    return { stop() { alive = false; } };
  }
  const STATE = (T) => (T < 0 ? { k: 's', n: 'Sólido', d: 'hielo', e: '🧊' } : T < 100 ? { k: 'l', n: 'Líquido', d: 'agua', e: '💧' } : { k: 'g', n: 'Gas', d: 'vapor', e: '☁️' });
  function matterBox(stage, T0, opts = {}) {
    let T = T0;
    const cv = h('canvas', { 'aria-label': 'Simulación de partículas de agua' });
    const lab = h('div', { class: 'state-label' });
    const temp = h('div', { class: 'temp' });
    const slider = h('input', { type: 'range', min: -30, max: 130, value: T0, id: 'thermo-' + Math.random().toString(36).slice(2), 'aria-label': 'Temperatura' });
    const upd = () => { const s = STATE(T); lab.textContent = `${s.e} ${s.n} (${s.d})`; temp.textContent = `${T} °C`; temp.style.color = T < 0 ? '#2563D6' : T < 100 ? '#12A876' : '#D94848'; opts.onChange && opts.onChange(T, s); };
    slider.addEventListener('input', () => { T = +slider.value; upd(); });
    if (opts.locked) slider.disabled = true;
    stage.append(h('div', { class: 'matter' }, h('div', { style: { display: 'grid', gap: '8px', justifyItems: 'center', width: '100%' } }, cv, lab), h('div', { class: 'thermo' }, h('span', { style: { fontSize: '2rem' } }, '🔥'), slider, h('span', { style: { fontSize: '2rem' } }, '❄️'), temp)));
    matterSim(cv, () => T);
    upd();
    return { setT(v) { T = v; slider.value = v; upd(); }, getT: () => T };
  }
  const PROC = { fusion: ['Fusión', 'sólido a líquido', '🧊➜💧'], evap: ['Evaporación', 'líquido a gas', '💧➜☁️'], cond: ['Condensación', 'gas a líquido', '☁️➜💧'], solid: ['Solidificación', 'líquido a sólido', '💧➜🧊'] };
  const LIFE = [
    { t: 'La ropa mojada se seca al sol', e: '👕☀️', p: 'evap' }, { t: 'El helado se derrite en tu mano', e: '🍦🫠', p: 'fusion' },
    { t: 'Aparecen gotitas en un vaso con agua fría', e: '🥛💧', p: 'cond' }, { t: 'Hacemos cubitos de hielo en el congelador', e: '🧊❄️', p: 'solid' },
    { t: 'El espejo del baño se empaña con la ducha caliente', e: '🪞🚿', p: 'cond' }, { t: 'Un charco desaparece en un día caluroso', e: '💧🌞', p: 'evap' },
    { t: 'La mantequilla se derrite en la sartén', e: '🧈🍳', p: 'fusion' }, { t: 'Un charco se congela en invierno', e: '⛸️❄️', p: 'solid' },
    { t: 'Sale vapor de la olla con agua hirviendo', e: '🍲♨️', p: 'evap' }, { t: 'La nieve se derrite en primavera', e: '⛄🌷', p: 'fusion' },
  ];
  GA.skill({
    id: 'estados', area: 'ciencia', title: 'Hielo, agua y vapor', icon: '🧊', desc: 'Calienta y enfría el agua y mira cómo se mueven sus partículas.',
    levels: ['Calor y frío', 'Sólido, líquido y gas', 'Cambios de estado', 'En la vida diaria'],
    lessons: {
      1: [
        { say: 'Todo está hecho de partículas tan pequeñas que no las podemos ver. ¡Aquí las vas a ver con una lupa mágica!', html: '🔍💧' },
        { say: 'Con frío, las partículas están quietas y juntas: es hielo. Con calor se mueven más y más rápido.', html: '🧊 ➜ 💧 ➜ ☁️' },
      ],
      3: [{ say: 'Cuando el hielo se vuelve agua se llama fusión. Cuando el agua se vuelve vapor, evaporación. El vapor que se enfría y vuelve a ser agua es condensación. Y el agua que se congela, solidificación.', html: '🧊➜💧➜☁️' }],
    },
    sandbox(stage) {
      stage.append(h('div', { class: 'muted center' }, 'Mueve el termómetro y observa las partículas. ¿A qué temperatura se derrite el hielo? ¿Y cuándo hierve el agua?'));
      matterBox(stage, 20);
    },
    make(L, ctx) {
      if (L === 1) {
        const task = GA.fresh(ctx, [
          { t: 'Derrite el hielo: sube la temperatura', T0: -20, goal: 'l', done: '¡El hielo se derritió! Las partículas se separaron y empezaron a moverse.' },
          { t: 'Convierte el agua en vapor', T0: 40, goal: 'g', done: '¡A 100 grados el agua hierve y se vuelve vapor! Las partículas vuelan rápido por todos lados.' },
          { t: 'Congela el agua', T0: 30, goal: 's', done: '¡Bajo cero el agua se congela! Las partículas se quedan juntas y casi quietas.' },
        ], (x) => x.goal);
        return {
          text: task.t + ' 🌡️', say: task.t + '. Mueve el termómetro.',
          render(stage, api) {
            let timer = null, done = false;
            matterBox(stage, task.T0, { onChange: (T, s) => {
              clearTimeout(timer);
              if (!done && s.k === task.goal) timer = setTimeout(() => { done = true; api.answer(true); }, 1600);
            } });
          },
          explain: { text: task.done }, fact: task.done, tag: 'temperatura',
        };
      }
      if (L === 2) {
        const T = GA.pick([GA.rand(-25, -5), GA.rand(15, 80), GA.rand(105, 125)]);
        const s = STATE(T);
        GA.fresh(ctx, [s.k]);
        return {
          text: 'Mira las partículas. ¿En qué estado está el agua?', say: 'Observa cómo se mueven las partículas. ¿Es sólido, líquido o gas?',
          render(stage, api) {
            matterBox(stage, T, { locked: true });
            GA.$$('.state-label', stage).forEach((x) => { x.style.visibility = 'hidden'; });
            stage.append(ui.answerChoices([['s', '🧊 Sólido'], ['l', '💧 Líquido'], ['g', '☁️ Gas']].map(([k, l]) => ({ label: l, ok: k === s.k, cls: 'txt' })), api, { after: (o, r) => { if (o.ok || r === 'done') GA.$$('.state-label', stage).forEach((x) => { x.style.visibility = 'visible'; }); } }));
          },
          hint: 'Quietas y en filas: sólido. Juntas pero moviéndose: líquido. Separadas y volando: gas.',
          explain: { text: `Está en estado ${s.n.toLowerCase()} (${s.d}) a ${T} °C.` },
          tag: 'estados',
        };
      }
      if (L === 3) {
        const k = GA.fresh(ctx, Object.keys(PROC));
        const [A, B] = { fusion: [-20, 40], evap: [60, 115], cond: [118, 60], solid: [30, -20] }[k];
        return {
          text: 'Observa el cambio. ¿Cómo se llama?', say: 'Mira lo que le pasa al agua. ¿Cómo se llama este cambio?',
          render(stage, api) {
            const box = matterBox(stage, A, { locked: true });
            let t = A;
            const iv = setInterval(() => { if (!stage.isConnected) return clearInterval(iv); t += (B > A ? 2 : -2); if ((B > A && t >= B) || (B < A && t <= B)) { t = B; clearInterval(iv); } box.setT(t); }, 70);
            stage.append(ui.answerChoices(GA.shuffle(Object.keys(PROC)).map((p) => ({ html: `<div style="display:grid;justify-items:center"><span>${PROC[p][0]}</span><small style="font-size:.9rem">${PROC[p][2]}</small></div>`, ok: p === k, cls: 'txt', say: PROC[p][0] })), api, { cls: 'txt', speakOnTap: true }));
          },
          hint: '¿De qué estado empezó y en cuál terminó?',
          explain: { text: `${PROC[k][0]}: el agua pasa de ${PROC[k][1]}.` },
          tag: 'cambios-estado',
        };
      }
      const q = GA.fresh(ctx, LIFE, (x) => x.t);
      return {
        text: `${q.t}. ¿Qué cambio es?`, say: `${q.t}. ¿Qué cambio de estado es?`,
        render(stage, api) { stage.append(h('div', { class: 'big-pic' }, q.e), ui.answerChoices(GA.shuffle(Object.keys(PROC)).map((p) => ({ html: `<div style="display:grid;justify-items:center"><span>${PROC[p][0]}</span><small style="font-size:.9rem">${PROC[p][2]}</small></div>`, ok: p === q.p })), api, { cls: 'txt' })); },
        hint: '¿El agua (o la cosa) pasa a ser sólida, líquida o gas?',
        explain: { text: `Es ${PROC[q.p][0].toLowerCase()}: pasa de ${PROC[q.p][1]}.` },
        tag: 'cambios-vida-diaria',
      };
    },
  });

  // ======================= ANIMALES =======================
  const AN = [
    ['🐄', 'vaca', 'tierra', 'herb', 'mam'], ['🦁', 'león', 'tierra', 'carn', 'mam'], ['🐋', 'ballena', 'agua', 'carn', 'mam'], ['🐬', 'delfín', 'agua', 'carn', 'mam'],
    ['🦅', 'águila', 'aire', 'carn', 'ave'], ['🦜', 'loro', 'aire', 'herb', 'ave'], ['🐔', 'gallina', 'tierra', 'omni', 'ave'], ['🐟', 'pez', 'agua', 'omni', 'pez'],
    ['🦈', 'tiburón', 'agua', 'carn', 'pez'], ['🐢', 'tortuga', 'agua', 'herb', 'rep'], ['🐍', 'serpiente', 'tierra', 'carn', 'rep'], ['🐊', 'cocodrilo', 'agua', 'carn', 'rep'],
    ['🦎', 'lagartija', 'tierra', 'carn', 'rep'], ['🐸', 'rana', 'agua', 'carn', 'anf'], ['🦋', 'mariposa', 'aire', 'herb', 'ins'], ['🐝', 'abeja', 'aire', 'herb', 'ins'],
    ['🐜', 'hormiga', 'tierra', 'omni', 'ins'], ['🕷️', 'araña', 'tierra', 'carn', 'ara'], ['🦂', 'escorpión', 'tierra', 'carn', 'ara'], ['🐴', 'caballo', 'tierra', 'herb', 'mam'],
    ['🐰', 'conejo', 'tierra', 'herb', 'mam'], ['🐻', 'oso', 'tierra', 'omni', 'mam'], ['🐷', 'cerdo', 'tierra', 'omni', 'mam'], ['🐒', 'mono', 'tierra', 'omni', 'mam'],
    ['🦒', 'jirafa', 'tierra', 'herb', 'mam'], ['🐘', 'elefante', 'tierra', 'herb', 'mam'], ['🐯', 'tigre', 'tierra', 'carn', 'mam'], ['🐺', 'lobo', 'tierra', 'carn', 'mam'],
    ['🐙', 'pulpo', 'agua', 'carn', 'mol'], ['🦉', 'búho', 'aire', 'carn', 'ave'], ['🦇', 'murciélago', 'aire', 'carn', 'mam'], ['🐞', 'mariquita', 'aire', 'carn', 'ins'],
    ['🦗', 'grillo', 'tierra', 'herb', 'ins'], ['🐌', 'caracol', 'tierra', 'herb', 'mol'], ['🐑', 'oveja', 'tierra', 'herb', 'mam'], ['🦩', 'flamenco', 'agua', 'omni', 'ave'],
  ].map(([e, n, hab, diet, cls]) => ({ e, n, hab, diet, cls }));
  const CLS = { mam: ['Mamíferos', '🍼', 'Tienen pelo y toman leche de mamá'], ave: ['Aves', '🪶', 'Tienen plumas y nacen de huevo'], pez: ['Peces', '🐟', 'Tienen escamas y respiran con branquias'], rep: ['Reptiles', '🦎', 'Tienen escamas secas y ponen huevos'], anf: ['Anfibios', '🐸', 'Viven en agua y en tierra; piel húmeda'], ins: ['Insectos', '🐜', 'Tienen 6 patas'], ara: ['Arácnidos', '🕷️', 'Tienen 8 patas'] };
  GA.skill({
    id: 'animales', area: 'ciencia', title: 'El mundo animal', icon: '🦁', desc: 'Clasifica animales: dónde viven, qué comen y a qué grupo pertenecen.',
    levels: ['¿Dónde vive?', '¿Qué come?', 'Grupos de animales', 'Insectos y arañas'],
    lessons: {
      1: [{ say: 'Los científicos ordenan a los animales en grupos. Hoy los ordenaremos según dónde viven: en el agua, en la tierra o volando en el aire.', html: '🐟 🐄 🦅' }],
      2: [{ say: 'Los herbívoros comen plantas. Los carnívoros comen otros animales. ¡Los omnívoros comen de todo, como tú!', html: '🐄🌿 🦁🍖 🐻🍯' }],
      3: [{ say: 'Los mamíferos tienen pelo y toman leche de su mamá. Las aves tienen plumas. Los peces, escamas y branquias. Los reptiles tienen piel seca con escamas.', html: '🐘 🦜 🐟 🐍' }],
      4: [{ say: 'Los insectos tienen seis patas. Las arañas no son insectos: ¡tienen ocho patas! Son arácnidos.', html: '🐜 = 6 · 🕷️ = 8' }],
    },
    make(L, ctx) {
      let bins, key, pool, n = 5;
      if (L === 1) { key = 'hab'; bins = [{ id: 'agua', title: 'Agua', icon: '🌊' }, { id: 'tierra', title: 'Tierra', icon: '🌳' }, { id: 'aire', title: 'Aire', icon: '☁️' }]; pool = AN.filter((a) => !['tortuga', 'cocodrilo', 'rana', 'flamenco', 'mariquita'].includes(a.n)); }
      else if (L === 2) { key = 'diet'; bins = [{ id: 'herb', title: 'Herbívoros', icon: '🌿', sub: 'Comen plantas' }, { id: 'carn', title: 'Carnívoros', icon: '🍖', sub: 'Comen carne' }, { id: 'omni', title: 'Omnívoros', icon: '🍽️', sub: 'Comen de todo' }]; pool = AN; }
      else if (L === 3) { key = 'cls'; const groups = GA.sample(['mam', 'ave', 'pez', 'rep'], 3); bins = groups.map((g) => ({ id: g, title: CLS[g][0], icon: CLS[g][1], sub: CLS[g][2] })); pool = AN.filter((a) => groups.includes(a.cls)); n = 6; }
      else { key = 'cls'; bins = [{ id: 'ins', title: 'Insectos', icon: '🐜', sub: '6 patas' }, { id: 'ara', title: 'Arácnidos', icon: '🕷️', sub: '8 patas' }]; pool = AN.filter((a) => a.cls === 'ins' || a.cls === 'ara'); n = 5; }
      let items = GA.sample(pool, n);
      // asegurar al menos un animal por grupo
      bins.forEach((b) => { if (!items.some((a) => a[key] === b.id)) { const c = pool.find((a) => a[key] === b.id && !items.includes(a)); if (c) items[GA.rand(0, items.length - 1)] = c; } });
      items = [...new Set(items)];
      GA.fresh(ctx, [items.map((a) => a.n).join()]);
      return {
        text: 'Lleva cada animal a su grupo', say: 'Arrastra cada animal a su grupo. También puedes tocar un animal y luego el grupo.',
        render(stage, api) {
          const s = ui.sorter({
            items: items.map((a) => ({ html: a.e, label: a.n, cat: a[key], say: a.n })), bins,
            onCheck(res, sapi) {
              sapi.mark(res);
              const ok = res.every((r) => r.ok);
              const r = api.answer(ok);
              if (!ok && r === 'retry') sapi.returnWrong(res);
              if (ok || r === 'done') sapi.solve();
            },
          });
          stage.append(s.el);
        },
        hint: L === 3 ? 'Piensa: ¿tiene pelo, plumas o escamas?' : L === 4 ? 'Cuenta las patas: 6 es insecto, 8 es arácnido.' : 'Imagina al animal en su casa.',
        explain: { text: items.map((a) => `${a.e} ${a.n}: ${bins.find((b) => b.id === a[key]).title.toLowerCase()}`).join(' · ') },
        tag: 'clasificar-' + key,
      };
    },
  });

  // ======================= CICLOS DE VIDA =======================
  const SVGI = {
    crisalida: `<svg viewBox="0 0 60 60" width="52" height="52"><line x1="10" y1="6" x2="50" y2="6" stroke="#8C6A4A" stroke-width="5" stroke-linecap="round"/><line x1="30" y1="6" x2="30" y2="12" stroke="#6E5236" stroke-width="2"/><path d="M30 12 C44 18 42 44 30 56 C18 44 16 18 30 12Z" fill="#7CB342" stroke="#558B2F" stroke-width="2"/><path d="M24 26 h12 M23 34 h14 M25 42 h10" stroke="#558B2F" stroke-width="2"/></svg>`,
    huevosRana: `<svg viewBox="0 0 60 60" width="52" height="52">${[[20, 20], [34, 16], [46, 26], [26, 34], [40, 38], [16, 44], [30, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#DDEFFF" stroke="#9CC6E8" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3" fill="#23304D"/>`).join('')}</svg>`,
    renacuajo: `<svg viewBox="0 0 60 60" width="52" height="52"><path d="M30 30 C40 22 52 36 58 26 C52 44 40 36 30 34Z" fill="#4E5D3A"/><ellipse cx="22" cy="31" rx="13" ry="10" fill="#4E5D3A"/><circle cx="17" cy="28" r="2.5" fill="#fff"/></svg>`,
    ranita: `<svg viewBox="0 0 60 60" width="52" height="52"><path d="M34 34 C44 30 50 40 58 36 C50 48 42 40 34 40Z" fill="#6A9B3A"/><ellipse cx="24" cy="34" rx="14" ry="11" fill="#7CB342"/><path d="M14 42 l-6 8 M30 43 l4 8" stroke="#558B2F" stroke-width="4" stroke-linecap="round"/><circle cx="17" cy="27" r="5" fill="#fff"/><circle cx="17" cy="27" r="2.5" fill="#23304D"/></svg>`,
  };
  const CYCLES = {
    planta: { name: 'la planta', lv: 1, st: [['🌰', 'semilla'], ['🌱', 'brote'], ['🪴', 'planta joven'], ['🌻', 'planta con flor']] },
    mariposa: { name: 'la mariposa', lv: 2, st: [['🥚', 'huevo'], ['🐛', 'oruga'], [SVGI.crisalida, 'crisálida'], ['🦋', 'mariposa']] },
    rana: { name: 'la rana', lv: 3, st: [[SVGI.huevosRana, 'huevos'], [SVGI.renacuajo, 'renacuajo'], [SVGI.ranita, 'renacuajo con patas'], ['🐸', 'rana adulta']] },
    agua: { name: 'el agua', lv: 4, st: [['♨️', 'evaporación: el sol calienta el agua y sube como vapor'], ['☁️', 'condensación: el vapor se enfría y forma nubes'], ['🌧️', 'precipitación: cae la lluvia'], ['🌊', 'recolección: el agua llega a ríos y mares']] },
    pollito: { name: 'la gallina', lv: 1, st: [['🥚', 'huevo'], ['🐣', 'pollito saliendo'], ['🐥', 'pollito'], ['🐔', 'gallina']] },
  };
  const pic = (x) => (x.startsWith('<svg') ? x : `<span style="font-size:2.6rem">${x}</span>`);
  GA.skill({
    id: 'ciclos', area: 'ciencia', title: 'Ciclos de la vida', icon: '🦋', desc: 'Ordena cómo crecen y cambian los seres vivos.',
    levels: ['Planta y gallina', 'La mariposa', 'La rana', 'El ciclo del agua'],
    lessons: {
      2: [{ say: 'La mariposa cambia muchísimo: huevo, oruga, crisálida y mariposa. ¡Ese cambio se llama metamorfosis!', html: '🥚 ➜ 🐛 ➜ ' + SVGI.crisalida + ' ➜ 🦋' }],
      4: [{ say: 'El agua del planeta viaja en círculo: sube como vapor, forma nubes, cae como lluvia y vuelve a los ríos y mares. ¡Y vuelve a empezar!', html: '♨️ ➜ ☁️ ➜ 🌧️ ➜ 🌊' }],
    },
    make(L, ctx) {
      const avail = Object.keys(CYCLES).filter((k) => CYCLES[k].lv <= L);
      const k = GA.fresh(ctx, avail.filter((x) => CYCLES[x].lv === L || Math.random() < 0.4).concat(avail.filter((x) => CYCLES[x].lv === L)));
      const c = CYCLES[k];
      const kind = Math.random() < 0.6 ? 'order' : 'next';
      if (kind === 'next') {
        const i = GA.rand(0, c.st.length - 2);
        const nxt = c.st[i + 1];
        const opts = GA.shuffle(c.st.filter((s, j) => j !== i).slice(0, 3));
        return {
          text: `En el ciclo de ${c.name}, ¿qué viene después?`, say: `En el ciclo de ${c.name}, ¿qué viene después de ${c.st[i][1].split(':')[0]}?`,
          render(stage, api) {
            stage.append(h('div', { class: 'row' }, h('span', { html: pic(c.st[i][0]) }), h('span', { class: 'arrow' }, '➜'), h('span', { class: 'big-expr q' }, '?')));
            stage.append(ui.answerChoices(opts.map((s) => ({ html: `<div style="display:grid;justify-items:center;gap:4px">${pic(s[0])}<small style="font-size:.9rem">${s[1].split(':')[0]}</small></div>`, ok: s === nxt, say: s[1].split(':')[0] })), api, { cls: 'txt', speakOnTap: true }));
          },
          hint: 'Piensa en cómo va creciendo poco a poco.',
          explain: { text: `Después de ${c.st[i][1].split(':')[0]} viene ${nxt[1]}.`, html: c.st.map((s) => pic(s[0])).join('<span class="arrow">➜</span>') },
          tag: 'ciclo-siguiente',
        };
      }
      return {
        text: `Ordena el ciclo de ${c.name}`, say: `Ordena las etapas del ciclo de ${c.name}, de la primera a la última.`,
        render(stage, api) {
          const sl = ui.slots({
            n: c.st.length, numbered: true, arrows: true, tileCls: 'emoji',
            tiles: GA.shuffle(c.st.map((s, i) => ({ html: pic(s[0]), value: i, say: s[1] }))),
            onFull(vals, sa) {
              const okArr = vals.map((v, i) => v === i);
              const ok = okArr.every(Boolean);
              sa.mark(okArr);
              const r = api.answer(ok);
              if (!ok && r === 'retry') sa.returnWrong(okArr);
              if (ok || r === 'done') { sa.solve(c.st.map((s, i) => i)); sa.lock(); }
            },
          });
          stage.append(sl.el);
        },
        hint: '¿Qué es lo primero de todo? Toca cada dibujo para escuchar su nombre.',
        explain: { text: c.st.map((s, i) => `${i + 1}. ${s[1]}`).join(' · '), html: c.st.map((s) => pic(s[0])).join('<span class="arrow">➜</span>') },
        tag: 'ciclo-' + k,
      };
    },
  });

  // ======================= EL JARDÍN (plantas) =======================
  function plantSVG({ g = 1, leaf = '#43A047', flower = true, droop = false, pale = false, tall = 1, parts = false, size = 200 }) {
    const H = 90 * g * tall;
    const stemTop = 160 - H;
    const lc = pale ? '#D4E157' : leaf;
    const bend = droop ? 22 : 0;
    let leaves = '';
    if (g > 0.15) {
      for (let i = 1; i <= Math.max(1, Math.round(3 * g)); i++) {
        const y = 160 - (H * i) / 4;
        leaves += `<path class="p-hoja" d="M100 ${y} q${-28} ${-14 + bend} ${-40} ${6 + bend} q22 ${8} 40 ${-6}Z" fill="${lc}"/><path class="p-hoja" d="M100 ${y - 8} q28 ${-14 + bend} 40 ${6 + bend} q-22 8 -40 -6Z" fill="${lc}"/>`;
      }
    }
    const fl = flower && g > 0.8 ? `<g class="p-flor">${GA.range(0, 7).map((i) => `<ellipse cx="${100 + 14 * Math.cos(i * 0.785)}" cy="${stemTop + bend + 14 * Math.sin(i * 0.785)}" rx="9" ry="9" fill="#FFC233"/>`).join('')}<circle cx="100" cy="${stemTop + bend}" r="9" fill="#8D5524"/></g>` : '';
    return `<svg viewBox="0 0 200 240" width="${size}" height="${size * 1.2}">
      <path class="p-raiz" d="M100 172 q-6 20 -22 34 M100 172 q4 24 2 46 M100 172 q10 18 26 30 M90 196 q-10 4 -16 14 M110 194 q10 6 14 18" stroke="#A1887F" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="40" y="160" width="120" height="14" rx="4" fill="#8D6E63" opacity=".55"/>
      <path class="p-tallo" d="M100 165 Q${100 + bend} ${(165 + stemTop) / 2} ${100 + bend / 2} ${stemTop + bend}" stroke="${pale ? '#C0CA33' : '#2E7D32'}" stroke-width="${pale ? 4 : 7}" fill="none" stroke-linecap="round"/>
      ${leaves}${fl}
      ${parts ? '' : ''}</svg>`;
  }
  const NEEDS = [['💧', 'agua', 1], ['☀️', 'luz del sol', 1], ['💨', 'aire', 1], ['🟫', 'tierra con nutrientes', 1], ['🍫', 'chocolate', 0], ['📺', 'televisión', 0], ['🧸', 'juguetes', 0], ['🥤', 'refresco', 0], ['🎵', 'música', 0]];
  const PLANT_FN = [
    { q: '¿Qué parte toma el agua de la tierra?', a: 'raiz' }, { q: '¿Qué parte fabrica el alimento con la luz del sol?', a: 'hoja' },
    { q: '¿Qué parte lleva el agua desde abajo hasta las hojas?', a: 'tallo' }, { q: '¿Qué parte se convierte en fruto con semillas?', a: 'flor' },
    { q: '¿Qué parte sostiene a la planta para que no se caiga con el viento?', a: 'raiz' }, { q: '¿Qué parte tiene colores para atraer a las abejas?', a: 'flor' },
  ];
  const PART_NAMES = { raiz: 'raíz', tallo: 'tallo', hoja: 'hoja', flor: 'flor' };
  function growResult(w, l) {
    if (w === 0) return { cfg: { g: 0.55, leaf: '#A1887F', flower: false, droop: true }, t: 'Sin suficiente agua, la planta se marchita y se seca.' };
    if (w === 2) return { cfg: { g: 0.6, leaf: '#C0CA33', flower: false, droop: true }, t: '¡Demasiada agua! Las raíces se ahogan porque también necesitan aire, y las hojas se ponen amarillas.' };
    if (l === 0) return { cfg: { g: 1, tall: 1.25, pale: true, flower: false }, t: 'En la oscuridad la planta crece alta, delgada y amarilla buscando la luz. Sin luz no puede fabricar su alimento.' };
    if (l === 1) return { cfg: { g: 0.75, flower: false }, t: 'Con sombra crece verde pero lento, y no le alcanza la energía para dar flores.' };
    return { cfg: { g: 1, flower: true }, t: '¡Perfecto! Con agua suficiente y mucho sol, la planta crece fuerte y da flores.' };
  }
  GA.skill({
    id: 'plantas', area: 'ciencia', title: 'El jardín secreto', icon: '🌻', desc: 'Experimenta con agua y luz y conoce las partes de las plantas.',
    levels: ['¿Qué necesita una planta?', 'Experimento de crecimiento', 'Partes de la planta', '¿Para qué sirve cada parte?'],
    lessons: {
      2: [{ say: 'Vamos a hacer un experimento: tú decides cuánta agua y cuánta luz recibe la planta. Luego pasamos siete días y vemos qué pasa.', html: '💧 + ☀️ ➜ 🌱 ➜ 🌻' }],
      3: [{ say: 'La planta tiene raíz, tallo, hojas y flor. Cada parte tiene un trabajo importante.', html: plantSVG({ g: 1, size: 120 }) }],
    },
    sandbox(stage) {
      stage.append(h('div', { class: 'muted center' }, 'Invernadero libre: prueba todas las combinaciones de agua y luz.'));
      growLab(stage, null);
    },
    make(L, ctx) {
      if (L === 1) {
        const items = GA.shuffle([...NEEDS.filter((n) => n[2]), ...GA.sample(NEEDS.filter((n) => !n[2]), 3)]);
        return {
          text: 'Toca TODO lo que una planta necesita para vivir', say: 'Toca todas las cosas que una planta necesita para vivir. Luego toca listo.',
          render(stage, api) {
            const sel = new Set();
            const wrap = h('div', { class: 'choices' }, items.map((it) => {
              const b = h('button', { class: 'choice txt', html: `<div style="display:grid;justify-items:center"><span style="font-size:2.6rem">${it[0]}</span><small style="font-size:1rem">${it[1]}</small></div>` });
              b.addEventListener('click', () => { sel.has(it) ? sel.delete(it) : sel.add(it); b.classList.toggle('sel'); GA.sfx.play('tap'); GA.say(it[1]); });
              b._it = it;
              return b;
            }));
            stage.append(wrap, h('button', { class: 'btn btn-ok btn-big', onclick: () => {
              const ok = items.every((it) => !!it[2] === sel.has(it));
              const r = api.answer(ok);
              if (!ok) GA.$$('.choice', wrap).forEach((b) => { if (b._it[2] !== sel.has(b._it) * 1 && !b._it[2]) b.classList.add('shake'); });
              if (r === 'done' || ok) GA.$$('.choice', wrap).forEach((b) => { b.classList.remove('sel', 'shake'); if (b._it[2]) b.classList.add('right'); });
            } }, '¡Listo!'));
          },
          hint: 'Son cuatro cosas. ¡Una de ellas no se ve pero está en todas partes!',
          explain: { text: 'Las plantas necesitan agua, luz del sol, aire y tierra con nutrientes. Con eso fabrican su propio alimento.' },
          tag: 'necesidades-plantas',
        };
      }
      if (L === 2) {
        if (Math.random() < 0.5) {
          return {
            text: 'Haz que la planta crezca sana y con flores', say: 'Elige cuánta agua y cuánta luz recibe la planta, y luego pasa siete días.',
            render(stage, api) { growLab(stage, api); },
            hint: 'Piensa: ¿demasiada agua es buena? ¿Las plantas crecen en la oscuridad?',
            explain: { text: 'Las plantas necesitan agua suficiente (ni poca ni demasiada) y mucha luz del sol para crecer y dar flores.' },
            tag: 'experimento-plantas',
          };
        }
        const sc = GA.fresh(ctx, [[0, 2, 'sin agua'], [1, 0, 'en un armario oscuro'], [2, 2, 'con muchísima agua todos los días']], (x) => x[2]);
        const res = growResult(sc[0], sc[1]);
        const opts = GA.shuffle([{ cfg: res.cfg, ok: true }, { cfg: { g: 1, flower: true }, ok: false }, { cfg: sc[1] === 0 ? { g: 0.55, leaf: '#A1887F', droop: true, flower: false } : { g: 1, tall: 1.25, pale: true, flower: false }, ok: false }]);
        return {
          text: `Una planta pasó una semana ${sc[2]}. ¿Cómo se ve?`, say: `Predice: una planta pasó una semana ${sc[2]}. ¿Cómo se verá?`,
          render(stage, api) { stage.append(ui.answerChoices(opts.map((o) => ({ html: plantSVG(Object.assign({ size: 110 }, o.cfg)), ok: o.ok })), api)); },
          hint: '¿Qué le falta o qué le sobra a esa planta?',
          explain: { text: res.t, html: plantSVG(Object.assign({ size: 90 }, res.cfg)) },
          fact: res.t,
          tag: 'predecir-plantas',
        };
      }
      if (L === 3) {
        const part = GA.fresh(ctx, Object.keys(PART_NAMES));
        return {
          text: `Toca ${part === 'flor' || part === 'raiz' || part === 'hoja' ? 'la' : 'el'} ${PART_NAMES[part]} de la planta`, say: `Toca ${part === 'tallo' ? 'el' : 'la'} ${PART_NAMES[part]} de la planta.`,
          render(stage, api) {
            const box = h('div', { html: plantSVG({ g: 1, size: 260 }) });
            let locked = false;
            box.querySelectorAll('[class^="p-"]').forEach((el) => {
              el.style.cursor = 'pointer';
              el.addEventListener('click', () => {
                if (locked) return;
                const p = el.getAttribute('class').slice(2);
                const r = api.answer(p === part);
                const mark = (k, c) => box.querySelectorAll('.p-' + k).forEach((x) => { x.style.filter = `drop-shadow(0 0 6px ${c})`; if (x.tagName === 'path' && x.getAttribute('fill') === 'none') x.setAttribute('stroke', c); });
                if (p === part) { mark(part, '#26BF63'); locked = true; } else { GA.say('Eso es ' + (p === 'tallo' ? 'el ' : 'la ') + PART_NAMES[p]); if (r === 'done') { mark(part, '#26BF63'); locked = true; } }
              });
            });
            stage.append(box);
          },
          hint: { raiz: 'Está escondida bajo la tierra.', tallo: 'Es el palito que sostiene todo.', hoja: 'Son verdes y planas.', flor: 'Es la parte de colores, arriba.' }[part],
          explain: { text: { raiz: 'La raíz está bajo la tierra.', tallo: 'El tallo va desde la tierra hasta arriba.', hoja: 'Las hojas son verdes y salen del tallo.', flor: 'La flor está arriba y es amarilla.' }[part] },
          tag: 'partes-planta',
        };
      }
      const q = GA.fresh(ctx, PLANT_FN, (x) => x.q);
      return {
        text: q.q, say: q.q,
        render(stage, api) { stage.append(ui.answerChoices(GA.shuffle(Object.keys(PART_NAMES)).map((k) => ({ html: `<div style="display:grid;justify-items:center"><span style="font-size:2.4rem">${{ raiz: '🫚', tallo: '🎋', hoja: '🍃', flor: '🌼' }[k]}</span><span style="font-size:1.1rem">${PART_NAMES[k]}</span></div>`, ok: k === q.a, say: PART_NAMES[k] })), api, { speakOnTap: true })); },
        hint: 'Piensa en dónde está cada parte.',
        explain: { text: { raiz: 'La raíz absorbe agua y sujeta la planta a la tierra.', hoja: 'Las hojas usan la luz del sol para fabricar alimento. ¡Se llama fotosíntesis!', tallo: 'El tallo es como un popote que sube el agua.', flor: 'La flor atrae a las abejas y luego se convierte en fruto con semillas.' }[q.a] },
        tag: 'funciones-planta',
      };
    },
  });
  function growLab(stage, api) {
    let w = 1, l = 1, busy = false;
    const pot = h('div', { html: plantSVG({ g: 0.1, flower: false, size: 200 }) });
    const msg = h('div', { class: 'panel center', style: { maxWidth: '520px', display: 'none' } });
    const seg = (opts, get, set) => h('div', { class: 'seg' }, opts.map((o, i) => { const b = h('button', { class: get() === i ? 'on' : '', onclick: () => { set(i); GA.sfx.play('tap'); GA.$$('button', b.parentElement).forEach((x, j) => x.classList.toggle('on', j === i)); } }, o); return b; }));
    const days = h('div', { class: 'chip' }, 'Día 0');
    const go = h('button', { class: 'btn btn-ok btn-big', onclick: async () => {
      if (busy) return; busy = true; go.disabled = true; msg.style.display = 'none';
      const res = growResult(w, l);
      for (let d = 1; d <= 7; d++) {
        const f = d / 7;
        const cfg = Object.assign({}, res.cfg, { g: 0.1 + (res.cfg.g - 0.1) * f, flower: res.cfg.flower && d === 7, size: 200 });
        pot.innerHTML = plantSVG(cfg); days.textContent = `Día ${d}`; GA.sfx.play('count');
        await GA.sleep(330);
      }
      msg.textContent = res.t; msg.style.display = 'block';
      GA.say(res.t);
      busy = false; go.disabled = false;
      if (api) { const ok = w === 1 && l === 2; const r = api.answer(ok); if (r === 'retry') { setTimeout(() => { pot.innerHTML = plantSVG({ g: 0.1, flower: false, size: 200 }); days.textContent = 'Día 0'; }, 2500); } }
    } }, '⏩ Pasar 7 días');
    stage.append(h('div', { class: 'row' }, pot, h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'opt-row' }, h('span', { class: 'lbl' }, '💧 Agua'), seg(['Poca', 'Justa', 'Muchísima'], () => w, (v) => { w = v; })),
      h('div', { class: 'opt-row' }, h('span', { class: 'lbl' }, '☀️ Luz'), seg(['Oscuro', 'Sombra', 'Sol'], () => l, (v) => { l = v; })),
      days)), msg, go);
  }

  // ======================= MI CUERPO =======================
  const SENSES = [['vista', '👁️', 'ojos'], ['oído', '👂', 'oídos'], ['olfato', '👃', 'nariz'], ['gusto', '👅', 'lengua'], ['tacto', '✋', 'piel']];
  const SENSE_Q = [['ver los colores del arcoíris', 'vista'], ['escuchar música', 'oído'], ['oler una flor', 'olfato'], ['saborear un helado', 'gusto'], ['sentir si la sopa está caliente', 'tacto'],
    ['leer un cuento', 'vista'], ['oír a un perro ladrar', 'oído'], ['saber que la leche está echada a perder por su olor', 'olfato'], ['saber si un limón es ácido', 'gusto'], ['sentir lo suave de un gatito', 'tacto']];
  const ORGANS = {
    cerebro: { n: 'el cerebro', f: 'piensa, recuerda y manda órdenes a todo el cuerpo', svg: '<path class="o-cerebro" d="M80 18 c-22 0 -30 14 -28 26 c2 12 14 18 28 18 c14 0 26 -6 28 -18 c2 -12 -6 -26 -28 -26z" fill="#F48FB1" stroke="#C2185B" stroke-width="2"/><path d="M66 30 q6 4 0 10 M80 24 v30 M94 30 q-6 4 0 10" stroke="#C2185B" stroke-width="2" fill="none" pointer-events="none"/>' },
    pulmones: { n: 'los pulmones', f: 'toman el aire cuando respiras', svg: '<path class="o-pulmones" d="M74 102 c-14 0 -24 16 -24 40 c0 18 8 26 18 26 c8 0 8 -10 8 -22z M86 102 c14 0 24 16 24 40 c0 18 -8 26 -18 26 c-8 0 -8 -10 -8 -22z" fill="#FFAB91" stroke="#D84315" stroke-width="2"/>' },
    corazon: { n: 'el corazón', f: 'bombea la sangre por todo el cuerpo', svg: '<path class="o-corazon" d="M88 158 c-14 -10 -18 -18 -14 -24 c3 -5 10 -4 14 1 c4 -5 11 -6 14 -1 c4 6 0 14 -14 24z" fill="#E53935" stroke="#B71C1C" stroke-width="2"/>' },
    estomago: { n: 'el estómago', f: 'deshace la comida para que tu cuerpo la aproveche', svg: '<path class="o-estomago" d="M90 176 c14 0 22 8 18 20 c-4 12 -22 14 -34 8 c-6 -3 -4 -10 2 -10 c8 0 10 -6 8 -10 c-2 -4 0 -8 6 -8z" fill="#CE93D8" stroke="#7B1FA2" stroke-width="2"/>' },
    intestinos: { n: 'los intestinos', f: 'absorben lo bueno de la comida', svg: '<path class="o-intestinos" d="M60 214 h40 q10 0 10 8 q0 8 -10 8 h-40 q-10 0 -10 8 q0 8 10 8 h40" stroke="#FFB74D" stroke-width="10" fill="none" stroke-linecap="round"/>' },
  };
  const bodySVG = (size = 260) => `<svg viewBox="0 0 160 280" width="${size * 0.57}" height="${size}"><circle cx="80" cy="42" r="36" fill="#FFE0B2" stroke="#E0A87A" stroke-width="3"/><rect x="40" y="86" width="80" height="170" rx="36" fill="#FFE0B2" stroke="#E0A87A" stroke-width="3"/><rect x="14" y="94" width="24" height="120" rx="12" fill="#FFE0B2" stroke="#E0A87A" stroke-width="3"/><rect x="122" y="94" width="24" height="120" rx="12" fill="#FFE0B2" stroke="#E0A87A" stroke-width="3"/>${Object.values(ORGANS).map((o) => o.svg).join('')}</svg>`;
  const FOOD = [['🍎', 1], ['🥦', 1], ['🥕', 1], ['🍌', 1], ['🥛', 1], ['🥚', 1], ['🐟', 1], ['🫘', 1], ['🍊', 1], ['💧', 1], ['🍭', 0], ['🍩', 0], ['🍟', 0], ['🥤', 0], ['🍬', 0], ['🍫', 0], ['🍔', 0]];
  GA.skill({
    id: 'cuerpo', area: 'ciencia', title: 'Mi cuerpo', icon: '🫀', desc: 'Los sentidos, los órganos por dentro y cómo cuidarte.',
    levels: ['Los 5 sentidos', '¿Dónde está?', '¿Qué hace cada órgano?', 'Hábitos saludables'],
    lessons: {
      1: [{ say: 'Tenemos cinco sentidos para conocer el mundo: vista, oído, olfato, gusto y tacto.', html: '👁️ 👂 👃 👅 ✋' }],
      2: [{ say: 'Dentro de tu cuerpo hay órganos que trabajan sin parar: el cerebro, el corazón, los pulmones y el estómago.', html: bodySVG(180) }],
    },
    make(L, ctx) {
      if (L === 1) {
        const [act, sense] = GA.fresh(ctx, SENSE_Q, (x) => x[0]);
        const s = SENSES.find((x) => x[0] === sense);
        return {
          text: `¿Qué sentido usas para ${act}?`, say: `¿Qué sentido usas para ${act}?`,
          render(stage, api) { stage.append(ui.answerChoices(SENSES.map((x) => ({ html: `<div style="display:grid;justify-items:center"><span style="font-size:2.6rem">${x[1]}</span><span style="font-size:1rem">${x[0]}</span></div>`, ok: x[0] === sense, say: x[0] })), api, { speakOnTap: true })); },
          hint: '¿Qué parte de tu cuerpo usarías?',
          explain: { text: `Usamos el ${sense}, con ${s[2] === 'nariz' || s[2] === 'lengua' || s[2] === 'piel' ? 'la' : 'los'} ${s[2]}.` },
          tag: 'sentidos',
        };
      }
      if (L === 2 || L === 3) {
        const k = GA.fresh(ctx, Object.keys(ORGANS));
        const o = ORGANS[k];
        return {
          text: L === 2 ? `Toca ${o.n}` : `¿Qué órgano ${o.f}? Tócalo.`, say: L === 2 ? `Toca ${o.n} en el cuerpo.` : `¿Qué órgano ${o.f}? Tócalo en el cuerpo.`,
          render(stage, api) {
            const box = h('div', { html: bodySVG(330) });
            let locked = false;
            Object.keys(ORGANS).forEach((key) => box.querySelectorAll('.o-' + key).forEach((el) => {
              el.style.cursor = 'pointer';
              el.addEventListener('click', () => {
                if (locked) return;
                const r = api.answer(key === k);
                if (key !== k) GA.say('Eso es ' + ORGANS[key].n);
                if (key === k || r === 'done') { locked = true; box.querySelectorAll('.o-' + k).forEach((x) => { x.style.filter = 'drop-shadow(0 0 8px #26BF63)'; }); }
              });
            }));
            stage.append(box);
          },
          hint: { cerebro: 'Está en la cabeza.', corazon: 'Está en el pecho, un poquito a la izquierda.', pulmones: 'Son dos y ocupan casi todo el pecho.', estomago: 'Está en la panza, debajo del pecho.', intestinos: 'Son un tubo largo y doblado en la parte baja de la panza.' }[k],
          explain: { text: `${o.n[0].toUpperCase() + o.n.slice(1)} ${o.f}.` },
          fact: `${o.n[0].toUpperCase() + o.n.slice(1)} ${o.f}.`,
          tag: L === 2 ? 'organos-lugar' : 'organos-funcion',
        };
      }
      const items = GA.sample(FOOD.filter((f) => f[1]), 3).concat(GA.sample(FOOD.filter((f) => !f[1]), 3));
      return {
        text: '¿Qué conviene comer todos los días y qué sólo de vez en cuando?', say: 'Ordena los alimentos: los que conviene comer todos los días, y los que sólo de vez en cuando.',
        render(stage, api) {
          const s = ui.sorter({
            items: items.map((f) => ({ html: f[0], cat: f[1] ? 'si' : 'vez' })),
            bins: [{ id: 'si', title: 'Todos los días', icon: '💪' }, { id: 'vez', title: 'De vez en cuando', icon: '🎉' }],
            onCheck(res, sapi) { sapi.mark(res); const ok = res.every((r) => r.ok); const r = api.answer(ok); if (!ok && r === 'retry') sapi.returnWrong(res); if (ok || r === 'done') sapi.solve(); },
          });
          stage.append(s.el);
        },
        hint: 'Los dulces y las frituras son ricos, pero mejor sólo de vez en cuando.',
        explain: { text: 'Frutas, verduras, leche, huevo, pescado, frijoles y agua te dan energía y te hacen crecer fuerte. Los dulces, papitas y refrescos, de vez en cuando.' },
        tag: 'alimentacion',
      };
    },
  });

  // ======================= EL ESPACIO =======================
  const PLANETS = [
    ['Mercurio', '#A8A29E', 14, 'el más cercano al Sol'], ['Venus', '#F2C66D', 20, 'el más caliente'], ['Tierra', '#3D8BFF', 21, 'nuestro hogar, el único con vida conocida'],
    ['Marte', '#E2643A', 17, 'el planeta rojo'], ['Júpiter', '#D9A06B', 40, 'el más grande'], ['Saturno', '#E8CB84', 34, 'famoso por sus anillos'],
    ['Urano', '#8FD8E8', 26, 'gira acostado de lado'], ['Neptuno', '#4C6FE0', 25, 'el más lejano y con vientos muy fuertes'],
  ];
  const planetSVG = (p, s = 60) => `<svg viewBox="-50 -50 100 100" width="${s}" height="${s}">${p[0] === 'Saturno' ? `<ellipse rx="46" ry="12" fill="none" stroke="#C9A85C" stroke-width="5" transform="rotate(-18)"/>` : ''}<circle r="${p[2]}" fill="${p[1]}"/><circle r="${p[2]}" fill="url(#shade)"/>${p[0] === 'Tierra' ? '<path d="M-8 -12 q8 -4 12 4 q-4 8 -12 6z M4 6 q8 -2 10 6 q-6 6 -10 0z" fill="#43A047"/>' : ''}${p[0] === 'Júpiter' ? '<path d="M-38 -8 h76 M-38 8 h76" stroke="#B5794A" stroke-width="5"/>' : ''}<defs><radialGradient id="shade" cx="30%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient></defs></svg>`;
  const SPACE_Q = [
    { t: '¿Cuál es el planeta más grande?', a: 'Júpiter' }, { t: '¿Cuál es el planeta rojo?', a: 'Marte' }, { t: '¿Qué planeta tiene grandes anillos?', a: 'Saturno' },
    { t: '¿En qué planeta vivimos?', a: 'Tierra' }, { t: '¿Cuál es el planeta más cercano al Sol?', a: 'Mercurio' }, { t: '¿Cuál es el planeta más caliente?', a: 'Venus' },
  ];
  const SPACE_FACTS = [
    { t: 'El Sol es…', o: ['Una estrella', 'Un planeta', 'Una luna'], a: 0 }, { t: 'La Luna gira alrededor de…', o: ['La Tierra', 'Marte', 'Júpiter'], a: 0 },
    { t: '¿Por qué hay día y noche?', o: ['Porque la Tierra gira', 'Porque el Sol se apaga', 'Porque la Luna tapa al Sol'], a: 0 },
    { t: '¿Cuánto tarda la Tierra en dar una vuelta al Sol?', o: ['Un año', 'Un día', 'Una hora'], a: 0 },
  ];
  function moonPath(p, r = 40) {
    const k = Math.cos(2 * Math.PI * p), rx = Math.abs(k) * r;
    const waxing = p <= 0.5;
    const outer = waxing ? 1 : 0;
    const term = waxing ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0);
    return `M0 ${-r} A${r} ${r} 0 0 ${outer} 0 ${r} A${rx.toFixed(2)} ${r} 0 0 ${term} 0 ${-r}Z`;
  }
  const moonSVG = (p, s = 110) => `<svg viewBox="-50 -50 100 100" width="${s}" height="${s}"><circle r="40" fill="#2B3350"/>${p === 0 ? '' : p === 0.5 ? '<circle r="40" fill="#FFF3B0"/>' : `<path d="${moonPath(p)}" fill="#FFF3B0"/>`}<circle r="40" fill="none" stroke="#556" stroke-width="2"/></svg>`;
  const PHASES = [[0, 'Luna nueva'], [0.25, 'Cuarto creciente'], [0.5, 'Luna llena'], [0.75, 'Cuarto menguante']];
  function dayNight(stage, api, goal) {
    let ang = GA.pick([30, 120, 210, 300]);
    const svg = GA.html(`<svg viewBox="0 0 600 280" style="width:min(640px,100%);height:auto">
      <defs><radialGradient id="sunG"><stop offset="0" stop-color="#FFF59D"/><stop offset="1" stop-color="#FFB300"/></radialGradient><linearGradient id="nightG" x1="0" x2="1"><stop offset=".5" stop-color="rgba(10,20,60,0)"/><stop offset=".5" stop-color="rgba(10,20,60,.65)"/></linearGradient></defs>
      <rect width="600" height="280" fill="#101A3A" rx="24"/>${GA.range(1, 30).map(() => `<circle cx="${GA.rand(10, 590)}" cy="${GA.rand(10, 270)}" r="${Math.random() * 1.6 + 0.4}" fill="#fff"/>`).join('')}
      <circle cx="70" cy="140" r="58" fill="url(#sunG)"/><path d="M130 110 L260 120 M130 170 L260 160 M135 140 L260 140" stroke="#FFE082" stroke-width="3" opacity=".6"/>
      <g class="earth" style="transform-origin:420px 140px;transition:transform .5s"><circle cx="420" cy="140" r="90" fill="#3D8BFF"/><path d="M380 90 q30 -20 50 0 q-10 30 -40 20z M430 160 q30 0 40 20 q-20 30 -50 10z M350 150 q20 -10 30 10 q-10 20 -30 10z" fill="#43A047"/>
      <g transform="translate(420,140)"><g transform="translate(0,-108)"><polygon points="-14,0 14,0 0,-14" fill="#E53935"/><rect x="-10" y="0" width="20" height="16" fill="#FFF3E0"/><text x="0" y="-18" text-anchor="middle" font-size="18">🧒</text></g></g></g>
      <circle cx="420" cy="140" r="90" fill="url(#nightG)" pointer-events="none"/></svg>`);
    const label = h('div', { class: 'state-label' });
    const isDay = () => { const a = ((ang % 360) + 360) % 360; return a > 180 && a < 360; }; // la casa mira al Sol (izquierda)
    const upd = () => { svg.querySelector('.earth').style.transform = `rotate(${ang}deg)`; label.textContent = isDay() ? '☀️ Es de día en la casa de Gael' : '🌙 Es de noche en la casa de Gael'; };
    const rot = (d) => { ang += d; GA.sfx.play('tap'); upd(); };
    stage.append(svg, label, h('div', { class: 'opt-row' }, h('button', { class: 'btn btn-white', onclick: () => rot(-30) }, '⟲ Girar'), h('button', { class: 'btn btn-white', onclick: () => rot(30) }, 'Girar ⟳')));
    if (api) stage.append(h('button', { class: 'btn btn-ok btn-big', onclick: () => { const r = api.answer(isDay() === (goal === 'dia')); if (r === 'done') { ang = goal === 'dia' ? 270 : 90; upd(); } } }, '¡Listo!'));
    upd();
  }
  GA.skill({
    id: 'espacio', area: 'ciencia', title: 'Viaje al espacio', icon: '🪐', desc: 'El día y la noche, los planetas y las fases de la Luna.',
    levels: ['El día y la noche', 'Los planetas en orden', 'Datos del espacio', 'Fases de la Luna'],
    lessons: {
      1: [{ say: 'La Tierra gira como un trompo. La mitad que mira al Sol tiene día, y la otra mitad tiene noche.', html: '☀️ ➜ 🌍 🌙' }],
      2: [{ say: 'Ocho planetas giran alrededor del Sol. Un truco para recordarlos: Mi Vieja Tía Marta Jamás Supo Usar Navaja. Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.', html: PLANETS.slice(0, 4).map((p) => planetSVG(p, 46)).join('') }],
      4: [{ say: 'La Luna no cambia de forma: el Sol ilumina diferentes partes mientras ella da vueltas a la Tierra. Por eso la vemos nueva, creciente, llena y menguante.', html: PHASES.map((p) => moonSVG(p[0], 70)).join('') }],
    },
    sandbox(stage) { stage.append(h('div', { class: 'muted center' }, 'Gira la Tierra y mira cuándo es de día o de noche en la casa de Gael.')); dayNight(stage, null); },
    make(L, ctx) {
      if (L === 1) {
        const goal = GA.fresh(ctx, ['dia', 'noche']);
        return {
          text: goal === 'dia' ? 'Gira la Tierra para que sea de DÍA en la casa de Gael' : 'Gira la Tierra para que sea de NOCHE en la casa de Gael',
          say: goal === 'dia' ? 'Gira la Tierra para que sea de día en la casa de Gael.' : 'Gira la Tierra para que sea de noche en la casa de Gael.',
          render(stage, api) { dayNight(stage, api, goal); },
          hint: 'Es de día cuando la casa mira hacia el Sol.',
          explain: { text: 'La Tierra gira. Cuando tu casa mira hacia el Sol es de día; cuando queda del otro lado, es de noche.' },
          tag: 'dia-noche',
        };
      }
      if (L === 2) {
        if (Math.random() < 0.55) {
          const n = ctx.n8 ? 8 : 4; ctx.n8 = !ctx.n8;
          const ps = PLANETS.slice(0, n);
          return {
            text: `Ordena los ${n === 4 ? 'primeros 4 planetas' : '8 planetas'} desde el Sol ☀️`, say: `Ordena los planetas, del más cercano al Sol al más lejano. Toca cada planeta para escuchar su nombre.`,
            render(stage, api) {
              const sl = ui.slots({
                n, numbered: true, tileCls: 'emoji',
                tiles: GA.shuffle(ps.map((p, i) => ({ html: planetSVG(p, 52), value: i, say: p[0], aria: p[0] }))),
                onFull(vals, sa) { const okArr = vals.map((v, i) => v === i); const ok = okArr.every(Boolean); sa.mark(okArr); const r = api.answer(ok); if (!ok && r === 'retry') sa.returnWrong(okArr); if (ok || r === 'done') { sa.solve(ps.map((p, i) => i)); sa.lock(); } },
              });
              stage.append(h('div', { style: { fontSize: '3rem' } }, '☀️'), sl.el);
            },
            hint: 'Mi Vieja Tía Marta Jamás Supo Usar Navaja: Mercurio, Venus, Tierra, Marte…',
            explain: { text: ps.map((p, i) => `${i + 1}. ${p[0]}`).join(' · '), html: ps.map((p) => planetSVG(p, 40)).join('') },
            tag: 'orden-planetas',
          };
        }
        const i = GA.rand(0, 7);
        const ord = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo'][i];
        const opts = GA.shuffle([PLANETS[i], ...GA.sample(PLANETS.filter((p, j) => j !== i), 2)]);
        return {
          text: `¿Cuál es el ${ord} planeta desde el Sol?`, say: `¿Cuál es el ${ord} planeta desde el Sol?`,
          render(stage, api) { stage.append(ui.answerChoices(opts.map((p) => ({ html: `<div style="display:grid;justify-items:center">${planetSVG(p, 80)}<span style="font-size:1.1rem">${p[0]}</span></div>`, ok: p === PLANETS[i], say: p[0] })), api, { speakOnTap: true })); },
          hint: 'Mi Vieja Tía Marta Jamás Supo Usar Navaja.',
          explain: { text: `El ${ord} planeta es ${PLANETS[i][0]}: ${PLANETS[i][3]}.` },
          tag: 'orden-planetas',
        };
      }
      if (L === 3) {
        if (Math.random() < 0.65) {
          const q = GA.fresh(ctx, SPACE_Q, (x) => x.t);
          const ans = PLANETS.find((p) => p[0] === q.a);
          const opts = GA.shuffle([ans, ...GA.sample(PLANETS.filter((p) => p !== ans), 3)]);
          return {
            text: q.t, say: q.t,
            render(stage, api) { stage.append(ui.answerChoices(opts.map((p) => ({ html: `<div style="display:grid;justify-items:center">${planetSVG(p, 80)}<span style="font-size:1.05rem">${p[0]}</span></div>`, ok: p === ans, say: p[0] })), api, { speakOnTap: true })); },
            hint: 'Fíjate en el tamaño y los colores.',
            explain: { text: `${ans[0]} es ${ans[3]}.` }, fact: `${ans[0]} es ${ans[3]}.`, tag: 'datos-planetas',
          };
        }
        const q = GA.fresh(ctx, SPACE_FACTS, (x) => x.t);
        return {
          text: q.t, say: q.t,
          render(stage, api) { stage.append(ui.answerChoices(GA.shuffle(q.o.map((o, i) => ({ label: o, ok: i === q.a, cls: 'wide', say: o }))), api, { speakOnTap: true })); },
          hint: 'Piensa en lo que vimos con la Tierra girando.',
          explain: { text: `${q.t.replace('…', '')} ${q.o[q.a].toLowerCase()}.` }, tag: 'datos-espacio',
        };
      }
      const [p, name] = GA.fresh(ctx, PHASES, (x) => x[1]);
      return {
        text: '¿Cómo se llama esta fase de la Luna?', say: '¿Cómo se llama esta fase de la Luna?',
        render(stage, api) { stage.append(GA.html(`<div>${moonSVG(p, 180)}</div>`), ui.answerChoices(GA.shuffle(PHASES).map((x) => ({ label: x[1], ok: x[1] === name, cls: 'txt', say: x[1] })), api, { cls: 'txt', speakOnTap: true })); },
        hint: 'Toda iluminada es llena, toda oscura es nueva. Creciente se ilumina del lado derecho.',
        explain: { text: `Es ${name.toLowerCase()}.`, html: PHASES.map((x) => moonSVG(x[0], 54)).join('') },
        tag: 'fases-luna',
      };
    },
  });

  // ======================= IMANES =======================
  const MAG = [
    ['📎', 'un clip', 1, 'Está hecho de acero, que tiene hierro.'], ['🔩', 'un tornillo', 1, 'Es de acero: el imán atrae el hierro.'], ['✂️', 'unas tijeras', 1, 'Sus hojas son de acero.'],
    ['🥄', 'una cuchara de metal', 1, 'Muchas cucharas son de acero inoxidable con hierro.'], ['🪛', 'un desarmador', 1, 'Su punta es de acero.'], ['📌', 'una tachuela', 1, 'Su punta es de acero.'],
    ['✏️', 'un lápiz', 0, 'La madera y el grafito no son magnéticos.'], ['🧸', 'un osito de peluche', 0, 'La tela y el relleno no tienen hierro.'], ['📄', 'una hoja de papel', 0, 'El papel no es magnético.'],
    ['🥛', 'un vaso de vidrio', 0, 'El vidrio no es magnético.'], ['🧽', 'una esponja', 0, 'No tiene hierro.'], ['🪵', 'un trozo de madera', 0, 'La madera no es magnética.'],
    ['🥤', 'una lata de refresco', 0, '¡Sorpresa! Es de aluminio, un metal que los imanes NO atraen.'], ['💍', 'un anillo de oro', 0, '¡Sorpresa! El oro es un metal, pero no es magnético.'], ['🪙', 'una moneda de cobre', 0, 'El cobre no es magnético, aunque sea metal.'],
  ];
  function magnetScene(e) {
    const box = h('div', { style: { position: 'relative', width: 'min(520px,100%)', height: '160px', background: '#fff', borderRadius: '24px' } });
    const mg = h('div', { style: { position: 'absolute', left: '20px', top: '40px', fontSize: '4.5rem', transition: 'left 1s', transform: 'rotate(-90deg)' } }, '🧲');
    const ob = h('div', { style: { position: 'absolute', right: '40px', top: '44px', fontSize: '4rem', transition: 'right .4s cubic-bezier(.5,-0.4,.7,1.4)' } }, e);
    box.append(mg, ob);
    box.run = (yes) => new Promise((res) => {
      mg.style.left = '170px'; GA.sfx.play('whoosh');
      setTimeout(() => { if (yes) { ob.style.right = 'calc(100% - 330px)'; GA.sfx.play('magnet'); } }, 950);
      setTimeout(res, 1600);
    });
    return box;
  }
  GA.skill({
    id: 'imanes', area: 'ciencia', title: 'La fuerza de los imanes', icon: '🧲', desc: 'Descubre qué atraen los imanes y cómo funcionan sus polos.',
    levels: ['¿Lo atrae?', 'Polos que se atraen o se repelen', 'Materiales sorpresa'], prereq: [['flotar', 2]],
    lessons: {
      1: [{ say: 'Los imanes atraen objetos que tienen hierro, como el acero. ¡Pero no todos los metales!', html: '🧲 ➜ 📎' }],
      2: [{ say: 'Cada imán tiene dos polos: norte y sur. Polos diferentes se atraen. Polos iguales se empujan, se repelen.', html: '<span style="font-size:2rem"><b style="color:#E53935">N</b>|<b style="color:#1E63D6">S</b> ➜⬅ <b style="color:#E53935">N</b>|<b style="color:#1E63D6">S</b></span>' }],
    },
    make(L, ctx) {
      if (L === 2) {
        const pair = GA.fresh(ctx, [['N', 'S'], ['S', 'N'], ['N', 'N'], ['S', 'S']], (x) => x.join());
        const attract = pair[0] !== pair[1];
        const bar = (a, b) => `<svg viewBox="0 0 160 50" width="160" height="50"><rect x="0" y="0" width="80" height="50" rx="8" fill="${a === 'N' ? '#E53935' : '#1E63D6'}"/><rect x="80" y="0" width="80" height="50" rx="8" fill="${b === 'N' ? '#E53935' : '#1E63D6'}"/><text x="40" y="34" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="28" fill="#fff">${a}</text><text x="120" y="34" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="28" fill="#fff">${b}</text></svg>`;
        return {
          text: `Polo ${pair[0]} frente a polo ${pair[1]}: ¿se atraen o se repelen?`, say: `Si acercamos el polo ${pair[0] === 'N' ? 'norte' : 'sur'} al polo ${pair[1] === 'N' ? 'norte' : 'sur'}, ¿se atraen o se repelen?`,
          render(stage, api) {
            const a = h('div', { html: bar(pair[0] === 'N' ? 'S' : 'N', pair[0]), style: { transition: 'transform .8s' } });
            const b = h('div', { html: bar(pair[1], pair[1] === 'N' ? 'S' : 'N'), style: { transition: 'transform .8s' } });
            stage.append(h('div', { class: 'row', style: { gap: '60px' } }, a, b));
            predictTest(stage, api, {
              options: [{ label: '🤝 Se atraen', value: 1 }, { label: '🙅 Se repelen', value: 0 }], actual: attract ? 1 : 0,
              run: () => new Promise((res) => { a.style.transform = attract ? 'translateX(30px)' : 'translateX(-40px)'; b.style.transform = attract ? 'translateX(-30px)' : 'translateX(40px)'; GA.sfx.play(attract ? 'magnet' : 'whoosh'); setTimeout(res, 1000); }),
            });
          },
          explain: { text: attract ? 'Polos diferentes (norte y sur) se atraen.' : 'Polos iguales se repelen: ¡se empujan aunque no se toquen!' },
          tag: 'polos',
        };
      }
      if (L === 3) {
        const items = GA.sample(MAG.filter((m) => m[2]), 3).concat(GA.sample(MAG.filter((m) => !m[2] && /Sorpresa|metal/.test(m[3])), 2), GA.sample(MAG.filter((m) => !m[2] && !/Sorpresa|metal/.test(m[3])), 1));
        return {
          text: '¿Qué atrae el imán y qué no?', say: 'Clasifica: ¿qué objetos atrae el imán y cuáles no? ¡Cuidado, hay sorpresas!',
          render(stage, api) {
            const s = ui.sorter({
              items: items.map((m) => ({ html: m[0], cat: m[2] ? 'si' : 'no', say: m[1] })),
              bins: [{ id: 'si', title: 'Lo atrae', icon: '🧲' }, { id: 'no', title: 'No lo atrae', icon: '🚫' }],
              onCheck(res, sapi) { sapi.mark(res); const ok = res.every((r) => r.ok); const r = api.answer(ok); if (!ok && r === 'retry') sapi.returnWrong(res); if (ok || r === 'done') sapi.solve(); },
            });
            stage.append(s.el);
          },
          hint: 'No todos los metales son magnéticos: sólo los que tienen hierro.',
          explain: { text: 'Los imanes atraen el hierro y el acero. El aluminio, el oro y el cobre son metales, ¡pero no son magnéticos!' },
          tag: 'materiales-magneticos',
        };
      }
      const m = GA.fresh(ctx, MAG, (x) => x[0]);
      return {
        text: `¿El imán atrae ${m[1]}?`, say: `Predice: ¿el imán atrae ${m[1]}?`,
        render(stage, api) {
          const sc = magnetScene(m[0]);
          stage.append(sc);
          predictTest(stage, api, { options: [{ label: '🧲 Sí lo atrae', value: 1 }, { label: '🚫 No lo atrae', value: 0 }], actual: m[2], run: () => sc.run(!!m[2]) });
        },
        explain: { text: `${m[2] ? 'Sí lo atrae' : 'No lo atrae'}. ${m[3]}` }, fact: m[3],
        tag: 'magnetismo',
      };
    },
  });
})();
