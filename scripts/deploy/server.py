"""Receptor SSH restringido para publicar archivos sin reiniciar Nginx."""
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import tarfile
from urllib.parse import quote

BASE = Path('/srv/tiendamgr-cd')
REPO = Path('/srv/proyectos/TiendaMGR')
CONTAINER = 'tienda-frontend'
WEBROOT = '/usr/share/nginx/html'
DOMAIN = 'https://tiendamgr.duckdns.org'
IMAGE = 'tiendamgr-tienda-frontend:latest'


def run(*args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def output(*args):
    return subprocess.check_output(args, text=True).strip()


def unpack(archive, destination):
    with tarfile.open(archive, 'r:gz') as package:
        members = package.getmembers()
        if sum(item.size for item in members) > 100 * 1024 * 1024:
            raise ValueError('Paquete demasiado grande')
        for item in members:
            path = PurePosixPath(item.name)
            if path.is_absolute() or '..' in path.parts or not path.parts or path.parts[0] != 'html':
                raise ValueError('Ruta invalida')
            if not (item.isdir() or item.isfile()):
                raise ValueError('Tipo de archivo invalido')
        for item in members:
            target = destination / item.name
            if item.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with package.extractfile(item) as source, target.open('wb') as sink:
                    shutil.copyfileobj(source, sink)
                target.chmod(0o644)


def verify(path, url):
    received = subprocess.check_output(['curl', '--fail', '--silent', '--show-error',
                                        '--connect-timeout', '10', '--max-time', '30', url])
    if hashlib.sha256(received).digest() != hashlib.sha256(path.read_bytes()).digest():
        raise RuntimeError('El contenido publicado no coincide: ' + url)


def publish_index(path):
    run('docker', 'cp', str(path), f'{CONTAINER}:{WEBROOT}/index.html.cd-nuevo')
    run('docker', 'exec', CONTAINER, 'mv', f'{WEBROOT}/index.html.cd-nuevo', f'{WEBROOT}/index.html')


def rollback(revision):
    state_file = BASE / revision / 'state.json'
    if not state_file.exists():
        raise RuntimeError('No existe respaldo para esta revision')
    state = json.loads(state_file.read_text())
    if (BASE / 'current').read_text().strip() != revision:
        raise RuntimeError('Otra revision esta activa; no se revierte')
    publish_index(BASE / revision / 'previous.html')
    run('docker', 'tag', state['previous_image'], IMAGE)
    verify(BASE / revision / 'previous.html', DOMAIN + '/?rollback=' + revision)
    (BASE / 'current').write_text(state['previous_revision'])
    print('Rollback completado: ' + revision, flush=True)


def deploy(revision):
    if output('git', '-C', str(REPO), 'status', '--porcelain', '--untracked-files=no'):
        raise RuntimeError('Hay cambios locales en el servidor')
    run('git', '-C', str(REPO), 'fetch', 'origin', 'main')
    if output('git', '-C', str(REPO), 'rev-parse', 'origin/main') != revision:
        raise RuntimeError('Solo se despliega el ultimo commit de main')
    if (BASE / 'current').exists() and (BASE / 'current').read_text().strip() == revision:
        with open(os.devnull, 'wb') as sink:
            shutil.copyfileobj(sys.stdin.buffer, sink)
        verify(BASE / revision / 'incoming/html/index.html', DOMAIN + '/?verify=' + revision)
        print('La revision ya esta publicada', flush=True)
        return
    target = BASE / revision
    if target.exists():
        shutil.rmtree(target)
    target.mkdir()
    archive = target / 'site.tar.gz'
    with archive.open('wb') as sink:
        remaining = 30 * 1024 * 1024
        while chunk := sys.stdin.buffer.read(min(1024 * 1024, remaining + 1)):
            remaining -= len(chunk)
            if remaining < 0:
                raise ValueError('Archivo comprimido demasiado grande')
            sink.write(chunk)
    unpack(archive, target / 'incoming')
    incoming = target / 'incoming/html'
    release = incoming / 'releases' / revision
    if not release.is_dir() or not (incoming / 'index.html').is_file():
        raise ValueError('Paquete incompleto')
    if f'content="{revision}"' not in (incoming / 'index.html').read_text():
        raise ValueError('La pagina no identifica la revision')
    previous_revision = (BASE / 'current').read_text() if (BASE / 'current').exists() else ''
    run('docker', 'cp', f'{CONTAINER}:{WEBROOT}/index.html', str(target / 'previous.html'))
    context = target / 'image'
    context.mkdir()
    run('docker', 'cp', f'{CONTAINER}:{WEBROOT}', str(context / 'html'))
    base_image = output('docker', 'inspect', CONTAINER, '--format', '{{.Image}}')
    runtime_tag = 'tiendamgr-runtime-base:' + base_image.removeprefix('sha256:')
    run('docker', 'tag', base_image, runtime_tag)
    (context / 'Dockerfile').write_text(f'FROM {runtime_tag}\nCOPY html/ {WEBROOT}/\n')
    backup_image = 'tiendamgr-backup:' + revision
    run('docker', 'build', '-t', backup_image, str(context))
    state = {'previous_image': output('docker', 'image', 'inspect', backup_image, '--format', '{{.Id}}'),
             'previous_revision': previous_revision}
    (target / 'state.json').write_text(json.dumps(state))
    shutil.copytree(incoming, context / 'html', dirs_exist_ok=True)
    candidate = 'tiendamgr-release:' + revision
    run('docker', 'build', '-t', candidate, str(context))
    run('docker', 'exec', CONTAINER, 'mkdir', '-p', f'{WEBROOT}/releases')
    run('docker', 'cp', str(release), f'{CONTAINER}:{WEBROOT}/releases/')
    for path in release.rglob('*'):
        if path.is_file():
            verify(path, DOMAIN + '/releases/' + revision + '/' + quote(path.relative_to(release).as_posix()))
    run('git', '-C', str(REPO), 'switch', 'main')
    run('git', '-C', str(REPO), 'merge', '--ff-only', revision)
    run('python3', str(REPO / 'scripts/build.py'))
    try:
        (BASE / 'current').write_text(revision)
        publish_index(incoming / 'index.html')
        verify(incoming / 'index.html', DOMAIN + '/?deploy=' + revision)
        run('docker', 'tag', candidate, IMAGE)
    except BaseException:
        rollback(revision)
        raise
    (target / 'success').touch()
    print('Despliegue completado: ' + revision, flush=True)


def main():
    command = os.environ.get('SSH_ORIGINAL_COMMAND', '')
    match = re.fullmatch(r'(deploy|rollback) ([0-9a-f]{40})', command)
    if not match:
        raise SystemExit('Solo se permiten deploy o rollback con una revision valida')
    BASE.mkdir(parents=True, exist_ok=True)
    with (BASE / 'lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if match[1] == 'deploy':
            deploy(match[2])
        else:
            rollback(match[2])


if __name__ == '__main__':
    main()
