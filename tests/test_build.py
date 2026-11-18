"""Comprueba que la modularizacion conserve el contenido publicado."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unittest
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self, normalize_entry=False):
        super().__init__(convert_charrefs=True)
        self.events = []
        self.normalize_entry = normalize_entry

    def handle_starttag(self, tag, attrs):
        self.events.append(('start', tag, [(key, 'js/script.js' if self.normalize_entry and tag == 'script' and value == 'js/app.js' else value) for key, value in attrs
                                                 if not (self.normalize_entry and tag == 'script' and key == 'type')]))

    def handle_endtag(self, tag):
        self.events.append(('end', tag))

    def handle_data(self, data):
        value = ' '.join(data.split())
        if value:
            self.events.append(('text', value))


def fingerprint(name, text):
    if name.endswith('.html'):
        document = Document(normalize_entry=True)
        document.feed(text)
        value = json.dumps(document.events, ensure_ascii=False)
    else:
        value = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
        value = re.sub(r'^\s*//[^\n]*', '', value, flags=re.M)
        value = re.sub(r'\s+', '', value)
    return hashlib.sha256(value.encode()).hexdigest()


class BuildTests(unittest.TestCase):
    def test_generated_files_are_current(self):
        subprocess.run(['python3', 'scripts/build.py', '--check'], cwd=ROOT, check=True)

    def test_content_matches_original_site(self):
        expected = json.loads((ROOT / 'tests/original.json').read_text())
        for name, digest in expected.items():
            with self.subTest(file=name):
                self.assertEqual(fingerprint(name, (ROOT / 'public' / name).read_text()), digest)

    def test_modules_have_valid_syntax(self):
        for path in (ROOT / 'src/js').glob('*.js'):
            with self.subTest(file=path.name):
                subprocess.run(['node', '--input-type=module', '--check'],
                               input=path.read_text(), text=True, check=True)

    def test_local_assets_exist(self):
        document = Document()
        document.feed((ROOT / 'public/index.html').read_text())
        for event in document.events:
            if event[0] != 'start':
                continue
            for key, value in event[2]:
                if key in ('src', 'href') and value and not value.startswith(('https:', 'mailto:', '#')):
                    self.assertTrue((ROOT / 'public' / value).is_file(), value)
        css = (ROOT / 'public/css/estilos.css').read_text()
        for value in re.findall(r'url\([\"\x27]?(.*?)[\"\x27]?\)', css):
            self.assertTrue((ROOT / 'public/css' / value).is_file(), value)


if __name__ == '__main__':
    unittest.main()
