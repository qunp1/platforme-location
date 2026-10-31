# The optional skills: 52 after the Hyperframes and Floorplan additions

Floorplan was added on 2026-10-29 for interactive, plain-language architecture
maps. Four Hyperframes dependency skills were also installed after Brag.
See [Floorplan details](floorplan-assessment.md).

On 2026-10-27, Brag was added for future short product launch videos. It adds a
video storyboard/render workflow rather than website animations. Rendering
setup remains separate; see [the assessment](brag-assessment.md).

On 2026-10-26, four official GSAP skills were added: gsap-core, gsap-react,
gsap-timeline and gsap-performance. These complement the existing motion design
skills with library-specific implementation guidance. See
[the comparison and installation details](animation-skills-assessment.md).

On 2026-10-25, Hallmark was added for theme-led website design and browser-based
visual linting. It overlaps strongly with Taste and partly with Impeccable;
choose one lead design workflow. See [the assessment](hallmark-assessment.md).

On 2026-10-22, four optional Founder skills were added: user-interviews (agency and
traveler interview scripts), competitor-matrix (sourced feature comparisons),
go-to-market (partner/customer acquisition plan), and metrics-dashboard (stage-specific
metrics and review cadence). See founder-skills.md for the assessment and setup.
The original 37 retained skills are described below.

These remain installed after the 2026-10-21 cleanup. Optional means useful for a
matching task, not required on every change. No extra setup is needed for plain
instruction skills. Tool-backed workflows need their runtime and, sometimes,
external credentials. They are usable through this desktop chat; the user does
not need to operate Codex CLI.

## Engineering and delivery — 9

| Skill | What it adds | When Nadorly benefits |
| --- | --- | --- |
| constraint-driven-development | Writes explicit quality requirements and guards against weakening them | Agreeing accessibility, performance and security acceptance criteria |
| context-engineering | Organizes project context and instructions for agents | When long chats or conflicting rules cause inconsistent work |
| deprecation-and-migration | Plans safe transitions away from old APIs/data structures | Changing Supabase schemas or replacing a live feature |
| doubt-driven-development | Adversarial review of assumptions and consequential decisions | Complex auth, payments or migrations; more process than routine UI work needs |
| frontend-ui-engineering | Accessible, responsive component/state implementation | Useful implementation complement to Impeccable's design work |
| git-workflow-and-versioning | Branches, atomic commits, PRs and release/version discipline | Collaborating with the team and preparing releases |
| observability-and-instrumentation | Logs, metrics, tracing and alerts | Diagnosing failed booking/payment requests after deployment |
| planning-and-task-breakdown | Orders requirements into manageable implementation tasks | Agency dashboard, availability and payment milestones |
| source-driven-development | Verifies implementation approaches against official documentation | Auth/provider integrations and version-sensitive APIs |

## Design and visual exploration — 7

| Skill | What it adds | When Nadorly benefits |
| --- | --- | --- |
| ask-sonner | Sonner React notification-library guidance | Only if we adopt Sonner; the skill does not install that dependency |
| brandkit | Generates visual identity boards and brand mockups | Optional brand exploration; overlaps with logo-design and needs image generation |
| image-to-code | Generates design-reference images, then implements them | Image-first redesign; slower and more generation-heavy than normal component work |
| imagegen-frontend-web | Generates separate image concepts for website sections | Visual brainstorming before code; produces images, not a working site |
| pick-ui-library | Helps choose a frontend library for a concrete need | Date pickers, calendars, charts and other complex components |
| prototype | Builds multiple UI options for side-by-side comparison | When the team needs to compare booking/search layouts |
| design-taste-frontend | Reference-led visual direction and browser-based design review | An alternative lead design workflow; avoid stacking its style rules with Impeccable |

## Motion and interaction — 7

