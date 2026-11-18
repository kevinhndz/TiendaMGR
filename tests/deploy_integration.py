"""Prueba CD y rollback en un contenedor aislado, sin usar produccion."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.deploy.package import package
from scripts.deploy import server as receiver


def run(*args):
    subprocess.run(args, check=True)


def test(image):
    with tempfile.TemporaryDirectory() as folder:
        root = Path(folder)
        repo = root / 'repo'
        repo.mkdir()
        run('git', 'init', '-b', 'main', str(repo))
        (repo / 'scripts').mkdir()
        (repo / 'scripts/build.py').write_text('pass\n')
        run('git', '-C', str(repo), 'add', '.')
        run('git', '-C', str(repo), '-c', 'user.name=CI', '-c', 'user.email=ci@example.test', 'commit', '-m', 'Fixture')
        run('git', '-C', str(repo), 'remote', 'add', 'origin', str(repo))
        revision = receiver.output('git', '-C', str(repo), 'rev-parse', 'HEAD')
        package(ROOT / 'public', root / 'package', revision)
        name = 'tiendamgr-cd-prueba-' + revision[:12]
        run('docker', 'run', '-d', '--name', name, '-p', '127.0.0.1::80', image)
        try:
            ports = json.loads(receiver.output('docker', 'inspect', name, '--format', '{{json .NetworkSettings.Ports}}'))
            domain = 'http://127.0.0.1:' + ports['80/tcp'][0]['HostPort']
            receiver.BASE = root / 'state'
            receiver.BASE.mkdir()
            receiver.REPO = repo
            receiver.CONTAINER = name
            receiver.DOMAIN = domain
            receiver.IMAGE = 'tiendamgr-cd-prueba:' + revision
            for attempt in range(20):
                response = subprocess.run(['curl', '-fsS', domain], capture_output=True)
                if response.returncode == 0:
                    break
                time.sleep(0.25)
            else:
                raise RuntimeError('El contenedor de prueba no responde')
            original = response.stdout
            started = receiver.output('docker', 'inspect', name, '--format', '{{.State.StartedAt}}')
            def deploy():
                with (root / 'package/site.tar.gz').open() as source:
                    sys.stdin = source
                    receiver.deploy(revision)
            deploy()
            persisted = subprocess.check_output(['docker', 'run', '--rm', '--entrypoint', 'cat', receiver.IMAGE, receiver.WEBROOT + '/index.html'])
            assert persisted == (root / 'package/html/index.html').read_bytes()
            deploy()
            receiver.rollback(revision)
            assert subprocess.check_output(['curl', '-fsS', domain]) == original
            verify = receiver.verify
            def simulate_failure(path, url):
                verify(path, url)
                if '?deploy=' in url:
                    raise RuntimeError('Fallo de salud simulado')
            receiver.verify = simulate_failure
            try:
                deploy()
            except RuntimeError as error:
                assert str(error) == 'Fallo de salud simulado', error
            else:
                raise AssertionError('Se esperaba un fallo de salud')
            assert subprocess.check_output(['curl', '-fsS', domain]) == original
            assert receiver.output('docker', 'inspect', name, '--format', '{{.State.StartedAt}}') == started
            print('INTEGRACION OK: despliegue, rollback y recuperacion automatica', flush=True)
        finally:
            run('docker', 'rm', '-f', name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', default='tienda-ci')
    test(parser.parse_args().image)
