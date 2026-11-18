"""Verifica paquetes versionados y rechazo de rutas peligrosas."""
import io
from pathlib import Path
import sys
import tarfile
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.deploy.package import package
from scripts.deploy.server import unpack


class DeployTests(unittest.TestCase):
    def test_versioned_assets_are_preserved(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / 'public'
            (source / 'js').mkdir(parents=True)
            (source / 'index.html').write_text('<head></head><script type="module" src="js/app.js"></script><button data-imagen="img/logo.PNG"></button>')
            (source / 'js/app.js').write_text("import './inicio.js';")
            (source / 'google568e52d863922e97.html').write_text('verification')
            revision = 'a' * 40
            package(source, root / 'output', revision)
            unpack(root / 'output/site.tar.gz', root / 'extracted')
            html = (root / 'extracted/html/index.html').read_text()
            self.assertIn(f'src="/releases/{revision}/js/app.js"', html)
            self.assertIn(f'data-imagen="/releases/{revision}/img/logo.PNG"', html)
            self.assertEqual((root / f'extracted/html/releases/{revision}/js/app.js').read_text(), "import './inicio.js';")

    def test_archive_cannot_escape_destination_or_create_links(self):
        for name, kind in [('html/../../escape', tarfile.REGTYPE), ('html/link', tarfile.SYMTYPE)]:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                archive = root / 'invalid.tar.gz'
                with tarfile.open(archive, 'w:gz') as stream:
                    item = tarfile.TarInfo(name)
                    item.type = kind
                    item.linkname = '/etc/passwd' if kind == tarfile.SYMTYPE else ''
                    stream.addfile(item, io.BytesIO())
                with self.assertRaises(ValueError):
                    unpack(archive, root / 'destination')
