/* Gael Aprende — Matemáticas y Lógica
   Progresión Concreto → Pictórico → Abstracto (método Singapur): primero se manipulan objetos,
   luego dibujos y al final los símbolos. */
(function () {
  'use strict';
  const { h } = GA;
  const V = GA.viz, ui = GA.ui;

  const OBJ = [
    { e: '🍎', p: 'manzanas', g: 'f' }, { e: '🐞', p: 'mariquitas', g: 'f' }, { e: '⭐', p: 'estrellas', g: 'f' }, { e: '🐟', p: 'peces', g: 'm' },
    { e: '🍓', p: 'fresas', g: 'f' }, { e: '🚗', p: 'carros', g: 'm' }, { e: '🎈', p: 'globos', g: 'm' }, { e: '🐥', p: 'pollitos', g: 'm' },
    { e: '🌸', p: 'flores', g: 'f' }, { e: '🍪', p: 'galletas', g: 'f' }, { e: '🦋', p: 'mariposas', g: 'f' }, { e: '🐸', p: 'ranas', g: 'f' },
    { e: '🧁', p: 'pastelitos', g: 'm' }, { e: '🐠', p: 'pececitos', g: 'm' }, { e: '🍩', p: 'donas', g: 'f' }, { e: '🦆', p: 'patos', g: 'm' },
  ];
  const NAMES = ['Gael', 'Lola', 'Max', 'Sofía', 'Leo', 'Mía', 'Tomás', 'Ana'];
  const cuantos = (o) => (o.g === 'f' ? 'cuántas' : 'cuántos');
  const emojis = (n, e, size = 1.8) => `<span style="font-size:${size}rem;line-height:1.1;letter-spacing:.05em">${e.repeat(n)}</span>`;
  const numbered = (n, e) => GA.range(1, n).map((i) => `<span style="display:inline-grid;justify-items:center;font-size:1.5rem;line-height:1">${e}<small style="font-size:.8rem;font-weight:900">${i}</small></span>`).join('');

  // Objetos que se tocan para contar (cada toque dice el número)
  function countable(n, o, opts = {}) {
    let c = 0;
    const wrap = h('div', { class: 'objs' + (opts.rows ? ' rows5' : '') });
    for (let i = 0; i < n; i++) {
      const b = h('button', { class: 'obj', 'aria-label': o.p }, o.e);
      b.addEventListener('click', () => {
        if (b.classList.contains('counted')) return;
        c++; b.classList.add('counted'); b.appendChild(h('span', { class: 'n' }, c));
        GA.sfx.play('count'); GA.say(GA.numWord(c), { rate: 1.1 });
      });
      wrap.appendChild(b);
    }
    return wrap;
  }

  // ======================= CONTAR =======================
  GA.skill({
    id: 'contar', area: 'math', title: 'Contar', icon: '🐞', desc: 'Toca cada objeto para contarlo y descubre cuántos hay.',
    levels: ['Hasta 5', 'Hasta 10', 'Hasta 15', 'Hasta 20'],
    lessons: {
      1: [
        { say: 'Para contar, tocamos cada cosa una sola vez y decimos un número: uno, dos, tres.', html: numbered(3, '🍎') },
        { say: 'El último número que decimos nos dice cuántas cosas hay. ¡Hay tres manzanas!', html: '<span style="font-size:3rem">🍎🍎🍎 = 3</span>' },
      ],
      3: [{ say: 'Cuando hay muchos, ¡agrúpalos de cinco en cinco o de diez en diez! Es más rápido y no te pierdes.', html: V.tenFrame(10) + V.tenFrame(3) }],
    },
    make(L, ctx) {
      const [lo, hi] = [null, [1, 5], [4, 10], [8, 15], [11, 20]][L];
      const n = GA.rand(lo, hi), o = GA.fresh(ctx, OBJ, (x) => x.e + n);
      return {
        text: `¿${cuantos(o)[0].toUpperCase() + cuantos(o).slice(1)} ${o.p} hay? Toca ${o.g === 'f' ? 'cada una' : 'cada uno'} para contar.`,
        say: `¿${cuantos(o)} ${o.p} hay? ${o.g === 'f' ? 'Tócalas una por una' : 'Tócalos uno por uno'} para contar.`,
        render(stage, api) {
          stage.append(countable(n, o, { rows: L >= 3 }));
          stage.append(L <= 2 ? ui.answerChoices(GA.numOptions(n, 4, 1, 25).map((v) => ({ label: v, ok: v === n })), api) : ui.answerNumpad(n, api, { maxLen: 2 }));
        },
        hint: 'Toca cada objeto una sola vez. El último número que digas es la respuesta.',
        explain: { text: `Contamos uno por uno sin saltarnos ninguno: ¡son ${n}!`, html: numbered(n, o.e) },
        tag: n > 10 ? 'contar-mas-de-10' : 'contar-hasta-10',
      };
    },
  });

  // ======================= OJO RÁPIDO (subitizar) =======================
  GA.skill({
    id: 'subitizar', area: 'math', title: 'Ojo rápido', icon: '👀', desc: 'Mira un instante y di cuántos hay sin contar uno por uno.',
    levels: ['1 a 4', 'Dados', 'Marco de diez', 'Dos grupos'],
    lessons: {
      1: [{ say: 'Tu cerebro es tan rápido que puede ver cuántos hay sin contar. ¡Mira bien, los puntos van a desaparecer!', html: V.dots(3) + V.dots(4) }],
      3: [{ say: 'En el marco de diez caben diez. Si una fila está llena son cinco. ¡Fíjate en los espacios vacíos!', html: V.tenFrame(7) }],
    },
    make(L, ctx) {
      let n, html, a, b;
      if (L === 1) { n = GA.rand(1, 4); html = V.dots(n, GA.pick(V.COLORS), 160); }
      else if (L === 2) { n = GA.rand(3, 6); html = V.dots(n, GA.pick(V.COLORS), 160); }
      else if (L === 3) { n = GA.rand(5, 10); html = V.tenFrame(n); }
      else { a = GA.rand(2, 6); b = GA.rand(2, 6); n = a + b; html = `<div class="row">${V.dots(a, '#FF6B6B', 130)}${V.dots(b, '#3D8BFF', 130)}</div>`; }
      GA.fresh(ctx, [n]);
      const ms = L === 1 ? 1800 : 1400;
      return {
        text: '¡Mira rápido! ¿Cuántos puntos hay?',
        render(stage, api) {
          const box = h('div', { style: { minHeight: '170px', display: 'grid', placeItems: 'center' } });
          const show = () => {
            box.innerHTML = html;
            setTimeout(() => { box.innerHTML = '<div style="font-size:7rem">☁️</div>'; }, ms);
          };
          setTimeout(show, 500);
          const again = h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); show(); } }, '👀 Ver otra vez');
          stage.append(box, again, ui.answerChoices(GA.numOptions(n, 4, 1, 12).map((v) => ({ label: v, ok: v === n })), api));
        },
        hint: 'Piensa en la forma que hacían los puntos, como en un dado.',
        explain: { text: L === 4 ? `Hay ${a} y ${b}. ${a} + ${b} = ${n}.` : L === 3 ? `Una fila llena es 5, y ${n - 5} más: ¡${n}!` : `Eran ${n} puntos.`, html },
      };
    },
  });

  // ======================= COMPARAR =======================
  GA.skill({
    id: 'comparar', area: 'math', title: '¿Cuál es mayor?', icon: '🐊', desc: 'Compara grupos y números. El cocodrilo siempre se come al mayor.',
    levels: ['Grupos', 'Números hasta 20', 'Números hasta 100', 'Signos > < ='], prereq: [['contar', 2]],
    lessons: {
      2: [{ say: 'El número que está más adelante cuando contamos es el mayor. 8 es mayor que 5.', html: '<span style="font-size:2.4rem">1 2 3 4 <b style="color:#FF7433">5</b> 6 7 <b style="color:#12A876">8</b> 9 10</span>' }],
      3: [{ say: 'Con números grandes, mira primero las decenas. 52 tiene cinco decenas y 47 sólo cuatro, así que 52 es mayor.', html: '<span style="font-size:3rem"><b style="color:#3D8BFF">5</b>2 &gt; <b style="color:#3D8BFF">4</b>7</span>' }],
      4: [{ say: 'El signo es como la boca de un cocodrilo hambriento: siempre se abre hacia el número mayor.', html: '<span style="font-size:3rem">9 &gt; 4 🐊</span>' }],
    },
    make(L, ctx) {
      const more = Math.random() < 0.65;
      if (L === 1) {
        let a = GA.rand(1, 9), b; do { b = GA.rand(1, 9); } while (Math.abs(a - b) < 1);
        const o = GA.fresh(ctx, OBJ, (x) => x.e);
        const ok = more ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
        return {
          text: more ? `¿Dónde hay MÁS ${o.e}?` : `¿Dónde hay MENOS ${o.e}?`, say: more ? `¿Dónde hay más ${o.p}?` : `¿Dónde hay menos ${o.p}?`,
          render(stage, api) {
            stage.append(ui.answerChoices([a, b].map((n, i) => ({ html: `<div style="max-width:240px;font-size:2.2rem;line-height:1.15">${o.e.repeat(n)}</div>`, ok: i === ok })), api, { cls: 'txt' }));
          },
          hint: 'Puedes contar cada grupo o emparejar uno con uno.',
          explain: { text: `Un grupo tiene ${a} y el otro ${b}. ${Math.max(a, b)} es más que ${Math.min(a, b)}.` },
          tag: 'comparar-grupos',
        };
      }
      const max = L === 2 ? 20 : 100;
      let a = GA.rand(0, max), b;
      if (L === 4) {
        const eq = Math.random() < 0.2;
        do { b = eq ? a : GA.rand(Math.max(0, a - 25), Math.min(max, a + 25)); } while (!eq && a === b);
        const sign = a > b ? '>' : a < b ? '<' : '=';
        GA.fresh(ctx, [a, b]);
        return {
          text: `¿Qué signo va en medio?`, say: `¿Qué signo va entre ${a} y ${b}? Mayor que, menor que o igual.`,
          render(stage, api) {
            stage.append(h('div', { class: 'big-expr' }, a, h('span', { class: 'q' }, '?'), b));
            stage.append(ui.answerChoices(['>', '<', '='].map((s) => ({ label: s, ok: s === sign })), api, { cls: 'huge' }));
          },
          hint: 'El cocodrilo abre la boca hacia el número mayor. Si son iguales, usamos =.',
          explain: { text: sign === '=' ? `${a} y ${b} son iguales: ${a} = ${b}.` : `${Math.max(a, b)} es mayor, así que la boca se abre hacia él: ${a} ${sign} ${b}.`, html: `<span style="font-size:2.6rem">${a} ${sign} ${b} 🐊</span>` },
          tag: 'signos',
        };
      }
      do { b = GA.rand(Math.max(0, a - (L === 3 ? 30 : 8)), Math.min(max, a + (L === 3 ? 30 : 8))); } while (a === b);
      if (L === 3 && Math.random() < 0.4) { b = parseInt(String(a).padStart(2, '0').split('').reverse().join(''), 10); if (b === a) b = a + 10 > 99 ? a - 10 : a + 10; }
      GA.fresh(ctx, [a, b]);
      const target = more ? Math.max(a, b) : Math.min(a, b);
      return {
        text: more ? '¿Qué número es MAYOR? 🐊' : '¿Qué número es MENOR?', say: more ? `¿Qué número es mayor: ${a} o ${b}?` : `¿Qué número es menor: ${a} o ${b}?`,
        render(stage, api) { stage.append(ui.answerChoices([a, b].map((n) => ({ label: n, ok: n === target })), api, { cls: 'huge' })); },
        hint: L === 3 ? 'Mira primero las decenas: el número de la izquierda.' : 'Piensa cuál dirías después al contar.',
        explain: { text: L === 3 && Math.floor(a / 10) !== Math.floor(b / 10) ? `Comparamos decenas: ${Math.floor(Math.max(a, b) / 10)} decenas es más que ${Math.floor(Math.min(a, b) / 10)}. Por eso ${Math.max(a, b)} es mayor.` : `${Math.max(a, b)} es mayor que ${Math.min(a, b)}.` },
        tag: L === 3 ? 'comparar-decenas' : 'comparar-numeros',
      };
    },
  });

  // ======================= RECTA NUMÉRICA =======================
  GA.skill({
    id: 'recta', area: 'math', title: 'El salto de la rana', icon: '🐸', desc: 'Lleva a la rana al número correcto de la recta numérica.',
    levels: ['0 a 10 con números', '0 a 10', '0 a 20', '0 a 100'], prereq: [['contar', 2]],
    lessons: {
      1: [{ say: 'En la recta numérica los números van en orden, de izquierda a derecha, y cada salto es igual de grande.', html: '<span style="font-size:2rem">0 ─ 1 ─ 2 ─ 3 ─ 4 ─ 5 ➜</span>' }],
      4: [{ say: 'Ahora la recta va de cero a cien. La mitad es cincuenta. ¡Usa la mitad para estimar dónde va cada número!', html: '<span style="font-size:2rem">0 ─── 50 ─── 100</span>' }],
    },
    make(L, ctx) {
      const max = [null, 10, 10, 20, 100][L];
      let t; do { t = GA.rand(1, max - 1); } while (L === 4 && t % 5 === 0 && Math.random() < 0.5);
      GA.fresh(ctx, [t]);
      const tol = L === 4 ? 5 : 0;
      return {
        text: `Lleva a la rana 🐸 al número ${t}`, say: `Arrastra a la rana o toca la recta para llevarla al número ${t}.`,
        render(stage, api) {
          const W = 900, X0 = 50, X1 = 850;
          const xOf = (v) => X0 + (v / max) * (X1 - X0);
          const step = L === 4 ? 10 : 1;
          let ticks = '';
          for (let v = 0; v <= max; v += step) {
            const show = L === 1 || (L === 2 && (v === 0 || v === 5 || v === 10)) || (L === 3 && v % 5 === 0) || (L === 4 && v % 50 === 0);
            ticks += `<line x1="${xOf(v)}" y1="118" x2="${xOf(v)}" y2="${v % (step * 5) === 0 ? 146 : 138}" stroke="#23304D" stroke-width="4" stroke-linecap="round"/>`;
            if (show) ticks += `<text x="${xOf(v)}" y="180" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#23304D">${v}</text>`;
          }
          const svg = GA.html(`<svg class="nline" viewBox="0 0 ${W} 200">
            <line x1="${X0 - 20}" y1="128" x2="${X1 + 20}" y2="128" stroke="#23304D" stroke-width="6" stroke-linecap="round"/>${ticks}
            <g class="frog" style="transition:transform .2s"><text x="0" y="104" text-anchor="middle" font-size="64">🐸</text>
            <text class="val" x="0" y="30" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#7656F5"></text></g>
            <g class="target" opacity="0"><line x1="0" y1="60" x2="0" y2="150" stroke="#26BF63" stroke-width="6" stroke-dasharray="8 6"/><text x="0" y="196" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="30" fill="#189049">${t}</text></g>
          </svg>`);
          const frog = svg.querySelector('.frog'), val = svg.querySelector('.val');
          let cur = 0;
          const setV = (v) => { cur = GA.clamp(v, 0, max); frog.setAttribute('transform', `translate(${xOf(cur)},0)`); val.textContent = L === 1 ? cur : ''; };
          setV(0);
          const fromEvent = (e) => { const r = svg.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W; return Math.round(((x - X0) / (X1 - X0)) * max); };
          let down = false;
          svg.addEventListener('pointerdown', (e) => { down = true; svg.setPointerCapture(e.pointerId); setV(fromEvent(e)); GA.sfx.play('tap'); });
          svg.addEventListener('pointermove', (e) => { if (down) setV(fromEvent(e)); });
          svg.addEventListener('pointerup', () => { down = false; });
          const go = h('button', { class: 'btn btn-ok btn-big', onclick: () => {
            const ok = Math.abs(cur - t) <= tol;
            const r = api.answer(ok);
            if (ok || r === 'done') { svg.querySelector('.target').setAttribute('transform', `translate(${xOf(t)},0)`); svg.querySelector('.target').setAttribute('opacity', '1'); go.disabled = true; }
          } }, '¡Salta aquí!');
          stage.append(svg, go);
        },
        hint: L === 4 ? 'Usa el 50 de la mitad para saber si va antes o después.' : 'Cuenta los saltos desde el cero.',
        explain: { text: `El ${t} está ${L === 4 ? `cerca del ${Math.round(t / 10) * 10}` : `a ${t} saltos del cero`}. ¡Mira la marca verde!` },
        tag: L === 4 ? 'estimar-100' : 'recta-' + max,
      };
    },
  });

  // ======================= SUMAS =======================
  function sumWordProblem(a, b, o) {
    const n = GA.pick(NAMES);
    return GA.pick([
      `${n} tiene ${a} ${o.p} y le regalan ${b} más. ¿${cuantos(o)} tiene ahora?`,
      `En la mesa hay ${a} ${o.p}. Llegan ${b} más. ¿${cuantos(o)} hay en total?`,
      `${n} ve ${a} ${o.p} en el parque y luego ${b} más. ¿${cuantos(o)} vio en total?`,
    ]);
  }
  GA.skill({
    id: 'sumas', area: 'math', title: 'Sumas', icon: '➕', desc: 'Junta grupos, llena el marco de diez y descubre trucos para sumar.',
    levels: ['Hasta 5 con dibujos', 'Hasta 10 con dibujos', 'Hasta 10', 'Hasta 20: hacer 10', 'Decenas y unidades', 'Dos cifras'],
    prereq: [['contar', 2]],
    lessons: {
      1: [
        { say: 'Sumar es juntar. Si tengo dos manzanas y me dan una más, las junto.', html: '<span style="font-size:3rem">🍎🍎 + 🍎</span>' },
        { say: '¡Ahora tengo tres! Dos más uno es igual a tres.', html: '<span style="font-size:3rem">🍎🍎🍎 = 3</span>' },
      ],
      3: [{ say: 'Un truco: empieza por el número más grande y cuenta hacia adelante. Seis más dos: seis… siete, ocho.', html: '<span style="font-size:2.6rem">6 ➜ 7, 8</span>' }],
      4: [
        { say: 'El truco de los expertos: ¡hacer diez! Ocho más cinco. Al ocho le faltan dos para llegar a diez.', html: V.tenFrame(8) + V.tenFrame(0, 5) },
        { say: 'Movemos dos y el marco queda lleno: diez. Sobran tres. ¡Diez más tres es trece!', html: V.tenFrame(8, 2) + V.tenFrame(0, 3) },
      ],
      5: [{ say: 'Los números grandes tienen decenas y unidades. Suma las decenas con las decenas y las unidades con las unidades.', html: '<span style="font-size:2.4rem"><b style="color:#3D8BFF">2</b><b style="color:#FF6B6B">3</b> + <b style="color:#FF6B6B">4</b> = <b style="color:#3D8BFF">2</b><b style="color:#FF6B6B">7</b></span>' }],
    },
    make(L, ctx) {
      let a, b;
      if (L === 1) { a = GA.rand(1, 4); b = GA.rand(1, 5 - a); }
      else if (L === 2 || L === 3) { a = GA.rand(1, 9); b = GA.rand(1, 10 - a); }
      else if (L === 4) { a = GA.rand(6, 9); b = GA.rand(11 - a, 9); }
      else if (L === 5) {
        if (Math.random() < 0.5) { a = GA.rand(1, 8) * 10 + GA.rand(0, 8); b = GA.rand(1, 9 - (a % 10)); }
        else { a = GA.rand(1, 7) * 10 + GA.rand(0, 9); b = GA.rand(1, 9 - Math.floor(a / 10)) * 10; }
      } else { a = GA.rand(12, 68); b = GA.rand(11, 99 - a); }
      if (Math.random() < 0.5 && L <= 4) [a, b] = [b, a];
      GA.fresh(ctx, [[a, b].sort().join('+')]);
      const s = a + b, o = GA.pick(OBJ);
      const word = L >= 2 && L <= 5 && Math.random() < 0.3;
      const wp = sumWordProblem(a, b, o);
      const big = Math.max(a, b), small = Math.min(a, b);
      let explain;
      if (L <= 3) explain = { text: `Empezamos en ${big} y contamos ${small} más: ${GA.range(big + 1, s).join(', ')}. ¡${a} + ${b} = ${s}!`, html: V.tenFrames(a, b, true) };
      else if (L === 4) { const need = 10 - big; explain = { text: `Al ${big} le faltan ${need} para 10. Tomamos ${need} del ${small} y quedan ${small - need}. 10 + ${small - need} = ${s}.`, html: V.tenFrame(big, need, true) + V.tenFrame(0, small - need, true) }; }
      else explain = { text: `Decenas: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${(Math.floor(a / 10) + Math.floor(b / 10)) * 10}. Unidades: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Juntamos: ${s}.` };
      return {
        text: word ? wp : L <= 2 ? `¿Cuántos hay en total?` : `Resuelve la suma`,
        say: word ? wp : L <= 2 ? `Junta los dos grupos. ¿Cuántos hay en total? ${a} más ${b}.` : `¿Cuánto es ${a} más ${b}?`,
        render(stage, api) {
          if (word) stage.append(h('div', { class: 'word-problem' }, wp.replace(/¿.*$/, '')));
          if (L <= 2) {
            const r = h('div', { class: 'row' }, countable(a, o), h('div', { class: 'big-expr' }, '+'), countable(b, { e: GA.pick(OBJ.filter((x) => x.e !== o.e)).e, p: o.p }));
            stage.append(r);
          }
          if (L === 4) {
            // Marcos de diez interactivos: toca las fichas azules para llenar el primer marco
            let fa = big, fb = small;
            const box = h('div', { class: 'row' });
            const draw = () => {
              box.innerHTML = V.tenFrame(fa) + V.tenFrame(0, fb);
              GA.$$('.tf', box)[1].querySelectorAll('b').forEach((el) => {
                el.style.cursor = 'pointer';
                el.parentElement.addEventListener('click', () => { if (fa < 10 && fb > 0) { fa++; fb--; GA.sfx.play('pop'); draw(); if (fa === 10) GA.say(`¡Diez! Y quedan ${fb}.`); } });
              });
              box.firstChild.innerHTML = ''; // redibujar el primero con dos colores
              for (let i = 0; i < 10; i++) box.firstChild.innerHTML += `<i>${i < big ? '<b class="a"></b>' : i < fa ? '<b class="b"></b>' : ''}</i>`;
            };
            draw();
            stage.append(h('div', { class: 'muted center' }, 'Toca las fichas azules para llenar el primer marco 👇'), box);
          }
          stage.append(h('div', { class: 'big-expr' }, a, '+', b, '=', h('span', { class: 'q' }, '?')));
          if (L === 3 || L >= 5) stage.append(h('button', { class: 'btn btn-white btn-sm', onclick: (e) => { api.hintUsed(); e.target.replaceWith(GA.html(L === 3 ? V.tenFrames(a, b, true) : `<div class="row">${blocksHTML(a)}<span class="big-expr">+</span>${blocksHTML(b)}</div>`)); } }, '💡 Ver con dibujos'));
          stage.append(L <= 2 ? ui.answerChoices(GA.numOptions(s, 4, 0, 20).map((v) => ({ label: v, ok: v === s })), api) : ui.answerNumpad(s, api, { maxLen: 3 }));
        },
        hint: L === 4 ? 'Llena primero el marco hasta 10 y luego suma lo que sobra.' : L >= 5 ? 'Suma primero las unidades y después las decenas.' : 'Empieza por el número mayor y cuenta hacia adelante.',
        explain,
        tag: L >= 5 ? (L === 6 && (a % 10) + (b % 10) >= 10 ? 'suma-llevando' : 'suma-dos-cifras') : L === 4 ? 'suma-pasando-10' : word ? 'problema-suma' : 'suma-hasta-10',
      };
    },
  });

  function blocksHTML(n) {
    const hds = Math.floor(n / 100), t = Math.floor((n % 100) / 10), u = n % 10;
    return `<div class="blocks" style="min-height:0;width:auto;transform:scale(.7);transform-origin:center"><div class="grp">${'<div class="b100"></div>'.repeat(hds)}</div><div class="grp">${'<div class="b10"></div>'.repeat(t)}</div><div class="ones">${'<div class="b1"></div>'.repeat(u)}</div></div>`;
  }

  // ======================= RESTAS =======================
  GA.skill({
    id: 'restas', area: 'math', title: 'Restas', icon: '➖', desc: 'Haz que algunos se vayan volando y descubre cuántos quedan.',
    levels: ['Hasta 5 con dibujos', 'Hasta 10 con dibujos', 'Hasta 10', 'Hasta 20', 'Dos cifras'], prereq: [['sumas', 2]],
    lessons: {
      1: [{ say: 'Restar es quitar. Si hay cinco pajaritos y se van dos, quedan tres.', html: '<span style="font-size:3rem">🐦🐦🐦<span style="opacity:.3">🐦🐦</span></span>' }],
      4: [{ say: 'Truco: quita primero hasta llegar a diez. Catorce menos seis: quito cuatro y llego a diez, luego quito dos más y quedan ocho.', html: '<span style="font-size:2.2rem">14 ➜ 10 ➜ 8</span>' }],
    },
    make(L, ctx) {
      let a, b;
      if (L === 1) { a = GA.rand(2, 5); b = GA.rand(1, a - 1); }
      else if (L === 2 || L === 3) { a = GA.rand(3, 10); b = GA.rand(1, a - 1); }
      else if (L === 4) { a = GA.rand(11, 19); b = GA.rand(2, 9); }
      else { a = GA.rand(25, 99); b = Math.random() < 0.5 ? GA.rand(1, a % 10 || 1) + GA.rand(1, Math.floor(a / 10) - 1) * 10 : GA.rand(2, 9); if (b >= a) b = GA.rand(1, 9); }
      GA.fresh(ctx, [a, b]);
      const r = a - b;
      const o = GA.pick([{ e: '🐦', p: 'pajaritos', v: 'se van volando' }, { e: '🎈', p: 'globos', v: 'se escapan' }, { e: '🐟', p: 'peces', v: 'se van nadando' }, { e: '🦋', p: 'mariposas', v: 'se van volando' }, { e: '🍪', p: 'galletas', v: 'se comen' }]);
      const word = L >= 2 && Math.random() < 0.3;
      const n = GA.pick(NAMES);
      const wp = `${n} tenía ${a} ${o.p} y ${b} ${o.v}. ¿Cuántos quedan?`;
      return {
        text: L <= 2 ? `Hay ${a} ${o.e}. Toca ${b} para que ${o.v}.` : word ? wp : 'Resuelve la resta',
        say: L <= 2 ? `Hay ${a} ${o.p}. Toca ${b} para que ${o.v}.` : word ? wp : `¿Cuánto es ${a} menos ${b}?`,
        render(stage, api) {
          if (L <= 2) {
            let gone = 0;
            const wrap = h('div', { class: 'objs' });
            const ask = h('div', { style: { display: 'none', width: '100%' } }, h('div', { class: 'big-expr' }, a, '−', b, '=', h('span', { class: 'q' }, '?')), ui.answerChoices(GA.numOptions(r, 4, 0, 10).map((v) => ({ label: v, ok: v === r })), api));
            for (let i = 0; i < a; i++) {
              const bt = h('button', { class: 'obj' }, o.e);
              bt.addEventListener('click', () => {
                if (gone >= b || bt.classList.contains('gone')) return;
                gone++; bt.classList.add('gone'); GA.sfx.play('whoosh');
                if (gone === b) { setTimeout(() => { ask.style.display = 'grid'; ask.style.gap = '16px'; GA.say(`¿Cuántos ${o.p} quedan?`); }, 600); }
              });
              wrap.append(bt);
            }
            stage.append(wrap, ask);
            return;
          }
          if (word) stage.append(h('div', { class: 'word-problem' }, wp.replace(/¿.*$/, '')));
          stage.append(h('div', { class: 'big-expr' }, a, '−', b, '=', h('span', { class: 'q' }, '?')));
          stage.append(h('button', { class: 'btn btn-white btn-sm', onclick: (e) => { api.hintUsed(); e.target.replaceWith(GA.html(L === 5 ? `<div class="row">${blocksHTML(a)}</div>` : `<div style="font-size:1.8rem;max-width:520px;text-align:center">${o.e.repeat(r)}<span style="opacity:.25">${o.e.repeat(b)}</span></div>`)); } }, '💡 Ver con dibujos'));
          stage.append(ui.answerNumpad(r, api, { maxLen: 2 }));
        },
        hint: L === 4 ? 'Quita primero hasta llegar a 10 y luego lo que falta.' : L === 5 ? 'Resta primero las unidades y luego las decenas.' : `Puedes contar hacia atrás desde ${a}.`,
        explain: L === 4 && b > a - 10
          ? { text: `${a} − ${a - 10} = 10. Faltan quitar ${b - (a - 10)}: 10 − ${b - (a - 10)} = ${r}.` }
          : L === 5 ? { text: `Unidades y decenas por separado: ${a} − ${b} = ${r}. Puedes comprobarlo sumando: ${r} + ${b} = ${a}.` }
          : { text: `Contamos hacia atrás desde ${a}: ${GA.range(r, a - 1).reverse().join(', ')}. Quedan ${r}.`, html: `<span style="font-size:1.6rem">${o.e.repeat(r)}<span style="opacity:.25">${o.e.repeat(b)}</span></span>` },
        tag: L === 5 ? 'resta-dos-cifras' : L === 4 ? 'resta-pasando-10' : word ? 'problema-resta' : 'resta-hasta-10',
      };
    },
  });

  // ======================= DECENAS Y UNIDADES =======================
  function buildBlocks(stage, api, target, opts) {
    let H = 0, T = 0, U = 0;
    const area = h('div', { class: 'blocks' });
    const total = h('div', { class: 'big-expr', style: { fontSize: '2.6rem' } });
    const cols = [];
    const draw = () => {
      area.innerHTML = `<div class="grp">${'<div class="b100"></div>'.repeat(H)}</div><div class="grp">${'<div class="b10"></div>'.repeat(T)}</div><div class="ones">${'<div class="b1"></div>'.repeat(U)}</div>`;
      cols.forEach((c) => { c.cnt.textContent = c.get(); });
      total.textContent = opts.showTotal ? H * 100 + T * 10 + U : '';
    };
    const mk = (title, color, get, add, sub) => {
      const cnt = h('div', { class: 'cnt', style: { color } });
      const col = h('div', { class: 'col' }, h('h4', null, title), cnt, h('div', { class: 'btns' },
        h('button', { class: 'icon-btn', 'aria-label': 'Quitar ' + title, onclick: () => { sub(); GA.sfx.play('tap'); draw(); } }, '➖'),
        h('button', { class: 'icon-btn', 'aria-label': 'Agregar ' + title, onclick: () => { add(); GA.sfx.play('pop'); draw(); trade(); } }, '➕')));
      cols.push({ cnt, get });
      return col;
    };
    const trade = () => {
      if (U >= 10) setTimeout(() => { U -= 10; T++; GA.say('¡Diez cubitos forman una barra de diez!'); GA.sfx.play('level'); draw(); }, 500);
      if (T >= 10 && opts.hundreds) setTimeout(() => { T -= 10; H++; GA.say('¡Diez barras forman una placa de cien!'); draw(); }, 500);
    };
    const pv = h('div', { class: 'pv' },
      opts.hundreds ? mk('Centenas 🟧', '#E08A00', () => H, () => { if (H < 9) H++; }, () => { if (H) H--; }) : null,
      mk('Decenas 🟦', '#2563D6', () => T, () => { if (T < (opts.hundreds ? 10 : 9)) T++; }, () => { if (T) T--; }),
      mk('Unidades 🟥', '#D94848', () => U, () => { if (U < 10) U++; }, () => { if (U) U--; }));
    draw();
    const go = h('button', { class: 'btn btn-ok btn-big', onclick: () => {
      const v = H * 100 + T * 10 + U;
      const r = api.answer(v === target);
      if (r === 'done') { H = Math.floor(target / 100); T = Math.floor((target % 100) / 10); U = target % 10; draw(); }
    } }, '¡Listo!');
    stage.append(area, total, pv, go);
    return () => ({ H, T, U });
  }
  GA.skill({
    id: 'decenas', area: 'math', title: 'Decenas y unidades', icon: '🧱', desc: 'Construye números con barras de diez y cubitos.',
    levels: ['Del 10 al 20', 'Hasta 50', 'Hasta 99', 'Leer los bloques', 'Centenas'], prereq: [['contar', 3]],
    lessons: {
      1: [
        { say: 'Esto es un cubito. Vale uno.', html: '<div class="b1" style="transform:scale(2.5)"></div>' },
        { say: 'Si juntamos diez cubitos, formamos una barra. ¡Una barra vale diez!', html: '<div class="b10"></div><span style="font-size:2.4rem"> = 10</span>' },
        { say: 'Para hacer el trece usamos una barra de diez y tres cubitos. Una decena y tres unidades.', html: '<div class="b10"></div><div class="ones"><div class="b1"></div><div class="b1"></div><div class="b1"></div></div><span style="font-size:2.4rem"> = 13</span>' },
      ],
      5: [{ say: 'Diez barras de diez forman una placa de cien. ¡Una centena!', html: '<div class="b100"></div><span style="font-size:2.4rem"> = 100</span>' }],
    },
    sandbox(stage) {
      stage.append(h('div', { class: 'muted center' }, 'Construye el número que quieras. ¡Prueba poner 10 cubitos!'));
      buildBlocks(stage, { answer: () => 'ok' }, -1, { showTotal: true, hundreds: true });
      GA.$('.btn-ok', stage).remove();
    },
    make(L, ctx) {
      const ranges = [null, [10, 20], [11, 50], [11, 99], [11, 99], [100, 999]];
      let n; do { n = GA.rand(...ranges[L]); } while (L === 4 && n % 10 === Math.floor(n / 10));
      GA.fresh(ctx, [n]);
      const t = Math.floor((n % 100) / 10), u = n % 10, hd = Math.floor(n / 100);
      if (L === 4) {
        const rev = u * 10 + t;
        const opts = GA.shuffle([...new Set([n, rev, n + 10 <= 99 ? n + 10 : n - 10, n + 1])]);
        return {
          text: '¿Qué número formaron los bloques?', say: '¿Qué número formaron estos bloques? Cuenta las barras de diez y luego los cubitos.',
          render(stage, api) { stage.append(GA.html(blocksHTML(n).replace('transform:scale(.7);', ''))); stage.append(ui.answerChoices(opts.map((v) => ({ label: v, ok: v === n })), api, { cls: 'huge' })); },
          hint: 'Primero cuenta las barras (de diez en diez) y después los cubitos.',
          explain: { text: `${t} barras son ${t * 10}, y ${u} cubitos: ${t * 10} + ${u} = ${n}. Las decenas van a la izquierda.` },
          tag: 'valor-posicional',
        };
      }
      return {
        text: `Construye el número ${n}`, say: `Construye el número ${n} con barras de diez y cubitos.`,
        render(stage, api) { buildBlocks(stage, api, n, { showTotal: L === 1, hundreds: L === 5 }); },
        hint: L === 5 ? `El primer número dice cuántas placas de cien.` : `El ${n} tiene ${t} decenas: pon ${t} barras.`,
        explain: { text: L === 5 ? `${n} = ${hd} centenas, ${t} decenas y ${u} unidades.` : `${n} = ${t} decenas y ${u} unidades: ${t} barras y ${u} cubitos.`, html: blocksHTML(n) },
        tag: 'valor-posicional',
      };
    },
  });

  // ======================= PATRONES =======================
  const PSETS = [['🔴', '🔵', '🟡', '🟢'], ['🐶', '🐱', '🐭', '🐰'], ['🍎', '🍌', '🍇', '🍓'], ['⭐', '🌙', '☀️', '☁️'], ['🔺', '🟦', '🟣', '🔶'], ['🚗', '🚌', '🚲', '🚀']];
  GA.skill({
    id: 'patrones', area: 'math', title: 'Patrones', icon: '🔁', desc: 'Descubre la regla secreta y completa la serie.',
    levels: ['AB', 'ABC y AAB', 'Patrones con dos huecos', 'Números que crecen', 'Números que bajan y doblan'],
    lessons: {
      1: [{ say: 'Un patrón es algo que se repite siempre igual. Rojo, azul, rojo, azul… ¿qué sigue? ¡Rojo!', html: '🔴🔵🔴🔵🔴❓' }],
      4: [{ say: 'Los números también hacen patrones. Dos, cuatro, seis, ocho: cada vez sumamos dos.', html: '<span style="font-size:2.4rem">2 ⤻ 4 ⤻ 6 ⤻ 8 <small>(+2)</small></span>' }],
    },
    make(L, ctx) {
      let seq, blanks, cands, ruleText;
      if (L <= 3) {
        const set = GA.shuffle(GA.pick(PSETS));
        const units = L === 1 ? ['AB'] : L === 2 ? ['ABC', 'AAB', 'ABB'] : ['AABB', 'ABCD', 'ABBC', 'ABAC'];
        const unit = GA.pick(units).split('').map((c) => set[c.charCodeAt(0) - 65]);
        const len = Math.max(L === 1 ? 7 : 8, unit.length * 2 + 2);
        seq = GA.range(0, len - 1).map((i) => unit[i % unit.length]);
        blanks = L === 3 ? GA.sample(GA.range(unit.length, len - 1), 2).sort((a, b) => a - b) : [len - 1];
        cands = GA.shuffle([...new Set([...unit, set[3]])]).slice(0, 4);
        if (!blanks.every((b) => cands.includes(seq[b]))) cands = GA.shuffle([...new Set(unit)]);
        ruleText = `El patrón que se repite es ${unit.join(' ')}.`;
      } else {
        let start, step, kind;
        if (L === 4) { step = GA.pick([2, 5, 10, 3]); start = GA.rand(0, 5) * (step === 3 ? 1 : step === 10 ? 1 : 1) + (step === 10 ? GA.rand(0, 9) : 0); kind = '+'; }
        else { kind = GA.pick(['-', '-', 'x2']); step = kind === 'x2' ? 2 : GA.pick([1, 2, 5, 10]); start = kind === 'x2' ? GA.pick([1, 2, 3, 5]) : GA.rand(5, 9) * step + GA.rand(0, 3); }
        const len = 6;
        seq = [start];
        for (let i = 1; i < len; i++) seq.push(kind === '+' ? seq[i - 1] + step : kind === '-' ? seq[i - 1] - step : seq[i - 1] * 2);
        blanks = Math.random() < 0.5 ? [len - 1] : [GA.rand(2, len - 1)];
        const ans = seq[blanks[0]];
        cands = GA.numOptions(ans, 4, 0, 400);
        ruleText = kind === '+' ? `Cada número suma ${step}.` : kind === '-' ? `Cada número resta ${step}.` : 'Cada número es el doble del anterior.';
      }
      GA.fresh(ctx, [seq.join()]);
      return {
        text: blanks.length > 1 ? '¿Qué va en los huecos?' : '¿Qué va en el hueco?', say: L >= 4 ? 'Descubre la regla de los números. ¿Qué número va en el hueco?' : 'Descubre el patrón. ¿Qué va en el hueco? Arrastra o toca la respuesta.',
        render(stage, api) {
          const row = h('div', { class: 'slots' });
          const slots = [];
          seq.forEach((x, i) => {
            if (blanks.includes(i)) { const s = h('div', { class: 'slot dropzone' }); s._i = i; slots.push(s); row.append(s); s.addEventListener('click', () => { s.innerHTML = ''; s.classList.remove('filled'); }); }
            else row.append(h('div', { class: 'tile' + (L <= 3 ? ' emoji' : '') }, x));
          });
          const fill = (s, v) => {
            s.innerHTML = ''; s.append(h('div', { class: 'tile' + (L <= 3 ? ' emoji' : '') }, v)); s._v = v; s.classList.add('filled'); GA.sfx.play('pop');
            if (slots.every((z) => z.firstChild)) {
              const okArr = slots.map((z) => z._v === seq[z._i]);
              const ok = okArr.every(Boolean);
              slots.forEach((z, k) => z.classList.toggle('good', ok || okArr[k]));
              const r = api.answer(ok);
              if (!ok && r === 'retry') setTimeout(() => slots.forEach((z, k) => { if (!okArr[k]) { z.innerHTML = ''; z.classList.remove('filled'); } }), 700);
              if (r === 'done') slots.forEach((z) => { z.innerHTML = ''; z.append(h('div', { class: 'tile' + (L <= 3 ? ' emoji' : '') }, seq[z._i])); z.classList.add('good'); });
            }
          };
          const pal = h('div', { class: 'tray' }, cands.map((v) => {
            const t = h('div', { class: 'tile' + (L <= 3 ? ' emoji' : '') }, v);
            GA.drag(t, { zones: () => slots, onTap: () => { const s = slots.find((z) => !z.firstChild); if (s) fill(s, v); }, onDrop: (z) => { fill(z, v); return false; } });
            return t;
          }));
          stage.append(row, pal);
        },
        hint: L >= 4 ? 'Mira cuánto cambia de un número al siguiente.' : 'Busca el grupo que se repite y señálalo con el dedo.',
        explain: { text: ruleText, html: `<span style="font-size:1.8rem">${seq.join(' ')}</span>` },
        tag: L >= 4 ? 'patron-numerico' : 'patron-figuras',
      };
    },
  });

  // ======================= FIGURAS =======================
  const SOLIDS = {
    cubo: `<svg viewBox="0 0 100 100" width="110" height="110"><polygon points="30,30 70,30 90,15 50,15" fill="#9B83FF"/><polygon points="70,30 90,15 90,60 70,75" fill="#5235CF"/><rect x="30" y="30" width="40" height="45" fill="#7656F5"/></svg>`,
    esfera: `<svg viewBox="0 0 100 100" width="110" height="110"><defs><radialGradient id="sg" cx="35%" cy="35%"><stop offset="0" stop-color="#9FE8C9"/><stop offset="1" stop-color="#0B7F59"/></radialGradient></defs><circle cx="50" cy="50" r="38" fill="url(#sg)"/></svg>`,
    cono: `<svg viewBox="0 0 100 100" width="110" height="110"><polygon points="50,8 82,80 18,80" fill="#FF7433"/><ellipse cx="50" cy="80" rx="32" ry="9" fill="#D9551A"/></svg>`,
    cilindro: `<svg viewBox="0 0 100 100" width="110" height="110"><rect x="25" y="20" width="50" height="60" fill="#3D8BFF"/><ellipse cx="50" cy="80" rx="25" ry="8" fill="#2563D6"/><ellipse cx="50" cy="20" rx="25" ry="8" fill="#8FBBFF"/></svg>`,
    piramide: `<svg viewBox="0 0 100 100" width="110" height="110"><polygon points="50,10 20,78 55,88" fill="#FFC233"/><polygon points="50,10 55,88 84,72" fill="#E09B00"/></svg>`,
  };
  const SOLID_OBJ = [['🎲', 'cubo'], ['🧊', 'cubo'], ['🎁', 'cubo'], ['⚽', 'esfera'], ['🏀', 'esfera'], ['🌍', 'esfera'], ['🍊', 'esfera'], ['🍦', 'cono'], ['🥳', 'cono'], ['🥫', 'cilindro'], ['🔋', 'cilindro'], ['🕯️', 'cilindro'], ['🥁', 'cilindro']];
  function polyPoints(kind) {
    const reg = (n, r, st) => GA.range(0, n - 1).map((i) => { const a = (st + (360 / n) * i) * Math.PI / 180; return [50 + r * Math.cos(a), 50 + r * Math.sin(a)]; });
    return { triangulo: reg(3, 42, -90), cuadrado: [[16, 16], [84, 16], [84, 84], [16, 84]], rectangulo: [[6, 28], [94, 28], [94, 72], [6, 72]], rombo: [[50, 6], [82, 50], [50, 94], [18, 50]], trapecio: [[28, 24], [72, 24], [92, 76], [8, 76]], pentagono: reg(5, 42, -90), hexagono: reg(6, 42, 0), octagono: reg(8, 42, 22.5) }[kind];
  }
  GA.skill({
    id: 'formas', area: 'math', title: 'Figuras y cuerpos', icon: '🔺', desc: 'Reconoce figuras, cuenta lados y descubre las formas del mundo.',
    levels: ['Figuras básicas', 'Lados y vértices', 'Más figuras', 'Cuerpos 3D'],
    lessons: {
      1: [{ say: 'Un triángulo tiene tres lados. ¡Aunque esté de cabeza o inclinado sigue siendo un triángulo!', html: V.shape('triangulo', '#7656F5', 90) + V.shape('triangulo', '#FF7433', 90, 180) + V.shape('triangulo', '#12A876', 90, 35) }],
      2: [{ say: 'Los lados son las líneas rectas. Los vértices son las esquinas donde se juntan dos lados.', html: V.shape('cuadrado', '#3D8BFF', 110) }],
      4: [{ say: 'Los cuerpos no son planos: puedes tomarlos con la mano. Un dado es un cubo y una pelota es una esfera.', html: SOLIDS.cubo + SOLIDS.esfera }],
    },
    make(L, ctx) {
      if (L === 1 || L === 3) {
        const pool = L === 1 ? ['circulo', 'cuadrado', 'triangulo', 'rectangulo'] : ['pentagono', 'hexagono', 'rombo', 'ovalo', 'octagono', 'trapecio', 'estrella', 'corazon'];
        const target = GA.fresh(ctx, pool);
        const others = GA.sample(pool.filter((x) => x !== target).concat(L === 3 ? ['triangulo', 'cuadrado'] : []), 3);
        const nm = V.SHAPE_NAMES[target];
        return {
          text: `Toca el ${nm}`, say: `Toca el ${nm}.`,
          render(stage, api) { stage.append(ui.answerChoices(GA.shuffle([target, ...others]).map((k) => ({ html: V.shape(k, GA.pick(V.COLORS), 110, k === 'circulo' ? 0 : GA.pick([0, 0, 15, 30, 180, 90])), ok: k === target })), api)); },
          hint: target === 'triangulo' ? 'Busca la figura con 3 lados, ¡aunque esté girada!' : `Cuenta los lados de cada figura.`,
          explain: { text: `Éste es el ${nm}${V.SHAPE_SIDES[target] ? `: tiene ${V.SHAPE_SIDES[target]} lados` : ''}.`, html: V.shape(target, '#26BF63', 90) },
          tag: 'figuras',
        };
      }
      if (L === 2) {
        const kind = GA.fresh(ctx, ['triangulo', 'cuadrado', 'rectangulo', 'rombo', 'trapecio', 'pentagono', 'hexagono', 'octagono']);
        const pts = polyPoints(kind), n = pts.length, what = Math.random() < 0.6 ? 'lados' : 'vértices';
        return {
          text: `¿Cuántos ${what} tiene el ${V.SHAPE_NAMES[kind]}? Toca cada ${what === 'lados' ? 'lado' : 'esquina'} para contar.`,
          say: `¿Cuántos ${what} tiene esta figura? Toca cada ${what === 'lados' ? 'lado' : 'esquina'} para contarlo.`,
          render(stage, api) {
            let c = 0;
            const col = GA.pick(V.COLORS);
            let parts = `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${col}" opacity=".35"/>`;
            pts.forEach((p, i) => {
              const q = pts[(i + 1) % n];
              if (what === 'lados') parts += `<line class="part" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${col}" stroke-width="7" stroke-linecap="round" style="cursor:pointer"/>`;
              else parts += `<circle class="part" cx="${p[0]}" cy="${p[1]}" r="7" fill="${col}" style="cursor:pointer"/>`;
            });
            const svg = GA.html(`<svg viewBox="-8 -8 116 116" width="260" height="260">${parts}</svg>`);
            svg.querySelectorAll('.part').forEach((el) => el.addEventListener('click', () => {
              if (el.dataset.c) return; c++; el.dataset.c = 1; el.setAttribute(what === 'lados' ? 'stroke' : 'fill', '#FFC233'); GA.sfx.play('count'); GA.say(GA.numWord(c));
            }));
            stage.append(svg, ui.answerChoices(GA.numOptions(n, 4, 3, 10).map((v) => ({ label: v, ok: v === n })), api));
          },
          hint: 'Toca cada parte una sola vez y cuenta.',
          explain: { text: `El ${V.SHAPE_NAMES[kind]} tiene ${n} lados y ${n} vértices. ¡Siempre tienen el mismo número!` },
          tag: 'lados-vertices',
        };
      }
      const [e, solid] = GA.fresh(ctx, SOLID_OBJ, (x) => x[0]);
      const opts = GA.shuffle([solid, ...GA.sample(Object.keys(SOLIDS).filter((x) => x !== solid), 2)]);
      return {
        text: `¿Qué forma tiene esto? ${e}`, say: '¿Qué forma tiene este objeto?',
        render(stage, api) {
          stage.append(h('div', { class: 'big-pic' }, e));
          stage.append(ui.answerChoices(opts.map((k) => ({ html: `<div style="display:grid;justify-items:center">${SOLIDS[k]}<span style="font-size:1.1rem">${k === 'piramide' ? 'pirámide' : k}</span></div>`, ok: k === solid, say: k })), api, { speakOnTap: true }));
        },
        hint: '¿Rueda? ¿Tiene caras planas? ¿Tiene punta?',
        explain: { text: { cubo: 'Es un cubo: tiene 6 caras cuadradas iguales.', esfera: 'Es una esfera: es redonda por todos lados y rueda hacia cualquier lado.', cono: 'Es un cono: tiene una base redonda y una punta.', cilindro: 'Es un cilindro: tiene dos círculos y puede rodar.' }[solid], html: SOLIDS[solid] },
        tag: 'cuerpos-3d',
      };
    },
  });

  // ======================= BALANZA MÁGICA =======================
  function balance(stage, api, cfg) {
    // cfg: left (array de pesas), rightFixed (array), target (number), mode 'cubes' | 'shape'
    let cubes = 0, guess = 1;
    const svg = GA.html(`<svg class="scale-svg" viewBox="0 0 600 340">
      <polygon points="270,320 330,320 312,96 288,96" fill="#8C6A4A"/><rect x="220" y="314" width="160" height="18" rx="9" fill="#6E5236"/>
      <g class="scale-beam" style="transform-origin:300px 92px;transform-box:view-box"><rect x="70" y="84" width="460" height="16" rx="8" fill="#B88A5E"/></g>
      <circle cx="300" cy="92" r="14" fill="#FFC233" stroke="#E09B00" stroke-width="4"/>
      <g class="pan L" style="transition:transform .6s cubic-bezier(.3,1.4,.5,1)"><line x1="0" y1="0" x2="-60" y2="110" stroke="#6E5236" stroke-width="3"/><line x1="0" y1="0" x2="60" y2="110" stroke="#6E5236" stroke-width="3"/><path d="M-80 110 Q0 150 80 110Z" fill="#E4C9A3" stroke="#B88A5E" stroke-width="4"/><g class="load"></g></g>
      <g class="pan R" style="transition:transform .6s cubic-bezier(.3,1.4,.5,1)"><line x1="0" y1="0" x2="-60" y2="110" stroke="#6E5236" stroke-width="3"/><line x1="0" y1="0" x2="60" y2="110" stroke="#6E5236" stroke-width="3"/><path d="M-80 110 Q0 150 80 110Z" fill="#E4C9A3" stroke="#B88A5E" stroke-width="4"/><g class="load"></g></g>
    </svg>`);
    const beam = svg.querySelector('.scale-beam'), pL = svg.querySelector('.pan.L'), pR = svg.querySelector('.pan.R');
    const weightBox = (x, y, label, color) => `<g transform="translate(${x},${y})"><rect x="-26" y="-48" width="52" height="48" rx="10" fill="${color}" stroke="rgba(0,0,0,.2)" stroke-width="3"/><text x="0" y="-14" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="28" fill="#fff">${label}</text></g>`;
    const tri = (x, y, label) => `<g transform="translate(${x},${y})"><polygon points="0,-52 28,0 -28,0" fill="#12A876" stroke="#0B7F59" stroke-width="3"/><text x="0" y="-10" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="22" fill="#fff">${label}</text></g>`;
    const cubesSvg = (n, x0) => { let s = ''; for (let i = 0; i < n; i++) { const r = Math.floor(i / 6), c = i % 6; s += `<rect x="${x0 - 57 + c * 19}" y="${104 - (r + 1) * 19}" width="17" height="17" rx="3" fill="#FF6B6B" stroke="#D94848" stroke-width="2"/>`; } return s; };
    const eq = h('div', { class: 'big-expr', style: { fontSize: '2.2rem' } });
    const leftVal = () => (cfg.mode === 'shape' ? cfg.count * guess : cfg.left.reduce((a, b) => a + b, 0));
    const rightVal = () => (cfg.mode === 'shape' ? cfg.count * cfg.secret : cfg.rightFixed.reduce((a, b) => a + b, 0) + cubes);
    const draw = () => {
      const Lv = leftVal(), Rv = rightVal();
      const ang = GA.clamp((Rv - Lv) * 3, -16, 16);
      beam.style.transform = `rotate(${ang}deg)`;
      const rad = (ang * Math.PI) / 180;
      pL.style.transform = `translate(${300 - 220 * Math.cos(rad)}px, ${92 - 220 * Math.sin(rad)}px)`;
      pR.style.transform = `translate(${300 + 220 * Math.cos(rad)}px, ${92 + 220 * Math.sin(rad)}px)`;
      if (cfg.mode === 'shape') {
        pL.querySelector('.load').innerHTML = GA.range(0, cfg.count - 1).map((i) => tri(-(cfg.count - 1) * 30 + i * 60, 118, guess)).join('');
        pR.querySelector('.load').innerHTML = cubesSvg(cfg.count * cfg.secret, 0);
        eq.textContent = `${cfg.count} × 🔺 = ${cfg.count * cfg.secret}`;
      } else {
        pL.querySelector('.load').innerHTML = cfg.left.map((w, i) => weightBox(-(cfg.left.length - 1) * 30 + i * 60, 118, w, '#7656F5')).join('');
        pR.querySelector('.load').innerHTML = cfg.rightFixed.map((w) => weightBox(-50, 118, w, '#3D8BFF')).join('') + cubesSvg(cubes, cfg.rightFixed.length ? 36 : 0);
        eq.textContent = `${cfg.left.join(' + ')} = ${cfg.rightFixed.length ? cfg.rightFixed.join(' + ') + ' + ' : ''}${cubes}`;
      }
    };
    const ctrl = cfg.mode === 'shape'
      ? h('div', { class: 'opt-row' }, h('span', { class: 'lbl' }, 'Cada 🔺 pesa:'), h('button', { class: 'icon-btn', onclick: () => { if (guess > 1) guess--; GA.sfx.play('tap'); draw(); } }, '➖'), h('button', { class: 'icon-btn', onclick: () => { if (guess < 12) guess++; GA.sfx.play('tap'); draw(); } }, '➕'))
      : h('div', { class: 'opt-row' }, h('span', { class: 'lbl' }, 'Cubitos 🟥'), h('button', { class: 'icon-btn', 'aria-label': 'Quitar cubito', onclick: () => { if (cubes > 0) cubes--; GA.sfx.play('tap'); draw(); } }, '➖'),
        h('button', { class: 'icon-btn', 'aria-label': 'Agregar cubito', onclick: () => { if (cubes < 30) cubes++; GA.sfx.play('pop'); draw(); } }, '➕'),
        h('button', { class: 'btn btn-white btn-sm', onclick: () => { cubes = Math.min(30, cubes + 5); GA.sfx.play('pop'); draw(); } }, '+5'));
    const go = h('button', { class: 'btn btn-ok btn-big', onclick: () => {
      const ok = leftVal() === rightVal();
      const r = api.answer(ok);
      if (r === 'done') { if (cfg.mode === 'shape') guess = cfg.secret; else cubes = cfg.target; draw(); }
    } }, '⚖️ ¡Está equilibrada!');
    stage.append(svg, eq, ctrl);
    if (!cfg.sandbox) stage.append(go);
    requestAnimationFrame(draw);
  }
  GA.skill({
    id: 'balanza', area: 'math', title: 'Balanza mágica', icon: '⚖️', desc: 'Pon cubitos hasta que la balanza quede derecha. ¡El inicio del álgebra!',
    levels: ['Equilibra', 'Suma en la balanza', 'El número escondido', 'Figuras misteriosas'], prereq: [['sumas', 2]],
    lessons: {
      1: [{ say: 'Una balanza se queda derecha cuando los dos lados pesan lo mismo. El lado más pesado baja.', html: '<span style="font-size:3rem">⚖️</span>' }],
      3: [{ say: 'A veces ya hay una pesa en tu lado. ¿Cuántos cubitos faltan para que pese igual que el otro lado?', html: '<span style="font-size:2.4rem">9 = 4 + ?</span>' }],
      4: [{ say: 'Cada triángulo pesa lo mismo, pero es un misterio. Prueba valores y mira cómo se mueve la balanza.', html: '<span style="font-size:2.4rem">🔺🔺 = 8</span>' }],
    },
    sandbox(stage) {
      stage.append(h('div', { class: 'muted center' }, 'Juega con la balanza: el lado izquierdo pesa 7. ¿Qué pasa si pones más o menos cubitos?'));
      balance(stage, { answer: () => 'ok' }, { left: [7], rightFixed: [], target: 7, sandbox: true });
    },
    make(L, ctx) {
      let cfg, text, say, explainText;
      if (L === 1) { const a = GA.rand(2, 12); cfg = { left: [a], rightFixed: [], target: a }; text = 'Pon cubitos hasta que la balanza quede derecha'; say = 'Agrega cubitos al plato de la derecha hasta que la balanza quede derecha.'; explainText = `El lado izquierdo pesa ${a}. Con ${a} cubitos pesan igual.`; }
      else if (L === 2) { const a = GA.rand(2, 9), b = GA.rand(2, 9); cfg = { left: [a, b], rightFixed: [], target: a + b }; text = '¿Cuántos cubitos equilibran las dos pesas?'; say = text; explainText = `${a} + ${b} = ${a + b}, así que necesitamos ${a + b} cubitos.`; }
      else if (L === 3) { const c = GA.rand(6, 18), a = GA.rand(1, c - 2); cfg = { left: [c], rightFixed: [a], target: c - a }; text = `Ya hay una pesa de ${a}. ¿Cuántos cubitos faltan?`; say = text; explainText = `${c} = ${a} + ${c - a}. Faltaban ${c - a} cubitos.`; }
      else { const x = GA.rand(2, 7), k = GA.rand(2, 3); cfg = { mode: 'shape', count: k, secret: x }; text = '¿Cuánto pesa cada triángulo? Prueba hasta equilibrar'; say = '¿Cuánto pesa cada triángulo? Cambia el número y mira cómo se mueve la balanza.'; explainText = `${k} triángulos pesan ${k * x}. Entonces cada uno pesa ${x}, porque ${Array(k).fill(x).join(' + ')} = ${k * x}.`; }
      GA.fresh(ctx, [JSON.stringify(cfg)]);
      return { text, say, render(stage, api) { balance(stage, api, cfg); }, hint: 'Si tu lado está arriba, le falta peso. Si está abajo, le sobra.', explain: { text: explainText }, tag: L === 4 ? 'algebra' : 'equilibrio' };
    },
  });

  // ======================= MULTIPLICACIÓN =======================
  GA.skill({
    id: 'multiplicar', area: 'math', title: 'Grupos iguales', icon: '✖️', desc: 'Multiplicar es sumar grupos iguales. ¡Platos, galletas y filas!',
    levels: ['Platos con galletas', 'Filas y columnas', 'Tablas del 2, 5 y 10', 'Todas las tablas'], prereq: [['sumas', 4]],
    lessons: {
      1: [
        { say: 'Aquí hay tres platos y cada uno tiene dos galletas. Son grupos iguales.', html: '<span style="font-size:2.4rem">(🍪🍪) (🍪🍪) (🍪🍪)</span>' },
        { say: 'Contamos de dos en dos: dos, cuatro, seis. Tres veces dos es seis. ¡Eso es multiplicar!', html: '<span style="font-size:2.4rem">2, 4, 6 ➜ 3 × 2 = 6</span>' },
      ],
      2: [{ say: 'Cuando acomodamos en filas iguales hacemos un arreglo. Tres filas de cuatro son doce.', html: '<span style="font-size:1.8rem;line-height:1.1">🔵🔵🔵🔵<br>🔵🔵🔵🔵<br>🔵🔵🔵🔵</span>' }],
    },
    make(L, ctx) {
      let g, k;
      if (L === 1) { g = GA.rand(2, 4); k = GA.rand(2, 5); }
      else if (L === 2) { g = GA.rand(2, 5); k = GA.rand(2, 6); }
      else if (L === 3) { k = GA.pick([2, 5, 10]); g = GA.rand(1, 10); }
      else { g = GA.rand(2, 10); k = GA.rand(2, 10); }
      if (L >= 3 && Math.random() < 0.5) [g, k] = [k, g];
      GA.fresh(ctx, [g, k]);
      const p = g * k;
      const add = Array(g).fill(k).join(' + ');
      if (L === 1) {
        return {
          text: `Hay ${g} platos con ${k} 🍪 cada uno. ¿Cuántas galletas hay en total?`, say: `Hay ${g} platos con ${k} galletas cada uno. Toca los platos para contar de ${k} en ${k}. ¿Cuántas galletas hay?`,
          render(stage, api) {
            let run = 0;
            const row = h('div', { class: 'row' }, GA.range(1, g).map(() => {
              const pl = h('button', { class: 'choice', style: { fontSize: '1.7rem', borderRadius: '50%', width: '130px', height: '130px', lineHeight: '1.1', padding: '14px' } }, h('div', null, '🍪'.repeat(k)));
              pl.addEventListener('click', () => { if (pl.dataset.c) return; run += k; pl.dataset.c = 1; pl.append(h('div', { class: 'chip', style: { position: 'absolute' } }, run)); pl.style.position = 'relative'; GA.say(String(run)); GA.sfx.play('count'); });
              return pl;
            }));
            stage.append(row, ui.answerChoices(GA.numOptions(p, 4, 1, 40).map((v) => ({ label: v, ok: v === p })), api));
          },
          hint: `Cuenta de ${k} en ${k}, un plato a la vez.`,
          explain: { text: `${add} = ${p}. ¡${g} veces ${k} es ${p}! Se escribe ${g} × ${k} = ${p}.` },
          tag: 'grupos-iguales',
        };
      }
      return {
        text: L === 2 ? `¿Cuántos puntos hay? (${g} filas de ${k})` : `¿Cuánto es ${g} × ${k}?`, say: L === 2 ? `Hay ${g} filas de ${k}. Toca cada fila para contar. ¿Cuántos puntos hay?` : `¿Cuánto es ${g} por ${k}?`,
        render(stage, api) {
          const arr = h('div', { style: { display: 'grid', gap: '6px' } });
          let run = 0;
          const mkRows = () => GA.range(1, g).forEach(() => {
            const r = h('button', { class: 'choice', style: { minHeight: '0', padding: '4px 10px', fontSize: '1.6rem', justifyItems: 'start' } }, '🔵'.repeat(k));
            r.addEventListener('click', () => { if (r.dataset.c) return; r.dataset.c = 1; run += k; r.textContent = '🟢'.repeat(k) + '  ' + run; GA.say(String(run)); GA.sfx.play('count'); });
            arr.append(r);
          });
          if (L === 2) { mkRows(); stage.append(arr); }
          else {
            stage.append(h('div', { class: 'big-expr' }, g, '×', k, '=', h('span', { class: 'q' }, '?')));
            stage.append(h('button', { class: 'btn btn-white btn-sm', onclick: (e) => { api.hintUsed(); mkRows(); e.target.replaceWith(arr); } }, '💡 Ver en filas'));
          }
          stage.append(ui.answerNumpad(p, api, { maxLen: 3 }));
        },
        hint: `Suma ${k} ${g} veces, o cuenta de ${k} en ${k}.`,
        explain: { text: `${g} × ${k} es ${g} grupos de ${k}: ${add} = ${p}.` },
        tag: L >= 3 ? `tabla-${Math.max(g, k) === 10 ? 10 : Math.min(g, k)}` : 'arreglos',
      };
    },
  });

  // ======================= FRACCIONES =======================
  const DEN = { 2: ['medio', 'medios'], 3: ['tercio', 'tercios'], 4: ['cuarto', 'cuartos'], 5: ['quinto', 'quintos'], 6: ['sexto', 'sextos'], 8: ['octavo', 'octavos'] };
  const fracWord = (k, n) => (k === 1 ? `un ${DEN[n][0]}` : `${GA.numWord(k)} ${DEN[n][1]}`);
  const fracHTML = (k, n) => `<span style="display:inline-grid;line-height:.95;text-align:center;font-family:'Baloo 2';font-weight:800"><span>${k}</span><span style="border-top:4px solid currentColor;padding:0 6px">${n}</span></span>`;
  GA.skill({
    id: 'fracciones', area: 'math', title: 'Fracciones de pizza', icon: '🍕', desc: 'Parte pizzas en partes iguales: mitades, tercios y cuartos.',
    levels: ['Partes iguales', 'Colorea la fracción', '¿Qué fracción es?', 'Compara fracciones'], prereq: [['formas', 1], ['sumas', 3]],
    lessons: {
      1: [
        { say: 'Una fracción es una parte de algo entero. Pero para ser justos, ¡las partes deben ser iguales!', html: V.pizza(4, 0, 120) + V.unequal(120) },
        { say: 'Si partimos una pizza en dos partes iguales, cada parte es un medio, o la mitad.', html: V.pizza(2, 1, 130) },
      ],
      3: [{ say: 'El número de abajo dice en cuántas partes iguales partimos. El de arriba, cuántas tomamos. Tres cuartos: partimos en cuatro y tomamos tres.', html: V.pizza(4, 3, 120) + `<span style="font-size:2.6rem">= ${fracHTML(3, 4)}</span>` }],
    },
    make(L, ctx) {
      if (L === 1) {
        if (Math.random() < 0.5) {
          const n = GA.pick([2, 3, 4]);
          return {
            text: '¿Cuál está partida en partes IGUALES?', say: '¿Cuál pizza está partida en partes iguales?',
            render(stage, api) { stage.append(ui.answerChoices(GA.shuffle([{ html: V.pizza(n, 0, 140), ok: true }, { html: V.unequal(140), ok: false }, { html: V.rectFrac(3, 0, 140, '#3D8BFF', false), ok: false }]), api)); },
            hint: 'Mira si todos los pedazos son del mismo tamaño.',
            explain: { text: 'En las partes iguales todos los pedazos son del mismo tamaño. ¡Así nadie se queda con menos!', html: V.pizza(n, 0, 90) },
            tag: 'partes-iguales',
          };
        }
        const n = GA.pick([2, 4]);
        const t = n === 2 ? 'la mitad' : 'un cuarto';
        return {
          text: `¿Cuál pizza muestra ${t} coloreado?`, say: `¿Cuál pizza tiene ${t} coloreado?`,
          render(stage, api) { stage.append(ui.answerChoices(GA.shuffle([2, 3, 4]).map((d) => ({ html: V.pizza(d, 1, 140), ok: d === n })), api)); },
          hint: n === 2 ? 'La mitad es una de dos partes iguales.' : 'Un cuarto es una de cuatro partes iguales.',
          explain: { text: `${t[0].toUpperCase() + t.slice(1)} es 1 de ${n} partes iguales.`, html: V.pizza(n, 1, 90) },
          tag: 'mitad-cuarto',
        };
      }
      const n = L === 2 ? GA.pick([2, 3, 4, 4, 6]) : GA.pick([2, 3, 4, 5, 6, 8]);
      const k = GA.rand(1, n - 1);
      GA.fresh(ctx, [k, n]);
      if (L === 2) {
        return {
          text: `Colorea ${fracWord(k, n)} de la pizza`, say: `Toca los pedazos para colorear ${fracWord(k, n)} de la pizza.`,
          render(stage, api) {
            const sel = new Set();
            const box = h('div');
            const draw = () => {
              box.innerHTML = V.pizza(n, [...sel], 240);
              box.querySelectorAll('.slice').forEach((s) => { s.style.cursor = 'pointer'; s.addEventListener('click', () => { const i = +s.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); GA.sfx.play('pop'); draw(); }); });
            };
            draw();
            stage.append(h('div', { style: { fontSize: '3rem' } }, GA.html(fracHTML(k, n))), box, h('button', { class: 'btn btn-ok btn-big', onclick: () => {
              const r = api.answer(sel.size === k);
              if (r === 'done') { sel.clear(); GA.range(0, k - 1).forEach((i) => sel.add(i)); draw(); }
            } }, '¡Listo!'));
          },
          hint: `El número de abajo (${n}) son los pedazos. Colorea ${k}.`,
          explain: { text: `${fracWord(k, n)}: de ${n} pedazos iguales coloreamos ${k}.`, html: V.pizza(n, k, 90) },
          tag: 'representar-fraccion',
        };
      }
      if (L === 3) {
        const opts = GA.shuffle([[k, n], [n - k, n], [k, GA.pick(Object.keys(DEN).map(Number).filter((x) => x !== n && x > k))], [k + 1 < n ? k + 1 : Math.max(1, k - 1), n]].filter((x, i, a) => x[0] > 0 && x[0] < x[1] && a.findIndex((y) => y[0] === x[0] && y[1] === x[1]) === i));
        return {
          text: '¿Qué fracción está coloreada?', say: '¿Qué fracción de la pizza está coloreada?',
          render(stage, api) { stage.append(GA.html(`<div>${V.pizza(n, k, 220)}</div>`), ui.answerChoices(opts.map(([a, b]) => ({ html: `<span style="font-size:2.6rem">${fracHTML(a, b)}</span>`, ok: a === k && b === n, say: fracWord(a, b) })), api, { speakOnTap: true })); },
          hint: 'Cuenta todos los pedazos (abajo) y los coloreados (arriba).',
          explain: { text: `Hay ${n} pedazos y ${k} coloreados: ${k}/${n}, ${fracWord(k, n)}.` },
          tag: 'leer-fraccion',
        };
      }
      // L4: comparar
      let a, b, c, d;
      if (Math.random() < 0.5) { a = 1; c = 1; [b, d] = GA.sample([2, 3, 4, 6, 8], 2); }
      else { b = d = GA.pick([4, 5, 6, 8]); [a, c] = GA.sample(GA.range(1, b - 1), 2); }
      const bigger = a / b > c / d ? 0 : 1;
      return {
        text: '¿Cuál fracción es MÁS GRANDE?', say: `¿Qué es más grande, ${fracWord(a, b)} o ${fracWord(c, d)}?`,
        render(stage, api) { stage.append(ui.answerChoices([[a, b], [c, d]].map(([x, y], i) => ({ html: `<div style="display:grid;justify-items:center;gap:6px">${V.pizza(y, x, 140)}<span style="font-size:2.2rem">${fracHTML(x, y)}</span></div>`, ok: i === bigger })), api)); },
        hint: a === c ? 'Si partes la pizza en MÁS pedazos, cada pedazo es más pequeño.' : 'Con pedazos del mismo tamaño, gana quien tiene más pedazos.',
        explain: { text: a === c ? `Con ${Math.min(b, d)} partes cada pedazo es más grande que con ${Math.max(b, d)}. ¡Más partes, pedazos más pequeños!` : `Los pedazos son del mismo tamaño (${fracWord(1, b)}). ${Math.max(a, c)} pedazos es más que ${Math.min(a, c)}.` },
        tag: 'comparar-fracciones',
      };
    },
  });

  // ======================= EL RELOJ =======================
  function clockSVG(hh, mm) {
    let marks = '';
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180;
      marks += `<text x="${100 + 72 * Math.cos(a)}" y="${100 + 72 * Math.sin(a) + 9}" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="24" fill="#23304D">${i}</text>`;
    }
    for (let i = 0; i < 60; i++) { const a = (i * 6) * Math.PI / 180; const r1 = i % 5 ? 88 : 84; marks += `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 92 * Math.sin(a)}" y2="${100 - 92 * Math.cos(a)}" stroke="#94A3B8" stroke-width="${i % 5 ? 1.5 : 3}"/>`; }
    return `<svg class="clock-svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" fill="#fff" stroke="#7656F5" stroke-width="6"/>${marks}
      <g class="hand hh" style="transform-origin:100px 100px;transform:rotate(${(hh % 12) * 30 + mm * 0.5}deg)"><line x1="100" y1="104" x2="100" y2="54" stroke="#FF7433" stroke-width="9" stroke-linecap="round"/></g>
      <g class="hand mm" style="transform-origin:100px 100px;transform:rotate(${mm * 6}deg)"><line x1="100" y1="106" x2="100" y2="26" stroke="#3D8BFF" stroke-width="6" stroke-linecap="round"/></g>
      <circle cx="100" cy="100" r="7" fill="#23304D"/></svg>`;
  }
  function timeWords(hh, mm) {
    const hname = (x) => (x % 12 === 1 ? 'la una' : `las ${GA.numWord(x % 12 === 0 ? 12 : x % 12)}`);
    if (mm === 0) return `${hname(hh)} en punto`;
    if (mm === 30) return `${hname(hh)} y media`;
    if (mm === 15) return `${hname(hh)} y cuarto`;
    if (mm === 45) return `${hname(hh + 1)} menos cuarto`;
    return `${hname(hh)} y ${mm}`;
  }
  const digital = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
  GA.skill({
    id: 'reloj', area: 'math', title: 'El reloj', icon: '🕒', desc: 'Lee la hora y mueve las manecillas.',
    levels: ['En punto', 'Y media', 'Y cuarto / menos cuarto', 'De 5 en 5 minutos'], prereq: [['contar', 4]],
    lessons: {
      1: [{ say: 'El reloj tiene dos manecillas. La corta y naranja marca la hora. La larga y azul, los minutos. Cuando la larga apunta al doce, es en punto.', html: clockSVG(3, 0) }],
      2: [{ say: 'Cuando la manecilla larga apunta al seis, ha pasado media hora. ¡Es y media! La corta queda entre dos números.', html: clockSVG(4, 30) }],
      3: [{ say: 'En el tres es y cuarto. En el nueve, menos cuarto: falta un cuarto de hora para la siguiente.', html: clockSVG(2, 15) + clockSVG(2, 45) }],
      4: [{ say: 'Cada número grande vale cinco minutos. Cuenta de cinco en cinco: cinco, diez, quince, veinte…', html: clockSVG(7, 20) }],
    },
    make(L, ctx) {
      const step = [null, 60, 30, 15, 5][L];
      const hh = GA.rand(1, 12), mm = GA.rand(0, 60 / step - 1) * step;
      GA.fresh(ctx, [hh, mm]);
      const set = Math.random() < 0.4;
      if (set) {
        return {
          text: `Pon el reloj a ${timeWords(hh, mm)} (${digital(hh, mm)})`, say: `Mueve las manecillas para que sean ${timeWords(hh, mm)}.`,
          render(stage, api) {
            let total = ((hh + GA.rand(2, 5)) % 12) * 60;
            const box = h('div', { html: clockSVG(Math.floor(total / 60), total % 60) });
            const upd = () => { const H = Math.floor(total / 60) % 12, M = total % 60; box.querySelector('.hh').style.transform = `rotate(${H * 30 + M * 0.5}deg)`; box.querySelector('.mm').style.transform = `rotate(${(total / 60) * 360}deg)`; };
            const mv = (d) => { total = (total + d + 720 * 10) % 720; GA.sfx.play('tap'); upd(); };
            stage.append(box, h('div', { class: 'opt-row' }, h('button', { class: 'btn btn-white', onclick: () => mv(-step) }, '⟲ Atrás'), h('button', { class: 'btn btn-white', onclick: () => mv(step) }, 'Adelante ⟳')),
              h('button', { class: 'btn btn-ok btn-big', onclick: () => {
                const H = Math.floor(total / 60) % 12 || 12, M = total % 60;
                const r = api.answer(H === hh && M === mm);
                if (r === 'done') { total = (hh % 12) * 60 + mm; upd(); }
              } }, '¡Listo!'));
          },
          hint: 'La manecilla larga dice los minutos; la corta, la hora.',
          explain: { text: `${timeWords(hh, mm)}: la corta cerca del ${hh} y la larga en el ${mm === 0 ? 12 : mm / 5}.`, html: `<div style="width:140px">${clockSVG(hh, mm)}</div>` },
          tag: 'poner-hora',
        };
      }
      const cand = new Set([digital(hh, mm)]);
      let g = 0;
      while (cand.size < 3 && g++ < 50) {
        const alt = GA.pick([[mm / 5 || 12, hh * 5 % 60], [hh % 12 + 1, mm], [hh, (mm + step) % 60], [hh === 1 ? 12 : hh - 1, mm]]);
        if (alt[0] >= 1 && alt[0] <= 12 && alt[1] % step === 0) cand.add(digital(alt[0], alt[1]));
      }
      return {
        text: '¿Qué hora marca el reloj?', say: '¿Qué hora marca el reloj?',
        render(stage, api) {
          stage.append(GA.html(`<div>${clockSVG(hh, mm)}</div>`));
          stage.append(ui.answerChoices(GA.shuffle([...cand]).map((t) => { const [a, b] = t.split(':').map(Number); return { html: `<div style="display:grid;justify-items:center"><span>${t}</span><small style="font-size:1rem">${timeWords(a, b)}</small></div>`, ok: t === digital(hh, mm), say: timeWords(a, b) }; }), api, { cls: 'txt', speakOnTap: true }));
        },
        hint: 'Primero mira la manecilla corta (hora), luego la larga (minutos).',
        explain: { text: `Son ${timeWords(hh, mm)} (${digital(hh, mm)}).` },
        tag: 'leer-hora',
      };
    },
  });

  // ======================= SUDOKU DE ANIMALES =======================
  function makeGrid(n) {
    let g = n === 3 ? [[0, 1, 2], [1, 2, 0], [2, 0, 1]] : [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
    const perm = GA.shuffle(GA.range(0, n - 1));
    g = g.map((r) => r.map((v) => perm[v]));
    if (n === 3) { g = GA.shuffle(g); const cp = GA.shuffle([0, 1, 2]); g = g.map((r) => cp.map((c) => r[c])); }
    else {
      const bands = GA.shuffle([[0, 1], [2, 3]]).map((b) => GA.shuffle(b)).flat();
      g = bands.map((i) => g[i]);
      const cols = GA.shuffle([[0, 1], [2, 3]]).map((b) => GA.shuffle(b)).flat();
      g = g.map((r) => cols.map((c) => r[c]));
    }
    return g;
  }
  GA.skill({
    id: 'logica', area: 'math', title: 'Sudoku de animales', icon: '🧩', desc: 'Cada animal aparece una sola vez en cada fila y columna.',
    levels: ['3×3 fácil', '3×3', '4×4 fácil', '4×4 experto'],
    lessons: {
      1: [{ say: 'La regla del sudoku: en cada fila y en cada columna, cada animal aparece sólo una vez. ¡Busca cuál falta!', html: '<span style="font-size:2.4rem">🐶🐱❓</span>' }],
      3: [{ say: 'En el sudoku grande, además, cada cuadrito de dos por dos debe tener los cuatro animales.', html: '<span style="font-size:2rem;line-height:1.1">🐶🐱<br>🐰🐸</span>' }],
    },
    make(L) {
      const n = L <= 2 ? 3 : 4;
      const sym = GA.sample(['🐶', '🐱', '🐰', '🐸', '🐼', '🦊', '🐵', '🐯'], n);
      const sol = makeGrid(n);
      const blanksN = [null, 2, 4, 5, 8][L];
      const blanks = new Set(GA.sample(GA.range(0, n * n - 1), blanksN));
      return {
        text: 'Completa el sudoku: cada animal una vez en cada fila y columna', say: 'Toca una casilla vacía y luego el animal que va ahí. Cada animal sólo una vez en cada fila y columna.',
        render(stage, api) {
          const vals = GA.range(0, n * n - 1).map((i) => (blanks.has(i) ? null : sol[Math.floor(i / n)][i % n]));
          let sel = null;
          const grid = h('div', { class: 'sudoku', style: { gridTemplateColumns: `repeat(${n}, auto)` } });
          const cells = vals.map((v, i) => {
            const r = Math.floor(i / n), c = i % n;
            const cl = h('button', { class: 'cell' + (blanks.has(i) ? '' : ' given') + (n === 4 && c === 1 ? ' bx-r' : '') + (n === 4 && r === 1 ? ' bx-b' : '') }, v == null ? '' : sym[v]);
            cl.classList.add('dropzone');
            cl._i = i;
            if (blanks.has(i)) cl.addEventListener('click', () => { sel = i; cells.forEach((x) => x.classList.toggle('sel', x._i === i)); GA.sfx.play('tap'); });
            grid.append(cl);
            return cl;
          });
          const setCell = (i, v) => { vals[i] = v; cells[i].textContent = sym[v]; cells[i].classList.remove('bad'); GA.sfx.play('pop'); const nx = [...blanks].find((b) => vals[b] == null); sel = nx ?? sel; cells.forEach((x) => x.classList.toggle('sel', x._i === sel)); };
          sel = [...blanks][0]; cells[sel].classList.add('sel');
          const pal = h('div', { class: 'tray' }, sym.map((s, v) => {
            const t = h('div', { class: 'tile emoji' }, s);
            GA.drag(t, { zones: () => cells.filter((c) => blanks.has(c._i)), onTap: () => { if (sel != null) setCell(sel, v); }, onDrop: (z) => { setCell(z._i, v); return false; } });
            return t;
          }));
          const go = h('button', { class: 'btn btn-ok btn-big', onclick: () => {
            if (vals.some((v) => v == null)) { GA.say('Todavía hay casillas vacías.'); return; }
            const bad = new Set();
            const groups = [];
            for (let r = 0; r < n; r++) groups.push(GA.range(0, n - 1).map((c) => r * n + c));
            for (let c = 0; c < n; c++) groups.push(GA.range(0, n - 1).map((r) => r * n + c));
            if (n === 4) for (const br of [0, 2]) for (const bc of [0, 2]) groups.push([br * 4 + bc, br * 4 + bc + 1, (br + 1) * 4 + bc, (br + 1) * 4 + bc + 1]);
            groups.forEach((g) => { const seen = {}; g.forEach((i) => { (seen[vals[i]] = seen[vals[i]] || []).push(i); }); Object.values(seen).forEach((arr) => { if (arr.length > 1) arr.forEach((i) => { if (blanks.has(i)) bad.add(i); }); }); });
            bad.forEach((i) => cells[i].classList.add('bad'));
            const r = api.answer(bad.size === 0);
            if (r === 'done') blanks.forEach((i) => { vals[i] = sol[Math.floor(i / n)][i % n]; cells[i].textContent = sym[vals[i]]; cells[i].classList.remove('bad'); });
          } }, '¡Comprobar!');
          stage.append(grid, pal, go);
        },
        hint: 'Mira la fila y la columna de la casilla: ¿qué animal todavía no está?',
        explain: { text: 'En cada fila y cada columna debe estar cada animal una sola vez. Mira la solución.' },
        tag: 'logica',
      };
    },
  });
})();
