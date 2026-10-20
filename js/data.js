/* Gael Aprende — datos: palabras con imagen y sílabas, rimas, oraciones y cuentos */
(function () {
  'use strict';
  const W = (w, e, s) => ({ w, e, s: s.split('-') });

  GA.WORDS = [
    // 1 sílaba
    W('sol', '☀️', 'sol'), W('pan', '🍞', 'pan'), W('mar', '🌊', 'mar'), W('pez', '🐟', 'pez'), W('flor', '🌸', 'flor'), W('tren', '🚂', 'tren'), W('pie', '🦶', 'pie'),
    // 2 sílabas directas
    W('gato', '🐱', 'ga-to'), W('pato', '🦆', 'pa-to'), W('luna', '🌙', 'lu-na'), W('casa', '🏠', 'ca-sa'), W('vaca', '🐮', 'va-ca'), W('foca', '🦭', 'fo-ca'),
    W('mono', '🐒', 'mo-no'), W('oso', '🐻', 'o-so'), W('uva', '🍇', 'u-va'), W('pera', '🍐', 'pe-ra'), W('piña', '🍍', 'pi-ña'), W('coco', '🥥', 'co-co'),
    W('dado', '🎲', 'da-do'), W('rosa', '🌹', 'ro-sa'), W('nube', '☁️', 'nu-be'), W('pino', '🌲', 'pi-no'), W('lobo', '🐺', 'lo-bo'), W('toro', '🐂', 'to-ro'),
    W('vela', '🕯️', 've-la'), W('bota', '👢', 'bo-ta'), W('foco', '💡', 'fo-co'), W('cama', '🛏️', 'ca-ma'), W('rana', '🐸', 'ra-na'), W('sopa', '🍲', 'so-pa'),
    W('taza', '☕', 'ta-za'), W('nido', '🪺', 'ni-do'), W('mano', '✋', 'ma-no'), W('ojo', '👁️', 'o-jo'), W('hoja', '🍃', 'ho-ja'), W('hada', '🧚', 'ha-da'),
    W('llave', '🔑', 'lla-ve'), W('silla', '🪑', 'si-lla'), W('perro', '🐶', 'pe-rro'), W('zorro', '🦊', 'zo-rro'), W('queso', '🧀', 'que-so'), W('hueso', '🦴', 'hue-so'),
    W('kiwi', '🥝', 'ki-wi'), W('yoyo', '🪀', 'yo-yo'), W('gota', '💧', 'go-ta'), W('boca', '👄', 'bo-ca'), W('lápiz', '✏️', 'lá-piz'), W('pulpo', '🐙', 'pul-po'),
    W('isla', '🏝️', 'is-la'), W('imán', '🧲', 'i-mán'), W('uña', '💅', 'u-ña'), W('ola', '🌊', 'o-la'), W('árbol', '🌳', 'ár-bol'), W('ratón', '🐭', 'ra-tón'),
    W('avión', '✈️', 'a-vión'), W('melón', '🍈', 'me-lón'), W('balón', '🏀', 'ba-lón'), W('camión', '🚚', 'ca-mión'), W('reloj', '⌚', 're-loj'), W('nariz', '👃', 'na-riz'),
    // trabadas
    W('fresa', '🍓', 'fre-sa'), W('bruja', '🧙', 'bru-ja'), W('plato', '🍽️', 'pla-to'), W('globo', '🎈', 'glo-bo'), W('grillo', '🦗', 'gri-llo'), W('tigre', '🐯', 'ti-gre'),
    W('cabra', '🐐', 'ca-bra'), W('libro', '📖', 'li-bro'), W('dragón', '🐉', 'dra-gón'), W('trompeta', '🎺', 'trom-pe-ta'), W('estrella', '⭐', 'es-tre-lla'),
    W('cocodrilo', '🐊', 'co-co-dri-lo'), W('plátano', '🍌', 'plá-ta-no'), W('cangrejo', '🦀', 'can-gre-jo'), W('bicicleta', '🚲', 'bi-ci-cle-ta'),
    // 3+ sílabas
    W('pelota', '⚽', 'pe-lo-ta'), W('manzana', '🍎', 'man-za-na'), W('tomate', '🍅', 'to-ma-te'), W('conejo', '🐰', 'co-ne-jo'), W('caballo', '🐴', 'ca-ba-llo'),
    W('camello', '🐫', 'ca-me-llo'), W('ballena', '🐳', 'ba-lle-na'), W('gallina', '🐔', 'ga-lli-na'), W('paloma', '🕊️', 'pa-lo-ma'), W('tortuga', '🐢', 'tor-tu-ga'),
    W('jirafa', '🦒', 'ji-ra-fa'), W('zapato', '👞', 'za-pa-to'), W('cohete', '🚀', 'co-he-te'), W('helado', '🍦', 'he-la-do'), W('abeja', '🐝', 'a-be-ja'),
    W('araña', '🕷️', 'a-ra-ña'), W('oveja', '🐑', 'o-ve-ja'), W('oreja', '👂', 'o-re-ja'), W('ardilla', '🐿️', 'ar-di-lla'), W('erizo', '🦔', 'e-ri-zo'),
    W('escoba', '🧹', 'es-co-ba'), W('iglesia', '⛪', 'i-gle-sia'), W('mariposa', '🦋', 'ma-ri-po-sa'), W('elefante', '🐘', 'e-le-fan-te'), W('dinosaurio', '🦕', 'di-no-sau-rio'),
    W('unicornio', '🦄', 'u-ni-cor-nio'), W('ventana', '🪟', 'ven-ta-na'), W('campana', '🔔', 'cam-pa-na'), W('botella', '🍾', 'bo-te-lla'), W('anillo', '💍', 'a-ni-llo'),
    W('ladrillo', '🧱', 'la-dri-llo'), W('pingüino', '🐧', 'pin-güi-no'), W('lagarto', '🦎', 'la-gar-to'), W('huevo', '🥚', 'hue-vo'), W('hielo', '🧊', 'hie-lo'),
    W('llama', '🦙', 'lla-ma'), W('barco', '⛵', 'bar-co'), W('sandía', '🍉', 'san-dí-a'), W('galleta', '🍪', 'ga-lle-ta'), W('corazón', '❤️', 'co-ra-zón'),
    W('tambor', '🥁', 'tam-bor'), W('guitarra', '🎸', 'gui-ta-rra'), W('mochila', '🎒', 'mo-chi-la'), W('robot', '🤖', 'ro-bot'), W('regalo', '🎁', 're-ga-lo'),
    W('pizza', '🍕', 'pi-zza'), W('limón', '🍋', 'li-món'), W('caracol', '🐌', 'ca-ra-col'), W('delfín', '🐬', 'del-fín'), W('tiburón', '🦈', 'ti-bu-rón'),
  ];
  GA.wordByName = (w) => GA.WORDS.find((x) => x.w === w);
  GA.findWords = (list) => list.map(GA.wordByName).filter(Boolean);

  // Palabras sin acento ni dígrafos raros, buenas para deletrear
  GA.SPELL = {
    3: ['sol', 'pan', 'mar', 'pez', 'oso', 'uva', 'ojo', 'pie', 'ola'],
    4: ['gato', 'pato', 'luna', 'casa', 'vaca', 'foca', 'mono', 'pera', 'coco', 'dado', 'rosa', 'nube', 'pino', 'lobo', 'toro', 'vela', 'bota', 'cama', 'rana', 'sopa', 'taza', 'nido', 'mano', 'hoja', 'flor', 'tren', 'gota', 'boca', 'kiwi', 'isla'],
    5: ['perro', 'tigre', 'globo', 'fresa', 'queso', 'libro', 'zorro', 'pulpo', 'tomate', 'conejo', 'pelota', 'helado', 'abeja', 'oveja', 'jirafa', 'zapato', 'cohete', 'plato', 'barco', 'huevo', 'llave', 'silla', 'cabra', 'robot', 'regalo', 'mochila', 'galleta'],
  };

  // Grupos de rima
  GA.RHYMES = [
    ['gato', 'pato', 'zapato', 'plato'],
    ['ratón', 'avión', 'dragón', 'camión', 'melón', 'balón', 'corazón', 'tiburón', 'limón'],
    ['rana', 'manzana', 'ventana', 'campana'],
    ['pelota', 'bota', 'gota'],
    ['queso', 'hueso'],
    ['grillo', 'anillo', 'ladrillo'],
    ['rosa', 'mariposa'],
    ['estrella', 'botella'],
    ['foca', 'boca'],
    ['oveja', 'oreja'],
    ['pino', 'pingüino'],
    ['helado', 'dado'],
  ].map((g) => g.filter((w) => GA.wordByName(w))).filter((g) => g.length >= 2);

  GA.VERSES = [
    { t: 'Un ratón muy glotón se comió todo el ___.', a: 'melón' },
    { t: 'La rana se asoma por la ___.', a: 'ventana' },
    { t: 'Mi gato se puso un ___.', a: 'zapato' },
    { t: 'La mariposa vuela sobre la ___.', a: 'rosa' },
    { t: 'El grillo encontró un ___.', a: 'anillo' },
    { t: 'La foca abre la ___.', a: 'boca' },
    { t: 'Cayó una gota dentro de mi ___.', a: 'bota' },
    { t: 'El perro no quiere hueso, prefiere comer ___.', a: 'queso' },
    { t: 'La oveja mueve la ___.', a: 'oreja' },
    { t: 'Al pingüino le gusta el ___.', a: 'pino' },
    { t: 'Junto a mi helado tengo un ___.', a: 'dado' },
    { t: 'La estrella brilla en la ___.', a: 'botella' },
  ];

  GA.SENTENCES = {
    1: [['El', 'gato', 'duerme', '🐱💤'], ['La', 'vaca', 'come', '🐮🌿'], ['Mi', 'perro', 'corre', '🐶💨'], ['El', 'sol', 'brilla', '☀️✨'],
      ['La', 'rana', 'salta', '🐸⬆️'], ['El', 'pez', 'nada', '🐟🌊'], ['El', 'bebé', 'llora', '👶😢'], ['Yo', 'leo', 'cuentos', '🧒📚'], ['La', 'abeja', 'vuela', '🐝🌸']],
    2: [['La', 'niña', 'come', 'una', 'manzana', '👧🍎'], ['El', 'pájaro', 'canta', 'en', 'el', 'árbol', '🐦🌳'], ['Mi', 'mamá', 'lee', 'un', 'cuento', '👩📖'],
      ['El', 'tren', 'va', 'muy', 'rápido', '🚂💨'], ['Gael', 'juega', 'con', 'su', 'pelota', '🧒⚽'], ['El', 'oso', 'come', 'miel', '🐻🍯'],
      ['La', 'luna', 'sale', 'de', 'noche', '🌙⭐'], ['Mi', 'gato', 'toma', 'leche', '🐱🥛']],
    3: [['El', 'perro', 'grande', 'corre', 'por', 'el', 'parque.', '🐕🌳'], ['Los', 'niños', 'juegan', 'con', 'la', 'pelota', 'roja.', '👦👧🔴'],
      ['Mañana', 'vamos', 'a', 'visitar', 'a', 'la', 'abuela.', '👵🏡'], ['La', 'tortuga', 'camina', 'muy', 'despacio.', '🐢🐾'],
      ['El', 'cohete', 'viaja', 'hacia', 'la', 'luna.', '🚀🌙'], ['Las', 'abejas', 'hacen', 'miel', 'dulce.', '🐝🍯']],
    4: [['¿Dónde', 'está', 'mi', 'gato?', '🐱❓'], ['¿Quieres', 'jugar', 'conmigo?', '🧒🤝'], ['¡Qué', 'bonita', 'es', 'la', 'luna!', '🌕✨'],
      ['¿Cuántos', 'años', 'tienes', 'tú?', '🎂❓'], ['¡Cuidado', 'con', 'el', 'charco!', '⚠️💧'], ['¿Por', 'qué', 'el', 'cielo', 'es', 'azul?', '🌤️❓']],
  };

  GA.OPPOSITES = [
    ['grande', '🐘', 'pequeño', '🐭'], ['caliente', '🔥', 'frío', '🧊'], ['día', '☀️', 'noche', '🌙'], ['feliz', '😀', 'triste', '😢'],
    ['rápido', '🐇', 'lento', '🐢'], ['alto', '🦒', 'bajo', '🐁'], ['abierto', '🔓', 'cerrado', '🔒'], ['despierto', '😃', 'dormido', '😴'],
    ['lleno', '🍪', 'vacío', '🫙'], ['arriba', '⬆️', 'abajo', '⬇️'], ['dulce', '🍬', 'salado', '🧂'], ['limpio', '✨', 'sucio', '💩'],
  ];
  GA.CATEGORIES = {
    frutas: { name: 'Frutas', icon: '🍎', items: ['🍎', '🍌', '🍇', '🍓', '🍐', '🍍', '🍉', '🥝', '🍒', '🍑'] },
    animales: { name: 'Animales', icon: '🐾', items: ['🐶', '🐱', '🐮', '🐷', '🐸', '🐵', '🦁', '🐴', '🐰', '🐔'] },
    transportes: { name: 'Transportes', icon: '🚗', items: ['🚗', '🚌', '🚂', '✈️', '🚲', '🚀', '⛵', '🚁', '🚚', '🛵'] },
    ropa: { name: 'Ropa', icon: '👕', items: ['👕', '👖', '🧦', '👟', '🧢', '🧥', '👗', '🧤', '🧣', '🩳'] },
    musica: { name: 'Instrumentos', icon: '🎵', items: ['🎸', '🥁', '🎺', '🎻', '🎹', '🪗', '🎷', '🪘'] },
    verduras: { name: 'Verduras', icon: '🥕', items: ['🥕', '🥦', '🌽', '🥒', '🍅', '🧅', '🥬', '🫑'] },
  };
  GA.SYNONYMS = [
    ['contento', 'feliz', ['triste', 'enojado']], ['grande', 'enorme', ['diminuto', 'corto']], ['bonito', 'hermoso', ['feo', 'raro']],
    ['rápido', 'veloz', ['lento', 'quieto']], ['hablar', 'conversar', ['callar', 'dormir']], ['mirar', 'observar', ['oír', 'oler']],
    ['comenzar', 'empezar', ['terminar', 'parar']], ['asustado', 'con miedo', ['valiente', 'tranquilo']], ['listo', 'inteligente', ['torpe', 'cansado']],
    ['charlar', 'platicar', ['gritar', 'correr']],
  ];

  // Cuentos cortos con preguntas de distinto tipo (q = literal, o = orden, i = inferencia, v = vocabulario/emociones)
  GA.STORIES = [
    {
      id: 'tortuga', title: 'Lola quiere ver el mar', icon: '🐢',
      lines: [['🐢', 'Lola era una tortuga pequeña que vivía en el bosque.'], ['🌊', 'Un día dijo: “¡Quiero ver el mar!”'],
        ['🐾', 'Caminó despacio, paso a paso, durante todo el día.'], ['🦀', 'Un cangrejo amable le mostró el camino.'],
        ['🌅', 'Al atardecer, Lola por fin vio el mar y sonrió muy feliz.']],
      qs: [
        { k: 'q', t: '¿Qué animal es Lola?', o: ['🐢 Una tortuga', '🐰 Un conejo', '🐸 Una rana'], a: 0 },
        { k: 'q', t: '¿Qué quería ver Lola?', o: ['🌊 El mar', '🏔️ Una montaña', '🌙 La luna'], a: 0 },
        { k: 'q', t: '¿Quién le mostró el camino?', o: ['🦀 Un cangrejo', '🐦 Un pájaro', '🐟 Un pez'], a: 0 },
        { k: 'o', t: '¿Qué pasó primero?', o: ['🌊 Lola dijo que quería ver el mar', '🦀 Encontró al cangrejo', '🌅 Vio el mar'], a: 0 },
        { k: 'o', t: '¿Qué pasó al final?', o: ['🌅 Lola vio el mar', '🐾 Lola empezó a caminar', '🌲 Lola vivía en el bosque'], a: 0 },
        { k: 'i', t: '¿Por qué tardó todo el día en llegar?', o: ['🐢 Porque las tortugas caminan despacio', '😴 Porque se durmió', '🚗 Porque fue en carro'], a: 0 },
        { k: 'v', t: '¿Cómo se sintió Lola al ver el mar?', o: ['😀 Feliz', '😢 Triste', '😠 Enojada'], a: 0 },
        { k: 'v', t: '“Amable” quiere decir…', o: ['🤝 Que ayuda y trata bien', '😠 Que se enoja', '💨 Que corre rápido'], a: 0 },
      ],
    },
    {
      id: 'cohete', title: 'El cohete de Gael', icon: '🚀',
      lines: [['📦', 'Gael y su papá hicieron un cohete con una caja de cartón.'], ['🎨', 'Lo pintaron de azul y le pusieron estrellas amarillas.'],
        ['🔟', 'Gael contó: “¡Tres, dos, uno, despegue!”'], ['🌙', 'Imaginó que volaba hasta la luna.'],
        ['👽', 'Allí conoció a un extraterrestre que comía queso.'], ['🍽️', 'Después, Gael regresó a casa porque ya era hora de cenar.']],
      qs: [
        { k: 'q', t: '¿Con qué hicieron el cohete?', o: ['📦 Con una caja de cartón', '🪵 Con madera', '🥫 Con latas'], a: 0 },
        { k: 'q', t: '¿De qué color lo pintaron?', o: ['🔵 Azul', '🔴 Rojo', '🟢 Verde'], a: 0 },
        { k: 'q', t: '¿Qué comía el extraterrestre?', o: ['🧀 Queso', '🍕 Pizza', '🍌 Plátano'], a: 0 },
        { k: 'o', t: '¿Qué hicieron después de construir el cohete?', o: ['🎨 Lo pintaron', '🍽️ Cenaron', '👽 Conocieron al extraterrestre'], a: 0 },
        { k: 'i', t: '¿El viaje a la luna fue de verdad?', o: ['💭 No, Gael lo imaginó', '✅ Sí, voló de verdad', '📺 Lo vio en la tele'], a: 0 },
        { k: 'i', t: '¿Por qué regresó Gael a casa?', o: ['🍽️ Porque era hora de cenar', '😨 Porque tuvo miedo', '🌧️ Porque llovió'], a: 0 },
        { k: 'v', t: '“Despegue” es cuando un cohete…', o: ['🚀 Sale volando', '🛬 Aterriza', '🔧 Se rompe'], a: 0 },
      ],
    },
    {
      id: 'semilla', title: 'La semilla dormilona', icon: '🌱',
      lines: [['🌰', 'Bajo la tierra dormía una semilla muy dormilona.'], ['🌧️', 'Un día, la lluvia la mojó y la despertó.'],
        ['☀️', 'El sol calentó la tierra con sus rayos.'], ['🌱', 'La semilla estiró un brote verde hacia arriba.'],
        ['🌻', 'Poco a poco creció una flor amarilla y grande.'], ['🐝', 'Una abeja llegó a visitarla y le dio las gracias.']],
      qs: [
        { k: 'q', t: '¿Dónde dormía la semilla?', o: ['🟫 Bajo la tierra', '☁️ En una nube', '🏠 En una casa'], a: 0 },
        { k: 'q', t: '¿Qué despertó a la semilla?', o: ['🌧️ La lluvia', '🔔 Una campana', '🐶 Un perro'], a: 0 },
        { k: 'q', t: '¿De qué color era la flor?', o: ['🟡 Amarilla', '🔴 Roja', '🟣 Morada'], a: 0 },
        { k: 'o', t: '¿Qué pasó antes de que creciera la flor?', o: ['🌱 Salió un brote verde', '🐝 Llegó la abeja', '🌻 La flor se hizo grande'], a: 0 },
        { k: 'i', t: '¿Qué necesitó la semilla para crecer?', o: ['💧☀️ Agua y sol', '🍫 Chocolate', '📺 Ver la tele'], a: 0 },
        { k: 'i', t: '¿Por qué la abeja visitó la flor?', o: ['🌼 Para tomar su néctar', '😴 Para dormir', '🎵 Para cantar'], a: 0 },
        { k: 'v', t: '“Dormilona” quiere decir que…', o: ['😴 Le gusta dormir mucho', '🏃 Corre mucho', '🍽️ Come mucho'], a: 0 },
      ],
    },
    {
      id: 'pelota', title: 'Max busca su pelota', icon: '🐶',
      lines: [['🐶', 'Max era un perrito que tenía una pelota roja.'], ['😟', 'Una mañana, ¡la pelota desapareció!'],
        ['🛏️', 'Max buscó debajo de la cama, pero no estaba.'], ['🌳', 'Buscó en el jardín, pero tampoco.'],
        ['🐱', 'Entonces vio a Michi, la gata, jugando con su pelota.'], ['🤝', 'Michi se la devolvió y jugaron juntos toda la tarde.']],
      qs: [
        { k: 'q', t: '¿De qué color era la pelota?', o: ['🔴 Roja', '🔵 Azul', '🟡 Amarilla'], a: 0 },
        { k: 'q', t: '¿Quién tenía la pelota?', o: ['🐱 Michi, la gata', '🐭 Un ratón', '🦜 Un loro'], a: 0 },
        { k: 'o', t: '¿Dónde buscó Max primero?', o: ['🛏️ Debajo de la cama', '🌳 En el jardín', '🚗 En el carro'], a: 0 },
        { k: 'o', t: '¿Qué pasó al final?', o: ['🤝 Jugaron juntos', '😢 Max lloró', '🛏️ Max se durmió'], a: 0 },
        { k: 'i', t: '¿Cómo se sintió Max cuando no encontraba su pelota?', o: ['😟 Preocupado', '😀 Muy feliz', '😴 Con sueño'], a: 0 },
        { k: 'i', t: '¿Qué aprendimos de Michi?', o: ['🤝 Que compartir es divertido', '🏃 Que hay que correr', '🍖 Que hay que comer'], a: 0 },
        { k: 'v', t: '“Desapareció” quiere decir que…', o: ['❓ Ya no se veía', '🎉 Hizo una fiesta', '🔊 Hizo ruido'], a: 0 },
      ],
    },
    {
      id: 'nube', title: 'Nube Gris', icon: '☁️',
      lines: [['☁️', 'Nube Gris estaba triste porque nadie quería la lluvia.'], ['🧒', '“¡Vete, nube! Queremos jugar afuera”, decían los niños.'],
        ['🥀', 'Pero las plantas del campo tenían mucha sed.'], ['🌧️', 'Nube Gris lloró gotas de lluvia sobre el campo.'],
        ['🌈', 'Luego salió el sol y apareció un arcoíris enorme.'], ['👏', 'Todos aplaudieron y Nube Gris se sintió muy orgullosa.']],
      qs: [
        { k: 'q', t: '¿Por qué estaba triste Nube Gris?', o: ['🌧️ Nadie quería la lluvia', '🌞 Hacía calor', '🎈 Perdió un globo'], a: 0 },
        { k: 'q', t: '¿Quiénes tenían sed?', o: ['🌿 Las plantas', '🐟 Los peces', '🚗 Los carros'], a: 0 },
        { k: 'q', t: '¿Qué apareció después de la lluvia?', o: ['🌈 Un arcoíris', '⛄ Un muñeco de nieve', '🌙 La luna'], a: 0 },
        { k: 'o', t: '¿Qué pasó después de que llovió?', o: ['🌈 Salió el arcoíris', '🧒 Los niños dijeron “vete”', '☁️ La nube estaba triste'], a: 0 },
        { k: 'i', t: '¿Por qué la lluvia es importante?', o: ['🌱 Ayuda a crecer a las plantas', '🎮 Sirve para jugar videojuegos', '🍬 Es dulce'], a: 0 },
        { k: 'v', t: 'Al final, Nube Gris se sintió…', o: ['😊 Orgullosa', '😠 Enojada', '😢 Triste'], a: 0 },
        { k: 'v', t: '“Orgullosa” es sentirse bien por…', o: ['🏅 Algo bueno que hiciste', '🤒 Estar enferma', '😴 Tener sueño'], a: 0 },
      ],
    },
    {
      id: 'dragon', title: 'El dragón que tenía frío', icon: '🐉',
      lines: [['🐉', 'Fito era un dragón que no podía echar fuego.'], ['🥶', 'Por eso siempre tenía mucho frío.'],
        ['🧣', 'Sus amigos le regalaron una bufanda de lana.'], ['🍲', 'También le dieron una sopa muy calientita.'],
        ['🔥', 'Fito se calentó y, ¡fuuu!, echó una llamita pequeña.'], ['🍡', 'Con ella asaron bombones para todos sus amigos.']],
      qs: [
        { k: 'q', t: '¿Cómo se llama el dragón?', o: ['🐉 Fito', '🐉 Max', '🐉 Lola'], a: 0 },
        { k: 'q', t: '¿Qué le regalaron sus amigos?', o: ['🧣 Una bufanda', '👟 Unos zapatos', '🎈 Un globo'], a: 0 },
        { k: 'o', t: '¿Qué pasó después de tomar la sopa?', o: ['🔥 Echó una llamita', '🥶 Tuvo más frío', '🧣 Le dieron la bufanda'], a: 0 },
        { k: 'i', t: '¿Por qué Fito tenía frío?', o: ['🔥 Porque no podía echar fuego', '❄️ Porque vivía en la luna', '🍦 Porque comió helado'], a: 0 },
        { k: 'i', t: '¿Cómo son los amigos de Fito?', o: ['💛 Buenos y generosos', '😠 Gruñones', '😴 Perezosos'], a: 0 },
        { k: 'v', t: '“Calientita” quiere decir…', o: ['🔥 Un poco caliente', '❄️ Muy fría', '🧂 Muy salada'], a: 0 },
        { k: 'v', t: 'Al final, ¿cómo se sintió Fito?', o: ['😊 Feliz y calientito', '😢 Triste', '😨 Asustado'], a: 0 },
      ],
    },
  ];
})();
