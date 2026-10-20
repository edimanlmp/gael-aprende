/* Gael Aprende — Lectura y Lenguaje
   Ruta basada en la evidencia sobre lectura inicial: conciencia fonológica (sonidos, sílabas, rimas)
   → principio alfabético (letras) → decodificación (leer palabras y frases) → comprensión (cuentos). */
(function () {
  'use strict';
  const { h } = GA;
  const ui = GA.ui;

  const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const LNAME = { a: 'a', b: 'be', c: 'ce', d: 'de', e: 'e', f: 'efe', g: 'ge', h: 'hache', i: 'i', j: 'jota', k: 'ka', l: 'ele', m: 'eme', n: 'ene', ñ: 'eñe', o: 'o', p: 'pe', q: 'cu', r: 'erre', s: 'ese', t: 'te', u: 'u', v: 'uve', w: 'doble uve', x: 'equis', y: 'ye', z: 'zeta' };
  const CONFUSE = [['b', 'v'], ['s', 'z', 'c', 'x'], ['c', 'k', 'q'], ['g', 'j'], ['y', 'll', 'i']];
  const confusable = (a, b) => a === b || CONFUSE.some((g) => g.includes(a) && g.includes(b));
  const VOW = ['a', 'e', 'i', 'o', 'u'];
  const firstSound = (w) => {
    const p = plain(w.w);
    if (/^(h|qu|ch|ll|gu[ei]|ce|ci|ge|gi|k|y|w|x)/.test(p)) return null; // evitar casos ambiguos para principiantes
    return p[0];
  };
  const picBig = (w) => h('div', { class: 'big-pic' }, w.e);
  const sayWord = (w) => ui.speakBtn(w.w);

  // ======================= SONIDOS Y LETRAS =======================
  GA.skill({
    id: 'sonidos', area: 'lengua', title: '¿Con qué suena?', icon: '👂', desc: 'Escucha las palabras y descubre con qué letra empiezan y terminan.',
    levels: ['Vocales', 'Primer sonido', 'Último sonido', 'Letra y dibujo'],
    lessons: {
      1: [{ say: 'Las vocales son A, E, I, O, U. ¡Están en todas las palabras! Abeja empieza con A. Oso empieza con O.', html: '<span class="letter-big" style="font-size:4rem;color:#FF7433">A E I O U</span>' }],
      2: [{ say: 'Escucha bien el primer sonido: mmmmano. ¡Empieza con eme!', html: '✋ <span class="letter-big" style="font-size:4rem;color:#FF7433">M</span>' }],
    },
    make(L, ctx) {
      if (L === 1) {
        const w = GA.fresh(ctx, GA.WORDS.filter((x) => VOW.includes(plain(x.w)[0])), (x) => x.w);
        const v = plain(w.w)[0];
        const opts = GA.shuffle([v, ...GA.sample(VOW.filter((x) => x !== v), 2)]);
        return {
          text: `¿Con qué vocal empieza ${w.e}?`, say: `¿Con qué vocal empieza ${w.w}?`,
          render(stage, api) { stage.append(h('div', { class: 'row' }, picBig(w), sayWord(w)), ui.answerChoices(opts.map((l) => ({ label: l.toUpperCase(), ok: l === v, say: l, cls: 'huge' })), api, { speakOnTap: true })); },
          hint: `Di la palabra despacito: ${w.w}…`,
          explain: { text: `${w.w} empieza con ${v.toUpperCase()}.`, html: `<span style="font-size:2.4rem">${w.e} <b style="color:#FF7433">${w.w[0].toUpperCase()}</b>${w.w.slice(1)}</span>` },
          tag: 'vocales',
        };
      }
      if (L === 2 || L === 4) {
        const pool = GA.WORDS.filter((x) => { const f = firstSound(x); return f && !VOW.includes(f); });
        const w = GA.fresh(ctx, pool, (x) => x.w);
        const f = firstSound(w);
        if (L === 4) {
          const others = GA.sample(pool.filter((x) => !confusable(firstSound(x), f)), 2);
          return {
            text: `¿Qué dibujo empieza con la letra ${f.toUpperCase()}?`, say: `¿Qué dibujo empieza con la letra ${LNAME[f]}?`,
            render(stage, api) { stage.append(h('div', { class: 'letter-big', style: { fontSize: '6rem', color: 'var(--lang)' } }, f.toUpperCase() + f), ui.answerChoices(GA.shuffle([w, ...others]).map((x) => ({ label: x.e, ok: x === w, say: x.w, cls: 'huge' })), api, { speakOnTap: true })); },
            hint: 'Toca cada dibujo para escuchar su nombre y fíjate en el primer sonido.',
            explain: { text: `${w.w} empieza con ${f.toUpperCase()}.`, html: `<span style="font-size:2.4rem">${w.e} <b style="color:#FF7433">${w.w[0].toUpperCase()}</b>${w.w.slice(1)}</span>` },
            tag: 'letra-sonido',
          };
        }
        const cons = Object.keys(LNAME).filter((l) => !VOW.includes(l) && !confusable(l, f) && !['h', 'k', 'q', 'w', 'x', 'y', 'ñ'].includes(l));
        const opts = GA.shuffle([f, ...GA.sample(cons, 2)]);
        return {
          text: `¿Con qué letra empieza ${w.e}?`, say: `¿Con qué letra empieza ${w.w}?`,
          render(stage, api) { stage.append(h('div', { class: 'row' }, picBig(w), sayWord(w)), ui.answerChoices(opts.map((l) => ({ label: l.toUpperCase(), ok: l === f, say: LNAME[l], cls: 'huge' })), api, { speakOnTap: true })); },
          hint: `Alarga el primer sonido: ${w.w[0]}${w.w[0]}${w.w[0]}${w.w.slice(1)}.`,
          explain: { text: `${w.w} empieza con ${f.toUpperCase()} (${LNAME[f]}).`, html: `<span style="font-size:2.4rem">${w.e} <b style="color:#FF7433">${w.w[0].toUpperCase()}</b>${w.w.slice(1)}</span>` },
          tag: 'primer-sonido',
        };
      }
      const w = GA.fresh(ctx, GA.WORDS.filter((x) => /[aeioulnrsdzj]$/.test(plain(x.w))), (x) => x.w);
      const last = plain(w.w).slice(-1);
      const opts = GA.shuffle([last, ...GA.sample(['a', 'e', 'i', 'o', 'u', 'l', 'n', 'r', 's'].filter((x) => x !== last && !confusable(x, last)), 2)]);
      return {
        text: `¿Con qué letra TERMINA ${w.e}?`, say: `¿Con qué letra termina ${w.w}?`,
        render(stage, api) { stage.append(h('div', { class: 'row' }, picBig(w), sayWord(w)), ui.answerChoices(opts.map((l) => ({ label: l.toUpperCase(), ok: l === last, say: LNAME[l], cls: 'huge' })), api, { speakOnTap: true })); },
        hint: 'Escucha el final de la palabra.',
        explain: { text: `${w.w} termina con ${last.toUpperCase()}.`, html: `<span style="font-size:2.4rem">${w.e} ${w.w.slice(0, -1)}<b style="color:#FF7433">${w.w.slice(-1)}</b></span>` },
        tag: 'ultimo-sonido',
      };
    },
  });

  // ======================= MEMORAMA DE LETRAS =======================
  GA.skill({
    id: 'letras', area: 'lengua', title: 'Memorama de letras', icon: '🔤', desc: 'Encuentra cada mayúscula con su minúscula.',
    levels: ['Vocales', 'Letras M P S L T D', 'Más letras', 'Letras espejo: b d p q'],
    lessons: {
      1: [{ say: 'Cada letra tiene dos formas: mayúscula, la grande, y minúscula, la pequeña. A grande y a pequeña son la misma letra.', html: '<span class="letter-big" style="font-size:4rem">A a · E e</span>' }],
      4: [{ say: 'Cuidado con las letras espejo: b, d, p y q se parecen, pero miran a lados distintos. La b tiene la panza a la derecha.', html: '<span class="letter-big" style="font-size:4rem">b d p q</span>' }],
    },
    make(L, ctx) {
      const sets = [null, ['a', 'e', 'i', 'o', 'u'], ['m', 'p', 's', 'l', 't', 'd'], ['b', 'n', 'r', 'f', 'g', 'c', 'j', 'v', 'z', 'ñ'], ['b', 'd', 'p', 'q', 'n', 'u']];
      const n = [null, 4, 4, 5, 6][L];
      const letters = GA.sample(sets[L], n);
      GA.fresh(ctx, [letters.sort().join()]);
      return {
        text: 'Voltea dos cartas y encuentra la mayúscula con su minúscula', say: 'Memorama. Voltea dos cartas. Busca cada letra mayúscula con su minúscula.',
        render(stage, api) {
          const cards = GA.shuffle(letters.flatMap((l) => [{ l, t: l.toUpperCase() }, { l, t: l }]));
          let up = [], found = 0, misses = 0, busy = false;
          const cols = cards.length <= 8 ? 4 : cards.length <= 10 ? 5 : 4;
          const grid = h('div', { class: 'memo', style: { gridTemplateColumns: `repeat(${cols}, auto)` } });
          cards.forEach((c) => {
            const el = h('button', { class: 'card', 'aria-label': 'carta' }, h('div', { class: 'face back' }, '⭐'), h('div', { class: 'face front' }, c.t));
            el._c = c;
            el.addEventListener('click', () => {
              if (busy || el.classList.contains('up')) return;
              el.classList.add('up'); GA.sfx.play('flip'); GA.say(LNAME[c.l]);
              up.push(el);
              if (up.length === 2) {
                busy = true;
                const [a, b] = up;
                if (a._c.l === b._c.l) {
                  setTimeout(() => { a.classList.add('done'); b.classList.add('done'); GA.sfx.play('ok'); found++; up = []; busy = false; if (found === letters.length) { if (misses > letters.length + 2) api.hintUsed(); api.answer(true); } }, 450);
                } else {
                  misses++;
                  setTimeout(() => { a.classList.remove('up'); b.classList.remove('up'); up = []; busy = false; }, 1000);
                }
              }
            });
            grid.append(el);
          });
          stage.append(grid);
        },
        explain: { text: 'Mayúscula y minúscula son la misma letra.' },
        fact: `Encontraste: ${letters.map((l) => l.toUpperCase() + l).join(', ')}.`,
        tag: L === 4 ? 'letras-espejo' : 'mayus-minus',
      };
    },
  });

  // ======================= SÍLABAS =======================
  const CLUSTER = /(br|bl|cr|cl|dr|fr|fl|gr|gl|pr|pl|tr)/;
  const isSimple = (w) => w.s.every((x) => /^[^aeiouáéíóú]?[aeiouáéíóú]$/.test(x) || /^(ll|rr|qu|ch)[aeiouáéíóú]$/.test(x));
  GA.skill({
    id: 'silabas', area: 'lengua', title: 'Arma la palabra', icon: '🧩', desc: 'Junta las sílabas en orden para formar palabras.',
    levels: ['2 sílabas', '3 sílabas', 'Con sílabas extra', 'Sílabas trabadas'], prereq: [['sonidos', 1]],
    lessons: {
      1: [{ say: 'Las palabras se forman con sílabas, como piezas de lego. Ga, to: ¡gato!', html: '🐱 <span class="tile">ga</span><span class="tile">to</span>' }],
      4: [{ say: 'Algunas sílabas tienen dos consonantes juntas: fre, pla, bru, gri. Se llaman trabadas. ¡Dilas rápido!', html: '🍓 <span class="tile">fre</span><span class="tile">sa</span>' }],
    },
    make(L, ctx) {
      let pool;
      if (L === 1) pool = GA.WORDS.filter((w) => w.s.length === 2 && isSimple(w));
      else if (L === 2) pool = GA.WORDS.filter((w) => w.s.length === 3 && isSimple(w));
      else if (L === 3) pool = GA.WORDS.filter((w) => w.s.length >= 2 && w.s.length <= 4 && !CLUSTER.test(w.w));
      else pool = GA.WORDS.filter((w) => w.s.length >= 2 && CLUSTER.test(w.w));
      const w = GA.fresh(ctx, pool, (x) => x.w);
      const extra = L >= 3 ? GA.sample([...new Set(GA.WORDS.flatMap((x) => x.s))].filter((s) => !w.s.includes(s)), 2) : [];
      return {
        text: `Arma la palabra: ${w.e}`, say: `Ordena las sílabas para formar: ${w.w}.`,
        render(stage, api) {
          stage.append(h('div', { class: 'row' }, picBig(w), sayWord(w)));
          const sl = ui.slots({
            n: w.s.length, tiles: GA.shuffle([...w.s.map((s, i) => ({ label: s, value: s + '#' + i, say: s })), ...extra.map((s) => ({ label: s, value: s, say: s }))]),
            onFull(vals, sa) {
              const okArr = vals.map((v, i) => v && v.split('#')[0] === w.s[i]);
              const ok = okArr.every(Boolean);
              sa.mark(okArr);
              const r = api.answer(ok);
              if (!ok && r === 'retry') sa.returnWrong(okArr);
              if (ok || r === 'done') { sa.solve(w.s.map((s, i) => s + '#' + i)); sa.lock(); GA.say(w.w); }
            },
          });
          stage.append(sl.el);
        },
        hint: `Di la palabra aplaudiendo: ${w.s.join(' - ')}. ¿Qué pedazo suena primero?`,
        explain: { text: `${w.w} = ${w.s.join(' + ')}`, html: `<span style="font-size:2rem">${w.e} ${w.s.map((s) => `<span class="tile" style="height:50px;min-width:50px;font-size:1.4rem">${s}</span>`).join(' ')}</span>` },
        tag: L === 4 ? 'silabas-trabadas' : 'silabas',
      };
    },
  });

  // ======================= DELETREAR =======================
  GA.skill({
    id: 'palabras', area: 'lengua', title: 'Escribe la palabra', icon: '✏️', desc: 'Ordena las letras para escribir palabras. ¡Y luego, dictado!',
    levels: ['3 letras', '4 letras', '5 o más letras', 'Dictado mágico'], prereq: [['silabas', 1]],
    lessons: {
      1: [{ say: 'Cada sonido de la palabra se escribe con una letra. Sol: ese, o, ele.', html: '☀️ <span class="tile">s</span><span class="tile">o</span><span class="tile">l</span>' }],
      4: [{ say: 'En el dictado no hay dibujo: escucha con atención la palabra y escríbela. Puedes oírla las veces que quieras.', html: '🔊 ➜ ✏️' }],
    },
    make(L, ctx) {
      const list = L === 1 ? GA.SPELL[3] : L === 2 ? GA.SPELL[4] : L === 3 ? GA.SPELL[5] : [...GA.SPELL[4], ...GA.SPELL[5]];
      const word = GA.fresh(ctx, list);
      const w = GA.wordByName(word) || { w: word, e: '❓' };
      const letters = word.split('');
      const extra = L >= 3 ? GA.sample('abcdefgilmnoprstu'.split('').filter((c) => !letters.includes(c)), 2) : [];
      const dict = L === 4;
      return {
        text: dict ? 'Dictado: escucha y escribe la palabra 🔊' : `Escribe: ${w.e}`, say: dict ? `Escribe la palabra: ${word}` : `Ordena las letras para escribir ${word}.`,
        render(stage, api) {
          stage.append(h('div', { class: 'row' }, dict ? h('button', { class: 'btn btn-big', onclick: () => GA.say(word, { rate: 0.75 }) }, '🔊 Escuchar') : picBig(w), dict ? null : sayWord(w)));
          const sl = ui.slots({
            n: letters.length, tiles: GA.shuffle([...letters, ...extra].map((c) => ({ label: c, value: c, say: LNAME[plain(c)] || c }))),
            onFull(vals, sa) {
              const okArr = vals.map((v, i) => v === letters[i]);
              const ok = okArr.every(Boolean);
              sa.mark(okArr);
              const r = api.answer(ok);
              if (!ok && r === 'retry') sa.returnWrong(okArr);
              if (ok || r === 'done') { sa.solve(letters); sa.lock(); }
            },
          });
          stage.append(sl.el);
        },
        hint: `Dila muy despacito, sonido por sonido: ${letters.join('… ')}`,
        explain: { text: `Se escribe: ${word.toUpperCase()} (${letters.map((c) => LNAME[plain(c)] || c).join(', ')}).`, html: `<span style="font-size:2.2rem">${dict ? '' : w.e} <b>${word}</b></span>` },
        tag: dict ? 'dictado' : 'deletrear',
      };
    },
  });

  // ======================= PALMADAS (contar sílabas) =======================
  GA.skill({
    id: 'palmadas', area: 'lengua', title: 'El tambor de sílabas', icon: '🥁', desc: 'Toca el tambor una vez por cada sílaba.',
    levels: ['1 y 2 sílabas', '3 sílabas', '4 o más sílabas'],
    lessons: { 1: [{ say: 'Vamos a tocar el tambor por cada golpe de voz. Ga… to: dos golpes. Sol: un golpe.', html: '🐱 🥁🥁 · ☀️ 🥁' }] },
    make(L, ctx) {
      const pool = GA.WORDS.filter((w) => (L === 1 ? w.s.length <= 2 : L === 2 ? w.s.length === 3 || Math.random() < 0.2 : w.s.length >= 4 || Math.random() < 0.15));
      const w = GA.fresh(ctx, pool, (x) => x.w);
      const n = w.s.length;
      return {
        text: `¿Cuántas sílabas tiene ${w.e}? ¡Toca el tambor!`, say: `Di ${w.w} y toca el tambor una vez por cada sílaba. Luego toca listo.`,
        render(stage, api) {
          let c = 0;
          const claps = h('div', { class: 'claps' });
          const drum = h('button', { class: 'drum', 'aria-label': 'Tambor', onclick: () => { if (c >= 8) return; c++; GA.sfx.play('drum'); claps.append(h('span', null, '👏')); } }, '🥁');
          stage.append(h('div', { class: 'row' }, picBig(w), sayWord(w)), drum, claps, h('div', { class: 'actions' },
            h('button', { class: 'btn btn-white', onclick: () => { c = 0; claps.innerHTML = ''; } }, '↺ Otra vez'),
            h('button', { class: 'btn btn-ok', onclick: () => { if (!c) return; const r = api.answer(c === n); if (r === 'retry') { c = 0; claps.innerHTML = ''; } } }, '¡Listo!')));
        },
        hint: `Aplaude mientras dices ${w.w} muy despacio.`,
        explain: { text: `${w.w}: ${w.s.join(' - ')}. ¡${n} ${n === 1 ? 'sílaba' : 'sílabas'}!`, html: `<span style="font-size:2rem">${w.s.map((s) => `<span class="tile" style="height:50px;min-width:50px;font-size:1.4rem">${s}</span>`).join(' ')} ${'👏'.repeat(n)}</span>` },
        say2: w.s.join(', '),
        tag: 'contar-silabas',
      };
    },
  });

  // ======================= RIMAS =======================
  const R = () => GA.RHYMES.map((g) => GA.findWords(g));
  GA.skill({
    id: 'rimas', area: 'lengua', title: 'Rimas divertidas', icon: '🎵', desc: 'Encuentra palabras que suenan igual al final.',
    levels: ['¿Riman?', 'Busca la rima', 'La que no rima', 'Completa el verso'], prereq: [['sonidos', 1]],
    lessons: { 1: [{ say: 'Dos palabras riman cuando suenan igual al final. Gato y pato: ¡ato, ato! Riman.', html: '🐱 🦆 = ato' }] },
    make(L, ctx) {
      const groups = R();
      if (L === 1) {
        const yes = Math.random() < 0.5;
        const g = GA.pick(groups);
        const [a, b] = yes ? GA.sample(g, 2) : [GA.pick(g), GA.pick(GA.pick(groups.filter((x) => x !== g)))];
        GA.fresh(ctx, [a.w, b.w]);
        return {
          text: `¿Riman ${a.e} y ${b.e}?`, say: `¿Riman ${a.w} y ${b.w}?`,
          render(stage, api) { stage.append(h('div', { class: 'row' }, h('div', { class: 'big-pic' }, a.e), h('div', { class: 'big-pic' }, b.e)), h('div', { class: 'row' }, ui.speakBtn(`${a.w}… ${b.w}`)), ui.answerChoices([{ label: '👍 Sí riman', ok: yes, cls: 'txt' }, { label: '👎 No riman', ok: !yes, cls: 'txt' }], api)); },
          hint: 'Escucha sólo el final de cada palabra.',
          explain: { text: yes ? `${a.w} y ${b.w} terminan igual: ¡riman!` : `${a.w} y ${b.w} no terminan igual, no riman.` },
          tag: 'rimas',
        };
      }
      if (L === 2 || L === 4) {
        let target, ans, verse;
        if (L === 4) { verse = GA.fresh(ctx, GA.VERSES, (x) => x.t); ans = GA.wordByName(verse.a); }
        else { const g = GA.pick(groups); [target, ans] = GA.sample(g, 2); GA.fresh(ctx, [target.w]); }
        const g = groups.find((x) => x.includes(ans));
        const others = GA.sample(GA.WORDS.filter((x) => !g.includes(x) && GA.RHYMES.flat().includes(x.w)), 2);
        return {
          text: L === 4 ? verse.t : `¿Qué rima con ${target.e}?`, say: L === 4 ? `Completa el verso: ${verse.t}` : `¿Qué palabra rima con ${target.w}?`,
          render(stage, api) {
            if (L === 2) stage.append(h('div', { class: 'row' }, h('div', { class: 'big-pic' }, target.e), sayWord(target)));
            else stage.append(h('div', { class: 'word-problem', style: { fontSize: '1.7rem' } }, verse.t));
            stage.append(ui.answerChoices(GA.shuffle([ans, ...others]).map((x) => ({ label: x.e, ok: x === ans, say: x.w, cls: 'huge' })), api, { speakOnTap: true }));
          },
          hint: 'Toca cada dibujo para escuchar su nombre. ¿Cuál termina igual?',
          explain: { text: L === 4 ? verse.t.replace('___', ans.w) : `${target.w} y ${ans.w} riman.` },
          tag: 'rimas',
        };
      }
      const g = GA.pick(groups.filter((x) => x.length >= 3));
      const three = GA.sample(g, 3), odd = GA.pick(GA.WORDS.filter((x) => !g.includes(x) && x.s.length >= 2));
      GA.fresh(ctx, [odd.w]);
      return {
        text: '¿Cuál NO rima con las demás?', say: '¿Cuál palabra no rima con las demás? Toca cada dibujo para escucharlo.',
        render(stage, api) { stage.append(ui.answerChoices(GA.shuffle([...three, odd]).map((x) => ({ label: x.e, ok: x === odd, say: x.w, cls: 'huge' })), api, { speakOnTap: true })); },
        hint: 'Dilas en voz alta, una por una.',
        explain: { text: `${three.map((x) => x.w).join(', ')} riman. ${odd.w} no.` },
        tag: 'rimas',
      };
    },
  });

  // ======================= LEO Y DESCUBRO =======================
  const NOUNS = [['gato', 'gatos', '🐱', 'm'], ['pez', 'peces', '🐟', 'm'], ['perro', 'perros', '🐶', 'm'], ['flor', 'flores', '🌸', 'f'], ['estrella', 'estrellas', '⭐', 'f'], ['pato', 'patos', '🦆', 'm'], ['globo', 'globos', '🎈', 'm'], ['manzana', 'manzanas', '🍎', 'f'], ['casa', 'casas', '🏠', 'f'], ['luna', 'lunas', '🌙', 'f']];
  const NUMW = ['', 'un', 'dos', 'tres', 'cuatro'];
  const sim = (a, b) => { let s = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] === b[i]) s++; return s - Math.abs(a.length - b.length); };
  GA.skill({
    id: 'leer', area: 'lengua', title: 'Leo y descubro', icon: '📖', desc: 'Lee palabras y frases y encuentra su dibujo.',
    levels: ['Palabras cortas', 'Palabras largas', 'Palabras parecidas', 'Frases'], prereq: [['silabas', 2]],
    lessons: { 1: [{ say: 'Para leer, juntamos los sonidos de las sílabas. Me… sa. ¡Mesa! Lee despacito y luego más rápido.', html: '<span class="big-word" style="font-size:3rem">lu-na</span> ➜ 🌙' }] },
    make(L, ctx) {
      if (L === 4) {
        const nn = GA.fresh(ctx, NOUNS, (x) => x[0]);
        const k = GA.rand(1, 4);
        const art = k === 1 ? (nn[3] === 'f' ? 'una' : 'un') : NUMW[k];
        const phrase = `${art} ${k === 1 ? nn[0] : nn[1]}`;
        const other = GA.pick(NOUNS.filter((x) => x !== nn));
        const k2 = k === 1 ? 2 : k - 1;
        const opts = GA.shuffle([[nn[2], k, true], [nn[2], k2 === k ? k + 1 : k2, false], [other[2], k, false]]);
        return {
          text: 'Lee la frase y toca el dibujo', say: 'Lee la frase en silencio y toca el dibujo correcto.',
          render(stage, api) {
            stage.append(h('div', { class: 'big-word' }, phrase), h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); GA.say(phrase); } }, '🔊 Ayuda'));
            stage.append(ui.answerChoices(opts.map(([e, c, ok]) => ({ html: `<span style="font-size:2.6rem;line-height:1.1">${e.repeat(c)}</span>`, ok })), api, { cls: 'txt' }));
          },
          hint: 'Lee las dos palabras: ¿cuántos son y qué son?',
          explain: { text: `Dice “${phrase}”.`, html: `<span style="font-size:2rem">${nn[2].repeat(k)}</span>` },
          tag: 'leer-frases',
        };
      }
      let pool;
      if (L === 1) pool = GA.WORDS.filter((w) => w.s.length <= 2 && w.w.length <= 4 && isSimple(w));
      else if (L === 2) pool = GA.WORDS.filter((w) => w.s.length >= 3);
      else pool = GA.WORDS.filter((w) => w.w.length >= 4 && w.w.length <= 6);
      const w = GA.fresh(ctx, pool, (x) => x.w);
      let others;
      if (L === 3) others = GA.WORDS.filter((x) => x !== w && x.e !== w.e).sort((a, b) => sim(b.w, w.w) - sim(a.w, w.w) || Math.random() - 0.5).slice(0, 2);
      else others = GA.sample(GA.WORDS.filter((x) => x !== w && x.e !== w.e), 2);
      return {
        text: 'Lee la palabra y toca su dibujo', say: 'Lee la palabra y toca su dibujo.',
        render(stage, api) {
          stage.append(h('div', { class: 'big-word' }, w.w), h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); GA.say(w.s.join('… ') + '. ' + w.w); } }, '🔊 Ayuda'));
          stage.append(ui.answerChoices(GA.shuffle([w, ...others]).map((x) => ({ label: x.e, ok: x === w, cls: 'huge' })), api));
          if (L === 3) stage.append(h('div', { class: 'muted' }, '¡Ojo! Las palabras se parecen. Lee todas las letras.'));
        },
        hint: `Lee por sílabas: ${w.s.join(' - ')}.`,
        explain: { text: `Dice “${w.w}”: ${w.s.join(' - ')}.`, html: `<span style="font-size:2.4rem">${w.e}</span>` },
        tag: L === 3 ? 'leer-precision' : 'leer-palabras',
      };
    },
  });

  // ======================= ORDENA LA ORACIÓN =======================
  GA.skill({
    id: 'frases', area: 'lengua', title: 'Ordena la oración', icon: '🧱', desc: 'Pon las palabras en orden para formar oraciones con sentido.',
    levels: ['3 palabras', '4 a 6 palabras', 'Oraciones largas', 'Preguntas y exclamaciones'], prereq: [['leer', 1]],
    lessons: {
      1: [{ say: 'Una oración es un grupo de palabras que dice algo completo. Empieza con mayúscula. El gato duerme.', html: '<span class="big-word" style="font-size:2.4rem">El gato duerme.</span>' }],
      4: [{ say: 'Las preguntas llevan signos de interrogación al principio y al final. Las exclamaciones llevan signos de admiración.', html: '<span class="big-word" style="font-size:2.4rem">¿…?  ¡…!</span>' }],
    },
    make(L, ctx) {
      const s = GA.fresh(ctx, GA.SENTENCES[L], (x) => x.join(' '));
      const words = s.slice(0, -1), pic = s[s.length - 1];
      const sentence = words.join(' ');
      return {
        text: 'Ordena las palabras', say: 'Ordena las palabras para formar la oración. Toca cada palabra para escucharla.',
        render(stage, api) {
          stage.append(h('div', { class: 'big-pic', style: { fontSize: '4.2rem' } }, pic));
          const sl = ui.slots({
            n: words.length, slotCls: 'word', tileCls: 'word', tiles: GA.shuffle(words.map((w, i) => ({ label: w, value: w + '#' + i, say: w.replace(/[¿?¡!.]/g, '') }))),
            onFull(vals, sa) {
              const okArr = vals.map((v, i) => v.split('#')[0] === words[i]);
              const ok = okArr.every(Boolean);
              sa.mark(okArr);
              const r = api.answer(ok);
              if (!ok && r === 'retry') sa.returnWrong(okArr);
              if (ok || r === 'done') { sa.solve(words.map((w, i) => w + '#' + i)); sa.lock(); GA.say(sentence); }
            },
          });
          stage.append(sl.el);
        },
        hint: 'Busca la palabra con mayúscula: va primero. Y la que tiene punto o signo de cierre va al final.',
        explain: { text: `La oración es: “${sentence}”` },
        tag: L === 4 ? 'signos' : 'sintaxis',
      };
    },
  });

  // ======================= CUENTOS =======================
  function storyView(story, onDone) {
    const lines = story.lines.map(([e, t]) => h('div', { class: 'line' }, h('span', { class: 'pic' }, e), h('span', null, t)));
    let reading = false;
    const read = async () => {
      if (reading) return; reading = true;
      for (const l of lines) { if (!l.isConnected) break; l.classList.add('reading'); await GA.say(l.lastChild.textContent); l.classList.remove('reading'); }
      reading = false;
    };
    const el = h('div', { class: 'story' }, h('h3', null, `${story.icon} ${story.title}`), lines,
      h('div', { class: 'actions' }, h('button', { class: 'btn btn-white', onclick: read }, '🔊 Escuchar el cuento'), onDone ? h('button', { class: 'btn btn-ok', onclick: () => { GA.voice.stop(); onDone(); } }, '¡A las preguntas! ➜') : null));
    el.read = read;
    return el;
  }
  GA.skill({
    id: 'cuentos', area: 'lengua', title: 'Cuentos mágicos', icon: '📚', desc: 'Escucha o lee cuentos y responde preguntas para pensar.',
    levels: ['¿Qué pasó?', '¿En qué orden?', '¿Por qué pasó?', 'Palabras y sentimientos'],
    lessons: { 1: [{ say: 'Los buenos lectores ponen atención a quién aparece, qué pasa y cómo termina. ¡Imagina el cuento como una película en tu cabeza!', html: '📖 ➜ 🎬 ➜ 💭' }] },
    make(L, ctx) {
      const kinds = [null, ['q'], ['q', 'o'], ['q', 'o', 'i'], ['o', 'i', 'v']][L];
      ctx.asked = ctx.asked || new Set();
      const avail = (st) => st.qs.filter((q) => kinds.includes(q.k) && !ctx.asked.has(st.id + q.t));
      if (!ctx.story || !avail(ctx.story).length) {
        const cands = GA.STORIES.filter((s) => s !== ctx.story && avail(s).length);
        ctx.story = GA.pick(cands.length ? cands : GA.STORIES);
        ctx.shown = false;
      }
      const st = ctx.story;
      const pool = avail(st).length ? avail(st) : st.qs.filter((q) => kinds.includes(q.k));
      const q = GA.pick(pool.filter((x) => x.k === kinds[kinds.length - 1]).concat(pool));
      ctx.asked.add(st.id + q.t);
      const showStory = !ctx.shown;
      ctx.shown = true;
      return {
        text: showStory ? `Cuento: ${st.title}` : q.t, say: showStory ? `Escucha el cuento: ${st.title}.` : q.t,
        render(stage, api) {
          const qBox = h('div', { style: { display: showStory ? 'none' : 'grid', gap: '16px', justifyItems: 'center', width: '100%' } },
            h('div', { class: 'word-problem', style: { fontSize: '1.6rem' } }, q.t),
            ui.answerChoices(GA.shuffle(q.o.map((o, i) => ({ label: o, ok: i === q.a, cls: 'wide', say: o.replace(/^\S+\s/, '') }))), api, { speakOnTap: true }));
          if (showStory) {
            const sv = storyView(st, () => { sv.remove(); qBox.style.display = 'grid'; api.setText(q.t); GA.say(q.t); });
            stage.append(sv);
            setTimeout(() => sv.read(), 2200);
          } else {
            const toggle = h('button', { class: 'btn btn-white btn-sm', onclick: () => { toggle.replaceWith(storyView(st)); } }, '📖 Ver el cuento');
            stage.append(toggle);
          }
          stage.append(qBox);
        },
        hint: q.k === 'i' ? 'La respuesta no está escrita: piensa como detective con las pistas del cuento.' : 'Puedes volver a ver el cuento.',
        explain: { text: `${q.o[q.a]}. ${q.k === 'i' ? 'Lo sabemos por las pistas del cuento.' : ''}` },
        tag: { q: 'comprension-literal', o: 'secuencia', i: 'inferencia', v: 'vocabulario' }[q.k],
      };
    },
  });

  // ======================= PALABRAS MÁGICAS (vocabulario) =======================
  GA.skill({
    id: 'vocabulario', area: 'lengua', title: 'Palabras mágicas', icon: '🪄', desc: 'Opuestos, familias de palabras y sinónimos.',
    levels: ['Opuestos', '¿Cuál no pertenece?', 'Familias de palabras', 'Sinónimos'],
    lessons: {
      1: [{ say: 'Los opuestos son palabras que significan lo contrario. Grande y pequeño. Día y noche.', html: '🐘 ↔ 🐭 · ☀️ ↔ 🌙' }],
      4: [{ say: 'Los sinónimos son palabras diferentes que significan casi lo mismo. Feliz y contento.', html: '😀 feliz = contento' }],
    },
    make(L, ctx) {
      if (L === 1) {
        const o = GA.fresh(ctx, GA.OPPOSITES, (x) => x[0]);
        const flip = Math.random() < 0.5;
        const [w, e, a, ae] = flip ? [o[2], o[3], o[0], o[1]] : o;
        const others = GA.sample(GA.OPPOSITES.filter((x) => x !== o), 2).map((x) => (Math.random() < 0.5 ? [x[0], x[1]] : [x[2], x[3]]));
        return {
          text: `¿Cuál es lo contrario de “${w}” ${e}?`, say: `¿Cuál es lo contrario de ${w}?`,
          render(stage, api) { stage.append(h('div', { class: 'big-pic' }, e), ui.answerChoices(GA.shuffle([[a, ae], ...others]).map(([x, xe]) => ({ html: `<div style="display:grid;justify-items:center"><span style="font-size:2.6rem">${xe}</span><span style="font-size:1.1rem">${x}</span></div>`, ok: x === a, say: x })), api, { speakOnTap: true })); },
          hint: 'Lo contrario es lo totalmente diferente.',
          explain: { text: `Lo contrario de ${w} es ${a}.`, html: `<span style="font-size:2.2rem">${e} ↔ ${ae}</span>` },
          tag: 'opuestos',
        };
      }
      if (L === 2) {
        const keys = Object.keys(GA.CATEGORIES);
        const k = GA.fresh(ctx, keys);
        const other = GA.pick(keys.filter((x) => x !== k));
        const three = GA.sample(GA.CATEGORIES[k].items, 3), odd = GA.pick(GA.CATEGORIES[other].items);
        return {
          text: '¿Cuál NO pertenece al grupo?', say: '¿Cuál no pertenece al grupo?',
          render(stage, api) { stage.append(ui.answerChoices(GA.shuffle([...three, odd]).map((x) => ({ label: x, ok: x === odd, cls: 'huge' })), api)); },
          hint: '¿Qué tienen en común casi todos?',
          explain: { text: `Los demás son ${GA.CATEGORIES[k].name.toLowerCase()}, pero ${odd} es de ${GA.CATEGORIES[other].name.toLowerCase()}.` },
          tag: 'categorias',
        };
      }
      if (L === 3) {
        const ks = GA.sample(Object.keys(GA.CATEGORIES), 3);
        const items = ks.flatMap((k) => GA.sample(GA.CATEGORIES[k].items, 2).map((e) => ({ html: e, cat: k })));
        return {
          text: 'Lleva cada cosa a su familia', say: 'Lleva cada cosa a su familia de palabras.',
          render(stage, api) {
            const s = ui.sorter({
              items: GA.shuffle(items), bins: ks.map((k) => ({ id: k, title: GA.CATEGORIES[k].name, icon: GA.CATEGORIES[k].icon })),
              onCheck(res, sapi) { sapi.mark(res); const ok = res.every((r) => r.ok); const r = api.answer(ok); if (!ok && r === 'retry') sapi.returnWrong(res); if (ok || r === 'done') sapi.solve(); },
            });
            stage.append(s.el);
          },
          hint: 'Piensa para qué sirve cada cosa.',
          explain: { text: ks.map((k) => `${GA.CATEGORIES[k].name}: ${items.filter((i) => i.cat === k).map((i) => i.html).join(' ')}`).join(' · ') },
          tag: 'categorias',
        };
      }
      const [w, syn, bad] = GA.fresh(ctx, GA.SYNONYMS, (x) => x[0]);
      return {
        text: `¿Qué palabra significa casi lo mismo que “${w}”?`, say: `¿Qué palabra significa casi lo mismo que ${w}?`,
        render(stage, api) { stage.append(ui.answerChoices(GA.shuffle([syn, ...bad]).map((x) => ({ label: x, ok: x === syn, cls: 'txt', say: x })), api, { cls: 'txt', speakOnTap: true })); },
        hint: 'Prueba cambiar la palabra en una oración: “Estoy ___”.',
        explain: { text: `“${w}” y “${syn}” son sinónimos: significan casi lo mismo.` },
        tag: 'sinonimos',
      };
    },
  });
})();