| Skill | What it adds | When Nadorly benefits |
| --- | --- | --- |
| animate | Implements purposeful web animations | Filter panels, drawers, transitions and feedback |
| animation-performance | Diagnoses jank and expensive animated properties | Mobile interactions that stutter |
| animation-vocabulary | Names motion effects from a description | Explaining which effect the team wants; no implementation by itself |
| apple-design | Apple-inspired interaction/material/type principles for web UI | A deliberate style choice, not a requirement for a rental site |
| find-animation-opportunities | Proposes where motion would help | Optional polish after basic flows work |
| improve-animations | Audits existing motion and plans improvements | When enough animations exist to review together |
| review-animations | Reviews individual animation code against a craft bar | Before shipping a motion-heavy component |

## Specialist research and analysis — 3

| Skill | What it adds | Setup/status |
| --- | --- | --- |
| agent-reach | Routes web/social/video/RSS research through backend tools | Base CLI installed; most social backends and account access unconfigured; ordinary browsing already exists |
| graphify | Builds and queries a code/document dependency graph | CLI and skill installed; no project graph generated yet; useful as cross-file dependencies grow |
| reverse-engineer-anything | Investigates packaged apps/binaries and runtime behavior | REA CLI installed; no MCP registration or optional decompiler setup; unnecessary for ordinary source editing |

## Security workflows — 4

| Skill | What it adds | When Nadorly benefits |
| --- | --- | --- |
| find-security-vulnerabilities-in-code | Strix-backed source analysis and exploit validation | A scoped review of account/request/agency isolation |
| penetration-testing-with-strix | General active app/API pentest workflow | Before live launch, against authorized local/staging targets |
| fix-security-vulnerabilities-with-strix | Patches and retests findings | After a Strix report identifies issues |
| owasp-top-10-testing | Structures an assessment around vulnerability categories | A systematic security checklist/test pass |

These four overlap but represent useful stages: find, assess, fix, and category
coverage. Keep security-and-hardening as the day-to-day coding skill. Strix's CLI
is installed, but local active scans need Docker and an AI-provider configuration.
Version checks did not test security, launch a scan or verify provider readiness.

## Product research and launch — 7

| Skill | What it adds | When Nadorly benefits |
| --- | --- | --- |
| replica-brand | Naming, positioning, brand voice and leftover-brand checks | Finalizing the identity beyond the logo |
| replica-deploy | Production setup and deployment checklist | When hosting, domain and production configuration are selected |
| replica-diff | Compares implemented features/layout with a reference | Only if we adopt a defined reference or parity target |
| replica-entrepreneur | Analyzes public feedback for unmet needs and positioning | Researching renter/agency pain points using real evidence |
| replica-launch | Landing-page messaging, pricing presentation and launch assets | Preparing the partner pitch or public launch |
| replica-recon | Maps another product's screens and flows | Researching a specific service; no automatic copying |
| shipping-and-launch | General rollout, monitoring and rollback planning | Practical release-readiness complement to the Replica-specific workflow |

## My priority within the optional set

Most useful next: frontend-ui-engineering, planning-and-task-breakdown,
source-driven-development, git-workflow-and-versioning, and pick-ui-library.
Before launch: observability-and-instrumentation, shipping-and-launch and a scoped
security review. Specialist research, image-heavy exploration and motion advice
can wait until an actual task needs them.

## What CLI checks meant

A skill is instructions; a CLI is an executable tool. Installing a tool such as
Graphify is separate from copying its skill, because instructions cannot parse
the code into a graph by themselves. The desktop assistant can run the tool via
its shell capability. The user can continue working entirely in the app.

We ran --version and dependency checks. These establish that the programs start
and their Python dependencies are consistent, not that every backend or feature
works. No additional Codex CLI installation was performed for this task, and
there is no need to switch to a terminal-based Codex workflow.

Standalone tools were retained: the user requested removal of 22 skills, not
uninstallation of the four optional tool runtimes. To remove those later, scope
the request to .tools/agent-reach, .tools/graphify, .tools/rea or .tools/strix.
