#!/usr/bin/env python3
"""Graba la pronunciación japonesa de cada palabra del Dojo de Judo (audio/judo/<id>.mp3).

Usa la voz Kyoko de macOS (`say`) y ffmpeg. Volver a correrlo cuando se agreguen palabras a js/data-judo.js;
sólo graba las que faltan (python3 audio_judo.py --todo para regrabar todas). build.py las incrusta en el archivo único.
"""
import json, pathlib, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / 'audio' / 'judo'
OUT.mkdir(parents=True, exist_ok=True)
js = "global.window={};global.GA={};eval(require('fs').readFileSync('js/data-judo.js','utf8'));" \
     "console.log(JSON.stringify(GA.JUDO.WORDS.map(w=>({id:w.id,k:w.kd||w.k}))))"
words = json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))
words.append({'id': '_omedeto', 'k': 'おめでとう'})
todo = '--todo' in sys.argv


def render(text, dest, extra=()):
    with tempfile.TemporaryDirectory() as tmp:
        aiff = pathlib.Path(tmp) / 'a.aiff'
        subprocess.run(['say', '-v', 'Kyoko', '-r', '150', '-o', str(aiff), text], check=True)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(aiff), *extra, '-ac', '1', '-ar', '22050', '-b:a', '40k', str(dest)], check=True)


n = 0
for w in words:
    dest = OUT / f"{w['id']}.mp3"
    if dest.exists() and not todo:
        continue
    render(w['k'], dest, ['-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse'])
    n += 1
silence = OUT / '_silencio.mp3'
if not silence.exists():
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=22050:cl=mono', '-t', '0.1', '-b:a', '32k', str(silence)], check=True)
print(f'Grabadas {n} palabras nuevas. Total: {len(list(OUT.glob("*.mp3")))} archivos.')
