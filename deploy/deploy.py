import json
import os
from pathlib import Path
import re
import shlex
import subprocess

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / '.state'
STATE.mkdir(exist_ok=True, mode=0o700)
image = (STATE / 'image.txt').read_text().strip()
if not re.fullmatch(r'ghcr\.io/nicolas-mgt/tvn-games@sha256:[0-9a-f]{64}', image):
    raise SystemExit('Run make push first to record the image digest')
values = {}
ssh_file = Path(os.environ.get('SSH_ENV', ROOT / '.env.ssh'))
for raw in ssh_file.read_text().splitlines():
    line = raw.strip()
    if line and not line.startswith('#'):
        key, value = line.removeprefix('export ').split('=', 1)
        values[key.strip()] = shlex.split(value)[0]
connection = shlex.split(values['CONN'])
if connection[0] == 'ssh':
    connection = connection[1:]
args = ['ssh', '-o', 'ConnectTimeout=12', '-o', 'ServerAliveInterval=15',
        '-o', 'StrictHostKeyChecking=accept-new', '-o',
        f'UserKnownHostsFile={STATE / "known_hosts"}', *connection]
env = os.environ.copy()
if values.get('PASS'):
    args = ['sshpass', '-e', *args]
    env['SSHPASS'] = values['PASS']
remote = """
import json
import subprocess
import sys

def kubectl(*args, data=None, sensitive=False):
    result = subprocess.run(['kubectl', *args], input=json.dumps(data) if data is not None else None,
                            text=True, capture_output=True)
    if result.returncode:
        raise SystemExit('Registry credential operation failed' if sensitive else result.stderr)
    return result.stdout

manifest = json.load(sys.stdin)
print(kubectl('apply', '-f', '-', data={'apiVersion':'v1', 'kind':'Namespace', 'metadata':{'name':'tvn-games'}}).strip())
if not kubectl('-n', 'tvn-games', 'get', 'secret', 'ghcr-pull', '--ignore-not-found', '-o', 'name').strip():
    original = json.loads(kubectl('-n', 'ai-gateway', 'get', 'secret', 'ghcr-pull', '-o', 'json', sensitive=True))
    pull = {'apiVersion':'v1', 'kind':'Secret', 'metadata':{'name':'ghcr-pull','namespace':'tvn-games'},
            'type':original['type'], 'data':original['data']}
    kubectl('create', '-f', '-', data=pull, sensitive=True)
print(kubectl('apply', '--dry-run=server', '-f', '-', data=manifest).strip())
print(kubectl('apply', '-f', '-', data=manifest).strip())
print(kubectl('-n', 'tvn-games', 'rollout', 'status', 'deployment/tvn-games', '--timeout=240s').strip())
print(kubectl('-n', 'tvn-games', 'wait', '--for=condition=Ready', 'certificate/tvn-games-tls', '--timeout=180s').strip())
"""
manifest = json.loads((ROOT / 'deploy/k8s.json').read_text().replace('$IMAGE', image))
subprocess.run([*args, 'python3 -c ' + shlex.quote(remote)], input=json.dumps(manifest),
               text=True, env=env, check=True)
print('Deployed: https://home.mmgt.dev/tvn-games/')
