import base64
import json
import os
from pathlib import Path
import re
import shlex
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SERVER = Path(os.environ.get('MMGT_SERVER_DIR', '/Users/home/Documents/Server'))
image = (ROOT / '.state/image.txt').read_text().strip()
if not re.fullmatch(r'ghcr\.io/nicolas-mgt/tvn-games@sha256:[0-9a-f]{64}', image):
    raise SystemExit('Run make push first to record the image digest')
host = json.loads((SERVER / '.local/connection.json').read_text())['host']
args = ['ssh', '-i', str(SERVER / '.local/admin-key'), '-o', 'BatchMode=yes',
        '-o', 'StrictHostKeyChecking=yes', '-o', f'UserKnownHostsFile={SERVER / ".local/known_hosts"}',
        '-o', 'ConnectTimeout=12', '-o', 'ServerAliveInterval=15', host]
pull_auth = base64.b64encode(('nicolas-mgt:' + (SERVER / '.local/ghcr-read-token').read_text().strip()).encode()).decode()
pull_secret = {'apiVersion': 'v1', 'kind': 'Secret', 'type': 'kubernetes.io/dockerconfigjson',
               'metadata': {'name': 'ghcr', 'namespace': 'tvn-games'},
               'stringData': {'.dockerconfigjson': json.dumps({'auths': {'ghcr.io': {'auth': pull_auth}}})}}
remote = """
import json
import subprocess
import sys

def kubectl(*args, data=None, sensitive=False):
    result = subprocess.run(['sudo', 'k3s', 'kubectl', *args], input=json.dumps(data) if data is not None else None,
                            text=True, capture_output=True)
    if result.returncode:
        raise SystemExit('Registry credential operation failed' if sensitive else result.stderr)
    return result.stdout

payload = json.load(sys.stdin)
print(kubectl('apply', '-f', '-', data={'apiVersion':'v1', 'kind':'Namespace', 'metadata':{'name':'tvn-games'}}).strip())
kubectl('apply', '-f', '-', data=payload['pull_secret'], sensitive=True)
print(kubectl('apply', '--dry-run=server', '-f', '-', data=payload['manifest']).strip())
print(kubectl('apply', '-f', '-', data=payload['manifest']).strip())
print(kubectl('-n', 'tvn-games', 'rollout', 'status', 'deployment/tvn-games', '--timeout=240s').strip())
"""
manifest = json.loads((ROOT / 'deploy/k8s.json').read_text().replace('$IMAGE', image))
subprocess.run([*args, 'python3 -c ' + shlex.quote(remote)],
               input=json.dumps({'manifest': manifest, 'pull_secret': pull_secret}), text=True, check=True)
print('Deployed: https://home.mmgt.dev/tvn-games/')
