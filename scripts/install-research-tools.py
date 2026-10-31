"""Install requested Python CLIs in separate, project-local virtual environments."""
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
TOOLS = {
    'agent-reach': 'https://github.com/Panniantong/Agent-Reach/archive/94f06c1969dfc1834001269d79d3ad0972d9dee6.zip',
    'graphify': 'graphifyy==0.9.93',
    'strix': 'strix-agent==1.7.0',
}

def install(item):
    name, package = item
    home = ROOT / '.tools' / name
    home.mkdir(parents=True, exist_ok=True)
    log_path = home / 'install.log'
    result = dict(tool=name, package=package, environment=home.relative_to(ROOT).as_posix())
    try:
        with log_path.open('w', encoding='utf-8') as log:
            subprocess.run([sys.executable, '-m', 'venv', str(home / 'venv')], stdout=log, stderr=subprocess.STDOUT, check=True, timeout=90)
            python = home / 'venv/Scripts/python.exe'
            subprocess.run([str(python), '-m', 'pip', 'install', '--disable-pip-version-check', '--no-compile', package], stdout=log, stderr=subprocess.STDOUT, check=True, timeout=420)
            subprocess.run([str(python), '-m', 'pip', 'check'], stdout=log, stderr=subprocess.STDOUT, check=True, timeout=30)
            result['installed'] = True
    except Exception as exc:
        result.update(installed=False, error=str(exc))
    print(json.dumps(result), flush=True)
    return result

if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(install, TOOLS.items()))
    status_path = ROOT / 'research-tools-status.json'
    if status_path.exists():
        results += [entry for entry in json.loads(status_path.read_text(encoding='utf-8')) if entry['tool'] not in TOOLS]
    status_path.write_text(json.dumps(results, indent=2)+'\n',encoding='utf-8')
