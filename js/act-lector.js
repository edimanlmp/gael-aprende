/* Gael Aprende — Camino del Lector
   Enseñanza explícita y sistemática de la lectura, como recomienda la investigación (National Reading Panel):
   1) letra-sonido y sílabas en una secuencia ordenada (m p s l → t n d → … → trabadas),
   2) palabras y oraciones decodificables que sólo usan letras ya enseñadas,
   3) reconocimiento automático de palabras (palabras relámpago) para ganar fluidez,
   4) libritos nivelados cada vez más largos: lectura en voz alta, lectura repetida, palabras por minuto y comprensión. */
(function () {
  'use strict';
  const { h } = GA;
  const ui = GA.ui;
  const E = GA.engine;
  const LX = GA.LECTOR;
  const G = LX.GROUPS;
  const D = () => GA.store.data;

  const VOW = 'aeiou', VOW_ACC = 'áéíóú';
  const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const clean = (w) => w.replace(/[^\p{L}\p{N}]/gu, '');
  const units = (syl) => syl.match(/ch|ll|rr|qu|gu(?=[eiéí])|./g);
  const allWords = (upTo) => G.slice(0, upTo).flatMap((g) => g.words);
  const big = (txt, cls = '') => h('div', { class: 'big-word lx-word ' + cls }, txt);
  const helpBtn = (api, text, lang) => h('button', { class: 'btn btn-white btn-sm', onclick: () => { api.hintUsed(); GA.say(text, { rate: 0.75, lang }); } }, '🔊 Ayuda');

  // Cambia la vocal de una sílaba (respetando el acento) para crear una opción parecida
  function swapVowel(syl) {
    const m = [...syl];
    for (let i = m.length - 1; i >= 0; i--) {
      const k = VOW.indexOf(m[i]), ka = VOW_ACC.indexOf(m[i]);
      if (k < 0 && ka < 0) continue;
      if (i > 0 && m[i] === 'u' && /[qg]/.test(m[i - 1])) continue;
      const set = k >= 0 ? VOW : VOW_ACC;
      m[i] = GA.pick([...set].filter((v) => v !== m[i]));
      return m.join('');
    }
    return syl;
  }
  // Sílabas parecidas a una sílaba dada
  function similarSyl(target, pool, n) {
    const out = new Set();
    const pv = target.replace(/[^aeiouáéíóú]/g, '');
    const sameV = GA.shuffle(pool.filter((s) => s !== target && s.replace(/[^aeiou]/g, '') === plain(pv)));
    const rev = units(target).slice().reverse().join('');
    if (rev !== target && n > 2) out.add(rev);
    if (sameV[0]) out.add(sameV[0]);
    let guard = 0;
    while (out.size < n && guard++ < 30) { const s = swapVowel(target); if (s !== target) out.add(s); }
    guard = 0;
    while (out.size < n && guard++ < 30) { const s = GA.pick(pool); if (s !== target) out.add(s); }
    return [...out].slice(0, n);
  }
  // Variantes de una palabra cambiando una sílaba (casi iguales: obligan a leer todas las letras)
  function wordVariants(w, n) {
    const out = new Set();
    const pool = G.flatMap((g) => g.syl);
    let guard = 0;
    while (out.size < n && guard++ < 60) {
      const s = w.s.slice();
      const k = GA.rand(0, s.length - 1);
      s[k] = Math.random() < 0.6 ? swapVowel(s[k]) : (similarSyl(s[k], pool, 1)[0] || swapVowel(s[k]));
      const v = s.join('');
      if (plain(v) !== plain(w.w)) out.add(v);
    }
    return [...out];
  }

  // ======================= 1. SÍLABAS MÁGICAS =======================
  GA.skill({
    id: 'lsil', area: 'lector', title: 'Sílabas mágicas', icon: '🔡', desc: 'Aprende cada letra, cómo suena y cómo se junta con las vocales para formar sílabas.',
    levels: G.map((g) => g.n),
    lessons: Object.fromEntries(G.map((g, i) => [i + 1, g.lesson])),
    make(L, ctx) {
      const g = G[L - 1];
      const pool = G.slice(0, L).flatMap((x) => x.syl);
      // 70% sílabas nuevas, 30% repaso de grupos anteriores
      const src = L > 1 && Math.random() < 0.3 ? G[GA.rand(0, L - 2)] : g;
      const kind = GA.pick(['oye', 'oye', 'completa', 'junta']);
      if (kind === 'completa') {
        const ws = src.words.filter((w) => w.s.some((s) => src.syl.includes(s)));
        if (ws.length) {
          const w = GA.fresh(ctx, ws, (x) => x.w);
          const ks = w.s.map((s, i) => (src.syl.includes(s) ? i : -1)).filter((i) => i >= 0);
          const k = GA.pick(ks), syl = w.s[k];
          const opts = GA.shuffle([syl, ...similarSyl(syl, pool, 2)]);
          return {
            text: '¿Qué sílaba falta?', say: '¿Qué sílaba falta? Mira el dibujo.',
            render(stage, api) {
              stage.append(h('div', { class: 'big-pic' }, w.e),
                h('div', { class: 'lx-blanks' }, w.s.map((s, i) => h('span', { class: 'lx-syl' + (i === k ? ' gap' : '') }, i === k ? '?' : s))),
                helpBtn(api, w.w),
                ui.answerChoices(opts.map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api, {
                  after: (o) => { if (o.ok) { stage.querySelector('.gap').textContent = syl; stage.querySelector('.gap').classList.add('ok'); GA.say(w.w); } },
                }));
            },
            hint: `Di el nombre del dibujo despacito: ${w.s.join('… ')}.`,
            explain: { text: `Es ${w.w}: ${w.s.join(' - ')}. Falta “${syl}”.`, html: `<span class="lx-explain">${w.e} ${w.s.map((s, i) => (i === k ? `<b>${s}</b>` : s)).join('-')}</span>` },
            tag: 'lx-silabas',
          };
        }
      }
      const syl = GA.fresh(ctx, src.syl);
      if (kind === 'junta') {
        const u = units(syl);
        const opts = GA.shuffle([syl, ...similarSyl(syl, pool, 2)]);
        return {
          text: 'Junta los sonidos', say: 'Junta los sonidos y lee la sílaba.',
          render(stage, api) {
            stage.append(h('div', { class: 'lx-blend' }, u.map((x, i) => [i ? h('span', { class: 'plus' }, '+') : null, h('span', { class: 'lx-tile' + (VOW.includes(x) || VOW_ACC.includes(x) ? ' v' : '') }, x)]), h('span', { class: 'plus' }, '='), h('span', { class: 'lx-tile q' }, '?')),
              helpBtn(api, syl),
              ui.answerChoices(opts.map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api, { after: (o) => { if (o.ok) { const q = stage.querySelector('.lx-tile.q'); q.textContent = syl; q.classList.add('ok'); GA.say(syl); } } }));
          },
          hint: 'Di cada sonido y luego júntalos rapidito.',
          explain: { text: `${u.join(' y ')} juntos se leen “${syl}”.` },
          tag: 'lx-silabas',
        };
      }
      const opts = GA.shuffle([syl, ...similarSyl(syl, pool, 3)]);
      return {
        text: 'Escucha y toca la sílaba', say: `Toca la sílaba: ${syl}.`,
        render(stage, api) {
          stage.append(h('button', { class: 'btn btn-big btn-white lx-ear', onclick: () => GA.say(syl, { rate: 0.75 }) }, '🔊 Escuchar otra vez'),
            ui.answerChoices(opts.map((s) => ({ label: s, ok: s === syl, cls: 'lx-opt' })), api));
        },
        hint: 'Escucha con atención la primera letra y la vocal.',
        explain: { text: `Era “${syl}”.`, html: `<span class="lx-explain">${syl}</span>` },
        tag: 'lx-silabas',
      };
    },
  });

  // ======================= 2. LEO PALABRAS =======================
  GA.skill({
    id: 'lpal', area: 'lector', title: 'Leo palabras', icon: '📝', desc: 'Lee palabras hechas sólo con las letras que ya aprendiste.',
    levels: G.map((g) => 'Palabras con ' + g.n.toLowerCase().replace('sílabas ', '')),
    prereq: [['lsil', 2]],
    lessons: { 1: [{ say: 'Para leer una palabra, lee sílaba por sílaba y luego júntalas rapidito: ma… pa… ¡mapa!', html: '<div class="lx-syls">ma · pa ➜ mapa</div><div class="lx-ex">🗺️</div>' }] },
    make(L, ctx) {
      const known = allWords(L);
      const src = L > 1 && Math.random() < 0.3 ? allWords(L - 1) : G[L - 1].words;
      const w = GA.fresh(ctx, src, (x) => x.w);
      if (Math.random() < 0.5) {
        const others = GA.sample(known.filter((x) => x.e !== w.e), 2);
        return {
          text: 'Lee la palabra y toca su dibujo', say: 'Lee la palabra y toca su dibujo.',
          render(stage, api) {
            stage.append(big(w.w), helpBtn(api, w.s.join('… ') + '. ' + w.w));
            stage.append(ui.answerChoices(GA.shuffle([w, ...others]).map((x) => ({ label: x.e, ok: x === w, cls: 'huge' })), api, { after: (o) => o.ok && GA.say(w.w) }));
          },
          hint: `Lee por sílabas: ${w.s.join(' - ')}.`,
          explain: { text: `Dice “${w.w}”: ${w.s.join(' - ')}.`, html: `<span style="font-size:2.4rem">${w.e}</span>` },
          tag: 'lx-palabras',
        };
      }
      const vars = wordVariants(w, 2);
      return {
        text: '¿Cuál palabra es?', say: 'Mira el dibujo y toca la palabra que está bien escrita.',
        render(stage, api) {
          stage.append(h('div', { class: 'big-pic' }, w.e));
          stage.append(ui.answerChoices(GA.shuffle([w.w, ...vars]).map((x) => ({ label: x, ok: x === w.w, cls: 'txt lx-opt' })), api, { after: (o) => o.ok && GA.say(w.w) }));
          stage.append(h('div', { class: 'muted' }, '¡Ojo! Se parecen. Lee todas las letras.'));
        },
        hint: `Di el nombre del dibujo despacito y busca esas sílabas: ${w.s.join(' - ')}.`,
        explain: { text: `Es “${w.w}”: ${w.s.join(' - ')}.` },
        tag: 'lx-precision',
      };
    },
  });

  // ======================= 3. LEO ORACIONES =======================
  GA.skill({
    id: 'lfra', area: 'lector', title: 'Leo oraciones', icon: '💬', desc: 'Lee oraciones completas, entiende lo que dicen y descubre si son verdad o mentira.',
    levels: G.map((g) => 'Oraciones con ' + g.n.toLowerCase().replace('sílabas ', '')),
    prereq: [['lpal', 2]],
    lessons: { 1: [{ say: 'Una oración dice algo completo. Lee cada palabra y luego toda la oración otra vez, de corrido. Imagina lo que dice, como una película en tu cabeza.', html: '<div class="lx-syls" style="font-size:2.2rem">Mi oso es mío.</div><div class="lx-ex">🐻 💭</div>' }] },
    make(L, ctx) {
      const g = G[L - 1];
      const kinds = ['dibujo', 'dibujo', 'completa'];
      if (g.tf.length) kinds.push('verdad', 'verdad');
      const kind = GA.pick(kinds);
      if (kind === 'verdad') {
        const [q, ans] = GA.fresh(ctx, g.tf, (x) => x[0]);
        return {
          text: '¿Sí o no?', say: 'Lee la pregunta y contesta sí o no.',
          render(stage, api) {
            stage.append(big(q, 'lx-sent'), helpBtn(api, q));
            stage.append(ui.answerChoices([{ label: '👍 Sí', ok: ans, cls: 'txt' }, { label: '👎 No', ok: !ans, cls: 'txt' }], api));
          },
          hint: 'Lee despacio cada palabra y piensa: ¿eso pasa de verdad?',
          explain: { text: `${q} ${ans ? 'Sí.' : 'No.'}` },
          tag: 'lx-oraciones',
        };
      }
      const s = GA.fresh(ctx, g.sents, (x) => x[0]);
      if (kind === 'completa') {
        const toks = s[0].split(' ');
        const cand = toks.map((t, i) => [clean(t), i]).filter(([t]) => t.length >= 3 && /^[a-záéíóúñü]+$/.test(t) && !/^(el|la|los|las|una|unos|con|que|muy|hay|por|mis|sus|tus)$/i.test(t));
        const [word, k] = GA.pick(cand);
        const pool = [...new Set(g.sents.flatMap((x) => x[0].split(' ').map(clean)).concat(g.words.map((w) => w.w)))]
          .filter((t) => t.length >= 3 && plain(t) !== plain(word) && /^[a-záéíóúñü]+$/.test(t));
        const opts = GA.shuffle([word, ...GA.sample(pool, 2)]);
        const show = toks.map((t, i) => (i === k ? t.replace(word, '____') : t)).join(' ');
        return {
          text: 'Completa la oración', say: 'Mira el dibujo, lee la oración y escoge la palabra que falta.',
          render(stage, api) {
            const sent = big(show, 'lx-sent');
            stage.append(h('div', { class: 'big-pic' }, s[1]), sent, helpBtn(api, s[0]));
            stage.append(ui.answerChoices(opts.map((o) => ({ label: o, ok: o === word, cls: 'txt lx-opt' })), api, { after: (o) => { if (o.ok) { sent.textContent = s[0]; GA.say(s[0]); } } }));
          },
          hint: 'Lee la oración con cada palabra y piensa cuál tiene sentido con el dibujo.',
          explain: { text: `La oración es: “${s[0]}”` },
          tag: 'lx-oraciones',
        };
      }
      const others = GA.sample(g.sents.filter((x) => x !== s && x[1] !== s[1]), 2);
      return {
        text: 'Lee y toca el dibujo', say: 'Lee la oración y toca el dibujo que va con ella.',
        render(stage, api) {
          stage.append(big(s[0], 'lx-sent'), helpBtn(api, s[0]));
          stage.append(ui.answerChoices(GA.shuffle([s, ...others]).map((x) => ({ label: x[1], ok: x === s, cls: 'huge' })), api, { after: (o) => o.ok && GA.say(s[0]) }));
        },
        hint: 'Lee palabra por palabra. ¿Quién aparece? ¿Qué hace?',
        explain: { text: `Dice: “${s[0]}”`, html: `<span style="font-size:2.4rem">${s[1]}</span>` },
        tag: 'lx-oraciones',
      };
    },
  });

  // ======================= 4. PALABRAS RELÁMPAGO (fluidez) =======================
  const FLASH = [0, 1500, 1300, 1200, 1100, 1700, 750];
  GA.skill({
    id: 'lrel', area: 'lector', title: 'Palabras relámpago', icon: '⚡', desc: 'Las palabras aparecen y desaparecen rapidísimo. ¡Entrena tus ojos de lector!',
    levels: ['Sílabas', 'Palabras de 2 sílabas', 'Palabras largas', 'Palabras gemelas', 'Frases cortas', '¡Súper rápido!'],
    prereq: [['lpal', 3]],
    lessons: { 1: [{ say: 'Los buenos lectores reconocen las palabras de un vistazo. Toca Listo, mira la palabra que aparece un ratito y luego encuéntrala.', html: '<div class="lx-syls">👀 ⚡ ➜ ✅</div>' }] },
    make(L, ctx) {
      const known = Math.max(2, Math.min(G.length, Math.max(E.st('lpal').best, E.st('lsil').best)));
      const ws = allWords(known);
      let target, opts;
      if (L === 1) {
        const pool = G.slice(0, known).flatMap((g) => g.syl);
        target = GA.fresh(ctx, pool); opts = [target, ...similarSyl(target, pool, 2)];
      } else if (L === 4) {
        const set = GA.fresh(ctx, LX.MINPAIRS, (x) => x[0]); target = GA.pick(set); opts = set.slice();
      } else if (L === 5) {
        const set = GA.fresh(ctx, LX.PHRASES, (x) => x[0]); target = set[0]; opts = set.slice();
      } else {
        const pool = L === 2 ? ws.filter((w) => w.s.length === 2) : L === 3 ? ws.filter((w) => w.s.length >= 3) : ws;
        const w = GA.fresh(ctx, pool.length ? pool : ws, (x) => x.w);
        target = w.w;
        const same = ws.filter((x) => x.w !== w.w && x.s[0] === w.s[0]);
        opts = [target, ...(same.length ? [GA.pick(same).w] : []), ...wordVariants(w, 2)].slice(0, 3);
      }
      opts = GA.shuffle([...new Set(opts)]);
      const ms = FLASH[L];
      return {
        text: '¡Palabra relámpago!', say: 'Toca listo y mira bien. La palabra va a desaparecer.',
        render(stage, api) {
          const card = h('div', { class: 'lx-flash' }, h('span', { class: 'lx-flash-q' }, '⚡'));
          const choices = ui.answerChoices(opts.map((o) => ({ label: o, ok: o === target, cls: 'txt lx-opt' })), api, { after: (o) => { if (o.ok) { card.innerHTML = ''; card.append(h('span', { class: 'lx-flash-w' }, target)); } } });
          choices.style.visibility = 'hidden';
          let shown = 0;
          const flash = () => {
            if (shown++) api.hintUsed();
            card.innerHTML = ''; card.append(h('span', { class: 'lx-flash-w' }, target));
            go.disabled = true;
            setTimeout(() => { if (!card.isConnected) return; card.innerHTML = ''; card.append(h('span', { class: 'lx-flash-q' }, '❓')); choices.style.visibility = 'visible'; go.disabled = false; go.textContent = '👀 Ver otra vez'; }, ms);
          };
          const go = h('button', { class: 'btn btn-big', onclick: () => { GA.sfx.play('tap'); flash(); } }, '⚡ ¡Listo!');
          stage.append(card, go, choices);
        },
        hint: 'Mira la primera y la última letra.',
        explain: { text: `Era “${target}”.`, html: `<span class="lx-explain">${target}</span>` },
        tag: 'lx-relampago',
      };
    },
  });

  // ======================= 5. MIS LIBRITOS =======================
  // Lee una frase en voz alta resaltando cada palabra (karaoke), por oraciones para que la voz no se corte
  function readAlong(spans, onEnd, lang) {
    const S = GA.settings();
    if (!('speechSynthesis' in window) || !S.voice) { onEnd(); return () => {}; }
    speechSynthesis.cancel();
    const chunks = [[]];
    spans.forEach((s) => { chunks[chunks.length - 1].push(s); if (/[.!?»…:]$/.test(s.textContent)) chunks.push([]); });
    let stopped = false, timer = null, cur = null;
    const mark = (s) => { if (cur) cur.classList.remove('rd-now'); cur = s; if (s) s.classList.add('rd-now'); };
    const rate = (S.rate || 0.92) * 0.88;
    const sayChunk = (list) => new Promise((res) => {
      const offs = []; let text = '';
      list.forEach((s) => { offs.push(text.length); text += s.textContent + ' '; });
      const u = new SpeechSynthesisUtterance(text.replace(/—/g, ', '));
      const v = lang === 'en' ? GA.voice.vEn : GA.voice.v; if (v) { u.voice = v; u.lang = v.lang; } else u.lang = lang === 'en' ? 'en-US' : 'es-MX';
      u.rate = rate;
      let gotB = false, done = false;
      const fin = () => { if (!done) { done = true; clearTimeout(timer); res(); } };
      u.onboundary = (e) => { if (e.name && e.name !== 'word') return; gotB = true; let i = 0; while (i + 1 < offs.length && offs[i + 1] <= e.charIndex) i++; mark(list[i]); };
      u.onend = fin; u.onerror = fin;
      // Respaldo si el navegador no avisa palabra por palabra
      const step = (i) => { if (stopped || gotB || done || i >= list.length) return; mark(list[i]); timer = setTimeout(() => step(i + 1), (240 + list[i].textContent.length * 65) * (0.92 / rate)); };
      speechSynthesis.speak(u);
      timer = setTimeout(() => step(0), 650);
      setTimeout(fin, 1500 + text.length * 120);
    });
    (async () => {
      for (const c of chunks) { if (stopped || !c.length) continue; if (!c[0].isConnected) break; await sayChunk(c); }
      mark(null);
      if (!stopped) onEnd();
    })();
    return () => { stopped = true; clearTimeout(timer); speechSynthesis.cancel(); mark(null); };
  }

  // Lector de libritos: páginas, tocar palabras para escucharlas, "leer conmigo" y cronómetro
  function reader(book, o = {}) {
    let page = 0, taps = 0, assisted = false, stopRead = null;
    const t0 = Date.now();
    const size = [0, 2.5, 2.3, 2.1, 1.9, 1.75, 1.6, 1.5, 1.45, 1.4, 1.35][book.l];
    const pic = h('div', { class: 'rd-pic' });
    const text = h('div', { class: 'rd-text', style: { fontSize: size + 'rem' } });
    const dots = h('div', { class: 'rd-dots' }, book.p.map(() => h('i')));
    const prev = h('button', { class: 'btn btn-white', 'aria-label': 'Página anterior', onclick: () => go(-1) }, '◀');
    const next = h('button', { class: 'btn btn-big', onclick: () => go(1) });
    const along = h('button', { class: 'btn btn-white btn-sm', onclick: readPage }, '🐢 Leer conmigo');
    const stop = () => { if (stopRead) { stopRead(); stopRead = null; along.textContent = '🐢 Leer conmigo'; } };
    function readPage() {
      if (stopRead) return stop();
      assisted = true;
      along.textContent = '⏹ Parar';
      stopRead = readAlong(GA.$$('.rw', text), () => { stopRead = null; along.textContent = '🐢 Leer conmigo'; }, book.lang);
    }
    function render() {
      stop();
      const [e, t] = book.p[page];
      if (book.hy) { pic.innerHTML = ''; pic.append(h('img', { class: 'hy-img', src: GA.HYRULE.imgSrc(e), alt: '', draggable: 'false' })); } else pic.textContent = e;
      text.innerHTML = '';
      t.split(/\s+/).forEach((w, i) => {
        if (i) text.append(' ');
        const sp = h('span', { class: 'rw', onclick: () => {
          const c = clean(w); if (!c) return;
          taps++; sp.classList.add('rd-tap'); setTimeout(() => sp.classList.remove('rd-tap'), 900);
          GA.say(c, { rate: 0.8, lang: book.lang });
        } }, w);
        text.append(sp);
      });
      GA.$$('i', dots).forEach((d, k) => d.classList.toggle('on', k <= page));
      prev.disabled = page === 0;
      const last = page === book.p.length - 1;
      next.textContent = last ? (o.review ? 'Cerrar ✖' : '¡Terminé! ✅') : 'Siguiente ▶';
      next.className = 'btn btn-big ' + (last ? 'btn-ok' : '');
      card.classList.remove('rd-turn'); void card.offsetWidth; card.classList.add('rd-turn');
    }
    function go(d) {
      GA.sfx.play('tap');
      if (page + d >= book.p.length) { stop(); o.onDone && o.onDone({ words: book.words, ms: Date.now() - t0, assisted, taps }); return; }
      page = GA.clamp(page + d, 0, book.p.length - 1);
      render();
    }
    const card = h('div', { class: 'rd-page' }, pic, text);
    const el = h('div', { class: 'reader' + (book.hy ? ' hy-reader' : '') },
      h('div', { class: 'rd-head' }, h('span', { class: 'rd-ic' }, book.ic), h('h3', null, book.t), h('span', { class: 'chip' }, `Nivel ${book.l} · ${book.words} palabras`)),
      o.review ? null : h('div', { class: 'rd-tip' }, '🗣️ Lee en voz alta. Si no sabes una palabra, tócala.'),
      card,
      h('div', { class: 'rd-nav' }, prev, dots, next),
      GA.settings().voice ? h('div', { class: 'rd-tools' }, along) : null);
    render();
    el.stop = stop;
    return el;
  }

  // Guarda la lectura y calcula palabras por minuto (sólo si leyó sin ayuda de la voz)
  function logReading(book, res, test) {
    const wpm = Math.round(res.words / (res.ms / 60000));
    const valid = !res.assisted && res.ms > 4000 && wpm >= 5 && wpm <= 260;
    const prevs = (D().reading || []).filter((r) => r.id === book.id && r.wpm);
    const prev = prevs.length ? prevs[prevs.length - 1].wpm : null;
    if (!test) {
      D().reading.push({ d: GA.dayKey(), t: Date.now(), id: book.id, l: book.l, w: res.words, ms: res.ms, wpm: valid ? wpm : null, help: res.taps, a: res.assisted ? 1 : 0, ...(book.lang ? { lang: book.lang } : {}) });
      if (D().reading.length > 400) D().reading.splice(0, D().reading.length - 400);
      GA.store.save();
    }
    return { wpm: valid ? wpm : null, prev, tooFast: !res.assisted && wpm > 260 };
  }
  const mmss = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  function resultCard(book, res, info, btnLabel, onNext) {
    let msg = '';
    if (info.wpm) {
      msg = `⏱️ ${mmss(res.ms)} · ${info.wpm} palabras por minuto`;
      if (info.prev && info.wpm > info.prev) msg += ` · ¡${info.wpm - info.prev} más que la vez pasada! 🚀`;
    }
    const say = info.wpm ? `¡Terminaste! Leíste ${res.words} palabras. ${info.prev && info.wpm > info.prev ? '¡Leíste más rápido que la vez pasada!' : ''}` : '¡Terminaste el librito!';
    GA.say(say);
    return h('div', { class: 'read-done' },
      h('div', { class: 'rd-trophy' }, book.ic, '📖'),
      h('h3', null, '¡Terminaste el librito!'),
      h('div', { class: 'chip' }, `Leíste ${res.words} palabras`),
      msg ? h('div', { class: 'chip rd-speed' }, msg) : null,
      res.assisted ? h('p', { class: 'muted' }, '🐢 Lo leímos juntos. La próxima vez intenta leerlo tú solo.') : null,
      info.tooFast ? h('p', { class: 'muted' }, '¡Uy, qué rápido! Recuerda leer cada palabra con cuidado.') : null,
      h('button', { class: 'btn btn-big btn-ok', onclick: onNext }, btnLabel));
  }

  function pickBook(lvl, ctx, all = LX.BOOKS) {
    const books = all[lvl];
    const reads = (id) => (D().reading || []).filter((r) => r.id === id).length;
    ctx.done = ctx.done || [];
    const cands = books.filter((b) => !ctx.done.includes(b.id));
    const pool = cands.length ? cands : books;
    const min = Math.min(...pool.map((b) => reads(b.id)));
    const b = GA.pick(pool.filter((x) => reads(x.id) === min));
    ctx.done.push(b.id);
    return b;
  }

  function bookItem(L, ctx, all, label) {
    if (!ctx.book || ctx.book.l !== L || ctx.qi >= ctx.book.q.length) { ctx.book = pickBook(L, ctx, all); ctx.qi = 0; ctx.shown = false; }
    const b = ctx.book, q = b.q[ctx.qi++];
    const showBook = !ctx.shown, en = b.lang === 'en';
    ctx.shown = true;
    return {
      text: showBook ? `${label}: ${b.t}` : q.t, say: showBook ? (en ? 'Vamos a leer en inglés. Lee en voz alta y toca las palabras que no conozcas.' : `Vamos a leer: ${b.t}. Lee en voz alta.`) : q.t,
      sayLang: showBook ? undefined : b.lang, lang: b.lang,
      render(stage, api) {
        const qBox = h('div', { class: 'lx-q', style: { display: showBook ? 'none' : 'grid' } },
          h('div', { class: 'word-problem', style: { fontSize: '1.5rem' } }, q.t, ' ', h('button', { class: 'icon-btn', 'aria-label': 'Escuchar', onclick: () => GA.say(q.t, { lang: b.lang }) }, '🔊')),
          ui.answerChoices(GA.shuffle(q.o.map((t, i) => ({ label: t, ok: i === q.a, cls: 'wide' }))), api));
        if (showBook) {
          const rd = reader(b, {
            onDone(res) {
              const info = logReading(b, res, api.test);
              rd.replaceWith(resultCard(b, res, info, '¡A las preguntas! ➜', () => {
                stage.querySelector('.read-done').remove();
                qBox.style.display = 'grid'; api.setText(q.t, b.lang); GA.say(q.t, { lang: b.lang });
              }));
            },
          });
          stage.append(rd);
        } else {
          const open = h('button', { class: 'btn btn-white btn-sm', onclick: () => {
            const rd = reader(b, { review: true, onDone: () => rd.replaceWith(open) });
            open.replaceWith(rd);
          } }, b.hy ? '📜 Ver el texto' : '📖 Ver el librito');
          stage.append(open);
        }
        stage.append(qBox);
      },
      hint: q.k === 'i' ? 'La respuesta no está escrita tal cual: piensa como detective con las pistas de la lectura.' : 'Puedes abrir el texto otra vez y buscar la respuesta.',
      explain: { text: `${q.o[q.a].replace(/^\S+\s/, '')}. ${q.k === 'i' ? (en ? 'We know it from the clues in the story.' : 'Lo sabemos por las pistas de la lectura.') : ''}` },
      tag: { q: 'comprension-literal', o: 'secuencia', i: 'inferencia', v: 'vocabulario' }[q.k],
    };
  }

  const BOOK_LEVELS = ['Libritos de 3 frases', 'Libritos de 4 páginas', 'Dos oraciones por página', 'Cuentos de 5 páginas', 'Cuentos y datos curiosos', 'Historias de 6 páginas', 'Párrafos', 'Capítulos', 'Historias largas', '¡Gran lector!'];
  GA.skill({
    id: 'llib', area: 'lector', title: 'Mis libritos', icon: '📚', desc: 'Lee libritos cada vez más largos, mide tu velocidad y demuestra que entendiste.',
    levels: BOOK_LEVELS,
    prereq: [['lfra', 2]],
    roundLen: (L) => (L <= 4 ? 6 : 4),
    sandboxLabel: '📚 Mi biblioteca',
    lessons: {
      1: [{ say: 'Vamos a leer libritos. Lee en voz alta, página por página. Si una palabra es difícil, tócala y te la digo. Cuando termines, te haré preguntas.', html: '<div class="lx-ex">📖 🗣️ ➜ ❓</div>' },
        { say: 'Si quieres, toca Leer conmigo y leemos juntos, palabra por palabra. Pero lo mejor es que tú lo intentes primero.', html: '<div class="lx-ex">🐢 Leer conmigo</div>' }],
      5: [{ say: 'Ahora los libritos son más largos. Un truco de buen lector: al terminar cada página, pregúntate ¿qué pasó aquí?', html: '<div class="lx-ex">📖 ➜ 🤔 ➜ 📖</div>' }],
      8: [{ say: 'Ya lees capítulos. Cuando leas en voz alta, haz pausa en los puntos y cambia la voz en las preguntas y en lo que dicen los personajes. ¡Eso se llama leer con expresión!', html: '<div class="lx-ex">. ⏸️  ¿? 🎭  ¡! 🎉</div>' }],
    },
    make(L, ctx) { return bookItem(L, ctx, LX.BOOKS, 'Librito'); },
    // Biblioteca: leer libremente los libritos ya abiertos (lectura repetida = más fluidez)
    sandbox(stage, opts = {}) { library(stage, opts, 'llib', LX.BOOKS, BOOK_LEVELS, 'Leer otra vez un librito te hace leer cada vez mejor. ¡Intenta superar tu velocidad!'); },
  });

  // Estante de lecturas por nivel; sólo se abren los niveles alcanzados
  function library(stage, opts, skillId, books, names, intro) {
    const max = opts.test || GA.settings().unlockAll ? 99 : Math.max(1, E.st(skillId).best);
    const shelf = () => {
      stage.innerHTML = '';
      const reads = D().reading || [];
      stage.append(h('p', { class: 'muted center' }, intro));
      Object.entries(books).forEach(([l, list]) => {
        const open = +l <= max;
        stage.append(h('div', { class: 'lx-shelf' }, h('h3', null, `${open ? '📗' : '🔒'} Nivel ${l}: ${names[l - 1]}`),
          h('div', { class: 'lx-covers' }, list.map((b) => {
            const mine = reads.filter((r) => r.id === b.id);
            const best = Math.max(0, ...mine.map((r) => r.wpm || 0));
            const cover = b.hy && open ? h('img', { class: 'hy-cover', src: GA.HYRULE.imgSrc(b.p[0][0]), alt: '' }) : h('span', { class: 'ic' }, open ? b.ic : '🔒');
            return h('button', { class: 'lx-cover' + (open ? '' : ' locked') + (b.hy ? ' hy' : ''), disabled: !open, onclick: () => read(b) },
              cover, h('b', null, b.t), h('small', null, `${b.words} palabras`),
              mine.length ? h('small', { class: 'done' }, `✅ ${mine.length}× ${best ? '· ' + best + ' ppm' : ''}`) : null);
          }))));
      });
    };
    const read = (b) => {
      stage.innerHTML = '';
      const rd = reader(b, { onDone(res) { const info = logReading(b, res, opts.test); rd.replaceWith(resultCard(b, res, info, '📚 Volver', shelf)); } });
      stage.append(rd);
      window.scrollTo(0, 0);
    };
    shelf();
  }

  // ======================= 6. LEYENDAS DE HYRULE (Zelda: Breath of the Wild), en español y en inglés =======================
  const hyImg = (k, cls = '') => h('img', { class: 'hy-img ' + cls, src: GA.HYRULE.imgSrc(k), alt: '', draggable: 'false' });
  const hyOpt = (k, ok) => ({ html: `<img class="hy-opt" src="${GA.HYRULE.imgSrc(k)}" alt="" draggable="false">`, ok, cls: 'hy-choice' });
  const hyPic = (k) => `<img class="hy-explain" src="${GA.HYRULE.imgSrc(k)}" alt="">`;
  const hyLesson = (k) => `<img class="hy-lesson" src="${GA.HYRULE.imgSrc(k)}" alt="">`;
  function hyruleSkill(def, HY, lang) {
    const en = lang === 'en';
    // En inglés las instrucciones siguen en español (Gael aún aprende inglés); el texto, la voz y las preguntas van en inglés
    const T = en
      ? { word: 'Lee la palabra en inglés y toca su imagen', wordSay: 'Lee la palabra en inglés y toca su imagen.', name: 'What is it?', nameSay: 'Mira la imagen y toca la palabra en inglés.',
        sent: 'Read and tap the picture', sentSay: 'Lee la frase en inglés y toca la imagen.', tf: 'True or false?', tfSay: 'Lee la pregunta en inglés y contesta sí o no.',
        yes: '👍 Yes', no: '👎 No', says: (w) => `“${w}”`, label: 'Read' }
      : { word: 'Lee la palabra y toca su imagen', wordSay: 'Lee la palabra y toca su imagen.', name: '¿Cómo se llama?', nameSay: 'Mira la imagen y toca la palabra correcta.',
        sent: 'Lee y toca la imagen', sentSay: 'Lee la frase y toca la imagen que va con ella.', tf: '¿Verdad o mentira?', tfSay: 'Lee la pregunta y contesta sí o no.',
        yes: '👍 Sí', no: '👎 No', says: (w) => `Dice “${w}”`, label: 'Lee el texto' };
    const say = (t) => GA.say(t, { lang });
    GA.skill(Object.assign(def, {
      levels: HY.LEVELS,
      roundLen: (L) => (L <= 6 ? 6 : 4),
      make(L, ctx) {
        if (L <= 2) {
          const pool = HY.WORDS[L];
          const all = L === 2 ? pool.concat(HY.WORDS[1]) : pool;
          const w = GA.fresh(ctx, pool, (x) => x.w);
          if (Math.random() < 0.6) {
            const others = GA.sample(all.filter((x) => x.img !== w.img), 2);
            return {
              text: T.word, say: T.wordSay, lang,
              render(stage, api) {
                stage.append(big(w.w), en ? h('button', { class: 'btn btn-white btn-sm', onclick: () => say(w.w) }, '🔊 Escuchar') : helpBtn(api, w.s.join('… ') + '. ' + w.w));
                stage.append(ui.answerChoices(GA.shuffle([w, ...others]).map((x) => hyOpt(x.img, x === w)), api, { after: (o) => o.ok && say(w.w) }));
              },
              hint: en ? 'Toca 🔊 Escuchar para oír la palabra en inglés.' : `Lee por sílabas: ${w.s.join(' - ')}.`,
              explain: { text: `${T.says(w.w)}: ${w.s.join(' - ')}.`, html: hyPic(w.img) },
              tag: 'hy-palabras',
            };
          }
          const others = GA.sample(pool.filter((x) => x !== w), 2).map((x) => x.w);
          return {
            text: T.name, say: T.nameSay, lang,
            render(stage, api) {
              stage.append(h('div', { class: 'hy-frame' }, hyImg(w.img)));
              stage.append(ui.answerChoices(GA.shuffle([w.w, ...others]).map((x) => ({ label: x, ok: x === w.w, cls: 'txt lx-opt' })), api, { after: (o) => o.ok && say(w.w) }));
            },
            hint: en ? `En inglés empieza con “${w.w[0]}”.` : `Empieza con “${w.s[0]}”.`,
            explain: { text: `${T.says(w.w)}: ${w.s.join(' - ')}.` },
            tag: 'hy-palabras',
          };
        }
        if (L === 3) {
          const s = GA.fresh(ctx, HY.SENTS, (x) => x[0]);
          const others = GA.sample(HY.SENTS.filter((x) => x[1] !== s[1]), 2);
          return {
            text: T.sent, say: T.sentSay, lang,
            render(stage, api) {
              stage.append(big(s[0], 'lx-sent'), helpBtn(api, s[0], lang));
              stage.append(ui.answerChoices(GA.shuffle([s, ...others]).map((x) => hyOpt(x[1], x === s)), api, { after: (o) => o.ok && say(s[0]) }));
            },
            hint: en ? 'Busca las palabras que conoces: ¿de quién habla?' : 'Lee palabra por palabra. ¿De quién habla? ¿Qué hace?',
            explain: { text: s[0], html: hyPic(s[1]) },
            tag: 'hy-frases',
          };
        }
        if (L === 4) {
          const [q, ans, img] = GA.fresh(ctx, HY.TF, (x) => x[0]);
          return {
            text: T.tf, say: T.tfSay, lang,
            render(stage, api) {
              stage.append(h('div', { class: 'hy-frame sm' }, hyImg(img)), big(q, 'lx-sent'), helpBtn(api, q, lang));
              stage.append(ui.answerChoices([{ label: T.yes, ok: ans, cls: 'txt' }, { label: T.no, ok: !ans, cls: 'txt' }], api));
            },
            hint: en ? 'Toca 🔊 Ayuda para oír la pregunta y piensa en lo que pasa en Hyrule.' : 'Lee con calma y piensa en lo que pasa en Hyrule.',
            explain: { text: `${q} ${ans ? (en ? 'Yes.' : 'Sí.') : 'No.'}` },
            tag: 'hy-verdad',
          };
        }
        return bookItem(L, ctx, HY.TEXTS, T.label);
      },
      sandbox(stage, opts = {}) { library(stage, opts, def.id, HY.TEXTS, HY.LEVELS, def.libraryIntro); },
    }));
  }
  hyruleSkill({
    id: 'lzel', area: 'lector', title: 'Leyendas de Hyrule', icon: '🗡️', desc: 'Aprende a leer en el mundo de Zelda: Breath of the Wild. De palabras sueltas a las grandes leyendas de Hyrule.',
    prereq: [['lsil', 2]], sandboxLabel: '📜 Archivo Sheikah',
    libraryIntro: 'Aquí se guardan los textos de Hyrule que ya abriste. ¡Vuelve a leerlos para leer cada vez más rápido!',
    lessons: {
      1: [{ say: 'Bienvenido a Hyrule, héroe. Aquí vas a leer como un verdadero aventurero: primero palabras, luego consejos de viaje y al final las leyendas completas. ¡Cada lectura te hace más fuerte!', html: hyLesson('link') },
        { say: 'Lee la palabra sílaba por sílaba y toca la imagen correcta. Si una palabra es difícil, toca Ayuda.', html: hyLesson('espada') }],
      5: [{ say: 'Ahora leerás consejos de viaje, como los que aparecen mientras carga el juego. Lee con calma: la pregunta será sobre el consejo.', html: hyLesson('tableta') }],
      7: [{ say: 'Abriste el Compendio Hyrule. Aquí los textos son más largos, como los de un libro de ciencias. Al terminar cada uno, pregúntate: ¿qué aprendí?', html: hyLesson('guardian-art') }],
      9: [{ say: 'Ya estás listo para las historias de Hyrule. Son capítulos largos. Lee una página a la vez y usa tu imaginación: ¡tú eres el héroe!', html: hyLesson('espada-art') }],
    },
  }, GA.HYRULE, 'es');
  hyruleSkill({
    id: 'lzen', area: 'ingles', title: 'Legends of Hyrule', icon: '🗡️', desc: 'Lee en inglés con Zelda: Breath of the Wild. Las mismas aventuras de Hyrule, ¡pero en inglés!',
    prereq: [['lsil', 2]], sandboxLabel: '📜 Sheikah Archive',
    libraryIntro: 'Los textos de Hyrule en inglés que ya abriste. Léelos otra vez: en inglés, repetir es la mejor forma de aprender.',
    lessons: {
      1: [{ say: '¡Bienvenido a Hyrule en inglés! Aquí vas a leer las mismas aventuras, pero en inglés. En inglés las letras no siempre suenan como en español, así que toca Escuchar todas las veces que quieras.', html: hyLesson('link') },
        { say: 'Por ejemplo: sword se escribe s, w, o, r, d, pero se dice sord. ¡La w no suena! Por eso escuchar te ayuda mucho.', html: hyLesson('espada') }],
      3: [{ say: 'Ahora leerás frases en inglés. Busca las palabras que ya conoces, como Link, the, is. Si una palabra es difícil, toca Ayuda y escucha.', html: hyLesson('link-arco') }],
      5: [{ say: 'Ahora vienen los consejos de viaje en inglés. Toca cualquier palabra para oírla. Si quieres, usa Leer conmigo y lee junto con la voz.', html: hyLesson('tableta') }],
      9: [{ say: 'Llegaste a las historias completas en inglés. ¡Eres un gran aventurero! Lee una página a la vez y usa Leer conmigo cuando lo necesites.', html: hyLesson('espada-art') }],
    },
  }, GA.HYRULE_EN, 'en');

  GA.lector = { reader, readAlong, logReading };
})();
