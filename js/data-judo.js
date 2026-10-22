/* Gael Aprende — datos del Dojo de Judo
   Vocabulario básico de judo (lista del sensei de Gael), ordenado de lo que más se usa en clase a lo más técnico.
   Cada cinta es un grupo pequeño de palabras con el mismo tema (agrupar por tema ayuda a recordarlas).
   Campos: w = como lo escribe el sensei · k = kana para la voz japonesa · kd = kana para mostrar (si es distinto) · p = cómo se pronuncia (lectura en español)
           m = significado corto · d = definición completa de la lista (si es distinta) · e = dibujo (emoji) · pose = postura dibujada
           t = truco para recordarla · alt = otra forma común de escribirla · x = palabras que no deben salir juntas como opciones */
(function () {
  'use strict';
  const W = (w, k, p, m, e, t, o = {}) => Object.assign({ w, k, p, m, e, t }, o);

  const BELTS = [
    { id: 'judo1', name: 'Cinta blanca', color: '#FFFFFF', theme: 'Mi dojo', icon: '⚪', words: [
      W('Judo', 'じゅうどう', 'yu-do', 'Camino de la suavidad', '☯️', 'Ju = suave, Do = camino. ¡El camino suave!', { d: 'Camino de la Suavidad o de la gentileza' }),
      W('Dojo', 'どうじょう', 'do-yo', 'Escuela de judo', '🏯', 'Do = camino, Jo = lugar: el lugar donde aprendes el camino.'),
      W('Sensei', 'せんせい', 'sen-sei', 'Maestro', '🧑‍🏫', 'Sensei es quien te enseña. ¡Siempre se le saluda!'),
      W('Judogui', 'じゅうどうぎ', 'yu-do-gui', 'Traje de judo', '🥋', 'Judo + gui (ropa): ¡la ropa del judo!'),
      W('Obi', 'おび', 'o-bi', 'Cinta (cinturón)', '🎗️', 'El obi dice tu nivel: blanca, amarilla, naranja…', { a: 'obi' }),
      W('Rei', 'れい', 'rei', 'Saludar (reverencia)', '🙇', 'Rei suena a “rey”: ante un rey se hace una reverencia.', { pose: 'rei', d: 'Orden para saludar', x: ['ritzurei', 'zarei', 'senseinirei', 'shomennirei', 'otagainirei', 'onegaimas'] }),
      W('Seiza', 'せいざ', 'sei-sa', 'Sentarse de rodillas', '🧎', 'Sei-za: “se sienta” sobre sus talones.', { pose: 'seiza', d: 'Orden de ponerse de rodillas. Sentarse correctamente.' }),
      W('Kiritsu', 'きりつ', 'ki-ri-tsu', '¡De pie!', '🧍', 'Ki-ri-tsu: ¡como un resorte, arriba!', { pose: 'kiritsu', d: 'Orden de ponerse de pie' }),
      W('Mokuso', 'もくそう', 'mo-ku-so', 'Cerrar los ojos', '😌', 'Mokuso: ojos cerrados, respira y piensa en calma.', { pose: 'mokuso', x: ['seiza'] }),
      W('Mokuso yame', 'もくそう やめ', 'mo-ku-so ya-me', 'Abrir los ojos', '👀', 'Yame = ¡basta! Se acabó el mokuso: abre los ojos.'),
      W('Sayonara', 'さようなら', 'sa-yo-na-ra', 'Adiós', '👋', '¡Sayonara! Así se despiden en Japón.'),
      W('Itai', 'いたい', 'i-tai', '¡Me duele!', '🤕', '¡Itai! Suena a “¡ay, ay!”. Dilo si algo te duele.', { d: 'Dolor' }),
    ] },
    { id: 'judo2', name: 'Cinta amarilla', color: '#FFD43B', theme: 'Saludos', icon: '🟡', words: [
      W('Ohaio', 'おはよう', 'o-ja-yo', 'Buenos días', '🌅', 'O-ha-yo: ¡ya salió el sol!', { alt: 'Ohayō' }),
      W('Konichiwa', 'こんにちわ', 'ko-ni-chi-wa', 'Buenas tardes', '☀️', 'Konichiwa también sirve para decir “hola”.', { alt: 'Konnichiwa', kd: 'こんにちは' }),
      W('Kombanwa', 'こんばんわ', 'kom-ban-wa', 'Buenas noches (al llegar)', '🌙', 'Kom-BAN-wa: llegas al dojo y ya es de noche.', { kd: 'こんばんは' }),
      W('Oyasuminasai', 'おやすみなさい', 'o-ya-su-mi-na-sai', 'Buenas noches (al irte)', '😴', 'O-ya-su-mi: ¡a descansar! Lo dices cuando te vas a dormir.', { d: 'Buenas noches al retirarse' }),
      W('Onegaimas', 'おねがいします', 'o-ne-gai-shi-mas', 'Saludo al terminar la clase', '🙏', 'Quiere decir “por favor”: ¡por favor, entrena conmigo!', { alt: 'Onegaishimasu', d: 'Saludo en posición de pie al terminar la clase', x: ['ritzurei'] }),
      W('Ritzu-rei', 'りつれい', 'ri-tsu-rei', 'Saludo de pie', '🙇', 'Ritsu = de pie. Rei = saludo.', { pose: 'rei', alt: 'Ritsu-rei', d: 'Saludo en posición de pie' }),
      W('Za-rei', 'ざれい', 'sa-rei', 'Saludo de rodillas', '🧎', 'Za = sentado. Rei = saludo.', { pose: 'zarei', d: 'Saludo en posición de seiza' }),
      W('Sensei-ni-rei', 'せんせいにれい', 'sen-sei-ni-rei', 'Saludo al maestro', '🙇‍♂️🧑‍🏫', 'Sensei + ni (al) + rei (saludo).', { d: 'Saludo hacia el maestro' }),
      W('Shomen-ni-rei', 'しょうめんにれい', 'sho-men-ni-rei', 'Saludo al frente', '🙇‍♂️🏯', 'Shomen = el frente del dojo.'),
      W('Otagai-ni-rei', 'おたがいにれい', 'o-ta-gai-ni-rei', 'Saludo entre compañeros', '🙇‍♂️🙇', 'Otagai = uno al otro: los dos se saludan.', { d: 'Saludo entre dos (en shiai)' }),
      W('Kiotsuke', 'きをつけ', 'ki-o-tsu-ke', '¡Atención! (firmes)', '🫡', '¡Kiotsuke! Firmes y quietos, como estatua.', { pose: 'kiotsuke', d: 'Atención', x: ['tadase', 'shisentai', 'shisei'] }),
      W('Agura', 'あぐら', 'a-gu-ra', 'Sentado con piernas cruzadas', '🧘', 'A-gu-ra: sentado como cuando ves una película en el piso.', { pose: 'agura' }),
    ] },
    { id: 'judo3', name: 'Cinta naranja', color: '#FF922B', theme: '¡A entrenar!', icon: '🟠', words: [
      W('Junbi-undo', 'じゅんびうんどう', 'yun-bi-un-do', 'Calentamiento', '🤸', 'Junbi = preparar, Undo = ejercicio.', { d: 'Ejercicios de calentamiento' }),
      W('Seiri-taiso', 'せいりたいそう', 'sei-ri-tai-so', 'Ejercicios al terminar', '🧘‍♂️', 'Taiso = gimnasia. Se hace al final para relajar el cuerpo.', { d: 'Ejercicios al terminar el entrenamiento' }),
      W('Ukemi', 'うけみ', 'u-ke-mi', 'Práctica de caídas', '💥', '¡Ukemi! Caer bien para no lastimarte: ¡plaf con la mano!', { pose: 'ukemi', d: 'Pasivo, práctica de caídas' }),
      W('Uke', 'うけ', 'u-ke', 'Recibir (el que recibe)', '🤲', 'Uke recibe la técnica de su compañero.', { d: 'Recibir' }),
      W('Uchi-komi', 'うちこみ', 'u-chi-ko-mi', 'Repetir entradas de una técnica', '🔁', 'Uchi-komi: entrar y salir, ¡una y otra vez!', { d: 'Entradas y salidas de una técnica', x: ['tureiwaza'] }),
      W('Randori', 'らんどり', 'ran-do-ri', 'Competencia de pie', '🤼', 'Randori: practicar libre con un compañero, ¡como un juego de verdad!', { x: ['shiai'] }),
      W('Shiai', 'しあい', 'shi-ai', 'Competencia (torneo)', '🏆', 'Shiai: ¡el día del torneo!', { d: 'Competencia libre' }),
      W('Kata', 'かた', 'ka-ta', 'Movimientos ya establecidos', '📋', 'Kata: como un baile que siempre se hace igual.', { d: 'Procedimiento pre-establecido', x: ['kihondosa'] }),
      W('Kiai', 'きあい', 'ki-ai', 'Grito de combate', '📣', '¡Kiai! Un grito con fuerza que sale de la panza.', { d: 'Grito de combate utilizado para contener el diafragma' }),
      W('Kumikata', 'くみかた', 'ku-mi-ka-ta', 'Forma de agarrar', '✊', 'Kumi = agarrar, Kata = forma: cómo tomas el judogui.'),
      W('Soito', 'せいと', 'sei-to', 'Alumno', '🧒', '¡Tú eres un alumno del dojo!', { alt: 'Seito', x: ['shoshinsha'] }),
      W('Shoshinsha', 'しょしんしゃ', 'sho-shin-sha', 'Principiante', '🐣', 'Sho-shin = corazón nuevo: el que apenas empieza.'),
    ] },
    { id: 'judo4', name: 'Cinta verde', color: '#2FB344', theme: 'Direcciones y tamaños', icon: '🟢', words: [
      W('Mae', 'まえ', 'ma-e', 'Al frente', '⬆️', 'Mae-ukemi: caída hacia el frente.'),
      W('Ushiro', 'うしろ', 'u-shi-ro', 'Atrás', '⬇️', 'Ushiro-ukemi: caída hacia atrás.'),
      W('Yoko', 'よこ', 'yo-ko', 'Lado', '↔️', 'Yoko-ukemi: caída de lado.'),
      W('O', 'おお', 'o', 'Grande', '🐘', 'O-soto-gari: ¡la O es de grande!'),
      W('Ko', 'こ', 'ko', 'Pequeño', '🐭', 'Ko-soto-gari: ¡la Ko es pequeñita!'),
      W('Mawari', 'まわり', 'ma-wa-ri', 'Círculo, dar la vuelta', '🔄', 'Ma-wa-ri: dar vueltas como rueda.', { d: 'Círculo, circunferencia', x: ['guruma'] }),
      W('Ho', 'ほう', 'jo', 'Dirección, camino', '🧭', 'Ho: hacia dónde vas.'),
      W('Tani', 'たに', 'ta-ni', 'Valle', '🏞️', 'Tani-otoshi: caer al valle.'),
      W('Yama', 'やま', 'ya-ma', 'Montaña', '⛰️', 'Yama-arashi: la tormenta de la montaña.'),
      W('Hadaka', 'はだか', 'ja-da-ka', 'Desnudo', '🙌', 'Hadaka-jime: sin usar el judogui, ¡solo los brazos!'),
      W('Ku', 'く', 'ku', 'Nuevo', '🆕', 'Ku: ¡algo nuevo!'),
      W('Morote', 'もろて', 'mo-ro-te', 'Brazo cruzado sobre el pecho', '💪', 'Morote-seoi-nage: ¡con los dos brazos!'),
    ] },
    { id: 'judo5', name: 'Cinta azul', color: '#2F7DE1', theme: 'Pedacitos de técnicas', icon: '🔵', words: [
      W('Barai', 'ばらい', 'ba-rai', 'Barrida con los pies', '🧹', 'De-ashi-barai: ¡barres el pie como escoba!'),
      W('Harai', 'はらい', 'ja-rai', 'Barrida de cadera', '🌪️', 'Harai-goshi: barres con la cadera.'),
      W('Guruma', 'ぐるま', 'gu-ru-ma', 'Rotación (rueda)', '🛞', 'Kata-guruma: ¡gira como rueda!', { d: 'Rotación' }),
      W('Otoshi', 'おとし', 'o-to-shi', 'Bloqueo', '🧱', 'Tai-otoshi: tu cuerpo bloquea y tu compañero cae.'),
      W('Gatame', 'がため', 'ga-ta-me', 'Control, inmovilización', '🔒', 'Kesa-gatame: ¡lo controlas y no se puede mover!', { x: ['osae', 'osaekomi'] }),
      W('Osae', 'おさえ', 'o-sa-e', 'Mantener en el piso', '📌', 'Osae: lo mantienes pegado al piso.', { x: ['osaekomi'] }),
      W('Garami', 'がらみ', 'ga-ra-mi', 'Enrollado', '🌀', 'Ude-garami: el brazo enrollado.'),
      W('Tomoe', 'ともえ', 'to-mo-e', 'Sacrificio de cuerpo', '⭕', 'Tomoe-nage: te dejas caer y lanzas en círculo.'),
      W('Tsurikomi', 'つりこみ', 'tsu-ri-ko-mi', 'Acción de brazos', '🎣', 'Tsuri = pescar: jalas como con caña de pescar.'),
      W('Kake', 'かけ', 'ka-ke', 'Colgar, suspender', '🪝', 'Kake: el final de la técnica, ¡cuando lanzas!'),
      W('Tsukuri', 'つくり', 'tsu-ku-ri', 'Construcción', '🏗️', 'Tsukuri: construyes la técnica, te acomodas.'),
      W('Kusuhi', 'くずし', 'ku-su-shi', 'Desequilibrio', '⚖️', 'Primero lo desequilibras… ¡y luego lo lanzas!', { alt: 'Kuzushi' }),
    ] },
    { id: 'judo6', name: 'Cinta morada', color: '#8E44AD', theme: 'Posturas y lugares', icon: '🟣', words: [
      W('Shisei', 'しせい', 'shi-sei', 'Postura, actitud', '🧍', 'Shisei: cómo te paras y cómo te portas.', { x: ['jigotai', 'shisentai', 'tadase'] }),
      W('Shisen', 'しぜん', 'shi-sen', 'Natural', '🌿', 'Shizen = natural, como la naturaleza.', { alt: 'Shizen', x: ['shisentai'] }),
      W('Shisentai', 'しぜんたい', 'shi-sen-tai', 'Postura natural', '🧍‍♂️', 'Shizen + tai (cuerpo): cuerpo natural.', { pose: 'shizentai', alt: 'Shizentai', x: ['tadase', 'jigotai'] }),
      W('Jigotai', 'じごたい', 'yi-go-tai', 'Postura defensiva', '🦀', 'Jigotai: piernas abiertas y bajito, ¡firme como roca!', { pose: 'jigotai' }),
      W('Sabaki', 'さばき', 'sa-ba-ki', 'Manejar, manipular', '🕺', 'Tai-sabaki: mover tu cuerpo con agilidad.'),
      W('Hiza-zume', 'ひざづめ', 'ji-sa-su-me', 'Moverse de rodillas', '🦵', 'Hiza = rodilla: caminar de rodillas.', { d: 'Desplazamiento sobre las rodillas' }),
      W('Kamiza', 'かみざ', 'ka-mi-sa', 'Lugar de honor del sensei', '👑', 'Kami-za: el lugar de arriba, el más importante.', { d: 'Lugar de honor para el sensei' }),
      W('Joseki', 'じょうせき', 'yo-se-ki', 'Lugar a la izquierda del sensei', '⬅️', 'Joseki: donde se sientan los instructores.', { d: 'Lugar a la izquierda del sensei, para el instructor' }),
      W('Shimoza', 'しもざ', 'shi-mo-sa', 'Lugar donde se forman los alumnos', '🧍🧍🧍', 'Shimo = abajo: ahí se forman los alumnos.', { d: 'Lugar donde se forman los alumnos de izquierda a derecha', x: ['shimozeki'] }),
      W('Shimozeki', 'しもせき', 'shi-mo-se-ki', 'Fila de alumnos en ángulo de 90°', '📐', 'Shimozeki: como shimoza, pero en la esquina.', { d: 'Igual que shimoza pero formando un ángulo de 90°' }),
      W('Shiaijo', 'しあいじょう', 'shi-ai-yo', 'Área de competencia', '🟩', 'Shiai (competencia) + jo (lugar).', { x: ['yionai'] }),
      W('Tadase', 'ただせ', 'ta-da-se', '¡Endereza el cuerpo!', '📏', 'Tadase: ¡espalda derechita!', { pose: 'tadase', d: 'Orden de erguir el cuerpo' }),
    ] },
    { id: 'judo7', name: 'Cinta café', color: '#8B5A2B', theme: 'Judogui y combate', icon: '🟤', words: [
      W('Uwagi', 'うわぎ', 'u-wa-gui', 'Saco del judogui', '🧥', 'Uwagi: la parte de arriba del judogui.', { d: 'Saco (parte superior del judogui)' }),
      W('Shitabaki', 'したばき', 'shi-ta-ba-ki', 'Pantalón', '👖', 'Shita = abajo: ¡la parte de abajo!'),
      W('Yiogai', 'じょうがい', 'yo-gai', 'Área de protección', '🟥', 'Jogai: afuera, la orilla que protege.', { alt: 'Jōgai' }),
      W('Yionai', 'じょうない', 'yo-nai', 'Área de combate', '🟨', 'Jonai: adentro, donde se pelea.', { alt: 'Jōnai' }),
      W('Reiho', 'れいほう', 'rei-jo', 'Etiqueta (buenos modales)', '🎩', 'Rei (saludo) + ho (manera): los buenos modales del judo.', { d: 'Etiqueta' }),
      W('Kappo', 'かっぽう', 'ka-po', 'Técnicas de reanimación', '❤️‍🩹', 'Kappo: ayudar a alguien a recuperarse.'),
      W('Kusure', 'くずれ', 'ku-su-re', 'Variantes', '🔀', 'Kuzure-kesa-gatame: otra forma de hacer kesa-gatame.', { alt: 'Kuzure' }),
      W('Kihon-dosa', 'きほんどうさ', 'ki-jon-do-sa', 'Movimientos básicos', '🔤', 'Kihon = lo básico, como el ABC.'),
      W('Naute', 'なうて', 'na-u-te', 'Regresar a su lugar', '↩️', 'Naute: ¡regresa a tu lugar!'),
      W('Jukado', 'じゅかど', 'yu-ka-do', 'Defensa personal', '🦸', 'Jukado: saber cuidarte a ti mismo.', { x: ['fusegiwaza', 'gonosenwaza'] }),
      W('Yudansha-kai', 'ゆうだんしゃかい', 'yu-dan-sha-kai', 'Colegio de cintas negras', '🥋⚫', 'Yudansha = los que ya tienen cinta negra.', { d: 'Dojo para grados Dan o Colegio de Cintas Negras' }),
    ] },
    { id: 'judo8', name: 'Cinta negra', color: '#1F1F1F', theme: 'Tipos de técnicas (waza)', icon: '⚫', words: [
      W('Nage-waza', 'なげわざ', 'na-gue-wa-sa', 'Técnicas de proyección', '🤾', 'Nage = lanzar. Waza = técnica.'),
      W('Kaeshi-waza', 'かえしわざ', 'ka-e-shi-wa-sa', 'Técnica de contraataque', '↪️', 'Kaeshi = regresar: le regresas el ataque.', { x: ['urawaza', 'gonosenwaza'] }),
      W('Renraku-waza', 'れんらくわざ', 'ren-ra-ku-wa-sa', 'Técnicas combinadas en secuencia', '🔗', 'Renraku = conectar: una técnica tras otra.'),
      W('Tokui-waza', 'とくいわざ', 'to-kui-wa-sa', 'Técnica favorita', '⭐', 'Tokui: ¡tu especialidad, la que mejor te sale!'),
      W('Tsukuri-waza', 'つくりわざ', 'tsu-ku-ri-wa-sa', 'Técnica propia', '🛠️', 'Tsukuri-waza: la técnica que tú construyes.', { x: ['tandakuwaza', 'tokuiwaza'] }),
      W('Ura-waza', 'うらわざ', 'u-ra-wa-sa', 'Técnica de volteo', '🙃', 'Ura = el revés: ¡volteas la situación!'),
      W('Kote-kubi-waza', 'こてくびわざ', 'ko-te-ku-bi-wa-sa', 'Palanca a las muñecas', '🤚', 'Kote-kubi = muñeca.', { d: 'Técnica de palanquear las muñecas' }),
      W('Fusegi-waza', 'ふせぎわざ', 'fu-se-gui-wa-sa', 'Métodos de defensa', '🛡️', 'Fusegi = defender.', { d: 'Métodos técnicos de defensa', x: ['gonosenwaza'] }),
      W('Gonosen-waza', 'ごのせんわざ', 'go-no-sen-wa-sa', 'Técnica de defensa', '🧱🛡️', 'Go no sen: defiendes y respondes después del ataque.'),
      W('Tandaku-waza', 'たんどくわざ', 'tan-do-ku-wa-sa', 'Entrenamiento técnico individual', '🪞', 'Tandoku = solo: practicas sin compañero.', { alt: 'Tandoku-waza' }),
      W('Turei-waza', 'つれいわざ', 'tu-rei-wa-sa', 'Entradas a derecha e izquierda', '👈👉', 'Turei-waza: entras de un lado y del otro.', { d: 'Entradas técnicas, derechas e izquierdas' }),
      W('Nogare kata', 'のがれかた', 'no-ga-re-ka-ta', 'Formas de ataque en el piso', '🐊', 'Nogare: luchar en el piso, ¡bajito como cocodrilo!'),
    ] },
    // Extra (no venían en la lista): las palabras que dice el árbitro en un torneo
    { id: 'judo9', name: 'Palabras del árbitro', color: '#E03131', theme: 'Extra para torneos', icon: '🧑‍⚖️', bonus: true, words: [
      W('Hajime', 'はじめ', 'ja-yi-me', '¡Comiencen!', '🏁', '¡Hajime! El combate empieza.', { pose: 'hajime' }),
      W('Matte', 'まて', 'ma-te', '¡Alto! (esperen)', '✋', '¡Matte! Todos quietos un momento.', { pose: 'matte' }),
      W('Sore made', 'それまで', 'so-re-ma-de', '¡Se acabó el combate!', '🔚', 'Sore made: ¡fin del combate!'),
      W('Ippon', 'いっぽん', 'i-pon', '¡Punto completo! (ganas)', '🥇', '¡Ippon! El brazo del árbitro sube: ¡ganaste!', { pose: 'ippon' }),
      W('Waza-ari', 'わざあり', 'wa-sa-a-ri', 'Medio punto', '🥈', 'Waza-ari: brazo de lado, ¡casi ippon!', { pose: 'wazaari' }),
      W('Osaekomi', 'おさえこみ', 'o-sa-e-ko-mi', '¡Inmovilización! (corre el tiempo)', '⏱️', 'Osaekomi: lo tienes en el piso y el reloj empieza a contar.'),
      W('Toketa', 'とけた', 'to-ke-ta', 'Se escapó de la inmovilización', '🔓', 'Toketa: ¡se soltó!'),
      W('Shido', 'しどう', 'shi-do', 'Castigo pequeño (falta)', '⚠️', 'Shido: un regaño por no seguir las reglas.'),
    ] },
  ];

  const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
  const WORDS = [];
  const byId = {};
  BELTS.forEach((b, n) => {
    b.n = n;
    b.words.forEach((w) => { w.id = slug(w.w); w.belt = n; WORDS.push(w); byId[w.id] = w; });
  });

  GA.JUDO = { BELTS, WORDS, byId };
})();
