/* Gael Aprende — Gimnasio de Lectura
   Entrenamiento dirigido para automatizar la decodificación y ganar fluidez:
   - Sílaba por sílaba: las sílabas aparecen una a la vez (no se puede "adivinar" la palabra completa) y luego se juntan.
   - Palabras inventadas: la mejor prueba de que se lee cada sílaba y no la forma de la palabra.
   - b/d, palabras espejo (es/se, la/al…) y trabadas: práctica de discriminación con errores típicos como distractores.
   - Tren de sílabas: reconocimiento automático con tiempo.
   - Oraciones veloces: lectura guiada con ritmo (pacer) que se ajusta solo, de 2 a 35 palabras, con comprensión. */
(function () {
  'use strict';
  const { h } = GA;
  const ui = GA.ui;
  const Y = GA.GYM;
  const D = () => GA.store.data;

  const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const VOW = 'aeiou';
  const canHear = () => !!(GA.settings().voice && 'speechSynthesis' in window);
  const big = (t, cls = '') => h('div', { class: 'big-word lx-word ' + cls }, t);
  const help = (api, text) => h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); GA.say(text, { rate: 0.75 }); } }, '🔊 Ayuda');
  const uniq = (arr, n) => [...new Set(arr)].slice(0, n);

  // ---------- Palabras inventadas ----------
  const REAL = new Set([...GA.WORDS.map((w) => plain(w.w)), ...GA.LECTOR.GROUPS.flatMap((g) => g.words.map((w) => plain(w.w))), ...Object.values(Y.SYL).flat().map((w) => plain(w.w))]);
  const ONSET = ['m', 'p', 's', 'l', 't', 'n', 'd', 'b', 'r', 'f', 'v', 'j', 'ch', 'll', 'ñ'];
  const cv = () => {
    const r = Math.random();
    if (r < 0.12) return GA.pick(['ca', 'co', 'cu', 'ga', 'go', 'gu']);
    return GA.pick(ONSET) + GA.pick([...VOW]);
  };
  function pseudo(n, extra) {
    for (let g = 0; g < 50; g++) {
      const s = GA.range(1, n).map(cv);
      if (extra) s[GA.rand(0, n - 1)] = extra();
      if (!REAL.has(s.join(''))) return s;
    }
    return ['bo', 'fe', 'la'];
  }
  const swapVowel = (syl) => {
    const i = [...syl].findLastIndex((c) => VOW.includes(c));
    if (i < 0) return syl;
    return syl.slice(0, i) + GA.pick([...VOW].filter((v) => v !== syl[i])) + syl.slice(i + 1);
  };
  // Cambia b↔d (una o todas) — el error que más comete Gael
  function swapBD(word) {
    const out = new Set();
    const idx = [...word].map((c, i) => (/[bd]/i.test(c) ? i : -1)).filter((i) => i >= 0);
    const flip = (c) => ({ b: 'd', d: 'b', B: 'D', D: 'B' }[c] || c);
    idx.forEach((i) => out.add(word.slice(0, i) + flip(word[i]) + word.slice(i + 1)));
    if (idx.length > 1) out.add([...word].map(flip).join(''));
    out.delete(word);
    return [...out];
  }
  // Errores típicos con trabadas: quitar la l/r (plato→pato), voltearla (plato→palto) o meter vocal (plato→palato)
  function trabVariants(word) {
    const m = /([bcdfgpt])([lr])([aeiouáéíóú])/i.exec(word);
    if (!m) return [];
    const [all, c, l, v] = m, i = m.index, rest = word.slice(i + all.length);
    const base = word.slice(0, i);
    const out = [base + c + v + rest, base + c + v + l + rest, base + c + v + l + v + rest];
    return uniq(out.filter((x) => x !== word), 3);
  }
  // Variantes de una palabra inventada (sílabas al revés, b/d, vocal)
  function pseudoVariants(syls) {
    const w = syls.join('');
    const out = [];
    if (syls.length > 1) out.push(syls.slice().reverse().join(''));
    out.push(...swapBD(w));
    const k = GA.rand(0, syls.length - 1);
    out.push(syls.map((s, i) => (i === k ? swapVowel(s) : s)).join(''));
    out.push(...trabVariants(w));
    return uniq(GA.shuffle(out.filter((x) => x !== w)), 2);
  }

  // Opciones para escuchar: cada una se oye y se escoge (comprueba que se leyó lo escrito, sin adivinar)
  function soundChoices(opts, api, onOk) {
    let locked = false;
    const lock = () => { locked = true; wrap.classList.add('locked'); };
    const rows = opts.map((o, i) => {
      const row = h('div', { class: 'g-sound' },
        h('button', { class: 'btn btn-white', onclick: () => GA.say(o.say, { rate: 0.8 }) }, `🔊 ${i + 1}`),
        h('button', { class: 'btn btn-sm', onclick: () => {
          if (locked) return;
          GA.sfx.play('tap');
          const r = api.answer(!!o.ok);
          if (o.ok) { row.classList.add('right'); lock(); onOk && onOk(); }
          else { row.classList.add('wrong'); if (r === 'done') { lock(); rows.forEach((x, j) => opts[j].ok && x.classList.add('right')); } }
        } }, '✔ Es esta'));
      return row;
    });
    const wrap = h('div', { class: 'g-sounds' }, h('p', { class: 'muted' }, 'Escucha las tres y escoge la que dice lo que está escrito.'), rows);
    return wrap;
  }

  // Sílabas tapadas que se destapan una por una, de izquierda a derecha
  function syllableTiles(syls, onDone) {
    let k = 0;
    const tiles = syls.map((s, i) => h('button', { class: 'g-tile' + (i === 0 ? ' next' : ''), onclick: () => {
      if (i !== k) { tiles[k].classList.remove('pulse'); void tiles[k].offsetWidth; tiles[k].classList.add('pulse'); return; }
      GA.sfx.play('tap');
      tiles[i].textContent = s; tiles[i].classList.remove('next'); tiles[i].classList.add('open');
      k++;
      if (k < syls.length) tiles[k].classList.add('next');
      else { joinBtn.style.display = ''; }
    } }, '👆'));
    const row = h('div', { class: 'g-tiles' }, tiles);
    const joinBtn = h('button', { class: 'btn btn-big', style: { display: 'none' }, onclick: () => { row.classList.add('joined'); joinBtn.remove(); onDone(); } }, '⚡ ¡Ahora todo junto!');
    return h('div', { class: 'g-syl-box' }, h('p', { class: 'muted' }, '👆 Toca cada cuadro en orden. Lee cada sílaba en voz alta.'), row, joinBtn);
  }

  const AREA = 'gimnasio';

  // ======================= 1. SÍLABA POR SÍLABA =======================
  GA.skill({
    id: 'gsil', area: AREA, title: 'Sílaba por sílaba', icon: '🧩', desc: 'Destapa la palabra sílaba por sílaba, léela despacito y luego júntala rápido.',
    levels: ['Palabras de 2 sílabas', 'Palabras de 3 sílabas', 'Con sílabas al, en, es', 'Palabras inventadas', 'Palabras largas'],
    lessons: {
      1: [{ say: 'Los grandes lectores leen sílaba por sílaba, sin adivinar. Pon tu dedo debajo de cada sílaba: bo… ta… y luego júntalas rápido: ¡bota!', html: '<div class="lx-syls">bo · ta ➜ bota</div><div class="lx-ex">☝️👢</div>' },
        { say: 'Aquí las sílabas están tapadas. Destápalas una por una, de izquierda a derecha, y lee cada una en voz alta.', html: '<div class="lx-syls">👆 ➜ ➜ ➜</div>' }],
      4: [{ say: 'Ahora leerás palabras inventadas. ¡No existen! Por eso no se pueden adivinar: hay que leer cada sílaba. Luego escucha las opciones y escoge la que dice lo mismo.', html: '<div class="lx-syls">fo · bi · ta</div><div class="lx-ex">🔊 1 · 🔊 2 · 🔊 3</div>' }],
    },
    make(L, ctx) {
      if (L === 4) {
        const syls = pseudo(GA.rand(2, 3));
        const w = syls.join('');
        const vars = pseudoVariants(syls);
        const hear = canHear();
        return {
          text: 'Lee la palabra inventada', say: 'Destapa la palabra inventada y léela sílaba por sílaba.',
          render(stage, api) {
            const box = h('div', { class: 'g-after' });
            stage.append(syllableTiles(syls, () => {
              if (hear) box.append(soundChoices(GA.shuffle([{ say: w, ok: true }, ...vars.map((v) => ({ say: v }))]), api));
              else {
                stage.querySelector('.g-tiles').style.visibility = 'hidden';
                box.append(h('p', { class: 'muted' }, '¿Cuál era la palabra?'), ui.answerChoices(GA.shuffle([w, ...vars]).map((x) => ({ label: x, ok: x === w, cls: 'txt lx-opt' })), api));
              }
            }), box);
          },
          hint: `Lee despacito: ${syls.join(' - ')}.`,
          explain: { text: `Decía “${w}”: ${syls.join(' - ')}.`, html: `<span class="lx-explain">${syls.join(' · ')}</span>` },
          tag: 'g-silabas',
        };
      }
      const pool = Y.SYL[L === 5 ? 5 : L];
      const w = GA.fresh(ctx, pool, (x) => x.w);
      const others = GA.sample(pool.filter((x) => x.e !== w.e), 2);
      return {
        text: 'Destapa y lee', say: 'Destapa la palabra sílaba por sílaba y léela en voz alta.',
        render(stage, api) {
          const box = h('div', { class: 'g-after' });
          stage.append(syllableTiles(w.s, () => {
            box.append(h('p', { class: 'muted' }, '¿Qué palabra leíste?'), ui.answerChoices(GA.shuffle([w, ...others]).map((x) => ({ label: x.e, ok: x === w, cls: 'huge' })), api, { after: (o) => o.ok && GA.say(w.w) }));
          }), box);
        },
        hint: `Lee cada sílaba: ${w.s.join(' - ')}. Luego júntalas.`,
        explain: { text: `Dice “${w.w}”: ${w.s.join(' - ')}.`, html: `<span style="font-size:2.4rem">${w.e}</span>` },
        tag: 'g-silabas',
      };
    },
  });

  // ======================= 2. LA B Y LA D =======================
  const BD_TIP = 'b: primero el bastón y luego la barriga. d: primero la dona y luego el palito.';
  GA.skill({
    id: 'gbd', area: AREA, title: 'La b y la d', icon: '🅱️', desc: 'Entrena tus ojos para no confundir la b con la d.',
    levels: ['Encuentra la letra', 'Sílabas con b y d', 'Palabras con b y d', 'Oraciones con b y d'],
    lessons: {
      1: [{ say: 'La b y la d se parecen mucho, ¡pero miran hacia lados distintos! La b se escribe primero con el bastón y luego la barriga: b de bastón y barriga.', html: '<div class="lx-letter"><span class="g-b">b</span></div><div class="lx-ex">🦯 + 🫃</div>' },
        { say: 'La d se escribe primero con la dona y después el palito: d de dona.', html: '<div class="lx-letter"><span class="g-d">d</span></div><div class="lx-ex">🍩 + 🦯</div>' },
        { say: 'Otro truco: haz la cama con tus manos. Levanta los pulgares y junta los puños. La mano izquierda es la b y la derecha es la d. ¡Como una cama: b, d!', html: '<div class="lx-letter"><span class="g-b">b</span> 🛏️ <span class="g-d">d</span></div>' }],
    },
    make(L, ctx) {
      if (L === 1) {
        const target = GA.pick(['b', 'd']);
        const other = target === 'b' ? 'd' : 'b';
        const n = 12, nT = GA.rand(3, 5);
        const extra = Math.random() < 0.4 ? ['p', 'q'] : [other];
        const letters = GA.shuffle([...Array(nT).fill(target), ...GA.range(1, n - nT).map((i) => (i <= n - nT - 2 ? other : GA.pick(extra)))]);
        return {
          text: `Toca todas las ${target}`, say: `Toca todas las letras ${target === 'b' ? 'be, de bastón y barriga' : 'de, de dona'}.`,
          render(stage, api) {
            let found = 0;
            const grid = h('div', { class: 'g-grid' }, letters.map((c) => {
              const b = h('button', { class: 'g-letter', 'data-t': c === target ? '1' : null, onclick: () => {
                if (b.classList.contains('ok') || grid.classList.contains('done')) return;
                if (c === target) { GA.sfx.play('pop'); b.classList.add('ok'); found++; if (found === nT) { grid.classList.add('done'); api.answer(true); } }
                else { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 600); const r = api.answer(false); if (r === 'done') { grid.classList.add('done'); GA.$$('.g-letter', grid).forEach((x, i) => letters[i] === target && x.classList.add('ok')); } }
              } }, c);
              return b;
            }));
            stage.append(h('div', { class: 'g-target' }, 'Busca: ', h('span', { class: target === 'b' ? 'g-b' : 'g-d' }, target), ` · ${nT} escondidas`), grid);
          },
          hint: BD_TIP,
          explain: { text: BD_TIP, html: '<span class="lx-explain"><span class="g-b">b</span> 🦯🫃 · <span class="g-d">d</span> 🍩🦯</span>' },
          tag: 'g-bd',
        };
      }
      if (L === 2) {
        const words = Y.BD.filter((w) => /^[bd]/.test(w.s[0]));
        const w = GA.fresh(ctx, words, (x) => x.w);
        const syl = w.s[0];
        const opts = uniq([syl, syl.replace(/^[bd]/, (c) => (c === 'b' ? 'd' : 'b')), 'p' + syl.slice(1)], 3);
        if (canHear() && Math.random() < 0.5) {
          return {
            text: 'Escucha y toca la sílaba', say: `Escucha y toca la sílaba. ${GA.syl.phrase(syl)}`,
            render(stage, api) { stage.append(GA.syl.btn(syl), ui.answerChoices(GA.shuffle(opts).map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api)); },
            hint: BD_TIP, explain: { text: `Era “${syl}”. ${BD_TIP}` }, tag: 'g-bd',
          };
        }
        return {
          text: '¿Qué sílaba falta?', say: 'Mira el dibujo. ¿Con qué sílaba empieza?',
          render(stage, api) {
            stage.append(h('div', { class: 'big-pic' }, w.e), h('div', { class: 'lx-blanks' }, w.s.map((s, i) => h('span', { class: 'lx-syl' + (i === 0 ? ' gap' : '') }, i === 0 ? '?' : s))));
            stage.append(ui.answerChoices(GA.shuffle(opts).map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api, { after: (o) => { if (o.ok) { const g = stage.querySelector('.gap'); g.textContent = syl; g.classList.add('ok'); GA.say(w.w); } } }));
          },
          hint: `Di “${w.w}” despacito. ${BD_TIP}`,
          explain: { text: `Es ${w.w}: empieza con “${syl}”.` },
          tag: 'g-bd',
        };
      }
      if (L === 3) {
        const w = GA.fresh(ctx, Y.BD, (x) => x.w);
        const vars = GA.sample(swapBD(w.w), 2);
        return {
          text: '¿Cuál está bien escrita?', say: 'Mira el dibujo y toca la palabra bien escrita. ¡Fíjate en la b y la d!',
          render(stage, api) {
            stage.append(h('div', { class: 'big-pic' }, w.e));
            stage.append(ui.answerChoices(GA.shuffle([w.w, ...vars]).map((x) => ({ label: x, ok: x === w.w, cls: 'txt lx-opt' })), api, { after: (o) => o.ok && GA.say(w.w) }));
          },
          hint: BD_TIP,
          explain: { text: `Se escribe “${w.w}”. ${BD_TIP}` },
          tag: 'g-bd',
        };
      }
      const [s, word, pic] = GA.fresh(ctx, Y.BD_SENTS, (x) => x[0]);
      if (Math.random() < 0.5) {
        const wrongWord = GA.pick(swapBD(word));
        const ok = Math.random() < 0.5;
        const shown = ok ? s : s.replace(word, wrongWord);
        return {
          text: '¿Está bien escrita?', say: 'Lee la oración con cuidado. ¿Está bien escrita?',
          render(stage, api) {
            const card = big(shown, 'lx-sent');
            stage.append(h('div', { class: 'big-pic' }, pic), card);
            stage.append(ui.answerChoices([{ label: '👍 Sí, está bien', ok, cls: 'txt' }, { label: '👎 No, tiene un error', ok: !ok, cls: 'txt' }], api, { after: (o) => { if (o.ok && !ok) { card.textContent = s; } } }));
          },
          hint: `Revisa cada b y cada d. ${BD_TIP}`,
          explain: { text: ok ? `Sí, está bien: “${s}”` : `Tenía un error: decía “${wrongWord}” y debe decir “${word}”.` },
          tag: 'g-bd',
        };
      }
      const opts = uniq([word, ...swapBD(word)], 3);
      const show = s.replace(word, '____');
      return {
        text: 'Completa la oración', say: 'Mira el dibujo y escoge la palabra bien escrita.',
        render(stage, api) {
          const card = big(show, 'lx-sent');
          stage.append(h('div', { class: 'big-pic' }, pic), card);
          stage.append(ui.answerChoices(GA.shuffle(opts).map((x) => ({ label: x, ok: x === word, cls: 'txt lx-opt' })), api, { after: (o) => { if (o.ok) { card.textContent = s; GA.say(s); } } }));
        },
        hint: BD_TIP,
        explain: { text: `“${s}”` },
        tag: 'g-bd',
      };
    },
  });

  // ======================= 3. PALABRAS ESPEJO (es/se, la/al…) =======================
  const MIRROR_TIP = 'Mira primero la PRIMERA letra: “es” empieza con e, “se” empieza con s.';
  GA.skill({
    id: 'gesp', area: AREA, title: 'Palabras espejo', icon: '🪞', desc: 'es o se, la o al, el o le… ¡Tienen las mismas letras al revés!',
    levels: ['Mira bien', 'En la oración', '¿Está bien escrita?', '¡Mirada rápida!'],
    lessons: {
      1: [{ say: 'Algunas palabras son como espejos: es y se, la y al, el y le. Tienen las mismas letras, pero en otro orden. El truco es mirar primero la primera letra.', html: '<div class="lx-syls"><b>e</b>s ↔ <b>s</b>e<br><b>l</b>a ↔ <b>a</b>l</div>' },
        { say: 'Lee siempre de izquierda a derecha, como cuando caminas hacia adelante. Primera letra, segunda letra… ¡y listo!', html: '<div class="lx-syls">👀 ➜ ➜</div>' }],
    },
    make(L, ctx) {
      if (L === 1 || L === 4) {
        const pair = GA.fresh(ctx, Y.MIRROR, (x) => x.join());
        const target = GA.pick(pair);
        const third = GA.pick(Y.MIRROR.filter((p) => p !== pair).flat().filter((x) => x.length === target.length));
        const opts = GA.shuffle(uniq([target, pair[0] === target ? pair[1] : pair[0], third], 3));
        const ms = L === 1 ? 1600 : 800;
        return {
          text: '¡Mira bien!', say: 'Toca listo, mira la palabra y luego encuéntrala.',
          render(stage, api) {
            const card = h('div', { class: 'lx-flash' }, h('span', { class: 'lx-flash-q' }, '🪞'));
            const choices = ui.answerChoices(opts.map((o) => ({ label: o, ok: o === target, cls: 'txt lx-opt' })), api, { after: (o, r) => { if (o.ok || r === 'done') go.remove(); } });
            choices.style.visibility = 'hidden';
            let shown = 0;
            const go = h('button', { class: 'btn btn-big', onclick: () => {
              if (shown++) api.hintUsed();
              card.innerHTML = ''; card.append(h('span', { class: 'lx-flash-w' }, target)); go.disabled = true;
              setTimeout(() => { if (!card.isConnected) return; card.innerHTML = ''; card.append(h('span', { class: 'lx-flash-q' }, '❓')); choices.style.visibility = 'visible'; go.disabled = false; go.textContent = '👀 Ver otra vez'; }, ms);
            } }, '👀 ¡Listo!');
            stage.append(card, go, choices);
          },
          hint: MIRROR_TIP,
          explain: { text: `Era “${target}”. ${MIRROR_TIP}`, html: `<span class="lx-explain">${target}</span>` },
          tag: 'g-espejo',
        };
      }
      const [s, ok, bad] = GA.fresh(ctx, Y.MIRROR_SENTS, (x) => x[0]);
      const full = s.replace('___', ok);
      if (L === 2) {
        return {
          text: 'Completa la oración', say: 'Lee la oración y escoge la palabra que va.',
          render(stage, api) {
            const card = big(s.replace('___', '____'), 'lx-sent');
            stage.append(card, h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); GA.say(full, { rate: 0.8 }); } }, '🔊 Ayuda'));
            stage.append(ui.answerChoices(GA.shuffle([ok, bad]).map((x) => ({ label: x, ok: x === ok, cls: 'txt lx-opt' })), api, { after: (o) => { if (o.ok) { card.textContent = full; GA.say(full); } } }));
          },
          hint: `Lee la oración con cada palabra. ¿Cuál tiene sentido? ${MIRROR_TIP}`,
          explain: { text: `“${full}”` },
          tag: 'g-espejo',
        };
      }
      const right = Math.random() < 0.5;
      const shown = right ? full : s.replace('___', bad);
      return {
        text: '¿Está bien escrita?', say: 'Lee con cuidado. ¿La oración está bien escrita?',
        render(stage, api) {
          const card = big(shown, 'lx-sent');
          stage.append(card);
          stage.append(ui.answerChoices([{ label: '👍 Sí, está bien', ok: right, cls: 'txt' }, { label: '👎 No, tiene un error', ok: !right, cls: 'txt' }], api, { after: (o) => { if (o.ok && !right) card.textContent = full; } }));
        },
        hint: MIRROR_TIP,
        explain: { text: right ? `Sí, está bien: “${full}”` : `Decía “${bad}” y debe decir “${ok}”: “${full}”` },
        tag: 'g-espejo',
      };
    },
  });

  // ======================= 4. SÍLABAS TRABADAS =======================
  const TR_L = ['pl', 'bl', 'cl', 'fl', 'gl'], TR_R = ['pr', 'br', 'cr', 'dr', 'fr', 'gr', 'tr'];
  GA.skill({
    id: 'gtrb', area: AREA, title: 'Sílabas trabadas', icon: '🔗', desc: 'pla, bra, tre, clo… dos consonantes juntas que se leen de un jalón.',
    levels: ['Trabadas con l', 'Trabadas con r', 'Palabras trabadas', 'Palabras inventadas', 'Oraciones con trabadas'],
    lessons: {
      1: [{ say: 'En las trabadas hay dos consonantes pegaditas antes de la vocal. Se leen juntas, rapidito: p, l, a: pla. ¡No te comas la l!', html: '<div class="lx-syls">p + l + a = pla</div><div class="lx-ex">🍽️ plato</div>' }],
      2: [{ say: 'También hay trabadas con erre: b, r, a: bra. t, r, e: tre. Cuidado: no es bar ni tar, ¡la erre va pegada a la primera letra!', html: '<div class="lx-syls">b + r + a = bra</div><div class="lx-ex">🧙 bruja</div>' }],
    },
    make(L, ctx) {
      if (L <= 2) {
        let cl, v;
        do { cl = GA.pick(L === 1 ? TR_L : TR_R); v = GA.pick([...VOW]); } while (!GA.syl.anchor(cl + v));
        const syl = cl + v;
        const opts = uniq([syl, cl[0] + v + cl[1], cl[0] + v, cl[0] + v + cl[1] + v], 3);
        if (canHear() && Math.random() < 0.4) {
          return {
            text: 'Escucha y toca la sílaba', say: `Escucha y toca la sílaba. ${GA.syl.phrase(syl)}`,
            render(stage, api) { stage.append(GA.syl.btn(syl), ui.answerChoices(GA.shuffle(opts).map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api)); },
            hint: 'Las dos consonantes van juntas al principio.', explain: { text: `Era “${syl}”.` }, tag: 'g-trabadas',
          };
        }
        return {
          text: 'Junta los sonidos', say: 'Junta los sonidos y escoge la sílaba trabada.',
          render(stage, api) {
            stage.append(h('div', { class: 'lx-blend' }, h('span', { class: 'lx-tile' }, cl[0]), h('span', { class: 'plus' }, '+'), h('span', { class: 'lx-tile' }, cl[1]), h('span', { class: 'plus' }, '+'), h('span', { class: 'lx-tile v' }, v), h('span', { class: 'plus' }, '='), h('span', { class: 'lx-tile q' }, '?')));
            stage.append(ui.answerChoices(GA.shuffle(opts).map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api, { after: (o) => { if (o.ok) { const q = stage.querySelector('.lx-tile.q'); q.textContent = syl; q.classList.add('ok'); GA.syl.say(syl); } } }));
          },
          hint: `Lee ${cl[0]} y ${cl[1]} pegaditas, y luego la ${v}.`,
          explain: { text: `${cl[0]} + ${cl[1]} + ${v} = “${syl}”.` },
          tag: 'g-trabadas',
        };
      }
      if (L === 4) {
        const syls = pseudo(GA.rand(2, 3), () => GA.pick([...TR_L, ...TR_R]) + GA.pick([...VOW]));
        const w = syls.join('');
        const vars = uniq([...trabVariants(w), ...pseudoVariants(syls)], 2);
        const hear = canHear();
        return {
          text: 'Lee la palabra inventada', say: 'Destapa la palabra inventada y léela sílaba por sílaba. ¡Ojo con la trabada!',
          render(stage, api) {
            const box = h('div', { class: 'g-after' });
            stage.append(syllableTiles(syls, () => {
              if (hear) box.append(soundChoices(GA.shuffle([{ say: w, ok: true }, ...vars.map((v) => ({ say: v }))]), api));
              else { stage.querySelector('.g-tiles').style.visibility = 'hidden'; box.append(h('p', { class: 'muted' }, '¿Cuál era la palabra?'), ui.answerChoices(GA.shuffle([w, ...vars]).map((x) => ({ label: x, ok: x === w, cls: 'txt lx-opt' })), api)); }
            }), box);
          },
          hint: `Lee despacito: ${syls.join(' - ')}.`,
          explain: { text: `Decía “${w}”: ${syls.join(' - ')}.` },
          tag: 'g-trabadas',
        };
      }
      if (L === 3) {
        const w = GA.fresh(ctx, Y.TRAB, (x) => x.w);
        const vars = GA.sample(trabVariants(w.w), 2);
        return {
          text: '¿Cuál está bien escrita?', say: 'Mira el dibujo y toca la palabra bien escrita.',
          render(stage, api) {
            stage.append(h('div', { class: 'big-pic' }, w.e));
            stage.append(ui.answerChoices(GA.shuffle([w.w, ...vars]).map((x) => ({ label: x, ok: x === w.w, cls: 'txt lx-opt' })), api, { after: (o) => o.ok && GA.say(w.w) }));
          },
          hint: `Busca la trabada: ${w.s.join(' - ')}.`,
          explain: { text: `Se escribe “${w.w}”: ${w.s.join(' - ')}.` },
          tag: 'g-trabadas',
        };
      }
      const [s, word, pic] = GA.fresh(ctx, Y.TRAB_SENTS, (x) => x[0]);
      const opts = uniq([word, ...trabVariants(word)], 3);
      return {
        text: 'Completa la oración', say: 'Mira el dibujo, lee la oración y escoge la palabra bien escrita.',
        render(stage, api) {
          const card = big(s.replace(word, '____'), 'lx-sent');
          stage.append(h('div', { class: 'big-pic' }, pic), card);
          stage.append(ui.answerChoices(GA.shuffle(opts).map((x) => ({ label: x, ok: x === word, cls: 'txt lx-opt' })), api, { after: (o) => { if (o.ok) { card.textContent = s; GA.say(s); } } }));
        },
        hint: 'Fíjate que la l o la r vaya pegada a la primera consonante.',
        explain: { text: `“${s}”` },
        tag: 'g-trabadas',
      };
    },
  });

  // ======================= 5. TREN DE SÍLABAS (automatización) =======================
  const DIRECT = GA.LECTOR.GROUPS.slice(0, 4).flatMap((g) => g.syl);
  const BDP = ['ba', 'be', 'bi', 'bo', 'bu', 'da', 'de', 'di', 'do', 'du', 'pa', 'pe', 'pi', 'po', 'pu'];
  const INV = [['al', 'la'], ['el', 'le'], ['es', 'se'], ['os', 'so'], ['as', 'sa'], ['an', 'na'], ['en', 'ne'], ['on', 'no'], ['ar', 'ra'], ['er', 're'], ['or', 'ro'], ['is', 'si'], ['us', 'su'], ['ol', 'lo'], ['em', 'me'], ['un', 'nu'], ['in', 'ni']];
  const TRAIN_S = [0, 13, 13, 12, 12, 8];
  GA.skill({
    id: 'gtren', area: AREA, title: 'Tren de sílabas', icon: '🚂', desc: 'Escucha la sílaba y atrápala antes de que se vaya el tren.',
    levels: ['Sílabas directas', 'ba, da, pa', 'Al derecho y al revés (la, al, se, es)', 'Trabadas', '¡Súper rápido!'],
    lessons: { 1: [{ say: 'Escucha la sílaba y búscala en el tren. ¡Tócala antes de que el tren se vaya! Cada vez lo harás más rápido.', html: '<div class="lx-ex">🔊 ➜ 🚂🚃🚃🚃 ➜ 👆</div>' }] },
    make(L) {
      let target, conf;
      const lvl = L === 5 ? GA.rand(1, 4) : L;
      if (lvl === 1) { target = GA.pick(DIRECT); conf = GA.sample(DIRECT.filter((s) => s !== target), 4); }
      else if (lvl === 2) { target = GA.pick(BDP); conf = GA.sample(BDP.filter((s) => s !== target && (s[1] === target[1] || s[0] === target[0])), 4); }
      else if (lvl === 3) { const p = GA.pick(INV); target = GA.pick(p); conf = [p[0] === target ? p[1] : p[0], ...GA.sample(INV.filter((x) => x !== p).flat(), 3)]; }
      else {
        let cl, v;
        do { cl = GA.pick([...TR_L, ...TR_R]); v = GA.pick([...VOW]); } while (!GA.syl.anchor(cl + v));
        target = cl + v; conf = uniq([cl[0] + v + cl[1], cl[0] + v, cl[1] + v, GA.pick([...TR_L, ...TR_R]) + v].filter((x) => x !== target), 4);
      }
      const cars = GA.shuffle([target, ...conf.slice(0, 4)]);
      const hear = canHear();
      return {
        text: hear ? '¡Atrapa la sílaba!' : '¡Encuentra la sílaba!', say: hear ? 'Atrapa la sílaba.' : 'Encuentra en el tren la misma sílaba del letrero.',
        noAutoRead: hear, // aquí la voz la controla el juego: primero habla y después sale el tren
        render(stage, api) {
          let done = false;
          const track = h('div', { class: 'g-track' });
          const train = h('div', { class: 'g-train' }, h('span', { class: 'g-loco' }, '🚂'), cars.map((s) => {
            const b = h('button', { class: 'g-car', onclick: () => {
              if (done) return;
              GA.sfx.play('tap');
              const r = api.answer(s === target);
              if (s === target) { done = true; train.classList.add('done'); b.classList.add('ok'); }
              else { b.classList.add('no'); if (r === 'done') { done = true; train.classList.add('done'); GA.$$('.g-car', train).forEach((x) => x.textContent === target && x.classList.add('ok')); } }
            } }, s);
            return b;
          }));
          // El tren avanza con JS cuadro por cuadro (no con animación CSS): así se mueve igual en Mac, iPad y Android,
          // aunque el sistema tenga activado "reducir movimiento".
          let t0 = 0;
          const frame = () => {
            if (done || !train.isConnected) return;
            const p = (performance.now() - t0) / (TRAIN_S[L] * 1000);
            const W = track.clientWidth, tw = train.offsetWidth;
            train.style.transform = `translateX(${W - p * (W + tw)}px)`;
            if (p < 1) { requestAnimationFrame(frame); return; }
            GA.sfx.play('bad');
            const r = api.answer(false);
            if (r === 'done') { done = true; train.classList.add('done'); return; }
            start();
          };
          let waited = 0;
          const go = () => {
            if (!train.isConnected || done) return;
            // si la voz sigue hablando, el tren espera un poquito más (máximo 6 s)
            if (window.speechSynthesis && speechSynthesis.speaking && waited < 6000) { waited += 200; setTimeout(go, 200); return; }
            waited = 0; station.style.display = 'none'; t0 = performance.now(); requestAnimationFrame(frame);
          };
          // El tren espera en la estación hasta que la voz termina de decir la sílaba (y medio segundo más)
          const start = (intro) => {
            train.style.transform = '';
            if (!hear) { setTimeout(go, 600); return; }
            station.style.display = '';
            (intro ? GA.say('Atrapa la sílaba.') : Promise.resolve()).then(() => GA.syl.say(target)).then(() => setTimeout(go, 500));
          };
          const station = h('div', { class: 'g-station' }, '🚉 El tren sale cuando termine de hablar…');
          track.append(train);
          stage.append(hear ? GA.syl.btn(target, '🔊 Otra vez', 'btn btn-white lx-ear') : h('div', { class: 'g-sign' }, 'Busca: ', h('b', null, target)), track, station);
          setTimeout(() => start(true), 300);
        },
        hint: lvl === 3 ? MIRROR_TIP : lvl === 2 ? BD_TIP : 'Escucha la primera letra y la vocal.',
        explain: { text: `Era “${target}”.`, html: `<span class="lx-explain">${target}</span>` },
        tag: 'g-tren',
      };
    },
  });

  // ======================= 6. ORACIONES VELOCES (lectura guiada con ritmo) =======================
  const gym = () => { const d = D(); if (!d.gym || typeof d.gym !== 'object') d.gym = { pace: 30, max: 30 }; return d.gym; };
  function pacer(spans, wpm, onEnd) {
    let i = 0, t = null;
    const base = 60000 / wpm;
    const step = () => {
      if (i > 0) { spans[i - 1].classList.remove('pace-now'); spans[i - 1].classList.add('pace-done'); }
      if (i >= spans.length || !spans[0].isConnected) { onEnd(); return; }
      spans[i].classList.add('pace-now');
      const len = spans[i].textContent.replace(/[^\p{L}]/gu, '').length;
      const ms = base * Math.min(1.8, Math.max(0.6, len / 4.5));
      i++;
      t = setTimeout(step, ms);
    };
    step();
    return () => clearTimeout(t);
  }
  GA.skill({
    id: 'gvel', area: AREA, title: 'Oraciones veloces', icon: '⚡', desc: 'Lee siguiendo la luz que marca el ritmo. Empieza despacio y cada vez lees más rápido.',
    levels: ['2 o 3 palabras', '4 o 5 palabras', '6 o 7 palabras', '8 a 10 palabras', 'Oraciones largas', 'Dos oraciones', 'Párrafos'],
    lessons: {
      1: [{ say: 'Vamos a leer con ritmo. Cuando toques empezar, una luz irá pasando por las palabras. Léelas en voz alta siguiendo la luz, sin quedarte atrás.', html: '<div class="lx-syls"><span class="pace-now">El</span> sol.</div>' },
        { say: 'Si lees bien, la luz irá cada vez más rápido. ¡Así tus ojos y tu boca se vuelven veloces!', html: '<div class="lx-ex">🐢 ➜ 🐇 ➜ 🚀</div>' }],
      5: [{ say: 'Ahora las oraciones son largas. Haz una pequeña pausa en las comas y en los puntos, como un buen lector.', html: '<div class="lx-syls">, ⏸️ . ⏹️</div>' }],
    },
    make(L, ctx) {
      const pool = Y.FLU[L];
      const item = GA.fresh(ctx, pool, (x) => x[0]);
      const text = item[0];
      const size = [0, 2.6, 2.3, 2.1, 1.9, 1.7, 1.6, 1.5][L];
      return {
        text: 'Lee con el ritmo', say: 'Toca empezar y lee en voz alta siguiendo la luz.',
        render(stage, api) {
          const g = gym();
          let firstTry = true;
          const words = text.split(/\s+/).map((w) => h('span', { class: 'pw' }, w));
          const card = h('div', { class: 'g-pace-card', style: { fontSize: size + 'rem' } }, words.map((s, i) => [i ? ' ' : null, s]));
          const chip = h('div', { class: 'chip g-pace-chip' }, `🎵 Ritmo: ${g.pace} palabras por minuto`);
          const qBox = h('div', { class: 'lx-q', style: { display: 'none' } });
          let stopper = null;
          const listen = h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); GA.lector.readAlong(words, () => {}); } }, '🐢 Escuchar primero');
          const go = h('button', { class: 'btn btn-big', onclick: () => {
            GA.sfx.play('tap'); go.remove(); listen.remove(); GA.voice.stop();
            stopper = pacer(words, g.pace, ask);
          } }, '▶ ¡Empezar!');
          const again = h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); card.style.display = ''; again.remove(); } }, '👀 Ver otra vez');
          function ask() {
            if (!card.isConnected) return;
            card.style.display = 'none';
            const after = (o, r) => {
              if (!o.ok) { firstTry = false; return; }
              if (api.test) return;
              g.pace = GA.clamp(g.pace + (firstTry ? 3 : -2), 20, 160);
              g.max = Math.max(g.max || 0, g.pace);
              GA.store.save();
            };
            if (L <= 4) {
              const others = GA.sample(pool.filter((x) => x[1] !== item[1]), 2);
              qBox.append(h('div', { class: 'word-problem' }, '¿Qué dibujo va con lo que leíste?'), again,
                ui.answerChoices(GA.shuffle([item, ...others]).map((x) => ({ label: x[1], ok: x === item, cls: 'huge' })), api, { after }));
            } else {
              qBox.append(h('div', { class: 'word-problem', style: { fontSize: '1.4rem' } }, item[1], ' ', ui.speakBtn(item[1])), again,
                ui.answerChoices(GA.shuffle(item.slice(2).map((t, i) => ({ label: t, ok: i === 0, cls: 'wide' }))), api, { after }));
            }
            qBox.style.display = 'grid';
            api.setText(L <= 4 ? '¿Qué dibujo va?' : item[1]);
          }
          stage.append(chip, card, h('div', { class: 'actions', style: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' } }, listen, go), qBox);
          stage._stop = () => stopper && stopper();
        },
        hint: 'Toca 👀 Ver otra vez y lee con calma.',
        explain: { text: `Decía: “${text}”` },
        tag: 'g-fluidez',
      };
    },
  });
})();
