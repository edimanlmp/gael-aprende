/* Gael Aprende — núcleo: utilidades, almacenamiento, voz, sonidos, mascota y arrastrar-soltar. */
(function () {
  'use strict';
  const GA = (window.GA = { skills: {}, skillList: [], screens: {} });

  // ---------- Utilidades ----------
  GA.rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  GA.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  GA.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  GA.sample = (arr, n) => GA.shuffle(arr).slice(0, n);
  GA.range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
  GA.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  GA.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  GA.dayKey = (d = new Date()) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  GA.addDays = (key, n) => {
    const [y, m, d] = key.split('-').map(Number);
    return GA.dayKey(new Date(y, m - 1, d + n));
  };
  // Elige un elemento no usado en esta ronda (evita repetir preguntas)
  GA.fresh = (ctx, arr, keyFn = (x) => JSON.stringify(x)) => {
    ctx.used = ctx.used || new Set();
    const pool = arr.filter((x) => !ctx.used.has(keyFn(x)));
    const x = GA.pick(pool.length ? pool : arr);
    ctx.used.add(keyFn(x));
    return x;
  };
  // Opciones numéricas cercanas a la respuesta (distractores plausibles)
  GA.numOptions = (ans, n = 4, lo = 0, hi = 1000) => {
    const set = new Set([ans]);
    const cands = GA.shuffle([ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans + 3, ans - 3]);
    for (const c of cands) { if (set.size >= n) break; if (c >= lo && c <= hi) set.add(c); }
    let guard = 0;
    while (set.size < n && guard++ < 100) { const c = GA.rand(lo, hi); set.add(c); }
    return GA.shuffle([...set]);
  };
  GA.numWord = (n) => {
    const w = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];
    return w[n] || String(n);
  };

  // ---------- DOM ----------
  function append(el, kids) {
    for (const k of kids.flat(Infinity)) {
      if (k == null || k === false) continue;
      el.appendChild(k instanceof Node ? k : document.createTextNode(String(k)));
    }
  }
  GA.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    append(el, kids);
    return el;
  };
  GA.html = (str) => { const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstElementChild; };
  GA.$ = (sel, root = document) => root.querySelector(sel);
  GA.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Almacenamiento ----------
  const KEY = 'gael-aprende-v1';
  function freshProfile() {
    return {
      v: 1, name: '', avatar: '🦊', created: Date.now(), stars: 0, stickers: [], medals: [],
      skills: {}, days: {}, lessons: {}, lastSkill: null, dragons: {}, reading: [], gym: { pace: 30, max: 30 }, judo: { w: {}, belts: {} },
      settings: { voice: true, sfx: true, rate: 0.92, roundLen: 6, unlockAll: false, autoRead: true, voiceName: '' },
    };
  }
  GA.store = {
    data: null,
    load() {
      try { this.data = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { this.data = null; }
      return this.normalize();
    },
    normalize() {
      const base = freshProfile();
      if (!this.data || typeof this.data !== 'object') this.data = base;
      this.data.settings = Object.assign({}, base.settings, this.data.settings || {});
      for (const k in base) if (!(k in this.data)) this.data[k] = base[k];
      return this.data;
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* almacenamiento no disponible */ } },
    reset() { this.data = freshProfile(); this.save(); },
    exportText() { return JSON.stringify(this.data); },
    importText(txt) {
      const d = JSON.parse(txt);
      if (!d || typeof d !== 'object' || !d.skills) throw new Error('formato');
      this.data = d; this.normalize(); this.save();
    },
  };
  GA.settings = () => GA.store.data.settings;

  // ---------- Voz (síntesis en español) ----------
  const EMOJI_RE = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍⃣]/gu;
  // Voces "de juguete" de macOS/iOS: divertidas pero poco claras para aprender a leer
  const NOVELTY = /Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Junior|Kathy|Ralph|Fred/i;
  GA.voice = {
    v: null, vEn: null, vJa: null,
    score(v, want = 'es') {
      let s = 0;
      const lang = v.lang.replace('_', '-');
      if (want === 'en') {
        if (/en-US/i.test(lang)) s += 30; else if (/en-GB|en-CA|en-AU/i.test(lang)) s += 20;
        if (/Samantha|Ava|Allison|Susan|Zoe|Evan|Nathan/i.test(v.name)) s += 40; // voces claras de Apple
      } else if (want === 'ja') {
        if (/ja-JP/i.test(lang)) s += 30;
        if (/Kyoko|Otoya|O-ren|Hattori/i.test(v.name)) s += 40; // voces japonesas de Apple
      } else if (/es-MX/i.test(lang)) s += 30; else if (/es-US|es-419/i.test(lang)) s += 25; else if (/es-ES/i.test(lang)) s += 10;
      if (/Premium|Enhanced|Mejorada|Natural|Neural|Siri/i.test(v.name)) s += 200; // voces neuronales: casi humanas
      else if (/Google/i.test(v.name)) s += 120; // voz en línea de Chrome: clara y natural
      else if (/Microsoft .*Online/i.test(v.name)) s += 150;
      if (NOVELTY.test(v.name)) s -= 500;
      return s;
    },
    quality(v) {
      const sc = this.score(v);
      return sc >= 150 ? 'natural' : sc >= 100 ? 'buena' : sc < 0 ? 'divertida' : 'básica';
    },
    list(want = 'es') {
      if (!('speechSynthesis' in window)) return [];
      return speechSynthesis.getVoices().filter((v) => new RegExp('^' + want, 'i').test(v.lang)).sort((a, b) => this.score(b, want) - this.score(a, want));
    },
    choose() {
      this.vEn = this.list('en')[0] || null;
      this.vJa = this.list('ja')[0] || null;
      const vs = this.list();
      if (!vs.length) return;
      const wanted = GA.store.data && GA.settings().voiceName;
      this.v = (wanted && vs.find((v) => v.name === wanted)) || vs[0];
    },
    init() {
      if (!('speechSynthesis' in window)) return;
      this.choose();
      speechSynthesis.addEventListener('voiceschanged', () => { this.choose(); this.onchange && this.onchange(); });
    },
    say(text, opts = {}) {
      if (!text || !GA.settings().voice || !('speechSynthesis' in window)) return Promise.resolve();
      const clean = String(text).replace(/<[^>]+>/g, ' ').replace(EMOJI_RE, ' ').replace(/_+/g, ' ... ').replace(/\s+/g, ' ').trim();
      if (!clean) return Promise.resolve();
      speechSynthesis.cancel();
      return new Promise((res) => {
        const u = new SpeechSynthesisUtterance(clean);
        const v = opts.lang === 'en' ? this.vEn : opts.lang === 'ja' ? this.vJa : this.v;
        u.lang = v ? v.lang : { en: 'en-US', ja: 'ja-JP' }[opts.lang] || 'es-MX';
        if (v) u.voice = v;
        u.rate = opts.rate || GA.settings().rate || 0.92;
        u.pitch = opts.pitch || 1;
        let done = false;
        const fin = () => { if (!done) { done = true; res(); } };
        u.onend = fin; u.onerror = fin;
        setTimeout(() => speechSynthesis.speak(u), 40);
        setTimeout(fin, (600 + clean.length * (opts.lang === 'ja' ? 260 : 110)) * Math.max(1, 0.92 / u.rate)); // respaldo si no llega onend (más largo si habla despacio)
      });
    },
    stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); },
  };
  GA.say = (t, o) => GA.voice.say(t, o);

  // ---------- Efectos de sonido (sintetizados, sin archivos) ----------
  GA.sfx = {
    ctx: null,
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    tone(freq, start, dur, type = 'sine', vol = 0.18, glideTo) {
      const c = this.ctx;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, c.currentTime + start);
      if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + start + dur);
      g.gain.setValueAtTime(0.0001, c.currentTime + start);
      g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + 0.05);
    },
    play(name) {
      if (!GA.settings().sfx) return;
      if (!this.ensure()) return;
      const t = (f, s, d, ty, v, gl) => this.tone(f, s, d, ty, v, gl);
      switch (name) {
        case 'tap': t(660, 0, 0.07, 'triangle', 0.12); break;
        case 'pop': t(420, 0, 0.12, 'sine', 0.18, 900); break;
        case 'count': t(520 + Math.random() * 200, 0, 0.12, 'triangle', 0.14); break;
        case 'ok': t(523, 0, 0.14, 'triangle'); t(659, 0.1, 0.14, 'triangle'); t(784, 0.2, 0.3, 'triangle', 0.2); break;
        case 'bad': t(330, 0, 0.18, 'sine', 0.14, 280); t(262, 0.16, 0.25, 'sine', 0.12, 240); break;
        case 'star': t(1046, 0, 0.1, 'sine', 0.12); t(1318, 0.07, 0.1, 'sine', 0.12); t(1568, 0.14, 0.18, 'sine', 0.12); break;
        case 'level': [523, 659, 784, 1046, 784, 1046].forEach((f, i) => t(f, i * 0.11, i === 5 ? 0.5 : 0.13, 'square', 0.08)); break;
        case 'whoosh': t(200, 0, 0.35, 'sawtooth', 0.05, 1200); break;
        case 'splash': t(800, 0, 0.3, 'sawtooth', 0.04, 120); t(300, 0.05, 0.3, 'sine', 0.1, 90); break;
        case 'drum': t(120, 0, 0.25, 'sine', 0.4, 50); t(200, 0, 0.06, 'triangle', 0.2); break;
        case 'magnet': t(300, 0, 0.2, 'square', 0.05, 900); t(1200, 0.2, 0.08, 'triangle', 0.15); break;
        case 'flip': t(500, 0, 0.08, 'triangle', 0.1, 700); break;
        default: t(600, 0, 0.1);
      }
    },
  };

  // ---------- Mascota: Lumi ----------
  GA.mascot = function (mood = 'happy', size = 110) {
    const mouths = {
      happy: '<path d="M46 72 Q60 86 74 72" stroke="#2B2350" stroke-width="4.5" fill="#FF8FA3" stroke-linecap="round" stroke-linejoin="round"/>',
      wow: '<ellipse cx="60" cy="76" rx="7" ry="9" fill="#2B2350"/><ellipse cx="60" cy="80" rx="4" ry="3" fill="#FF8FA3"/>',
      think: '<path d="M50 76 Q58 72 70 76" stroke="#2B2350" stroke-width="4.5" fill="none" stroke-linecap="round"/>',
      calm: '<path d="M50 74 Q60 80 70 74" stroke="#2B2350" stroke-width="4.5" fill="none" stroke-linecap="round"/>',
    };
    const py = mood === 'think' ? -4 : 0, px = mood === 'think' ? 3 : 0;
    return `<svg class="lumi lumi-${mood}" viewBox="0 0 120 130" width="${size}" height="${Math.round(size * 130 / 120)}" aria-hidden="true">
      <defs><radialGradient id="lumiG" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#A6ECFF"/><stop offset=".55" stop-color="#55B4FF"/><stop offset="1" stop-color="#3C7BF0"/></radialGradient></defs>
      <g class="bob">
        <ellipse cx="60" cy="124" rx="30" ry="5" fill="rgba(0,0,0,.1)"/>
        <line x1="60" y1="24" x2="60" y2="10" stroke="#3C7BF0" stroke-width="4" stroke-linecap="round"/>
        <g class="glow"><polygon points="60,-2 63.5,5.5 71.5,6.5 65.5,11.5 67.5,19.5 60,15.5 52.5,19.5 54.5,11.5 48.5,6.5 56.5,5.5" fill="#FFC233" stroke="#F0A500" stroke-width="1.5"/></g>
        <ellipse class="arm-l" cx="16" cy="82" rx="9" ry="14" fill="#3C7BF0" transform="rotate(20 16 82)"/>
        <ellipse class="arm-r" cx="104" cy="82" rx="9" ry="14" fill="#3C7BF0" transform="rotate(-20 104 82)"/>
        <path d="M60 22 C96 22 108 50 108 76 C108 106 88 120 60 120 C32 120 12 106 12 76 C12 50 24 22 60 22Z" fill="url(#lumiG)"/>
        <ellipse cx="60" cy="98" rx="28" ry="17" fill="#fff" opacity=".35"/>
        <ellipse cx="42" cy="114" rx="11" ry="6" fill="#3C7BF0"/><ellipse cx="78" cy="114" rx="11" ry="6" fill="#3C7BF0"/>
        <g class="blink">
          <ellipse cx="44" cy="54" rx="12.5" ry="14.5" fill="#fff"/><ellipse cx="76" cy="54" rx="12.5" ry="14.5" fill="#fff"/>
          <circle cx="${46 + px}" cy="${56 + py}" r="7" fill="#2B2350"/><circle cx="${78 + px}" cy="${56 + py}" r="7" fill="#2B2350"/>
          <circle cx="${48 + px}" cy="${53 + py}" r="2.4" fill="#fff"/><circle cx="${80 + px}" cy="${53 + py}" r="2.4" fill="#fff"/>
        </g>
        <ellipse cx="30" cy="72" rx="7" ry="4.5" fill="#FF8FB1" opacity=".75"/><ellipse cx="90" cy="72" rx="7" ry="4.5" fill="#FF8FB1" opacity=".75"/>
        ${mouths[mood] || mouths.happy}
      </g></svg>`;
  };

  // ---------- Confeti ----------
  GA.confetti = function (amount = 90, originY = 0.35) {
    const cv = document.getElementById('confetti');
    if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#FFC233', '#7656F5', '#12A876', '#FF7433', '#3D8BFF', '#FF6B9A'];
    const ps = [];
    for (let i = 0; i < amount; i++) {
      ps.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * originY,
        vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4,
        c: GA.pick(colors), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, shape: Math.random() < 0.5,
      });
    }
    let frames = 0;
    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of ps) {
        p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.shape) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.7, 0, 6.3); ctx.fill(); }
        ctx.restore();
      }
      if (frames++ < 140) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    tick();
  };

  // Estrella que vuela desde un elemento hasta el contador
  GA.flyStar = function (fromEl, toEl) {
    if (!fromEl || !toEl) return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const s = GA.h('div', { class: 'sparkle' }, '⭐');
    s.style.left = a.left + a.width / 2 - 18 + 'px';
    s.style.top = a.top + a.height / 2 - 18 + 'px';
    document.body.appendChild(s);
    requestAnimationFrame(() => {
      s.style.transform = `translate(${b.left - a.left - a.width / 2 + 18}px, ${b.top - a.top - a.height / 2 + 6}px) scale(.6)`;
    });
    setTimeout(() => { s.remove(); toEl.classList.remove('pop'); void toEl.offsetWidth; toEl.classList.add('pop'); GA.sfx.play('star'); }, 820);
  };

  // ---------- Arrastrar y soltar (ratón y pantallas táctiles) ----------
  // o.zones: selector o función que devuelve zonas; o.onDrop(zone, el) -> false para regresar; o.onTap(el)
  GA.drag = function (el, o = {}) {
    el.classList.add('draggable');
    el.addEventListener('pointerdown', (e) => {
      if (el.classList.contains('locked') || (e.button !== undefined && e.button > 0)) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      let moved = false, over = null;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
      const zones = () => (typeof o.zones === 'function' ? o.zones() : GA.$$(o.zones || '.dropzone'));
      const hit = (x, y) => zones().find((z) => {
        if (z === el || el.contains(z)) return false;
        const r = z.getBoundingClientRect();
        return x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6;
      });
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 8) return;
        if (!moved) { moved = true; el.classList.add('dragging'); GA.sfx.play('tap'); o.onStart && o.onStart(el); }
        el.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
        const z = hit(ev.clientX, ev.clientY);
        if (z !== over) { over && over.classList.remove('over'); over = z; z && z.classList.add('over'); }
      };
      const up = (ev) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        over && over.classList.remove('over');
        el.classList.remove('dragging');
        if (!moved) { el.style.transform = ''; o.onTap && o.onTap(el); return; }
        const z = ev.type === 'pointercancel' ? null : hit(ev.clientX, ev.clientY);
        const ok = z && o.onDrop ? o.onDrop(z, el) !== false : false;
        if (!ok) el.classList.add('returning');
        el.style.transform = '';
        setTimeout(() => el.classList.remove('returning'), 300);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  };
})();
