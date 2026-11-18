"""Genera los archivos estaticos sin dependencias externas."""
import argparse
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def expand_html(path):
    text = path.read_text()
    return re.sub(r'\{\{ incluir:([\w/-]+\.html) \}\}',
                  lambda match: expand_html(ROOT / 'src/html' / match[1]), text)


def build(check=False):
    outputs = {'index.html': expand_html(ROOT / 'src/html/index.html')}
    for language, target in [('js', 'js/script.js'), ('css', 'css/estilos.css')]:
        manifest = ROOT / 'src' / language / 'orden.txt'
        if manifest.exists():
            outputs[target] = ''.join((manifest.parent / name).read_text()
                                      for name in manifest.read_text().splitlines() if name)
    for name, content in outputs.items():
        path = ROOT / name
        if check:
            if not path.exists() or path.read_text() != content:
                raise SystemExit(f'Archivo desactualizado: {name}. Ejecuta python3 scripts/build.py')
        else:
            path.write_text(content)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    build(parser.parse_args().check)
