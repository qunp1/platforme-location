"""Generate a recommendation inventory; never moves or removes installed skills."""
from collections import Counter
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
CORE=set('impeccable emil-design-eng mobile-native break-ui playwright-skill logo-design grill-me grilling api-and-interface-design code-review-and-quality code-simplification debugging-and-error-recovery documentation-and-adrs incremental-implementation security-and-hardening test-driven-development performance-optimization spec-driven-development ci-cd-and-automation replica-architect replica-backend replica-build replica-design replica-test'.split())
REMOVE={
 'taste-skill-v1':'Legacy version; retain current Taste only if needed.',
 'taste-skill-v2-experimental':'Historical experimental variant; redundant.',
 'gpt-tasteskill':'Alternative Taste rules; competes with the chosen design workflow.',
 'brutalist-skill':'Alternative aesthetic that is not Nadorly\'s brief.',
 'minimalist-skill':'Alternative aesthetic; main design workflow already covers restraint.',
 'soft-skill':'Alternative aesthetic; overlaps with general design skills.',
 'redesign-skill':'Retired upstream redirect to the main Taste skill.',
 'stitch-skill':'Google Stitch-specific workflow; no Stitch integration in this project.',
 'write-swift':'No Swift/iOS application in the current scope.',
 'animate-expo':'No React Native/Expo application in the current scope.',
 'imagegen-frontend-mobile':'Native mobile image concepts are outside the current build.',
 'ian-xiaohei-illustrations':'Specialized article-illustration style, unrelated to rental functionality.',
 'claude-automation-recommender':'Targets Claude Code setup; this project is being worked on in Codex.',
 'interview-me':'Overlaps with the already adopted Grill-me workflow.',
 'idea-refine':'Overlaps with existing product discovery/specification workflows.',
 'using-agent-skills':'An additional meta-router; existing project instructions already select skills.',
 'browser-testing-with-devtools':'Alternative browser workflow; project already uses Playwright.',
 'application-security-testing':'Overlaps with the central Strix penetration-testing entry.',
 'api-security-testing':'Can be reintroduced for a dedicated API scan; redundant for daily coding.',
 'web-app-penetration-testing':'Overlapping Strix entry; retain one main scan workflow.',
 'ci-security-scanning-with-strix':'No Strix runtime/provider configured for CI.',
 'managed-pentesting-with-strix':'Cloud workflow needs a separate account and authorized source upload.',
}

def reason(folder):
    if folder == 'floorplan':
        return 'Optional interactive architecture map for understanding and onboarding; overlaps with Graphify analysis but emphasizes a plain-language visual explorer.'
    if folder == 'brag':
        return 'Optional product launch videos; complementary to website motion skills. Rendering requires Hyperframes CLI/skills and FFmpeg.'
    if folder.startswith('gsap-'):
        return 'Optional official GSAP implementation guidance; complements existing motion design skills. Use CSS for simple transitions; install runtime packages only when implementation needs GSAP.'
    if folder == 'hallmark':
        return 'Optional theme-led design and browser linting; strongly overlaps with Taste and partly Impeccable. Choose one lead design workflow.'
    if folder in ('user-interviews','competitor-matrix','go-to-market','metrics-dashboard'):
        return 'Founder toolkit: agency/customer discovery, positioning, acquisition or marketplace metrics; use for the relevant business task.'
    if folder in CORE:
        if folder.startswith('replica-'):
            return 'Retain: the active project already uses the replica/ build and architecture records.'
        return 'Directly supports current design, accounts/API, implementation or verification work.'
    if folder in REMOVE:
        return REMOVE[folder]
    if folder in ('agent-reach','reverse-engineer-anything','graphify'):
        return 'Specialist tool; invoke for a concrete research/analysis need, not every coding task.'
    if folder in ('penetration-testing-with-strix','fix-security-vulnerabilities-with-strix','find-security-vulnerabilities-in-code','owasp-top-10-testing'):
        return 'Useful for a scoped security review; active Strix scans need runtime/provider setup.'
    if folder in ('brandkit','image-to-code','imagegen-frontend-web'):
        return 'Optional image-first brand/design exploration; may add substantial image-generation work.'
    if folder=='taste-skill':
        return 'Optional alternate art direction; choose this or Impeccable as lead, not both at once.'
    if folder.startswith('replica-'):
        return 'Useful only when that research, branding or launch stage is requested.'
    if 'animat' in folder or folder=='apple-design':
        return 'Specialized motion/style advice; use when the UI needs it.'
    return 'Useful for a matching task; not needed as a default on every change.'

rows=[]
for directory in sorted((ROOT/'.agents/skills').iterdir()):
    manifest=directory/'SKILL.md'
    if not manifest.is_file():
        continue
    text=manifest.read_text(encoding='utf-8-sig')
    match=re.search(r'^name:\s*(.+)$',text,re.M)
    if not match:
        raise RuntimeError(f'Missing skill name: {manifest}')
    category='Keep' if directory.name in CORE else ('Archive/remove' if directory.name in REMOVE else 'Optional')
    rows.append((match.group(1).strip().strip('"'),directory.name,category,reason(directory.name)))
counts=Counter(row[2] for row in rows)
out=['# Nadorly skill audit — 2026-10-29','',
     f'User-authorized cleanup: the 22 previous archive/remove candidates were removed on 2026-10-21. Current inventory: {counts["Keep"]} recommended skills and {counts["Optional"]} optional skills. Four Founder business skills were added on 2026-10-22. This audits project-local skills, not bundled system skills or connected app plugins.', '',
     'Current project: React/Vite frontend, Node API, Supabase account/request integration and Playwright checks. Agency decisions and live payments remain unfinished according to README.md. The replica/ documents are the active architecture/design records.', '',
     f'Inventory: {len(rows)} skills; {counts["Keep"]} recommended keep, {counts["Optional"]} optional, {counts["Archive/remove"]} archive/remove candidates.', '',
     'Keep means retain in the project, not load on every task. None of these third-party instructions is intrinsically required for the application to run.', '',
     'scripts/skill-exclusions.json prevents reinstalling the 22 removed folders. docs/removed-skills.json retains their source metadata. The actual replica/ project documents and all standalone tool runtimes are retained.', '',
     '| Skill name | Folder | Recommendation | Reason |','| --- | --- | --- | --- |']
out += [f'| `{name}` | `{folder}` | {category} | {why} |' for name,folder,category,why in rows]
(ROOT/'docs/skill-audit.md').write_text('\n'.join(out)+'\n',encoding='utf-8')
print(f'Audited {len(rows)} remaining skills: {dict(counts)}.')
