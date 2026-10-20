/* Gael Aprende — datos del Gimnasio de Lectura
   Práctica dirigida a: lectura sílaba por sílaba (decodificar, no adivinar), confusión b/d,
   palabras espejo (es/se, la/al, el/le…), sílabas trabadas y fluidez con oraciones de 2 a 35 palabras. */
(function () {
  'use strict';
  const W = (w, e, s) => ({ w, e, s: s.split('-') });

  // Palabras para leer sílaba por sílaba
  const SYL = {
    1: [W('mapa', '🗺️', 'ma-pa'), W('sopa', '🍲', 'so-pa'), W('luna', '🌙', 'lu-na'), W('dado', '🎲', 'da-do'), W('bota', '👢', 'bo-ta'), W('dedo', '☝️', 'de-do'),
      W('nube', '☁️', 'nu-be'), W('boca', '👄', 'bo-ca'), W('mono', '🐒', 'mo-no'), W('pato', '🦆', 'pa-to'), W('vaca', '🐮', 'va-ca'), W('dona', '🍩', 'do-na'),
      W('lobo', '🐺', 'lo-bo'), W('gato', '🐱', 'ga-to'), W('foca', '🦭', 'fo-ca'), W('nido', '🪺', 'ni-do'), W('rosa', '🌹', 'ro-sa'), W('uva', '🍇', 'u-va')],
    2: [W('pelota', '⚽', 'pe-lo-ta'), W('tomate', '🍅', 'to-ma-te'), W('caballo', '🐴', 'ca-ba-llo'), W('ballena', '🐳', 'ba-lle-na'), W('moneda', '🪙', 'mo-ne-da'),
      W('helado', '🍦', 'he-la-do'), W('abeja', '🐝', 'a-be-ja'), W('conejo', '🐰', 'co-ne-jo'), W('paloma', '🕊️', 'pa-lo-ma'), W('banana', '🍌', 'ba-na-na'),
      W('bebida', '🥤', 'be-bi-da'), W('candado', '🔒', 'can-da-do'), W('soldado', '💂', 'sol-da-do'), W('jirafa', '🦒', 'ji-ra-fa'), W('zapato', '👞', 'za-pa-to'),
      W('gusano', '🐛', 'gu-sa-no'), W('botella', '🍾', 'bo-te-lla'), W('cebolla', '🧅', 'ce-bo-lla')],
    3: [W('árbol', '🌳', 'ár-bol'), W('escoba', '🧹', 'es-co-ba'), W('ardilla', '🐿️', 'ar-di-lla'), W('elefante', '🐘', 'e-le-fan-te'), W('espada', '🗡️', 'es-pa-da'),
      W('escalera', '🪜', 'es-ca-le-ra'), W('isla', '🏝️', 'is-la'), W('ensalada', '🥗', 'en-sa-la-da'), W('antena', '📡', 'an-te-na'), W('escuela', '🏫', 'es-cue-la'),
      W('ostión', '🦪', 'os-tión'), W('alcancía', '🐷', 'al-can-cí-a'), W('insecto', '🐞', 'in-sec-to'), W('elote', '🌽', 'e-lo-te'),
      W('almohada', '🛏️', 'al-mo-ha-da'), W('escudo', '🛡️', 'es-cu-do'), W('ancla', '⚓', 'an-cla')],
    5: [W('hipopótamo', '🦛', 'hi-po-pó-ta-mo'), W('helicóptero', '🚁', 'he-li-cóp-te-ro'), W('computadora', '💻', 'com-pu-ta-do-ra'), W('calculadora', '🧮', 'cal-cu-la-do-ra'),
      W('mariposa', '🦋', 'ma-ri-po-sa'), W('dinosaurio', '🦕', 'di-no-sau-rio'), W('mariquita', '🐞', 'ma-ri-qui-ta'), W('zanahoria', '🥕', 'za-na-ho-ria'),
      W('cucaracha', '🪳', 'cu-ca-ra-cha'), W('telescopio', '🔭', 'te-les-co-pio'), W('paracaídas', '🪂', 'pa-ra-ca-í-das'), W('bicicleta', '🚲', 'bi-ci-cle-ta'),
      W('semáforo', '🚦', 'se-má-fo-ro'), W('murciélago', '🦇', 'mur-cié-la-go'), W('cocodrilo', '🐊', 'co-co-dri-lo'), W('caramelo', '🍬', 'ca-ra-me-lo'),
      W('teléfono', '☎️', 'te-lé-fo-no'), W('mantequilla', '🧈', 'man-te-qui-lla'), W('hamburguesa', '🍔', 'ham-bur-gue-sa'), W('calabaza', '🎃', 'ca-la-ba-za'),
      W('unicornio', '🦄', 'u-ni-cor-nio'), W('chocolate', '🍫', 'cho-co-la-te')],
  };

  // Palabras con b y d (con dibujo) y oraciones donde aparecen
  const BD = [W('bota', '👢', 'bo-ta'), W('boca', '👄', 'bo-ca'), W('bebé', '👶', 'be-bé'), W('ballena', '🐳', 'ba-lle-na'), W('bolsa', '👜', 'bol-sa'),
    W('búho', '🦉', 'bú-ho'), W('barco', '⛵', 'bar-co'), W('bandera', '🚩', 'ban-de-ra'), W('abeja', '🐝', 'a-be-ja'), W('lobo', '🐺', 'lo-bo'),
    W('nube', '☁️', 'nu-be'), W('globo', '🎈', 'glo-bo'), W('bombero', '🧑‍🚒', 'bom-be-ro'), W('banco', '🏦', 'ban-co'), W('dado', '🎲', 'da-do'),
    W('dedo', '☝️', 'de-do'), W('dona', '🍩', 'do-na'), W('diente', '🦷', 'dien-te'), W('delfín', '🐬', 'del-fín'), W('dulce', '🍬', 'dul-ce'),
    W('nido', '🪺', 'ni-do'), W('helado', '🍦', 'he-la-do'), W('candado', '🔒', 'can-da-do'), W('moneda', '🪙', 'mo-ne-da'), W('dragón', '🐉', 'dra-gón'),
    W('boda', '💒', 'bo-da'), W('soldado', '💂', 'sol-da-do'), W('dinosaurio', '🦕', 'di-no-sau-rio'), W('bebida', '🥤', 'be-bi-da'), W('escudo', '🛡️', 'es-cu-do')];
  // [oración, palabra objetivo, dibujo]
  const BD_SENTS = [['El bebé toma leche.', 'bebé', '👶'], ['Tiro el dado en el juego.', 'dado', '🎲'], ['La ballena nada en el mar.', 'ballena', '🐳'],
    ['Me duele un diente.', 'diente', '🦷'], ['El búho vuela de noche.', 'búho', '🦉'], ['Mi dedo es pequeño.', 'dedo', '☝️'], ['El barco navega despacio.', 'barco', '⛵'],
    ['El delfín salta alto.', 'delfín', '🐬'], ['La abeja hace miel.', 'abeja', '🐝'], ['El dragón sopla fuego.', 'dragón', '🐉'], ['La bota es de lluvia.', 'bota', '👢'],
    ['Como una dona de chocolate.', 'dona', '🍩'], ['El lobo aúlla a la luna.', 'lobo', '🐺'], ['Guardo una moneda.', 'moneda', '🪙'], ['El bombero apaga el fuego.', 'bombero', '🧑‍🚒'],
    ['El pájaro duerme en su nido.', 'nido', '🪺'], ['La nube es blanca.', 'nube', '☁️'], ['Abro la boca grande.', 'boca', '👄']];

  // Palabras espejo: [la oración con ___, la correcta, la del espejo]
  const MIRROR = [['es', 'se'], ['la', 'al'], ['el', 'le'], ['los', 'sol'], ['las', 'sal'], ['no', 'on'], ['me', 'em'], ['en', 'ne'], ['mi', 'im'], ['un', 'nu'], ['lo', 'ol'], ['sí', 'is'], ['de', 'ed'], ['ya', 'ay']];
  const MIRROR_SENTS = [['Mi perro ___ muy bonito.', 'es', 'se'], ['El gato ___ duerme en la cama.', 'se', 'es'], ['Ana ___ lava las manos.', 'se', 'es'], ['La luna ___ blanca.', 'es', 'se'],
    ['Vamos ___ parque.', 'al', 'la'], ['___ niña come pan.', 'La', 'Al'], ['Dame ___ pelota roja.', 'la', 'al'], ['Papá va ___ mercado.', 'al', 'la'],
    ['___ perro corre rápido.', 'El', 'Le'], ['Mamá ___ da un beso a Gael.', 'le', 'el'], ['___ niños juegan futbol.', 'Los', 'Sol'], ['El ___ sale en la mañana.', 'sol', 'los'],
    ['Échale ___ a la sopa.', 'sal', 'las'], ['Mira ___ flores amarillas.', 'las', 'sal'], ['Yo ___ quiero dormir.', 'no', 'on'], ['El pez vive ___ el agua.', 'en', 'ne'],
    ['___ gato es negro.', 'Mi', 'Im'], ['Tengo ___ perro café.', 'un', 'nu'], ['Mi mamá ___ abraza.', 'me', 'em'], ['El vaso ___ de vidrio.', 'es', 'se'],
    ['La sopa ___ enfría.', 'se', 'es'], ['Llevo el agua ___ jardín.', 'al', 'la'], ['El libro ___ mío.', 'es', 'se'], ['Gael ___ ríe mucho.', 'se', 'es']];

  // Sílabas trabadas
  const TRAB = [W('fresa', '🍓', 'fre-sa'), W('bruja', '🧙', 'bru-ja'), W('plato', '🍽️', 'pla-to'), W('globo', '🎈', 'glo-bo'), W('grillo', '🦗', 'gri-llo'),
    W('tigre', '🐯', 'ti-gre'), W('cabra', '🐐', 'ca-bra'), W('libro', '📖', 'li-bro'), W('dragón', '🐉', 'dra-gón'), W('trompeta', '🎺', 'trom-pe-ta'),
    W('estrella', '⭐', 'es-tre-lla'), W('cocodrilo', '🐊', 'co-co-dri-lo'), W('plátano', '🍌', 'plá-ta-no'), W('cangrejo', '🦀', 'can-gre-jo'), W('bicicleta', '🚲', 'bi-ci-cle-ta'),
    W('tren', '🚂', 'tren'), W('flor', '🌸', 'flor'), W('tractor', '🚜', 'trac-tor'), W('princesa', '👸', 'prin-ce-sa'), W('blusa', '👚', 'blu-sa'),
    W('crayón', '🖍️', 'cra-yón'), W('planeta', '🪐', 'pla-ne-ta'), W('brócoli', '🥦', 'bró-co-li'), W('flamenco', '🦩', 'fla-men-co'), W('sombrero', '👒', 'som-bre-ro'),
    W('trofeo', '🏆', 'tro-fe-o'), W('micrófono', '🎤', 'mi-cró-fo-no'), W('flecha', '🏹', 'fle-cha'), W('brazo', '💪', 'bra-zo'), W('grúa', '🏗️', 'grú-a'),
    W('bloque', '🧱', 'blo-que'), W('trineo', '🛷', 'tri-ne-o'), W('trigo', '🌾', 'tri-go'), W('piedra', '🪨', 'pie-dra'), W('refresco', '🥤', 're-fres-co'),
    W('dromedario', '🐪', 'dro-me-da-rio'), W('cebra', '🦓', 'ce-bra'), W('clavel', '💐', 'cla-vel'), W('ogro', '👹', 'o-gro'), W('cráter', '🌋', 'crá-ter')];
  const TRAB_SENTS = [['La bruja vuela en su escoba.', 'bruja', '🧙'], ['El tren cruza el puente.', 'tren', '🚂'], ['El tigre tiene rayas negras.', 'tigre', '🐯'],
    ['La princesa lee un libro.', 'princesa', '👸'], ['Como fresas con crema.', 'fresas', '🍓'], ['El grillo canta de noche.', 'grillo', '🦗'], ['Mi globo es grande.', 'globo', '🎈'],
    ['El cocodrilo nada en el río.', 'cocodrilo', '🐊'], ['La cebra corre rápido.', 'cebra', '🦓'], ['El tractor trabaja en el campo.', 'tractor', '🚜'],
    ['Bruno toca la trompeta.', 'trompeta', '🎺'], ['La flor es amarilla.', 'flor', '🌸'], ['El plato está limpio.', 'plato', '🍽️'], ['La cabra sube la montaña.', 'cabra', '🐐']];

  // Oraciones veloces: niveles 1–4 se comprueban con el dibujo; 5–7 con una pregunta (la correcta va primero)
  const FLU = {
    1: [['El sol.', '☀️'], ['Un dado.', '🎲'], ['La bota.', '👢'], ['Mi bebé.', '👶'], ['Es un tren.', '🚂'], ['Se cae.', '🍂'], ['La flor.', '🌸'], ['Al agua.', '💦'],
      ['Un globo.', '🎈'], ['El dedo.', '☝️'], ['Una boca.', '👄'], ['Dos patos.', '🦆🦆'], ['Es un búho.', '🦉'], ['La nube.', '☁️']],
    2: [['El dado es rojo.', '🎲'], ['La bruja vuela.', '🧙'], ['El bebé se ríe.', '👶'], ['Mi globo es azul.', '🎈'], ['La nube es blanca.', '☁️'], ['El tren se va.', '🚂'],
      ['Doy un abrazo.', '🤗'], ['La cabra come pasto.', '🐐'], ['El dragón es verde.', '🐉'], ['Bebo agua fría.', '🥛'], ['Veo una estrella.', '⭐'], ['El delfín salta.', '🐬']],
    3: [['El delfín salta en el mar.', '🐬'], ['La niña se baña en la tina.', '🛁'], ['Mi abuelo toca la trompeta.', '🎺'], ['El tigre duerme bajo el árbol.', '🐯'],
      ['Papá va al parque en bici.', '🚲'], ['La abeja busca una flor.', '🐝'], ['Dame la pelota, por favor.', '⚽'], ['El cocodrilo nada en el río.', '🐊'],
      ['Las fresas son dulces y rojas.', '🍓'], ['El libro está sobre la mesa.', '📖'], ['El búho abre los ojos de noche.', '🦉'], ['El bombero apaga el fuego.', '🚒']],
    4: [['El dinosaurio grande come hojas de los árboles altos.', '🦕'], ['La princesa se pone una corona brillante de oro.', '👸'], ['Mi hermano y yo jugamos con bloques de colores.', '🧱'],
      ['El cangrejo camina de lado por la arena blanca.', '🦀'], ['Debajo de la cama hay un dado y una bota.', '🎲'], ['El astronauta viaja en un cohete hacia la luna.', '🚀'],
      ['La ballena azul es el animal más grande del mar.', '🐳'], ['El tractor trabaja en el campo con el granjero.', '🚜'], ['Cuando llueve, me pongo botas y un impermeable.', '☔'],
      ['El dragón sopla fuego y vuela sobre el castillo.', '🏰'], ['Bruno se lava los dientes después de comer.', '🪥'], ['La cebra tiene rayas blancas y negras.', '🦓']],
    5: [['El domingo, Daniela y su abuelo fueron al bosque a buscar piñas para decorar la casa.', '¿Qué buscaban en el bosque?', '🌲 Piñas', '🍓 Fresas', '🐦 Pájaros'],
      ['Bruno tenía un globo rojo, pero el viento sopló fuerte y el globo se fue volando.', '¿Qué pasó con el globo?', '🎈 Se fue volando', '💥 Se reventó', '🎁 Lo regaló'],
      ['En la granja hay una vaca, dos cabras, tres gallinas y un burro que rebuzna.', '¿Cuántas cabras hay?', '2️⃣ Dos', '3️⃣ Tres', '1️⃣ Una'],
      ['La tortuga Blanca camina despacio, pero nunca se detiene hasta llegar a su casa.', '¿Cómo camina la tortuga?', '🐢 Despacio', '🏃 Muy rápido', '🦘 Saltando'],
      ['Diego dibujó un dragón enorme con alas brillantes y lo pegó en la puerta de su cuarto.', '¿Dónde pegó el dibujo?', '🚪 En la puerta de su cuarto', '🧊 En el refrigerador', '🏫 En la escuela'],
      ['Cuando el sol se esconde, las estrellas aparecen y el búho sale a buscar comida.', '¿Quién sale a buscar comida?', '🦉 El búho', '🐓 El gallo', '🐝 La abeja'],
      ['El tren sale a las ocho y llega a la playa antes de la hora de la comida.', '¿A qué hora sale el tren?', '8️⃣ A las ocho', '🔟 A las diez', '🕛 A las doce'],
      ['Brenda le regaló a su mamá un ramo de flores amarillas por su cumpleaños.', '¿Qué le regaló Brenda a su mamá?', '🌼 Flores amarillas', '🎂 Un pastel', '🧸 Un oso']],
    6: [['Dani encontró un dado debajo del sillón. Era el dado que había perdido su hermana la semana pasada.', '¿De quién era el dado?', '👧 De su hermana', '👨 De su papá', '🐶 Del perro'],
      ['El cocodrilo abrió la boca muy grande. Un pajarito entró y le limpió los dientes sin miedo.', '¿Qué hizo el pajarito?', '🪥 Le limpió los dientes', '🎵 Le cantó', '🍽️ Se comió su comida'],
      ['La bruja Brígida preparó una sopa de calabaza. Le puso sal, pimienta y un poco de magia.', '¿De qué era la sopa?', '🎃 De calabaza', '🍅 De tomate', '🥔 De papa'],
      ['En invierno hace frío y los árboles pierden sus hojas. Las aves vuelan al sur buscando lugares calientitos.', '¿A dónde vuelan las aves?', '⬇️ Al sur', '⬆️ Al norte', '🌙 A la luna'],
      ['Pablo se puso el casco antes de subir a su bicicleta. Así protege su cabeza si se cae.', '¿Para qué usa casco Pablo?', '⛑️ Para proteger su cabeza', '☀️ Para el sol', '🎉 Para una fiesta'],
      ['Doña Berta vende tamales en la esquina. Los de dulce son rosas y los de salsa verde pican un poco.', '¿Cuáles tamales pican un poco?', '🌶️ Los de salsa verde', '🍬 Los de dulce', '🧀 Los de queso']],
    7: [['Bety y Dora son gemelas, pero no son iguales. Bety tiene el pelo rizado y le gusta bailar. Dora tiene el pelo lacio y prefiere leer libros de dragones.', '¿Quién prefiere leer?', '📖 Dora', '💃 Bety', '👩 Las dos'],
      ['El trompo de Bruno daba vueltas y vueltas sobre la mesa. De pronto, chocó con un vaso de agua. El agua se derramó y mojó todos los dibujos de Bruno.', '¿Qué mojó el agua?', '🖍️ Los dibujos de Bruno', '👕 La ropa', '🐱 Al gato'],
      ['Las abejas viven en una colmena. Cada día vuelan de flor en flor para recoger néctar. Con el néctar hacen la miel que guardan para el invierno.', '¿Para cuándo guardan la miel?', '❄️ Para el invierno', '🎂 Para una fiesta', '🌞 Para el verano'],
      ['Diana quería ver las estrellas, pero las nubes tapaban el cielo. Esperó un rato sentada en el balcón. Cuando el viento se llevó las nubes, vio una estrella fugaz y pidió un deseo.', '¿Qué tapaba el cielo?', '☁️ Las nubes', '🌳 Un árbol', '🏠 Una casa'],
      ['El dragón Bruno no sabía lanzar fuego. Practicó todos los días con su abuela dragona. Un día, por fin, salió una flamita y toda la familia aplaudió.', '¿Con quién practicó Bruno?', '🐉 Con su abuela', '🧙 Con una bruja', '🦖 Con un dinosaurio']],
  };

  GA.GYM = { SYL, BD, BD_SENTS, MIRROR, MIRROR_SENTS, TRAB, TRAB_SENTS, FLU };
})();
