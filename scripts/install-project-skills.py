"""Reproduce the project-local third-party skill installation at pinned revisions."""
import json
from pathlib import Path
import subprocess
import sys
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
INSTALLER = Path.home() / '.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py'
SOURCES = [
    ('heygen-com/hyperframes', '28f7ee456b8a1733aa0f7b60492a0c807f1aab3e', ['skills/' + s for s in ['hyperframes', 'hyperframes-cli', 'hyperframes-registry', 'media-use']]),
    ('haydenschmitty/floorplan', '59a12f4374f29cee26b002f31dbf60cb6955a917', ['skills/floorplan']),
    ('latent-spaces/brag', '669ab9286aa28b6c3ee30e75f181ee74319d012a', ['skills/brag']),
    ('greensock/gsap-skills', 'aed9cfd3277740755f6bfc1155c7aa645403b760', ['skills/' + s for s in ['gsap-core', 'gsap-react', 'gsap-timeline', 'gsap-performance']]),
    ('nutlope/hallmark', '7ec868225c6caa040558c321ee0fefa0e73f83a8', ['skills/hallmark']),
    ('emotixco/claude-skills-founder', 'a194aaa1919fffbb56b2dea27eaaeff0b3add2f3', ['skills/' + s for s in ['user-interviews', 'competitor-matrix', 'go-to-market', 'metrics-dashboard']]),
    ('anthropics/claude-plugins-official', 'd1adba47161a271799de7b548225d929310046bd', ['plugins/claude-code-setup/skills/claude-automation-recommender']),
    ('Panniantong/Agent-Reach', '94f06c1969dfc1834001269d79d3ad0972d9dee6', ['agent_reach/skill']),
    ('morluto/rea', '647717c050ff4dbaef83fb1c5555ef5c33979cd4', ['.agents/skills/reverse-engineer-anything']),
    ('addyosmani/agent-skills', 'aeac41d4d005999432bb7312f7ff06383a91d59d', ['skills/' + s for s in ['api-and-interface-design', 'browser-testing-with-devtools', 'ci-cd-and-automation', 'code-review-and-quality', 'code-simplification', 'constraint-driven-development', 'context-engineering', 'debugging-and-error-recovery', 'deprecation-and-migration', 'documentation-and-adrs', 'doubt-driven-development', 'frontend-ui-engineering', 'git-workflow-and-versioning', 'idea-refine', 'incremental-implementation', 'interview-me', 'observability-and-instrumentation', 'performance-optimization', 'planning-and-task-breakdown', 'security-and-hardening', 'shipping-and-launch', 'source-driven-development', 'spec-driven-development', 'test-driven-development', 'using-agent-skills']]),
    ('usestrix/strix', 'fde37a149fc942dd107666441a1989f187d30c3b', ['skills/' + s for s in ['api-security-testing', 'application-security-testing', 'ci-security-scanning-with-strix', 'find-security-vulnerabilities-in-code', 'fix-security-vulnerabilities-with-strix', 'managed-pentesting-with-strix', 'owasp-top-10-testing', 'penetration-testing-with-strix', 'web-app-penetration-testing']]),
    ('kaankiziltug/logo-design-skill', '0ecf52e9a4b3ac92b714f7cc6e3148ab8c774134', ['skills/logo-design']),
    ('Jakeschincariol/replica-skill', '77c9436fb3d18c3d58169efb8caf4fe906b0dc51', ['replica-' + s for s in ['architect', 'backend', 'brand', 'build', 'deploy', 'design', 'diff', 'entrepreneur', 'launch', 'recon', 'test']]),
    ('emilkowalski/skills', '2d228630ba1446365f614a108cb8252f1feda202', ['skills/' + s for s in ['animate-expo', 'animate', 'animation-performance', 'animation-vocabulary', 'apple-design', 'ask-sonner', 'break-ui', 'emil-design-eng', 'find-animation-opportunities', 'improve-animations', 'mobile-native', 'pick-ui-library', 'prototype', 'review-animations', 'write-swift']]),
    ('pbakaus/impeccable', '0665bd812ae0908fcab17b96fd4f840defb882d9', ['.agents/skills/impeccable']),
    ('Leonxlnx/taste-skill', 'b9ca2fd8047f4c72d7da90ebc1c1203e57c72cd2', ['skills/' + s for s in ['brutalist-skill', 'gpt-tasteskill', 'minimalist-skill', 'redesign-skill', 'soft-skill', 'stitch-skill', 'taste-skill-v1', 'taste-skill-v2-experimental', 'taste-skill']]),
    ('Leonxlnx/imagegen-skills', 'beb16b0d0f4dae9a6f5cb04ea41e97b93a54ab8e', ['skills/' + s for s in ['brandkit', 'image-to-code', 'imagegen-frontend-mobile', 'imagegen-frontend-web']]),
    ('tojileon/ian-xiaohei-illustrations-en', '18280fc475fbda00efc0da6608860d69028deb6a', ['ian-xiaohei-illustrations']),
    ('lackeyjb/playwright-skill', 'dd47a6a023e249eb1b36e9e943eab89d0900865d', ['skills/playwright-skill']),
    ('mattpocock/skills', '5beb35b040e3de97e54fa9e386d7e42d15c295c2', ['skills/productivity/grill-me', 'skills/productivity/grilling']),
]

def main():
    destination = ROOT / '.agents/skills'
    excluded = set(json.loads((ROOT / 'scripts/skill-exclusions.json').read_text(encoding='utf-8')))
    records = []
    for repo, revision, paths in SOURCES:
        def name(path):
            return 'agent-reach' if repo == 'Panniantong/Agent-Reach' else path.split('/')[-1]
        paths = [path for path in paths if name(path) not in excluded]
        missing = [p for p in paths if not (destination / name(p)).exists()]
        if missing:
            args = [sys.executable, str(INSTALLER), '--repo', repo, '--ref', revision, '--path', *missing, '--dest', str(destination)]
            if repo == 'Panniantong/Agent-Reach':
                args += ['--name', 'agent-reach']
            try:
                subprocess.run(args, check=True, timeout=240)
            except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
                subprocess.run([*args, '--method', 'git'], check=True, timeout=240)
        for path in paths:
            target = destination / name(path)
            if not (target / 'SKILL.md').is_file():
                raise RuntimeError(f'Missing manifest: {target}')
            records.append(dict(repository=repo, revision=revision, source_path=path, installed_path=target.relative_to(ROOT).as_posix()))
    if (destination / 'graphify/SKILL.md').is_file():
        records.append(dict(repository='Graphify-Labs/graphify', revision='b90b9df7949bd04a15b40a1624af85d0a9cfdf04', package='graphifyy==0.9.93', source_path='graphify/skill-agents.md', installed_path='.agents/skills/graphify', installed_by='graphify install --project --platform agents'))
    founder_revision = 'a194aaa1919fffbb56b2dea27eaaeff0b3add2f3'
    for relative in ['shared/conventions.md', 'LICENSE']:
        target = ROOT / '.agents/founder' / relative
        if not target.is_file():
            url = f'https://raw.githubusercontent.com/emotixco/claude-skills-founder/{founder_revision}/{relative}'
            request = urllib.request.Request(url, headers={'User-Agent': 'nadorly-skill-install'})
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = response.read()
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(payload)
    for record in records:
        if record['repository'] == 'emotixco/claude-skills-founder':
            record['supporting_root'] = '.agents/founder'
    (ROOT / 'skills-lock.json').write_text(json.dumps(records, indent=2) + '\n', encoding='utf-8')
    print(f'Verified {len(records)} project-local skill directories.')

if __name__ == '__main__':
    main()
