/* Gael Aprende — Leyendas de Hyrule: aprender a leer con The Legend of Zelda: Breath of the Wild.
   Textos originales (inspirados en los consejos de las pantallas de carga, el Compendio Hyrule y la historia del juego),
   de una palabra a historias completas. Los dibujos son claves de img/zelda/<clave>.webp. */
(function () {
  'use strict';
  const W = (w, img, s) => ({ w, img, s: s.split('-') });
  const Q = (k, t, ...o) => ({ k, t, o, a: 0 });
  const T = (id, t, ic, p, q) => ({ id, t, ic, p, q });

  const WORDS = {
    1: [W('Link', 'link', 'Link'), W('Zelda', 'zelda', 'Zel-da'), W('arco', 'arco', 'ar-co'), W('flecha', 'flecha', 'fle-cha'), W('hada', 'hada', 'ha-da'),
      W('hongo', 'hongo', 'hon-go'), W('manzana', 'manzana', 'man-za-na'), W('escudo', 'escudo', 'es-cu-do'), W('espada', 'espada', 'es-pa-da'), W('olla', 'olla', 'o-lla'),
      W('kolog', 'korok', 'ko-log'), W('cuco', 'cucco', 'cu-co'), W('torre', 'torre', 'to-rre'), W('Impa', 'impa', 'Im-pa'), W('Obab', 'hestu', 'O-bab'),
      W('Mipha', 'mipha', 'Mi-pha'), W('Daruk', 'daruk', 'Da-ruk'), W('Kass', 'kass', 'Kass'), W('chuchu', 'chuchu', 'chu-chu'), W('caballo', 'caballo', 'ca-ba-llo')],
    2: [W('guardián', 'guardian', 'guar-dián'), W('bokoblin', 'bokoblin', 'bo-ko-blin'), W('centaleón', 'lynel', 'cen-ta-le-ón'), W('hinox', 'hinox', 'hi-nox'),
      W('lizalfos', 'lizalfos', 'li-zal-fos'), W('moblin', 'moblin', 'mo-blin'), W('paravela', 'paravela', 'pa-ra-ve-la'), W('santuario', 'santuario', 'san-tua-rio'),
      W('castillo', 'castillo', 'cas-ti-llo'), W('chile', 'pimiento', 'chi-le'), W('rábano', 'rabano', 'rá-ba-no'), W('Ganon', 'ganon', 'Ga-non'),
      W('Urbosa', 'urbosa', 'Ur-bo-sa'), W('Revali', 'revali', 'Re-va-li'), W('octorok', 'octorok', 'oc-to-rok'), W('Elegidos', 'campeones', 'E-le-gi-dos'),
      W('corazón', 'corazon', 'co-ra-zón'), W('armadura', 'arm-ancestral', 'ar-ma-du-ra'), W('murciélago', 'keese', 'mur-cié-la-go'), W('brochetas', 'brochetas', 'bro-che-tas')],
  };

  const SENTS = [['Link toma su arco.', 'link-arco'], ['Link monta a caballo.', 'link-caballo'], ['El hada da vida.', 'hada'], ['El kolog se esconde.', 'korok'],
    ['Link sube la torre.', 'torre'], ['La olla tiene fuego.', 'olla'], ['El guardián lanza un rayo.', 'guardian'], ['El bokoblin es rojo.', 'bokoblin'],
    ['Zelda es una princesa.', 'zelda'], ['Link vuela con la paravela.', 'paravela'], ['Obab baila con sus maracas.', 'hestu'], ['El cuco es un ave.', 'cucco'],
    ['La manzana es roja.', 'manzana'], ['El hinox tiene un solo ojo.', 'hinox'], ['Mipha es una zora.', 'mipha'], ['Daruk es un goron muy fuerte.', 'daruk'],
    ['Link sube una montaña.', 'link-escala'], ['El chuchu es una gelatina azul.', 'chuchu']];

  const TF = [['¿Link puede volar con la paravela?', true, 'paravela'], ['¿Los guardianes son amigos de Link?', false, 'guardian'], ['¿El hinox tiene tres ojos?', false, 'hinox'],
    ['¿Los kologs regalan semillas?', true, 'korok'], ['¿La Espada Maestra se rompe para siempre?', false, 'espada'], ['¿Las manzanas recuperan corazones?', true, 'manzana'],
    ['¿El centaleón es un monstruo débil?', false, 'lynel'], ['¿Un hada puede salvarte?', true, 'hada'], ['¿Daruk es un pez?', false, 'daruk'],
    ['¿Revali es un orni que vuela?', true, 'revali'], ['¿Obab es un árbol gigante?', false, 'hestu'], ['¿Los bokoblins duermen de noche?', true, 'bokoblin'],
    ['¿El chile abrasador ayuda contra el frío?', true, 'pimiento'], ['¿El cuco es un pez?', false, 'cucco']];

  const TEXTS = {
    // 5 · Consejos de viaje: una tarjeta, 1 o 2 oraciones
    5: [
      T('t-manzana', 'Consejo: las manzanas', '🍎', [['manzana', 'Las manzanas recuperan corazones. Si las asas en el fuego, ¡recuperan más!']],
        [Q('q', '¿Qué hacen las manzanas?', '❤️ Recuperan corazones', '🪽 Te hacen volar', '🥶 Te dan frío')]),
      T('t-paravela', 'Consejo: la paravela', '🪂', [['paravela', 'Con la paravela puedes bajar volando desde lugares altos. ¡Salta y ábrela!']],
        [Q('q', '¿Para qué sirve la paravela?', '🪂 Para bajar volando', '🏊 Para nadar', '🍳 Para cocinar')]),
      T('t-lluvia', 'Consejo: escalar con lluvia', '🌧️', [['link-escala', 'Cuando llueve, las rocas se mojan y Link se resbala al escalar. Espera a que deje de llover.']],
        [Q('q', '¿Qué pasa si escalas con lluvia?', '💦 Te resbalas', '🚀 Subes más rápido', '🪽 Vuelas')]),
      T('t-kolog', 'Consejo: los kologs', '🍃', [['korok', 'Los kologs se esconden por todo Hyrule. Si encuentras uno, te regala una semilla.']],
        [Q('q', '¿Qué te regala un kolog?', '🌰 Una semilla', '🗡️ Una espada', '🐴 Un caballo')]),
      T('t-frio', 'Consejo: el frío', '🥶', [['pimiento', 'En la nieve hace mucho frío. Come un platillo con chile abrasador y el frío no te hará daño.']],
        [Q('q', '¿Qué te ayuda contra el frío?', '🌶️ El chile abrasador', '🧊 Comer hielo', '💧 Tomar agua')]),
      T('t-torre', 'Consejo: las torres', '🗼', [['torre', 'Sube a las torres sheikah. Desde arriba, tu Piedra Sheikah guarda el mapa de la región.']],
        [Q('q', '¿Qué consigues al subir una torre?', '🗺️ El mapa de la región', '🍎 Una manzana', '🐴 Un caballo')]),
      T('t-hada', 'Consejo: las hadas', '🧚', [['hada', 'Lleva un hada contigo. Si te quedas sin corazones, ¡el hada te salva!']],
        [Q('q', '¿Qué hace el hada si te quedas sin corazones?', '🧚 Te salva', '💨 Se va volando', '💔 Te quita más corazones')]),
      T('t-caballo', 'Consejo: domar caballos', '🐴', [['caballo', 'Para domar un caballo salvaje, acércate en silencio y súbete. Luego cálmalo con cariño.']],
        [Q('q', '¿Cómo te acercas a un caballo salvaje?', '🤫 En silencio', '📢 Gritando', '🏃 Corriendo')]),
      T('t-keese', 'Consejo: de noche', '🦇', [['keese', 'De noche salen los keese. Son murciélagos que vuelan en grupo y te persiguen.']],
        [Q('q', '¿Qué son los keese?', '🦇 Murciélagos', '🐟 Peces', '🌳 Árboles')]),
      T('t-princesa', 'Consejo: una flor especial', '💠', [['princesa', 'La princesa de la calma es una flor azul muy difícil de encontrar. Era la flor favorita de Zelda.']],
        [Q('q', '¿De qué color es la princesa de la calma?', '🔵 Azul', '🔴 Roja', '🟡 Amarilla')]),
      T('t-escalada', 'Consejo: ropa de montañés', '🧗', [['arm-escalada', 'La ropa de montañés ayuda a Link a subir paredes y montañas mucho más rápido.']],
        [Q('q', '¿Para qué sirve la ropa de montañés?', '🧗 Para subir más rápido', '🏊 Para nadar', '🔥 Para no quemarse')]),
    ],
    // 6 · Consejos de aventurero: 2 o 3 oraciones
    6: [
      T('t-tormenta', 'Consejo: las tormentas', '⚡', [['espada-viajero', 'En una tormenta eléctrica, los rayos buscan el metal. Si ves chispas en tu espada o tu escudo de metal, ¡guárdalos rápido! Mientras pasa la tormenta, usa armas de madera.']],
        [Q('i', '¿Por qué hay que guardar las armas de metal en una tormenta?', '⚡ Porque atraen los rayos', '🧲 Porque se pegan', '🪨 Porque pesan mucho'),
          Q('q', '¿Qué armas puedes usar durante la tormenta?', '🪵 De madera', '⚔️ De metal', '💎 De diamante')]),
      T('t-cocina', 'Consejo: cocinar', '🍲', [['olla', 'Puedes cocinar en una olla que tenga fuego debajo. Junta hasta cinco ingredientes y mira qué sale. Si mezclas cosas que no combinan, ¡te saldrá una comida sospechosa!']],
        [Q('q', '¿Cuántos ingredientes puedes poner en la olla?', '🖐️ Hasta cinco', '☝️ Sólo uno', '💯 Cien'),
          Q('i', '¿Qué pasa si mezclas cosas que no combinan?', '🤢 Sale una comida sospechosa', '🎂 Sale un pastel', '💥 Explota la olla')]),
      T('t-aire', 'Consejo: el aire caliente', '🔥', [['paravela', 'El fuego calienta el aire, y el aire caliente sube. Si quemas pasto y abres la paravela encima, ¡el aire te lleva muy alto!']],
        [Q('q', '¿Qué hace el aire caliente?', '⬆️ Sube', '⬇️ Baja', '🧊 Se congela')]),
      T('t-luna', 'Consejo: la luna de sangre', '🌕', [['luna-sangre', 'A medianoche, a veces sale una luna roja: la luna de sangre. Cuando aparece, todos los monstruos que derrotaste vuelven a aparecer.']],
        [Q('q', '¿Qué pasa cuando sale la luna de sangre?', '👹 Vuelven los monstruos', '☀️ Sale el sol', '🍬 Llueven dulces'),
          Q('q', '¿A qué hora sale la luna de sangre?', '🕛 A medianoche', '🌅 En la mañana', '🍽️ A la hora de comer')]),
      T('t-guardian', 'Consejo: los guardianes', '🎯', [['guardian', 'Cuando un guardián te ve, te apunta con una luz roja. Si ves el puntito rojo, ¡corre o escóndete! Con un escudo, en el momento justo, puedes regresarle su rayo.']],
        [Q('i', '¿Qué significa la luz roja del guardián?', '🎯 Que te está apuntando', '😴 Que está dormido', '🎉 Que quiere jugar'),
          Q('q', '¿Con qué puedes regresarle el rayo?', '🛡️ Con un escudo', '🍎 Con una manzana', '🪂 Con la paravela')]),
      T('t-santuarios', 'Consejo: los santuarios', '🏛️', [['santuario', 'Hyrule tiene más de cien santuarios. Adentro hay acertijos que debes resolver pensando con calma. Al final, un monje te da un premio.']],
        [Q('q', '¿Qué hay dentro de los santuarios?', '🧩 Acertijos', '🍕 Comida', '🐴 Caballos'), Q('q', '¿Quién te da el premio al final?', '🧘 Un monje', '👑 El rey', '🐉 Un dragón')]),
      T('t-hestu', 'Consejo: Obab', '🪇', [['hestu', 'Obab es un kolog gigante que baila con sus maracas. Si le das semillas kolog, agranda tu bolsa para que puedas llevar más armas, arcos y escudos.']],
        [Q('q', '¿Qué hace Obab con las semillas?', '🎒 Agranda tu bolsa', '🌳 Siembra árboles', '😋 Se las come')]),
      T('t-calor', 'Consejo: la Montaña de la Muerte', '🌋', [['arm-fuego', 'En la Montaña de la Muerte hace tanto calor que la ropa normal se quema. Para entrar necesitas la armadura ignífuga, que protege a Link del fuego.']],
        [Q('q', '¿Qué protege a Link en la Montaña de la Muerte?', '🔥 La armadura ignífuga', '🧥 Un abrigo', '☂️ Un paraguas')]),
      T('t-hinox', 'Consejo: el hinox', '👁️', [['hinox', 'El hinox es un gigante con un solo ojo. Casi siempre está dormido. Si le disparas una flecha al ojo, ¡se tambalea y se cae!']],
        [Q('q', '¿Dónde hay que disparar al hinox?', '👁️ Al ojo', '🦶 A los pies', '🫃 A la panza')]),
      T('t-lizalfos', 'Consejo: los lizalfos', '🦎', [['lizalfos', 'Los lizalfos son lagartos que cambian de color para esconderse. Son muy rápidos y atacan con su lengua larga. ¡Mira bien a tu alrededor!']],
        [Q('q', '¿Cómo se esconden los lizalfos?', '🎨 Cambian de color', '📦 Se meten en cajas', '🕳️ Hacen un hoyo')]),
      T('t-zora', 'Consejo: la armadura zora', '🌊', [['arm-zora', 'La armadura zora es un regalo de los zora. Con ella, Link nada más rápido y hasta puede subir por las cascadas.']],
        [Q('q', '¿Qué puede hacer Link con la armadura zora?', '🌊 Subir por las cascadas', '🔥 Caminar en lava', '🪽 Volar')]),
    ],
    // 7 · El Compendio Hyrule: un párrafo, dos preguntas
    7: [
      T('c-espada', 'Compendio: la Espada Maestra', '🗡️', [['espada-art', 'La Espada Maestra es la espada que destierra el mal. Duerme en el Bosque Kolog, protegida por el Gran Árbol Deku. Sólo puede sacarla alguien con un corazón muy fuerte: necesitas trece corazones. A diferencia de otras armas, no se rompe para siempre. Cuando se cansa, descansa un rato y vuelve a brillar.']],
        [Q('q', '¿Dónde duerme la Espada Maestra?', '🌳 En el Bosque Kolog', '🏰 En el castillo', '🏜️ En el desierto'),
          Q('q', '¿Qué pasa cuando la Espada Maestra se cansa?', '✨ Descansa y vuelve a brillar', '💔 Se rompe para siempre', '🛡️ Se convierte en escudo')]),
      T('c-guardian', 'Compendio: los guardianes', '🤖', [['guardian-art', 'Los guardianes son máquinas antiguas creadas por los sheikah para proteger Hyrule. Hace cien años, Ganon los controló y los volvió contra el reino. Hoy siguen por todas partes: algunos caminan con seis patas, otros vuelan y otros están rotos, pero aún pueden disparar.']],
        [Q('q', '¿Quién creó a los guardianes?', '🧙 Los sheikah', '👹 Los bokoblins', '🐟 Los zora'),
          Q('i', '¿Por qué los guardianes atacan a Link?', '😈 Porque Ganon los controla', '😂 Porque están jugando', '🍎 Porque tienen hambre')]),
      T('c-centaleon', 'Compendio: el centaleón', '🦁', [['lynel', 'El centaleón es uno de los monstruos más fuertes de Hyrule. Tiene cabeza de león, cuerpo de caballo y lanza bolas de fuego. Los viajeros prudentes lo evitan, pero los valientes conocen un truco: si le das en la cara, se aturde y puedes subirte a su lomo.']],
        [Q('q', '¿Cómo es el centaleón?', '🦁 Cabeza de león y cuerpo de caballo', '🐟 Cabeza de pez y alas', '🐻 Un oso pequeño'),
          Q('q', '¿Qué pasa si le das en la cara?', '💫 Se aturde y puedes subirte', '😂 Se ríe', '💤 Se duerme toda la noche'),
          Q('v', '¿Qué quiere decir “prudentes”?', '🤔 Que piensan antes de actuar', '😴 Que tienen sueño', '🏃 Que corren rápido')]),
      T('c-kolog', 'Compendio: los kologs', '🍃', [['bosque-kolog', 'Los kologs son pequeños espíritus del bosque con caras de hoja. Viven con el Gran Árbol Deku y les encanta jugar a las escondidas: se ocultan bajo piedras, en lo alto de los árboles o dentro de anillos de flores. En todo Hyrule hay novecientos kologs, y cada uno te regala una semilla.']],
        [Q('q', '¿Cuántos kologs hay en Hyrule?', '9️⃣ Novecientos', '🔟 Diez', '💯 Cien'),
          Q('q', '¿A qué juego les encanta jugar?', '🙈 A las escondidas', '⚽ Al futbol', '♟️ Al ajedrez')]),
      T('c-piedra', 'Compendio: la Piedra Sheikah', '📱', [['tableta', 'La Piedra Sheikah es una tableta antigua que Link recibe al despertar. Tiene poderes increíbles: crea bombas, mueve objetos de metal como un imán, detiene el tiempo de las cosas y hace bloques de hielo sobre el agua. También tiene una cámara para tomar fotos y llenar el compendio.']],
        [Q('q', '¿Qué cosas puede mover como un imán?', '🧲 Objetos de metal', '🌳 Árboles', '💧 Agua'),
          Q('q', '¿Para qué sirve la cámara?', '📸 Para tomar fotos y llenar el compendio', '📞 Para llamar a Zelda', '🎮 Para jugar videojuegos')]),
      T('c-tunica', 'Compendio: la túnica de campeón', '👕', [['tunica', 'La túnica de campeón es azul. Es igual a la que Link usaba hace cien años, cuando era el caballero de la princesa Zelda. Tiene un poder especial: cuando Link la lleva puesta, puede ver cuántos corazones le quedan a cada enemigo.']],
        [Q('q', '¿De qué color es la túnica de campeón?', '🔵 Azul', '🔴 Roja', '🟢 Verde'),
          Q('q', '¿Qué puede ver Link con la túnica?', '❤️ Los corazones del enemigo', '🗺️ Todo el mapa', '🌙 La luna de sangre')]),
      T('c-impa', 'Compendio: Impa y Kakariko', '🏯', [['kakariko', 'La aldea Kakariko está escondida entre montañas. Ahí vive Impa, una sheikah muy anciana y sabia que conoció a Link y a Zelda hace cien años. Impa le pide a Link que busque los lugares de las fotos de su Piedra Sheikah para recuperar sus recuerdos.']],
        [Q('q', '¿Dónde vive Impa?', '🏯 En la aldea Kakariko', '🏰 En el castillo de Hyrule', '🌊 En el mar'),
          Q('i', '¿Para qué sirven las fotos de la Piedra Sheikah?', '🧠 Para que Link recupere sus recuerdos', '🖼️ Para decorar la casa', '🛒 Para comprar cosas')]),
      T('c-corazones', 'Compendio: corazones y vigor', '❤️', [['corazon', 'Al terminar un santuario, ganas un emblema del triunfo. Si juntas cuatro, puedes llevarlos a una estatua de la diosa. Ella te deja escoger: un contenedor de corazón, para tener más vida, o una vasija de vigor, para correr y escalar más tiempo.']],
        [Q('q', '¿Cuántos emblemas necesitas juntar?', '4️⃣ Cuatro', '1️⃣ Uno', '🔟 Diez'),
          Q('i', '¿Qué conviene escoger si quieres escalar más tiempo?', '💚 Una vasija de vigor', '❤️ Un contenedor de corazón', '🍎 Una manzana')]),
    ],
    // 8 · Los Campeones y las Bestias Divinas: dos páginas
    8: [
      T('h-mipha', 'Mipha y Vah Ruta', '💧', [['mipha', 'Mipha era la princesa de los zora, un pueblo que vive en el agua. Era amable, tranquila y tenía un poder maravilloso: podía curar las heridas de los demás. Desde niña fue amiga de Link y lo cuidaba cuando se lastimaba.'],
        ['vah-ruta', 'Mipha era la piloto de Vah Ruta, una Bestia Divina enorme con forma de elefante. Con su trompa puede lanzar chorros de agua. Cuando Ganon la controló, Vah Ruta empezó a echar tanta agua que la lluvia no paraba en la región de los zora.']],
        [Q('q', '¿Qué poder tenía Mipha?', '💗 Curar heridas', '⚡ Lanzar rayos', '🌪️ Hacer viento'), Q('q', '¿Qué forma tiene Vah Ruta?', '🐘 De elefante', '🐫 De camello', '🦅 De pájaro'),
          Q('i', '¿Por qué no paraba de llover?', '🐘 Porque Vah Ruta echaba demasiada agua', '☁️ Porque era invierno', '🌊 Porque el mar creció')]),
      T('h-daruk', 'Daruk y Vah Rudania', '🔥', [['daruk', 'Daruk era el Elegido de los goron, un pueblo de gigantes de piedra que vive en la Montaña de la Muerte. Era grandote, alegre y muy valiente. Le encantaba comer rocas. Su poder creaba un escudo que lo protegía de cualquier golpe.'],
        ['vah-rudania', 'Daruk piloteaba a Vah Rudania, una Bestia Divina con forma de salamandra gigante. Puede caminar sobre las paredes del volcán. Cuando Ganon la controló, Rudania empezó a hacer temblar la montaña y a lanzar lava.']],
        [Q('q', '¿Qué le encantaba comer a Daruk?', '🪨 Rocas', '🍎 Manzanas', '🐟 Pescado'), Q('q', '¿Qué creaba el poder de Daruk?', '🛡️ Un escudo', '🌪️ Un tornado', '💧 Agua'),
          Q('q', '¿Dónde está Vah Rudania?', '🌋 En la Montaña de la Muerte', '🏜️ En el desierto', '❄️ En la nieve')]),
      T('h-revali', 'Revali y Vah Medoh', '🦅', [['revali', 'Revali era el Elegido de los orni, un pueblo de aves que vive en lo alto de las montañas. Era el mejor arquero de Hyrule y estaba muy orgulloso de eso. Su poder hacía una ráfaga de viento que lo lanzaba hacia arriba.'],
        ['vah-medoh', 'Revali piloteaba a Vah Medoh, una Bestia Divina con forma de pájaro enorme. Vuela por el cielo sobre la aldea de los orni. Cuando Ganon la controló, empezó a disparar a cualquiera que se acercara volando.']],
        [Q('q', '¿En qué era el mejor Revali?', '🏹 En usar el arco', '🍳 En cocinar', '🏊 En nadar'), Q('q', '¿Qué forma tiene Vah Medoh?', '🦅 De pájaro', '🐘 De elefante', '🦎 De salamandra'),
          Q('v', 'Si Revali estaba “orgulloso”, se sentía…', '😤 Muy contento de lo que sabía hacer', '😢 Triste', '😨 Asustado')]),
      T('h-urbosa', 'Urbosa y Vah Naboris', '⚡', [['urbosa', 'Urbosa era la jefa de las gerudo, un pueblo de guerreras que vive en el desierto. Era alta, fuerte y muy sabia. Quería a Zelda como si fuera su hija. Con un chasquido de sus dedos podía llamar a los rayos.'],
        ['vah-naboris', 'Urbosa piloteaba a Vah Naboris, una Bestia Divina con forma de camello gigante. Camina por el desierto gerudo. Cuando Ganon la controló, Naboris empezó a lanzar rayos y una tormenta de arena cubrió el desierto.']],
        [Q('q', '¿Qué podía llamar Urbosa con sus dedos?', '⚡ Rayos', '🌧️ Lluvia', '❄️ Nieve'), Q('q', '¿Dónde camina Vah Naboris?', '🏜️ Por el desierto', '🌊 Por el mar', '🏔️ Por la nieve'),
          Q('i', '¿Cómo era el cariño de Urbosa por Zelda?', '💗 Como el de una mamá', '😠 No la quería', '🤷 No la conocía')]),
    ],
    // 9 · Historias de Hyrule
    9: [
      T('s-despertar', 'El despertar de Link', '👁️', [
        ['resurreccion', 'Link abrió los ojos en una cueva oscura. Estaba dentro de un estanque de agua brillante. Una voz suave le dijo: —Despierta, Link. Abre los ojos. Link no sabía dónde estaba. Tampoco recordaba quién era.'],
        ['tableta', 'Junto a él encontró una tableta antigua: la Piedra Sheikah. Al tomarla, una puerta de piedra se abrió. Link caminó hacia la luz y salió de la cueva.'],
        ['meseta', 'Afuera, el viento movía el pasto. Desde lo alto de la meseta, Link vio todo el reino de Hyrule: bosques, montañas, ríos y, a lo lejos, un castillo rodeado de una nube oscura.'],
        ['anciano', 'Cerca de una fogata encontró a un anciano. —Si quieres bajar de esta meseta, necesitas una paravela —le dijo—. Te daré la mía si me traes los tesoros de cuatro santuarios.'],
        ['santuario', 'Link exploró la meseta. Resolvió acertijos, peleó con bokoblins y aprendió a usar los poderes de la Piedra Sheikah. Uno por uno, completó los cuatro santuarios.'],
        ['rhoam', 'Entonces el anciano le contó un secreto: era el espíritu del rey Rhoam, el papá de Zelda. —Mi hija lleva cien años deteniendo a Ganon en el castillo. Por favor, Link, sálvala.'],
        ['paravela', 'El rey le dio su paravela y desapareció. Link respiró hondo, saltó desde la orilla de la meseta y abrió la paravela. La gran aventura acababa de comenzar.']],
        [Q('q', '¿Dónde despertó Link?', '🕳️ En una cueva oscura', '🏰 En el castillo', '🏖️ En la playa'), Q('o', '¿Qué hizo Link justo después de salir de la cueva?', '👀 Miró todo el reino desde la meseta', '🪂 Abrió la paravela', '🏛️ Completó cuatro santuarios'),
          Q('q', '¿Quién era en verdad el anciano?', '👑 El rey Rhoam, papá de Zelda', '🧙 Impa', '👹 Ganon disfrazado'), Q('i', '¿Por qué Link no recordaba nada?', '💤 Porque durmió cien años', '🍄 Porque comió un hongo raro', '🎭 Porque estaba jugando')]),
      T('s-cien-anos', 'Hace cien años', '⏳', [
        ['campeones', 'Hace cien años, el reino de Hyrule se preparaba para una gran batalla. Una antigua leyenda decía que Ganon, el mal más terrible, iba a regresar.'],
        ['zelda', 'La princesa Zelda tenía un poder sagrado, pero no sabía cómo despertarlo. Rezaba y entrenaba todos los días, aunque a veces se sentía triste porque el poder no aparecía.'],
        ['vah-medoh', 'Para pelear contra Ganon, los sheikah habían construido cuatro Bestias Divinas y muchísimos guardianes. Cuatro héroes fueron escogidos para pilotear las bestias. Los llamaron los Elegidos: Mipha, Daruk, Revali y Urbosa.'],
        ['link', 'Link fue escogido para proteger a la princesa. Era el caballero de la Espada Maestra. Hablaba poco, pero siempre estaba a su lado.'],
        ['ganon', 'Entonces Ganon despertó. Con su magia oscura tomó el control de los guardianes y de las Bestias Divinas. Los Elegidos quedaron atrapados dentro de las bestias y el castillo se llenó de una nube oscura.'],
        ['guardian-art', 'Link protegió a Zelda en su huida, peleando contra un guardián tras otro hasta que ya no pudo más. Cuando un guardián estaba a punto de atacarlo, Zelda se puso frente a él y de su mano salió una luz dorada. ¡Su poder por fin había despertado!'],
        ['resurreccion', 'Los guardianes se apagaron. Zelda pidió a los sheikah que llevaran a Link a un santuario especial para que sanara mientras dormía. Después, la princesa fue sola al castillo para detener a Ganon. Y ahí lo ha detenido durante cien años.']],
        [Q('q', '¿Cuántos Elegidos piloteaban las Bestias Divinas?', '4️⃣ Cuatro', '2️⃣ Dos', '🔟 Diez'), Q('q', '¿Qué controló Ganon con su magia?', '🤖 Los guardianes y las Bestias Divinas', '🐴 Los caballos', '🌳 Los árboles'),
          Q('o', '¿Qué pasó justo después de que el poder de Zelda despertó?', '💤 Los guardianes se apagaron', '👹 Ganon despertó', '🏰 Zelda entrenaba todos los días'), Q('i', '¿Cómo se sentía Zelda cuando su poder no aparecía?', '😢 Triste y preocupada', '😂 Muy divertida', '😴 Con sueño')]),
    ],
    // 10 · Grandes historias
    10: [
      T('s-bestias', 'Las Bestias Divinas despiertan', '🐘', [
        ['kakariko', 'Link llegó a la aldea Kakariko, donde lo esperaba Impa. —Las cuatro Bestias Divinas están en manos de Ganon —le explicó—. Si las liberas, los espíritus de los Elegidos te ayudarán en la batalla final.'],
        ['vah-ruta', 'Primero fue a la región de los zora, donde llovía sin parar. Con flechas eléctricas detuvo a Vah Ruta y entró en ella. Adentro venció a una criatura de Ganon. Entonces apareció el espíritu de Mipha. —Gracias, Link. Te regalo mi poder: cuando te quedes sin corazones, te curaré.'],
        ['vah-medoh', 'Después voló hasta la aldea de los orni. Con la ayuda de un joven arquero, esquivó los cañones de Vah Medoh en pleno vuelo y aterrizó sobre ella. Al liberarla, el espíritu de Revali le dijo, todavía un poco presumido: —Toma mi ráfaga de viento. Con ella podrás volar más alto que nadie.'],
        ['vah-rudania', 'En la Montaña de la Muerte, Link usó su armadura ignífuga para no quemarse. Rudania lanzaba lava, pero un goron llamado Yunobo lo ayudó a detenerla. El espíritu de Daruk soltó una gran carcajada: —¡Bien hecho, hermanito! Aquí tienes mi escudo protector.'],
        ['vah-naboris', 'Por último cruzó el desierto gerudo, entre arena y rayos. Junto a la joven jefa Riju, logró subir a Vah Naboris. Cuando venció al monstruo de su interior, el espíritu de Urbosa sonrió: —Te debo mucho. Llévate mi furia: los rayos estarán contigo.'],
        ['campeones', 'Las cuatro Bestias Divinas giraron lentamente hasta apuntar hacia el castillo de Hyrule. Una luz azul salió de cada una. Los Elegidos estaban listos.'],
        ['espada-art', 'Faltaba algo. Link fue al Bosque Kolog, donde la Espada Maestra lo esperaba clavada en una piedra. El Gran Árbol Deku lo miró en silencio. Link tomó la empuñadura y jaló con todas sus fuerzas. Esta vez, su corazón era lo bastante fuerte: la espada brilló y salió de la piedra.'],
        ['link', '—Ahora sí, héroe —dijo el Gran Árbol Deku—. La princesa te espera. Link guardó la espada en su espalda y miró hacia el castillo. Era hora de terminar lo que había empezado hace cien años.']],
        [Q('q', '¿Qué pasaría si Link liberaba las cuatro bestias?', '👻 Los Elegidos lo ayudarían', '🌧️ Llovería para siempre', '🏠 Se iría a su casa'), Q('q', '¿Qué poder le regaló Mipha?', '💗 Curarlo cuando se quede sin corazones', '⚡ Lanzar rayos', '🌪️ Volar más alto'),
          Q('o', '¿Qué hizo Link después de liberar las cuatro bestias?', '🗡️ Fue por la Espada Maestra', '🏜️ Cruzó el desierto', '💧 Fue a la región de los zora'), Q('i', '¿Por qué esta vez sí pudo sacar la espada?', '❤️ Porque su corazón ya era lo bastante fuerte', '💪 Porque comió mucho', '🍀 Por pura suerte')]),
      T('s-final', 'La batalla final', '⚔️', [
        ['castillo', 'El castillo de Hyrule estaba cubierto por una nube roja y negra. Por las paredes subían raíces moradas llenas de ojos. Link entró con cuidado, escondiéndose de los guardianes que vigilaban los pasillos.'],
        ['guardian', 'Subió por torres, saltó entre muros y peleó contra monstruos fuertes. En lo más alto encontró una sala enorme. En el centro, como un capullo gigante, estaba Ganon.'],
        ['ganon', 'De pronto, el capullo se abrió y apareció Ganon, el Cataclismo: una criatura de humo y metal con muchas patas, armas de guardián y un ojo brillante. Su grito hizo temblar todo el castillo.'],
        ['vah-naboris', 'Pero Link no estaba solo. Desde lejos, las cuatro Bestias Divinas dispararon rayos de luz azul que atravesaron las paredes y golpearon a Ganon. Los Elegidos, cien años después, cumplían su misión.'],
        ['espada', 'Link peleó con todas sus fuerzas. Usó su escudo para regresarle los rayos, esquivó sus garras y lo golpeó con la Espada Maestra, que brillaba más que nunca cerca del mal.'],
        ['luna-sangre', 'Ganon cayó, pero no se rindió. Escapó del castillo y se transformó en una bestia gigantesca, más grande que una montaña, que corría por la pradera de Hyrule.'],
        ['zelda', 'Entonces se escuchó la voz de Zelda: —¡Link! Toma este arco de luz. Una flecha brillante apareció en las manos de Link. Montado en su caballo, apuntó a los puntos débiles de la bestia, uno por uno.'],
        ['link-caballo', 'Con la última flecha, la bestia quedó débil. Zelda apareció en un rayo de luz dorada y usó su poder sagrado para encerrar a Ganon para siempre. El cielo se despejó y el sol volvió a brillar sobre Hyrule. Zelda miró a Link y sonrió: —Gracias por regresar, Link. ¿Te acuerdas de mí?']],
        [Q('q', '¿Cómo entró Link al castillo?', '🤫 Con cuidado, escondiéndose de los guardianes', '🎺 Tocando una trompeta', '🚗 En carro'), Q('i', '¿Quién ayudó a Link desde lejos?', '🐘 Las cuatro Bestias Divinas', '🐔 Los cucos', '🍃 Los kologs'),
          Q('q', '¿Qué le dio Zelda a Link para la última batalla?', '🏹 Un arco de luz', '🍎 Una manzana', '🛡️ Un escudo de madera'), Q('v', '¿Qué quiere decir que el cielo “se despejó”?', '☀️ Que se fueron las nubes', '🌧️ Que empezó a llover', '🌙 Que se hizo de noche')]),
    ],
  };
  Object.entries(TEXTS).forEach(([l, list]) => list.forEach((b) => {
    b.l = +l; b.hy = true;
    b.words = b.p.reduce((a, [, t]) => a + t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length, 0);
  }));

  const LEVELS = ['Palabras de Hyrule', 'Palabras de aventurero', 'Frases del héroe', '¿Verdad o mentira?', 'Consejos de viaje', 'Consejos de aventurero', 'El Compendio Hyrule', 'Los Elegidos y las Bestias Divinas', 'Historias de Hyrule', 'Grandes leyendas'];
  const imgSrc = (k) => { const p = `img/zelda/${k}.webp`; return (window.GA_IMG && window.GA_IMG[p]) || p; };
  GA.HYRULE = { WORDS, SENTS, TF, TEXTS, LEVELS, imgSrc };
})();
