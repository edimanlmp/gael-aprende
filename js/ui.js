/* Gael Aprende — componentes de interfaz reutilizables */
(function () {
  'use strict';
  const { h } = GA;
  const ui = (GA.ui = {});

  // ---------- Ventana modal ----------
  ui.modal = function ({ title, text, body, mascot, actions = [], cls = '', say, dismissable = false }) {
    const ov = document.getElementById('overlay');
    const close = () => { ov.innerHTML = ''; };
    const box = h('div', { class: 'modal ' + cls },
      mascot ? h('div', { html: GA.mascot(mascot, 110) }) : null,
      title ? h('h2', null, title) : null,
      text ? h('p', { html: text }) : null,
      body || null,
      actions.length ? h('div', { class: 'actions' }, actions.map((a) =>
        h('button', { class: 'btn ' + (a.cls || ''), onclick: () => { GA.sfx.play('tap'); if (a.keep !== true) close(); a.onClick && a.onClick(); } }, a.label))) : null);
    const back = h('div', { class: 'modal-back', onclick: (e) => { if (dismissable && e.target === back) close(); } }, box);
    ov.innerHTML = '';
    ov.appendChild(back);
    if (say) GA.say(say);
    return close;
  };

  // ---------- Opciones para elegir ----------
  // options: [{label | html, ok, say, cls}]
  ui.choices = function (options, onPick, o = {}) {
    const wrap = h('div', { class: 'choices' + (o.wrapCls ? ' ' + o.wrapCls : '') });
    options.forEach((opt) => {
      const b = h('button', { class: 'choice ' + (o.cls || '') + (opt.cls ? ' ' + opt.cls : ''), 'aria-label': opt.aria || opt.label || null });
      if (opt.html != null) b.innerHTML = opt.html; else b.textContent = opt.label;
      b._opt = opt;
      b.addEventListener('click', () => {
        if (wrap.dataset.locked) return;
        GA.sfx.play('tap');
        if (opt.say && o.speakOnTap !== false) GA.say(opt.say);
        onPick(opt, b, wrap);
      });
      wrap.appendChild(b);
    });
    return wrap;
  };
  // Opciones conectadas directamente al corredor (api.answer)
  ui.answerChoices = function (options, api, o = {}) {
    const wrap = ui.choices(options, (opt, b) => {
      const r = api.answer(!!opt.ok);
      if (opt.ok) { b.classList.add('right'); wrap.dataset.locked = '1'; }
      else {
        b.classList.add('wrong');
        if (r === 'done') {
          wrap.dataset.locked = '1';
          GA.$$('.choice', wrap).forEach((x) => { if (x._opt.ok) x.classList.add('right'); });
        }
      }
      o.after && o.after(opt, r);
    }, Object.assign({ speakOnTap: false }, o));
    return wrap;
  };

  // ---------- Teclado numérico ----------
  ui.numpad = function (onSubmit, o = {}) {
    const max = o.maxLen || 3;
    let val = '';
    const disp = h('div', { class: 'display empty' }, '?');
    const upd = () => { disp.textContent = val || '?'; disp.classList.toggle('empty', !val); };
    const key = (k) => {
      GA.sfx.play('tap');
      if (k === 'del') val = val.slice(0, -1);
      else if (k === 'go') { if (val !== '') onSubmit(parseInt(val, 10), api); return; }
      else if (val.length < max) val = (val === '0' ? '' : val) + k;
      upd();
    };
    const el = h('div', { class: 'numpad' }, disp,
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) => h('button', { onclick: () => key(d), 'aria-label': d }, d)),
      h('button', { class: 'del', style: { gridColumn: 'span 2' }, onclick: () => key('del'), 'aria-label': 'Borrar' }, '⌫'),
      h('button', { class: 'go', style: { gridColumn: 'span 3' }, onclick: () => key('go'), 'aria-label': 'Comprobar' }, '✔'));
    const api = { el, clear() { val = ''; upd(); }, set(v) { val = String(v); upd(); }, display: disp };
    return api;
  };
  ui.answerNumpad = function (answer, api, o = {}) {
    const np = ui.numpad((v, pad) => {
      const ok = v === answer;
      const r = api.answer(ok);
      if (ok) { pad.display.style.color = 'var(--ok-d)'; pad.el.style.pointerEvents = 'none'; }
      else {
        pad.display.classList.add('shake');
        setTimeout(() => { pad.display.classList.remove('shake'); if (r === 'retry') pad.clear(); }, 450);
        if (r === 'done') { pad.set(answer); pad.el.style.pointerEvents = 'none'; }
      }
      o.after && o.after(ok, r);
    }, o);
    return np.el;
  };

  // ---------- Casillas para ordenar (sílabas, letras, palabras, etapas) ----------
  ui.slots = function ({ n, tiles, tileCls = '', slotCls = '', numbered = false, arrows = false, labels, onFull }) {
    const root = h('div', { style: { display: 'grid', gap: '20px', justifyItems: 'center', width: '100%' } });
    const slotsEl = h('div', { class: 'slots' });
    const tray = h('div', { class: 'tray dropzone-tray' });
    const slots = [];
    for (let i = 0; i < n; i++) {
      const s = h('div', { class: 'slot ' + slotCls, 'data-i': i });
      slots.push(s);
      if (numbered || labels) slotsEl.appendChild(h('div', { class: 'slot-wrap' }, s, h('div', { class: 'slot-num' }, labels ? labels[i] : i + 1)));
      else slotsEl.appendChild(s);
      if (arrows && i < n - 1) slotsEl.appendChild(h('span', { class: 'arrow' }, '➜'));
    }
    let locked = false;
    const tileEls = tiles.map((t) => {
      const el = h('div', { class: 'tile ' + tileCls + (t.cls ? ' ' + t.cls : ''), role: 'button', tabindex: 0, 'aria-label': t.aria || t.label || '' });
      if (t.html != null) el.innerHTML = t.html; else el.textContent = t.label;
      el._t = t;
      GA.drag(el, {
        zones: () => [...slots, tray],
        onTap: () => { if (locked) return; GA.sfx.play('tap'); t.say && GA.say(t.say); if (el.parentElement === tray) { const empty = slots.find((s) => !s.firstChild); if (empty) place(el, empty); } else toTray(el); changed(); },
        onDrop: (z) => { if (locked) return false; if (z === tray) toTray(el); else place(el, z); changed(); return true; },
      });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new PointerEvent('pointerdown')); } });
      tray.appendChild(el);
      return el;
    });
    function place(el, slot) {
      if (slot.firstChild && slot.firstChild !== el) toTray(slot.firstChild);
      slot.appendChild(el);
      slot.classList.add('filled');
      slots.forEach((s) => s.classList.toggle('filled', !!s.firstChild));
      GA.sfx.play('pop');
    }
    function toTray(el) { tray.appendChild(el); slots.forEach((s) => s.classList.toggle('filled', !!s.firstChild)); }
    function changed() {
      slots.forEach((s) => s.classList.remove('good', 'bad'));
      if (slots.every((s) => s.firstChild)) onFull && onFull(api.values(), api);
    }
    root.append(slotsEl, tray);
    const api = {
      el: root, slots, tray,
      values: () => slots.map((s) => (s.firstChild ? s.firstChild._t.value : null)),
      mark(okArr) { slots.forEach((s, i) => { s.classList.toggle('good', !!okArr[i]); s.classList.toggle('bad', !okArr[i]); }); },
      returnWrong(okArr) { setTimeout(() => { slots.forEach((s, i) => { if (!okArr[i] && s.firstChild) toTray(s.firstChild); s.classList.remove('bad'); }); }, 900); },
      lock() { locked = true; tileEls.forEach((t) => t.classList.add('locked')); },
      solve(values) { // coloca la solución correcta
        const pool = tileEls.slice();
        slots.forEach((s) => { if (s.firstChild) toTray(s.firstChild); });
        values.forEach((v, i) => { const t = pool.find((x) => x._t.value === v && x.parentElement === tray); if (t) { slots[i].appendChild(t); } });
        slots.forEach((s) => s.classList.toggle('filled', !!s.firstChild));
        api.mark(values.map(() => true));
      },
    };
    return api;
  };

  // ---------- Clasificador (arrastrar a grupos) ----------
  ui.sorter = function ({ items, bins, onCheck, checkLabel = '¡Comprobar!' }) {
    const root = h('div', { class: 'sorter' });
    const tray = h('div', { class: 'tray' });
    let selected = null, locked = false;
    const binEls = bins.map((b) => {
      const itemsEl = h('div', { class: 'items' });
      const el = h('div', { class: 'bin dropzone', 'data-bin': b.id }, h('h4', null, b.icon ? h('span', null, b.icon) : null, b.title), b.sub ? h('div', { class: 'muted', style: { fontSize: '.9rem' } }, b.sub) : null, itemsEl);
      el._items = itemsEl; el._b = b;
      el.addEventListener('click', (e) => { if (locked || !selected || e.target.closest('.item-card')) return; put(selected, el); });
      return el;
    });
    const cards = items.map((it) => {
      const c = h('div', { class: 'item-card' + (it.label ? ' has-label' : ''), role: 'button', tabindex: 0, 'aria-label': it.label || '' }, h('span', { html: it.html }), it.label ? h('small', null, it.label) : null);
      c._it = it;
      GA.drag(c, {
        zones: () => [...binEls, tray],
        onTap: () => {
          if (locked) return;
          it.say && GA.say(it.say);
          if (c.parentElement !== tray) { tray.appendChild(c); select(null); upd(); return; }
          select(selected === c ? null : c);
        },
        onDrop: (z) => { if (locked) return false; if (z === tray) tray.appendChild(c); else put(c, z); return true; },
      });
      tray.appendChild(c);
      return c;
    });
    function select(c) { cards.forEach((x) => x.classList.toggle('sel', x === c)); selected = c; binEls.forEach((b) => b.classList.toggle('target', !!c)); }
    function put(c, bin) { bin._items.appendChild(c); c.classList.remove('bad', 'good'); GA.sfx.play('pop'); select(null); upd(); }
    const checkBtn = h('button', { class: 'btn btn-ok', disabled: true, onclick: () => {
      if (locked) return;
      const res = cards.map((c) => ({ item: c._it, bin: c.closest('.bin') ? c.closest('.bin')._b.id : null, el: c }));
      res.forEach((r) => { r.ok = r.bin === r.item.cat; });
      onCheck(res, api);
    } }, checkLabel);
    function upd() { checkBtn.disabled = tray.children.length > 0; }
    root.append(h('div', { class: 'bins' }, binEls), tray, h('div', { class: 'actions' }, checkBtn));
    const api = {
      el: root,
      mark(res) { res.forEach((r) => r.el.classList.add(r.ok ? 'good' : 'bad')); },
      returnWrong(res) { setTimeout(() => { res.forEach((r) => { if (!r.ok) { r.el.classList.remove('bad'); tray.appendChild(r.el); } }); upd(); }, 1000); },
      solve() { cards.forEach((c) => { const b = binEls.find((x) => x._b.id === c._it.cat); if (b) b._items.appendChild(c); c.classList.remove('bad'); c.classList.add('good'); }); api.lock(); },
      lock() { locked = true; checkBtn.disabled = true; cards.forEach((c) => c.classList.add('locked')); },
    };
    return api;
  };

  // ---------- Botón de escuchar ----------
  ui.speakBtn = (text, cls = '') => h('button', { class: 'icon-btn ' + cls, 'aria-label': 'Escuchar', onclick: (e) => { e.stopPropagation(); GA.say(typeof text === 'function' ? text() : text); } }, '🔊');

  // ---------- Visuales comunes ----------
  const viz = (GA.viz = {});
  // Marco de diez con a fichas rojas y b azules
  viz.tenFrame = (a, b = 0, small = false) => {
    let cells = '';
    for (let i = 0; i < 10; i++) cells += `<i>${i < a ? '<b class="a"></b>' : i < a + b ? '<b class="b"></b>' : ''}</i>`;
    return `<div class="tf${small ? ' small' : ''}">${cells}</div>`;
  };
  viz.tenFrames = (a, b = 0, small = false) => {
    let out = '', total = a + b, i = 0;
    while (total > 0 || i === 0) {
      const ra = GA.clamp(a - i * 10, 0, 10), rb = GA.clamp(Math.min(10, a + b - i * 10) - ra, 0, 10);
      out += viz.tenFrame(ra, rb, small);
      total -= 10; i++;
    }
    return `<div class="row">${out}</div>`;
  };
  // Patrones de dado
  viz.dots = (n, color = '#7656F5', size = 110) => {
    const P = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]] };
    const pts = P[n] || [];
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><rect x="3" y="3" width="94" height="94" rx="20" fill="#fff" stroke="#DCE5F5" stroke-width="4"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${color}"/>`).join('')}</svg>`;
  };
  // Polígonos y figuras
  viz.shape = (kind, color = '#7656F5', size = 120, rot = 0) => {
    const c = 50, R = 40;
    const poly = (n, r = R, start = -90) => GA.range(0, n - 1).map((i) => { const a = (start + (360 / n) * i) * Math.PI / 180; return `${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    let body = '';
    switch (kind) {
      case 'circulo': body = `<circle cx="50" cy="50" r="40"/>`; break;
      case 'ovalo': body = `<ellipse cx="50" cy="50" rx="44" ry="28"/>`; break;
      case 'cuadrado': body = `<rect x="14" y="14" width="72" height="72" rx="3"/>`; break;
      case 'rectangulo': body = `<rect x="6" y="26" width="88" height="48" rx="3"/>`; break;
      case 'triangulo': body = `<polygon points="${poly(3, 44, -90)}" transform="translate(0,6)"/>`; break;
      case 'rombo': body = `<polygon points="50,6 80,50 50,94 20,50"/>`; break;
      case 'pentagono': body = `<polygon points="${poly(5)}"/>`; break;
      case 'hexagono': body = `<polygon points="${poly(6, 42, 0)}"/>`; break;
      case 'octagono': body = `<polygon points="${poly(8, 42, 22.5)}"/>`; break;
      case 'trapecio': body = `<polygon points="28,24 72,24 92,76 8,76"/>`; break;
      case 'estrella': body = `<polygon points="${GA.range(0, 9).map((i) => { const r = i % 2 ? 18 : 44; const a = (-90 + 36 * i) * Math.PI / 180; return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`; }).join(' ')}"/>`; break;
      case 'corazon': body = `<path d="M50 86 C10 60 8 30 30 22 C42 18 50 28 50 34 C50 28 58 18 70 22 C92 30 90 60 50 86Z"/>`; break;
    }
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><g fill="${color}" stroke="rgba(0,0,0,.18)" stroke-width="3" stroke-linejoin="round" transform="rotate(${rot} 50 50)">${body}</g></svg>`;
  };
  viz.SHAPE_SIDES = { triangulo: 3, cuadrado: 4, rectangulo: 4, rombo: 4, trapecio: 4, pentagono: 5, hexagono: 6, octagono: 8, circulo: 0 };
  viz.SHAPE_NAMES = { circulo: 'círculo', ovalo: 'óvalo', cuadrado: 'cuadrado', rectangulo: 'rectángulo', triangulo: 'triángulo', rombo: 'rombo', pentagono: 'pentágono', hexagono: 'hexágono', octagono: 'octágono', trapecio: 'trapecio', estrella: 'estrella', corazon: 'corazón' };
  viz.COLORS = ['#7656F5', '#12A876', '#FF7433', '#3D8BFF', '#FF5C8A', '#FFB020'];

  // Pizza / fracción: n partes, k coloreadas
  viz.pizza = (n, k, size = 150, opts = {}) => {
    const r = 46, cx = 50, cy = 50;
    let s = `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="pizza">`;
    s += `<circle cx="50" cy="50" r="49" fill="#E8B46B"/>`;
    for (let i = 0; i < n; i++) {
      const a0 = (-90 + (360 / n) * i) * Math.PI / 180, a1 = (-90 + (360 / n) * (i + 1)) * Math.PI / 180;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const large = 360 / n > 180 ? 1 : 0;
      const d = n === 1 ? `M50 4 A46 46 0 1 1 49.99 4Z` : `M50 50 L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`;
      const on = Array.isArray(k) ? k.includes(i) : i < k;
      s += `<path data-i="${i}" class="slice" d="${d}" fill="${on ? (opts.color || '#FF6B4A') : '#FFE3A3'}" stroke="#B9772A" stroke-width="2"/>`;
      if (on && opts.toppings !== false) {
        const am = (a0 + a1) / 2;
        s += `<circle cx="${(cx + r * 0.6 * Math.cos(am)).toFixed(1)}" cy="${(cy + r * 0.6 * Math.sin(am)).toFixed(1)}" r="${Math.max(2, 7 - n / 2)}" fill="#C0392B" pointer-events="none"/>`;
      }
    }
    return s + '</svg>';
  };
  // Tablero de "fracción desigual" para la actividad de partes iguales
  viz.unequal = (size = 150) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><circle cx="50" cy="50" r="49" fill="#E8B46B"/><path d="M50 50 L50 4 A46 46 0 0 1 96 50Z" fill="#FFE3A3" stroke="#B9772A" stroke-width="2"/><path d="M50 50 L96 50 A46 46 0 0 1 20 85Z" fill="#FFE3A3" stroke="#B9772A" stroke-width="2"/><path d="M50 50 L20 85 A46 46 0 0 1 50 4Z" fill="#FFE3A3" stroke="#B9772A" stroke-width="2"/></svg>`;
  viz.rectFrac = (n, k, w = 180, color = '#3D8BFF', equal = true) => {
    let s = `<svg viewBox="0 0 ${w} 70" width="${w}" height="70"><rect x="2" y="2" width="${w - 4}" height="66" rx="8" fill="#fff" stroke="#23304D" stroke-width="3"/>`;
    let x = 2;
    const widths = equal ? GA.range(1, n).map(() => (w - 4) / n) : (() => { const a = GA.range(1, n).map((i) => i + 1); const t = a.reduce((p, q) => p + q, 0); return a.map((v) => (v / t) * (w - 4)); })();
    widths.forEach((ww, i) => { s += `<rect x="${x}" y="2" width="${ww}" height="66" fill="${i < k ? color : 'transparent'}" stroke="#23304D" stroke-width="3"/>`; x += ww; });
    return s + '</svg>';
  };
})();
