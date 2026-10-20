# Gael Aprende

Plataforma de aprendizaje interactivo para niños de 6 a 10 años, en español. Tres mundos y 33 aventuras con más de 120 niveles:

| Mundo | Aventuras |
|---|---|
| 🔢 **Isla de los Números** (Matemáticas y Lógica) | Contar, Ojo rápido, ¿Cuál es mayor?, El salto de la rana (recta numérica), Sumas, Restas, Decenas y unidades, Patrones, Figuras y cuerpos, Balanza mágica (pre-álgebra), Grupos iguales (multiplicación), Fracciones de pizza, El reloj, Sudoku de animales |
| 🔬 **Bosque de la Ciencia** (Ciencias y Experimentación) | ¿Flota o se hunde?, Laboratorio de colores, Hielo, agua y vapor (simulación de partículas), El mundo animal, Ciclos de la vida, El jardín secreto (experimento de crecimiento), Mi cuerpo, Viaje al espacio, La fuerza de los imanes |
| 📚 **Castillo de las Letras** (Lectura y Lenguaje) | ¿Con qué suena?, Memorama de letras, Arma la palabra (sílabas), Escribe la palabra (y dictado), El tambor de sílabas, Rimas divertidas, Leo y descubro, Ordena la oración, Cuentos mágicos, Palabras mágicas |

## Cómo abrirla

- **Computadora:** doble clic en `index.html` (Chrome, Safari o Edge).
- **Tablet:** ejecuta `python3 build.py` y copia `dist/gael-aprende.html` a la tablet (por AirDrop, Drive o correo) y ábrelo en el navegador. En iPad: Compartir → "Agregar a pantalla de inicio" para usarla como app.
- Necesita internet sólo para las tipografías; sin conexión funciona con letras del sistema.

La voz usa la síntesis de voz del dispositivo. En Mac/iPad, para una voz más natural: Ajustes → Accesibilidad → Contenido leído → Voces → Español (México) → descarga "Paulina" (versión mejorada).

## Cómo funciona el aprendizaje

- **Nivel inicial automático:** la primera vez que juega una aventura, cada acierto lo sube un nivel (hasta el 3) para no aburrirlo.
- **Dominio antes de avanzar:** sube de nivel con 4 puntos en los últimos 5 ejercicios (acierto = 1, acierto con pista = ½). Si falla 3 de 4, baja un nivel con explicaciones.
- **Sin límites de edad:** al dominar una aventura se abren las siguientes; desde el panel para padres se puede desbloquear todo o cambiar el nivel de cualquier habilidad.
- **Repaso espaciado (Leitner):** cada nivel superado vuelve a aparecer a los 1, 3, 7, 14, 30 y 60 días. La *Misión del día* mezcla repasos con práctica de las tres áreas (práctica intercalada).
- **Error = aprendizaje:** primer error → pista y otro intento; segundo error → solución explicada paso a paso.
- **Lecciones cortas** antes de cada concepto nuevo, narradas por Lumi, la mascota.
- **Matemáticas concreto → pictórico → abstracto**, **ciencia predice → observa → explica**, **lectura** de conciencia fonológica a comprensión.

## Panel para padres

Botón 👪 en el inicio (se entra resolviendo una multiplicación). Muestra minutos y ejercicios por día, precisión, fortalezas, áreas de mejora, errores más frecuentes, repasos pendientes, recomendaciones y ajustes (voz, duración de rondas, niveles, respaldo del progreso).

El progreso se guarda en el navegador del dispositivo. Para pasarlo a otro dispositivo usa *Respaldo del progreso* en el panel.

## Estructura

```
index.html        punto de entrada
css/app.css       estilos
js/core.js        utilidades, almacenamiento, voz, sonidos, mascota, arrastrar y soltar
js/ui.js          componentes (opciones, teclado numérico, casillas, clasificador, visuales)
js/engine.js      motor adaptativo, repaso espaciado y misión del día
js/data.js        palabras, rimas, oraciones y cuentos
js/act-*.js       actividades de cada área
js/screens.js     pantallas e interacción de cada ejercicio
js/parents.js     panel para padres
build.py          genera dist/gael-aprende.html (un solo archivo)
```

Para agregar una actividad: llama a `GA.skill({ id, area, title, icon, desc, levels, make(level, ctx) })`, donde `make` devuelve `{ text, render(stage, api), hint, explain }` y la actividad llama a `api.answer(correcto)`.
