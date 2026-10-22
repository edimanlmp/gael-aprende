#!/usr/bin/env python3
"""Empaqueta Gael Aprende en un solo archivo HTML (dist/gael-aprende.html).

Uso: python3 build.py
El archivo resultante funciona sin servidor: se puede copiar a una tablet o publicar.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')

css = (ROOT / 'css' / 'app.css').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="css/app.css">', '<style>\n' + css + '\n</style>')


def inline_script(match):
    src = (ROOT / match.group(1)).read_text(encoding='utf-8')
    return '<script>\n' + src.replace('</script', '<\\/script') + '\n</script>'


html = re.sub(r'<script src="(js/[^"]+)"></script>', inline_script, html)

# Imágenes de las figuras especiales incrustadas como data URI
import base64, json
imgs = {}
for f in sorted((ROOT / 'img' / 'especiales').glob('*.jpg')):
    imgs[f'img/especiales/{f.name}'] = 'data:image/jpeg;base64,' + base64.b64encode(f.read_bytes()).decode()
for f in sorted((ROOT / 'img' / 'zelda').glob('*.webp')):
    imgs[f'img/zelda/{f.name}'] = 'data:image/webp;base64,' + base64.b64encode(f.read_bytes()).decode()
# Pronunciación japonesa del Dojo de Judo (grabada con audio_judo.py)
auds = {f'audio/judo/{f.name}': 'data:audio/mpeg;base64,' + base64.b64encode(f.read_bytes()).decode() for f in sorted((ROOT / 'audio' / 'judo').glob('*.mp3'))}
html = html.replace('<script>\n', '<script>\nwindow.GA_IMG = ' + json.dumps(imgs) + ';\nwindow.GA_AUDIO = ' + json.dumps(auds) + ';\n', 1)

out = ROOT / 'dist' / 'gael-aprende.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print(f'Listo: {out} ({out.stat().st_size // 1024} KB)')
