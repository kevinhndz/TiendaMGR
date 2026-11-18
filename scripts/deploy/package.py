"""Prepara recursos versionados y una pagina principal para el CD."""
import argparse
from pathlib import Path
import re
import shutil
import tarfile


def package(source, destination, revision):
    if not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('Revision invalida')
    destination.mkdir(parents=True, exist_ok=True)
    tree = destination / 'html'
    release = tree / 'releases' / revision
    shutil.copytree(source, release)
    html = (release / 'index.html').read_text()
    html = re.sub(r'((?:src|href|data-imagen)=["\x27])((?:css|js|img)/)',
                  lambda match: match[1] + '/releases/' + revision + '/' + match[2], html)
    html = html.replace('</head>', f'<meta name="tiendamgr-release" content="{revision}">\n</head>')
    (release / 'index.html').write_text(html)
    (tree / 'index.html').write_text(html)
    shutil.copyfile(source / 'google568e52d863922e97.html', tree / 'google568e52d863922e97.html')
    with tarfile.open(destination / 'site.tar.gz', 'w:gz') as archive:
        archive.add(tree, arcname='html')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('revision')
    parser.add_argument('--source', type=Path, default=Path('public'))
    parser.add_argument('--output', type=Path, default=Path('deployment'))
    args = parser.parse_args()
    package(args.source, args.output, args.revision)
