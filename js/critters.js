/* Gael Aprende — arte de la colección: retratos tipo estampa de dragones y Milkeritos.
   Cabezas grandes, ojos enormes con brillos, borde blanco de estampa y fondo pastel con destellos. */
(function () {
  'use strict';
  let uid = 0;
  const hex = (s) => s.replace('#', '').match(/\w\w/g).map((x) => parseInt(x, 16));
  const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const f1 = (n) => +n.toFixed(1);
  const star4 = (x, y, r, fill, op = 1) => `<path d="M${f1(x)} ${f1(y - r)} Q${f1(x + r * 0.16)} ${f1(y - r * 0.16)} ${f1(x + r)} ${f1(y)} Q${f1(x + r * 0.16)} ${f1(y + r * 0.16)} ${f1(x)} ${f1(y + r)} Q${f1(x - r * 0.16)} ${f1(y + r * 0.16)} ${f1(x - r)} ${f1(y)} Q${f1(x - r * 0.16)} ${f1(y - r * 0.16)} ${f1(x)} ${f1(y - r)}Z" fill="${fill}" opacity="${op}"/>`;
  const mirror = (s, w) => s + `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>`;
  const sticker = (id, r) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feMorphology in="SourceAlpha" operator="dilate" radius="${r}" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="o"/><feGaussianBlur in="d" stdDeviation="4" result="b"/><feOffset in="b" dy="5" result="b2"/><feFlood flood-color="#1B1440" flood-opacity=".25"/><feComposite in2="b2" operator="in" result="sh"/><feMerge><feMergeNode in="sh"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  const blur = (id, s) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${s}"/></filter>`;

  // Ojo grande y brillante. s = -1 ojo izquierdo, 1 ojo derecho (para las pestañas)
  function eye(p, cx, cy, rx, ry, s, lashes) {
    const ir = Math.min(rx, ry) * 0.86;
    let out = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/>
      <circle cx="${cx}" cy="${f1(cy + ry * 0.1)}" r="${f1(ir)}" fill="url(#${p}i)"/>
      <ellipse cx="${cx}" cy="${f1(cy + ry * 0.14)}" rx="${f1(ir * 0.48)}" ry="${f1(ir * 0.56)}" fill="#140B22"/>
      <circle cx="${f1(cx + ir * 0.36)}" cy="${f1(cy - ry * 0.3)}" r="${f1(ir * 0.36)}" fill="#fff"/>
      <circle cx="${f1(cx - ir * 0.4)}" cy="${f1(cy + ry * 0.42)}" r="${f1(ir * 0.17)}" fill="#fff" opacity=".9"/>
      ${star4(cx - ir * 0.3, cy - ry * 0.32, ir * 0.17, '#ffffff', 0.85)}
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#1C1430" stroke-width="${f1(rx * 0.07)}" opacity=".85"/>
      <path d="M${f1(cx - rx * 0.92)} ${f1(cy - ry * 0.38)} A ${rx} ${ry} 0 0 1 ${f1(cx + rx * 0.92)} ${f1(cy - ry * 0.38)}" stroke="#1C1430" stroke-width="${f1(rx * 0.13)}" fill="none" stroke-linecap="round"/>`;
    if (lashes) {
      [42, 62, 82].forEach((a, i) => {
        const r = (a * Math.PI) / 180;
        const x = cx + s * rx * Math.sin(r), y = cy - ry * 0.95 * Math.cos(r);
        out += `<path d="M${f1(x)} ${f1(y)} l${f1(s * (5 + i))} ${f1(-6 + i * 2.5)}" stroke="#1C1430" stroke-width="${f1(rx * 0.11)}" stroke-linecap="round"/>`;
      });
    }
    return out;
  }
  function sparkles(n, w, hgt, seed, color = '#ffffff') {
    let out = '';
    for (let i = 0; i < n; i++) {
      const x = ((seed * 37 + i * 71) % 100) / 100 * (w - 24) + 12;
      const y = ((seed * 53 + i * 43) % 100) / 100 * (hgt - 24) + 12;
      out += `<g class="tw" style="animation-delay:${(i * 0.37) % 2}s">${star4(x, y, 3 + ((i * 7) % 6), color, 0.9)}</g>`;
    }
    return out;
  }
  const crown = (x, y, rot, k = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})"><path d="M-18 8 L-18 -8 L-9 0 L0 -14 L9 0 L18 -8 L18 8 Z" fill="#FFD23F" stroke="#B8860B" stroke-width="2.5" stroke-linejoin="round"/><rect x="-18" y="5" width="36" height="5" fill="#F0B400"/><circle cx="0" cy="1" r="3" fill="#FF4D6D"/><circle cx="-11" cy="2" r="2" fill="#4DABF7"/><circle cx="11" cy="2" r="2" fill="#4DABF7"/></g>`;

  // ---------- Marcas de elemento (en la frente del dragón) ----------
  function mark(kind, c) {
    const st = 'stroke="#fff" stroke-width="2.5" stroke-linejoin="round"';
    switch (kind) {
      case 'fuego': case 'lava': return `<path d="M0 12 C -12 6 -10 -6 -2 -14 C -1 -6 8 -6 8 2 C 8 8 4 12 0 12Z" fill="${c[5]}" ${st}/><path d="M0 9 C -4 6 -3 0 0 -4 C 1 0 4 1 3 5 C 3 8 1 9 0 9Z" fill="#FFF3B0"/>`;
      case 'agua': return `<path d="M0 -13 C 6 -4 10 1 10 5 A 10 10 0 0 1 -10 5 C -10 1 -6 -4 0 -13Z" fill="${c[4]}" ${st}/><circle cx="-3" cy="3" r="2.5" fill="#fff" opacity=".8"/>`;
      case 'bosque': return `<path d="M0 12 C -14 4 -10 -12 6 -14 C 10 -2 8 8 0 12Z" fill="#7FD36E" ${st}/><path d="M0 12 L4 -10" stroke="#2C8A3A" stroke-width="1.6"/>`;
      case 'roca': return `<polygon points="0,-12 10,-3 6,10 -6,10 -10,-3" fill="${c[5]}" ${st}/><polygon points="0,-12 10,-3 0,-1" fill="#fff" opacity=".6"/>`;
      case 'hielo': return `<g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M0 -12 V12 M-10 -6 L10 6 M-10 6 L10 -6"/></g><g stroke="#4DA3E8" stroke-width="2" stroke-linecap="round"><path d="M0 -12 V12 M-10 -6 L10 6 M-10 6 L10 -6"/></g>`;
      case 'trueno': return `<polygon points="3,-14 -8,2 0,2 -4,14 9,-3 1,-3 6,-14" fill="${c[0]}" ${st}/>`;
      case 'flor': return [0, 72, 144, 216, 288].map((a) => `<ellipse cy="-7" rx="5" ry="7.5" fill="#fff" transform="rotate(${a})"/>`).join('') + `<circle r="4.5" fill="${c[5]}"/>`;
      case 'nube': return `<g fill="#fff" stroke="#A9C7FF" stroke-width="1.5"><circle cx="-7" cy="2" r="6"/><circle cx="1" cy="-3" r="8"/><circle cx="8" cy="3" r="5.5"/></g>`;
      case 'cristal': return `<polygon points="0,-14 7,-2 0,12 -7,-2" fill="${c[5]}" ${st}/><polygon points="-9,2 -4,-6 -2,8" fill="#fff" opacity=".9"/><polygon points="9,2 4,-6 2,8" fill="${c[4]}" ${st}/>`;
      case 'sombra': return `<path d="M3 -12 A 12 12 0 1 0 5 10 A 9 9 0 1 1 3 -12Z" fill="${c[5]}" ${st}/>`;
      case 'galaxia': return `<polygon points="0,-13 3.5,-4 13,-4 5.5,2 8,12 0,6 -8,12 -5.5,2 -13,-4 -3.5,-4" fill="${c[5]}" ${st}/>`;
      case 'arcoiris': return ['#FF6B6B', '#FFB347', '#FFE45C', '#6BE38A', '#5AB8FF', '#A97BFF'].map((col, i) => `<path d="M${-14 + i * 2} 6 A ${14 - i * 2} ${14 - i * 2} 0 0 1 ${14 - i * 2} 6" stroke="${col}" stroke-width="2.4" fill="none"/>`).join('');
      case 'oro': return `<g fill="#fff">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<polygon points="-2.5,-8 2.5,-8 0,-14" transform="rotate(${a})"/>`).join('')}</g><circle r="7" fill="#FFD23F" stroke="#fff" stroke-width="2"/>`;
    }
    return '';
  }

  // ---------- Dragón ----------
  const HEADS = {
    round: 'M150 44 C 204 44 234 80 232 118 C 230 158 198 182 150 182 C 102 182 70 158 68 118 C 66 80 96 44 150 44Z',
    tall: 'M150 38 C 200 38 226 76 226 116 C 226 158 196 184 150 184 C 104 184 74 158 74 116 C 74 76 100 38 150 38Z',
    wide: 'M150 50 C 210 50 242 82 240 120 C 238 160 202 182 150 182 C 98 182 62 160 60 120 C 58 82 90 50 150 50Z',
  };
  function dragonArt(d, stage = 1, o = {}) {
    const e = d.e, b = d.b, c = e.c, p = 'cr' + ++uid;
    const size = o.size || 150, sil = !!o.sil;
    const dark = c[1], horn = c[5], hornD = mix(c[5], '#000000', 0.35);
    const ey = b.shape === 'tall' ? 106 : 112;
    let back = '', front = '';
    const hornPaint = `fill="url(#${p}hn)" stroke="${hornD}" stroke-width="2.5" stroke-linejoin="round"`;
    switch (b.id) {
      case 'chispa':
        back += mirror(`<path d="M92 100 C 64 70 32 64 10 78 C 28 86 30 96 26 110 C 42 102 52 110 54 124 C 62 114 74 114 80 124 C 82 112 86 104 92 100Z" fill="url(#${p}w)" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/><path d="M90 102 L14 80 M88 106 L30 108 M86 110 L56 122" stroke="${dark}" stroke-width="2.4" opacity=".45" fill="none"/>`, 300);
        back += mirror(`<path d="M118 60 C 112 42 104 34 92 30 C 98 42 100 52 102 66Z" ${hornPaint}/>`, 300);
        break;
      case 'pluma':
        [-64, -43, -22, 0, 22, 43, 64].forEach((a, i) => {
          back += `<path d="M140 76 Q 146 ${i === 3 ? 6 : 16} 150 ${i === 3 ? -6 : 4} Q 154 ${i === 3 ? 6 : 16} 160 76Z" fill="${i % 2 ? c[4] : horn}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round" transform="rotate(${a} 150 82)"/>`;
        });
        back += mirror(`<path d="M80 128 L50 120 L78 140Z" fill="${horn}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/>`, 300);
        break;
      case 'aleta':
        back += mirror([0, 1, 2].map((i) => `<g transform="translate(${80 - i * 2} ${88 + i * 25}) rotate(${-32 + i * 30})"><path d="M0 0 C -14 -13 -44 -13 -52 0 C -44 13 -14 13 0 0Z" fill="${i % 2 ? c[4] : horn}" stroke="${dark}" stroke-width="2.5"/><path d="M-6 0 H-44" stroke="${dark}" stroke-width="1.8" opacity=".35"/></g>`).join(''), 300);
        back += `<path d="M120 60 Q 150 14 180 60Z" fill="${c[4]}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><path d="M150 26 V58 M136 40 L142 58 M164 40 L158 58" stroke="${dark}" stroke-width="1.6" opacity=".35"/>`;
        break;
      case 'mariposa':
        back += mirror(`<path d="M98 86 C 72 36 22 34 20 70 C 18 98 60 106 98 100Z" fill="${c[4]}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/><path d="M98 106 C 64 110 38 130 48 150 C 58 166 90 142 100 120Z" fill="${horn}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="70" r="11" fill="${horn}" opacity=".9"/><circle cx="44" cy="70" r="4" fill="#fff" opacity=".8"/><circle cx="64" cy="136" r="6" fill="${c[4]}"/>`, 300);
        back += mirror(`<path d="M134 54 C 128 32 116 20 102 18" stroke="${dark}" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="101" cy="18" r="9" fill="${horn}" stroke="${dark}" stroke-width="2.5"/>`, 300);
        break;
      case 'rey':
        back += mirror(`<path d="M114 64 C 94 26 46 22 36 58 C 30 88 62 102 78 86 C 90 74 76 58 64 64 C 70 52 88 54 98 72Z" ${hornPaint}/><path d="M54 36 l7 11 M40 50 l11 6 M38 70 l12 0" stroke="${hornD}" stroke-width="2.4" opacity=".55" stroke-linecap="round"/>`, 300);
        front += `<path d="M128 176 L136 196 L146 180Z M154 180 L164 196 L172 176Z" fill="${horn}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/>`;
        break;
      case 'unicornio':
        back += mirror(`<path d="M104 70 L 82 30 L 122 56Z" fill="${c[0]}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><path d="M104 64 L 90 40 L 114 56Z" fill="${c[3]}"/>`, 300);
        front += `<path d="M140 56 L150 -2 L160 56Z" ${hornPaint}/><path d="M143 44 L157 38 M145 31 L155 26 M147 18 L153 14" stroke="${hornD}" stroke-width="2.2" opacity=".55"/>`;
        {
          const mane = e.id === 'arcoiris' ? ['#FF6B6B', '#FFB347', '#FFE45C', '#6BE38A', '#5AB8FF'] : [horn, c[4], horn, c[4], horn];
          front += [[118, 60, 15], [104, 72, 13], [132, 52, 12], [96, 88, 11], [124, 70, 9]].map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${mane[i]}" stroke="${dark}" stroke-width="2"/>`).join('');
        }
        break;
    }
    // Patrones especiales
    let pat = `<path d="M136 66 q4 4 8 0 M152 62 q4 4 8 0 M160 72 q4 4 8 0 M126 76 q4 4 8 0 M144 76 q4 4 8 0" stroke="${dark}" stroke-width="2" fill="none" opacity=".22"/>`;
    if (e.id === 'galaxia' || e.id === 'sombra') pat += [[110, 70], [196, 80], [92, 128], [208, 128], [170, 60], [128, 172], [176, 170]].map(([x, y], i) => star4(x, y, 2 + (i % 3), '#ffffff', 0.9)).join('');
    if (e.id === 'lava') pat += `<g stroke="${c[5]}" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#${p}g)"><path d="M84 128 l10 6 l-3 8"/><path d="M216 128 l-10 6 l3 8"/><path d="M120 60 l8 6"/></g>`;
    if (e.id === 'arcoiris') pat += `<path d="M96 78 A 54 54 0 0 1 204 78" stroke="#fff" stroke-width="5" fill="none" opacity=".35"/>`;
    const head = HEADS[b.shape];
    const eyes = eye(p, 114, ey, 25, 27, -1, b.lashes) + eye(p, 186, ey, 25, 27, 1, b.lashes);
    const mouth = b.fangs
      ? `<path d="M126 158 Q150 176 174 158" stroke="#3A2440" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M136 161 L140 170 L145 163Z M164 161 L160 170 L155 163Z" fill="#fff" stroke="#3A2440" stroke-width="1.5" stroke-linejoin="round"/>`
      : `<path d="M128 158 Q150 182 172 158 Q150 166 128 158Z" fill="#5A2140"/><ellipse cx="150" cy="169" rx="9" ry="5" fill="#FF7FA0"/>`;
    const auraEl = stage >= 3 && !sil ? `<circle cx="150" cy="112" r="104" fill="url(#${p}a)"/>` : '';
    const crownEl = stage === 4 ? crown(b.id === 'unicornio' || b.id === 'pluma' ? 206 : 196, b.shape === 'tall' ? 52 : 58, 20) : '';
    const bg = sil ? '' : `<rect x="2" y="2" width="296" height="196" rx="28" fill="url(#${p}bg)"${stage === 4 ? ' stroke="#FFD23F" stroke-width="6"' : ''}/>
      <circle cx="40" cy="160" r="26" fill="#fff" opacity=".18"/><circle cx="262" cy="40" r="20" fill="#fff" opacity=".18"/><circle cx="250" cy="170" r="12" fill="#fff" opacity=".2"/>
      ${sparkles(4 + stage * 2, 300, 200, d.seed)}`;
    const W = 300, H = 200;
    return `<svg class="critter dragon-art${o.anim === false ? '' : ' anim'}${sil ? ' sil' : ''}" viewBox="0 0 ${W} ${H}" width="${size}" height="${Math.round(size * H / W)}" role="img" aria-label="${d.name}">
      <defs>
        <radialGradient id="${p}bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${e.bg[0]}"/><stop offset="1" stop-color="${e.bg[1]}"/></radialGradient>
        <radialGradient id="${p}h" cx="40%" cy="28%" r="80%"><stop offset="0" stop-color="${c[2]}"/><stop offset=".5" stop-color="${c[0]}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
        <radialGradient id="${p}m" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${c[3]}"/></radialGradient>
        <radialGradient id="${p}i" cx="50%" cy="32%" r="68%"><stop offset="0" stop-color="${mix(c[6], '#ffffff', 0.55)}"/><stop offset=".55" stop-color="${c[6]}"/><stop offset="1" stop-color="${mix(c[6], '#000000', 0.5)}"/></radialGradient>
        <linearGradient id="${p}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[4]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>
        <linearGradient id="${p}hn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(horn, '#ffffff', 0.4)}"/><stop offset="1" stop-color="${mix(horn, dark, 0.35)}"/></linearGradient>
        <linearGradient id="${p}sh" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="${dark}" stop-opacity="0"/><stop offset="1" stop-color="${dark}" stop-opacity=".35"/></linearGradient>
        <radialGradient id="${p}a"><stop offset="0" stop-color="${c[5]}" stop-opacity=".6"/><stop offset="1" stop-color="${c[5]}" stop-opacity="0"/></radialGradient>
        ${sticker(p + 's', 6)}${blur(p + 'b', 3)}${blur(p + 'g', 1.2)}
      </defs>
      ${bg}${auraEl}
      <g transform="translate(150 ${b.id === 'pluma' || b.id === 'unicornio' ? 112 : 104}) scale(0.8) translate(-150 -110)"><g class="cr-body" ${sil ? '' : `filter="url(#${p}s)"`}>
        <g class="cr-back">${back}</g>
        <path d="${head}" fill="${e.id === 'arcoiris' ? `url(#${p}h)` : `url(#${p}h)`}" stroke="${dark}" stroke-width="3"/>
        <path d="${head}" fill="url(#${p}sh)"/>
        <ellipse cx="128" cy="${b.shape === 'tall' ? 62 : 68}" rx="34" ry="13" fill="#fff" opacity=".28" transform="rotate(-12 128 66)"/>
        ${pat}
        <ellipse cx="150" cy="148" rx="46" ry="29" fill="url(#${p}m)"/>
        <ellipse cx="140" cy="134" rx="16" ry="5" fill="#fff" opacity=".55"/>
        <ellipse cx="137" cy="140" rx="4.5" ry="3" fill="${dark}" transform="rotate(-25 137 140)"/><ellipse cx="163" cy="140" rx="4.5" ry="3" fill="${dark}" transform="rotate(25 163 140)"/>
        ${mouth}
        <ellipse cx="96" cy="${ey + 32}" rx="15" ry="9" fill="#FF7FA8" opacity=".55" filter="url(#${p}b)"/><ellipse cx="204" cy="${ey + 32}" rx="15" ry="9" fill="#FF7FA8" opacity=".55" filter="url(#${p}b)"/>
        <g class="cr-eyes">${eyes}</g>
        ${b.id === 'unicornio' ? '' : `<g transform="translate(150 ${ey - 40})">${mark(e.id, c)}</g>`}
        ${front}${crownEl}
      </g></g>
    </svg>`;
  }

  // ---------- Milkerito ----------
  function topping(kind, c) {
    switch (kind) {
      case 'flor': return [0, 72, 144, 216, 288].map((a) => `<ellipse cy="-9" rx="6.5" ry="10" fill="#FFFDF4" stroke="#E8D9A8" stroke-width="1.5" transform="rotate(${a})"/>`).join('') + `<circle r="6" fill="#FFD23F"/>`;
      case 'bombon': return `<path d="M-16 6 C -16 -12 16 -12 16 6 Z" fill="#6E3B22" stroke="#4A2412" stroke-width="2"/><path d="M-14 -2 q4 4 8 0 q4 4 8 0 q4 4 8 0" stroke="#C98A5A" stroke-width="2.5" fill="none"/><circle cx="0" cy="-12" r="5" fill="#E2263B"/><path d="M0 -16 q4 -8 8 -10" stroke="#3E7B27" stroke-width="2" fill="none"/>`;
      case 'fresa': return `<path d="M0 18 C -17 10 -18 -6 -10 -12 C -4 -16 4 -16 10 -12 C 18 -6 17 10 0 18Z" fill="#F23B4C" stroke="#B81D30" stroke-width="2"/><g fill="#FFE27A">${[[-6, -4], [4, -6], [-2, 4], [7, 4], [-8, 6], [1, 11]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2"/>`).join('')}</g><path d="M-12 -12 L-4 -16 L0 -24 L4 -16 L12 -12 L4 -11 L0 -14 L-4 -11Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.5" stroke-linejoin="round"/>`;
      case 'platano': return `<path d="M-18 -6 C -12 14 14 16 20 -2 C 12 6 -6 6 -18 -6Z" fill="#FFE14D" stroke="#C9A100" stroke-width="2" stroke-linejoin="round"/><path d="M-18 -6 l-3 -3 M20 -2 l3 -2" stroke="#6B4E00" stroke-width="3" stroke-linecap="round"/>`;
      case 'menta': return `<path d="M0 6 C -18 0 -18 -16 -4 -20 C 0 -10 2 0 0 6Z" fill="#5FD39A" stroke="#2E9E6A" stroke-width="2"/><path d="M0 6 C 18 0 18 -16 4 -20 C 0 -10 -2 0 0 6Z" fill="#7FE3B0" stroke="#2E9E6A" stroke-width="2"/><path d="M0 4 L-4 -16 M0 4 L4 -16" stroke="#2E9E6A" stroke-width="1.3"/>`;
      case 'galleta': return `<circle r="16" fill="#D9A066" stroke="#A86B32" stroke-width="2.5"/><g fill="#5A3424"><circle cx="-6" cy="-5" r="2.8"/><circle cx="6" cy="-7" r="2.4"/><circle cx="3" cy="5" r="3"/><circle cx="-8" cy="7" r="2.2"/><circle cx="10" cy="3" r="2"/></g>`;
      case 'coco': return `<path d="M-18 4 A 18 18 0 0 1 18 4 Z" fill="#8B5E3C" stroke="#5A3A22" stroke-width="2"/><path d="M-13 4 A 13 13 0 0 1 13 4 Z" fill="#FFFDF6"/><path d="M-6 -6 l2 2 M4 -9 l1 3" stroke="#5A3A22" stroke-width="1.5"/>`;
      case 'limon': return `<circle r="16" fill="#FFE14D" stroke="#E0B800" stroke-width="2.5"/><circle r="12" fill="#FFF6A8"/>${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 0 L0 -11" stroke="#FFE14D" stroke-width="2" transform="rotate(${a})"/>`).join('')}`;
      case 'mora': return `<g fill="#5B2A86" stroke="#3B1660" stroke-width="1.2">${[[-6, 0], [0, -4], [6, 0], [-3, 6], [3, 6], [0, 12], [-8, -8], [8, -8], [0, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g><g fill="#fff" opacity=".6">${[[-7, -2], [-1, -6], [5, -2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4"/>`).join('')}</g><path d="M-2 -16 C -8 -24 4 -26 6 -20Z" fill="#4CAF50"/>`;
      case 'caramelo': return `<ellipse rx="13" ry="10" fill="#F28C28" stroke="#B85E0E" stroke-width="2"/><path d="M-13 0 L-24 -8 L-22 8Z M13 0 L24 -8 L22 8Z" fill="#FFB347" stroke="#B85E0E" stroke-width="2" stroke-linejoin="round"/><path d="M-6 -6 q6 12 12 0" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>`;
      case 'cereza': return `<path d="M-6 6 C -4 -10 4 -18 10 -22 M8 6 C 8 -8 8 -16 10 -22" stroke="#3E7B27" stroke-width="2.4" fill="none"/><circle cx="-7" cy="9" r="9" fill="#E2263B" stroke="#A3121F" stroke-width="2"/><circle cx="9" cy="9" r="9" fill="#F0384A" stroke="#A3121F" stroke-width="2"/><circle cx="-10" cy="6" r="2.5" fill="#fff" opacity=".7"/><circle cx="6" cy="6" r="2.5" fill="#fff" opacity=".7"/><path d="M10 -22 C 18 -26 22 -18 16 -16Z" fill="#4CAF50"/>`;
      case 'algodon': return `<path d="M0 6 L0 20" stroke="#E8D9C0" stroke-width="4" stroke-linecap="round"/><g stroke="#fff" stroke-width="1.5"><circle cx="-9" cy="-2" r="10" fill="#FFB3E0"/><circle cx="8" cy="-4" r="11" fill="#A9D8FF"/><circle cx="0" cy="-12" r="10" fill="#FFC9EC"/><circle cx="0" cy="2" r="8" fill="#C9E6FF"/></g>`;
      case 'planeta': return `<circle r="12" fill="#FF8FC0" stroke="#C04D9A" stroke-width="2"/><ellipse rx="22" ry="6" fill="none" stroke="#FFD95A" stroke-width="3.5" transform="rotate(-18)"/><path d="M-12 -2 A 12 12 0 0 1 12 -2" fill="none" stroke="#FFD95A" stroke-width="3.5" transform="rotate(-18)" opacity="0"/><circle cx="-4" cy="-4" r="3" fill="#fff" opacity=".6"/>`;
      case 'miel': return `<path d="M-14 -8 h28 v4 c0 18 -4 22 -14 22 c-10 0 -14 -4 -14 -22Z" fill="#F5A300" stroke="#B87400" stroke-width="2"/><rect x="-16" y="-14" width="32" height="7" rx="3" fill="#C98A5A" stroke="#8B5E3C" stroke-width="1.5"/><path d="M-6 -4 v8" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/><g transform="translate(14 -16)"><ellipse rx="6" ry="4.5" fill="#FFD23F" stroke="#3A2A00" stroke-width="1.2"/><path d="M-2 -4 v8 M2 -4 v8" stroke="#3A2A00" stroke-width="1.6"/><ellipse cx="-1" cy="-6" rx="4" ry="2.5" fill="#fff" opacity=".85"/></g>`;
    }
    return '';
  }
  function milkArt(d, stage = 1, o = {}) {
    const f = d.e, a = d.b, c = f.c, p = 'mk' + ++uid;
    const size = o.size || 150, sil = !!o.sil;
    const out = c[1];
    const spots = f.id === 'galleta'
      ? `<g fill="${c[4]}">${[[60, 76, 4], [72, 64, 3], [140, 70, 4], [130, 58, 3], [148, 118, 3.5], [54, 116, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`
      : f.id === 'galaxia'
        ? [[58, 78], [140, 72], [146, 120], [54, 118], [128, 56], [72, 60]].map(([x, y], i) => star4(x, y, 3 + (i % 3), c[4], 0.95)).join('')
        : `<g fill="${c[4]}"><path d="M48 84 C 46 66 62 58 74 64 C 82 70 78 86 66 90 C 58 92 50 90 48 84Z"/><path d="M134 118 C 140 106 156 108 156 122 C 156 134 142 138 136 130Z"/><circle cx="134" cy="66" r="7"/></g>`;
    const tuft = `<g fill="${c[2]}" stroke="${mix(c[2], out, 0.35)}" stroke-width="1.6">${[[88, 54, 12], [112, 54, 12], [100, 47, 13], [94, 62, 10], [107, 62, 10]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M93 54 q7 -9 14 0 q3 7 -5 8" stroke="${mix(c[2], out, 0.4)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    let acc = '';
    if (a.id === 'campana') acc = `<path d="M60 164 Q100 184 140 164" stroke="#E2475C" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M90 176 C 90 162 110 162 110 176 L112 186 H88Z" fill="#FFD23F" stroke="#B8860B" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="188" r="3.5" fill="#B8860B"/><path d="M95 170 q3 -4 6 -2" stroke="#fff" stroke-width="2" fill="none"/>`;
    if (a.id === 'mono') acc = `<g transform="translate(138 56) rotate(18)"><path d="M0 0 L-20 -12 L-18 12Z M0 0 L20 -12 L18 12Z" fill="#FF5C8A" stroke="#C2185B" stroke-width="2" stroke-linejoin="round"/><circle r="6" fill="#FF7FA8" stroke="#C2185B" stroke-width="2"/><path d="M-14 -6 l6 4 M14 -6 l-6 4" stroke="#fff" stroke-width="1.6" opacity=".7"/></g>`;
    if (a.id === 'flores') acc = [[62, 62, '#FF8FC0'], [80, 46, '#FFD23F'], [120, 46, '#8FD8FF'], [138, 62, '#B8F35B']].map(([x, y, col]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((r) => `<ellipse cy="-5" rx="3.5" ry="5.5" fill="${col}" stroke="#fff" stroke-width="1" transform="rotate(${r})"/>`).join('')}<circle r="3" fill="#fff"/></g>`).join('');
    if (a.id === 'bufanda') acc = `<path d="M54 160 Q100 186 146 160 L150 176 Q100 202 50 176Z" fill="${c[5]}" stroke="${mix(c[5], '#000000', 0.3)}" stroke-width="2.5" stroke-linejoin="round"/><path d="M128 170 L134 198 L148 196 L140 168Z" fill="${c[5]}" stroke="${mix(c[5], '#000000', 0.3)}" stroke-width="2.5" stroke-linejoin="round"/><path d="M62 170 Q100 190 138 170" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="6 6" opacity=".7"/>`;
    const bg = sil ? '' : `<circle cx="100" cy="100" r="98" fill="url(#${p}bg)"${stage === 4 ? ' stroke="#FFD23F" stroke-width="6"' : ''}/>${sparkles(4 + stage * 2, 200, 200, d.seed)}`;
    const auraEl = stage >= 3 && !sil ? `<circle cx="100" cy="104" r="96" fill="url(#${p}a)"/>` : '';
    return `<svg class="critter milk-art${o.anim === false ? '' : ' anim'}${sil ? ' sil' : ''}" viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="${d.name}">
      <defs>
        <radialGradient id="${p}bg" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${f.bg}"/></radialGradient>
        <radialGradient id="${p}f" cx="42%" cy="30%" r="80%"><stop offset="0" stop-color="${c[2]}"/><stop offset=".55" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>
        <radialGradient id="${p}n" cx="50%" cy="30%" r="75%"><stop offset="0" stop-color="${mix(c[3], '#ffffff', 0.5)}"/><stop offset="1" stop-color="${c[3]}"/></radialGradient>
        <radialGradient id="${p}i" cx="50%" cy="32%" r="68%"><stop offset="0" stop-color="${mix(c[6], '#ffffff', 0.5)}"/><stop offset=".55" stop-color="${c[6]}"/><stop offset="1" stop-color="${mix(c[6], '#000000', 0.55)}"/></radialGradient>
        <linearGradient id="${p}sh" x1="0" y1="0" x2="0" y2="1"><stop offset=".6" stop-color="${c[1]}" stop-opacity="0"/><stop offset="1" stop-color="${c[1]}" stop-opacity=".3"/></linearGradient>
        <radialGradient id="${p}a"><stop offset="0" stop-color="${c[5]}" stop-opacity=".55"/><stop offset="1" stop-color="${c[5]}" stop-opacity="0"/></radialGradient>
        <clipPath id="${p}c"><circle cx="100" cy="100" r="98"/></clipPath>
        ${sticker(p + 's', 5)}${blur(p + 'b', 2.5)}
      </defs>
      ${bg}${auraEl}
      <g clip-path="url(#${p}c)"><g transform="translate(100 108) scale(0.9) translate(-100 -100)"><g class="cr-body" ${sil ? '' : `filter="url(#${p}s)"`}>
        <path d="M34 210 C 38 170 66 152 100 152 C 134 152 162 170 166 210Z" fill="url(#${p}f)" stroke="${out}" stroke-width="2.5"/>
        <g fill="${c[2]}"><circle cx="82" cy="168" r="14"/><circle cx="100" cy="164" r="16"/><circle cx="118" cy="168" r="14"/><circle cx="92" cy="180" r="12"/><circle cx="110" cy="180" r="12"/></g>
        ${acc && a.id !== 'mono' && a.id !== 'flores' ? acc : ''}
        ${mirror(`<g transform="translate(42 96) rotate(-24)"><ellipse rx="30" ry="15" fill="url(#${p}f)" stroke="${out}" stroke-width="2.5"/><ellipse cx="5" rx="18" ry="8" fill="#FFB3C7"/></g>`, 200)}
        ${mirror(`<path d="M72 60 C 64 46 66 34 74 28 C 78 40 84 48 88 54Z" fill="#FFF4D6" stroke="#D9BE8C" stroke-width="2" stroke-linejoin="round"/>`, 200)}
        <path d="M100 40 C 146 40 164 72 162 106 C 160 142 134 162 100 162 C 66 162 40 142 38 106 C 36 72 54 40 100 40Z" fill="url(#${p}f)" stroke="${out}" stroke-width="2.5"/>
        <path d="M100 40 C 146 40 164 72 162 106 C 160 142 134 162 100 162 C 66 162 40 142 38 106 C 36 72 54 40 100 40Z" fill="url(#${p}sh)"/>
        ${spots}
        <ellipse cx="78" cy="74" rx="20" ry="8" fill="#fff" opacity=".3" transform="rotate(-20 78 74)"/>
        ${tuft}
        <g class="cr-eyes">${eye(p, 72, 102, 16, 18, -1, true)}${eye(p, 128, 102, 16, 18, 1, true)}</g>
        <ellipse cx="54" cy="128" rx="12" ry="7" fill="#FF7FA8" opacity=".55" filter="url(#${p}b)"/><ellipse cx="146" cy="128" rx="12" ry="7" fill="#FF7FA8" opacity=".55" filter="url(#${p}b)"/>
        <ellipse cx="100" cy="139" rx="30" ry="20" fill="url(#${p}n)" stroke="${mix(c[3], '#000000', 0.18)}" stroke-width="2"/>
        <ellipse cx="94" cy="128" rx="12" ry="4" fill="#fff" opacity=".6"/>
        <ellipse cx="89" cy="137" rx="4.5" ry="3.5" fill="${mix(c[3], '#6B1F3A', 0.6)}"/><ellipse cx="111" cy="137" rx="4.5" ry="3.5" fill="${mix(c[3], '#6B1F3A', 0.6)}"/>
        <path d="M91 148 Q100 155 109 148" stroke="#6B1F3A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <g transform="translate(100 ${f.top === 'algodon' ? 28 : 32}) scale(1.05)">${topping(f.top, c)}</g>
        ${a.id === 'mono' || a.id === 'flores' ? acc : ''}
        ${stage === 4 ? crown(152, 74, 24, 0.8) : ''}
      </g></g></g>
    </svg>`;
  }

  function eggArt(c, cow) {
    const id = 'eg' + ++uid;
    const shell = `<path d="M50 6 C 74 6 90 44 90 66 C 90 88 72 100 50 100 C 28 100 10 88 10 66 C 10 44 26 6 50 6Z" fill="${cow ? '#FFFFFF' : c[3]}" stroke="${c[1]}" stroke-width="3"/>
      <g fill="${cow ? '#3A2A2A' : c[0]}"><ellipse cx="34" cy="40" rx="${cow ? 11 : 8}" ry="${cow ? 8 : 6}"/><ellipse cx="62" cy="30" rx="6" ry="5"/><ellipse cx="70" cy="62" rx="${cow ? 12 : 9}" ry="${cow ? 9 : 7}"/><ellipse cx="30" cy="74" rx="7" ry="6"/><ellipse cx="52" cy="86" rx="6" ry="4"/></g>
      <path d="M30 26 Q 36 18 44 16" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`;
    return `<svg class="egg" viewBox="0 0 100 104"><defs>
      <clipPath id="${id}t"><polygon points="0,0 100,0 100,54 88,60 76,50 64,60 52,50 40,60 28,50 16,60 0,54"/></clipPath>
      <clipPath id="${id}b"><polygon points="0,54 16,60 28,50 40,60 52,50 64,60 76,50 88,60 100,54 100,104 0,104"/></clipPath></defs>
      <g class="egg-top" clip-path="url(#${id}t)">${shell}</g><g class="egg-bot" clip-path="url(#${id}b)">${shell}</g></svg>`;
  }

  GA.critterArt = { dragon: dragonArt, milk: milkArt, egg: eggArt, mix };
})();
