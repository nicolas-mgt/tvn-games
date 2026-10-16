#!/usr/bin/python3
import os
import re
import subprocess

command = os.environ.get('SSH_ORIGINAL_COMMAND', '')
match = re.fullmatch(r'deploy (ghcr\.io/nicolas-mgt/tvn-games@sha256:[0-9a-f]{64})', command)
if not match:
    raise SystemExit('Only deployment of a TVN Games image digest is allowed')

subprocess.run([
    '/usr/local/bin/kubectl', '-n', 'tvn-games', 'set', 'image',
    'deployment/tvn-games', f'web={match[1]}',
], check=True)
subprocess.run([
    '/usr/local/bin/kubectl', '-n', 'tvn-games', 'rollout', 'status',
    'deployment/tvn-games', '--timeout=240s',
], check=True)
