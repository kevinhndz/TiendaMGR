"""Genera los archivos estaticos sin dependencias externas."""
import argparse
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def expand_html(path):
    text = path.read_text()
    return re.sub(r'\{\{ incluir:([\w/-]+\.html) \}\}',
                  lambda match: expand_html(ROOT / 'src/html' / match[1]), text)


def build(check=False):
    outputs = {'index.html': expand_html(ROOT / 'index.html')}
    css = ROOT / 'src/css'
    outputs['css/estilos.css'] = ''.join(
        (css / name).read_text() for name in (css / 'orden.txt').read_text().splitlines() if name)
    for source in (ROOT / 'src/js').glob('*.js'):
        outputs['js/' + source.name] = source.read_text()
    outputs['js/app.js'] = "import './inicio.js';\n"
    for name, content in outputs.items():
        path = ROOT / 'public' / name
        if check:
            if not path.exists() or path.read_text() != content:
                raise SystemExit(f'Archivo desactualizado: {name}. Ejecuta python3 scripts/build.py')
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content)

    if not check:
        shutil.copytree(ROOT / 'img', ROOT / 'public/img', dirs_exist_ok=True)
        for name in ['google568e52d863922e97.html', 'google568e52d863922e97 (1).html']:
            shutil.copyfile(ROOT / 'google568e52d863922e97 (1).html', ROOT / 'public' / name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--image', help='Construye una imagen desde public con el Dockerfile original')
    args = parser.parse_args()
    if args.check and args.image:
        parser.error('--check no construye imagenes')
    build(args.check)
    if args.image:
        subprocess.run(['docker', 'build', '-f', str(ROOT / 'Dockerfile'),
                        '-t', args.image, str(ROOT / 'public')], check=True)
