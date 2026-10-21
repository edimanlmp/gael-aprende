/* Gael Aprende — colección de dragones
   Cada respuesta correcta hace eclosionar un huevo. 14 elementos × 6 razas = 84 dragones.
   Los repetidos hacen crecer al dragón: Bebé → Joven → Adulto → Gran Dragón. */
(function () {
  'use strict';
  const { h } = GA;

  const RARITY = {
    comun: { n: 'Común', color: '#26BF63', w: 58 },
    raro: { n: 'Raro', color: '#3D8BFF', w: 28 },
    epico: { n: 'Épico', color: '#A855F7', w: 11 },
    legendario: { n: 'Legendario', color: '#F5A300', w: 3 },
  };
  // main, dark, light, belly (hocico), wing (alas/aletas), accent (cuernos, marcas), eye; bg = fondo de la estampa
  const ELEM = [
    { id: 'fuego', n: 'Fuego', r: 'comun', c: ['#FF6B3D', '#C2381A', '#FFB27A', '#FFE08A', '#FFB347', '#FFD23F', '#E8590C'], bg: ['#FFF4E6', '#FFC4A0'], fact: 'El fuego necesita oxígeno para arder: por eso una vela se apaga si la tapas.' },
    { id: 'agua', n: 'Agua', r: 'comun', c: ['#2EB8D6', '#14809E', '#8EE3F5', '#DDF7FF', '#5FD0E8', '#B8F1FF', '#0B6E99'], bg: ['#EEFCFF', '#9EDFF0'], fact: 'El agua cubre casi tres cuartas partes de la Tierra.' },
    { id: 'bosque', n: 'Bosque', r: 'comun', c: ['#4CBF5A', '#2C8A3A', '#9BE29F', '#EAF8C8', '#7FD36E', '#C98A4B', '#2F7D32'], bg: ['#F3FFEC', '#B6E8A8'], fact: 'Los árboles fabrican el oxígeno que respiramos.' },
    { id: 'roca', n: 'Roca', r: 'comun', c: ['#A88B6E', '#6E5640', '#D4BFA6', '#EFE3D2', '#C2A27F', '#9FD3E8', '#5B4636'], bg: ['#FBF6EE', '#D9C7B0'], fact: 'Algunas montañas tardaron millones de años en formarse.' },
    { id: 'hielo', n: 'Hielo', r: 'raro', c: ['#7FD3FF', '#3C8FD6', '#D2F1FF', '#F4FCFF', '#B8E8FF', '#FFFFFF', '#1F6FB8'], bg: ['#F7FDFF', '#B9E3FF'], fact: 'El hielo flota porque es menos denso que el agua líquida.' },
    { id: 'trueno', n: 'Trueno', r: 'raro', c: ['#FFD43B', '#D99A00', '#FFF0A0', '#FFF9DB', '#8B7CF6', '#7C6BF2', '#4C3BC9'], bg: ['#FFFBE6', '#C9BFFF'], fact: 'Un rayo está más caliente que la superficie del Sol.' },
    { id: 'flor', n: 'Flor', r: 'raro', c: ['#FF8FC0', '#D9488A', '#FFC9E0', '#FFF0F6', '#FFB3D6', '#FFE066', '#B8326F'], bg: ['#FFF5FA', '#FFC2DD'], fact: 'Las abejas llevan polen de flor en flor para que nazcan frutos.' },
    { id: 'nube', n: 'Nube', r: 'raro', c: ['#E8EEF9', '#9AAAC6', '#FFFFFF', '#FFFFFF', '#F2F6FC', '#A9C7FF', '#5C77B3'], bg: ['#FFFFFF', '#C6D9FF'], fact: 'Las nubes están hechas de millones de gotitas de agua diminutas.' },
    { id: 'cristal', n: 'Cristal', r: 'epico', c: ['#D98BFF', '#9B3FD4', '#F1D1FF', '#FBF0FF', '#C7A6FF', '#7CF0E8', '#7A2BB8'], bg: ['#FCF4FF', '#D8B8FF'], fact: 'Los cristales crecen formando figuras geométricas perfectas.' },
    { id: 'sombra', n: 'Sombra', r: 'epico', c: ['#4B3F72', '#2A2245', '#8A78C4', '#9C8CD0', '#5E4E91', '#B8F35B', '#9BE83A'], bg: ['#7D6BC0', '#2A2245'], fact: 'Una sombra aparece cuando algo tapa el camino de la luz.' },
    { id: 'lava', n: 'Lava', r: 'epico', c: ['#6A2E2A', '#3A1614', '#A05A44', '#FFB36B', '#8A3A2C', '#FF7A1A', '#FF6A1A'], bg: ['#FFB27A', '#7A2A1A'], fact: 'La lava es roca derretida que sale de los volcanes a más de mil grados.' },
    { id: 'galaxia', n: 'Galaxia', r: 'legendario', c: ['#3A3F9E', '#1A1C55', '#7B80F0', '#B9BEFF', '#5B5FD6', '#FFD95A', '#7FD8FF'], bg: ['#6A6FE0', '#161845'], fact: 'Nuestra galaxia, la Vía Láctea, tiene miles de millones de estrellas.' },
    { id: 'arcoiris', n: 'Arcoíris', r: 'legendario', c: ['#FF9CC2', '#D0559A', '#FFE0EC', '#FFFFFF', '#9BE7FF', '#FFE45C', '#8A4FE0'], bg: ['#FFFFFF', '#D9C9FF'], fact: 'El arcoíris aparece cuando la luz del sol atraviesa las gotas de lluvia.' },
    { id: 'oro', n: 'Oro', r: 'legendario', c: ['#F7C531', '#B8860B', '#FFE88A', '#FFF6CC', '#FFD95A', '#FFFFFF', '#8A5A00'], bg: ['#FFFDF0', '#FFD970'], fact: 'El oro no se oxida: por eso los tesoros antiguos siguen brillando.' },
  ];
  const BREED = [
    { id: 'chispa', n: 'Chispa', shape: 'wide', fangs: true },
    { id: 'pluma', n: 'Pluma', shape: 'tall' },
    { id: 'aleta', n: 'Aleta', shape: 'round' },
    { id: 'mariposa', n: 'Mariposa', shape: 'round', lashes: true },
    { id: 'rey', n: 'Rey', shape: 'wide', fangs: true },
    { id: 'unicornio', n: 'Unicornio', shape: 'tall', lashes: true },
  ];
  // Milkeritos: fur, sombra, brillo, hocico, manchas, acento, ojos
  const FLAVOR = [
    { id: 'vainilla', n: 'Vainilla', r: 'comun', top: 'flor', bg: '#FFE9BE', c: ['#FFF6E6', '#E3CBA8', '#FFFFFF', '#FFC7C7', '#F2DDB4', '#FFD166', '#6B4A2B'], fact: 'La vainilla viene de una orquídea, ¡una flor!' },
    { id: 'chocolate', n: 'Chocolate', r: 'comun', top: 'bombon', bg: '#EFCDB5', c: ['#A86F4C', '#6E4330', '#D9A27E', '#F4B9A8', '#5A3424', '#C98A5A', '#3A1F10'], fact: 'El cacao, con el que se hace el chocolate, se cultivaba en México desde hace miles de años.' },
    { id: 'fresa', n: 'Fresa', r: 'comun', top: 'fresa', bg: '#FFCFE0', c: ['#FFC6D8', '#F08DB0', '#FFF0F5', '#FF9FB8', '#FFFFFF', '#FF5C8A', '#7A2E4A'], fact: 'La fresa es la única fruta con las semillas por fuera.' },
    { id: 'platano', n: 'Plátano', r: 'comun', top: 'platano', bg: '#FFF0B0', c: ['#FFF2A8', '#E8CC5A', '#FFFDE6', '#FFC6A8', '#FFFFFF', '#FFC93D', '#6B4E00'], fact: 'Los plátanos crecen en racimos que miran hacia arriba, ¡buscando el sol!' },
    { id: 'menta', n: 'Menta', r: 'raro', top: 'menta', bg: '#C8F4E2', c: ['#CFF7E6', '#86D9B6', '#F2FFF9', '#FFB8C8', '#FFFFFF', '#2ECC8A', '#1F6B52'], fact: 'La menta se siente fresca porque engaña a los sensores de frío de tu boca.' },
    { id: 'galleta', n: 'Galleta', r: 'raro', top: 'galleta', bg: '#F5DDBA', c: ['#EBCB9E', '#C49460', '#FFF1DC', '#FFC3B0', '#5A3424', '#E07A3F', '#4A2A18'], fact: 'Al hornear galletas, el calor transforma la masa: ¡eso es química!' },
    { id: 'coco', n: 'Coco', r: 'raro', top: 'coco', bg: '#E8DDCF', c: ['#FFFFFF', '#DDD3C6', '#FFFFFF', '#FFC9C9', '#8B5E3C', '#5FBF9F', '#4A2A18'], fact: 'El coco es una semilla gigante que puede viajar flotando por el mar.' },
    { id: 'limon', n: 'Limón', r: 'raro', top: 'limon', bg: '#F7F2B0', c: ['#FAF7B4', '#E3D95A', '#FFFFF0', '#FFCBB8', '#FFFFFF', '#9BD33A', '#5B5A00'], fact: 'El jugo de limón es ácido: por eso hace que pongas caras chistosas.' },
    { id: 'mora', n: 'Mora', r: 'epico', top: 'mora', bg: '#DCCDFF', c: ['#CDB8F7', '#9A7FE0', '#F4EEFF', '#FFC2D8', '#7A5CD6', '#8E6CF0', '#3B2780'], fact: 'Cada mora está hecha de muchas bolitas, ¡y cada bolita tiene su semillita!' },
    { id: 'caramelo', n: 'Caramelo', r: 'epico', top: 'caramelo', bg: '#FFD9A8', c: ['#F7CD92', '#D99A4E', '#FFF3DE', '#FFC3A8', '#FFF4E0', '#F28C28', '#6B3A0A'], fact: 'El caramelo se forma cuando el azúcar se calienta y cambia de color.' },
    { id: 'cereza', n: 'Cereza', r: 'epico', top: 'cereza', bg: '#FFCFCF', c: ['#FFB8B8', '#EE7C7C', '#FFEDED', '#FFA0B0', '#FFFFFF', '#E2263B', '#7A1F2A'], fact: 'Las cerezas crecen en pares unidas por sus tallitos.' },
    { id: 'algodon', n: 'Algodón de Azúcar', r: 'legendario', top: 'algodon', bg: '#E2D6FF', c: ['#FFD6F2', '#F0A3D6', '#FFF5FC', '#FFB0D2', '#B8E2FF', '#FF8FD0', '#6B2E8A'], fact: 'El algodón de azúcar es azúcar derretida que se enfría en hilos finísimos.' },
    { id: 'galaxia', n: 'Galaxia', r: 'legendario', top: 'planeta', bg: '#B9B2FF', c: ['#4B50A8', '#262A66', '#8A8FEA', '#D2C6FF', '#FFE27A', '#7B61FF', '#8FE3FF'], fact: 'En el espacio no hay aire, por eso los astronautas usan casco.' },
    { id: 'miel', n: 'Miel', r: 'legendario', top: 'miel', bg: '#FFE19A', c: ['#FFD266', '#E0A21C', '#FFF2C2', '#FFC3A8', '#FFF6D6', '#F5A300', '#6B3A00'], fact: 'Las abejas visitan miles y miles de flores para hacer un frasco de miel.' },
  ];
  const ACC = [{ id: 'campana', n: 'Campanita' }, { id: 'mono', n: 'Moñito' }, { id: 'flores', n: 'Florecita' }, { id: 'bufanda', n: 'Bufandita' }];
  const STAGES = [{ n: 'Bebé', at: 1 }, { n: 'Joven', at: 3 }, { n: 'Adulto', at: 6 }, { n: 'Gran Dragón', at: 10 }];
  let seed = 0;
  const DRAGONS = ELEM.flatMap((e) => BREED.map((b) => ({ id: `${e.id}-${b.id}`, kind: 'dragon', e, b, name: `${b.n} de ${e.n}`, seed: seed++ })));
  const MILKS = FLAVOR.flatMap((e) => ACC.map((b) => ({ id: `milk-${e.id}-${b.id}`, kind: 'milk', e, b, name: `Milkerito ${e.n} ${b.n}`, seed: seed++ })));
  const ALL = [...DRAGONS, ...MILKS];
  const stageName = (d, st) => (d.kind === 'milk' && st === 4 ? 'Gran Milkerito' : STAGES[st - 1].n);

  // Figuras especiales (ilustraciones): más raras que los dragones normales
  // En el archivo único (build.py) las imágenes van incrustadas en window.GA_IMG
  const imgSrc = (path) => (window.GA_IMG && window.GA_IMG[path]) || path;
  const SP = (file, name, kind, r, color, fact) => ({ id: 'esp-' + file, img: imgSrc(`img/especiales/${file}.jpg`), name, kind, r, color, fact, special: true });
  const DRAGON_FACT = 'En la vida real existe el dragón de Komodo: ¡el lagarto más grande del mundo!';
  const SPECIAL = [
    SP('dragon-toothless', 'Chimuelo', 'dragon', 'legendario', '#5B21B6', 'Es un Furia Nocturna: el dragón más veloz y misterioso de todos.'),
    SP('dragon-lightfury', 'Furia Luminosa', 'dragon', 'legendario', '#C7D2FE', 'Puede volverse casi invisible brillando como la luz.'),
    SP('dragon-stormfly', 'Tormenta', 'dragon', 'legendario', '#3B82F6', 'Lanza púas desde su cola, ¡con muchísima puntería!'),
    SP('dragon-skrill', 'Skrill', 'dragon', 'legendario', '#7C3AED', 'Atrapa los rayos de las tormentas. Los rayos de verdad están más calientes que el Sol.'),
    SP('dragon-hookfang', 'Garfios', 'dragon', 'legendario', '#E85D04', 'Es tan caliente que puede cubrirse de fuego sin quemarse.'),
    SP('dragon-cloudjumper', 'Saltanubes', 'dragon', 'legendario', '#6B7280', 'Tiene cuatro alas. ¡Las libélulas de verdad también tienen cuatro!'),
    SP('dragon-zippleback', 'Eructo e Hipo', 'dragon', 'legendario', '#4ADE80', 'Tiene dos cabezas que deben trabajar en equipo.'),
    SP('dragon-meatlug', 'Patán', 'dragon', 'legendario', '#8B5E3C', 'Come rocas. Algunas aves de verdad tragan piedritas para moler su comida.'),
    SP('dragon-emerald', 'Dragón Esmeralda', 'dragon', 'epico', '#1FAA59', 'La esmeralda es una piedra preciosa verde que se forma muy dentro de la Tierra.'),
    SP('dragon-fire', 'Dragón de Fuego', 'dragon', 'epico', '#FF4500', DRAGON_FACT),
    SP('dragon-ice', 'Dragón de Hielo', 'dragon', 'epico', '#7EC8FF', 'Los copos de nieve siempre tienen seis puntas.'),
    SP('dragon-gold', 'Dragón Dorado', 'dragon', 'epico', '#F5C518', 'El oro es tan blando que se puede aplastar con un martillo hasta hacerlo delgadísimo.'),
    SP('dragon-ocean', 'Dragón del Océano', 'dragon', 'epico', '#1A7A9C', 'El océano es tan profundo que en algunas partes nunca llega la luz del sol.'),
    SP('dragon-crystal', 'Dragón Cristal', 'dragon', 'epico', '#C084FC', 'La sal y el azúcar también son cristales, ¡míralos con una lupa!'),
    SP('milkerito-nube', 'Milkerito Nube', 'milkerito', 'raro', '#FFF7ED', 'Las vacas pasan casi ocho horas al día masticando.'),
    SP('milkerito-chocolate', 'Milkerito Chocolate', 'milkerito', 'raro', '#8B5E3C', 'El chocolate viene de las semillas del árbol de cacao.'),
    SP('milkerito-fresa', 'Milkerito Fresa', 'milkerito', 'raro', '#FF8FAB', 'La fresa es la única fruta con las semillas por fuera.'),
    SP('milkerito-menta', 'Milkerito Menta', 'milkerito', 'raro', '#6EE7B7', 'La menta se siente fresca porque engaña a los sensores de frío de tu boca.'),
    SP('milkerito-estrella', 'Milkerito Estrella', 'milkerito', 'epico', '#FBBF24', 'El Sol también es una estrella, ¡la más cercana a nosotros!'),
    SP('milkerito-arcoiris', 'Milkerito Arcoíris', 'milkerito', 'epico', '#A78BFA', 'Un arcoíris tiene siete colores: rojo, naranja, amarillo, verde, azul, añil y violeta.'),
  ];
  // Tesoros de Hyrule (The Legend of Zelda): salen de un cofre (ZELDA_CHANCE), aparte de los huevos dorados
  const ZS = (file, name, r, color, fact) => ({ id: 'zelda-' + file, img: imgSrc(`img/zelda/${file}.webp`), name, kind: 'zelda', r, color, fact, special: true });
  const ZELDA = [
    ZS('link', 'Link', 'legendario', '#2E8B57', 'Link es el héroe de Hyrule. Despertó después de dormir cien años.'),
    ZS('zelda', 'Princesa Zelda', 'legendario', '#F5D76E', 'Zelda estudia todo lo antiguo de Hyrule y tiene un poder sagrado.'),
    ZS('espada', 'Espada Maestra', 'legendario', '#7EC8FF', 'Es la espada que ahuyenta la oscuridad. Solo un héroe puede sacarla de la piedra.'),
    ZS('ganon', 'Ganon', 'legendario', '#B91C1C', 'Ganon es el gran enemigo de Hyrule. ¡Link y Zelda siempre lo vencen!'),
    ZS('campeones', 'Los Elegidos', 'legendario', '#3D8BFF', 'Cinco héroes unidos para proteger Hyrule: juntos son más fuertes.'),
    ZS('mipha', 'Mipha', 'epico', '#E11D48', 'Mipha es una princesa zora que puede curar heridas.'),
    ZS('daruk', 'Daruk', 'epico', '#B45309', 'Daruk es un goron enorme. Los gorones comen rocas, ¡y les encantan!'),
    ZS('revali', 'Revali', 'epico', '#1D4ED8', 'Revali es un orni que vuela altísimo y nunca falla con su arco.'),
    ZS('urbosa', 'Urbosa', 'epico', '#F59E0B', 'Urbosa es la jefa gerudo y puede llamar a los rayos.'),
    ZS('impa', 'Impa', 'epico', '#DC2626', 'Impa es la sabia de la aldea Kakariko. Recuerda muchas historias.'),
    ZS('hestu', 'Obab', 'epico', '#16A34A', 'Obab baila con sus maracas cuando le das semillas kolog.'),
    ZS('guardian', 'Guardián', 'epico', '#F97316', 'Los guardianes son máquinas antiguas que lanzan un rayo de luz.'),
    ZS('lynel', 'Centaleón', 'epico', '#9F1239', 'El centaleón es mitad león y mitad caballo. ¡Es el monstruo más fuerte!'),
    ZS('paravela', 'Paravela', 'epico', '#C2410C', 'Con la paravela Link baja planeando, como un ala delta de verdad.'),
    ZS('tableta', 'Piedra Sheikah', 'epico', '#0EA5E9', 'La Piedra Sheikah guarda mapas, fotos y poderes antiguos.'),
    ZS('korok', 'Kolog', 'raro', '#65A30D', 'Hay muchísimos kologs escondidos en Hyrule. ¡Cada uno regala una semilla!'),
    ZS('hada', 'Hada', 'raro', '#F472B6', 'Si Link se queda sin corazones, un hada lo salva.'),
    ZS('caballo', 'Caballo', 'raro', '#92400E', 'Los caballos de verdad pueden dormir de pie.'),
    ZS('cucco', 'Cuco', 'raro', '#FDE68A', '¡No molestes a un cuco! Todos sus amigos vendrán a defenderlo.'),
    ZS('arco', 'Arco', 'raro', '#A16207', 'Con un arco Link puede atinarle a cosas que están muy lejos.'),
    ZS('escudo', 'Escudo hyliano', 'raro', '#1E40AF', 'El escudo hyliano es uno de los más fuertes de todo Hyrule.'),
    ZS('corazon', 'Contenedor de corazón', 'raro', '#EF4444', 'Cada contenedor de corazón le da a Link un corazón más de vida.'),
    ZS('manzana', 'Manzana', 'raro', '#DC2626', 'Las manzanas de verdad flotan en el agua porque tienen aire adentro.'),
    ZS('bokoblin', 'Bokoblin', 'raro', '#EF4444', 'Los bokoblins viven en campamentos y duermen de noche.'),
    ZS('chuchu', 'Chuchu', 'raro', '#60A5FA', 'Los chuchus son gelatinas. Hay de fuego, de hielo y de rayo.'),
    ZS('octorok', 'Octorok', 'raro', '#7C3AED', 'Los octoroks escupen piedras. Los pulpos de verdad escupen tinta.'),
  ];
  const SPECIAL_CHANCE = 0.15, ZELDA_CHANCE = 0.12;
  const ALL_SPECIAL = [...SPECIAL, ...ZELDA];
  const specialArt = (f, size, cls = '') => `<img class="special-img ${f.kind} ${cls}" src="${f.img}" alt="${f.name}" width="${size}" height="${f.kind === 'dragon' ? Math.round(size * 0.666) : size}" draggable="false">`;
  const byId = (id) => ALL.find((d) => d.id === id);
  const stageOf = (n) => STAGES.reduce((s, st, i) => (n >= st.at ? i + 1 : s), 1);

  // ---------- Dibujo (ver critters.js) ----------
  const dragonSVG = (d, stage = 1, o = {}) => (d.kind === 'milk' ? GA.critterArt.milk(d, stage, o) : GA.critterArt.dragon(d, stage, o));
  const eggSVG = (e, cow) => GA.critterArt.egg(e.c, cow);

  // ---------- Colección ----------
  const D = () => GA.store.data;
  const col = () => (D().dragons = D().dragons || {});
  GA.dragons = {
    ALL, DRAGONS, MILKS, ELEM, BREED, FLAVOR, ACC, RARITY, STAGES, SPECIAL, ZELDA, ALL_SPECIAL, byId, stageOf, stageName, svg: dragonSVG, egg: eggSVG, specialArt,
    count: () => Object.keys(col()).length,
    total: () => ALL.length + ALL_SPECIAL.length,
    // Dibujo de cualquier premio (dragón generado o figura especial)
    art(r, size) { return r.special ? specialArt(r.f, size) : dragonSVG(r.d, r.stage, { size }); },
    awardSpecial(set = SPECIAL) {
      const W = { raro: 55, epico: 30, legendario: 15 };
      let roll = Math.random() * 100, rk = 'raro';
      for (const k in W) { roll -= W[k]; if (roll <= 0) { rk = k; break; } }
      const pool = set.filter((f) => f.r === rk);
      const fresh = pool.filter((f) => !col()[f.id]);
      const f = fresh.length && Math.random() < 0.5 ? GA.pick(fresh) : GA.pick(pool);
      const rec = col()[f.id] || (col()[f.id] = { n: 0, t: Date.now() });
      rec.n++;
      GA.store.save();
      return { special: true, f, d: { name: f.name, e: { r: f.r, c: ELEM.find((e) => e.id === 'oro').c } }, isNew: rec.n === 1, grew: false, stage: 1, copies: rec.n };
    },
    // Entrega un dragón por una respuesta correcta
    award() {
      const luck = Math.random();
      if (luck < SPECIAL_CHANCE) return this.awardSpecial();
      if (luck < SPECIAL_CHANCE + ZELDA_CHANCE) return this.awardSpecial(ZELDA);
      const tot = Object.values(RARITY).reduce((a, r) => a + r.w, 0);
      let roll = Math.random() * tot, rk = 'comun';
      for (const k in RARITY) { roll -= RARITY[k].w; if (roll <= 0) { rk = k; break; } }
      const kind = Math.random() < 0.4 ? 'milk' : 'dragon';
      const pool = ALL.filter((d) => d.kind === kind && d.e.r === rk);
      const fresh = pool.filter((d) => !col()[d.id]);
      const d = fresh.length && Math.random() < 0.4 ? GA.pick(fresh) : GA.pick(pool);
      const rec = col()[d.id] || (col()[d.id] = { n: 0, t: Date.now() });
      const before = stageOf(rec.n);
      rec.n++;
      const stage = stageOf(rec.n);
      GA.store.save();
      return { d, isNew: rec.n === 1, grew: rec.n > 1 && stage > before, stage, copies: rec.n };
    },
    message(r) {
      if (r.special && r.f.kind === 'zelda') return r.isNew ? `¡Tesoro de Hyrule! ${r.f.name} (${RARITY[r.f.r].n})` : `¡Otra vez ${r.f.name}! Ya tienes ${r.copies}`;
      if (r.special) return r.isNew ? `¡Figura especial! ${r.f.name} (${RARITY[r.f.r].n})` : `¡Otra vez ${r.f.name}! Ya tienes ${r.copies}`;
      if (r.isNew) return `¡${r.d.kind === 'milk' ? 'Nuevo Milkerito' : 'Nuevo dragón'}! ${r.d.name} (${RARITY[r.d.e.r].n})`;
      if (r.grew) return `¡Tu ${r.d.name} creció! Ahora es ${stageName(r.d, r.stage)}`;
      const nx = STAGES[r.stage];
      return nx ? `${r.d.name} se hace más fuerte (${r.copies}/${nx.at} para ${stageName(r.d, r.stage + 1)})` : `${r.d.name} brilla con más poder`;
    },
    // Huevo que eclosiona y muestra al dragón (para la barra de retroalimentación)
    hatchEl(r, size = 110) {
      return h('div', { class: 'hatch' + (r.isNew || r.grew || r.special ? ' special' : ''), style: { width: size + 'px', height: size + 'px' }, 'aria-label': r.d.name },
        h('div', { class: 'hatch-dragon' + (r.special ? ' hatch-special' : ''), html: r.special ? specialArt(r.f, size) : dragonSVG(r.d, r.stage, { size }) }),
        h('div', { class: 'hatch-egg', html: eggSVG(r.special ? ELEM.find((e) => e.id === 'oro') : r.d.e, !r.special && r.d.kind === 'milk') }),
        r.isNew ? h('span', { class: 'hatch-badge', style: { background: RARITY[r.d.e.r].color } }, '¡Nuevo!') : r.grew ? h('span', { class: 'hatch-badge', style: { background: '#F5A300' } }, '⬆ Creció') : null);
    },
  };

  // ---------- Pantalla: Mi cueva de dragones ----------
  function detail(d) {
    const rec = col()[d.id];
    const st = stageOf(rec.n), nx = STAGES[st];
    const R = RARITY[d.e.r];
    GA.sfx.play('pop');
    GA.ui.modal({
      title: d.name,
      body: h('div', { style: { display: 'grid', gap: '10px', justifyItems: 'center' } },
        h('div', { class: 'dragon-stage-bg', html: dragonSVG(d, st, { size: d.kind === 'milk' ? 230 : 300 }) }),
        h('div', { class: 'row', style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' } },
          h('span', { class: 'chip', style: { background: R.color, color: '#fff' } }, R.n),
          h('span', { class: 'chip' }, '⭐'.repeat(st) + ' ' + stageName(d, st)),
          h('span', { class: 'chip' }, `Huevos: ${rec.n}`)),
        nx ? h('div', { style: { width: '100%' } }, h('div', { class: 'bar area-math' }, h('i', { style: { width: Math.round(((rec.n - STAGES[st - 1].at) / (nx.at - STAGES[st - 1].at)) * 100) + '%' } })), h('small', { class: 'muted' }, `${nx.at - rec.n} respuestas más para que sea ${stageName(d, st + 1)}`)) : h('small', { class: 'muted' }, '¡Llegó a su forma más poderosa!'),
        h('p', { style: { margin: 0 } }, `💡 ${d.kind === 'milk' ? 'Dato de sabor' : 'Dato del elemento'} ${d.e.n}: ${d.e.fact}`)),
      actions: [{ label: '🔊 Escuchar', cls: 'btn-white', keep: true, onClick: () => GA.say(`${d.name}. ${d.e.fact}`) }, { label: '¡Genial!', cls: 'btn-ok' }],
      say: `${d.name}, ${stageName(d, st)}.`, dismissable: true,
    });
  }
  function detailSpecial(f) {
    const rec = col()[f.id], R = RARITY[f.r];
    GA.sfx.play('pop');
    GA.ui.modal({
      title: f.name,
      body: h('div', { style: { display: 'grid', gap: '10px', justifyItems: 'center' } },
        h('div', { class: 'sp-big', style: { '--glow': f.color }, html: specialArt(f, 280) }),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' } },
          h('span', { class: 'chip', style: { background: R.color, color: '#fff' } }, `${R.n} · ${f.kind === 'zelda' ? 'Tesoro de Hyrule' : 'Figura especial'}`),
          h('span', { class: 'chip' }, `Encontrada ${rec.n} ${rec.n === 1 ? 'vez' : 'veces'}`)),
        h('p', { style: { margin: 0 } }, `💡 ${f.fact}`)),
      actions: [{ label: '🔊 Escuchar', cls: 'btn-white', keep: true, onClick: () => GA.say(`${f.name}. ${f.fact}`) }, { label: '¡Genial!', cls: 'btn-ok' }],
      say: f.name, dismissable: true,
    });
  }
  GA.dragons.detailSpecial = detailSpecial;

  GA.screens.dragons = function (filter = 'todos') {
    GA.voice.stop();
    document.getElementById('overlay').innerHTML = '';
    const app = document.getElementById('app');
    app.innerHTML = '';
    window.scrollTo(0, 0);
    const have = col();
    const TABS = [['todos', 'Todos'], ['especiales', '⭐ Especiales'], ['dragones', '🐉 Dragones'], ['milkeritos', '🐮 Milkeritos'], ['zelda', '🗡️ Hyrule'], ['legendario', '👑 Legendarios']];
    const show = (d) => filter === 'todos' || (filter === 'dragones' && d.kind === 'dragon') || (filter === 'milkeritos' && d.kind === 'milk') || d.e.r === filter;
    const list = filter === 'especiales' || filter === 'zelda' ? [] : ALL.filter(show);
    const tabs = h('div', { class: 'seg cave-tabs' }, TABS.map(([k, l]) => h('button', { class: k === filter ? 'on' : '', onclick: () => GA.screens.dragons(k) }, l)));
    const sps = filter === 'zelda' ? [] : SPECIAL.filter((f) => filter === 'todos' || filter === 'especiales' || f.r === filter || (filter === 'dragones' && f.kind === 'dragon') || (filter === 'milkeritos' && f.kind === 'milkerito'));
    const spOwned = SPECIAL.filter((f) => have[f.id]).length;
    const specialSection = sps.length ? h('section', { class: 'sp-section' },
      h('h2', null, `⭐ Figuras especiales · ${spOwned} de ${SPECIAL.length}`),
      h('p', { class: 'cave-intro' }, 'Salen de los huevos dorados. ¡Son las más difíciles de encontrar!'),
      h('div', { class: 'sp-grid' }, sps.map((f) => {
        const rec = have[f.id], R = RARITY[f.r];
        if (!rec) return h('div', { class: 'sp-card locked ' + f.kind }, h('div', { class: 'sp-art', html: specialArt(f, 150) }), h('div', { class: 'sp-q' }, '?'), h('div', { class: 'cave-name' }, f.kind === 'milkerito' ? 'Milkerito misterioso' : 'Dragón misterioso'), h('span', { class: 'cave-r', style: { background: R.color } }, R.n));
        return h('button', { class: 'sp-card ' + f.kind, style: { '--glow': f.color }, onclick: () => detailSpecial(f) },
          h('div', { class: 'sp-art', html: specialArt(f, 150) }),
          h('div', { class: 'cave-name' }, f.name), rec.n > 1 ? h('div', { class: 'cave-stage' }, `×${rec.n}`) : null,
          h('span', { class: 'cave-r', style: { background: R.color } }, R.n));
      }))) : null;
    const zs = ZELDA.filter((f) => filter === 'todos' || filter === 'zelda' || f.r === filter);
    const zOwned = ZELDA.filter((f) => have[f.id]).length;
    const zeldaSection = zs.length ? h('section', { class: 'sp-section zelda-section' },
      h('h2', null, `🗡️ Tesoros de Hyrule · ${zOwned} de ${ZELDA.length}`),
      h('p', { class: 'cave-intro' }, 'A veces, en lugar de un huevo, ¡aparece un cofre de Hyrule! Junta a Link, Zelda y todos sus amigos.'),
      h('div', { class: 'sp-grid' }, zs.map((f) => {
        const rec = have[f.id], R = RARITY[f.r];
        if (!rec) return h('div', { class: 'sp-card locked zelda' }, h('div', { class: 'sp-art', html: specialArt(f, 140) }), h('div', { class: 'sp-q' }, '?'), h('div', { class: 'cave-name' }, 'Tesoro misterioso'), h('span', { class: 'cave-r', style: { background: R.color } }, R.n));
        return h('button', { class: 'sp-card zelda', style: { '--glow': f.color }, onclick: () => detailSpecial(f) },
          h('div', { class: 'sp-art', html: specialArt(f, 140) }),
          h('div', { class: 'cave-name' }, f.name), rec.n > 1 ? h('div', { class: 'cave-stage' }, `×${rec.n}`) : null,
          h('span', { class: 'cave-r', style: { background: R.color } }, R.n));
      }))) : null;
    const card = (d) => {
      const rec = have[d.id];
      const R = RARITY[d.e.r];
      const sz = d.kind === 'milk' ? 130 : 160;
      if (!rec) return h('div', { class: 'cave-card locked ' + d.kind }, h('div', { class: 'cave-art', html: dragonSVG(d, 1, { size: sz, anim: false, sil: true }) }), h('div', { class: 'cave-name' }, '¿ ? ?'), h('span', { class: 'cave-r', style: { background: R.color } }, R.n));
      const st = stageOf(rec.n);
      return h('button', { class: 'cave-card ' + d.kind, style: { '--glow': d.e.c[5] }, onclick: () => detail(d) },
        h('div', { class: 'cave-art', html: dragonSVG(d, st, { size: sz }) }),
        h('div', { class: 'cave-name' }, d.name),
        h('div', { class: 'cave-stage' }, '⭐'.repeat(st) + ' ' + stageName(d, st)),
        h('span', { class: 'cave-r', style: { background: R.color } }, R.n));
    };
    const dl = list.filter((d) => d.kind === 'dragon'), ml = list.filter((d) => d.kind === 'milk');
    const sec = (title, arr) => (arr.length ? [h('h2', { class: 'cave-h2' }, `${title} · ${arr.filter((d) => have[d.id]).length} de ${arr.length}`), h('div', { class: 'cave' }, arr.map(card))] : []);
    const grid = h('div', null, sec('🐉 Dragones de la cueva', dl), sec('🐮 Milkeritos', ml));
    const n = Object.keys(have).length;
    app.append(h('div', { class: 'cave-screen' },
      h('div', { class: 'wrap' },
        h('div', { class: 'topbar' }, h('button', { class: 'icon-btn', 'aria-label': 'Volver', onclick: () => GA.screens.home() }, '⬅'),
          h('h1', { style: { marginRight: 'auto', color: '#fff' } }, '🐉 Mi cueva de dragones'), h('span', { class: 'chip' }, `${n} de ${ALL.length + ALL_SPECIAL.length}`)),
        h('p', { class: 'cave-intro' }, n ? 'Cada respuesta correcta hace nacer un huevo. Si sale un dragón repetido, ¡crece! A veces sale un huevo dorado con una figura especial o un cofre con un tesoro de Hyrule. Toca uno para verlo de cerca.' : '¡Todavía no tienes dragones! Responde bien en cualquier juego y nacerá tu primer huevo.'),
        tabs, specialSection, zeldaSection, grid)));
    GA.say(n ? `Tienes ${n} dragones en tu cueva.` : 'Responde bien para que nazca tu primer dragón.');
  };
})();
