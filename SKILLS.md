# Project skills

Updated on 2026-10-29: 76 project-local skills (24 core, 52 optional), including
four selected [Founder business skills](docs/founder-skills.md).
Added [Floorplan](docs/floorplan-assessment.md) for interactive architecture maps.
Added [Hallmark](docs/hallmark-assessment.md) as an optional alternate design workflow.
Added four [official GSAP animation skills](docs/animation-skills-assessment.md)
for core animation, React integration, timelines and performance.
Added [Brag](docs/brag-assessment.md) for future product launch videos.
Installed its four official Hyperframes dependencies (`hyperframes`,
`hyperframes-cli`, `hyperframes-registry`, `media-use`) from
[heygen-com/hyperframes](https://github.com/heygen-com/hyperframes).
The first local Nadorly film and portable rendering runtime live in `brag-output/`.
The user-authorized 22 removals are recorded in docs/removed-skills.json and
excluded from future installation by scripts/skill-exclusions.json.
The original collection below is supplemented by the requested Claude setup,
Agent-Reach, REA, Graphify, Addy Osmani and Strix skill components. See
[plugin installation details](docs/plugin-installation.md) and the complete
[current skill audit](docs/skill-audit.md). See [the optional skills explained](docs/optional-skills.md)
for optional skills and standalone tools, including the four Founder additions.
Current Nadorly code is React/Vite with a Node API, Supabase integration and
Playwright checks; the earlier empty-project assessment below is historical.

Installed locally under `.agents/skills`, not in the user's global skill folder.
The project was empty apart from Git when assessed on 2026-10-19. The usefulness
ratings below assume this will be a rental platform; no application stack has
been selected yet. None of these third-party skills is required to build it.

| Source | Installed | Purpose | Value for this project |
| --- | --- | --- | --- |
| [Replica](https://github.com/Jakeschincariol/replica-skill) | 11 skills | Research an existing product, plan architecture, build frontend/backend, compare features, test, brand, launch and deploy. | Useful if learning from an existing rental product. Optional; clone-specific steps are unnecessary for an original build. |
| [Emil Kowalski](https://github.com/emilkowalski/skills) | 15 skills | UI craft, animation implementation/review/performance, mobile web fixes, worst-case UI data, prototyping, library selection, Sonner, Expo and Swift. | Very helpful for booking forms, mobile search, filters and listing cards. Swift/Expo skills only matter if we choose those platforms. |
| [Impeccable](https://github.com/pbakaus/impeccable) | 1 skill with command playbooks | Design, UX critique, accessibility, responsive behavior, typography, copy, performance and production polish. | Strong general design/review choice. Overlaps with Emil and Taste. |
| [Taste](https://github.com/Leonxlnx/taste-skill) | 9 folders plus 4 migrated image skills | Art direction, reference-led frontend design, visual verification, redesign and alternate styles. The four image skills were installed from the author's [imagegen-skills](https://github.com/Leonxlnx/imagegen-skills) repository. | Helpful for branding and a distinctive landing page. Choose deliberately; do not combine competing style variants. Main invocation: `$design-taste-frontend`. |
| [Ian Xiaohei illustrations](https://github.com/tojileon/ian-xiaohei-illustrations-en) | 1 skill | Hand-drawn 16:9 explanatory article images with a recurring black character and sparse colored annotations. | Optional for blog/help content. Low priority for listing photos or core rental functionality. |
| [Playwright](https://github.com/lackeyjb/playwright-skill) | 1 skill plus scripts | Browser automation, screenshots, responsive checks and end-to-end user flows. | High value for search, sign-in, booking and account flows. The skill is optional; browser verification is valuable. Runtime setup is separate. |
| [MiroFish](https://github.com/666ghj/MiroFish) | Not installed: standalone application | Simulates interacting AI agents and produces scenario reports; requires its own backend/frontend and API services. | Low relevance to building a rental platform. Consider only if simulation becomes a specific product requirement. Simulation output is not validated demand research. |
| [Artemis](https://github.com/google/artemis) | Not installed: standalone Android automation/MCP system | Drives Android devices/emulators and collects test evidence; requires device/toolchain and model configuration. | Useful if an Android app is added. Unnecessary for a web-only platform. |
| [AIHero grill-me](https://www.aihero.dev/skills-grill-me) | `grill-me` and its `grilling` dependency from mattpocock/skills | Interviews the user to expose assumptions and clarify a feature or product decision. | Helpful early for rental type, user roles, availability, deposits, cancellations and payments. Invoke explicitly. |

## Suggested usage

Added [logo-design](https://github.com/kaankiziltug/logo-design-skill): an SVG-first
logo workflow with concept exploration, structural audits, small-size testing and
presentation tools. Installed locally at a pinned revision; available next turn.
Its workflow presents three concepts before producing a full approved identity kit.

- Start with `$grill-me` to clarify the rental product and its scope.
- Use `$impeccable` for interface planning and review, or `$design-taste-frontend`
  when a particular visual direction is needed.
- Use `$mobile-native` and `$break-ui` for practical mobile and form robustness.
- Use `$playwright-skill` to verify the implemented booking flows.
- Add animation skills only where motion helps the task. Keep legacy Taste
  variants, Swift, Expo and illustration skills for explicit requests.

These are instructions and supporting files, not application dependencies or
guarantees of correctness. Installing them does not deploy anything, connect
accounts, run simulations, generate images, or start a device automation service.
No third-party executable is run merely by installing its skill folder.

## Runtime and compatibility

- New skills should be available on the next turn. If discovery has not
  refreshed, reopen the project chat/session.
- Directory names and invocation names can differ; use each SKILL.md `name`.
- The upstream `grill-me` wrapper asks for a Claude-style Skill tool. In Codex,
  read `.agents/skills/grilling/SKILL.md` directly when `$grill-me` is requested.
- Playwright's upstream setup uses Node/npm and downloads Chromium. The copied
  skill files are installed; its npm dependencies and browser download were not
  installed or smoke-tested. Run setup when browser testing is needed.
- Impeccable includes a Windows `.cmd` launcher. Its helper may download on first
  use; it has not been activated as part of this installation.
- Taste's main scripts need Node 22+ and Chrome/Edge/Chromium; image searches need
  network access. Image-generation and Stitch variants may require capabilities
  supplied separately. Installing instructions does not supply those services.
  Image-first workflows can require several generation calls per page; use them
  explicitly when that extra time and usage are justified.
- Shell snippets written for Bash need PowerShell equivalents on this machine.
  Tool availability and user authorization always determine executable actions.

## Provenance

`skills-lock.json` records repositories, pinned revisions, source directories and
installed directories. `scripts/install-project-skills.py` uses the bundled
official skill installer and skips existing directories. It does not upgrade or
verify the contents of an existing installation; inspect before replacing one.

The full repository toolchains for MiroFish and Artemis were intentionally not
installed under the request to install skills: neither repository exposes an
installable SKILL.md package at the inspected revision.

The four original Taste migration notices are preserved in
`docs/skill-redirects`, outside automatic skill discovery. The installed
`redesign-existing-projects` entry is an upstream compatibility alias that routes
to `design-taste-frontend`.
